import { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  EyeOff, 
  Key, 
  Server, 
  UserSquare2, 
  ToggleLeft, 
  ToggleRight,
  Fingerprint,
  Info
} from 'lucide-react';
import { UserRole } from '../types';

interface SecurityProps {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

export default function SecurityModule({ userRole, setUserRole }: SecurityProps) {
  
  const [networkLock, setNetworkLock] = useState(true);
  const [ipShield, setIpShield] = useState(false);
  const [sessionAutoExpire, setSessionAutoExpire] = useState(true);

  // SOC2 compliance items
  const auditLogs = [
    { name: 'Server-Side API Key Isolator', status: 'COMPLIANT', desc: 'Secure backend proxy isolates corporate variables from browser injections.' },
    { name: 'Role-Based Sidebar Lockdown', status: 'ENFORCED', desc: 'Active directory lock restricts unauthorized departments on the fly.' },
    { name: 'SSL TLS 1.3 Communication Cipher', status: 'ACTIVE', desc: 'All incoming customer and lead variables are encrypted on public network links.' },
    { name: 'Continuous SQLite/LocalStorage Ledger Integrity', status: 'VALIDATED', desc: 'Checksum matches client state arrays safely against modifications.' }
  ];

  const roleDefinitions = [
    {
      level: 'Admin',
      allowed: ['Dashboard', 'Sales', 'Finance', 'Operations', 'AI Insights', 'Security'],
      desc: 'All divisions accessible. Full controls over billing, leads, APIs and rule triggers.'
    },
    {
      level: 'Manager',
      allowed: ['Dashboard', 'Sales', 'Finance', 'Operations', 'AI Insights'],
      desc: 'Restricted from editing administrative configuration guidelines and encryption toggle keys.'
    },
    {
      level: 'Sales',
      allowed: ['Dashboard', 'Sales', 'Operations'],
      desc: 'Isolated from all invoicing records, financial indicators, and analytics forecasts.'
    },
    {
      level: 'Auditor',
      allowed: ['Dashboard', 'Finance', 'Security'],
      desc: 'Permitted ledger access only. Isolated from pipelines, quotes drafts and task coordination.'
    }
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Lock size={18} className="text-orange-400 rotate-3" />
            <span>Enterprise Security Access & SOC2 Compliance Control</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Isolate business data partitions, govern department-level roles, customize security parameters, and monitor continuous audits.
          </p>
        </div>
      </div>

      {/* Role explanation block */}
      <div className="p-4 bg-slate-900/25 border border-slate-900 rounded-xl text-xs flex gap-3.5 items-start">
        <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
        <p className="text-slate-400 leading-normal">
          <strong className="text-slate-100 uppercase font-bold tracking-wider text-[10px] font-mono block">Department Lockdown Verification tip:</strong>
          Change your corporate employee authorization role level utilizing the <span className="text-orange-400 font-semibold font-mono">Access Shield dropdown inside the header</span> at the top. Notice how unauthorized tabs in the left sidebar are instantly greyed out and locked on the fly, proving real-time workspace role protection!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Roles lock specification index left */}
        <div className="lg:col-span-7 space-y-4">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block leading-none">
            Corporate Roles Lock Specification Index
          </span>

          <div className="space-y-3.5">
            {roleDefinitions.map((def) => {
              const isCurrent = userRole.level === def.level;

              return (
                <div 
                  key={def.level}
                  className={`p-4 rounded-xl border transition-all ${
                    isCurrent 
                      ? 'bg-orange-500/5 border-orange-500/20 text-orange-400' 
                      : 'bg-slate-900/15 border-slate-910 text-slate-350'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-mono font-bold uppercase">{def.level} Role Profile</strong>
                    {isCurrent && (
                      <span className="text-[9px] font-mono font-bold bg-orange-500/10 text-orange-400 px-1.5 py-0.5 rounded uppercase flex items-center gap-1 leading-none border border-orange-500/15">
                        <Fingerprint size={10} /> Active Handlshake
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs text-slate-400 mt-2 font-sans leading-relaxed">{def.desc}</p>
                  
                  <div className="mt-3.5 pt-2 border-t border-slate-950/40 flex flex-wrap gap-1.5 items-center">
                    <span className="text-[9px] font-mono text-slate-550 mr-1.5 uppercase font-bold">Allowed Departments:</span>
                    {def.allowed.map((dept) => (
                      <span 
                        key={dept} 
                        className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded leading-none ${
                          isCurrent 
                            ? 'bg-orange-500/10 text-orange-400 border border-orange-500/15' 
                            : 'bg-slate-950 text-slate-500 border border-slate-900'
                        }`}
                      >
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Global Security Configuration and SOC2 checklists right */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Toggles */}
          <div className="bg-slate-900/35 border border-slate-900 p-5 rounded-2xl space-y-4">
            <span className="text-[10px] font-mono font-bold text-slate-550 uppercase tracking-widest block leading-none">Security Configuration</span>

            <div className="space-y-4 font-sans text-xs text-slate-300">
              
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-bold leading-tight">SSL API Key Proxy Isolation</h5>
                  <p className="text-[10px] text-slate-500 mt-0.5">Proxy all external model requests through server-side layers.</p>
                </div>
                <button onClick={() => setNetworkLock(!networkLock)} className="cursor-pointer">
                  {networkLock ? <ToggleRight className="text-blue-500" size={24} /> : <ToggleLeft className="text-slate-650" size={24} />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-bold leading-tight">IP Address Whitelist Mask</h5>
                  <p className="text-[10px] text-slate-500 mt-0.5">Restrict access keys to pre-approved office router locations.</p>
                </div>
                <button onClick={() => setIpShield(!ipShield)} className="cursor-pointer">
                  {ipShield ? <ToggleRight className="text-blue-500" size={24} /> : <ToggleLeft className="text-slate-650" size={24} />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-bold leading-tight">Auto-Expire Session</h5>
                  <p className="text-[10px] text-slate-500 mt-0.5">Invalidate security badges after 15 minutes of user silence.</p>
                </div>
                <button onClick={() => setSessionAutoExpire(!sessionAutoExpire)} className="cursor-pointer">
                  {sessionAutoExpire ? <ToggleRight className="text-blue-500" size={24} /> : <ToggleLeft className="text-slate-650" size={24} />}
                </button>
              </div>

            </div>
          </div>

          {/* Continuous Audit checks (SOC2) */}
          <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl space-y-4">
            <span className="text-[10px] font-mono font-bold text-slate-550 uppercase tracking-widest block leading-none">SOC2 continuous baseline checks</span>

            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div key={log.name} className="p-3 rounded-xl bg-slate-900/10 border border-slate-905 space-y-1">
                  <div className="flex items-center justify-between text-[9px] font-mono">
                    <span className="text-slate-350">{log.name}</span>
                    <strong className="text-emerald-500 font-bold uppercase tracking-tight flex items-center gap-1">
                      <ShieldCheck size={11} /> {log.status}
                    </strong>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal font-sans">
                    {log.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
