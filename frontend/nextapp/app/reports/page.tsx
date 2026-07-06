"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { FileText, Download, Brain, TrendingUp, AlertTriangle, Lightbulb, Plus, Clock, ChevronRight } from "lucide-react";

const reportTypes = [
  { id: "executive", label: "Executive Summary", desc: "High-level AI narrative with top findings and strategic recommendations", icon: Brain, color: "blue" },
  { id: "technical", label: "Technical Analysis", desc: "Full statistical breakdown, correlations, and model diagnostics", icon: TrendingUp, color: "purple" },
  { id: "anomaly", label: "Anomaly Report", desc: "Detailed listing of all detected outliers and suspicious patterns", icon: AlertTriangle, color: "amber" },
  { id: "predictions", label: "Predictions Report", desc: "ML model forecasts with confidence intervals for the next 6 months", icon: Lightbulb, color: "green" },
];

const recentReports = [
  { name: "Q4 Executive Summary", dataset: "Q4_User_Engagement.csv", date: "Oct 14, 2024", format: "PDF", status: "ready" },
  { name: "Anomaly Detection Log", dataset: "Server_Logs_Sep.csv", date: "Oct 12, 2024", format: "JSON", status: "ready" },
  { name: "Sales Forecast 2025", dataset: "Sales_Forecast_2025.xlsx", date: "Oct 10, 2024", format: "PDF", status: "ready" },
  { name: "Customer Segmentation", dataset: "Customer_Feedback.json", date: "Oct 08, 2024", format: "CSV", status: "processing" },
];

export default function ReportsPage() {
  const [generating, setGenerating] = useState<string | null>(null);
  const [generated, setGenerated] = useState<Record<string, boolean>>({});

  const handleGenerate = async (id: string) => {
    setGenerating(id);
    await new Promise(r => setTimeout(r, 2500));
    setGenerating(null);
    setGenerated(g => ({ ...g, [id]: true }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-14 max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-900 mb-1">Reports Dashboard</h1>
          <p className="text-slate-500 text-sm">Generate AI-powered reports from your analyzed datasets</p>
        </div>

        {/* Generate Report Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {reportTypes.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-md transition-all">
              <div className={`w-10 h-10 rounded-xl bg-${r.color}-50 flex items-center justify-center mb-3`}>
                <r.icon className={`w-5 h-5 text-${r.color}-600`} />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{r.label}</h3>
              <p className="text-sm text-slate-500 mb-4 leading-relaxed">{r.desc}</p>
              <div className="flex gap-2">
                {generated[r.id] ? (
                  <>
                    <button className="flex items-center gap-1.5 text-sm font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg">
                      <Download className="w-3.5 h-3.5" /> PDF
                    </button>
                    <button className="flex items-center gap-1.5 text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                      <Download className="w-3.5 h-3.5" /> Excel
                    </button>
                    <button className="flex items-center gap-1.5 text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                      <Download className="w-3.5 h-3.5" /> JSON
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleGenerate(r.id)}
                    disabled={generating === r.id}
                    className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg transition-all ${generating === r.id ? "bg-slate-100 text-slate-400" : "bg-slate-900 text-white hover:bg-slate-800"}`}
                  >
                    {generating === r.id ? (
                      <><div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" /> Generating...</>
                    ) : (
                      <><Plus className="w-3.5 h-3.5" /> Generate</>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Reports Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-800 flex items-center gap-2"><FileText className="w-4 h-4 text-blue-600" /> Recent Reports</h2>
            <button className="text-xs text-blue-600 font-semibold hover:text-blue-700">View All →</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-5 py-3">Report Name</th>
                <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-5 py-3">Dataset</th>
                <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-5 py-3">Date</th>
                <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-5 py-3">Format</th>
                <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map((r, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 text-sm font-semibold text-slate-800">{r.name}</td>
                  <td className="px-5 py-4 text-sm text-slate-500 font-mono text-xs">{r.dataset}</td>
                  <td className="px-5 py-4 text-sm text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> {r.date}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{r.format}</span>
                  </td>
                  <td className="px-5 py-4">
                    {r.status === "ready" ? (
                      <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✓ Ready</span>
                    ) : (
                      <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full animate-pulse-slow">Processing...</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {r.status === "ready" && (
                      <button className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
