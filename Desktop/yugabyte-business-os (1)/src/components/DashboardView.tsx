import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import DashboardOverview from './DashboardOverview';
import LeadsModule from './LeadsModule';
import PipelineModule from './PipelineModule';
import QuotationsModule from './QuotationsModule';
import InvoicesModule from './InvoicesModule';
import TeamTasksModule from './TeamTasksModule';
import AutomationModule from './AutomationModule';
import AIControlModule from './AIControlModule';
import SecurityModule from './SecurityModule';
import { 
  Lead, 
  Deal, 
  Quotation, 
  Invoice, 
  Task, 
  AutomationRule, 
  AutomationLog, 
  Branch, 
  UserRole 
} from '../types';

interface DashboardViewProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  activeBranch: Branch;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;

  // Local storage synchronized datasets
  leads: Lead[];
  setLeads: React.SetStateAction<any>;
  deals: Deal[];
  setDeals: React.SetStateAction<any>;
  quotations: Quotation[];
  setQuotations: React.SetStateAction<any>;
  invoices: Invoice[];
  setInvoices: React.SetStateAction<any>;
  tasks: Task[];
  setTasks: React.SetStateAction<any>;
  automationRules: AutomationRule[];
  setAutomationRules: React.SetStateAction<any>;
  automationLogs: AutomationLog[];
  setAutomationLogs: React.SetStateAction<any>;
}

export default function DashboardView({
  activeTab,
  setActiveTab,
  activeBranch,
  userRole,
  setUserRole,
  leads,
  setLeads,
  deals,
  setDeals,
  quotations,
  setQuotations,
  invoices,
  setInvoices,
  tasks,
  setTasks,
  automationRules,
  setAutomationRules,
  automationLogs,
  setAutomationLogs
}: DashboardViewProps) {

  // Dynamic modular rendering mapping
  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <DashboardOverview 
            activeBranch={activeBranch}
            leads={leads}
            deals={deals}
            quotations={quotations}
            invoices={invoices}
            tasks={tasks}
            setActiveTab={setActiveTab}
          />
        );

      case 'Leads':
        return (
          <LeadsModule 
            leads={leads}
            setLeads={setLeads}
          />
        );

      case 'Pipeline':
        return (
          <PipelineModule 
            deals={deals}
            setDeals={setDeals}
          />
        );

      case 'Quotations':
        return (
          <QuotationsModule 
            quotations={quotations}
            setQuotations={setQuotations}
            invoices={invoices}
            setInvoices={setInvoices}
          />
        );

      case 'Invoices':
        return (
          <InvoicesModule 
            invoices={invoices}
            setInvoices={setInvoices}
          />
        );

      case 'Team Tasks':
        return (
          <TeamTasksModule 
            tasks={tasks}
            setTasks={setTasks}
          />
        );

      case 'Automation':
        return (
          <AutomationModule 
            automationRules={automationRules}
            setAutomationRules={setAutomationRules}
            automationLogs={automationLogs}
            setAutomationLogs={setAutomationLogs}
            leads={leads}
            setLeads={setLeads}
            deals={deals}
            setDeals={setDeals}
            invoices={invoices}
            setInvoices={setInvoices}
            tasks={tasks}
            setTasks={setTasks}
          />
        );

      case 'AI Control':
        return (
          <AIControlModule 
            activeSector={leads[0]?.sector || "Jewellery"} // Fallback or retrieve active leads sector context
            activeBranch={activeBranch}
            leads={leads}
            deals={deals}
            quotations={quotations}
            invoices={invoices}
            tasks={tasks}
          />
        );

      case 'Security':
        return (
          <SecurityModule 
            userRole={userRole}
            setUserRole={setUserRole}
          />
        );

      default:
        return (
          <div className="h-64 flex flex-col items-center justify-center font-sans opacity-70">
            <p className="text-sm font-semibold">Active Module Frame Out Of Limits</p>
            <span className="text-[10px] text-slate-500 font-mono mt-1">Check active sidebar router.</span>
          </div>
        );
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.99 }}
        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        className="w-full h-full"
      >
        {renderContent()}
      </motion.div>
    </AnimatePresence>
  );
}
