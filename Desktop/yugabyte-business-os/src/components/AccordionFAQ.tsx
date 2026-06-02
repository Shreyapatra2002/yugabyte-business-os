import { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FAQItem } from '../types';

interface AccordionFAQProps {
  items: FAQItem[];
}

export default function AccordionFAQ({ items }: AccordionFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;

        return (
          <div
            key={idx}
            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
              isOpen
                ? 'bg-slate-900/60 border-slate-700/60 shadow-lg shadow-blue-500/5'
                : 'bg-slate-950 border-slate-900 hover:border-slate-800'
            }`}
          >
            <button
              onClick={() => toggleAccordion(idx)}
              className="w-full flex items-center justify-between p-5 text-left focus:outline-none transition-colors"
              aria-expanded={isOpen}
            >
              <div className="flex items-start gap-3.5 pr-4">
                <HelpCircle 
                  size={18} 
                  className={`mt-0.5 shrink-0 transition-colors ${
                    isOpen ? 'text-blue-500' : 'text-slate-500'
                  }`} 
                />
                <span className="font-sans font-semibold text-sm sm:text-base text-slate-100 leading-tight">
                  {item.question}
                </span>
              </div>
              <div className={`p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 transition-transform duration-300 shrink-0 ${
                isOpen ? 'rotate-180 text-blue-400 border-blue-500/20' : ''
              }`}>
                <ChevronDown size={16} />
              </div>
            </button>

            {/* Collapsible Panel with spring transition */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: 'auto', 
                    opacity: 1,
                    transition: {
                      height: { type: 'spring', stiffness: 220, damping: 25 },
                      opacity: { duration: 0.2, delay: 0.05 }
                    }
                  }}
                  exit={{ 
                    height: 0, 
                    opacity: 0,
                    transition: {
                      height: { duration: 0.25, ease: 'easeInOut' },
                      opacity: { duration: 0.15 }
                    }
                  }}
                >
                  <div className="px-5 pb-5 pt-1 pl-12">
                    <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
                      {item.answer}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/25 animate-pulse" />
                      <span className="text-[10px] font-mono font-medium text-slate-500 uppercase tracking-wider">
                        Verified Operator Answer
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
