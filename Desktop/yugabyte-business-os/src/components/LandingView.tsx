import { useState } from 'react';
import { 
  ArrowRight, 
  Check, 
  Sparkles, 
  Cpu, 
  Gem, 
  Factory, 
  Truck, 
  Store, 
  Briefcase, 
  FileSignature, 
  Receipt, 
  MapPin, 
  UserCheck, 
  DatabaseZap, 
  ChevronRight,
  HelpCircle,
  ShieldCheck,
  TrendingUp,
  Scale,
  Users,
  BarChart3,
  Zap,
  Calendar,
  Network,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import PricingGrid from './PricingGrid';
import { bosProducts, whyBOSFeatures, faqItems } from '../data';

const keyFunctions = [
  {
    number: '01',
    title: 'Customer & Lead Management',
    icon: Users,
    color: 'from-blue-500 to-indigo-500',
    points: [
      'Store customer information',
      'Track enquiries and leads',
      'Manage customer communication history',
      'Assign leads to sales teams',
      'Monitor lead conversion rates'
    ]
  },
  {
    number: '02',
    title: 'Sales & Pipeline Management',
    icon: TrendingUp,
    color: 'from-cyan-500 to-blue-500',
    points: [
      'Create and manage sales opportunities',
      'Track deals through different sales stages',
      'Monitor expected revenue',
      'Forecast future sales performance'
    ]
  },
  {
    number: '03',
    title: 'Quotation & Proposal Management',
    icon: FileSignature,
    color: 'from-amber-500 to-orange-500',
    points: [
      'Generate quotations and proposals',
      'Track quotation status',
      'Monitor acceptance and rejection rates',
      'Maintain quotation history'
    ]
  },
  {
    number: '04',
    title: 'Revenue & Invoice Management',
    icon: Receipt,
    color: 'from-emerald-500 to-teal-500',
    points: [
      'Generate invoices',
      'Track payments and outstanding amounts',
      'Monitor revenue performance',
      'Manage collection activities'
    ]
  },
  {
    number: '05',
    title: 'Business Analytics & Reporting',
    icon: BarChart3,
    color: 'from-purple-500 to-pink-500',
    points: [
      'Real-time dashboards',
      'Revenue reports',
      'Sales performance reports',
      'Team productivity reports',
      'Business growth analytics'
    ]
  },
  {
    number: '06',
    title: 'Workflow Automation',
    icon: Zap,
    color: 'from-yellow-500 to-amber-500',
    points: [
      'Automatically assign leads',
      'Create follow-up reminders',
      'Send notifications to teams',
      'Automate repetitive business processes'
    ]
  },
  {
    number: '07',
    title: 'Team & Activity Management',
    icon: Calendar,
    color: 'from-rose-500 to-pink-500',
    points: [
      'Manage employee activities',
      'Track follow-ups and meetings',
      'Monitor task completion',
      'Improve team accountability'
    ]
  },
  {
    number: '08',
    title: 'Multi-Branch & Multi-Department Operations',
    icon: Network,
    color: 'from-indigo-500 to-purple-500',
    points: [
      'Manage multiple branches from one system',
      'Centralized reporting',
      'Department-wise performance tracking'
    ]
  },
  {
    number: '09',
    title: 'AI-Assisted Business Operations',
    icon: Cpu,
    color: 'from-sky-500 to-cyan-500',
    points: [
      'AI-powered business insights',
      'Data-driven recommendations',
      'Intelligent analysis of customer and sales data'
    ]
  },
  {
    number: '10',
    title: 'Enterprise Security & Access Control',
    icon: Lock,
    color: 'from-teal-500 to-emerald-500',
    points: [
      'Role-based access permissions',
      'Department-level access control',
      'Secure business data management'
    ]
  }
];

interface LandingViewProps {
  setView: (view: 'landing' | 'dashboard') => void;
}

export default function LandingView({ setView }: LandingViewProps) {
  const [activeSector, setActiveSector] = useState<'Jewellery' | 'Manufacturing' | 'Distribution' | 'Trading' | 'Wholesale'>('Jewellery');
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);

  const sectorHighlights = {
    Jewellery: {
      icon: Gem,
      color: 'from-amber-500 to-yellow-500',
      title: 'Jewellery Shop Manager',
      tagline: 'Track metal weights, gold karats, and design costs.',
      benefitList: [
        'Check gold prices automatically',
        'Track weights for diamonds and gems',
        'Calculate design and wastage percentages easily',
        'Convert custom jewellery queries into final quotes'
      ],
      leadSample: 'Custom bridal jewellery request'
    },
    Manufacturing: {
      icon: Factory,
      color: 'from-blue-500 to-indigo-505',
      title: 'Factory and Parts Manager',
      tagline: 'Track parts, raw materials, and labor.',
      benefitList: [
        'Track component sizes and design blueprints',
        'Estimate machinery time and materials needed',
        'Keep detailed records of labor and material costs',
        'Create automatic drafts for supplier orders'
      ],
      leadSample: 'Order for 500 custom metal parts'
    },
    Distribution: {
      icon: Truck,
      color: 'from-emerald-500 to-teal-500',
      title: 'Supply & Delivery Manager',
      tagline: 'Organize warehouse transfer and shipments.',
      benefitList: [
        'Move products between different branches easily',
        'Set helper rules for team response times',
        'Keep documents for seaport clearance under control',
        'Plan delivery schedules for wholesale purchases'
      ],
      leadSample: 'Batch of organic items'
    },
    Trading: {
      icon: Briefcase,
      color: 'from-purple-500 to-fuchsia-500',
      title: 'Trading & Currencies',
      tagline: 'Manage cross-border sales and currency buffers.',
      benefitList: [
        'Set currency buffers to handle changing exchange rates',
        'Create custom shipping and customs bills of lading',
        'Manage cargo values with tax or duty configurations',
        'Monitor shelf-life records for organic trade items'
      ],
      leadSample: 'Saffron bulk import trade'
    },
    Wholesale: {
      icon: Store,
      color: 'from-pink-500 to-rose-500',
      title: 'B2B & Bulk Wholesale',
      tagline: 'Set special discount prices for big orders.',
      benefitList: [
        'Create discount rules for big wholesale orders',
        'Track maximum credit limits for regular clients',
        'Calculate due payments and late bills automatically',
        'Set up re-order triggers for low catalog stock'
      ],
      leadSample: 'Big wholesale batch orders'
    }
  };

  const currentSectorData = sectorHighlights[activeSector];
  const CurrentSectorIcon = currentSectorData.icon;

  return (
    <div className="bg-slate-950 font-sans text-slate-100 min-h-screen">
      
      {/* SECTION 1: Deep Tech Enterprise Hero */}
      <section className="relative pt-24 pb-20 items-center justify-center flex flex-col px-4 sm:px-6 lg:px-8 border-b border-slate-900 overflow-hidden">
        
        {/* Subtle grid background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 border border-blue-500/20 rounded-full mb-6">
            <Sparkles size={12} className="text-blue-400 rotate-12" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-300">
              YugaByte BOS Platform
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-sans text-slate-100 leading-tight">
            YugaByte <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">Business OS</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Manage your clients, estimates, invoices, and multiple branches in one simple app. Specially designed for <strong className="text-slate-200">Jewellery, Manufacturing, Distribution, Trading, and Wholesale</strong> businesses.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setView('dashboard')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-2xl text-xs font-bold tracking-wide shadow-lg shadow-blue-500/15 text-white flex items-center justify-center gap-2 group transition-all cursor-pointer"
            >
              <span>Explore Active Demo Workspace</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => {
                const specSection = document.getElementById('sector-playbook-section');
                if (specSection) specSection.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-850 rounded-2xl text-xs font-semibold text-slate-350 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
            >
              Industry Solutions
            </button>
          </div>

          {/* Epic Hero Interactive Visual Frame */}
          <motion.div 
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="mt-16 w-full max-w-5xl mx-auto rounded-3xl border border-slate-900 bg-slate-900/30 p-2.5 shadow-2xl shadow-blue-500/5 relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-600/10 to-cyan-500/10 rounded-3xl opacity-60 blur-xl group-hover:opacity-80 transition-opacity" />
            <div className="relative rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-950">
              <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 border-b border-slate-900">
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/85 block hover:scale-110 transition-transform cursor-pointer" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/85 block hover:scale-110 transition-transform cursor-pointer" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/85 block hover:scale-110 transition-transform cursor-pointer" />
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-slate-450 bg-slate-950 px-4 py-1.5 rounded-full border border-slate-850">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>SYSTEM CORE ONLINE</span>
                </div>
                <div className="w-16 h-1 bg-slate-800 rounded" />
              </div>
              
              <div className="relative aspect-[16/9] w-full bg-slate-950">
                <img 
                  src="/src/assets/images/bos_hero_banner_1780387667910.png"
                  alt="Business Platform Workspace Overview"
                  className="w-full h-full object-cover opacity-80 group-hover:scale-101.5 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                
                {/* Floating interactive tooltip dashboard metrics over the banner */}
                <div className="absolute top-6 left-6 block backdrop-blur-md bg-slate-950/60 p-3 rounded-xl border border-slate-800/65 max-w-[200px] text-left transition-all hover:border-slate-700 shadow-lg">
                  <div className="flex items-center gap-1">
                    <Sparkles size={11} className="text-yellow-400" />
                    <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">SYSTEM STATUS</span>
                  </div>
                  <p className="text-xs font-mono font-bold text-white mt-1">Ready with Live Updates</p>
                  <p className="text-[9px] text-slate-500 mt-0.5">Gold prices and delivery schedules synced successfully.</p>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex items-end p-6 md:p-10">
                  <div className="text-left space-y-2 backdrop-blur-md bg-slate-950/60 p-4 sm:p-6 rounded-2xl border border-slate-800/80 max-w-lg shadow-2xl">
                    <span className="text-[9px] font-mono font-bold text-blue-400 uppercase tracking-widest block font-bold">ALL-IN-ONE BUSINESS HUB</span>
                    <h3 className="text-sm sm:text-md md:text-lg font-bold tracking-tight text-white font-sans">Connect Your Multiple Branches Easily</h3>
                    <p className="text-[10px] sm:text-xs text-slate-400 font-sans leading-relaxed">
                      Simplify your daily tasks—track jewelry weights, verify manufacturing parts checklists, manage supplier credits, and check shipping logs in a clean dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Key Trust Pillars */}
          <div className="mt-12 pt-10 border-t border-slate-900/60 grid grid-cols-2 md:grid-cols-4 gap-6 text-left max-w-3xl mx-auto">
            <div>
              <p className="text-lg font-bold font-mono text-slate-100">100%</p>
              <p className="text-[10px] font-mono text-slate-500 uppercase mt-0.5 font-bold tracking-wider">Fast & No Bloat</p>
            </div>
            <div>
              <p className="text-lg font-bold font-mono text-slate-100">Gemini AI</p>
              <p className="text-[10px] font-mono text-slate-500 uppercase mt-0.5 font-bold tracking-wider">Smart Local AI Helper</p>
            </div>
            <div>
              <p className="text-lg font-bold font-mono text-slate-100">Multi-Branch</p>
              <p className="text-[10px] font-mono text-slate-500 uppercase mt-0.5 font-bold tracking-wider">Localized Workspace Sync</p>
            </div>
            <div>
              <p className="text-lg font-bold font-mono text-slate-100">Ready To Use</p>
              <p className="text-[10px] font-mono text-slate-500 uppercase mt-0.5 font-bold tracking-wider">Zero Setup Onboarding</p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: Dynamic Sector Playbook Demo (Function 1-5, 8 Details) */}
      <section id="sector-playbook-section" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-900 relative">
        <div className="absolute inset-0 bg-slate-950 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[9px] font-mono font-bold tracking-widest text-blue-500 uppercase">
              Modular Playbook
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-2">
              Fine-Tuned For High-Value Sectors
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed">
              Every workflow, unit, tax variable, and automation template is built to map to the strict structural parameters of your chosen B2B or retail focus area.
            </p>
          </div>

          {/* High Contrast Tabs Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {(['Jewellery', 'Manufacturing', 'Distribution', 'Trading', 'Wholesale'] as const).map((sector) => {
              const isActive = activeSector === sector;
              const Icon = sectorHighlights[sector].icon;

              return (
                <button
                  key={sector}
                  onClick={() => setActiveSector(sector)}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-semibold tracking-tight transition-all border cursor-pointer ${
                    isActive 
                      ? 'bg-blue-600/10 border-blue-500 text-blue-400 font-bold shadow-md shadow-blue-500/5' 
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-blue-400' : 'text-slate-500'} />
                  <span>{sector}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Block */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/45 p-6 sm:p-10 rounded-3xl border border-slate-900">
            
            {/* Left Info: Tailored Specs */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2.5">
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-tr ${currentSectorData.color} p-0.5`}>
                  <div className="h-full w-full bg-slate-950 rounded-[9px] flex items-center justify-center">
                    <CurrentSectorIcon size={18} className="text-slate-200" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-md font-sans font-bold text-slate-200 leading-tight">
                    {currentSectorData.title}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500 uppercase leading-none mt-1">
                    ACTIVE TEMPLATE
                  </span>
                </div>
              </div>

              <p className="text-sm font-sans font-medium text-slate-350 italic">
                "{currentSectorData.tagline}"
              </p>

              <hr className="border-slate-800/80" />

              <ul className="space-y-4">
                {currentSectorData.benefitList.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={11} />
                    </div>
                    <span className="text-xs sm:text-sm text-slate-300 leading-normal">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 flex items-center gap-3">
                <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider">
                  Example Request:
                </span>
                <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-blue-400">
                  {currentSectorData.leadSample}
                </span>
              </div>
            </div>

            {/* Right Info: Live Telemetry & Custom Sector Visual with Interactive Micro-Indicators */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-5 relative w-full">
              
              {/* Image Visual Panel (5/12 width) - Dynamically reacts to selected sector and animates */}
              <motion.div 
                key={`${activeSector}-image`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="md:col-span-5 rounded-2xl border border-slate-900 bg-slate-950 p-2 overflow-hidden flex flex-col justify-between shadow-2xl relative group"
              >
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-900/60 flex items-center justify-center">
                  <img 
                    src={
                      activeSector === 'Jewellery' ? '/src/assets/images/jewellery_atelier_visual_1780387685581.png' :
                      activeSector === 'Manufacturing' ? '/src/assets/images/manufacturing_blueprint_visual_1780387703104.png' :
                      activeSector === 'Distribution' ? 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600' :
                      activeSector === 'Trading' ? 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=600' :
                      activeSector === 'Wholesale' ? 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=600' :
                      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600'
                    }
                    alt={`${activeSector} System Asset Preview`}
                    className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
                  
                  {/* Floating Pulsing Micro-indicator */}
                  <motion.div 
                    animate={{ scale: [1, 1.12, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                    className="absolute top-2.5 right-2.5 h-6 px-2.5 rounded-full bg-blue-600/20 border border-blue-400 backdrop-blur-md flex items-center justify-center gap-1 text-[8px] text-blue-300 font-mono font-bold tracking-wider uppercase shadow-xl cursor-pointer"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                    <span>Active OS</span>
                  </motion.div>
                </div>
                
                <div className="p-2 py-3 bg-slate-950 text-left">
                  <div className="flex items-center gap-1">
                    <Sparkles size={11} className="text-blue-450" />
                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Interactive Preview</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans tracking-tight leading-normal mt-1 text-left">
                    Live display showing the workflow process for the <strong className="text-slate-350">{activeSector}</strong> sector template.
                  </p>
                </div>
              </motion.div>

              {/* Live Telemetry Loop Workflow (7/12 width) */}
              <div className="md:col-span-7 space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-900 relative flex flex-col justify-between text-left">
                
                <div>
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500">
                      <Cpu size={12} className="text-cyan-400 animate-spin-slow" />
                      <span>WORKFLOW PROCESS</span>
                    </div>
                    {/* Pulsing Interactive Glow Icon */}
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                  </div>

                  <div className="space-y-2.5 font-mono text-[11px] leading-relaxed mt-4">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-850 flex items-center justify-between text-slate-400 hover:border-blue-500/25 transition-all">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400 font-bold">01_</span>
                        <span className="font-sans font-medium text-slate-200">New Customer Message</span>
                      </div>
                      <span className="text-[9px] text-emerald-500 px-1.5 py-0.5 bg-emerald-500/10 rounded font-semibold border border-emerald-500/15">Active</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-850 flex items-center justify-between text-slate-400 hover:border-indigo-500/25 transition-all">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400 font-bold">02_</span>
                        <span className="font-sans font-medium text-slate-200">Calculate Price Estimations</span>
                      </div>
                      <span className="text-[9px] text-slate-500 italic">Pending</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-850 flex items-center justify-between text-slate-400 hover:border-purple-500/25 transition-all">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400 font-bold">03_</span>
                        <span className="font-sans font-medium text-slate-200">Route Tax and Currency Options</span>
                      </div>
                      <span className="text-[9px] text-slate-500 italic">Auto-Save</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-850 flex items-center justify-between text-slate-400 hover:border-orange-500/25 transition-all">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400 font-bold">04_</span>
                        <span className="font-sans font-medium text-slate-200">Review with Quality Checklist</span>
                      </div>
                      <span className="text-[9px] text-orange-400 px-1.5 py-0.5 bg-orange-400/10 rounded border border-orange-500/15 font-semibold">Security Checked</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-900 text-center">
                  <button
                    onClick={() => setView('dashboard')}
                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1 cursor-pointer group"
                  >
                    <span>Launch Interactive Dashboard</span>
                    <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>      {/* SECTION: Key Functions of BOS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-900 relative bg-slate-955/45">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600/10 border border-indigo-500/20 rounded-full mb-4">
              <Sparkles size={12} className="text-indigo-400 rotate-12" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-300">
                All Your Tools In One Place
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100">
              Core Features
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed">
              Explore all the tools built directly into our platform to help you run your business smoothly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {keyFunctions.map((item) => {
              const IconComponent = item.icon;
              return (
                <div 
                  key={item.number} 
                  className="group bg-slate-900/20 border border-slate-900/80 rounded-2xl p-5 transition-all duration-300 hover:border-slate-800 hover:bg-slate-900/40 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Header of Card */}
                    <div className="flex items-center justify-between mb-5">
                      <div className={`h-10 w-10 rounded-xl bg-gradient-to-tr ${item.color} p-0.5`}>
                        <div className="h-full w-full bg-slate-950 rounded-[9px] flex items-center justify-center">
                          <IconComponent size={18} className="text-slate-205 transition-transform duration-300 group-hover:scale-110" />
                        </div>
                      </div>
                      <span className="font-mono text-[10px] font-bold text-slate-650 tracking-wider">
                        TOOL {item.number}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="text-sm font-sans font-bold text-slate-150 leading-snug group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>

                    {/* Points list */}
                    <ul className="mt-4 space-y-2.5 pb-2">
                      {item.points.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                           <span className="text-blue-500/80 font-mono font-bold text-[9px] select-none mt-1">
                            ↳
                          </span>
                          <span className="leading-relaxed font-sans">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tiny card footer indicator */}
                  <div className="mt-4 pt-3 border-t border-slate-900/50 flex justify-between items-center text-[9px] font-mono text-slate-600 font-bold uppercase tracking-wider">
                    <span>Ready</span>
                    <span className="h-1 w-8 rounded bg-slate-850 overflow-hidden relative">
                      <span className="absolute top-0 left-0 h-full w-1/2 bg-blue-500 rounded transition-all duration-500 group-hover:w-full" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: Why BOS (Asymmetrical values block) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-900 bg-slate-955 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left info column */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[9px] font-mono font-bold tracking-widest text-emerald-500 uppercase bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                Core Features
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-100 leading-tight">
                All Your Tools, Connected.
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Stop switching between different applications. Our platform connects all your leads, orders, schedules, and task reminders into one single system.
              </p>
              
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left flex gap-3.5 items-start">
                <ShieldCheck size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-205">Safe & Secure</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Keep sensitive files and numbers safe by deciding exactly what each team member is allowed to see.
                  </p>
                </div>
              </div>
            </div>

            {/* Right layout column */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {whyBOSFeatures.map((feature) => (
                <div 
                  key={feature.title}
                  className="bg-slate-900/30 p-5 rounded-2xl border border-slate-905 flex flex-col justify-between"
                >
                  <h4 className="text-xs sm:text-sm font-bold text-slate-222">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5: Beautiful Unified Pricing Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-900">
        <div className="max-w-6xl mx-auto text-center">
          
          <div className="max-w-2xl mx-auto mb-16">
            <span className="text-[9px] font-mono font-bold tracking-widest text-blue-500 uppercase">
              Transparent Account Tiers
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2">
              Pricing Options Built for Scale
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-3">
              Onboard your regional branches on flexible standard grids. Shift workspaces in one smooth dashboard interface.
            </p>
          </div>

          <PricingGrid />

        </div>
      </section>

      {/* SECTION 6: Accordion FAQs */}
      <section id="landing-faq-section" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-900 relative">
        <div className="max-w-4xl mx-auto relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[9px] font-mono font-bold tracking-widest text-indigo-505 uppercase">
              Frequently Answered
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2">
              Questions & Safety Systems
            </h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => {
              const isOpen = openFAQIndex === index;

              return (
                <div 
                  key={index}
                  className="bg-slate-900/25 border border-slate-900 rounded-2xl overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFAQIndex(isOpen ? null : index)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-sans text-xs sm:text-sm font-semibold text-slate-200 hover:text-slate-100 focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle size={15} className="text-indigo-400 shrink-0" />
                      <span>{item.question}</span>
                    </div>
                    <span className={`text-slate-500 transition-transform ${isOpen ? 'rotate-90 text-blue-400' : ''}`}>
                      <ChevronRight size={16} />
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-slate-900/60 bg-slate-900/5"
                      >
                        <p className="px-6 py-4 text-xs sm:text-sm text-slate-400 leading-relaxed">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 7: Call To Action Footer */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-955 relative overflow-hidden text-center justify-center flex flex-col">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-955 to-slate-950 pointer-events-none" />
        
        <div className="max-w-3xl mx-auto relative z-10 space-y-6">
          <DatabaseZap size={36} className="text-blue-500 mx-auto animate-pulse" />
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-100 leading-snug">
            Ready to Standardize Your Business Operations?
          </h2>
          <p className="text-xs sm:text-sm text-slate-450 leading-relaxed max-w-xl mx-auto">
            Acquire full clarity over leads, quotas, nets routing, and branches. Activate your secure sandbox workspace in less than five seconds.
          </p>

          <div className="pt-4">
            <button
              onClick={() => {
                setView('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-400 rounded-2xl text-xs font-bold tracking-wide shadow-lg shadow-blue-500/10 cursor-pointer"
            >
              Launch Core Dashboard
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
