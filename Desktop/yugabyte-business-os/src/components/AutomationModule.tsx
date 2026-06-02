import React, { useState } from 'react';
import { 
  Cpu, 
  Terminal, 
  ToggleLeft, 
  ToggleRight, 
  Play, 
  Trash2, 
  RefreshCw, 
  Zap, 
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Briefcase,
  Layers
} from 'lucide-react';
import { AutomationRule, AutomationLog, Lead, Deal, Invoice, Task, SectorType } from '../types';

interface AutomationProps {
  automationRules: AutomationRule[];
  setAutomationRules: React.Dispatch<React.SetStateAction<AutomationRule[]>>;
  automationLogs: AutomationLog[];
  setAutomationLogs: React.Dispatch<React.SetStateAction<AutomationLog[]>>;
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  deals: Deal[];
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>;
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function AutomationModule({
  automationRules,
  setAutomationRules,
  automationLogs,
  setAutomationLogs,
  leads,
  setLeads,
  deals,
  setDeals,
  invoices,
  setInvoices,
  tasks,
  setTasks
}: AutomationProps) {

  const handleToggleRule = (ruleId: string) => {
    setAutomationRules(prev => prev.map(rule => {
      if (rule.id === ruleId) {
        const nextState = !rule.isActive;
        // log action in terminal logs
        const log: AutomationLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          ruleTitle: rule.title,
          details: `Administrator toggled rule state to: [${nextState ? 'ENABLED' : 'DISABLED'}].`
        };
        setAutomationLogs(curr => [log, ...curr]);
        return { ...rule, isActive: nextState };
      }
      return rule;
    }));
  };

  const handleClearLogs = () => {
    setAutomationLogs([]);
  };

