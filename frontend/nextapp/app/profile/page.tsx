"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import {
  User, Database, Brain, FileText, Activity, ShieldAlert, Award,
  Download, Calendar, TrendingUp, Sparkles, CheckCircle2, ChevronRight, Edit2, Camera
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";

const kpis = [
  { label: "Datasets Uploaded", value: "124", icon: Database, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "AI Analyses", value: "842", icon: Brain, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Reports Generated", value: "56", icon: FileText, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "AI Confidence", value: "98%", icon: Sparkles, color: "text-green-600", bg: "bg-green-50" },
  { label: "Success Rate", value: "94%", icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50" },
];

const datasetHistory = [
  { name: "Q4_User_Engagement", type: "CSV", records: "12,402", date: "Oct 12, 2024", status: "Processed" },
  { name: "Sales_Forecast_2025", type: "XLSX", records: "8,920", date: "Oct 10, 2024", status: "Processed" },
  { name: "Customer_Feedback_Raw", type: "JSON", records: "45,100", date: "Oct 08, 2024", status: "Analyzing" },
];

const timeline = [
  { action: "Trend Analysis generated", dataset: "Q4_User_Engagement", time: "10 mins ago", type: "ai", icon: Sparkles, color: "text-purple-600", bg: "bg-purple-50" },
  { action: "Dataset uploaded successfully", dataset: "Sales_Forecast_2025", time: "2 hours ago", type: "upload", icon: Database, color: "text-green-600", bg: "bg-green-50" },
  { action: "Anomaly detected in transactions", dataset: "Server_Logs_Sep", time: "Yesterday", type: "alert", icon: ShieldAlert, color: "text-amber-600", bg: "bg-amber-50" },
  { action: "Prediction model optimized", dataset: "Model v4.2", time: "Oct 12, 2024", type: "ai", icon: Brain, color: "text-blue-600", bg: "bg-blue-50" },
  { action: "Report exported via scheduled job", dataset: "Exec Summary", time: "Oct 10, 2024", type: "report", icon: FileText, color: "text-slate-600", bg: "bg-slate-50" },
];

const badges = [
  { name: "First Upload", icon: Database, desc: "Uploaded first dataset", earned: true },
  { name: "AI Power User", icon: Brain, desc: "Ran 100+ AI analyses", earned: true },
  { name: "Analytics Expert", icon: Sparkles, desc: "Created 10+ custom charts", earned: true },
  { name: "100 Reports", icon: FileText, desc: "Generated 100 reports", earned: false },
  { name: "Data Scientist", icon: Award, desc: "Configured advanced predictions", earned: true },
];

const activityData = [
  { name: "Mon", uploads: 4, queries: 12, reports: 2 },
  { name: "Tue", uploads: 6, queries: 18, reports: 3 },
  { name: "Wed", uploads: 2, queries: 10, reports: 1 },
  { name: "Thu", uploads: 8, queries: 24, reports: 6 },
  { name: "Fri", uploads: 5, queries: 16, reports: 4 },
  { name: "Sat", uploads: 1, queries: 4, reports: 0 },
  { name: "Sun", uploads: 3, queries: 8, reports: 2 },
];

const recentReports = [
  { title: "Executive Summary - Q4 Engagement", date: "Oct 14, 2024", dataset: "Q4_User_Engagement.csv", format: "PDF" },
  { title: "Anomaly Detection Log", date: "Oct 12, 2024", dataset: "Server_Logs_Sep.csv", format: "XLS" },
];

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-14 max-w-6xl mx-auto px-6 py-8">
        
        {/* TOP PROFILE SECTION */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative" />
          <div className="px-8 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 -mt-10 relative z-10">
            <div className="flex flex-col md:flex-row gap-6 items-end">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-3xl shadow-md overflow-hidden shrink-0">
                AN
              </div>
              <div className="mb-2">
                <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  Alex Newman
                  <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">Lead Analyst</span>
                </h1>
                <p className="text-slate-500 text-sm mt-1">Lead Data Scientist at Global Tech Corp</p>
                <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> alex.newman@example.com</span>
                  <span>📍 San Francisco, USA</span>
                  <span>📅 Member since Jan 2024</span>
                  <span>🟢 Last active: Just now</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mb-2">
              <button className="flex items-center gap-2 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl bg-white hover:bg-slate-50 transition-all shadow-sm">
                <Camera className="w-3.5 h-3.5" /> Upload Photo
              </button>
              <a href="/settings" className="flex items-center gap-2 bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-slate-800 transition-all shadow-md">
                <Edit2 className="w-3.5 h-3.5" /> Edit Profile
              </a>
            </div>
          </div>
        </div>

        {/* STATISTICS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {kpis.map((kpi, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500 font-semibold">{kpi.label}</span>
                <div className={`w-8 h-8 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                  <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT 2 COLUMNS */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* USAGE ANALYTICS */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2"><Activity className="w-4 h-4 text-blue-600" /> Usage Analytics</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="queries" stroke="#2563EB" fillOpacity={1} fill="url(#colorQueries)" strokeWidth={2} name="AI Queries" />
                    <Area type="monotone" dataKey="uploads" stroke="#10B981" fill="none" strokeWidth={2} name="Uploads" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* DATASET HISTORY */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Database className="w-4 h-4 text-blue-600" /> Dataset History</h2>
                <button className="text-xs text-blue-600 font-semibold hover:text-blue-700">View All</button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-5 py-3">Dataset Name</th>
                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-5 py-3">Type</th>
                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-5 py-3">Records</th>
                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-5 py-3">Upload Date</th>
                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-5 py-3">Status</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {datasetHistory.map((d, i) => (
                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 text-xs font-bold text-slate-800">{d.name}</td>
                      <td className="px-5 py-3.5 text-xs font-semibold text-slate-500">{d.type}</td>
                      <td className="px-5 py-3.5 text-xs font-semibold text-slate-500 font-mono">{d.records}</td>
                      <td className="px-5 py-3.5 text-xs text-slate-500">{d.date}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${d.status === "Processed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700 animate-pulse-slow"}`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button className="text-xs font-bold text-blue-600 hover:text-blue-700">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* RECENT REPORTS */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-blue-600" /> Recent Reports</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {recentReports.map((r, i) => (
                  <div key={i} className="border border-slate-200 rounded-xl p-4 hover:border-blue-200 transition-colors flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 mb-1">{r.title}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mb-1">{r.dataset}</p>
                      <p className="text-[10px] text-slate-400">{r.date}</p>
                    </div>
                    <button className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <Download className="w-3 h-3" /> {r.format}
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            
            {/* ACHIEVEMENTS / BADGES */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><Award className="w-4 h-4 text-blue-600" /> Achievements</h2>
              <div className="grid grid-cols-2 gap-3">
                {badges.map((b, idx) => (
                  <div key={idx} className={`p-3 border border-slate-200 rounded-xl text-center flex flex-col items-center justify-center hover:border-blue-200 transition-colors ${!b.earned ? "opacity-40" : ""}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 bg-gradient-to-br from-blue-50 to-purple-50 text-blue-600 shadow-sm`}>
                      <b.icon className="w-5 h-5" />
                    </div>
                    <div className="text-[11px] font-bold text-slate-800">{b.name}</div>
                    <div className="text-[9px] text-slate-400 mt-0.5 leading-tight">{b.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI ACTIVITY TIMELINE */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2"><Clock className="w-4 h-4 text-blue-600" /> AI Activity</h2>
              <div className="relative border-l border-slate-100 pl-4 ml-2 space-y-6">
                {timeline.map((t, i) => (
                  <div key={i} className="relative">
                    <div className={`absolute -left-[25px] top-0 w-4 h-4 rounded-full ${t.bg} border-2 border-white flex items-center justify-center shadow-sm`}>
                      <t.icon className={`w-2.5 h-2.5 ${t.color}`} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-800">{t.action}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{t.dataset}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{t.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
