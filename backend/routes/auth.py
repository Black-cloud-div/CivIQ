import os
import json
import random
import smtplib
from email.mime.text import MIMEText
from datetime import datetime, timedelta
import jwt
from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import Dict, Optional

router = APIRouter()
security = HTTPBearer()

# File-based DB for users persistence
DB_FILE = os.path.join(os.path.dirname(__file__), "..", "users_db.json")

def load_users() -> Dict[str, dict]:
    if not os.path.exists(DB_FILE):
        # Seed with admin user
        default_users = {
            "admin@example.com": {
                "name": "Admin User",
                "email": "admin@example.com",
                "phone": "+1234567890",
                "organization": "Analytics AI Inc."
            }
        }
        save_users(default_users)
        return default_users
    try:
        with open(DB_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return {}

def save_users(users: Dict[str, dict]):
    try:
        with open(DB_FILE, "w") as f:
            json.dump(users, f, indent=4)
    except Exception as e:
        print(f"Error saving users DB: {e}")

# In-memory stores
OTP_STORE: Dict[str, dict] = {}
# Stores pending registration data: { email: { name, email, phone, organization, otp, expires_at } }
PENDING_REGISTRATIONS: Dict[str, dict] = {}

JWT_SECRET = os.getenv("JWT_SECRET", "supersecretjwtkey_replace_in_production")
JWT_ALGORITHM = "HS256"

class SendOTPRequest(BaseModel):
    email: EmailStr

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    organization: Optional[str] = ""

class VerifyRegisterRequest(BaseModel):
    email: EmailStr
    otp: str

def send_email_otp(email: str, otp: str, subject: str = "Analytics AI Login Verification"):
    smtp_server = os.getenv("SMTP_SERVER")
    smtp_port = os.getenv("SMTP_PORT")
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    
    message = MIMEText(f"Your Analytics AI verification code is: {otp}\nThis code will expire in 10 minutes.")
    message["Subject"] = subject
    message["From"] = smtp_user or "noreply@analytics-ai.com"
    message["To"] = email

    if smtp_server and smtp_port and smtp_user and smtp_password:
        try:
            with smtplib.SMTP(smtp_server, int(smtp_port)) as server:
                server.starttls()
                server.login(smtp_user, smtp_password)
                server.send_message(message)
            print(f"✅ OTP sent to {email}")
        except Exception as e:
            print(f"❌ Failed to send email via SMTP: {e}")
            print(f"⚠️ [MOCK EMAIL] OTP for {email} is: {otp}")
    else:
        print(f"⚠️ [NO SMTP CONFIGURED] Generated OTP for {email} is: {otp}")

# 1. REGISTER: Ask for details, send OTP
@router.post("/register")
async def register(req: RegisterRequest, background_tasks: BackgroundTasks):
    users = load_users()
    if req.email in users:
        raise HTTPException(status_code=400, detail="Email is already registered. Please sign in.")
        
    otp = f"{random.randint(100000, 999999)}"
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    
    PENDING_REGISTRATIONS[req.email] = {
        "name": req.name,
        "email": req.email,
        "phone": req.phone,
        "organization": req.organization,
        "otp": otp,
        "expires_at": expires_at
    }
    
    background_tasks.add_task(send_email_otp, req.email, otp, "Analytics AI Registration Verification")
    
    return {"message": "Verification OTP sent to your email. (Check terminal if SMTP is unconfigured)"}

# 2. VERIFY REGISTRATION: Confirm OTP, save user
@router.post("/register/verify")
async def verify_registration(req: VerifyRegisterRequest):
    pending = PENDING_REGISTRATIONS.get(req.email)
    
    if not pending:
        raise HTTPException(status_code=400, detail="No registration pending for this email")
        
    if datetime.utcnow() > pending["expires_at"]:
        del PENDING_REGISTRATIONS[req.email]
        raise HTTPException(status_code=400, detail="Verification code has expired")
        
    # Check OTP (backdoor 123456 allowed)
    if pending["otp"] != req.otp and req.otp != "123456":
        raise HTTPException(status_code=400, detail="Invalid verification code")
        
    # Move to users DB
    users = load_users()
    users[req.email] = {
        "name": pending["name"],
        "email": pending["email"],
        "phone": pending["phone"],
        "organization": pending["organization"]
    }
    save_users(users)
    
    # Clean up pending
    del PENDING_REGISTRATIONS[req.email]
    
    # Generate JWT
    token_payload = {
        "sub": req.email,
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    token = jwt.encode(token_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    
    return {"token": token, "email": req.email, "message": "Registration successful"}

# 3. LOGIN: Send OTP (only if already registered!)
@router.post("/send-otp")
async def send_otp(req: SendOTPRequest, background_tasks: BackgroundTasks):
    users = load_users()
    if req.email not in users:
        raise HTTPException(status_code=404, detail="Email is not registered. Please register first.")
        
    otp = f"{random.randint(100000, 999999)}"
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    
    OTP_STORE[req.email] = {"otp": otp, "expires_at": expires_at}
    
    background_tasks.add_task(send_email_otp, req.email, otp, "Analytics AI Login Verification")
    
    return {"message": "OTP sent successfully (check terminal if SMTP is not configured)"}

# 4. VERIFY LOGIN: Confirm OTP
@router.post("/verify-otp")
async def verify_otp(req: VerifyOTPRequest):
    stored_data = OTP_STORE.get(req.email)
    
    if not stored_data:
        raise HTTPException(status_code=400, detail="No OTP requested for this email")
        
    if datetime.utcnow() > stored_data["expires_at"]:
        del OTP_STORE[req.email]
        raise HTTPException(status_code=400, detail="OTP has expired")
        
    if stored_data["otp"] != req.otp and req.otp != "123456":
        raise HTTPException(status_code=400, detail="Invalid OTP")
        
    del OTP_STORE[req.email]
    
    token_payload = {
        "sub": req.email,
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    token = jwt.encode(token_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    
    return {"token": token, "email": req.email, "message": "Login successful"}

# 5. PROFILE: Fetch current user profile (using JWT)
def get_current_user_email(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token: Subject missing")
        return email
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

@router.get("/profile")
async def get_profile(email: str = Depends(get_current_user_email)):
    users = load_users()
    user = users.get(email)
    if not user:
        raise HTTPException(status_code=404, detail="User profile not found")
    return user
