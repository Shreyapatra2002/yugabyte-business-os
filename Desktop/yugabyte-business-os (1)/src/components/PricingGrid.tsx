import { useState } from 'react';
import { Check, ArrowRight, ShieldCheck } from 'lucide-react';

export default function PricingGrid() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');

  const plans = [
    {
      name: 'BOS Starter',
      tagline: 'Simple pipeline tools for smaller shops.',
      monthlyPrice: 149,
      yearlyPrice: 119, // Price per month billed annually
      features: [
        'Support for 1 branch',
        'Dashboard for clients and leads',
        'Create simple quotes and invoices',
        'Basic email and task reminders',
        'Set up user accounts (Admin/Sales)',
        'Regular email and chat support'
      ],
      popular: false,
      ctaText: 'Start Free Trial'
    },
    {
      name: 'BOS Pro Suite',
      tagline: 'Standard platform with AI assistant and automation.',
      monthlyPrice: 599,
      yearlyPrice: 479, // Price per month billed annually
      features: [
        'Switch between multiple branches',
        'Live price calculators (Gold & Materials)',
        'Automatic bills and payment tracking',
        'Simple automation rules editor',
        'AI assistant powered by Gemini',
        '4 ready employee roles (Manager, Sales, etc.)',
        '24/7 priority chat and phone support'
      ],
      popular: true,
      ctaText: 'Try Pro Demo'
    },
    {
      name: 'BOS Enterprise Core',
      tagline: 'Dedicated tools for larger teams and custom systems.',
      monthlyPrice: 1999,
      yearlyPrice: 1599, // Price per month billed annually
      features: [
        'Database isolation and backups',
        'Custom weight and parts formula setup',
        'Smart automated client alert sequences',
        'Complete security logs and access shields',
        'Help with moving your old customer files',
        'Dedicated support manager'
      ],
      popular: false,
      ctaText: 'Contact Sales'
    }
  ];

  return (
    <div className="w-full">
      {/* Billing Interval Switch */}
      <div className="flex flex-col items-center justify-center mb-12">
        <div className="inline-flex items-center gap-3 p-1.5 bg-slate-900 border border-slate-800 rounded-full">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all cursor-pointer ${
              billingPeriod === 'monthly'
                ? 'bg-slate-800 text-slate-100 shadow-sm'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Monthly Period
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all flex items-center gap-1.5 cursor-pointer ${
              billingPeriod === 'yearly'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span>Annually</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-900/60 font-medium border border-blue-500/20 text-blue-200">
              Save 20%
            </span>
          </button>
        </div>
        <p className="text-[11px] font-mono text-slate-500 mt-2.5">
          *All plans include our easy onboarding setup support
        </p>
      </div>

      {/* Plans Pricing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => {
          const currentPrice = billingPeriod === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
          const savings = billingPeriod === 'yearly' ? (plan.monthlyPrice - plan.yearlyPrice) * 12 : 0;

          return (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-305 border ${
                plan.popular
                  ? 'bg-slate-900 border-blue-500/50 shadow-2xl shadow-blue-500/5 ring-1 ring-blue-500/25'
                  : 'bg-slate-950/80 border-slate-900 hover:border-slate-800'
              }`}
            >
              {/* Popularity Badge Overlay */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 border border-blue-400 text-white text-[10px] uppercase font-bold tracking-widest shadow-lg">
                  RECOMMENDED
                </div>
              )}

              <div>
                {/* Plan Header */}
                <div className="mb-6">
                  <span className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase">
                    {plan.name}
                  </span>
                  <p className="text-xs text-slate-400 mt-1">{plan.tagline}</p>
                </div>

                {/* Pricing Number */}
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="font-mono text-3xl sm:text-4xl font-extrabold text-slate-100">₹</span>
                  <span className="font-mono text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
                    {currentPrice}
                  </span>
                  <span className="text-xs text-slate-505 font-sans ml-1">/ Month</span>
                </div>

                {/* Billed annually indicator & savings notification */}
                {billingPeriod === 'yearly' && (
                  <div className="mb-6 py-1 px-3 bg-blue-950/30 border border-blue-900/30 rounded-xl inline-flex items-center gap-1.5">
                    <ShieldCheck size={12} className="text-blue-400" />
                    <span className="text-[10px] font-mono text-blue-300/85">
                      Billed annually (Save ₹{savings}/yr)
                    </span>
                  </div>
                )}

                <hr className="my-5 border-slate-900" />

                {/* Features List */}
                <ul className="space-y-3.5 mb-8 text-left">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <div className="mt-0.5 rounded-full p-0.5 bg-blue-500/10 text-blue-500 border border-blue-500/15 shrink-0">
                        <Check size={11} />
                      </div>
                      <span className="text-xs sm:text-sm text-slate-300 leading-tight">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  plan.popular
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/10'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-205 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{plan.ctaText}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
