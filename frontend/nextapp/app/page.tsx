"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Brain, BarChart3, FileUp, TrendingUp, Zap, Shield, ChevronRight,
  Database, Sparkles, ArrowRight, CheckCircle, Star, Play,
  LayoutDashboard, FileBarChart, Bot, Globe
} from "lucide-react";

const features = [
  { icon: FileUp, title: "Upload Any Dataset", desc: "CSV, Excel, JSON – drag and drop your data and we handle the rest.", color: "blue" },
  { icon: Brain, title: "AI-Powered Insights", desc: "Gemini AI analyzes your data and surfaces meaningful patterns instantly.", color: "purple" },
  { icon: TrendingUp, title: "Predictive Analytics", desc: "Forecast trends 6+ months ahead with machine learning models.", color: "green" },
  { icon: Zap, title: "Smart Recommendations", desc: "Get actionable business recommendations tailored to your domain.", color: "amber" },
  { icon: FileBarChart, title: "Automated Reports", desc: "Generate executive-grade reports in PDF, Excel, or JSON instantly.", color: "red" },
  { icon: Shield, title: "Anomaly Detection", desc: "Automatically flag outliers and suspicious patterns in your data.", color: "blue" },
];

const stats = [
  { value: "10M+", label: "Rows Analyzed" },
  { value: "98%", label: "AI Accuracy" },
  { value: "500+", label: "Enterprises" },
  { value: "<30s", label: "Avg Analysis Time" },
];

const domains = [
  { icon: "🏥", label: "Healthcare", desc: "Patient & clinical analytics" },
  { icon: "💰", label: "Finance", desc: "Revenue & transaction analysis" },
  { icon: "🛒", label: "Sales", desc: "Customer & sales intelligence" },
  { icon: "🚦", label: "Traffic", desc: "Flow & congestion patterns" },
  { icon: "🎓", label: "Education", desc: "Student performance insights" },
  { icon: "🔍", label: "Fraud", desc: "Anomaly & fraud detection" },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* NAVBAR */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900">Analytics AI</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#domains" className="hover:text-blue-600 transition-colors">Use Cases</a>
            <a href="#stats" className="hover:text-blue-600 transition-colors">Platform</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link href="/workspace" className="flex items-center gap-2 bg-slate-900 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-slate-800 transition-all hover:shadow-md">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
        <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, #E2E8F0 1px, transparent 0)', backgroundSize: '32px 32px'}} />
        
        {/* Floating blobs */}
        <div className="absolute pointer-events-none top-20 right-20 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-30 animate-float" />
        <div className="absolute pointer-events-none bottom-20 left-20 w-64 h-64 bg-purple-200 rounded-full blur-3xl opacity-30 animate-float" style={{animationDelay: '-2s'}} />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
            <Sparkles className="w-3 h-3" /> Powered by Google Gemini AI
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black text-slate-900 leading-tight mb-6 tracking-tight">
            Transform Any Data Into<br />
            <span className="gradient-text">Intelligent Decisions</span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload any dataset. Let AI analyze it, detect anomalies, predict trends, generate visualizations, and create professional reports — automatically.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/workspace" className="flex items-center gap-2 bg-slate-900 text-white font-bold px-8 py-4 rounded-xl text-base hover:bg-slate-800 transition-all hover:shadow-lg hover:-translate-y-0.5 w-full sm:w-auto justify-center">
              <FileUp className="w-5 h-5" /> Start Analyzing Free
            </Link>
            <Link href="/login" className="flex items-center gap-2 bg-white border-2 border-slate-200 text-slate-700 font-bold px-8 py-4 rounded-xl text-base hover:border-blue-300 hover:text-blue-700 transition-all w-full sm:w-auto justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Login With Google
            </Link>
          </div>

          {/* Preview Dashboard Card */}
          <div className="relative mx-auto max-w-4xl rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200 overflow-hidden bg-white">
            <div className="h-8 bg-slate-100 flex items-center gap-2 px-4 border-b border-slate-200">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-slate-400 font-mono">analytics-ai.app/workspace</span>
            </div>
            <div className="p-6 grid grid-cols-4 gap-3">
              {[
                { label: "Total Records", value: "124,502", color: "blue" },
                { label: "AI Confidence", value: "98%", color: "green" },
                { label: "Anomalies", value: "12", color: "amber" },
                { label: "Features", value: "34", color: "purple" },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <div className="text-xs text-slate-500 mb-1">{kpi.label}</div>
                  <div className={`text-xl font-black text-${kpi.color}-600`}>{kpi.value}</div>
                </div>
              ))}
              <div className="col-span-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-3 border border-blue-100 h-28 flex items-center justify-center">
                <div className="flex items-end gap-1 h-16">
                  {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 100].map((h, i) => (
                    <div key={i} className="w-4 bg-gradient-to-t from-blue-500 to-purple-500 rounded-sm opacity-80 transition-all" style={{height: `${h}%`}} />
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100 h-28 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-black text-green-600">98%</div>
                  <div className="text-xs text-green-500 font-semibold">AI Score</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section id="stats" className="py-16 px-6 border-y border-slate-100 bg-slate-50">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-4xl font-black gradient-text mb-1">{s.value}</div>
              <div className="text-sm text-slate-500 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Everything you need to <span className="gradient-text">understand your data</span></h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">From raw CSV to executive insights in under 30 seconds.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                <div className={`w-12 h-12 rounded-xl bg-${f.color}-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-6 h-6 text-${f.color}-600`} />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="py-24 px-6 bg-slate-900">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">How it works</h2>
          <p className="text-slate-400 mb-16">Three steps from data to decisions</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Upload Dataset", desc: "Drag & drop your CSV, Excel, or JSON file. We auto-detect the format and domain.", icon: FileUp },
              { step: "02", title: "AI Analyzes", desc: "Gemini AI + statistical models clean, analyze, and find patterns in seconds.", icon: Brain },
              { step: "03", title: "Get Insights", desc: "Receive charts, predictions, anomalies, recommendations, and reports instantly.", icon: Sparkles },
            ].map((step) => (
              <div key={step.step} className="text-left p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                <div className="text-5xl font-black text-white/10 mb-3">{step.step}</div>
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3">
                  <step.icon className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOMAINS */}
      <section id="domains" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Built for every <span className="gradient-text">industry</span></h2>
            <p className="text-lg text-slate-500">Domain-aware AI that speaks your data&apos;s language.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {domains.map((d) => (
              <div key={d.label} className="flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all cursor-default">
                <span className="text-3xl">{d.icon}</span>
                <div>
                  <div className="font-bold text-slate-900">{d.label}</div>
                  <div className="text-xs text-slate-500">{d.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">Ready to unlock your data?</h2>
          <p className="text-blue-100 text-lg mb-8">Join 500+ companies making smarter decisions with Analytics AI.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/workspace" className="bg-white text-blue-700 font-bold px-8 py-4 rounded-xl text-base hover:bg-blue-50 transition-all inline-flex items-center gap-2 justify-center">
              <FileUp className="w-5 h-5" /> Start Analyzing Free
            </Link>
            <Link href="/login" className="border-2 border-white/40 text-white font-bold px-8 py-4 rounded-xl text-base hover:bg-white/10 transition-all inline-flex items-center gap-2 justify-center">
              <Play className="w-5 h-5" /> Watch Demo
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6 border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-700 font-bold">
            <Brain className="w-5 h-5 text-blue-600" /> Analytics AI
          </div>
          <div className="text-sm text-slate-400">© 2026 Analytics AI. All rights reserved.</div>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
