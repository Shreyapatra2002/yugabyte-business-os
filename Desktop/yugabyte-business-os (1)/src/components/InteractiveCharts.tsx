import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LineChart, BarChart3, PieChart, TrendingUp, DollarSign, Calendar, Landmark, CheckCircle } from 'lucide-react';

interface InteractiveChartsProps {
  leadsCount: number;
  dealsCount: number;
  quotesCount: number;
  invoicesCount: number;
  earnedRevenue: number;
  outstandingBalance: number;
}

export default function InteractiveCharts({
  leadsCount,
  dealsCount,
  quotesCount,
  invoicesCount,
  earnedRevenue,
  outstandingBalance
}: InteractiveChartsProps) {
  const [activeTab, setActiveTab] = useState<'forecast' | 'branches' | 'collections'>('forecast');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Dynamic Dataset for Forecast Curve
  const forecastData = [
    { month: 'Jan', revenue: 450000, projected: 480000, leads: 42 },
    { month: 'Feb', revenue: 520000, projected: 550000, leads: 51 },
    { month: 'Mar', revenue: 610000, projected: 630000, leads: 58 },
    { month: 'Apr', revenue: 580000, projected: 640000, leads: 49 },
    { month: 'May', revenue: 720000, projected: 750000, leads: 72 },
    { month: 'Jun', revenue: 840000, projected: 890000, leads: 88 },
    { month: 'Jul', revenue: 950000 + (dealsCount * 12000), projected: 1020000 + (dealsCount * 15000), leads: 95 + leadsCount }
  ];

  // Dynamic Dataset for Branch Conversion Ratios
  const branchesData = [
    { name: 'Mumbai Retail HQ', conversion: 78, goldRate: 7250, deals: 24 },
    { name: 'Bengaluru Logistics Hub', conversion: 64, goldRate: 7240, deals: 18 },
    { name: 'New Delhi Corporate', conversion: 71, goldRate: 7260, deals: 15 },
    { name: 'Kolkata Wholesale Ring', conversion: 58, goldRate: 7230, deals: 12 }
  ];

  // Dynamic Dataset for Collections Ratio
  const totalInvoicedValue = earnedRevenue + outstandingBalance;
  const collectionRate = totalInvoicedValue > 0 ? Math.round((earnedRevenue / totalInvoicedValue) * 100) : 74;

  const collectionsData = [
    { label: 'Settled Funds', amount: earnedRevenue, percentage: collectionRate, color: '#10b981' },
    { label: 'Outstanding Invoices', amount: outstandingBalance, percentage: 100 - collectionRate, color: '#f43f5e' }
  ];

  return (
    <div id="bos-interactive-charts" className="bg-slate-900/40 p-6 rounded-2xl border border-slate-900 space-y-6">
      
      {/* Visual Tab Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <LineChart size={15} className="text-blue-400" />
            <span>Interactive Business Analytics Console</span>
          </h3>
          <p className="text-[11px] text-slate-450 mt-1">
            Toggle telemetry segments to visualize pipeline dynamics, localized conversion ratios, and liquid balances.
          </p>
        </div>

        <div className="flex flex-wrap p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('forecast')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'forecast' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-205'
            }`}
          >
            <TrendingUp size={11} />
            <span>Sales Forecast</span>
          </button>
          
          <button
            onClick={() => setActiveTab('branches')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'branches' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-205'
            }`}
          >
            <BarChart3 size={11} />
            <span>Branch Ratios</span>
          </button>

          <button
            onClick={() => setActiveTab('collections')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'collections' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-205'
            }`}
          >
            <PieChart size={11} />
            <span>Collections (Net)</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas Rendering */}
      <div>
        {activeTab === 'forecast' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500 uppercase">MONTH-OVER-MONTH PIPELINE FORECAST (₹)</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-blue-400">
                  <span className="h-2 w-2 rounded-full bg-blue-500" /> Live Revenue
                </span>
                <span className="flex items-center gap-1.5 text-indigo-400">
                  <span className="h-2 w-2 rounded-full bg-indigo-500" /> Projected SLA
                </span>
              </div>
            </div>

            {/* Glowing SVG Curve Line chart */}
            <div className="relative h-64 w-full bg-slate-950/40 rounded-xl border border-slate-900 p-4 overflow-hidden">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
                {/* SVG Definitions for Gradients */}
                <defs>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0"/>
                  </linearGradient>
                  <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0"/>
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[0, 50, 100, 150, 200].map((yVal, idx) => (
                  <line 
                    key={idx} 
                    x1="0" 
                    y1={yVal} 
                    x2="700" 
                    y2={yVal} 
                    stroke="#1e293b" 
                    strokeWidth="1" 
                    strokeDasharray="4 4" 
                  />
                ))}

                {/* Projected Glow Area */}
                <path
                  d={`M 0 200 
                      L 0 ${200 - (forecastData[0].projected / 1100000) * 160}
                      L 116 ${200 - (forecastData[1].projected / 1100000) * 160}
                      L 232 ${200 - (forecastData[2].projected / 1100000) * 160}
                      L 348 ${200 - (forecastData[3].projected / 1100000) * 160}
                      L 464 ${200 - (forecastData[4].projected / 1100000) * 160}
                      L 580 ${200 - (forecastData[5].projected / 1100000) * 160}
                      L 696 ${200 - (forecastData[6].projected / 1100000) * 160}
                      L 700 200 Z`}
                  fill="url(#indigoGrad)"
                />

                {/* Live Glow Area */}
                <path
                  d={`M 0 200 
                      L 0 ${200 - (forecastData[0].revenue / 1100000) * 160}
                      L 116 ${200 - (forecastData[1].revenue / 1100000) * 160}
                      L 232 ${200 - (forecastData[2].revenue / 1100000) * 160}
                      L 348 ${200 - (forecastData[3].revenue / 1100000) * 160}
                      L 464 ${200 - (forecastData[4].revenue / 1100000) * 160}
                      L 580 ${200 - (forecastData[5].revenue / 1100000) * 160}
                      L 696 ${200 - (forecastData[6].revenue / 1100000) * 160}
                      L 700 200 Z`}
                  fill="url(#blueGrad)"
                />                 {/* Background Line: Projected */}
                <motion.path
                  d={`M 0 ${200 - (forecastData[0].projected / 1100000) * 160}
                      L 116 ${200 - (forecastData[1].projected / 1100000) * 160}
                      L 232 ${200 - (forecastData[2].projected / 1100000) * 160}
                      L 348 ${200 - (forecastData[3].projected / 1100000) * 160}
                      L 464 ${200 - (forecastData[4].projected / 1100000) * 160}
                      L 580 ${200 - (forecastData[5].projected / 1100000) * 160}
                      L 696 ${200 - (forecastData[6].projected / 1100000) * 160}`}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="2"
                  strokeDasharray="5 3"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.8 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />

                {/* Primary Line: Live */}
                <motion.path
                  d={`M 0 ${200 - (forecastData[0].revenue / 1100000) * 160}
                      L 116 ${200 - (forecastData[1].revenue / 1100000) * 160}
                      L 232 ${200 - (forecastData[2].revenue / 1100000) * 160}
                      L 348 ${200 - (forecastData[3].revenue / 1100000) * 160}
                      L 464 ${200 - (forecastData[4].revenue / 1100000) * 160}
                      L 580 ${200 - (forecastData[5].revenue / 1100000) * 160}
                      L 696 ${200 - (forecastData[6].revenue / 1100000) * 160}`}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.8, ease: "easeOut" }}
                />

                {/* Interactive Node Circles */}
                {forecastData.map((d, index) => {
                  const x = (index / 6) * 696;
                  const y = 200 - (d.revenue / 1100000) * 160;

                  return (
                    <g key={index}>
                      <circle
                        cx={x}
                        cy={y}
                        r={hoveredIndex === index ? "7" : "4.5"}
                        className="fill-blue-500 stroke-slate-950 cursor-pointer transition-all duration-150"
                        strokeWidth="2.5"
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Dynamic Interactive Tooltip */}
              {hoveredIndex !== null && (
                <div 
                  className="absolute bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-2xl z-30 flex flex-col pointer-events-none text-[11px]"
                  style={{
                    left: `${Math.min((hoveredIndex / 6) * 90 + 3, 76)}%`,
                    bottom: '20px'
                  }}
                >
                  <span className="font-bold text-slate-100 flex items-center gap-1">
                    <Calendar size={11} className="text-blue-400" />
                    <span>Analytics Report ({forecastData[hoveredIndex].month})</span>
                  </span>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 font-mono">
                    <span className="text-slate-400">Live Earned:</span>
                    <strong className="text-white text-right">₹{forecastData[hoveredIndex].revenue.toLocaleString()}</strong>
                    <span className="text-slate-400">Target Forecast:</span>
                    <strong className="text-indigo-400 text-right">₹{forecastData[hoveredIndex].projected.toLocaleString()}</strong>
                    <span className="text-slate-400">Raw Leads In:</span>
                    <strong className="text-blue-400 text-right">{forecastData[hoveredIndex].leads}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* X-Axis labels */}
            <div className="flex justify-between px-2 text-[10px] font-mono text-slate-500 font-semibold uppercase">
              {forecastData.map((d) => (
                <span key={d.month}>{d.month} 2026</span>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'branches' && (
          <div className="space-y-4">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block">
              ENTERPRISE BRANCH CONVERSION TELEMETRY
            </span>

            <div className="space-y-4 bg-slate-950/40 rounded-xl border border-slate-900 p-5">
              {branchesData.map((branch) => (
                <div key={branch.name} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Landmark size={12} className="text-slate-400" />
                      <strong className="text-slate-200">{branch.name}</strong>
                    </div>
                    <span className="font-mono text-slate-400 font-bold">
                      {branch.conversion}% SLA Conversion · {branch.deals} active deals
                    </span>
                  </div>

                  {/* Segmented Bar Graph Row */}
                  <div className="flex items-center gap-3">
                    <div className="h-3.5 flex-1 bg-slate-950 rounded-full overflow-hidden border border-slate-900 relative">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-700"
                        style={{ width: `${branch.conversion}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono font-bold text-indigo-400 w-8 text-right">
                      {branch.conversion}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'collections' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Visual Gauge on Left */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-950/40 border border-slate-900 rounded-xl relative">
              <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-slate-900"
                  strokeWidth="8"
                  fill="none"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-emerald-500"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: `0 251.2` }}
                  animate={{ strokeDasharray: `${2.512 * collectionRate} ${251.2 - 2.512 * collectionRate}` }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                />
              </svg>

              <div className="absolute text-center">
                <span className="text-2xl font-extrabold tracking-tight font-mono text-emerald-450 block">
                  {collectionRate}%
                </span>
                <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block mt-0.5">
                  Collection Ratio
                </span>
              </div>
            </div>

            {/* List on Right */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-200">Financial Liquid Reserve Balance</h4>
                <p className="text-[10px] text-slate-450 mt-1">
                  Ratio comparing cleared collected revenue against outstanding B2B invoice dockets.
                </p>
              </div>

              <div className="space-y-3 font-sans">
                {collectionsData.map((data) => (
                  <div key={data.label} className="p-3 bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                       <span className="h-2 w-2 rounded-full" style={{ backgroundColor: data.color }} />
                       <span className="text-slate-350">{data.label} ({data.percentage}%)</span>
                    </div>
                    <strong>₹{data.amount.toLocaleString()}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
