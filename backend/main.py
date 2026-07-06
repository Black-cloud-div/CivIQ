"""
Analytics AI - FastAPI Backend
Main application entry point
"""
import os
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv

limiter = Limiter(key_func=get_remote_address)

load_dotenv()

from routes import datasets, analysis, ai_chat, reports, auth

app = FastAPI(
    title="Analytics AI",
    description="AI-powered Data Intelligence Platform API",
    version="1.0.0",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# CORS - allow Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://*.vercel.app",
        os.getenv("FRONTEND_URL", "https://your-frontend-url.onrender.com")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(datasets.router, prefix="/api/datasets", tags=["Datasets"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["Analysis"])
app.include_router(ai_chat.router, prefix="/api/ai", tags=["AI Chat"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])


@app.get("/")
@limiter.limit("5/minute")
async def root(request: Request):
    return {"status": "ok", "message": "Analytics AI API is running"}


@app.get("/health")
@limiter.limit("10/minute")
async def health(request: Request):
    return {"status": "healthy", "version": "1.0.0"}
