import type { ComponentType } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Target, 
  FileText, 
  Receipt, 
  CheckSquare, 
  Cpu, 
  Sparkles, 
  Lock,
  DatabaseZap,
  BookmarkCheck,
  User,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type SidebarTab = 
  | 'Dashboard' 
  | 'Leads' 
  | 'Pipeline' 
  | 'Quotations' 
  | 'Invoices' 
  | 'Team Tasks' 
  | 'Automation' 
  | 'AI Control' 
  | 'Security';

interface SidebarProps {
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  userRole: { level: 'Admin' | 'Manager' | 'Sales' | 'Auditor'; departmentsAllowed: string[] };
  setUserRole?: (role: { level: 'Admin' | 'Manager' | 'Sales' | 'Auditor'; departmentsAllowed: string[] }) => void;
}

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen, userRole, setUserRole }: SidebarProps) {
  
  const mainGroup = [
    { name: 'Dashboard', icon: LayoutDashboard, dept: 'Dashboard' },
    { name: 'Leads', icon: Users, dept: 'Sales' },
    { name: 'Pipeline', icon: Target, dept: 'Sales' },
    { name: 'Quotations', icon: FileText, dept: 'Sales' },
    { name: 'Invoices', icon: Receipt, dept: 'Finance' },
    { name: 'Team Tasks', icon: CheckSquare, dept: 'Operations' },
    { name: 'Automation', icon: Cpu, dept: 'Operations' },
    { name: 'AI Control', icon: Sparkles, dept: 'AI Insights' },
    { name: 'Security', icon: Lock, dept: 'Security' }
  ];

  const renderNavButton = (item: { name: string; icon: ComponentType<{ size?: number; className?: string }>; dept: string }, index: number) => {
    const Icon = item.icon;
    const isSelected = activeTab === item.name;
    const isAllowed = userRole.departmentsAllowed.includes(item.dept);

    return (
      <motion.button
        key={item.name}
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.035, duration: 0.28 }}
        whileTap={isAllowed ? { scale: 0.97 } : undefined}
        onClick={() => {
          if (isAllowed) {
            setActiveTab(item.name as SidebarTab);
            setIsOpen(false);
          }
        }}
        disabled={!isAllowed}
        className={`w-full flex items-center justify-between px-3.5 py-3 my-1 rounded-xl text-xs font-medium font-sans tracking-tight transition-all duration-200 group text-left ${
          !isAllowed 
            ? 'opacity-35 cursor-not-allowed'
            : isSelected 
            ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500 shadow-sm shadow-blue-500/5' 
            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
        }`}
        title={!isAllowed ? `Access Restricted for ${userRole.level} role (${item.dept} department)` : ''}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Icon 
            size={16} 
            className={`shrink-0 transition-transform duration-200 ${
              !isAllowed
                ? 'text-slate-600'
                : isSelected 
                ? 'text-blue-500 scale-110' 
                : 'text-slate-500 group-hover:text-slate-300 group-hover:scale-105'
            }`} 
          />
          <span className="truncate">{item.name}</span>
        </div>
        {isAllowed && isSelected && (
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
        )}
        {!isAllowed && (
          <Lock size={10} className="text-slate-600 shrink-0" />
        )}
      </motion.button>
    );
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-35 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        id="dashboard-sidebar"
        className={`fixed md:sticky top-14 sm:top-16 left-0 bottom-0 h-[calc(100dvh-3.5rem)] sm:h-[calc(100dvh-4rem)] w-[min(16rem,85vw)] md:w-64 bg-slate-950 border-r border-slate-900 z-40 transition-transform duration-300 ease-out md:translate-x-0 overflow-y-auto flex flex-col justify-between shadow-2xl md:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-3 sm:px-4 py-5 sm:py-6 flex-1">
          
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3 bg-gradient-to-r from-slate-950 to-slate-900/50 rounded-xl border border-slate-900 flex items-center gap-3"
          >
            <div className="h-7 w-7 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center shrink-0">
              <DatabaseZap size={14} className="text-blue-400" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[8px] sm:text-[9px] font-mono text-slate-500 font-bold tracking-wider uppercase leading-none">
                YUGABYTE BOS NETWORK
              </span>
              <span className="text-xs text-slate-300 mt-1.5 truncate font-semibold">
                Enterprise Active
              </span>
            </div>
          </motion.div>

          <div className="md:hidden mb-4 p-2.5 rounded-xl bg-slate-900/30 border border-slate-900/80 flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <div className="relative shrink-0">
                <div className="h-8 w-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300">
                  <User size={13} />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-slate-950" title="Online" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-200 truncate leading-tight">Shreya Patra</span>
                <span className="text-[9px] text-slate-500 truncate leading-tight">abc@gmail.com</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-900/80">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[8px] font-mono font-bold tracking-widest text-slate-500 uppercase">
                  ACTIVE ROLE
                </span>
                <span className="text-[8px] px-1 py-0.5 font-mono font-bold rounded bg-blue-950/45 text-blue-400 border border-blue-900/30 uppercase">
                  {userRole.level}
                </span>
              </div>
              
              {setUserRole && (
                <div className="grid grid-cols-2 gap-1">
                  {(['Admin', 'Manager', 'Sales', 'Auditor'] as const).map((lvl) => {
                    const depts = lvl === 'Admin' 
                      ? ['Dashboard', 'Sales', 'Finance', 'Operations', 'AI Insights', 'Security']
                      : lvl === 'Manager'
                      ? ['Dashboard', 'Sales', 'Finance', 'Operations', 'AI Insights']
                      : lvl === 'Sales'
                      ? ['Dashboard', 'Sales', 'Operations']
                      : ['Dashboard', 'Finance', 'Security'];
                    const isSelected = userRole.level === lvl;
                    return (
                      <button
                        key={lvl}
                        onClick={() => setUserRole({ level: lvl, departmentsAllowed: depts })}
                        className={`py-1 px-1.5 rounded-md text-left transition-all border text-[9px] font-mono truncate ${
                          isSelected
                            ? 'bg-blue-600/10 text-blue-400 border-blue-500/25 font-bold'
                            : 'bg-slate-900/30 hover:bg-slate-900/60 text-slate-400 border-slate-900/50'
                        }`}
                      >
                        {lvl}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase px-3 mb-2.5">
              Operating Core
            </p>
            <nav className="space-y-0.5">
              {mainGroup.map(renderNavButton)}
            </nav>
          </div>

        </div>

        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-900 safe-bottom">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <div className="flex items-center gap-1.5 min-w-0">
              <BookmarkCheck size={14} className="text-emerald-500 shrink-0" />
              <span className="uppercase text-[10px] font-bold text-slate-400 truncate">{userRole.level} Mode</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-blue-400 font-mono font-bold shrink-0">
              v2.6
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
