import React, { useState, useMemo } from 'react';
import { 
  FileSignature, 
  Plus, 
  Trash2, 
  Printer, 
  Check, 
  X, 
  Calculator, 
  Gem, 
  Factory, 
  Truck, 
  FileCheck,
  Percent,
  Coins,
  Mail,
  FileText,
  Download
} from 'lucide-react';
import { Quotation, QuotationLineItem, SectorType, Invoice } from '../types';

interface QuotationsModuleProps {
  quotations: Quotation[];
  setQuotations: React.Dispatch<React.SetStateAction<Quotation[]>>;
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
}

export default function QuotationsModule({ 
  quotations, 
  setQuotations, 
  invoices, 
  setInvoices 
}: QuotationsModuleProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quotation | null>(null);
  const [isDocViewerOpen, setIsDocViewerOpen] = useState(false);
  const [docViewerTab, setDocViewerTab] = useState<'document' | 'email'>('document');

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [sectorType, setSectorType] = useState<SectorType>('Jewellery');
  const [notes, setNotes] = useState('');

  // Item lines states
  const [lineDesc, setLineDesc] = useState('');
  const [lineQty, setLineQty] = useState('1');
  const [basePrice, setBasePrice] = useState('100');

  // Sector specific item parameters
  const [goldKarat, setGoldKarat] = useState('22');
  const [goldWeightGrams, setGoldWeightGrams] = useState('10');
  const [mfgMaterialCost, setMfgMaterialCost] = useState('50');
  const [mfgLaborCost, setMfgLaborCost] = useState('30');
  const [bulkDiscountRate, setBulkDiscountRate] = useState('0');

  const [tempItems, setTempItems] = useState<QuotationLineItem[]>([]);

  // Spot gold rate helper mock (MCX India indexes)
  const GOLD_RATE_24K_PER_GRAM = 72; // in USD equivalent for clarity
  const getGoldPricePerGram = (karat: string) => {
    const k = Number(karat);
    return Math.round((GOLD_RATE_24K_PER_GRAM * k) / 24);
  };

  const calculatedUnitPrice = useMemo(() => {
    const base = Number(basePrice) || 0;
    const qty = Number(lineQty) || 1;

    if (sectorType === 'Jewellery') {
      const goldGramCost = getGoldPricePerGram(goldKarat);
      const weight = Number(goldWeightGrams) || 0;
      // unit gold material cost + workmanship margin
      return (goldGramCost * weight) + 150; 
    }

    if (sectorType === 'Manufacturing') {
      const mat = Number(mfgMaterialCost) || 0;
      const lab = Number(mfgLaborCost) || 0;
      // bill-of-materials rate + workmanship markup
      return mat + lab;
    }

    if (sectorType === 'Wholesale' || sectorType === 'Distribution' || sectorType === 'Trading') {
      const disc = Number(bulkDiscountRate) || 0;
      // wholesale rate carrying bulk tiers
      return Math.round(base * (100 - disc) / 100);
    }

    return base;
  }, [sectorType, basePrice, goldKarat, goldWeightGrams, mfgMaterialCost, mfgLaborCost, bulkDiscountRate, lineQty]);

  const handleApplyItem = () => {
    if (!lineDesc) return;
    const qty = Number(lineQty) || 1;

    const newItem: QuotationLineItem = {
      description: lineDesc,
      quantity: qty,
      unitPrice: calculatedUnitPrice,
      lineTotal: calculatedUnitPrice * qty,
      gramWeight: sectorType === 'Jewellery' ? Number(goldWeightGrams) : undefined,
      karats: sectorType === 'Jewellery' ? Number(goldKarat) : undefined,
      materialCost: sectorType === 'Manufacturing' ? Number(mfgMaterialCost) : undefined,
      laborCost: sectorType === 'Manufacturing' ? Number(mfgLaborCost) : undefined,
      multiTierDiscount: sectorType === 'Wholesale' ? Number(bulkDiscountRate) : undefined
    };

    setTempItems(prev => [...prev, newItem]);
    
    // reset item field
    setLineDesc('');
    setLineQty('1');
    setBasePrice('100');
    setGoldWeightGrams('10');
    setMfgMaterialCost('50');
    setMfgLaborCost('30');
    setBulkDiscountRate('0');
  };

  const handleCreateQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || tempItems.length === 0) return;

    const subtotal = tempItems.reduce((sum, item) => sum + item.lineTotal, 0);
    
    // Tax structures: jewelry is 3% gold tax, manufacturing is 18% machinery, others 5% B2B
    let taxPercent = 5;
    if (sectorType === 'Jewellery') taxPercent = 3;
    else if (sectorType === 'Manufacturing') taxPercent = 18;

    const taxAmount = Math.round((subtotal * taxPercent) / 100);
    const total = subtotal + taxAmount;

    const newQuote: Quotation = {
      id: `quote-${Date.now()}`,
      quotationNumber: `BOS-Q-${new Date().getFullYear().toString().substring(2)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      customerName,
      companyName: companyName || 'Private Retail Client',
      email: customerEmail || 'client@corporate.com',
      date: new Date().toISOString().split('T')[0],
      items: tempItems,
      subtotal,
      taxPercent,
      taxAmount,
      discountTotal: 0,
      total,
      status: 'Draft',
      sector: sectorType,
      notes
    };

    setQuotations(prev => [newQuote, ...prev]);

    // reset Form
    setCustomerName('');
    setCompanyName('');
    setCustomerEmail('');
    setNotes('');
    setTempItems([]);
    setShowAddForm(false);
  };

  // Convert Quote into real Invoice workflow (Key function 3/4 bridge)
  const handleApproveQuotation = (quote: Quotation) => {
    // 1. Update quotation status
    setQuotations(prev => prev.map(q => {
      if (q.id === quote.id) {
        return { ...q, status: 'Approved' };
      }
      return q;
    }));

    // 2. Generate corresponding invoice
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `BOS-INV-${new Date().getFullYear().toString().substring(2)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      originalQuotationId: quote.id,
      customerName: quote.customerName,
      companyName: quote.companyName,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0], // Net 30 default
      items: quote.items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal
      })),
      subtotal: quote.subtotal,
      taxAmount: quote.taxAmount,
      total: quote.total,
      paymentReceived: 0,
      outstandingAmount: quote.total,
      status: 'Unpaid'
    };

    setInvoices(prev => [newInvoice, ...prev]);
    setSelectedQuote(prev => prev && prev.id === quote.id ? { ...prev, status: 'Approved' } : prev);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileSignature size={18} className="text-blue-400" />
            <span>Precious Metals & B2B Proposals Engine</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Formulate exact pricing quotes including scrap weight percentage, CNC machine rates, and Net 30 rules.
          </p>
        </div>

        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setSelectedQuote(null);
            setTempItems([]);
          }}
          className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-505 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer"
        >
          {showAddForm ? <X size={14} /> : <Plus size={14} />}
          <span>{showAddForm ? "Cancel Quote Wizard" : "Draft Quotation Proposal"}</span>
        </button>
      </div>

      {/* Adding Quote Form Wizard */}
      {showAddForm ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Quote general parameter selectors */}
          <div className="lg:col-span-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-900 space-y-4">
            <h3 className="text-xs font-bold text-blue-400 uppercase font-mono tracking-wider">
              01. Client & Industry Context
            </h3>

            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Customer / Signee Name</label>
              <input 
                type="text" 
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Devendra Jhanwar"
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Company / Jewelery Store</label>
              <input 
                type="text" 
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="Rajputana Royal Jewels"
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Customer Email</label>
              <input 
                type="email" 
                value={customerEmail}
                onChange={e => setCustomerEmail(e.target.value)}
                placeholder="sales@rajputana.com"
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Formula Model Sector</label>
              <select 
                value={sectorType}
                onChange={e => {
                  setSectorType(e.target.value as SectorType);
                  setTempItems([]); // clean items when sector changes
                }}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-350 focus:outline-none focus:border-blue-500 font-semibold"
              >
                <option value="Jewellery">Jewellery Design Engine</option>
                <option value="Manufacturing">Manufacturing & Machining</option>
                <option value="Distribution">Wholesales Tier Engine</option>
                <option value="Trading">Mercantile Trading Port</option>
                <option value="Wholesale">Broad Wholesales Lot</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Quotations Proposal Terms Notes</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={2}
                placeholder="Price matches spot gold index. Valid for 14 calendar days."
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-blue-500 font-sans"
              />
            </div>
          </div>

          {/* Lines and Calculator */}
          <div className="lg:col-span-8 bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-6">
            <h3 className="text-xs font-bold text-blue-400 uppercase font-mono tracking-wider flex items-center gap-2">
              <Calculator size={13} />
              <span>02. Formulaic Line items pricing tool</span>
            </h3>

            {/* Line items inputs */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-900 grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Product Description / Core Element</label>
                  <input 
                    type="text" 
                    value={lineDesc}
                    onChange={e => setLineDesc(e.target.value)}
                    placeholder={sectorType === 'Jewellery' ? 'Handcrafted Polki Diamond Choker' : 'nickel casting nozzle base'}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Quantity</label>
                    <input 
                      type="number" 
                      value={lineQty}
                      onChange={e => setLineQty(e.target.value)}
                      placeholder="1"
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Base Price (₹)</label>
                    <input 
                      type="number" 
                      disabled={sectorType === 'Jewellery' || sectorType === 'Manufacturing'}
                      value={basePrice}
                      onChange={e => setBasePrice(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 font-mono focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Formula inputs */}
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-850 flex flex-col justify-between">
                
                {sectorType === 'Jewellery' && (
                  <div className="space-y-3">
                    <span className="text-[9px] font-mono text-amber-500 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Gem size={11} /> Gold Gram calculation rules
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] font-mono text-slate-550 uppercase">Gold Purity (K)</label>
                        <select 
                          value={goldKarat} 
                          onChange={e => setGoldKarat(e.target.value)}
                          className="w-full p-1.5 rounded bg-slate-950 text-[10px] font-mono border border-slate-800 text-slate-200"
                        >
                          <option value="14">14 Karat (gold value: ₹{getGoldPricePerGram("14")}/g)</option>
                          <option value="18">18 Karat (gold value: ₹{getGoldPricePerGram("18")}/g)</option>
                          <option value="22">22 Karat (gold value: ₹{getGoldPricePerGram("22")}/g)</option>
                          <option value="24">24 Karat (gold value: ₹{getGoldPricePerGram("24")}/g)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono text-slate-550 uppercase">Weight (Grams)</label>
                        <input 
                          type="number" 
                          value={goldWeightGrams} 
                          onChange={e => setGoldWeightGrams(e.target.value)}
                          className="w-full p-1.5 rounded bg-slate-950 text-[10px] font-mono border border-slate-800 text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {sectorType === 'Manufacturing' && (
                  <div className="space-y-3">
                    <span className="text-[9px] font-mono text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Factory size={11} /> Bill of Materials rate matrix
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] font-mono text-slate-550 uppercase">Raw alloy materials cost (₹)</label>
                        <input 
                          type="number" 
                          value={mfgMaterialCost} 
                          onChange={e => setMfgMaterialCost(e.target.value)}
                          className="w-full p-1.5 rounded bg-slate-950 text-[10px] font-mono border border-slate-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono text-slate-550 uppercase">Machinists Labor (₹)</label>
                        <input 
                          type="number" 
                          value={mfgLaborCost} 
                          onChange={e => setMfgLaborCost(e.target.value)}
                          className="w-full p-1.5 rounded bg-slate-950 text-[10px] font-mono border border-slate-800 text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {(sectorType === 'Wholesale' || sectorType === 'Distribution' || sectorType === 'Trading') && (
                  <div className="space-y-3">
                    <span className="text-[9px] font-mono text-purple-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Percent size={11} /> Wholesale multi-tier discounts
                    </span>
                    <div>
                      <label className="block text-[9px] font-mono text-slate-550 uppercase">Tier Discount Rate (%)</label>
                      <input 
                        type="number" 
                        min="0" 
                        max="90"
                        value={bulkDiscountRate} 
                        onChange={e => setBulkDiscountRate(e.target.value)}
                        placeholder="10% discount"
                        className="w-full p-1.5 rounded bg-slate-950 text-[10px] font-mono border border-slate-800 text-white"
                      />
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-2.5 border-t border-slate-850 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-550">Dynamic Unit Estimate:</span>
                  <strong className="text-emerald-400">₹{calculatedUnitPrice.toLocaleString()}</strong>
                </div>

                <button
                  type="button"
                  onClick={handleApplyItem}
                  className="w-full py-1.5 bg-blue-600/15 text-blue-400 hover:bg-blue-600/20 text-[10px] font-bold rounded-lg mt-3"
                >
                  Apply item line
                </button>

              </div>
            </div>

            {/* Compiled Temp Lines List */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider">
                Compiled Proposal items
              </h4>
              
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {tempItems.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <h5 className="font-bold text-slate-200">{item.description}</h5>
                      <span className="text-[9px] font-mono text-slate-500 block mt-1">
                        Quantity: {item.quantity} · Rate: ₹{item.unitPrice.toLocaleString()}/unit 
                        {item.karats && ` (${item.karats}K gold weigh ${item.gramWeight}g)`}
                        {item.multiTierDiscount && ` (Applied ${item.multiTierDiscount}% discount)`}
                      </span>
                    </div>
                    <strong className="font-mono text-slate-300">₹{item.lineTotal.toLocaleString()}</strong>
                  </div>
                ))}

                {tempItems.length === 0 && (
                  <div className="py-8 text-center text-slate-650 font-sans italic text-xs">
                    No items applied to proposal yet. Select parameter and press trigger above.
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-900/60 flex items-center justify-between">
              <div className="text-xs text-slate-500 font-mono">
                Items Applied: <strong>{tempItems.length}</strong>
              </div>
              <button
                onClick={handleCreateQuotation}
                disabled={tempItems.length === 0}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-505 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-white rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <FileCheck size={14} />
                <span>Publish Draft Quotation</span>
              </button>
            </div>

          </div>

        </div>
      ) : (
        /* Grid list of quotes */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main list */}
          <div className="lg:col-span-7 bg-slate-900/10 border border-slate-900 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 bg-slate-950 border-b border-slate-900 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                Quotation Proposals ledger
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-blue-400 font-bold border border-slate-800">
                {quotations.length} elements
              </span>
            </div>

            <div className="divide-y divide-slate-900 max-h-[500px] overflow-y-auto">
              {quotations.map((quote) => (
                <div 
                  key={quote.id}
                  onClick={() => setSelectedQuote(quote)}
                  className={`p-4 hover:bg-slate-900/30 transition-all cursor-pointer flex items-center justify-between ${
                    selectedQuote?.id === quote.id ? 'bg-blue-600/5 border-l-2 border-blue-500' : ''
                  }`}
                >
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase font-bold block">{quote.quotationNumber}</span>
                    <h4 className="text-xs font-bold text-slate-200 mt-1">{quote.customerName}</h4>
                    <span className="text-[9px] text-slate-500 font-sans block mt-1">{quote.companyName} · {quote.sector} Division</span>
                  </div>
                  
                  <div className="text-right flex items-center gap-4">
                    <div className="mr-2">
                      <span className="font-mono text-xs text-slate-205 font-bold block">₹{quote.total.toLocaleString()}</span>
                      <span className={`text-[8px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded inline-block mt-1 ${
                        quote.status === 'Approved' 
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : quote.status === 'Rejected'
                          ? 'bg-rose-500/10 text-rose-450'
                          : 'bg-slate-950 text-slate-400 border border-slate-900'
                      }`}>
                        {quote.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Details preview / invoice layout mockup */}
          <div className="lg:col-span-5">
            {selectedQuote ? (
              <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-6 relative overflow-hidden">
                
                {/* Floating branding watermark */}
                <div className="absolute right-3 top-3 opacity-15 font-mono text-[9px] font-bold text-slate-500 border border-slate-800 rounded px-2 py-0.5 uppercase">
                  YUGABYTE BOS PROPOSAL SHEETS
                </div>

                {/* Sender/Receiver layout */}
                <div className="space-y-4">
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 font-bold uppercase block tracking-wider leading-none">
                      QUOTATION NUMBER
                    </span>
                    <h3 className="text-sm font-mono font-bold text-white mt-1">
                      {selectedQuote.quotationNumber}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                    <div>
                      <span className="text-[9px] font-mono text-slate-550 uppercase">Issued Client</span>
                      <strong className="block text-slate-200 font-semibold mt-1">{selectedQuote.customerName}</strong>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{selectedQuote.companyName}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-550 uppercase">Date Raised</span>
                      <strong className="block text-slate-200 mt-1">{selectedQuote.date}</strong>
                      <span className="text-[10px] text-indigo-400 font-bold mt-1 block uppercase font-mono">{selectedQuote.sector} OS</span>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-900" />

                {/* Item List */}
                <div className="space-y-2">
                  <span className="text-[9px] font-mono text-slate-550 uppercase tracking-wider block font-bold">Proposal lines</span>
                  <div className="divide-y divide-slate-900 font-sans">
                    {selectedQuote.items.map((item, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <strong className="text-slate-300 font-semibold">{item.description}</strong>
                          <span className="text-[9px] font-mono text-slate-505 block mt-0.5">
                            Qty: {item.quantity} · Rate: ₹{item.unitPrice.toLocaleString()} 
                          </span>
                        </div>
                        <strong className="font-mono text-slate-205">₹{item.lineTotal.toLocaleString()}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <hr className="border-slate-900" />

                {/* Subtotals & Taxes */}
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Subtotal matches</span>
                    <span>₹{selectedQuote.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Tax rates ({selectedQuote.taxPercent}%)</span>
                    <span>₹{selectedQuote.taxAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-100 font-bold border-t border-slate-900 pt-3">
                    <span>Grand Total Due</span>
                    <span className="text-emerald-450">₹{selectedQuote.total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Terms notes */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-900">
                  <span className="text-[8px] font-mono text-slate-550 block font-bold uppercase">Legal & Compliance Parameters</span>
                  <p className="text-[10px] text-slate-400 mt-1 font-sans italic leading-relaxed">
                    "{selectedQuote.notes || "No custom terms logged."}"
                  </p>
                </div>

                {/* Approval conversion logic */}
                <div className="pt-4 border-t border-slate-900 flex flex-col sm:flex-row gap-3">
                  {selectedQuote.status === 'Draft' || selectedQuote.status === 'Sent' ? (
                    <button
                      onClick={() => handleApproveQuotation(selectedQuote)}
                      className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-505 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Check size={14} />
                      <span>Accept & Send Invoice</span>
                    </button>
                  ) : (
                    <div className="flex-1 text-center py-2 bg-emerald-500/15 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-mono font-bold uppercase flex items-center justify-center gap-2">
                       <Check size={13} />
                       <span>Converted to Active Invoice Status</span>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setIsDocViewerOpen(true);
                      setDocViewerTab('document');
                    }}
                    className="py-2 px-4 bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-355 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer font-sans"
                  >
                    <FileText size={14} className="text-blue-400" />
                    <span>Branded PDF SLA</span>
                  </button>
                </div>

              </div>
            ) : (
              <div className="h-full flex items-center justify-center py-24 bg-slate-900/10 border border-slate-900 border-dashed rounded-2xl text-slate-650 text-xs font-medium font-sans">
                Select some quote from the list to preview details and invoice calculations.
              </div>
            )}
          </div>

        </div>
      )}

      {/* Feature 5: Automated PDF and Document Previewer Modal */}
      {isDocViewerOpen && selectedQuote && (
        <div className="fixed inset-0 bg-slate-955/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Header / Tabs Selection */}
            <div className="bg-slate-950 p-4 border-b border-slate-850 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSignature className="text-blue-400 shrink-0" size={16} />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  YugaByte BOS Document Service Generator v1.0
                </span>
              </div>
              
              <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 gap-1 ml-4 select-none">
                <button
                  type="button"
                  onClick={() => setDocViewerTab('document')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    docViewerTab === 'document' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Printer size={10} className="inline mr-1" /> Branded PDF Preview
                </button>
                <button
                  type="button"
                  onClick={() => setDocViewerTab('email')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    docViewerTab === 'email' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Mail size={10} className="inline mr-1" /> Email Dispatcher
                </button>
              </div>

              <button
                onClick={() => setIsDocViewerOpen(false)}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Content area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {docViewerTab === 'document' ? (
                /* Beautiful printable PDF simulation page */
                <div className="bg-white text-slate-900 p-8 rounded-2xl shadow-inner space-y-8 font-sans relative border border-slate-300 min-h-[500px]">
                  
                  {/* Watermark badge */}
                  <div className="absolute right-4 top-4 border-2 border-emerald-500/40 text-emerald-600 font-mono text-[9px] font-extrabold uppercase p-1.5 rotate-12 select-none">
                    {selectedQuote.status === 'Approved' ? 'APPROVED & INVOICED' : 'DRAFT OUTLINE'}
                  </div>

                  {/* Header Branded Section */}
                  <div className="flex justify-between items-start border-b border-slate-200 pb-6">
                    <div>
                      <h4 className="text-sm font-extrabold font-mono tracking-tight text-blue-900">
                        BENTON OPERATIONS SERVICES CO.
                      </h4>
                      <p className="text-[10px] text-slate-500 font-medium">
                        100 Enterprise Boulevard, Suite 500<br />
                        Operations Center, NY 10001<br />
                        support@bentonoperations.com | (212) 555-0199
                      </p>
                    </div>
                    <div className="text-right">
                      <h1 className="text-lg font-black text-slate-800 uppercase tracking-widest leading-none">
                        PROPOSAL OUTLINE
                      </h1>
                      <span className="font-mono text-xs font-bold text-slate-600 block mt-1">
                        SLA NO: {selectedQuote.quotationNumber}
                      </span>
                    </div>
                  </div>

                  {/* Client Metadata block */}
                  <div className="grid grid-cols-2 gap-8 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider font-mono">
                        Client Entity / Recipient:
                      </span>
                      <strong className="block text-slate-900 mt-1 font-bold text-sm">
                        {selectedQuote.customerName}
                      </strong>
                      <p className="text-slate-500 mt-1">
                        {selectedQuote.companyName} Division Office<br />
                        Operational Sector: {selectedQuote.sector} Core<br />
                        {selectedQuote.customerEmail || "No Email Provided"}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider font-mono">
                        Document Metadata:
                      </span>
                      <p className="text-slate-600 mt-1 space-y-1">
                        <strong>Date Issued:</strong> {selectedQuote.date}<br />
                        <strong>Payment Due Term:</strong> NET 30 Business Days<br />
                        <strong>Authorized Signature:</strong> YugaByte BOS Executive Council
                      </p>
                    </div>
                  </div>

                  {/* Table List of line items */}
                  <div className="border border-slate-200 rounded-lg overflow-x-auto">
                    <table className="w-full min-w-[550px] text-xs text-left text-slate-700">
                      <thead className="bg-slate-100 border-b border-slate-200 font-mono text-[9px] uppercase text-slate-600 font-extrabold">
                        <tr>
                          <th className="py-2 px-3">Description of Delivered Deliverable</th>
                          <th className="py-2 px-3 text-center">Qty</th>
                          <th className="py-2 px-3 text-right">Unit Price</th>
                          <th className="py-2 px-3 text-right">Line Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150">
                        {selectedQuote.items.map((item, index) => (
                          <tr key={index}>
                            <td className="py-3 px-3 font-semibold text-slate-800">
                              {item.description}
                            </td>
                            <td className="py-3 px-3 text-center font-mono">
                              {item.quantity}
                            </td>
                            <td className="py-3 px-3 text-right font-mono">
                              ₹{item.unitPrice.toLocaleString()}
                            </td>
                            <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                              ₹{item.lineTotal.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Financial subtotaling matrix */}
                  <div className="flex justify-end pt-2">
                    <div className="w-64 space-y-2 text-xs text-right text-slate-700">
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span>Corporate Net Subtotal:</span>
                        <span className="font-mono font-bold">₹{selectedQuote.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span>Sector Tax Burden ({selectedQuote.taxPercent}%):</span>
                        <span className="font-mono">₹{selectedQuote.taxAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-1">
                        <span>Total Obligation Due:</span>
                        <span className="font-mono text-indigo-900">₹{selectedQuote.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Terms / Clauses */}
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[9px] font-bold uppercase text-slate-500 font-mono block">
                      Legal Compliance Clause & Executive Notes
                    </span>
                    <p className="text-[10px] text-slate-600 italic mt-1 leading-relaxed">
                      "{selectedQuote.notes || "This offer is valid for a duration of sixty calendar days from the date of issue. All services outlined herein are backed by our enterprise-level SLA agreements and standard operational protocols."}"
                    </p>
                  </div>

                  {/* Signature Blocks */}
                  <div className="grid grid-cols-2 gap-12 pt-8 text-[11px] font-sans">
                    <div>
                      <div className="border-b border-slate-300 h-8 opacity-60"></div>
                      <p className="text-slate-500 pt-1 text-center font-mono uppercase font-bold text-[9px]">
                        YugaByte BOS Representative
                      </p>
                    </div>
                    <div>
                      <div className="border-b border-slate-300 h-8 opacity-60"></div>
                      <p className="text-slate-500 pt-1 text-center font-mono uppercase font-bold text-[9px]">
                        Acknowledged & Client Signee
                      </p>
                    </div>
                  </div>

                </div>
              ) : (
                /* Auto Email Draft composer mockup */
                <div className="space-y-4">
                  <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-3 font-sans">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                      <span className="text-[10px] font-mono text-slate-500">Draft Email To:</span>
                      <strong className="text-xs text-blue-400 font-mono">{selectedQuote.customerEmail || "client@entity.com"}</strong>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                      <span className="text-[10px] font-mono text-slate-500">Subject:</span>
                      <strong className="text-xs text-white">Proposal & Pricing Schedule: {selectedQuote.quotationNumber}</strong>
                    </div>
                  </div>

                  {/* Email text body */}
                  <div className="p-5 bg-slate-950 border border-slate-850 rounded-2xl space-y-4 font-normal text-xs text-slate-300 leading-relaxed font-mono">
                    <p>Dear {selectedQuote.customerName},</p>
                    <p>
                      Please find attached our finalized operational proposal schedule <strong>{selectedQuote.quotationNumber}</strong> covering the {selectedQuote.sector} sector requirements.
                    </p>
                    <p>
                      <strong>Summary of Financial Terms:</strong><br />
                      - Quotation reference: {selectedQuote.quotationNumber}<br />
                      - Outlined deliverables: {selectedQuote.items.length} positions<br />
                      - Contractual Value: ₹{selectedQuote.total.toLocaleString()} INR (gross, including all standard taxes)<br />
                      - Payment Timeline: NET 30 business terms upon final authorization.
                    </p>
                    <p>
                      Please let us know if you have any questions or require revisions. We are looking forward to partnering with your division framework.
                    </p>
                    <p>
                      Best Regards,<br />
                      <strong>YugaByte BOS Services Team</strong>
                    </p>
                  </div>

                  {/* Micro-Interaction Indicator */}
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs rounded-xl flex items-center gap-2">
                    <FileCheck className="shrink-0 text-blue-400" size={12} />
                    <span>This proposal's details have been compiled automatically based on active ledger inputs.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action buttons */}
            <div className="bg-slate-950 p-4 border-t border-slate-850 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500">
                Authorized securely as digital PDF layout template v1.0
              </span>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    // Trigger simulated client delivery of PDF or Email draft
                    alert(`Dispatched documents for ${selectedQuote.quotationNumber} successfully! Simulated client delivery active.`);
                    setIsDocViewerOpen(false);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Check size={12} />
                  <span>Execute Sendout</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
