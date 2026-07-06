"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { getProfile } from "@/lib/api";
import { Settings, User, Bell, Shield, Brain, Database, Palette, Plug, CreditCard, Info, Check } from "lucide-react";

const sections = [
  { id: "general", label: "General", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "ai", label: "AI Preferences", icon: Brain },
  { id: "dataset", label: "Dataset Settings", icon: Database },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "integrations", label: "Connected Services", icon: Plug },
  { id: "billing", label: "Billing & Usage", icon: CreditCard },
  { id: "system", label: "System Info", icon: Info },
];

function Toggle({ checked = false }: { checked?: boolean }) {
  const [on, setOn] = useState(checked);
  return (
    <button onClick={() => setOn(v => !v)} className={`relative inline-flex w-10 h-6 rounded-full transition-colors ${on ? "bg-blue-600" : "bg-slate-300"}`}>
      <span className={`inline-block w-4 h-4 bg-white rounded-full shadow transition-transform mt-1 ${on ? "translate-x-5" : "translate-x-1"}`} />
    </button>
  );
}

function ToggleRow({ label, desc, checked }: { label: string; desc: string; checked?: boolean }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
      <div>
        <div className="text-sm font-semibold text-slate-800">{label}</div>
        <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
      </div>
      <Toggle checked={checked} />
    </div>
  );
}

function InputField({ label, value, type = "text" }: { label: string; value: string; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-600 mb-1.5">{label}</label>
      <input defaultValue={value} type={type}
        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
    </div>
  );
}

