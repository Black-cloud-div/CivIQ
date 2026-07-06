"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import {
  Upload, Brain, Sparkles, Send, FileUp, Database, BarChart2,
  TrendingUp, AlertTriangle, Lightbulb, FileText, CheckCircle,
  ChevronDown, X, Loader2, Table
} from "lucide-react";
import { uploadDataset, getInsights, chatWithData } from "@/lib/api";

interface Message { role: "user" | "ai"; content: string; }

const SUGGESTED_PROMPTS = [
  "Analyze this dataset and give me key insights",
  "Detect anomalies and outliers in the data",
  "What are the main trends?",
  "Predict future values for the next 6 months",
  "Which factors influence the outcome most?",
  "Generate a business recommendation report",
];

export default function WorkspacePage() {
  const [dataset, setDataset] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const chatEnd = useRef<HTMLDivElement>(null);

  // Auth check
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (isLoggedIn !== "true") {
        window.location.href = "/login";
      }
    }
  }, []);

  const handleFile = useCallback(async (file: File) => {
    // Check analysis limit
    if (typeof window !== "undefined") {
      const count = parseInt(localStorage.getItem("analyzeCount") || "0");
      if (count >= 2) {
        alert("Free analysis limit reached (2/2). Please upgrade your plan in settings to continue.");
        return;
      }
      localStorage.setItem("analyzeCount", (count + 1).toString());
    }

    setError(""); setUploading(true);
    setMessages([{ role: "ai", content: `📊 Processing **${file.name}**... Please wait while I analyze your data.` }]);
    try {
      const data = await uploadDataset(file);
      setDataset(data);
      
      // Save dataset ID for other pages (like Analytics)
      if (typeof window !== 'undefined' && data.dataset_id) {
        localStorage.setItem('activeDatasetId', data.dataset_id);
      }

      if (data.type === "unstructured") {
        // Unstructured document flow
        const summary = data.summary;
        setInsights(summary);
        setMessages(m => [...m, { role: "ai", content: `✅ Document **${file.name}** analyzed successfully!\n\n📄 **Type:** ${summary.document_type}\n\n📝 **Summary:** ${summary.executive_summary}\n\n*Ask me anything about this document using the chat below.*` }]);
      } else {
        // Tabular dataset flow
        setMessages(m => [...m, { role: "ai", content: `✅ Dataset **${file.name}** processed successfully!\n\n📋 **${data.summary.rows?.toLocaleString()}** rows · **${data.summary.columns}** columns · Domain: **${data.domain}**\n\nNow fetching AI insights...` }]);
        setLoadingInsights(true);
        const ins = await getInsights(data.dataset_id);
        setInsights(ins);
        setMessages(m => [...m, { role: "ai", content: `🧠 **AI Analysis Complete!**\n\n${ins.executive_summary}\n\n*Ask me anything about your data using the chat below.*` }]);
      }
    } catch (e: any) {
      setError(e.message || "Upload failed");
      setMessages(m => [...m, { role: "ai", content: `❌ Error processing file: ${e.message}` }]);
    } finally {
      setUploading(false); setLoadingInsights(false);
    }
  }, []);

  const sendMessage = async (text?: string) => {
    const q = text || input.trim();
    if (!q || !dataset) return;
    setInput("");
    setMessages(m => [...m, { role: "user", content: q }]);
    setChatLoading(true);
    try {
      const res = await chatWithData(dataset.dataset_id, q);
      setMessages(m => [...m, { role: "ai", content: res.answer }]);
    } catch (e: any) {
      setMessages(m => [...m, { role: "ai", content: `Sorry, I encountered an error: ${e.message}` }]);
    } finally {
      setChatLoading(false);
      setTimeout(() => chatEnd.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-14 flex h-screen overflow-hidden">
        
        {/* LEFT PANEL */}
        <aside className="w-72 bg-white border-r border-slate-200 flex flex-col overflow-y-auto shrink-0">
          {/* Upload Zone */}
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Dataset</h2>
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
              onClick={() => fileInput.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${dragging ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"}`}
            >
              <input ref={fileInput} type="file" accept=".csv,.xlsx,.xls,.json,.pdf,.png,.jpg,.jpeg,.txt" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              {uploading ? (
                <><Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" /><p className="text-xs text-blue-600 font-semibold">Processing...</p></>
              ) : (
                <><FileUp className="w-8 h-8 text-slate-400 mx-auto mb-2" /><p className="text-xs font-semibold text-slate-600">Drop CSV / PDF / Image / Text</p><p className="text-xs text-slate-400 mt-1">or click to browse</p></>
              )}
            </div>
            {error && <p className="text-xs text-red-500 mt-2 bg-red-50 p-2 rounded-lg">{error}</p>}
          </div>

          {/* Dataset Stats - Tabular */}
          {dataset && dataset.type !== "unstructured" && (
            <div className="p-4 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> Summary</h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Rows", value: dataset.summary.rows?.toLocaleString() },
                  { label: "Columns", value: dataset.summary.columns },
                  { label: "Missing", value: dataset.summary.total_missing },
                  { label: "Domain", value: dataset.domain },
                ].map(s => (
                  <div key={s.label} className="bg-slate-50 rounded-lg p-2.5">
                    <div className="text-xs text-slate-400 mb-0.5">{s.label}</div>
                    <div className="text-sm font-bold text-slate-800 truncate capitalize">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Document Summary - Unstructured */}
          {dataset && dataset.type === "unstructured" && (
            <div className="p-4 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Document Analysis</h2>
              <div className="bg-slate-50 rounded-lg p-3 mb-3">
                <div className="text-xs text-slate-400 mb-1">Type</div>
                <div className="text-sm font-bold text-slate-800 capitalize">{dataset.summary.document_type}</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 mb-3">
                <div className="text-xs text-slate-400 mb-1">Summary</div>
                <div className="text-xs text-slate-700 leading-relaxed">{dataset.summary.executive_summary}</div>
              </div>
              {dataset.summary.key_findings?.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Lightbulb className="w-3.5 h-3.5" /> Key Findings</div>
                  <div className="space-y-1">
                    {dataset.summary.key_findings.map((f: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-600 bg-green-50 p-2 rounded-lg">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {dataset.summary.anomalies?.length > 0 && dataset.summary.anomalies[0] !== "None detected" && (
                <div className="mb-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Anomalies</div>
                  <div className="space-y-1">
                    {dataset.summary.anomalies.map((a: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-600 bg-amber-50 p-2 rounded-lg">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                        <span>{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {dataset.summary.recommendations?.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Recommendations</div>
                  <div className="space-y-1">
                    {dataset.summary.recommendations.map((r: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-600 bg-blue-50 p-2 rounded-lg">
                        <Sparkles className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Columns - Tabular only */}
          {dataset && dataset.type !== "unstructured" && (
            <div className="p-4 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Table className="w-3.5 h-3.5" /> Columns</h2>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {dataset.summary.columns_info?.slice(0, 12).map((col: any) => (
                  <div key={col.name} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-50 text-xs">
                    <span className="font-medium text-slate-700 truncate flex-1">{col.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ml-2 ${col.dtype.includes('int') || col.dtype.includes('float') ? 'bg-blue-100 text-blue-600' : col.dtype.includes('datetime') ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                      {col.dtype.split('64')[0].split('32')[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preview - Tabular only */}
          {dataset?.preview?.length > 0 && (
            <div className="p-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Preview (first 5)</h2>
              <div className="text-xs text-slate-600 space-y-1 overflow-x-auto">
                <div className="font-mono whitespace-pre-wrap text-xs bg-slate-50 p-2 rounded-lg">
                  {JSON.stringify(dataset.preview[0], null, 2).slice(0, 400)}...
                </div>
              </div>
            </div>
          )}

          {/* Text Preview - Unstructured */}
          {dataset?.type === "unstructured" && dataset.summary.extracted_text_preview && (
            <div className="p-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Extracted Preview</h2>
              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg leading-relaxed whitespace-pre-wrap">
                {dataset.summary.extracted_text_preview}
              </div>
            </div>
          )}
        </aside>

        {/* CENTER: CHAT */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-4 shadow-lg">
                  <Brain className="w-9 h-9 text-white" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-2">AI Data Intelligence</h2>
                <p className="text-slate-500 mb-8 max-w-sm">Upload a dataset on the left, then ask me anything about your data.</p>
                <div className="grid grid-cols-2 gap-2 max-w-lg w-full">
                  {SUGGESTED_PROMPTS.slice(0, 4).map(p => (
                    <button key={p} disabled={!dataset} onClick={() => sendMessage(p)}
                      className="text-left p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 hover:border-blue-300 hover:text-blue-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${m.role === "ai" ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white" : "bg-slate-800 text-white"}`}>
                  {m.role === "ai" ? <Brain className="w-4 h-4" /> : "AN"}
                </div>
                <div className={`max-w-2xl rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${m.role === "ai" ? "bg-white border border-slate-200 text-slate-700" : "bg-slate-900 text-white"}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shrink-0">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                  <span className="text-sm text-slate-500">Analyzing your data...</span>
                </div>
              </div>
            )}
            <div ref={chatEnd} />
          </div>

          {/* Suggested prompts (when dataset loaded) */}
          {dataset && messages.length > 0 && (
            <div className="px-6 pb-2 flex gap-2 overflow-x-auto">
              {SUGGESTED_PROMPTS.map(p => (
                <button key={p} onClick={() => sendMessage(p)}
                  className="shrink-0 text-xs font-medium px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full hover:bg-blue-100 transition-colors">
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="flex gap-3">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                disabled={!dataset || chatLoading}
                placeholder={dataset ? "Ask anything about your data..." : "Upload a dataset to start chatting..."}
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || !dataset || chatLoading}
                className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 font-semibold text-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>

        {/* RIGHT PANEL: INSIGHTS */}
        <aside className="w-72 bg-white border-l border-slate-200 flex flex-col overflow-y-auto shrink-0">
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> AI Insights</h2>
          </div>
          
          {!insights && !loadingInsights && (
            <div className="flex-1 flex items-center justify-center p-6 text-center">
              <div>
                <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-xs text-slate-400">Upload a dataset to see AI insights</p>
              </div>
            </div>
          )}

          {loadingInsights && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
                <p className="text-xs text-slate-500">Generating AI insights...</p>
              </div>
            </div>
          )}

          {insights && (
            <div className="p-4 space-y-4">
              {/* Confidence Scores */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-black text-blue-700">{insights.confidence_score || 92}%</div>
                  <div className="text-xs text-blue-500 font-semibold">AI Confidence</div>
                </div>
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-black text-green-700">{insights.data_quality_score || 85}%</div>
                  <div className="text-xs text-green-500 font-semibold">Data Quality</div>
                </div>
              </div>

              {/* Key Findings */}
              {insights.key_findings?.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-green-500" /> Key Findings</h3>
                  <div className="space-y-2">
                    {insights.key_findings.slice(0, 4).map((f: string, i: number) => (
                      <div key={i} className="flex gap-2 p-2 bg-slate-50 rounded-lg text-xs text-slate-600">
                        <span className="text-blue-500 mt-0.5 shrink-0">•</span>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Anomalies */}
              {insights.anomalies?.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Anomalies</h3>
                  <div className="space-y-2">
                    {insights.anomalies.map((a: string, i: number) => (
                      <div key={i} className="flex gap-2 p-2 bg-amber-50 rounded-lg text-xs text-amber-700 border border-amber-200">
                        <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" /> {a}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {insights.recommendations?.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Lightbulb className="w-3.5 h-3.5 text-purple-500" /> Recommendations</h3>
                  <div className="space-y-2">
                    {insights.recommendations.map((r: string, i: number) => (
                      <div key={i} className="flex gap-2 p-2 bg-purple-50 rounded-lg text-xs text-purple-700">
                        <span className="shrink-0">→</span> {r}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100">
                <a href="/analytics" className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors">
                  <BarChart2 className="w-3.5 h-3.5" /> View Full Analytics
                </a>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
