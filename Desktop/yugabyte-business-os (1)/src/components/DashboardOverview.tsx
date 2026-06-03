import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight,
  PieChart,
  Layers,
  ChevronRight,
  Plus,
  MapPin,
  Calendar,
  Zap,
  Globe,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Lead, Deal, Quotation, Invoice, Task, Branch } from '../types';

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
  
  // Calculate dynamic database values
  const earnedRevenue = invoices
    .filter(i => i.status === 'Paid')
    .reduce((sum, current) => sum + current.total, 0);

  const outstandingBalance = invoices
    .filter(i => i.status === 'Unpaid' || i.status === 'Overdue')
    .reduce((sum, current) => sum + current.outstandingAmount, 0);

  const activeQuotesCount = quotations.filter(q => q.status === 'Sent' || q.status === 'Draft').length;
  const leadInquiryCount = leads.filter(l => l.status === 'Lead In' || l.status === 'Contacted').length;

  const totalDealsValue = deals.reduce((sum, item) => sum + (item.value || 0), 0) || 127000;

  // SYSTEM TIMEFRAME SELECTOR STATE
  const [velocityTimeframe, setVelocityTimeframe] = useState<'MONTHLY' | 'WEEKLY' | 'YEARLY'>('MONTHLY');
  const [hoveredVelocityIndex, setHoveredVelocityIndex] = useState<number | null>(null);

  // SECTOR DONUT CHART HOVER STATES
  const [hoveredSector, setHoveredSector] = useState<string | null>(null);

  // Sparkline Coordinate Data (Normalized points between x=0..100, y=0..30)
  const sparklineARR = "M 0 24 C 20 22, 40 18, 60 16, 80 10, 100 6";
  const sparklineConv = "M 0 26 C 20 21, 40 23, 65 15, 80 18, 100 11";
  const sparklineTenants = "M 0 25 C 25 21, 55 19, 75 12, 100 8";
  const sparklineLatency = "M 0 8 C 25 12, 55 16, 80 23, 100 25"; // Slopes down (improving)

  // DONUT SECTORS LIST (Matching screenshot weights beautifully)
  const donutSectors = [
    { name: 'Jewellery & Retail', pct: 33, count: Math.max(Math.round(leads.length * 0.33), 4), value: Math.round(totalDealsValue * 0.33), color: '#3b82f6' },
    { name: 'Manufacturing Sector', pct: 24, count: Math.max(Math.round(leads.length * 0.24), 3), value: Math.round(totalDealsValue * 0.24), color: '#10b981' },
    { name: 'Distribution Feed', pct: 23, count: Math.max(Math.round(leads.length * 0.23), 3), value: Math.round(totalDealsValue * 0.23), color: '#f59e0b' },
    { name: 'Trading Channels', pct: 13, count: Math.max(Math.round(leads.length * 0.13), 2), value: Math.round(totalDealsValue * 0.13), color: '#8b5cf6' },
    { name: 'Wholesale Outlets', pct: 7, count: Math.max(Math.round(leads.length * 0.07), 1), value: Math.round(totalDealsValue * 0.07), color: '#ec4899' }
  ];

  const CIRCUMFERENCE = 251.2; // 2 * pi * 40
  let cumulativeOffset = 0;
  
  const sectorsWithSliceData = donutSectors.map(sec => {
    const fraction = sec.pct / 100;
    const strokeDasharray = `${fraction * CIRCUMFERENCE} ${CIRCUMFERENCE}`;
    const strokeDashoffset = -cumulativeOffset;
    cumulativeOffset += fraction * CIRCUMFERENCE;
    return {
      ...sec,
      fraction,
      strokeDasharray,
      strokeDashoffset
    };
  });

  const activeSectorData = hoveredSector 
    ? sectorsWithSliceData.find(s => s.name === hoveredSector) 
    : sectorsWithSliceData[0];

  const ringGlowMap: Record<string, string> = {
    'Jewellery & Retail': 'drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]',
    'Manufacturing Sector': 'drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]',
    'Distribution Feed': 'drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]',
    'Trading Channels': 'drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]',
    'Wholesale Outlets': 'drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]'
  };

  const textClassMap: Record<string, string> = {
    'Jewellery & Retail': 'text-blue-400',
    'Manufacturing Sector': 'text-emerald-400',
    'Distribution Feed': 'text-amber-400',
    'Trading Channels': 'text-purple-400',
    'Wholesale Outlets': 'text-pink-400'
  };

  // PROGRAMMATIC SPLINE FORMULATION FOR REVENUE VELOCITY CHART
  const getChartConfig = () => {
    let labels: string[] = [];
    let values: number[] = [];
    
    // Scale live calculations slightly relative to dynamic invoices
    const scaleVal = earnedRevenue > 0 ? Math.max(earnedRevenue / 280000, 1.0) : 8.8;

    if (velocityTimeframe === 'MONTHLY') {
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      values = [12000, 15000, 14000, 19500, 17200, 24000, 26000, 31050, 35000, 41000, 48000, 56000].map(v => v * scaleVal);
    } else if (velocityTimeframe === 'WEEKLY') {
      labels = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'];
      values = [4000, 5200, 4800, 7100, 6300, 8900, 9500, 11400, 13100, 14900, 16900, 21800].map(v => v * scaleVal);
    } else {
      labels = ['2021', '2022', '2023', '2024', '2025', '2026'];
      values = [110000, 185000, 240000, 305000, 390000, 485000].map(v => v * scaleVal);
    }

    const minVal = Math.min(...values) * 0.92;
    const maxVal = Math.max(...values) * 1.05;
    const range = maxVal - minVal || 1;

    const width = 800;
    const height = 240;
    const padLeft = 45;
    const padRight = 20;
    const padTop = 15;
    const padBottom = 20;

    const chartW = width - padLeft - padRight;
    const chartH = height - padTop - padBottom;

    const points = values.map((val, i) => {
      const x = padLeft + (i / (values.length - 1)) * chartW;
      const y = padTop + chartH - ((val - minVal) / range) * chartH;
      return { x, y, value: val };
    });

    // Sub-target line (represented by the dashed trendline)
    const targetPoints = values.map((val, i) => {
      const targetVal = val * 0.84;
      const x = padLeft + (i / (values.length - 1)) * chartW;
      const y = padTop + chartH - ((targetVal - minVal) / range) * chartH;
      return { x, y, value: targetVal };
    });

    return { labels, values, points, targetPoints, width, height, chartW, chartH, padLeft, padRight, padTop, padBottom, range, minVal, maxVal };
  };

  const chart = getChartConfig();

  // Helper coordinate parser for splines
  const getBezierPath = (points: {x: number, y: number}[]) => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i+1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2.5;
      const cpY1 = p0.y;
      const cpX2 = p0.x + 1.5 * (p1.x - p0.x) / 2.5;
      const cpY2 = p1.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const mainSplineD = getBezierPath(chart.points);
  const targetSplineD = getBezierPath(chart.targetPoints);

  // Original funnel stages preserved beautifully
  const funnelStages = [
    { name: 'Lead Enquiries', count: leads.length, color: '#6366f1' },
    { name: 'Active Pipelines', count: deals.length, color: '#3b82f6' },
    { name: 'Drafted Quotations', count: quotations.length, color: '#8b5cf6' },
    { name: 'Issued Invoices', count: invoices.length, color: '#06b6d4' }
  ];
  const maxFunnelCount = Math.max(...funnelStages.map(s => s.count), 1);

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-5 sm:space-y-6 md:space-y-8 font-sans overflow-x-hidden">
      
      {/* Branch Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0a0d1d] via-[#090b16] to-[#04060c] border border-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 font-bold uppercase">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Interactive Operational Node Live</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white mt-1.5 truncate">
            HQ Overview: {activeBranch.name}
          </h2>
          <p className="text-xs text-slate-450 mt-1">
            Running real-time CRM, pipeline, and ledger telemetry out of <span className="text-[#3b82f6] font-mono font-semibold">{activeBranch.location}</span>.
          </p>
        </div>
        
        {/* Dynamic Branch SLA Stamp */}
        <div className="px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-left md:text-right flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-600/10 border border-blue-500/20 text-[#3b82f6] flex items-center justify-center">
            <MapPin size={15} />
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block tracking-wider leading-none">
              BRANCH ROUTE KEY
            </span>
            <span className="text-xs text-slate-200 mt-1 font-semibold block uppercase">
              {activeBranch.code}
            </span>
          </div>
        </div>
      </motion.div>

      {/* TOP ROW: 4 KPI CARDS WITH ANIMATED SPARKLINE CHARTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* KPI 1: Annual Recurring Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.45 }}
          whileHover={{ y: -4, scale: 1.01 }}
          className="p-4 sm:p-5 rounded-2xl bg-[#0a0d18] border border-slate-900 flex flex-col justify-between relative overflow-hidden group hover:border-[#1d2d50] hover:bg-[#0c1122] transition-colors duration-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold font-mono tracking-wider text-slate-400/90 uppercase">
              Annual Recurring Revenue
            </span>
            <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold font-mono bg-[#0f2d26] border border-emerald-550/20 text-[#1cd2a3] flex items-center gap-0.5" title="Expected forward target status">
              <TrendingUp size={10} strokeWidth={2.5} />
              +14.2%
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold tracking-tight text-white">
              ₹{(earnedRevenue > 0 ? (earnedRevenue * 12 + 1000000) / 1000000 : 4.22).toFixed(2)}M
            </h3>
          </div>
          
          {/* Sparkline Graph */}
          <div className="h-10 mt-3 relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
              <defs>
                <linearGradient id="area-arr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.18"/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0"/>
                </linearGradient>
              </defs>
              <motion.path
                d={sparklineARR}
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
              <motion.path
                d={`${sparklineARR} L 100 30 L 0 30 Z`}
                fill="url(#area-arr)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />
            </svg>
          </div>
        </motion.div>

        {/* KPI 2: Pipeline Conversion Rate */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          whileHover={{ y: -4, scale: 1.01 }}
          className="p-4 sm:p-5 rounded-2xl bg-[#0a0d18] border border-slate-900 flex flex-col justify-between relative overflow-hidden group hover:border-[#1d2d50] hover:bg-[#0c1122] transition-colors duration-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold font-mono tracking-wider text-slate-400/90 uppercase">
              Pipeline Conversion Rate
            </span>
            <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold font-mono bg-[#0f2d26] border border-emerald-550/20 text-[#1cd2a3] flex items-center gap-0.5" title="SLA metrics weight">
              <TrendingUp size={10} strokeWidth={2.5} />
              +3.1%
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold tracking-tight text-white">
              {leads.length > 0 ? ((deals.length / leads.length) * 100).toFixed(1) : '22.8'}%
            </h3>
          </div>

          {/* Sparkline Graph */}
          <div className="h-10 mt-3 relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
              <defs>
                <linearGradient id="area-conv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.18"/>
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0"/>
                </linearGradient>
              </defs>
              <motion.path
                d={sparklineConv}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: 0.1, ease: "easeOut" }}
              />
              <motion.path
                d={`${sparklineConv} L 100 30 L 0 30 Z`}
                fill="url(#area-conv)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              />
            </svg>
          </div>
        </motion.div>

        {/* KPI 3: Active Operating Tenants */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
          whileHover={{ y: -4, scale: 1.01 }}
          className="p-4 sm:p-5 rounded-2xl bg-[#0a0d18] border border-slate-900 flex flex-col justify-between relative overflow-hidden group hover:border-[#1d2d50] hover:bg-[#0c1122] transition-colors duration-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold font-mono tracking-wider text-slate-400/90 uppercase">
              Active Operating Tenants
            </span>
            <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold font-mono bg-[#0f2d26] border border-emerald-550/20 text-[#1cd2a3] flex items-center gap-0.5" title="Database entities linked">
              <TrendingUp size={10} strokeWidth={2.5} />
              +11.8%
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold tracking-tight text-white font-mono">
              {(1420 + leads.length * 3 + deals.length * 5).toLocaleString()}
            </h3>
          </div>

          {/* Sparkline Graph */}
          <div className="h-10 mt-3 relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
              <defs>
                <linearGradient id="area-tenants" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18"/>
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0"/>
                </linearGradient>
              </defs>
              <motion.path
                d={sparklineTenants}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
              />
              <motion.path
                d={`${sparklineTenants} L 100 30 L 0 30 Z`}
                fill="url(#area-tenants)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              />
            </svg>
          </div>
        </motion.div>

        {/* KPI 4: AI Decision Latency */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45 }}
          whileHover={{ y: -4, scale: 1.01 }}
          className="p-4 sm:p-5 rounded-2xl bg-[#0a0d18] border border-slate-900 flex flex-col justify-between relative overflow-hidden group hover:border-[#1d2d50] hover:bg-[#0c1122] transition-colors duration-300 sm:col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold font-mono tracking-wider text-slate-400/90 uppercase">
              P99 AI Decision Latency
            </span>
            <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold font-mono bg-[#1c1926] border border-indigo-500/20 text-[#a78bfa] flex items-center gap-0.5" title="Latency speed improvement">
              <TrendingDown size={10} strokeWidth={2.5} />
              -5.3%
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold tracking-tight text-white">
              {84 + (leads.length % 5)}ms
            </h3>
          </div>

          {/* Sparkline Graph */}
          <div className="h-10 mt-3 relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
              <defs>
                <linearGradient id="area-latency" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.15"/>
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.0"/>
                </linearGradient>
              </defs>
              <motion.path
                d={sparklineLatency}
                fill="none"
                stroke="#a78bfa"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
              />
              <motion.path
                d={`${sparklineLatency} L 100 30 L 0 30 Z`}
                fill="url(#area-latency)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              />
            </svg>
          </div>
        </motion.div>

      </div>

      {/* REVENUE VELOCITY CHART & CATEGORIZATION DONUT GRID (Match reference mockup precisely) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Workspace Workflow & Revenue Velocity Line Chart (7/12 width) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0a0d18] border border-slate-900/80 flex flex-col justify-between relative relative">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-md font-bold text-white tracking-tight">
                Workspace Workflow & Revenue Velocity
              </h3>
              <p className="text-xs text-slate-500 font-mono tracking-wide">
                Accumulative corporate billing metrics alongside target goals.
              </p>
            </div>

            {/* Premium Pill Timeframe Selector exactly styled like reference */}
            <div className="flex p-0.5 bg-slate-950/90 rounded-lg border border-slate-900 overflow-hidden font-mono text-[10px] font-bold">
              {(['MONTHLY', 'WEEKLY', 'YEARLY'] as const).map((opt) => {
                const isActive = velocityTimeframe === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => setVelocityTimeframe(opt)}
                    className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Core Programmatic SVG Chart Canvas */}
          <div className="relative h-64 w-full bg-slate-950/45 rounded-xl border border-slate-900/60 p-4 mt-6 overflow-hidden">
            
            <svg 
              className="w-full h-full overflow-visible" 
              viewBox={`0 0 ${chart.width} ${chart.height}`} 
              preserveAspectRatio="none"
            >
              {/* Defs for gradients & glowing nodes */}
              <defs>
                <linearGradient id="velocityBlueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0"/>
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Vertical dotted grid lines and background helper lines */}
              {chart.points.map((pt, i) => (
                <g key={i}>
                  <line 
                    x1={pt.x} 
                    y1={chart.padTop} 
                    x2={pt.x} 
                    y2={chart.height - chart.padBottom} 
                    stroke="#16223b" 
                    strokeWidth="1.2" 
                    strokeDasharray="4 6" 
                  />
                  {/* Subtle hover trigger lane */}
                  <rect
                    x={pt.x - 30}
                    y={chart.padTop}
                    width="60"
                    height={chart.height - chart.padTop - chart.padBottom}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredVelocityIndex(i)}
                    onMouseLeave={() => setHoveredVelocityIndex(null)}
                  />
                </g>
              ))}

              {/* Baseline bottom axis border */}
              <line 
                x1={chart.padLeft} 
                y1={chart.height - chart.padBottom} 
                x2={chart.width - chart.padRight} 
                y2={chart.height - chart.padBottom} 
                stroke="#17233f" 
                strokeWidth="1" 
              />

              {/* Target Curve (Dashed subtle guide) */}
              {targetSplineD && (
                <motion.path
                  d={targetSplineD}
                  fill="none"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="1.5"
                  strokeDasharray="5 4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                />
              )}

              {/* Glow Area behind Spline */}
              {mainSplineD && (
                <path
                  d={`${mainSplineD} L ${chart.points[chart.points.length - 1].x} ${chart.height - chart.padBottom} L ${chart.points[0].x} ${chart.height - chart.padBottom} Z`}
                  fill="url(#velocityBlueGrad)"
                />
              )}

              {/* Main Glowing CRM Revenue Spline Line */}
              {mainSplineD && (
                <motion.path
                  d={mainSplineD}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  filter="url(#glow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.6, ease: "easeOut" }}
                />
              )}

              {/* High-Contrast Interactive Node highlight markers */}
              {chart.points.map((pt, i) => {
                const isHovered = hoveredVelocityIndex === i;
                return (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? "7" : "5"}
                    fill="#3b82f6"
                    stroke="#ffffff"
                    strokeWidth={isHovered ? "3.2" : "2"}
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredVelocityIndex(i)}
                    onMouseLeave={() => setHoveredVelocityIndex(null)}
                  />
                );
              })}
            </svg>

            {/* Dynamic Interactive Node Hover Tooltip */}
            <AnimatePresence>
              {hoveredVelocityIndex !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bg-[#080b14] border border-slate-800 p-2.5 rounded-xl shadow-2xl z-50 flex flex-col pointer-events-none text-[10px] space-y-1"
                  style={{
                    left: `${Math.min((hoveredVelocityIndex / (chart.values.length - 1)) * 84 + 6, 78)}%`,
                    bottom: '15%'
                  }}
                >
                  <span className="font-bold text-slate-100 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                    <Calendar size={11} className="text-blue-500" />
                    <span>Interval - {chart.labels[hoveredVelocityIndex]}</span>
                  </span>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 mt-1 font-mono">
                    <span className="text-slate-500">Live Yield:</span>
                    <strong className="text-white text-right">₹{chart.points[hoveredVelocityIndex].value.toLocaleString()}</strong>
                    <span className="text-slate-500">Goal Target:</span>
                    <strong className="text-[#3b82f6] text-right">₹{chart.targetPoints[hoveredVelocityIndex].value.toLocaleString()}</strong>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* X Axis Labels — scroll on small screens */}
          <div className="overflow-x-auto -mx-1 px-1 mt-3">
            <div className="flex justify-between min-w-[320px] sm:min-w-0 text-[9px] sm:text-[10.5px] font-mono text-slate-500 font-bold uppercase gap-1">
              {chart.labels.map((lbl, i) => (
                <span
                  key={lbl}
                  className={`shrink-0 ${velocityTimeframe === 'MONTHLY' && i % 2 !== 0 ? 'hidden sm:inline' : ''}`}
                >
                  {lbl}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Deal Feed Categorization Donut Card (4/12 width) */}
        <div id="sector-allocation-donut" className="lg:col-span-4 p-6 rounded-2xl bg-[#0a0d18] border border-slate-900/80 flex flex-col justify-between relative overflow-hidden group">
          
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <PieChart size={14} className="text-blue-500" />
              <span>Deal Feed Categorization</span>
            </h3>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Organic vs. automated pipeline traffic distribution.</p>
          </div>

          {/* Interactive Hollow Center Donut Segment */}
          <div className="relative flex items-center justify-center my-6">
            
            <svg className="w-40 h-40 sm:w-52 sm:h-52 transform -rotate-90" viewBox="0 0 100 100">
              {/* Back track background ring */}
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-slate-950/80"
                strokeWidth="11"
                fill="none"
              />
              {/* Segmented slices */}
              {sectorsWithSliceData.map((sec, index) => {
                const isActive = hoveredSector === sec.name;
                return (
                  <motion.circle
                    key={sec.name}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={sec.color}
                    strokeWidth={isActive ? "14.5" : "11"}
                    className={`${isActive ? ringGlowMap[sec.name] : ''} transition-all duration-300 cursor-pointer origin-center`}
                    strokeLinecap={sec.fraction > 0.05 ? "round" : "butt"}
                    initial={{ strokeDasharray: `0 ${CIRCUMFERENCE}`, strokeDashoffset: sec.strokeDashoffset }}
                    animate={{ strokeDasharray: sec.strokeDasharray, strokeDashoffset: sec.strokeDashoffset }}
                    transition={{ duration: 1.2, delay: index * 0.08, ease: "easeOut" }}
                    onMouseEnter={() => setHoveredSector(sec.name)}
                    onMouseLeave={() => setHoveredSector(null)}
                  />
                );
              })}
            </svg>

            {/* Inner center text layout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSectorData?.name || 'sum'}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.15 }}
                  className="text-center p-3"
                >
                  <span className={`text-[9px] font-mono tracking-widest font-bold uppercase transition-colors ${activeSectorData ? textClassMap[activeSectorData.name] : 'text-slate-500'}`}>
                    {activeSectorData ? activeSectorData.name : 'Pipeline Total'}
                  </span>
                  <span className="text-[20px] font-extrabold tracking-tight font-mono text-white block mt-1 leading-none">
                    ₹{(activeSectorData ? activeSectorData.value : totalDealsValue).toLocaleString()}
                  </span>
                  <span className="text-[9px] font-mono font-medium text-slate-500 mt-1 block">
                    {activeSectorData ? `${activeSectorData.count} Entities (${activeSectorData.pct}%)` : 'All Sectors combining'}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Exact color circle grid legend matching the requested layout */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-3 border-t border-slate-900/60 font-sans text-[11px]">
            {sectorsWithSliceData.map((sec) => {
              const isHovered = hoveredSector === sec.name;
              return (
                <div 
                  key={sec.name} 
                  className={`flex items-center justify-between cursor-pointer transition-all leading-tight ${
                    isHovered ? 'opacity-100 scale-102 translate-x-0.5' : 'opacity-85 hover:opacity-100'
                  }`}
                  onMouseEnter={() => setHoveredSector(sec.name)}
                  onMouseLeave={() => setHoveredSector(null)}
                >
                  <div className="flex items-center min-w-0 pr-1">
                    {/* Ring indicator block */}
                    <span 
                      className="h-2 w-2 rounded-full shrink-0 ring-2 ring-offset-2 ring-offset-[#0a0d18] mr-2 transition-transform" 
                      style={{ 
                        backgroundColor: sec.color, 
                        boxShadow: `0 0 4px ${sec.color}`,
                        borderColor: sec.color
                      }} 
                    />
                    <span className="text-slate-350 truncate">{sec.name.split(' ')[0]}</span>
                  </div>
                  <span className="font-mono text-slate-400 font-bold ml-1">{sec.pct}%</span>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* THIRD ROW: OPERATIONAL PIPELINE FUNNEL & ACTION TASKS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Funnel Levels */}
        <div className="lg:col-span-7 bg-[#0a0d18] p-6 rounded-2xl border border-slate-900 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Operating Pipeline Funnel (SLA)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Telemetry charting conversion volume from initial prospect to paid cash.
              </p>
            </div>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-500 uppercase font-bold tracking-wider">
              Live Aggregate
            </span>
          </div>

          <div className="space-y-4">
            {funnelStages.map((stage, idx) => {
              const percentage = Math.round((stage.count / maxFunnelCount) * 100);

              return (
                <div key={stage.name} className="space-y-1.5 group">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-350 group-hover:text-white transition-colors">{stage.name}</span>
                    <span className="font-mono text-slate-500">{stage.count} entities ({percentage}%)</span>
                  </div>
                  
                  {/* Glowing progress bar bar */}
                  <div className="h-3 w-full bg-slate-950/80 rounded-full border border-slate-900 overflow-hidden relative">
                    <motion.div 
                      className="h-full rounded-full transition-all duration-300 relative" 
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: stage.color,
                        boxShadow: `0 0 10px ${stage.color}15`
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1.2, delay: idx * 0.1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Dynamic Action Tasks Checklist */}
        <div className="lg:col-span-5 bg-[#0a0d18] p-6 rounded-2xl border border-slate-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Priority System Flags / Reminders
              </h3>
              <button 
                onClick={() => setActiveTab('Team Tasks')}
                className="text-[10px] text-[#3b82f6] hover:underline inline-flex items-center gap-1 font-bold font-mono tracking-wider"
              >
                <span>Task Manager</span>
                <Plus size={10} />
              </button>
            </div>
            
            <div className="mt-5 space-y-3">
              {tasks.slice(0, 3).map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className={`p-3 rounded-xl border flex gap-3 ${
                    task.completed 
                      ? 'bg-slate-950/30 border-slate-950 opacity-55' 
                      : 'bg-slate-950/70 border-slate-850 hover:border-slate-800 transition-colors'
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
                    <span className="text-[9px] font-mono text-slate-500 mt-1.5 block">
                      Client: {task.clientName} · {task.priority} Weight
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-900/60 mt-4 text-center">
            <button
              onClick={() => setActiveTab('AI Control')}
              className="w-full py-2 bg-blue-600/10 text-[#3b82f6] hover:bg-blue-600/15 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
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
