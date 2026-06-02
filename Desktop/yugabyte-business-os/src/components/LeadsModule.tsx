import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  Phone, 
  Mail, 
  Building, 
  Clock, 
  MessageSquare, 
  PlusCircle, 
  Check, 
  X, 
  Calendar,
  Layers
} from 'lucide-react';
import { Lead, SectorType, CommunicationHistory } from '../types';

interface LeadsModuleProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
}

export default function LeadsModule({ leads, setLeads }: LeadsModuleProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState<SectorType | 'All'>('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);

  // Form Fields for new lead
  const [newName, setNewName] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newSector, setNewSector] = useState<SectorType>('Jewellery');
  const [newValue, setNewValue] = useState('15000');
  const [newNotes, setNewNotes] = useState('');

  // Add communication note field
  const [commSummary, setCommSummary] = useState('');
  const [commType, setCommType] = useState<'Email' | 'Call' | 'Meeting'>('Call');

  // Multi-tier filtering
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery);

      const matchesSector = sectorFilter === 'All' || lead.sector === sectorFilter;
      return matchesSearch && matchesSector;
    });
  }, [leads, searchQuery, sectorFilter]);

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCompany) return;

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: newName,
      company: newCompany,
      email: newEmail || 'inbox@client.com',
      phone: newPhone || '+91 0000 0000',
      status: 'Lead In',
      value: Number(newValue) || 0,
      sector: newSector,
      assignedTo: 'Ashok Mahajan',
      communicationHistory: [
        { date: new Date().toISOString().split('T')[0], type: 'Inquiry', summary: 'System initialized lead via entry capture.' }
      ],
      createdAt: new Date().toISOString().split('T')[0],
      notes: newNotes
    };

    setLeads(prev => [newLead, ...prev]);
    
    // Clear form
    setNewName('');
    setNewCompany('');
    setNewEmail('');
    setNewPhone('');
    setNewNotes('');
    setShowAddForm(false);
  };

  const handleUpdateStatus = (leadId: string, status: any) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return { ...l, status };
      }
      return l;
    }));
  };

  const handleAddCommunication = (leadId: string) => {
    if (!commSummary) return;

    const newComm: CommunicationHistory = {
      date: new Date().toISOString().split('T')[0],
      type: commType,
      summary: commSummary
    };

    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          communicationHistory: [newComm, ...l.communicationHistory]
        };
      }
      return l;
    }));

    setCommSummary('');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      
      {/* Header operations bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users size={18} className="text-blue-400" />
            <span>Customers & Lead Pipelines</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Store detailed customer contact coordinates, track metal or labor requests, and compile SLAs.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-505 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer"
        >
          {showAddForm ? <X size={14} /> : <Plus size={14} />}
          <span>{showAddForm ? "Cancel Capture" : "New Customer Lead"}</span>
        </button>
      </div>

      {/* Slide-out or Drop-down Lead Capture Form */}
      {showAddForm && (
        <form onSubmit={handleCreateLead} className="p-5 bg-slate-900 border border-blue-500/20 rounded-2xl space-y-4">
          <h3 className="text-xs font-bold text-blue-400 uppercase font-mono tracking-wider">
            Enterprise Customer Capture Panel
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Prospect Contact Name</label>
              <input 
                type="text" 
                required
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Devendra Jhanwar" 
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Company / Jewelery Firm</label>
              <input 
                type="text" 
                required
                value={newCompany}
                onChange={e => setNewCompany(e.target.value)}
                placeholder="Rajputana Royal Jewels" 
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Business Sector Category</label>
              <select 
                value={newSector}
                onChange={e => setNewSector(e.target.value as SectorType)}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-205 focus:outline-none focus:border-blue-500"
              >
                <option value="Jewellery">Jewellery Design</option>
                <option value="Manufacturing">Manufacturing & Tooling</option>
                <option value="Distribution">Wholesales Distribution</option>
                <option value="Trading">Mercantile Trading</option>
                <option value="Wholesale">Broad Wholesale Lots</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Email Address</label>
              <input 
                type="email" 
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                placeholder="client@corporate.com" 
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Mobile / Telephone Coordinates</label>
              <input 
                type="text" 
                value={newPhone}
                onChange={e => setNewPhone(e.target.value)}
                placeholder="+91 98290 XXXXX" 
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Estimated Proposal Value (₹)</label>
              <input 
                type="number" 
                value={newValue}
                onChange={e => setNewValue(e.target.value)}
                placeholder="15000" 
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Product Specifications / Precious Metal notes</label>
            <textarea 
              rows={2}
              value={newNotes}
              onChange={e => setNewNotes(e.target.value)}
              placeholder="e.g., Prefers 22K polki, customer wastage caps discussed." 
              className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-sans"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:border-slate-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-xs font-bold text-white rounded-lg flex items-center gap-1.5"
            >
              <Check size={14} />
              <span>Record Client Lead</span>
            </button>
          </div>
        </form>
      )}

      {/* Searching & Sector Filter bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-slate-900/30 p-4 rounded-xl border border-slate-900/60">
        
        {/* Search input */}
        <div className="w-full md:flex-1 relative">
          <Search size={14} className="absolute left-3 inset-y-0 my-auto text-slate-500" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search leads by name, firm, mail, phone..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 text-xs rounded-xl focus:outline-none focus:border-blue-500 placeholder-slate-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-1.5 shrink-0">
          {(['All', 'Jewellery', 'Manufacturing', 'Distribution', 'Trading', 'Wholesale'] as const).map(sec => (
            <button
              key={sec}
              onClick={() => setSectorFilter(sec)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold tracking-tight transition-all border cursor-pointer ${
                sectorFilter === sec 
                  ? 'bg-blue-600/15 border-blue-500 text-blue-400 font-bold' 
                  : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-250'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Leads tabular container */}
      <div className="bg-slate-900/20 border border-slate-900 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-xs">
            
            <thead className="bg-slate-950 text-slate-500 font-mono text-[10px] uppercase font-bold tracking-wider divide-y border-b border-slate-900">
              <tr>
                <th className="px-5 py-3">Client Firm Info</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Estimated Est.</th>
                <th className="px-5 py-3">Status Pipeline Stage</th>
                <th className="px-5 py-3">Assigned Agent</th>
                <th className="px-5 py-3 text-right">Action Logs</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-900 text-slate-300">
              {filteredLeads.map(lead => {
                const isExpanded = expandedLeadId === lead.id;

                return (
                  <React.Fragment key={lead.id}>
                    <tr className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <strong className="text-white text-xs font-semibold">{lead.name}</strong>
                          <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                            <Building size={11} className="text-slate-500" />
                            {lead.company}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 font-mono font-bold text-blue-400 text-[10px]">
                        {lead.sector}
                      </td>

                      <td className="px-5 py-4 font-mono text-slate-200">
                        ₹{lead.value.toLocaleString()}
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={lead.status}
                          onChange={e => handleUpdateStatus(lead.id, e.target.value as any)}
                          className={`p-1.5 rounded-lg text-[10px] font-bold font-mono border bg-slate-950 ${
                            lead.status === 'Closed Won' 
                              ? 'border-emerald-500/20 text-emerald-400' 
                              : lead.status === 'Closed Lost'
                              ? 'border-rose-500/20 text-rose-450'
                              : lead.status === 'Negotiation'
                              ? 'border-blue-500/20 text-blue-400'
                              : 'border-slate-800 text-slate-400'
                          }`}
                        >
                          <option value="Lead In">Lead In</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Negotiation">Negotiation</option>
                          <option value="Closed Won">Closed Won</option>
                          <option value="Closed Lost">Closed Lost</option>
                        </select>
                      </td>

                      <td className="px-5 py-4 text-slate-400">
                        {lead.assignedTo}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setExpandedLeadId(isExpanded ? null : lead.id)}
                          className="px-3 py-1.5 bg-slate-950 border border-slate-850 hover:border-slate-700 text-slate-400 hover:text-slate-100 rounded-lg text-[10px] tracking-tight font-medium"
                        >
                          {isExpanded ? "Close Notes" : "View History Logs"}
                        </button>
                      </td>
                    </tr>

                    {/* EXPANDED NOTES AND COMM HISTORY WINDOW */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={6} className="bg-slate-950/40 px-6 py-4 border-t border-b border-slate-900/60">
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            
                            {/* Specifications */}
                            <div className="lg:col-span-5 p-4 bg-slate-950 rounded-xl border border-slate-900 space-y-2">
                              <h4 className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider">
                                Spec Notes Sheet / Terms
                              </h4>
                              <p className="text-xs text-slate-300 leading-relaxed font-sans italic">
                                "{lead.notes || "No special metadata specifications declared."}"
                              </p>
                              <div className="pt-3 flex gap-4 text-[10px] text-slate-505 font-mono">
                                <span className="flex items-center gap-1">
                                  <Mail size={11} />
                                  {lead.email}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Phone size={11} />
                                  {lead.phone}
                                </span>
                              </div>
                            </div>

                            {/* Communication logs additions */}
                            <div className="lg:col-span-7 space-y-4">
                              <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-mono text-indigo-400 uppercase font-bold tracking-wider">
                                  Communication Notes History
                                </h4>
                                <div className="flex gap-2">
                                  <select 
                                    value={commType}
                                    onChange={e => setCommType(e.target.value as any)}
                                    className="p-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-semibold text-slate-400"
                                  >
                                    <option value="Call">Call</option>
                                    <option value="Email">Email</option>
                                    <option value="Meeting">Meeting</option>
                                  </select>
                                </div>
                              </div>

                              {/* Form to submit communication history */}
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={commSummary}
                                  onChange={e => setCommSummary(e.target.value)}
                                  placeholder="Discussed pricing metrics, metal rates accepted..." 
                                  className="flex-1 p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleAddCommunication(lead.id)}
                                  className="px-3.5 py-2 bg-blue-600/15 text-blue-400 hover:bg-blue-600/20 text-[10px] font-bold rounded-lg"
                                >
                                  Add Note
                                </button>
                              </div>

                              {/* Collapsed Feed List */}
                              <div className="space-y-2.5 max-h-40 overflow-y-auto">
                                {lead.communicationHistory.map((comm, idx) => (
                                  <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-905 flex items-start gap-2.5">
                                    <span className="text-[9px] font-mono font-bold bg-slate-950 text-indigo-400 px-1.5 py-0.5 rounded uppercase border border-slate-850 shrink-0">
                                      {comm.type}
                                    </span>
                                    <div className="flex-1">
                                      <p className="text-[11px] text-slate-300 font-sans leading-tight">{comm.summary}</p>
                                      <span className="text-[8px] text-slate-600 font-mono mt-0.5 block">{comm.date}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}
