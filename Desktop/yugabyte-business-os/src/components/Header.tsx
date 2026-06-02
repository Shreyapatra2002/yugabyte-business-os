import { useState, useEffect } from 'react';
import { Search, Bell, Monitor, LayoutDashboard, Menu, X, ArrowUpRight, HelpCircle, MapPin, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Branch, UserRole } from '../types';

interface HeaderProps {
  currentView: 'landing' | 'dashboard';
  setView: (view: 'landing' | 'dashboard') => void;
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
  activeBranch: Branch;
  setActiveBranch: (branch: Branch) => void;
  branches: Branch[];
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

export default function Header({ 
  currentView, 
  setView, 
  onMenuToggle, 
  isSidebarOpen,
  activeBranch,
  setActiveBranch,
  branches,
  userRole,
  setUserRole
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [showBranchMenu, setShowBranchMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Track scroll position to trigger backdrop blend visual
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const notifications = [
    { id: 1, text: `✨ [Enquiry Route] Rajputana Jewels auto-assigned to Ashok Mahajan at ${activeBranch.name}`, time: '2m ago' },
    { id: 2, text: '💰 Proposal for Narmada Wellness Co. Closed Won (₹45,050)', time: '15m ago' },
    { id: 3, text: '⚠️ Overdue notice issued to Taj Spice Traders (₹56,700)', time: '1h ago' }
  ];

  const rolesList: { level: 'Admin' | 'Manager' | 'Sales' | 'Auditor'; depts: string[] }[] = [
    { level: 'Admin', depts: ['Dashboard', 'Sales', 'Finance', 'Operations', 'AI Insights', 'Security'] },
    { level: 'Manager', depts: ['Dashboard', 'Sales', 'Finance', 'Operations', 'AI Insights'] },
    { level: 'Sales', depts: ['Dashboard', 'Sales', 'Operations'] },
    { level: 'Auditor', depts: ['Dashboard', 'Finance', 'Security'] }
  ];

  return (
    <header
      id="app-header"
      className={`sticky top-0 z-50 w-full transition-all duration-350 border-b ${
        isScrolled 
          ? 'bg-slate-950/90 backdrop-blur-md border-slate-900 shadow-xl shadow-slate-950/20' 
          : 'bg-slate-955 border-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left Side: Brand & Menu toggles */}
        <div className="flex items-center gap-3">
          {currentView === 'dashboard' && (
            <button
              id="sidebar-toggle-btn"
              onClick={onMenuToggle}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900 transition-colors md:hidden"
              aria-label="Toggle Navigation Drawer"
            >
              {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}

          <div 
            onClick={() => setView('landing')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-0.5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-all">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-blue-400 text-xs tracking-tighter">
                YB
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-extrabold text-base text-slate-100 tracking-tight leading-none group-hover:text-blue-400 transition-colors">
                YugaByte BOS
              </span>
              <span className="text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase leading-none mt-1">
                Business OS
              </span>
            </div>
          </div>
        </div>

        {/* Middle: Active Branch Switcher (Function 8) & Role Switcher (Function 10) in Dashboard View */}
        {currentView === 'dashboard' ? (
          <div className="hidden md:flex items-center gap-4">
            
            {/* Branch Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowBranchMenu(!showBranchMenu);
                  setShowRoleMenu(false);
                  setShowNotificationMenu(false);
                }}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs text-slate-350 cursor-pointer"
              >
                <MapPin size={13} className="text-blue-400" />
                <span>Active Branch: <strong className="text-white font-semibold">{activeBranch.name}</strong></span>
                <span className="text-[9px] text-slate-600 font-mono tracking-tight font-semibold">[{activeBranch.code}]</span>
              </button>

              <AnimatePresence>
                {showBranchMenu && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowBranchMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute left-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-xl z-40 p-1"
                    >
                      <div className="px-3.5 py-2 text-[10px] font-mono text-slate-500 border-b border-slate-800/60 font-semibold uppercase tracking-wider">
                        Switch Active Branch Workspace
                      </div>
                      <div className="py-1">
                        {branches.map((b) => (
                          <button
                            key={b.id}
                            onClick={() => {
                              setActiveBranch(b);
                              setShowBranchMenu(false);
                            }}
                            className={`w-full text-left px-3.5 py-2 rounded-lg text-xs leading-normal transition-colors flex flex-col ${
                              activeBranch.id === b.id 
                                ? 'bg-blue-600/15 text-blue-400 font-semibold' 
                                : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                            }`}
                          >
                            <span>{b.name}</span>
                            <span className="text-[9px] text-slate-500 font-mono italic mt-0.5">{b.location}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Role-Based Access-Control Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowRoleMenu(!showRoleMenu);
                  setShowBranchMenu(false);
                  setShowNotificationMenu(false);
                }}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs text-slate-350 cursor-pointer"
              >
                <Shield size={13} className="text-orange-400 animate-pulse" />
                <span>Access: <strong className="text-white font-semibold font-mono">{userRole.level}</strong></span>
              </button>

              <AnimatePresence>
                {showRoleMenu && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowRoleMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute left-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-xl z-40 p-1"
                    >
                      <div className="px-3.5 py-2 text-[10px] font-mono text-slate-500 border-b border-slate-800/60 font-semibold uppercase tracking-wider">
                        Configure Employee Security Role
                      </div>
                      <div className="py-1">
                        {rolesList.map((r) => (
                          <button
                            key={r.level}
                            onClick={() => {
                              setUserRole({ level: r.level, departmentsAllowed: r.depts });
                              setShowRoleMenu(false);
                            }}
                            className={`w-full text-left px-3.5 py-2 rounded-lg text-xs transition-colors flex flex-col ${
                              userRole.level === r.level 
                                ? 'bg-orange-500/15 text-orange-400 font-semibold font-mono' 
                                : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100 font-mono'
                            }`}
                          >
                            <span>{r.level} Role</span>
                            <span className="text-[9px] text-slate-500 mt-0.5 truncate">{r.depts.length} allowed departments</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

          </div>
        ) : (
          <div className="hidden md:block text-xs font-mono text-slate-500 tracking-tight text-center">
            Centralized Hub for Jewellery · Manufacturing · Distribution · Wholesales
          </div>
        )}

        {/* Right Side: Quick Action Mode Switch, Notifications, User Profile */}
        <div className="flex items-center gap-3">
          
          {/* Dashboard Toggle Switch */}
          <button
            id="view-toggle-mode-btn"
            onClick={() => setView(currentView === 'landing' ? 'dashboard' : 'landing')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold tracking-tight border shadow-xs transition-all cursor-pointer ${
              currentView === 'landing'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-blue-500/30'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800'
            }`}
          >
            {currentView === 'landing' ? (
              <>
                <span>Launch Core Dashboard</span>
                <ArrowUpRight size={13} className="animate-pulse" />
              </>
            ) : (
              <>
                <Monitor size={13} />
                <span>Log Out to Website</span>
              </>
            )}
          </button>

          {/* Quick FAQ Shortcut */}
          <button
            onClick={() => {
              setView('landing');
              setTimeout(() => {
                const qaSection = document.getElementById('landing-faq-section');
                if (qaSection) {
                  qaSection.scrollIntoView({ behavior: 'smooth' });
                }
              }, 150);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900 transition-colors hidden md:block cursor-pointer"
            title="View FAQ Help"
          >
            <HelpCircle size={18} />
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              id="notification-bell-btn"
              onClick={() => {
                setShowNotificationMenu(!showNotificationMenu);
                setShowBranchMenu(false);
                setShowRoleMenu(false);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900 transition-colors relative cursor-pointer"
              aria-label="View notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
            </button>

            {/* Notification Drawer Popover */}
            <AnimatePresence>
              {showNotificationMenu && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowNotificationMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2.5 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl z-40 py-1.5 divide-y divide-slate-800/60 overflow-hidden"
                  >
                    <div className="px-4 py-2 flex items-center justify-between bg-slate-900/80">
                      <span className="text-xs font-semibold text-slate-200">BOS Real-time Alerts</span>
                      <span className="text-[10px] font-mono text-blue-400 cursor-pointer hover:underline">Mark all read</span>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {notifications.map((n) => (
                        <div key={n.id} className="px-4 py-3 hover:bg-slate-800/40 transition-colors cursor-pointer group">
                          <p className="text-xs text-slate-300 leading-relaxed group-hover:text-slate-100">{n.text}</p>
                          <span className="text-[10px] text-slate-500 font-mono mt-1 block">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </header>
  );
}