function SelectField({ label, options, def }: { label: string; options: string[]; def: string }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-600 mb-1.5">{label}</label>
      <select defaultValue={def} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all">
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

export default function SettingsPage() {
  const [active, setActive] = useState("general");
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState<any>({});

  useEffect(() => {
    getProfile()
      .then(data => setProfile(data))
      .catch(err => console.error("Could not fetch profile:", err));
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-14 flex">
        {/* Sidebar */}
        <aside className="w-52 bg-white border-r border-slate-200 min-h-[calc(100vh-56px)] p-3 shrink-0">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 mt-2">Settings</div>
          {sections.map(s => (
            <button key={s.id} onClick={() => setActive(s.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all mb-1 ${active === s.id ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}>
              <s.icon className="w-4 h-4" /> {s.label}
            </button>
          ))}
        </aside>

        <main className="flex-1 p-6 max-w-2xl">
          {active === "general" && (
            <div className="space-y-6 animate-fade-up">
              <h1 className="text-2xl font-black text-slate-900">General Settings</h1>
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <h2 className="font-bold text-slate-700 mb-4 text-sm">Profile Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Full Name" value={profile.name || ""} />
                  <InputField label="Email Address" value={profile.email || ""} type="email" />
                  <InputField label="Phone Number" value={profile.phone || ""} />
                  <InputField label="Organization" value={profile.organization || ""} />
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <h2 className="font-bold text-slate-700 mb-4 text-sm">Localization</h2>
                <div className="grid grid-cols-2 gap-4">
                  <SelectField label="Country" options={["United States", "United Kingdom", "Canada", "India"]} def="United States" />
                  <SelectField label="Language" options={["English (US)", "Spanish", "French", "Hindi"]} def="English (US)" />
                  <SelectField label="Timezone" options={["Pacific Time UTC-8", "Eastern Time UTC-5", "GMT UTC+0", "IST UTC+5:30"]} def="Pacific Time UTC-8" />
                  <SelectField label="Date Format" options={["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]} def="MM/DD/YYYY" />
                </div>
              </div>
              <button onClick={handleSave} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${saved ? "bg-green-600 text-white" : "bg-slate-900 text-white hover:bg-slate-800"}`}>
                {saved ? <><Check className="w-4 h-4" /> Saved!</> : "Save Changes"}
              </button>
            </div>
          )}

          {active === "notifications" && (
            <div className="space-y-6 animate-fade-up">
              <h1 className="text-2xl font-black text-slate-900">Notification Settings</h1>
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <ToggleRow label="Email Notifications" desc="Daily summaries and critical alerts via email" checked={true} />
                <ToggleRow label="Push Notifications" desc="Real-time browser alerts" checked={true} />
                <ToggleRow label="AI Alerts" desc="Notify when AI detects significant anomalies" checked={true} />
                <ToggleRow label="Weekly Reports" desc="Automated weekly intelligence digest" checked={true} />
                <ToggleRow label="Monthly Reports" desc="Automated monthly executive summary" checked={false} />
                <ToggleRow label="Security Alerts" desc="New logins from unrecognized devices" checked={true} />
                <ToggleRow label="Dataset Processing Alerts" desc="Notify when large datasets finish processing" checked={true} />
              </div>
            </div>
          )}

          {active === "security" && (
            <div className="space-y-6 animate-fade-up">
              <h1 className="text-2xl font-black text-slate-900">Security Settings</h1>
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <h2 className="font-bold text-slate-700 mb-4 text-sm">Change Password</h2>
                <div className="space-y-3">
                  <InputField label="Current Password" value="" type="password" />
                  <InputField label="New Password" value="" type="password" />
                  <InputField label="Confirm Password" value="" type="password" />
                </div>
                <button className="mt-4 bg-slate-900 text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-colors">Update Password</button>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <ToggleRow label="Two-Factor Authentication" desc="Add extra security to your account" checked={false} />
                <div className="pt-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-800">Active Sessions</div>
                    <div className="text-xs text-slate-500">Windows 11 · Chrome · San Francisco, USA · Active Now</div>
                  </div>
                  <button className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-lg">Logout All</button>
                </div>
              </div>
            </div>
          )}

          {active === "ai" && (
            <div className="space-y-6 animate-fade-up">
              <h1 className="text-2xl font-black text-slate-900">AI Preferences</h1>
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <SelectField label="Primary AI Model" options={["Gemini 1.5 Pro", "GPT-4o", "Claude 3.5 Sonnet"]} def="Gemini 1.5 Pro" />
                  <SelectField label="Analysis Mode" options={["Fast", "Standard", "Advanced"]} def="Standard" />
                  <SelectField label="Prediction Mode" options={["Balanced", "Accurate", "High Performance"]} def="Balanced" />
                </div>
                <ToggleRow label="Auto Insights" desc="Auto-generate insights on dataset upload" checked={true} />
                <ToggleRow label="Auto Recommendations" desc="Suggest business actions based on data trends" checked={true} />
                <ToggleRow label="Auto Reports" desc="Generate draft reports after analysis" checked={false} />
                <ToggleRow label="Auto Visualizations" desc="Create default charts for every numeric column" checked={true} />
              </div>
            </div>
          )}

          {active === "dataset" && (
            <div className="space-y-6 animate-fade-up">
              <h1 className="text-2xl font-black text-slate-900">Dataset Settings</h1>
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <SelectField label="Default Format" options={["Auto-detect", "CSV", "JSON", "Excel"]} def="Auto-detect" />
                  <SelectField label="Export Format" options={["PDF", "PowerPoint", "HTML", "CSV"]} def="PDF" />
                  <SelectField label="Missing Values" options={["Mean Imputation", "Drop Rows", "Flag as Anomaly"]} def="Mean Imputation" />
                </div>
                <ToggleRow label="Auto Data Cleaning" desc="Standardize dates, fix encodings, trim whitespace" checked={true} />
                <ToggleRow label="Duplicate Removal" desc="Auto-drop exact duplicate rows on upload" checked={true} />
              </div>
            </div>
          )}

          {active === "appearance" && (
            <div className="space-y-6 animate-fade-up">
              <h1 className="text-2xl font-black text-slate-900">Appearance</h1>
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <SelectField label="Theme" options={["Light Mode", "Dark Mode (Soon)"]} def="Light Mode" />
                  <SelectField label="Density" options={["Compact", "Comfortable"]} def="Comfortable" />
                  <SelectField label="Chart Style" options={["Modern (Rounded)", "Professional (Sharp)"]} def="Modern (Rounded)" />
                </div>
                <ToggleRow label="Enable Animations" desc="Smooth transitions and hover effects" checked={true} />
              </div>
            </div>
          )}

          {active === "integrations" && (
            <div className="space-y-6 animate-fade-up">
              <h1 className="text-2xl font-black text-slate-900">Connected Services</h1>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "Google Drive", icon: "📁", connected: true },
                  { name: "Google Sheets", icon: "📊", connected: true },
                  { name: "BigQuery", icon: "🗄️", connected: false },
                  { name: "Firebase", icon: "🔥", connected: false },
                  { name: "GitHub", icon: "💻", connected: false },
                  { name: "Google Cloud Storage", icon: "☁️", connected: false },
                ].map(s => (
                  <div key={s.name} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between hover:border-blue-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{s.icon}</span>
                      <div>
                        <div className="text-sm font-semibold text-slate-800">{s.name}</div>
                        <div className={`text-xs font-semibold ${s.connected ? "text-green-600" : "text-slate-400"}`}>{s.connected ? "Connected" : "Not connected"}</div>
                      </div>
                    </div>
                    <button className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${s.connected ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
                      {s.connected ? "Disconnect" : "Connect"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {active === "billing" && (
            <div className="space-y-6 animate-fade-up">
              <h1 className="text-2xl font-black text-slate-900">Billing & Usage</h1>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Current Plan", value: "Enterprise", sub: "$499/month", color: "blue" },
                  { label: "Storage Used", value: "42.5 GB", sub: "of 100 GB", color: "green" },
                  { label: "API Requests", value: "1.2M", sub: "of 5M limit", color: "purple" },
                ].map(c => (
                  <div key={c.label} className="bg-white border border-slate-200 rounded-2xl p-4">
                    <div className="text-xs text-slate-500 mb-1 font-semibold">{c.label}</div>
                    <div className={`text-xl font-black text-${c.color}-600`}>{c.value}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{c.sub}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <p className="text-sm text-slate-600 mb-4">Next billing cycle: <b>Aug 1, 2026</b>. You have <b>3.8M</b> remaining API credits.</p>
                <div className="flex gap-3">
                  <button onClick={() => alert("Redirecting to Stripe checkout for plan upgrade...")} className="bg-slate-900 text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-colors">Upgrade Plan</button>
                  <button onClick={() => alert("Invoice successfully downloaded to your device.")} className="border border-slate-200 text-slate-700 text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">Download Invoice</button>
                  <button onClick={() => alert("Opening your detailed billing history...")} className="border border-slate-200 text-slate-700 text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">Billing History</button>
                </div>
              </div>
            </div>
          )}

          {active === "system" && (
            <div className="space-y-6 animate-fade-up">
              <h1 className="text-2xl font-black text-slate-900">System Information</h1>
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                {[
                  { label: "Platform Version", value: "v4.2.1-prod" },
                  { label: "API Version", value: "v2.0.4" },
                  { label: "Last Update", value: "Oct 12, 2024 14:02 UTC" },
                  { label: "Server Status", value: "Operational (99.99%)", green: true },
                  { label: "Storage Region", value: "US-Central1 (Google Cloud)" },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                    <span className="text-sm text-slate-500">{r.label}</span>
                    <span className={`text-sm font-bold font-mono ${r.green ? "text-green-600" : "text-slate-800"}`}>{r.value}</span>
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
