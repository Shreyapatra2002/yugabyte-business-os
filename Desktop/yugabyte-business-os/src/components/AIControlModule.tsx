import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  TrendingUp, 
  Users, 
  FileText, 
  RefreshCw, 
  HelpCircle,
  AlertCircle,
  MapPin,
  Lightbulb
} from 'lucide-react';
import { Lead, Deal, Quotation, Invoice, Task, Branch } from '../types';

interface AIControlProps {
  activeSector: string; // e.g., Jewellery
  activeBranch: Branch;
  leads: Lead[];
  deals: Deal[];
  quotations: Quotation[];
  invoices: Invoice[];
  tasks: Task[];
}

export default function AIControlModule({
  activeSector,
  activeBranch,
  leads,
  deals,
  quotations,
  invoices,
  tasks
}: AIControlProps) {
  const [promptType, setPromptType] = useState<'sales-forecast' | 'lead-analysis' | 'write-comms' | 'general-query'>('sales-forecast');
  const [customMessage, setCustomMessage] = useState('');
  const [aiBriefing, setAiBriefing] = useState<string>(
    `### 🧠 Click a prompt below to launch Gemini Business Intelligence...
Select any operations button below to query our corporate server. Gemini will analyze active branch telemetry (including your ${leads.length} leads and ₹${invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.total, 0).toLocaleString()} earned revenue) to provide predictive advice.`
  );
  const [isQuerying, setIsQuerying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const runAiInference = async (type: 'sales-forecast' | 'lead-analysis' | 'write-comms' | 'general-query', customMsg?: string) => {
    setIsQuerying(true);
    setErrorMessage('');
    
    // Package active state data to proxy securely onto server API
    const dataState = {
      leads,
      deals,
      quotations,
      invoices,
      tasks
    };

    try {
      const response = await fetch('/api/bos/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessType: activeSector,
          activeBranch,
          promptType: type,
          dataState,
          customMessage: customMsg
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP diagnostics error: ${response.status}`);
      }

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }

      setAiBriefing(result.response || "No response received from model core.");
    } catch (err: any) {
      console.error("AI Operations Error:", err);
      setErrorMessage(`Failed to verify telemetry credentials on server: ${err.message || err}`);
    } finally {
      setIsQuerying(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMessage.trim()) return;
    setPromptType('general-query');
    runAiInference('general-query', customMessage);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles size={18} className="text-blue-400 rotate-12" />
            <span>AI Operations Intelligence Briefs (Gemini Core)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Activate server-side artificial intelligence models to audit sales trends, score prospect weights, write communications, and resolve bottlenecks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Control pane: quick actions list */}
        <div className="lg:col-span-4 space-y-4">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block leading-none">
            Query Triggers Matrix
          </span>

          <div className="space-y-3">
            
            {/* Prompt A */}
            <button
              onClick={() => { setPromptType('sales-forecast'); runAiInference('sales-forecast'); }}
              disabled={isQuerying}
              className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer flex gap-3 ${
                promptType === 'sales-forecast' 
                  ? 'border-blue-500 bg-blue-600/5 text-blue-400' 
                  : 'border-slate-900 bg-slate-900/10 text-slate-350 hover:bg-slate-900/40'
              }`}
            >
              <TrendingUp size={16} className="mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-bold leading-tight">Predictive Revenue Forecast</h4>
                <p className="text-[10px] text-slate-505 mt-1 font-sans leading-normal">
                  Analyzes deals velocity, expected value confidence, and due invoices to compute targets.
                </p>
              </div>
            </button>

            {/* Prompt B */}
            <button
              onClick={() => { setPromptType('lead-analysis'); runAiInference('lead-analysis'); }}
              disabled={isQuerying}
              className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer flex gap-3 ${
                promptType === 'lead-analysis' 
                  ? 'border-blue-500 bg-blue-600/5 text-blue-400' 
                  : 'border-slate-900 bg-slate-900/10 text-slate-350 hover:bg-slate-900/40'
              }`}
            >
              <Users size={16} className="mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-bold leading-tight">Smart Lead Scoring & Routing</h4>
                <p className="text-[10px] text-slate-505 mt-1 font-sans leading-normal">
                  Examines communication feeds logs and tags leads carrying bottlenecks or urgent priorities.
                </p>
              </div>
            </button>

            {/* Prompt C */}
            <button
              onClick={() => { setPromptType('write-comms'); runAiInference('write-comms'); }}
              disabled={isQuerying}
              className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer flex gap-3 ${
                promptType === 'write-comms' 
                  ? 'border-blue-500 bg-blue-600/5 text-blue-400' 
                  : 'border-slate-900 bg-slate-900/10 text-slate-350 hover:bg-slate-900/40'
              }`}
            >
              <FileText size={16} className="mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-bold leading-tight">Compose Delinquent Reminders</h4>
                <p className="text-[10px] text-slate-505 mt-1 font-sans leading-normal">
                  Drafts professional custom client email drafts mapping exactly back to overdued totals.
                </p>
              </div>
            </button>

          </div>

          <hr className="border-slate-900/60" />

          {/* Form to write any custom queries */}
          <form onSubmit={handleCustomSubmit} className="space-y-2.5">
            <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider mb-1">
              Custom Operational Queries
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={customMessage}
                disabled={isQuerying}
                onChange={e => setCustomMessage(e.target.value)}
                placeholder="Ask e.g.: Show restocking recommendations..." 
                className="flex-1 p-2 bg-slate-950 border border-slate-900 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 focus:bg-slate-900"
              />
              <button
                type="submit"
                disabled={isQuerying || !customMessage.trim()}
                className="p-2.5 bg-blue-600 hover:bg-blue-505 disabled:opacity-30 rounded-lg text-white flex items-center justify-center cursor-pointer"
              >
                <Send size={13} />
              </button>
            </div>
          </form>

        </div>

        {/* Right Preview briefing console */}
        <div className="lg:col-span-8 flex flex-col bg-slate-900/10 rounded-2xl border border-slate-900 overflow-hidden min-h-[460px]">
          
          {/* Header */}
          <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-900 flex items-center justify-between text-xs font-mono text-slate-500">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-450 text-[9px]">
              <Sparkles size={12} className="text-blue-400" />
              <span>Gemini Operational Brief Console Node</span>
            </div>
            
            <div className="flex items-center gap-2 text-[10px]">
              <MapPin size={11} className="text-blue-400" />
              <span>{activeBranch.name}</span>
            </div>
          </div>

          {/* Content panel */}
          <div className="flex-1 p-6 text-xs text-slate-300 font-sans leading-relaxed select-text space-y-4 whitespace-pre-wrap overflow-y-auto max-h-[400px]">
            {isQuerying ? (
              <div className="h-44 flex flex-col items-center justify-center space-y-3 font-mono opacity-80 py-12">
                <RefreshCw size={20} className="text-blue-500 animate-spin" />
                <span className="text-[10px] tracking-widest text-slate-500 uppercase animate-pulse">Running server analytical inference...</span>
              </div>
            ) : errorMessage ? (
              <div className="p-4 bg-rose-500/15 border border-rose-500/20 rounded-xl text-rose-450 items-start justify-center flex gap-3 text-xs leading-relaxed">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold">Operations Node Credentials error</h5>
                  <p className="mt-1">{errorMessage}</p>
                  <p className="text-[10px] text-slate-550 mt-1.5 font-mono italic">Ensure the GEMINI_API_KEY is configured under Settings secrets drawer inside AI Studio.</p>
                </div>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none text-slate-350 select-text font-serif italic font-medium leading-relaxed leading-6 text-sm">
                {aiBriefing}
              </div>
            )}
          </div>

          {/* Bottom helper */}
          <div className="p-3 bg-slate-950 border-t border-slate-900 flex items-center gap-2 text-[9px] font-mono text-slate-600 leading-none">
            <Lightbulb size={11} className="text-amber-500 animate-pulse" />
            <span>AI computations execute securely on backend models using context-aware active variables.</span>
          </div>

        </div>

      </div>

    </div>
  );
}
