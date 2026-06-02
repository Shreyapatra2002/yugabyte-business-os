import React, { useState, useMemo } from 'react';
import { 
  Receipt, 
  Search, 
  Coins, 
  CreditCard, 
  TrendingUp, 
  Clock, 
  Check, 
  AlertCircle,
  BarChart,
  DollarSign
} from 'lucide-react';
import { Invoice } from '../types';

interface InvoicesModuleProps {
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
}

export default function InvoicesModule({ invoices, setInvoices }: InvoicesModuleProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Unpaid' | 'Overdue'>('All');
  
  // Payment Collection Form states
  const [activeCollectInvoice, setActiveCollectInvoice] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');

  // Dynamic Metrics calculations
  const invoicesSummary = useMemo(() => {
    const totalSales = invoices.reduce((sum, i) => sum + i.total, 0);
    const paidTotal = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.total, 0);
    const unpaidTotal = invoices.filter(i => i.status === 'Unpaid').reduce((sum, i) => sum + i.outstandingAmount, 0);
    const overdueTotal = invoices.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + i.outstandingAmount, 0);
    const recoveryRatio = totalSales > 0 ? Math.round((paidTotal / totalSales) * 100) : 100;

    return {
      totalSales,
      paidTotal,
      unpaidTotal,
      overdueTotal,
      recoveryRatio
    };
  }, [invoices]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter(i => {
      const matchesSearch = 
        i.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.companyName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || i.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchQuery, statusFilter]);

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCollectInvoice || !paymentAmount) return;

    const amt = Number(paymentAmount) || 0;

    setInvoices(prev => prev.map(inv => {
      if (inv.id === activeCollectInvoice.id) {
        const newReceived = inv.paymentReceived + amt;
        const newOutstanding = Math.max(inv.total - newReceived, 0);
        const newStatus = newOutstanding === 0 ? 'Paid' : inv.status;

        return {
          ...inv,
          paymentReceived: newReceived,
          outstandingAmount: newOutstanding,
          status: newStatus as any
        };
      }
      return inv;
    }));

    setPaymentAmount('');
    setActiveCollectInvoice(null);
  };

  const markInvoiceAsOverdue = (id: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        return {
          ...inv,
          status: 'Overdue' as any
        };
      }
      return inv;
    }));
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Receipt size={18} className="text-blue-400" />
            <span>Revenue Invoicing & Accounts Receivable Ledger</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Register and audit cash collections, calculate payment nets, monitor overdue accounts and track collection ratios.
          </p>
        </div>
      </div>

      {/* Aggregate Balance boards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Metric A */}
        <div className="p-4 bg-slate-900/40 border border-slate-900 rounded-xl">
          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block leading-none">TOTAL INVOICES ISSUED</span>
          <strong className="text-md text-slate-100 mt-1.5 block font-mono">₹{invoicesSummary.totalSales.toLocaleString()}</strong>
        </div>

        {/* Metric B */}
        <div className="p-4 bg-slate-900/40 border border-slate-900 rounded-xl">
          <span className="text-[9px] font-mono font-bold text-emerald-500 uppercase block leading-none">TOTAL RECEIVED PAYMENTS</span>
          <strong className="text-md text-emerald-400 mt-1.5 block font-mono">₹{invoicesSummary.paidTotal.toLocaleString()}</strong>
        </div>

        {/* Metric C */}
        <div className="p-4 bg-slate-900/40 border border-slate-900 rounded-xl">
          <span className="text-[9px] font-mono font-bold text-orange-500 uppercase block leading-none">UNPAID / ACTIVE BALANCE</span>
          <strong className="text-md text-orange-400 mt-1.5 block font-mono">₹{invoicesSummary.unpaidTotal.toLocaleString()}</strong>
        </div>

        {/* Metric D */}
        <div className="p-4 bg-slate-900/40 border border-slate-900 rounded-xl">
          <span className="text-[9px] font-mono font-bold text-rose-500 uppercase block leading-none">OVERDUE DEBTS CRITICAL</span>
          <strong className="text-md text-rose-400 mt-1.5 block font-mono">₹{invoicesSummary.overdueTotal.toLocaleString()}</strong>
        </div>

      </div>

      {/* Interactive Recovery gauge and wire capture form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Gauge Card left stack */}
        <div className="lg:col-span-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-900 space-y-5">
          <div className="flex items-center gap-2">
            <Coins size={14} className="text-amber-500" />
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-tight">Financial Recovery Index</h4>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-400">Cash Settlement SLA Ratio</span>
              <span className="text-emerald-400 font-mono">{invoicesSummary.recoveryRatio}% recovered</span>
            </div>
            
            <div className="h-2.5 w-full bg-slate-950 border border-slate-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${invoicesSummary.recoveryRatio}%` }}
              />
            </div>
            
            <p className="text-[10px] text-slate-500 leading-normal font-sans pt-1">
              Reflects the percentage of total sales which have fully cleared Bank transfers into cash channels.
            </p>
          </div>

          <hr className="border-slate-850/60" />

          {/* Quick inline Payment wire log */}
          {activeCollectInvoice ? (
            <form onSubmit={handleRecordPayment} className="p-4 bg-slate-950 rounded-xl border border-blue-500/15 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-blue-400 uppercase">Collect payment</span>
                <button 
                  type="button" 
                  onClick={() => setActiveCollectInvoice(null)}
                  className="text-slate-500 hover:text-white"
                >
                  <XIcon size={12} />
                </button>
              </div>

              <div>
                <p className="text-[11px] font-medium text-slate-200 leading-normal">
                  Invoice #[{activeCollectInvoice.invoiceNumber}] <br /> 
                  Outstanding: <strong className="text-orange-400 font-mono">₹{activeCollectInvoice.outstandingAmount.toLocaleString()}</strong>
                </p>
              </div>

              <div>
                <label className="block text-[9px] font-mono text-slate-505 uppercase">Wire Transfer Amount (₹)</label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500 text-xs font-mono">
                    ₹
                  </div>
                  <input 
                    type="number" 
                    required
                    max={activeCollectInvoice.outstandingAmount}
                    value={paymentAmount}
                    onChange={e => setPaymentAmount(e.target.value)}
                    placeholder="e.g. 5000"
                    className="w-full pl-7 p-1.5 rounded bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-555 text-white text-[10px] font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check size={12} />
                <span>Submit Cash Settlement Log</span>
              </button>
            </form>
          ) : (
            <div className="p-4 bg-slate-950/70 border border-slate-900 text-slate-600 rounded-xl text-center text-[10px] font-sans leading-normal">
              Click "Wire Settlement" in raw index rows and apply quick payment transfers onto unpaid accounts.
            </div>
          )}

        </div>

        {/* Tabular invoices right stack */}
        <div className="lg:col-span-8 bg-slate-900/10 border border-slate-900 rounded-2xl overflow-hidden">
          
          {/* Internal filters */}
          <div className="p-4 bg-slate-950/80 border-b border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search */}
            <div className="w-full sm:flex-1 relative">
              <Search size={13} className="absolute left-3 inset-y-0 my-auto text-slate-500" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search invoices by number or business account name..."
                className="w-full pl-9 pr-4 py-1.5 bg-slate-900 border border-slate-850 text-xs rounded-xl focus:outline-none placeholder-slate-505"
              />
            </div>

            {/* Badges filters */}
            <div className="flex gap-1">
              {(['All', 'Paid', 'Unpaid', 'Overdue'] as const).map(badge => (
                <button
                  key={badge}
                  onClick={() => setStatusFilter(badge)}
                  className={`px-3 py-1 bg-slate-900 hover:bg-slate-850 rounded-lg text-[9px] font-bold font-mono tracking-wide transition-colors border ${
                    statusFilter === badge 
                      ? 'border-blue-500 text-blue-400 bg-blue-500/5 font-extrabold' 
                      : 'border-slate-850 text-slate-500'
                  }`}
                >
                  {badge}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-xs">
              
              <thead className="bg-slate-950 border-b border-slate-900 text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                <tr>
                  <th className="px-4 py-3">Invoice Unit</th>
                  <th className="px-4 py-3">Recipient Customer</th>
                  <th className="px-4 py-3">Totals Due</th>
                  <th className="px-4 py-3">Outstanding balance</th>
                  <th className="px-4 py-3">SLA Status</th>
                  <th className="px-4 py-3 text-right">Wire Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-900 text-slate-350">
                {filteredInvoices.map(invoice => {
                  return (
                    <tr key={invoice.id} className="hover:bg-slate-900/40 transition-all">
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <strong className="text-white text-xs font-semibold">{invoice.invoiceNumber}</strong>
                          <span className="text-[9px] font-mono text-slate-550 leading-none mt-1">Generated: {invoice.date}</span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-200">{invoice.customerName}</span>
                          <span className="text-[9px] text-slate-500 mt-1">{invoice.companyName}</span>
                        </div>
                      </td>

                       <td className="px-4 py-4 font-mono font-bold text-slate-200">
                        ₹{invoice.total.toLocaleString()}
                      </td>

                      <td className="px-4 py-4 font-mono text-orange-400">
                        ₹{invoice.outstandingAmount.toLocaleString()}
                      </td>

                      <td className="px-4 py-4">
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-wide px-2 py-0.5 rounded ${
                          invoice.status === 'Paid' 
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : invoice.status === 'Overdue'
                            ? 'bg-rose-500/10 text-rose-450'
                            : 'bg-orange-500/10 text-orange-400'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {invoice.status !== 'Paid' && (
                            <>
                              {invoice.status !== 'Overdue' && (
                                <button
                                  onClick={() => markInvoiceAsOverdue(invoice.id)}
                                  className="px-2 py-1 bg-rose-600/10 text-rose-450 hover:bg-rose-600/15 text-[9px] font-bold rounded border border-rose-500/15"
                                  title="Flag as Overdue (Net timeline breached)"
                                >
                                  Delinquent
                                </button>
                              )}
                              <button
                                onClick={() => setActiveCollectInvoice(invoice)}
                                className="px-2 py-1 bg-emerald-600/10 text-emerald-400 hover:bg-emerald-605 text-[9px] font-bold rounded cursor-pointer border border-emerald-500/15"
                              >
                                Settlement
                              </button>
                            </>
                          )}
                          {invoice.status === 'Paid' && (
                            <Check size={14} className="text-slate-600 mr-4" />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>

        </div>

      </div>

    </div>
  );
}

// Simple Helper XIcon Close interface
function XIcon({ size = 14, className = "" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
