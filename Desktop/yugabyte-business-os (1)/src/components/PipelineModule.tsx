import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Layers2, 
  Check, 
  X,
  TrendingUp,
  LineChart,
  LayoutGrid,
  Trash2,
  Table
} from 'lucide-react';
import { Deal, SectorType } from '../types';

interface PipelineModuleProps {
  deals: Deal[];
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>;
}

export default function PipelineModule({ deals, setDeals }: PipelineModuleProps) {
  const [showAddForm, setShowAddForm] = useState(false);

  // Form Fields
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newValue, setNewValue] = useState('25000');
  const [newStage, setNewStage] = useState<any>('Discovery');
  const [newProb, setNewProb] = useState('50');
  const [newSector, setNewSector] = useState<SectorType>('Jewellery');

  const pipelineStages = [
    { id: 'Discovery', title: '01. Discovery', border: 'border-slate-850', bg: 'bg-indigo-500/10' },
    { id: 'Proposal', title: '02. Proposal', border: 'border-slate-850', bg: 'bg-blue-500/10' },
    { id: 'Negotiation', title: '03. Negotiation', border: 'border-slate-800', bg: 'bg-purple-500/10' },
    { id: 'Contract', title: '04. Contract Pending', border: 'border-slate-800', bg: 'bg-cyan-500/10' },
    { id: 'Closed Won', title: '05. Closed Won', border: 'border-emerald-500/25', bg: 'bg-emerald-500/5' }
  ];

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCompany) return;

    const val = Number(newValue) || 0;
    const prob = Number(newProb) || 50;

    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      title: newTitle,
      company: newCompany,
      value: val,
      stage: newStage,
      probability: prob,
      expectedRevenue: Math.round((val * prob) / 100),
      forecastDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      sector: newSector
    };

    setDeals(prev => [newDeal, ...prev]);

    // Clear and toggle
    setNewTitle('');
    setNewCompany('');
    setNewValue('25000');
    setNewProb('50');
    setShowAddForm(false);
  };

  const handleShiftStage = (dealId: string, targetStage: any) => {
    setDeals(prev => prev.map(d => {
      if (d.id === dealId) {
        let prob = d.probability;
        // Adjust probability based on standard sales stage increments
        if (targetStage === 'Discovery') prob = 20;
        else if (targetStage === 'Proposal') prob = 40;
        else if (targetStage === 'Negotiation') prob = 60;
        else if (targetStage === 'Contract') prob = 80;
        else if (targetStage === 'Closed Won') prob = 100;
        else if (targetStage === 'Closed Lost') prob = 0;

        return {
          ...d,
          stage: targetStage,
          probability: prob,
          expectedRevenue: Math.round((d.value * prob) / 100)
        };
      }
      return d;
    }));
  };

  // State controls for layout toggle
  const [layoutMode, setLayoutMode] = useState<'kanban' | 'grid'>('kanban');

  const handleUpdateDealField = (dealId: string, field: keyof Deal, value: any) => {
    setDeals(prev => prev.map(d => {
      if (d.id === dealId) {
        const updatedDeal = { ...d, [field]: value };
        if (field === 'stage') {
          let prob = d.probability;
          if (value === 'Discovery') prob = 20;
          else if (value === 'Proposal') prob = 40;
          else if (value === 'Negotiation') prob = 60;
          else if (value === 'Contract') prob = 85;
          else if (value === 'Closed Won') prob = 100;
          else if (value === 'Closed Lost') prob = 0;
          updatedDeal.probability = prob;
        }
        // Recalculate anticipated yield
        updatedDeal.expectedRevenue = Math.round((Number(updatedDeal.value) * Number(updatedDeal.probability)) / 100);
        return updatedDeal;
      }
      return d;
    }));
  };

  const handleDeleteDeal = (dealId: string) => {
    setDeals(prev => prev.filter(d => d.id !== dealId));
  };

  const totalExpectedRevenue = deals.reduce((sum, d) => sum + d.expectedRevenue, 0);
  const totalWeightedDealsCount = deals.filter(d => d.stage !== 'Closed Lost').length;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Target size={18} className="text-blue-400" />
            <span>Sales & Pipeline Forecasting</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Map out deal pipelines, score transaction margins dynamically, and lock forecast dates.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-505 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer"
        >
          {showAddForm ? <X size={14} /> : <Plus size={14} />}
          <span>{showAddForm ? "Cancel Deal" : "New Pipeline Deal"}</span>
        </button>
      </div>

      {/* Aggregate Header stats */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch justify-between bg-slate-900/10 p-4 rounded-2xl border border-slate-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-emerald-500 shrink-0" size={16} />
            <div>
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block tracking-wider leading-none">TOTAL PROBABILITY WEIGHTED PIPELINE</span>
              <strong className="text-sm text-slate-205 mt-1 block font-mono">₹{totalExpectedRevenue.toLocaleString()} expected</strong>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LineChart className="text-blue-400 shrink-0" size={16} />
            <div>
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block tracking-wider leading-none">ACTIVE TRACKED DEALS COUNT</span>
              <strong className="text-sm text-slate-205 mt-1 block font-mono">{totalWeightedDealsCount} pipeline elements</strong>
            </div>
          </div>
        </div>

        {/* Layout Modality Toggler (Feature 4) */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-850 gap-1 self-start lg:self-center">
          <button
            type="button"
            onClick={() => setLayoutMode('kanban')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              layoutMode === 'kanban' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid size={12} />
            <span>Kanban Board</span>
          </button>
          <button
            type="button"
            onClick={() => setLayoutMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              layoutMode === 'grid' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Table size={12} />
            <span>Spreadsheet Rows</span>
          </button>
        </div>
      </div>

      {/* Add Deal Window */}
      {showAddForm && (
        <form onSubmit={handleCreateDeal} className="p-5 bg-slate-900 border border-blue-500/20 rounded-2xl space-y-4">
          <h3 className="text-xs font-bold text-blue-400 uppercase font-mono tracking-wider">
            Create Deal Pipeline Instance
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Deal Title</label>
              <input 
                type="text" 
                required
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="22K Choker Gold Deal" 
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Account Company Firm</label>
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
              <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Sector Division Focus</label>
              <select 
                value={newSector}
                onChange={e => setNewSector(e.target.value as SectorType)}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-205 focus:outline-none focus:border-blue-500"
              >
                <option value="Jewellery">Jewellery Division</option>
                <option value="Manufacturing">Manufacturing Division</option>
                <option value="Distribution">Wholesales Distribution</option>
                <option value="Trading">Mercantile Trading</option>
                <option value="Wholesale">Broad Wholesale Lots</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Full Deal Value (₹)</label>
              <input 
                type="number" 
                required
                value={newValue}
                onChange={e => setNewValue(e.target.value)}
                placeholder="25000" 
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-805 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Initial Probability Rate (%)</label>
              <input 
                type="number" 
                min="0" 
                max="100"
                required
                value={newProb}
                onChange={e => setNewProb(e.target.value)}
                placeholder="50" 
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-805 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Target Stage</label>
              <select 
                value={newStage}
                onChange={e => setNewStage(e.target.value as any)}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-805 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="Discovery">Discovery (20%)</option>
                <option value="Proposal">Proposal (40%)</option>
                <option value="Negotiation">Negotiation (60%)</option>
                <option value="Contract">Contract Pending (80%)</option>
                <option value="Closed Won">Closed Won (100%)</option>
                <option value="Closed Lost">Closed Lost (0%)</option>
              </select>
            </div>
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
              <span>Initiate Deal Code</span>
            </button>
          </div>
        </form>
      )}

      {/* Kanban vs Spreadsheet Rows render routing */}
      {layoutMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {pipelineStages.map((stage) => {
            const stageDeals = deals.filter(d => d.stage === stage.id);
            const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0);

            return (
              <div 
                key={stage.id}
                className={`p-4 rounded-2xl bg-slate-900/10 border ${stage.border} flex flex-col min-h-[480px] space-y-4`}
              >
                {/* Header */}
                <div className="border-b border-slate-900 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-100 font-sans tracking-tight">{stage.title}</h3>
                    <span className="text-[9px] font-mono text-slate-500 font-bold block mt-1">
                      Value: ₹{stageTotal.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-blue-400 font-bold">
                    {stageDeals.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {stageDeals.map((deal) => (
                    <div 
                      key={deal.id}
                      className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-850 hover:border-slate-700 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[8px] font-mono font-bold bg-blue-600/10 border border-blue-500/15 text-blue-400 px-1.5 py-0.5 rounded leading-none">
                          {deal.sector}
                        </span>
                        <h4 className="text-xs font-bold text-slate-200 leading-tight mt-2">{deal.title}</h4>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-1 font-sans">
                          <User size={10} className="text-slate-500" />
                          {deal.company}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-950/60 leading-none">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-slate-550 font-bold uppercase leading-none">Valuation</span>
                          <strong className="text-xs font-mono text-slate-202 leading-none">₹{deal.value.toLocaleString()}</strong>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[9px] font-mono text-slate-550 leading-none">Confidence</span>
                          <span className="text-[9px] font-mono text-indigo-400 font-bold leading-none">{deal.probability}%</span>
                        </div>

                        {/* Manual Quick Action Controls (Ergonomic Dropdown) */}
                        <div className="mt-3">
                          <select
                            value={deal.stage}
                            onChange={e => handleShiftStage(deal.id, e.target.value as any)}
                            className="w-full text-[9px] font-mono font-bold bg-slate-950 border border-slate-850 rounded p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
                          >
                            <option value="Discovery">Discovery (20%)</option>
                            <option value="Proposal">Proposal (40%)</option>
                            <option value="Negotiation">Negotiation (60%)</option>
                            <option value="Contract">Contract Pending (80%)</option>
                            <option value="Closed Won">Closed Won (100%)</option>
                            <option value="Closed Lost">Closed Lost (0%)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}

                  {stageDeals.length === 0 && (
                    <div className="h-full items-center justify-center flex flex-col py-10 opacity-30 italic text-[10px] text-slate-500">
                      Empty Stage
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Feature 4: Interactive Inline-Editing Spreadsheet rows design */
        <div className="p-4 rounded-2xl bg-slate-900/10 border border-slate-900 overflow-x-auto">
          <table className="w-full min-w-[800px] text-xs text-left text-slate-300 font-sans border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] uppercase font-mono text-slate-500 font-bold">
                <th className="py-2.5 px-3">Deal Details</th>
                <th className="py-2.5 px-3">Enterprise Firm</th>
                <th className="py-2.5 px-3">sector</th>
                <th className="py-2.5 px-3 w-32">Deal Valuation (₹)</th>
                <th className="py-2.5 px-3 w-40">Process Stage</th>
                <th className="py-2.5 px-3 w-40">Confidence SLA (%)</th>
                <th className="py-2.5 px-3 w-32 text-right">Anticipated Yield</th>
                <th className="py-2.5 px-3 w-12 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {deals.map(deal => (
                <tr key={deal.id} className="hover:bg-slate-900/30 group">
                  <td className="py-3 px-3">
                    <input
                      type="text"
                      value={deal.title}
                      onChange={e => handleUpdateDealField(deal.id, 'title', e.target.value)}
                      className="bg-transparent border-b border-transparent focus:border-blue-500 text-white focus:outline-none w-full font-semibold focus:bg-slate-950 p-1 rounded transition-all"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <input
                      type="text"
                      value={deal.company}
                      onChange={e => handleUpdateDealField(deal.id, 'company', e.target.value)}
                      className="bg-transparent border-b border-transparent focus:border-blue-500 text-slate-400 focus:outline-none w-full focus:bg-slate-950 p-1 rounded transition-all"
                    />
                  </td>
                  <td className="py-3 px-3 font-mono text-[10px] text-slate-400">
                    <select
                      value={deal.sector}
                      onChange={e => handleUpdateDealField(deal.id, 'sector', e.target.value as any)}
                      className="bg-slate-950 border border-slate-855 p-1 rounded text-slate-300 focus:outline-none text-[10px]"
                    >
                      <option value="Jewellery">Jewellery</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Wholesale">Wholesale</option>
                      <option value="Distribution">Distribution</option>
                    </select>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center bg-slate-950 border border-slate-850 px-2 py-1 rounded w-28">
                      <span className="text-slate-550 mr-1 font-mono">₹</span>
                      <input
                        type="number"
                        value={deal.value}
                        onChange={e => handleUpdateDealField(deal.id, 'value', Number(e.target.value))}
                        className="bg-transparent text-white font-mono text-xs focus:outline-none w-full text-right"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <select
                      value={deal.stage}
                      onChange={e => handleUpdateDealField(deal.id, 'stage', e.target.value as any)}
                      className="bg-slate-950 border border-slate-850 p-1.5 rounded-lg text-slate-350 font-bold focus:outline-none w-36 text-xs"
                    >
                      <option value="Discovery">01. Discovery</option>
                      <option value="Proposal">02. Proposal</option>
                      <option value="Negotiation">03. Negotiation</option>
                      <option value="Contract">04. Contract Pending</option>
                      <option value="Closed Won">05. Closed Won</option>
                      <option value="Closed Lost">06. Closed Lost</option>
                    </select>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2 w-36">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={deal.probability}
                        onChange={e => handleUpdateDealField(deal.id, 'probability', Number(e.target.value))}
                        className="flex-1 accent-indigo-505"
                      />
                      <span className="font-mono text-[10px] font-bold text-indigo-400 w-8 text-right">
                        {deal.probability}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-right text-emerald-450 pr-4">
                    ₹{deal.expectedRevenue.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteDeal(deal.id)}
                      className="p-1 rounded bg-slate-950 hover:bg-rose-500/10 hover:text-rose-500 text-slate-550 border border-slate-850 hover:border-rose-500/20 cursor-pointer"
                      title="Purge transaction card"
                    >
                      <Trash2 size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
