"use client";
import Link from "next/link";
import { useState } from "react";
import { Brain, Eye, EyeOff, ArrowRight, Sparkles, Mail, KeyRound, User, Phone, Building2 } from "lucide-react";
import { sendOtp, verifyOtp, registerUser, verifyRegisterOtp } from "@/lib/api";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      if (mode === "register") {
        await registerUser(name, email, phone, organization);
        setSuccessMsg("Verification code sent to your email!");
      } else {
        await sendOtp(email);
        setSuccessMsg("Verification code sent to your email!");
      }
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      let data;
      if (mode === "register") {
        data = await verifyRegisterOtp(email, otp);
      } else {
        data = await verifyOtp(email, otp);
      }
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("authToken", data.token);
      window.location.href = "/workspace";
    } catch (err: any) {
      setError(err.message || "Invalid or expired OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    alert("Google Authentication is not yet configured for this environment.");
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT HERO PANE */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-12 flex-col">
        {/* Pattern */}
        <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '32px 32px'}} />
        
        {/* Floating orbs */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-purple-400/30 blur-2xl" />
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-xl">Analytics AI</span>
          </Link>
        </div>
        
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-6 w-fit">
            <Sparkles className="w-3 h-3" /> Powered by Google Gemini
          </div>
          <h2 className="text-5xl font-black text-white leading-tight mb-6">
            Transform Any Dataset Into<br /><span className="text-blue-200">Intelligent Decisions</span>
          </h2>
          <p className="text-blue-100 text-lg leading-relaxed mb-12 max-w-md">
            Upload datasets, interact with AI, generate insights, analytics, predictions, and reports — all in one place.
          </p>
          
          {/* Feature highlights */}
          <div className="space-y-4">
            {["Instant AI analysis of any dataset", "Anomaly detection & trend forecasting", "Auto-generated executive reports"].map((feat) => (
              <div key={feat} className="flex items-center gap-3 text-white/90">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-sm font-medium">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating glass cards (decoration) */}
        <div className="relative z-10 mt-12">
          <div className="flex gap-3">
            {[
              { label: "Accuracy", val: "98%" },
              { label: "Datasets", val: "10M+" },
              { label: "Reports", val: "500K" },
            ].map(s => (
              <div key={s.label} className="flex-1 bg-white/10 backdrop-blur rounded-xl p-3 border border-white/20">
                <div className="text-xl font-black text-white">{s.val}</div>
                <div className="text-blue-200 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT LOGIN PANE */}
      <div className="flex-1 lg:max-w-md xl:max-w-lg flex flex-col justify-center px-8 md:px-12 py-12 bg-white">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-slate-900">Analytics AI</span>
        </div>

        <div className="max-w-sm w-full mx-auto">
          <h1 className="text-3xl font-black text-slate-900 mb-2">{mode === "login" ? "Welcome Back" : "Create Account"}</h1>
          <p className="text-slate-500 mb-8">{mode === "login" ? "Sign in to access your AI workspace" : "Register to start analyzing data"}</p>

          {/* Google Login */}
          <button onClick={handleGoogleAuth} className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-slate-200 rounded-xl text-slate-700 font-semibold text-sm hover:border-slate-300 hover:bg-slate-50 transition-all mb-6">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">or continue with email</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-xl border border-red-100">
                  {error}
                </div>
              )}
              {mode === "register" && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                      type="text" required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-slate-400" />
                  </div>
                  <input
                    type="email" required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>
              {mode === "register" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number <span className="text-slate-400 font-normal">(Optional)</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="w-5 h-5 text-slate-400" />
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Organization <span className="text-slate-400 font-normal">(Optional)</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Building2 className="w-5 h-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        value={organization}
                        onChange={e => setOrganization(e.target.value)}
                        placeholder="Company Inc."
                        className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed mt-6"
              >
                {isLoading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending Code...</>
                ) : (
                  <>Continue with Email <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-xl border border-red-100">
                  {error}
                </div>
              )}
              {successMsg && (
                <div className="p-3 bg-green-50 text-green-600 text-sm font-semibold rounded-xl border border-green-100 mb-4">
                  {successMsg}
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Verification Code</label>
                <p className="text-xs text-slate-500 mb-3">Sent to <strong>{email}</strong></p>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <KeyRound className="w-5 h-5 text-slate-400" />
                  </div>
                  <input
                    type="text" required
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white tracking-widest font-mono"
                    maxLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed mt-6"
              >
                {isLoading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verifying...</>
                ) : (
                  <>Sign In <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => { setStep(1); setOtp(""); setSuccessMsg(""); setError(""); }}
                className="w-full text-center text-sm text-slate-500 hover:text-slate-700 font-semibold mt-4"
              >
                ← Back to email
              </button>
            </form>
          )}

          <p className="text-center text-sm text-slate-500 mt-6">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button onClick={() => { setMode("register"); setError(""); setSuccessMsg(""); }} className="text-blue-600 font-semibold hover:text-blue-700">Create account →</button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={() => { setMode("login"); setError(""); setSuccessMsg(""); }} className="text-blue-600 font-semibold hover:text-blue-700">Sign in here →</button>
              </>
            )}
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-auto pt-8">
          © 2026 Analytics AI. All rights reserved.
        </p>
      </div>
    </div>
  );
}