  // Simulation Engine: Ingests specific simulated events and executes cross-state mutations live! (Feature 1)
  const handleTriggerSimulationEvent = (type: 'jewellery_lead' | 'mfg_blueprints' | 'invoice_overdue' | 'wholesale_deal') => {
    const isJewelleryRuleActive = automationRules.find(r => r.id === 'r1')?.isActive;
    const isMfgRuleActive = automationRules.find(r => r.id === 'r2')?.isActive;
    const timestamp = new Date().toISOString();

    if (type === 'jewellery_lead') {
      const targetName = 'Ananya Singhania';
      const targetCompany = 'Singhania Heritage Gems Ltd';
      let assignedAgent = 'Shreya Patra';
      let detailMsg = 'Standard queue routing applied.';
      const newLogs: AutomationLog[] = [];

      if (isJewelleryRuleActive) {
        assignedAgent = 'Ashok Mahajan';
        detailMsg = 'Routed to elite jewellery portfolio Ashok Mahajan (SLA: 15m trigger).';
        newLogs.push({
          id: `sim-log-${Date.now()}-j1`,
          timestamp,
          ruleTitle: 'Jewellery Assign Triggered',
          details: `AUTO-ROUTE: Ingested lead "${targetName}" (${targetCompany}). Assigned to Ashok Mahajan due to matching Gold & Retail Gemstone division.`
        });
      } else {
        newLogs.push({
          id: `sim-log-${Date.now()}-j2`,
          timestamp,
          ruleTitle: 'Jewellery Rule Bypassed',
          details: `QUEUE: Ingested lead "${targetName}" (${targetCompany}). Bypassed auto-routing (Rule is INACTIVE). Assigned to standard desk.`
        });
      }

      const newLead: Lead = {
        id: `lead-sim-${Date.now()}`,
        name: targetName,
        company: targetCompany,
        email: 'ananya@heritagegems.co.in',
        phone: '+91 98200 13411',
        status: 'Lead In',
        value: 145000,
        sector: 'Jewellery',
        assignedTo: assignedAgent,
        createdAt: new Date().toISOString().split('T')[0],
        communicationHistory: [
          { date: new Date().toISOString().split('T')[0], type: 'Inquiry', summary: `YugaByte BOS Webhook Gateway Ingest: ${detailMsg}` }
        ]
      };

      setLeads(prev => [newLead, ...prev]);
      setAutomationLogs(prev => [...newLogs, ...prev]);

    } else if (type === 'mfg_blueprints') {
      const targetName = 'Dr. Hans Mueller Precision';
      const targetCompany = 'Mueller Aerospace & Turbine GMBH';
      const newLogs: AutomationLog[] = [];
      let detailMsg = 'Manufacturing lead logged.';

      if (isMfgRuleActive) {
        detailMsg = 'Blueprint file uploaded. Technical checklist task created for mechanical design check.';
        
        // Push a fresh technical evaluation task directly into the database!
        const newTask: Task = {
          id: `task-sim-${Date.now()}`,
          title: 'Validate Muellers Aerospace CNC blueprints',
          assignedTo: 'Shreya Patra',
          clientName: targetCompany,
          priority: 'High',
          completed: false,
          type: 'Reminder',
          dateTime: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().split('T')[0],
          description: 'Technical evaluation of CNC blueprint specifications'
        };
        setTasks(prev => [newTask, ...prev]);

        newLogs.push({
          id: `sim-log-${Date.now()}-m1`,
          timestamp,
          ruleTitle: 'Blueprint Auto-Publish Task',
          details: `AUTO-TASK: Blueprint uploaded from "${targetCompany}". Published validation task and assigned to aerospace engineer Shreya Patra.`
        });
      } else {
        newLogs.push({
          id: `sim-log-${Date.now()}-m2`,
          timestamp,
          ruleTitle: 'Blueprint Task Bypassed',
          details: `SYSTEM WATCH: Ingested blueprints for "${targetCompany}". Bypassed task generation as Manufacturing rule is INACTIVE.`
        });
      }

      const newLead: Lead = {
        id: `lead-sim-${Date.now()}`,
        name: targetName,
        company: targetCompany,
        email: 'h.mueller@aeroprecision.de',
        phone: '+49 89 2401 551',
        status: 'Lead In',
        value: 380000,
        sector: 'Manufacturing',
        assignedTo: 'Shreya Patra',
        createdAt: new Date().toISOString().split('T')[0],
        communicationHistory: [
          { date: new Date().toISOString().split('T')[0], type: 'Inquiry', summary: `YugaByte BOS File Ingestion: ${detailMsg}` }
        ]
      };

      setLeads(prev => [newLead, ...prev]);
      setAutomationLogs(prev => [...newLogs, ...prev]);

    } else if (type === 'invoice_overdue') {
      const newLogs: AutomationLog[] = [];
      let updatedCount = 0;

      setInvoices(prev => prev.map(inv => {
        if (inv.status === 'Unpaid') {
          updatedCount++;
          return { ...inv, status: 'Overdue' };
        }
        return inv;
      }));

      newLogs.push({
        id: `sim-log-${Date.now()}-iv1`,
        timestamp,
        ruleTitle: 'Overdue Dunning Run',
        details: `DUNNING ALARM: Marked ${updatedCount || 1} outstanding Net-30 invoice dockets as [OVERDUE]. Auto-scheduled warning statement exports.`
      });

      // Inject collections follow-up task
      const collectionsTask: Task = {
        id: `task-sim-${Date.now()}`,
        title: 'High-priority overdue accounts audit & dynamic collection statement export',
        assignedTo: 'Ashok Mahajan',
        clientName: 'Delinquent Accounts Ledger',
        priority: 'High',
        completed: false,
        type: 'Follow-up',
        dateTime: new Date().toISOString().split('T')[0],
        description: 'Overdue Net-30 invoice delinquency collection statement export'
      };
      setTasks(prev => [collectionsTask, ...prev]);
      setAutomationLogs(prev => [...newLogs, ...prev]);

    } else if (type === 'wholesale_deal') {
      const dealId = `deal-sim-${Date.now()}`;
      const newDeal: Deal = {
        id: dealId,
        title: 'Royal Karats Wholesalers Bulk Lot',
        company: 'Royal Karat Brokers Inc',
        value: 290000,
        stage: 'Discovery',
        probability: 20,
        expectedRevenue: 58000,
        forecastDate: new Date(Date.now() + 45 * 24 * 3600 * 1000).toISOString().split('T')[0],
        sector: 'Wholesale'
      };

      setDeals(prev => [newDeal, ...prev]);

      const log: AutomationLog = {
        id: `sim-log-${Date.now()}-w1`,
        timestamp,
        ruleTitle: 'Wholesale Pipeline Ingested',
        details: `PIPELINE ADD: Registered high-volume B2B Wholesaler opportunity "$290,000" in active system forecast ledger.`
      };
      setAutomationLogs(prev => [log, ...prev]);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans">
      
      {/* Title */}
      <div className="border-b border-slate-900 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu size={18} className="text-blue-400 font-bold animate-pulse" />
            <span>Operational Workflow Rules & Event Simulator</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Build active trigger-response loops. Test routing, blueprint verification, and overdue dunning tasks in real time using the interactive board below.
          </p>
        </div>
      </div>

      {/* Feature 1: Interactive SLA Event Simulator Control Board */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-450 uppercase tracking-wider">
          <Zap size={13} className="text-yellow-500 fill-current" />
          <span>Interactive Live Event Simulator Board</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-normal">
          Click any event node to simulate real-time business processes. Watch how assignments change, tasks populate, metrics update, and logs register, instantly throughout all modules in real time.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Btn 1 */}
          <button
            onClick={() => handleTriggerSimulationEvent('jewellery_lead')}
            className="p-3 bg-slate-950/80 border border-amber-500/10 hover:border-amber-500/40 rounded-xl text-left transition-all hover:scale-[1.02] cursor-pointer flex flex-col justify-between h-24"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[8px] font-mono bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded font-bold uppercase">JEWELLERY DEPT</span>
              <Play size={10} className="text-amber-500 fill-current" />
            </div>
            <div>
              <strong className="text-xs text-slate-205 block leading-tight">Simulate Jewellery Lead</strong>
              <span className="text-[9px] text-slate-500 mt-1 block">Routes to Ashok Mahajan (if active)</span>
            </div>
          </button>

          {/* Btn 2 */}
          <button
            onClick={() => handleTriggerSimulationEvent('mfg_blueprints')}
            className="p-3 bg-slate-950/80 border border-blue-500/10 hover:border-blue-500/40 rounded-xl text-left transition-all hover:scale-[1.02] cursor-pointer flex flex-col justify-between h-24"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[8px] font-mono bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-bold uppercase">MFG BLUEPRINTS</span>
              <Play size={10} className="text-blue-400 fill-current" />
            </div>
            <div>
              <strong className="text-xs text-slate-205 block leading-tight">Ingest Tech Blueprints</strong>
              <span className="text-[9px] text-slate-500 mt-1 block">Inserts high-priority validation task</span>
            </div>
          </button>

          {/* Btn 3 */}
          <button
            onClick={() => handleTriggerSimulationEvent('invoice_overdue')}
            className="p-3 bg-slate-950/80 border border-rose-500/10 hover:border-rose-500/40 rounded-xl text-left transition-all hover:scale-[1.02] cursor-pointer flex flex-col justify-between h-24"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[8px] font-mono bg-rose-500/10 text-rose-450 px-1.5 py-0.5 rounded font-bold uppercase">INVOICE STAMP</span>
              <Clock size={11} className="text-rose-450" />
            </div>
            <div>
              <strong className="text-xs text-slate-205 block leading-tight">Past-Due Invoice Alarm</strong>
              <span className="text-[9px] text-slate-500 mt-1 block">Flags unpaid accounts as OVERDUE</span>
            </div>
          </button>

          {/* Btn 4 */}
          <button
            onClick={() => handleTriggerSimulationEvent('wholesale_deal')}
            className="p-3 bg-slate-950/80 border border-purple-500/10 hover:border-purple-500/40 rounded-xl text-left transition-all hover:scale-[1.02] cursor-pointer flex flex-col justify-between h-24"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[8px] font-mono bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded font-bold uppercase">WHOLESALE DEAL</span>
              <Briefcase size={11} className="text-purple-400" />
            </div>
            <div>
              <strong className="text-xs text-slate-205 block leading-tight">Simulate Wholesaler Sign-up</strong>
              <span className="text-[9px] text-slate-500 mt-1 block">Adds large $290K deal to pipeline</span>
            </div>
          </button>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Rules stack list left */}
        <div className="lg:col-span-6 space-y-4">
          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block leading-none">
            Active System Automation Triggers
          </span>

          <div className="space-y-4">
            {automationRules.map((rule) => (
              <div 
                key={rule.id}
                className={`p-4 bg-slate-900/40 rounded-2xl border transition-all flex justify-between gap-4 ${
                  rule.isActive ? 'border-indigo-500/15 bg-indigo-950/5' : 'border-slate-910 hover:border-slate-850'
                }`}
              >
                <div className="flex-1 space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${rule.isActive ? 'bg-indigo-500 animate-pulse' : 'bg-slate-700'}`} />
                    <h4 className="text-xs font-bold text-slate-200">{rule.title}</h4>
                  </div>
                  
                  <p className="text-[11px] text-slate-400 leading-normal">{rule.description}</p>
                  
                  <div className="flex flex-wrap gap-2 text-[9px] font-mono leading-none">
                    <span className="bg-slate-950 border border-slate-900 text-indigo-400 px-1.5 py-1 rounded">
                      Listening: {rule.triggerEvent}
                    </span>
                    <span className="bg-slate-950 border border-slate-900 text-blue-400 px-1.5 py-1 rounded">
                      Action: {rule.actionEffect}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 pt-0.5">
                  <button
                    onClick={() => handleToggleRule(rule.id)}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {rule.isActive ? (
                      <ToggleRight size={24} className="text-blue-500" />
                    ) : (
                      <ToggleLeft size={24} className="text-slate-650" />
                    )}
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Real-time mock console logging right */}
        <div className="lg:col-span-6 flex flex-col bg-slate-950 rounded-2xl border border-slate-900 overflow-hidden shadow-2xl">
          
          {/* Console Header */}
          <div className="px-4 py-3 bg-slate-900 border-b border-slate-850 flex items-center justify-between text-slate-500 font-mono text-[9px]">
            <div className="flex items-center gap-2">
              <Terminal size={12} className="text-blue-500 animate-pulse" />
              <span className="font-bold uppercase tracking-wider text-slate-400">YugaByte BOS Terminal Logs</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={handleClearLogs}
                className="hover:text-white inline-flex items-center gap-1 cursor-pointer font-bold leading-none"
              >
                <Trash2 size={10} />
                <span>FLUSH CONSOLE</span>
              </button>
            </div>
          </div>

          {/* Micro Console content terminal */}
          <div className="p-4 bg-slate-955/90 font-mono text-[10px] leading-relaxed text-slate-350 space-y-3.5 h-[340px] overflow-y-auto">
            {automationLogs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-900/35 border border-slate-900/60 rounded-lg space-y-1">
                <div className="flex items-center justify-between text-[9px] text-slate-550 leading-none">
                  <span className="text-indigo-400 font-semibold">{log.ruleTitle}</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-slate-300 select-all font-sans text-xs mt-1 leading-normal">
                  $ {log.details}
                </p>
              </div>
            ))}

            {automationLogs.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center p-8 opacity-25 italic text-slate-500 font-sans text-xs">
                No active logic operations. Click "Ingest Webhook event" to fire simulated endpoints.
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
