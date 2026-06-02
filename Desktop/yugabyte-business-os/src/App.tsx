import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Sidebar, { SidebarTab } from './components/Sidebar';
import DashboardView from './components/DashboardView';
import LandingView from './components/LandingView';
import { Sparkles, Plus, X, Briefcase, FileCheck, ClipboardList, CheckCircle, Menu, Home, Users, FileText, Cpu, ShieldAlert } from 'lucide-react';
import { 
  initialBranches, 
  initialLeads, 
  initialDeals, 
  initialQuotations, 
  initialInvoices, 
  initialTasks, 
  initialAutomationRules 
} from './data';
import { Lead, Deal, Quotation, Invoice, Task, AutomationRule, AutomationLog, Branch, UserRole } from './types';

export default function App() {
  const [currentView, setView] = useState<'landing' | 'dashboard'>('landing');
  const [dashboardTab, setDashboardTab] = useState<SidebarTab>('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Core global system states (Enables complete cross-module synchronization)
  const [branches] = useState<Branch[]>(initialBranches);
  const [activeBranch, setActiveBranch] = useState<Branch>(
    () => {
      const saved = localStorage.getItem('bos_active_branch');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignore */ }
      }
      return initialBranches[0]; // Mumbai Retail HQ
    }
  );

  const [userRole, setUserRole] = useState<UserRole>(
    () => {
      const saved = localStorage.getItem('bos_user_role');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignore */ }
      }
      return { level: 'Admin', departmentsAllowed: ['Dashboard', 'Sales', 'Finance', 'Operations', 'AI Insights', 'Security'] };
    }
  );

  // Local Storage backed database states
  const migrateNames = (dataStr: string): string => {
    return dataStr
      .replace(/Sarah Jenkins/g, 'Sakshi Shaw')
      .replace(/Marcus\s+Vance/gi, 'Sultan Khan')
      .replace(/Marcus/g, 'Sultan Khan')
      .replace(/Tyler\s+Durden/gi, 'Shreya Patra')
      .replace(/Tyler/g, 'Shreya Patra')
      .replace(/Klause Kinkaide/g, 'Sneha Dhar')
      .replace(/Klaus Kinkaide/g, 'Sneha Dhar')
      .replace(/Sanjana Rao/g, 'Sakshi Shaw')
      .replace(/Aditya Singh/g, 'Sultan Khan')
      .replace(/Devendra Kumar/g, 'Shreya Patra')
      .replace(/Amit Rao/g, 'Sneha Dhar')
      .replace(/Meera Sharma/g, 'Ashok Mahajan')
      .replace(/Sita Ramkrishnan/g, 'Sakshi Shaw')
      .replace(/Manaj Bera/g, 'Sultan Khan')
      .replace(/Tulika Ghosh/g, 'Shreya Patra')
      .replace(/Koushik Paul/g, 'Sneha Dhar');
  };

  const ensureUniqueIds = <T extends { id: string | number }>(items: T[]): T[] => {
    const seen = new Set<string | number>();
    return items.map((item, index) => {
      let uniqueId = item.id;
      if (!uniqueId || seen.has(uniqueId)) {
        uniqueId = `${uniqueId || 'auto'}-dup-${index}-${Math.floor(Math.random() * 100000)}`;
      }
      seen.add(uniqueId);
      return { ...item, id: uniqueId };
    });
  };

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('bos_db_leads');
    if (saved) {
      try { return ensureUniqueIds(JSON.parse(migrateNames(saved))); } catch (e) { /* ignore */ }
    }
    return ensureUniqueIds(initialLeads);
  });

  const [deals, setDeals] = useState<Deal[]>(() => {
    const saved = localStorage.getItem('bos_db_deals');
    if (saved) {
      try { return ensureUniqueIds(JSON.parse(migrateNames(saved))); } catch (e) { /* ignore */ }
    }
    return ensureUniqueIds(initialDeals);
  });

  const [quotations, setQuotations] = useState<Quotation[]>(() => {
    const saved = localStorage.getItem('bos_db_quotations');
    if (saved) {
      try { return ensureUniqueIds(JSON.parse(migrateNames(saved))); } catch (e) { /* ignore */ }
    }
    return ensureUniqueIds(initialQuotations);
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('bos_db_invoices');
    if (saved) {
      try { return ensureUniqueIds(JSON.parse(migrateNames(saved))); } catch (e) { /* ignore */ }
    }
    return ensureUniqueIds(initialInvoices);
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('bos_db_tasks');
    if (saved) {
      try { return ensureUniqueIds(JSON.parse(migrateNames(saved))); } catch (e) { /* ignore */ }
    }
    return ensureUniqueIds(initialTasks);
  });

  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(() => {
    const saved = localStorage.getItem('bos_db_automation_rules');
    if (saved) {
      try { return ensureUniqueIds(JSON.parse(migrateNames(saved))); } catch (e) { /* ignore */ }
    }
    return ensureUniqueIds(initialAutomationRules);
  });

  const [automationLogs, setAutomationLogs] = useState<AutomationLog[]>(() => {
    const saved = localStorage.getItem('bos_db_automation_logs');
    if (saved) {
      try { return ensureUniqueIds(JSON.parse(migrateNames(saved))); } catch (e) { return []; }
    }
    return [
      { id: 'log-1', timestamp: new Date(Date.now() - 3600000).toISOString(), ruleTitle: 'System Guard', details: 'YugaByte BOS logs initialized on regional router node.' }
    ];
  });

  // Watch and persist changes sequentially
  useEffect(() => {
    localStorage.setItem('bos_active_branch', JSON.stringify(activeBranch));
  }, [activeBranch]);

  useEffect(() => {
    localStorage.setItem('bos_user_role', JSON.stringify(userRole));
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem('bos_db_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('bos_db_deals', JSON.stringify(deals));
  }, [deals]);

  useEffect(() => {
    localStorage.setItem('bos_db_quotations', JSON.stringify(quotations));
  }, [quotations]);

  useEffect(() => {
    localStorage.setItem('bos_db_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('bos_db_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('bos_db_automation_rules', JSON.stringify(automationRules));
  }, [automationRules]);

  useEffect(() => {
    localStorage.setItem('bos_db_automation_logs', JSON.stringify(automationLogs));
  }, [automationLogs]);

  // Global Quick Action Drawer (Feature 3)
  const [isQuickDrawerOpen, setIsQuickDrawerOpen] = useState(false);
  const [quickDrawerTab, setQuickDrawerTab] = useState<'lead' | 'quote' | 'task'>('lead');

  // Form State - Lead
  const [qLeadName, setQLeadName] = useState('');
  const [qLeadCompany, setQLeadCompany] = useState('');
  const [qLeadEmail, setQLeadEmail] = useState('');
  const [qLeadPhone, setQLeadPhone] = useState('');
  const [qLeadSector, setQLeadSector] = useState<'Jewellery' | 'Manufacturing' | 'Wholesale' | 'Distribution'>('Jewellery');
  const [qLeadValue, setQLeadValue] = useState('45000');
  const [qLeadAssignee, setQLeadAssignee] = useState('Ashok Mahajan');

  // Form State - Quote
  const [qQuoteCustomer, setQQuoteCustomer] = useState('');
  const [qQuoteCompany, setQQuoteCompany] = useState('');
  const [qQuoteEmail, setQQuoteEmail] = useState('');
  const [qQuoteSector, setQQuoteSector] = useState<'Jewellery' | 'Manufacturing' | 'Wholesale' | 'Distribution'>('Jewellery');
  const [qQuoteAmount, setQQuoteAmount] = useState('15000');

  // Form State - Task
  const [qTaskTitle, setQTaskTitle] = useState('');
  const [qTaskAssignee, setQTaskAssignee] = useState('Shreya Patra');
  const [qTaskClient, setQTaskClient] = useState('');
  const [qTaskPriority, setQTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  const handleQuickLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qLeadName || !qLeadCompany) return;

    const newLead: Lead = {
      id: `lead-quick-${Date.now()}`,
      name: qLeadName,
      company: qLeadCompany,
      email: qLeadEmail || `${qLeadName.toLowerCase().replace(' ', '')}@generic.com`,
      phone: qLeadPhone || '+91 90055 50022',
      status: 'Lead In',
      value: Number(qLeadValue) || 45000,
      sector: qLeadSector,
      assignedTo: qLeadAssignee,
      createdAt: new Date().toISOString().split('T')[0],
      communicationHistory: [
        { date: new Date().toISOString().split('T')[0], type: 'Inquiry', summary: 'Ingested via Global Quick Action Drawer.' }
      ]
    };

    setLeads(prev => [newLead, ...prev]);

    // SLA Check
    const isJewelleryRuleActive = automationRules.find(r => r.id === 'r1')?.isActive;
    const timestamp = new Date().toISOString();
    if (qLeadSector === 'Jewellery' && isJewelleryRuleActive && qLeadAssignee !== 'Ashok Mahajan') {
      setLeads(prev => prev.map(l => l.id === newLead.id ? { ...l, assignedTo: 'Ashok Mahajan' } : l));
      setAutomationLogs(prev => [{
        id: `log-quick-auto-${Date.now()}`,
        timestamp,
        ruleTitle: 'Jewellery Assign Triggered',
        details: `AUTO-ROUTE: Global Quick Lead "${qLeadName}" auto-assigned to Ashok Mahajan via SLA triggers.`
      }, ...prev]);
    } else {
      setAutomationLogs(prev => [{
        id: `log-quick-auto-${Date.now()}`,
        timestamp,
        ruleTitle: 'Quick Lead Filed',
        details: `LEDGER: Manually added quick lead "${qLeadName}" assigned to ${qLeadAssignee}.`
      }, ...prev]);
    }

    setQLeadName('');
    setQLeadCompany('');
    setQLeadEmail('');
    setQLeadPhone('');
    setIsQuickDrawerOpen(false);
  };

  const handleQuickQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qQuoteCustomer) return;

    const subtotal = Number(qQuoteAmount) || 12000;
    const taxPercent = qQuoteSector === 'Jewellery' ? 3 : qQuoteSector === 'Manufacturing' ? 18 : 5;
    const taxAmount = Math.round((subtotal * taxPercent) / 100);
    const total = subtotal + taxAmount;

    const newQuote: Quotation = {
      id: `quote-quick-${Date.now()}`,
      quotationNumber: `BOS-Q-${new Date().getFullYear().toString().substring(2)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      customerName: qQuoteCustomer,
      companyName: qQuoteCompany || 'Private Corporation',
      email: qQuoteEmail || 'buyer@wholesalemarket.org',
      date: new Date().toISOString().split('T')[0],
      items: [
        { description: `Draft quick proposal lot for ${qQuoteSector} operations`, quantity: 1, unitPrice: subtotal, lineTotal: subtotal }
      ],
      subtotal,
      taxPercent,
      taxAmount,
      discountTotal: 0,
      total,
      status: 'Draft',
      sector: qQuoteSector as any,
      notes: 'Formulated instantly using Global quick action console.'
    };

    setQuotations(prev => [newQuote, ...prev]);
    setAutomationLogs(prev => [{
      id: `log-quick-q-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ruleTitle: 'Quick Quotation Generated',
      details: `PROPOSAL: Successfully drafted proposal ${newQuote.quotationNumber} for ${qQuoteCustomer} (₹${total.toLocaleString()}).`
    }, ...prev]);

    setQQuoteCustomer('');
    setQQuoteCompany('');
    setQQuoteEmail('');
    setIsQuickDrawerOpen(false);
  };

  const handleQuickTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qTaskTitle) return;

    const newTask: Task = {
      id: `task-quick-${Date.now()}`,
      title: qTaskTitle,
      assignedTo: qTaskAssignee,
      clientName: qTaskClient || 'Internal Ops Desk',
      priority: qTaskPriority,
      completed: false,
      type: 'Reminder',
      dateTime: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().split('T')[0],
      description: `Quick Action Desk dispatched reminder: ${qTaskTitle}`
    };

    setTasks(prev => [newTask, ...prev]);
    setAutomationLogs(prev => [{
      id: `log-quick-t-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ruleTitle: 'Task Dispatched',
      details: `TASK AUTO-DISPATCH: High priority check "${qTaskTitle}" assigned directly to ${qTaskAssignee}.`
    }, ...prev]);

    setQTaskTitle('');
    setQTaskClient('');
    setIsQuickDrawerOpen(false);
  };

  // Aggregate database snapshot structure to bundle and pass to APIs or view screens
  const dataStateSummary = {
    leads,
    deals,
    quotations,
    invoices,
    tasks,
    workflows: automationRules,
    logs: automationLogs
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased selection:bg-blue-600/50 selection:text-white">
      {/* Dynamic Header */}
      <Header 
        currentView={currentView} 
        setView={setView} 
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        activeBranch={activeBranch}
        setActiveBranch={setActiveBranch}
        branches={branches}
        userRole={userRole}
        setUserRole={setUserRole}
      />

      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {currentView === 'landing' ? (
            /* Pristine marketing layout for BOS */
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full flex-1 flex flex-col"
            >
              <LandingView setView={setView} />
            </motion.div>
          ) : (
            /* Complete Operations Dashboard Console view */
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full flex-1 flex flex-col md:flex-row relative"
            >
              <Sidebar 
                activeTab={dashboardTab} 
                setActiveTab={setDashboardTab} 
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                userRole={userRole}
                setUserRole={setUserRole}
              />

              {/* Standard screen viewing space */}
              <div className="flex-1 min-w-0 bg-slate-950 pb-20 md:pb-0">
                <DashboardView 
                  activeTab={dashboardTab}
                  setActiveTab={setDashboardTab} 
                  activeBranch={activeBranch}
                  userRole={userRole}
                  setUserRole={setUserRole}
                  leads={leads}
                  setLeads={setLeads}
                  deals={deals}
                  setDeals={setDeals}
                  quotations={quotations}
                  setQuotations={setQuotations}
                  invoices={invoices}
                  setInvoices={setInvoices}
                  tasks={tasks}
                  setTasks={setTasks}
                  automationRules={automationRules}
                  setAutomationRules={setAutomationRules}
                  automationLogs={automationLogs}
                  setAutomationLogs={setAutomationLogs}
                />
              </div>

              {/* NATIVE TABLET / MOBILE BOTTOM NAVIGATION TAB BAR */}
              <div className="fixed md:hidden bottom-0 left-0 right-0 h-16 bg-slate-900 border-t border-slate-800/80 px-4 flex items-center justify-between z-30 shadow-2xl">
                {[
                  { tab: 'Dashboard', icon: Home, label: 'Home' },
                  { tab: 'Leads', icon: Users, label: 'Leads' },
                  { tab: 'Invoices', icon: FileText, label: 'Invoices' },
                  { tab: 'AI Control', icon: Sparkles, label: 'AI Ops' },
                  { tab: 'Automation', icon: Cpu, label: 'Rules' }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSel = dashboardTab === item.tab;
                  return (
                    <button
                      key={item.tab}
                      onClick={() => setDashboardTab(item.tab as SidebarTab)}
                      className="flex flex-col items-center justify-center flex-1 py-1 cursor-pointer"
                    >
                      <div className={`p-1 text-slate-400 rounded-full transition-all duration-200 ${isSel ? 'bg-indigo-600/20 text-indigo-400 px-3' : 'text-slate-400'}`}>
                        <Icon size={16} />
                      </div>
                      <span className={`text-[9px] font-medium mt-0.5 tracking-tight ${isSel ? 'text-indigo-400 font-bold' : 'text-slate-500'}`}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Global Quick Action Icon Button (Feature 3) */}
      {currentView === 'dashboard' && (
        <button
          onClick={() => setIsQuickDrawerOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full p-4 shadow-xl shadow-blue-500/20 border border-blue-400/25 cursor-pointer transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group font-semibold font-sans"
          title="Open Unified quick action desk"
        >
          <Sparkles size={18} className="animate-pulse" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-bold font-mono">QUICK DISPATCH</span>
        </button>
      )}

      {/* Side-Drawer Overlay Panel */}
      <AnimatePresence>
        {isQuickDrawerOpen && (
          <>
            {/* Dark wash backing */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQuickDrawerOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 cursor-crosshair"
            />

            {/* Sliding Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col justify-between overflow-hidden font-sans"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Sparkles size={14} className="text-blue-400" />
                    <span>Global Quick Dispatch Console</span>
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono tracking-wider block mt-1 uppercase">Instant system state ingestion</span>
                </div>
                <button
                  onClick={() => setIsQuickDrawerOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Navigation Tabs inside Drawer */}
              <div className="flex border-b border-slate-800 bg-slate-950/50 p-2 gap-2 text-xs font-semibold">
                <button
                  onClick={() => setQuickDrawerTab('lead')}
                  className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                    quickDrawerTab === 'lead' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  New Lead
                </button>
                <button
                  onClick={() => setQuickDrawerTab('quote')}
                  className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                    quickDrawerTab === 'quote' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Draft Quote
                </button>
                <button
                  onClick={() => setQuickDrawerTab('task')}
                  className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                    quickDrawerTab === 'task' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Add Task
                </button>
              </div>

              {/* Scrollable Form Body */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                {quickDrawerTab === 'lead' && (
                  <form onSubmit={handleQuickLeadSubmit} className="space-y-4 text-xs font-sans">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Prospect / Core Client Name</label>
                      <input
                        type="text"
                        required
                        value={qLeadName}
                        onChange={e => setQLeadName(e.target.value)}
                        placeholder="Narendra Ambani"
                        className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Company / Jewelery Firm</label>
                      <input
                        type="text"
                        required
                        value={qLeadCompany}
                        onChange={e => setQLeadCompany(e.target.value)}
                        placeholder="Reliance Royal Ornaments"
                        className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Email Address</label>
                        <input
                          type="email"
                          value={qLeadEmail}
                          onChange={e => setQLeadEmail(e.target.value)}
                          placeholder="narendra@reliance.com"
                          className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Phone Number</label>
                        <input
                          type="text"
                          value={qLeadPhone}
                          onChange={e => setQLeadPhone(e.target.value)}
                          placeholder="+91 91000 00199"
                          className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Sector Division Focus</label>
                        <select
                          value={qLeadSector}
                          onChange={e => setQLeadSector(e.target.value as any)}
                          className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-350 font-semibold focus:outline-none"
                        >
                          <option value="Jewellery">Jewellery Design</option>
                          <option value="Manufacturing">CNC Manufacturing</option>
                          <option value="Wholesale">Bulk Wholesales</option>
                          <option value="Distribution">Supply Distribution</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Forecast Valuation ($)</label>
                        <input
                          type="number"
                          value={qLeadValue}
                          onChange={e => setQLeadValue(e.target.value)}
                          className="w-full p-2 rounded-lg bg-slate-950 border border-slate-805 text-white font-mono focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Assign Representative</label>
                      <select
                        value={qLeadAssignee}
                        onChange={e => setQLeadAssignee(e.target.value)}
                        className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none"
                      >
                        <option value="Ashok Mahajan">Ashok Mahajan (Senior Designer)</option>
                        <option value="Shreya Patra">Shreya Patra (Lead Engineer)</option>
                        <option value="Sneha Dhar">Sneha Dhar (Accounts Executor)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-505 text-xs font-bold text-white rounded-xl flex items-center justify-center gap-1.5 mt-4 cursor-pointer"
                    >
                      <Plus size={13} />
                      <span>Dispatch Lead Ingest</span>
                    </button>
                  </form>
                )}

                {quickDrawerTab === 'quote' && (
                  <form onSubmit={handleQuickQuoteSubmit} className="space-y-4 text-xs font-sans">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Client Contract Name</label>
                      <input
                        type="text"
                        required
                        value={qQuoteCustomer}
                        onChange={e => setQQuoteCustomer(e.target.value)}
                        placeholder="Rajesh Maheshwari"
                        className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Firm Enterprise / Joint Operations</label>
                      <input
                        type="text"
                        value={qQuoteCompany}
                        onChange={e => setQQuoteCompany(e.target.value)}
                        placeholder="Maheshwari & Sons Gems"
                        className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Client Receipt Email</label>
                      <input
                        type="email"
                        value={qQuoteEmail}
                        onChange={e => setQQuoteEmail(e.target.value)}
                        placeholder="rajesh@maheshwari.in"
                        className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Contract Sector</label>
                        <select
                          value={qQuoteSector}
                          onChange={e => setQQuoteSector(e.target.value as any)}
                          className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-350 font-bold focus:outline-none"
                        >
                          <option value="Jewellery">Jewellery</option>
                          <option value="Manufacturing">Manufacturing</option>
                          <option value="Wholesale">Wholesale Lots</option>
                          <option value="Distribution">Distribution</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Base Price Estimate (₹)</label>
                        <input
                          type="number"
                          value={qQuoteAmount}
                          onChange={e => setQQuoteAmount(e.target.value)}
                          className="w-full p-2 rounded-lg bg-slate-950 border border-slate-805 text-white font-mono focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-550 text-xs font-bold text-white rounded-xl flex items-center justify-center gap-1.5 mt-4 cursor-pointer"
                    >
                      <FileCheck size={13} />
                      <span>Formulate Proposal Draft</span>
                    </button>
                  </form>
                )}

                {quickDrawerTab === 'task' && (
                  <form onSubmit={handleQuickTaskSubmit} className="space-y-4 text-xs font-sans">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Broadcast Task / Checklist Title</label>
                      <input
                        type="text"
                        required
                        value={qTaskTitle}
                        onChange={e => setQTaskTitle(e.target.value)}
                        placeholder="Inspect raw karat metal batch and approve alloy ratios"
                        className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Assignee Rep Portfolio</label>
                      <select
                        value={qTaskAssignee}
                        onChange={e => setQTaskAssignee(e.target.value)}
                        className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-350 font-semibold focus:outline-none"
                      >
                        <option value="Shreya Patra">Shreya Patra (Lead Engineer)</option>
                        <option value="Ashok Mahajan">Ashok Mahajan (Senior Designer)</option>
                        <option value="Sneha Dhar">Sneha Dhar (Accounts Exec)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Joint Client Reference</label>
                        <input
                          type="text"
                          value={qTaskClient}
                          onChange={e => setQTaskClient(e.target.value)}
                          placeholder="Rajputana Ornaments"
                          className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Priority SLA Level</label>
                        <select
                          value={qTaskPriority}
                          onChange={e => setQTaskPriority(e.target.value as any)}
                          className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-350 focus:outline-none font-semibold"
                        >
                          <option value="High">High (Immediate check)</option>
                          <option value="Medium">Medium (Regular loop)</option>
                          <option value="Low">Low (Administrative audit)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-550 text-xs font-bold text-white rounded-xl flex items-center justify-center gap-1.5 mt-4 cursor-pointer"
                    >
                      <ClipboardList size={13} />
                      <span>Post System Task Card</span>
                    </button>
                  </form>
                )}
              </div>

              {/* Drawer Info Footer */}
              <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2.5 text-[10px] text-slate-500">
                <CheckCircle size={12} className="text-blue-500 shrink-0" />
                <span>Saving instantly to local encrypted data store.</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
