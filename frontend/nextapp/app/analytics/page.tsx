"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { getDataset, getInsights } from "@/lib/api";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from "recharts";
import {
  LayoutDashboard, TrendingUp, BarChart3, Globe, Users, Tag, Download,
  Calendar, Zap, AlertTriangle, Brain, RefreshCw, ChevronRight, Loader2, FileText
} from "lucide-react";

const COLORS = ["#2563EB", "#7C3AED", "#10B981", "#F59E0B", "#EF4444", "#06B6D4"];

// ── Sample/demo data ───────────────────────────────────────────────────────
const defaultKpis = [
  { label: "Total Records", value: "124,502", change: "+12%", color: "blue" },
  { label: "Total Features", value: "34", change: "7 numeric", color: "purple" },
  { label: "Missing Values", value: "1,204", change: "0.96%", color: "amber" },
  { label: "AI Confidence", value: "98%", change: "High", color: "green" },
  { label: "Anomalies", value: "142", change: "0.11%", color: "red" },
];

const trendData = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  value: Math.floor(Math.random() * 4000) + 3000,
  forecast: Math.floor(Math.random() * 4000) + 3500,
}));

const distData = [
  { name: "Category A", value: 35 }, { name: "Category B", value: 25 },
  { name: "Category C", value: 20 }, { name: "Category D", value: 12 },
  { name: "Other", value: 8 },
];

const barData = Array.from({ length: 8 }, (_, i) => ({
  name: `Col ${i+1}`, count: Math.floor(Math.random() * 1000) + 200,
}));

const areaData = Array.from({ length: 20 }, (_, i) => ({
  x: i + 1,
  a: Math.floor(Math.random() * 3000) + 1000,
  b: Math.floor(Math.random() * 2000) + 500,
}));

const scatterData = Array.from({ length: 40 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
}));

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "trend", label: "Trend Analysis", icon: TrendingUp },
  { id: "distribution", label: "Distribution", icon: BarChart3 },
  { id: "region", label: "By Region", icon: Globe },
  { id: "user", label: "By User Type", icon: Users },
  { id: "category", label: "By Category", icon: Tag },
  { id: "export", label: "Export Reports", icon: Download },
];

