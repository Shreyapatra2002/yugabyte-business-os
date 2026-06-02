import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  FileSignature, 
  Receipt, 
  MapPin, 
  ChevronRight, 
  Plus, 
  ArrowUpRight 
} from 'lucide-react';
import { motion } from 'motion/react';
import { Lead, Deal, Quotation, Invoice, Task, Branch } from '../types';
import InteractiveCharts from './InteractiveCharts';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
};

interface DashboardOverviewProps {
  activeBranch: Branch;
  leads: Lead[];
  deals: Deal[];
  quotations: Quotation[];
  invoices: Invoice[];
  tasks: Task[];
  setActiveTab: (tab: any) => void;
}

export default function DashboardOverview({
  activeBranch,
  leads,
  deals,
  quotations,
  invoices,
  tasks,
  setActiveTab
}: DashboardOverviewProps) {
  
  // Calculate stats dynamically under branch parameters
  const earnedRevenue = invoices
    .filter(i => i.status === 'Paid')
    .reduce((sum, current) => sum + current.total, 0);

  const outstandingBalance = invoices
    .filter(i => i.status === 'Unpaid' || i.status === 'Overdue')
    .reduce((sum, current) => sum + current.outstandingAmount, 0);

  const activeQuotesCount = quotations.filter(q => q.status === 'Sent' || q.status === 'Draft').length;
  const leadInquiryCount = leads.filter(l => l.status === 'Lead In' || l.status === 'Contacted').length;

  const funnelStages = [
    { name: 'Lead Enquiries', count: leads.length, color: 'bg-indigo-500' },
    { name: 'Active Pipelines', count: deals.length, color: 'bg-blue-500' },
    { name: 'Drafted Quotations', count: quotations.length, color: 'bg-purple-500' },
    { name: 'Issued Invoices', count: invoices.length, color: 'bg-cyan-500' }
  ];

  const maxFunnelCount = Math.max(...funnelStages.map(s => s.count), 1);

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 font-sans">
      
      {/* Localized Branch Header Banner */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/20 border border-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 font-bold uppercase">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Operational Center Live</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white mt-1.5">
            Overview Hub: {activeBranch.name}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Running real-time localized telemetry out of <span className="text-blue-400 font-mono font-semibold">{activeBranch.location}</span>.
          </p>
        </div>
        
        {/* Dynamic Branch SLA Stamp */}
        <div className="px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-left md:text-right flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <MapPin size={15} />
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block tracking-wider leading-none">
              LOCALIZED NODE CODE
            </span>
            <span className="text-xs text-slate-200 mt-1 font-semibold block uppercase">
              {activeBranch.code}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Financial KPIs Card */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        
        {/* KPI 1: Earned Revenue */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -3, transition: { duration: 0.15 } }}
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-900 flex flex-col justify-between hover:border-slate-800 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Earned Revenue</span>
            <div className="h-7 w-7 rounded-lg bg-emerald-500/15 border border-emerald-500/10 flex items-center justify-center text-emerald-400">
              <DollarSign size={14} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold tracking-tight text-white font-mono">
              ${earnedRevenue.toLocaleString()}
            </h3>
            <p className="text-[10px] font-mono text-emerald-500 flex items-center gap-1.5 mt-1">
              <TrendingUp size={11} />
              <span>+18.5% this quarter</span>
            </p>
          </div>
        </motion.div>

        {/* KPI 2: Delinquent Outstanding */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -3, transition: { duration: 0.15 } }}
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-900 flex flex-col justify-between hover:border-slate-800 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Outstanding Receivable</span>
            <div className="h-7 w-7 rounded-lg bg-rose-500/15 border border-rose-500/10 flex items-center justify-center text-rose-400">
              <Receipt size={14} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold tracking-tight text-white font-mono">
              ${outstandingBalance.toLocaleString()}
            </h3>
            <p className="text-[10px] font-mono text-rose-400 flex items-center gap-1.5 mt-1">
              <TrendingDown size={11} />
              <span>Unpaid / Overdue Nets</span>
            </p>
          </div>
        </motion.div>

        {/* KPI 3: Active Quotes */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -3, transition: { duration: 0.15 } }}
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-900 flex flex-col justify-between hover:border-slate-800 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Submitted Proposals</span>
            <div className="h-7 w-7 rounded-lg bg-purple-500/15 border border-purple-500/10 flex items-center justify-center text-purple-400">
              <FileSignature size={14} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold tracking-tight text-white font-mono">
              {activeQuotesCount} Quotes
            </h3>
            <p className="text-[10px] font-mono text-indigo-400 flex items-center gap-1.5 mt-1">
              <span>Conversion-ready state</span>
            </p>
          </div>
        </motion.div>

        {/* KPI 4: Customer Enquiries */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -3, transition: { duration: 0.15 } }}
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-900 flex flex-col justify-between hover:border-slate-800 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Incoming Enquiries</span>
            <div className="h-7 w-7 rounded-lg bg-blue-500/15 border border-blue-500/10 flex items-center justify-center text-blue-400">
              <Users size={14} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold tracking-tight text-white font-mono">
              {leadInquiryCount} Leads
            </h3>
            <p className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 mt-1">
              <span>Awaiting router actions</span>
            </p>
          </div>
        </motion.div>

      </motion.div>

      {/* Dynamic Interactive Charts segments (Feature 2) */}
      <InteractiveCharts 
        leadsCount={leads.length}
        dealsCount={deals.length}
        quotesCount={quotations.length}
        invoicesCount={invoices.length}
        earnedRevenue={earnedRevenue}
        outstandingBalance={outstandingBalance}
      />

      {/* Main Grid Section: Pipeline Funnel Metrics & Priority Operations Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Funnel Levels (Function 5) */}
        <div className="lg:col-span-7 bg-slate-900/40 p-6 rounded-2xl border border-slate-900 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Operating Pipeline Funnel (SLA)
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Telemetry charting conversion volume from initial prospect to paid cash.
              </p>
            </div>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
              Live Aggregate
            </span>
          </div>

          <div className="space-y-4">
            {funnelStages.map((stage) => {
              const percentage = Math.round((stage.count / maxFunnelCount) * 100);

              return (
                <div key={stage.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-350">{stage.name}</span>
                    <span className="font-mono text-slate-500">{stage.count} entities ({percentage}%)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-950/80 rounded-full border border-slate-900 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${stage.color}`} 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Dynamic Action Tasks Checklist */}
        <div className="lg:col-span-5 bg-slate-900/40 p-6 rounded-2xl border border-slate-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100">
                Priority System Flags / Reminders
              </h3>
              <button 
                onClick={() => setActiveTab('Team Tasks')}
                className="text-[10px] text-blue-400 hover:underline inline-flex items-center gap-1 font-medium"
              >
                <span>Task Manager</span>
                <Plus size={10} />
              </button>
            </div>
            
            <div className="mt-5 space-y-3">
              {tasks.slice(0, 3).map((task) => (
                <div 
                  key={task.id} 
                  className={`p-3 rounded-xl border flex gap-3 ${
                    task.completed 
                      ? 'bg-slate-950/30 border-slate-950 opacity-55' 
                      : 'bg-slate-950/70 border-slate-850'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={task.completed} 
                    readOnly
                    className="mt-1 shrink-0 rounded border-slate-800 focus:ring-0 text-blue-600 bg-transparent"
                  />
                  <div>
                    <h4 className={`text-xs font-bold leading-none ${task.completed ? 'line-through text-slate-500' : 'text-slate-205'}`}>
                      {task.title}
                    </h4>
                    <span className="text-[9px] font-mono text-slate-550 mt-1.5 block">
                      Client: {task.clientName} · {task.priority} Weight
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-900/60 mt-4 text-center">
            <button
              onClick={() => setActiveTab('AI Control')}
              className="w-full py-2 bg-blue-600/10 text-blue-400 hover:bg-blue-600/15 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Ask AI Operator to Audit Pipeline</span>
              <ArrowUpRight size={12} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