function Card({ title, icon: Icon, children, className = "" }: any) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-blue-600" />} {title}
        </h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dataset, setDataset] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const id = localStorage.getItem("activeDatasetId");
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const d = await getDataset(id);
        setDataset(d);
        if (d.type !== "unstructured") {
          const ins = await getInsights(id);
          setInsights(ins);
        } else {
          setInsights(d.summary); // For unstructured docs, summary has insights
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const dynamicKpis = dataset ? (
    dataset.type === "unstructured" ? [
      { label: "Document Type", value: dataset.domain, change: "", color: "blue" },
      { label: "Key Findings", value: (dataset.summary?.key_findings?.length || 0).toString(), change: "", color: "purple" },
      { label: "Anomalies", value: (dataset.summary?.anomalies?.length || 0).toString(), change: "", color: "amber" },
      { label: "Recommendations", value: (dataset.summary?.recommendations?.length || 0).toString(), change: "", color: "green" },
      { label: "AI Status", value: "Analyzed", change: "100%", color: "blue" },
    ] : [
      { label: "Total Records", value: dataset.summary.rows?.toLocaleString() || "0", change: "", color: "blue" },
      { label: "Total Features", value: dataset.summary.columns?.toString() || "0", change: `${dataset.summary.numeric_columns?.length || 0} numeric`, color: "purple" },
      { label: "Missing Values", value: dataset.summary.total_missing?.toString() || "0", change: `${dataset.summary.missing_pct_overall}%`, color: "amber" },
      { label: "AI Confidence", value: insights?.confidence_score ? `${insights.confidence_score}%` : "95%", change: "High", color: "green" },
      { label: "Anomalies", value: dataset.outliers?.count?.toString() || "0", change: "", color: "red" },
    ]
  ) : defaultKpis;

  const executiveSummary = insights?.executive_summary || "No active dataset found. Go to Workspace to upload a dataset or view this demo data.";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-14 flex">
        
        {/* Tab Sidebar */}
        <aside className="w-52 bg-white border-r border-slate-200 min-h-[calc(100vh-56px)] p-3 shrink-0">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 mt-2">Analytics</div>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all mb-1 ${activeTab === tab.id ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto min-h-[calc(100vh-56px)]">
          
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fade-up">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Analytics Dashboard</h1>
                <p className="text-slate-500 text-sm mt-1">AI-powered overview of your dataset</p>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-5 gap-4">
                {dynamicKpis.map((k: any) => (
                  <div key={k.label} className={`bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all`}>
                    <div className="text-xs text-slate-500 mb-1 font-semibold">{k.label}</div>
                    <div className={`text-2xl font-black text-${k.color}-600 mb-1`}>{k.value}</div>
                    <div className={`text-xs font-semibold text-${k.color}-500`}>{k.change}</div>
                  </div>
                ))}
              </div>

              {/* AI Summary */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-2">
                  {dataset?.type === 'unstructured' ? <FileText className="w-5 h-5" /> : <Brain className="w-5 h-5" />}
                  <span className="font-bold text-sm">AI Executive Summary {dataset && `- ${dataset.filename}`}</span>
                  <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">{insights?.confidence_score || 98}% confidence</span>
                </div>
                <p className="text-blue-100 text-sm leading-relaxed">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : executiveSummary}
                </p>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Card title="Overview Trend" icon={TrendingUp}>
                    <ResponsiveContainer width="100%" height={240}>
                      <AreaChart data={trendData}>
                        <defs>
                          <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="value" stroke="#2563EB" fill="url(#gradBlue)" strokeWidth={2} name="Actual" />
                        <Area type="monotone" dataKey="forecast" stroke="#7C3AED" fill="none" strokeWidth={2} strokeDasharray="4 4" name="Forecast" />
                        <Legend />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Card>
                </div>
                <Card title="Distribution" icon={BarChart3}>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie data={distData} innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                        {distData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                      <Legend iconType="circle" iconSize={8} />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* Bar + Scatter */}
              <div className="grid grid-cols-2 gap-4">
                <Card title="Top Categories" icon={Tag}>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={barData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis type="number" tick={{ fontSize: 10 }} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={40} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#2563EB" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
                <Card title="Scatter Analysis" icon={AlertTriangle}>
                  <ResponsiveContainer width="100%" height={200}>
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="x" tick={{ fontSize: 10 }} name="Feature X" />
                      <YAxis dataKey="y" tick={{ fontSize: 10 }} name="Feature Y" />
                      <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                      <Scatter data={scatterData} fill="#7C3AED" fillOpacity={0.7} />
                    </ScatterChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "trend" && (
            <div className="space-y-6 animate-fade-up">
              <h1 className="text-2xl font-black text-slate-900">Trend Analysis</h1>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Trend Direction", value: "↑ Upward", color: "green" },
                  { label: "R² Score", value: "0.87", color: "blue" },
                  { label: "Growth Rate", value: "+23%", color: "purple" },
                  { label: "Seasonality", value: "Detected", color: "amber" },
                ].map(k => (
                  <div key={k.label} className={`bg-white rounded-2xl border border-slate-200 p-4`}>
                    <div className="text-xs text-slate-500 mb-1 font-semibold">{k.label}</div>
                    <div className={`text-xl font-black text-${k.color}-600`}>{k.value}</div>
                  </div>
                ))}
              </div>
              <Card title="Time Series with Forecast" icon={TrendingUp}>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 4 }} name="Actual" />
                    <Line type="monotone" dataKey="forecast" stroke="#7C3AED" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Forecast" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
              <div className="grid grid-cols-2 gap-4">
                <Card title="Seasonal Analysis" icon={Calendar}>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
                <Card title="Growth Analysis" icon={TrendingUp}>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={areaData.slice(0, 12)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="x" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="a" stroke="#F59E0B" fill="#FFFBEB" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "distribution" && (
            <div className="space-y-6 animate-fade-up">
              <h1 className="text-2xl font-black text-slate-900">Distribution Analysis</h1>
              <div className="grid grid-cols-2 gap-4">
                <Card title="Histogram" icon={BarChart3}>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
                <Card title="Frequency Distribution" icon={BarChart3}>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={areaData}>
                      <defs>
                        <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="x" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="b" stroke="#10B981" fill="url(#gradGreen)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </div>
          )}

          {(activeTab === "region" || activeTab === "user" || activeTab === "category") && (
            <div className="space-y-6 animate-fade-up">
              <h1 className="text-2xl font-black text-slate-900">
                {activeTab === "region" ? "Regional Analysis" : activeTab === "user" ? "User Type Analysis" : "Category Analysis"}
              </h1>
              <div className="grid grid-cols-2 gap-4">
                <Card title="Performance Breakdown" icon={BarChart3}>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill={activeTab === "region" ? "#2563EB" : activeTab === "user" ? "#7C3AED" : "#10B981"} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
                <Card title="Share Distribution" icon={Tag}>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={distData} cx="50%" cy="50%" outerRadius={95} dataKey="value" paddingAngle={3}>
                        {distData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                      <Legend iconType="circle" iconSize={8} />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </div>
              <Card title="Trend Over Time" icon={TrendingUp}>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#2563EB" fill="#EFF6FF" strokeWidth={2} />
                    <Area type="monotone" dataKey="forecast" stroke="#7C3AED" fill="#F5F3FF" strokeWidth={2} strokeDasharray="4 4" />
                    <Legend />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </div>
          )}

          {activeTab === "export" && (
            <div className="space-y-6 animate-fade-up">
              <h1 className="text-2xl font-black text-slate-900">Export Reports</h1>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: "Executive Summary", desc: "AI-generated executive report with key findings and recommendations", format: "PDF" },
                  { title: "Full Analytics Report", desc: "Complete statistical analysis with all charts and data tables", format: "PDF" },
                  { title: "Raw Data Export", desc: "Cleaned and processed dataset ready for downstream analysis", format: "CSV" },
                  { title: "Predictions Export", desc: "ML model forecasts and confidence intervals", format: "JSON" },
                ].map(r => (
                  <div key={r.title} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-slate-800">{r.title}</h3>
                      <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded">{r.format}</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">{r.desc}</p>
                    <button className="flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800 transition-colors">
                      <Download className="w-4 h-4" /> Download {r.format}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
