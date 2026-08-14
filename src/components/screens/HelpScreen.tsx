import React, { useState } from 'react';
import {
  HelpCircle,
  PhoneCall,
  ShieldAlert,
  Flame,
  Stethoscope,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const HelpScreen: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does LifeFix AI detect scam messages and fake UPI requests?',
      a: 'LifeFix AI uses Gemini 3.6 Flash multimodal intelligence to analyze sender numbers, domain links, phrasing urgency, and visual QR code layouts for phishing signatures.',
    },
    {
      q: 'Can LifeFix AI diagnose broken household appliances?',
      a: 'Yes! Snap a photo of your appliance (washing machine, water heater, HVAC display error code) and LifeFix will analyze symptoms, estimate repair difficulty, and suggest local vetted technicians.',
    },
    {
      q: 'Is my medical query private?',
      a: 'Yes, LifeFix anonymizes queries and provides non-diagnostic first aid guidance with clear doctor disclaimers.',
    },
    {
      q: 'How does local service provider verification work?',
      a: 'Every provider listed on LifeFix undergoes license verification, background checks, and upfront rate confirmation.',
    },
  ];

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-white">
            Help Center & Emergency Helplines
          </h1>
          <p className="text-xs text-slate-500">Instant hotline numbers and frequently asked questions</p>
        </div>
      </div>

      {/* Emergency Hotlines Grid */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
          🚨 Emergency Hotlines (India & Global)
        </h2>

        <div className="grid grid-cols-2 gap-2">
          <a
            href="tel:1930"
            className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl flex items-center gap-3 hover:bg-rose-100 transition-colors"
          >
            <div className="p-2 bg-rose-600 text-white rounded-xl">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Cyber Fraud Helpline (India)</p>
              <p className="text-sm font-black text-rose-600 dark:text-rose-400">1930</p>
            </div>
          </a>

          <a
            href="tel:112"
            className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-2xl flex items-center gap-3 hover:bg-blue-100 transition-colors"
          >
            <div className="p-2 bg-blue-600 text-white rounded-xl">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">National Emergency (India)</p>
              <p className="text-sm font-black text-blue-600 dark:text-blue-400">112</p>
            </div>
          </a>

          <a
            href="tel:1915"
            className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-2xl flex items-center gap-3 hover:bg-amber-100 transition-colors"
          >
            <div className="p-2 bg-amber-600 text-white rounded-xl">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Consumer Helpline (NCH)</p>
              <p className="text-sm font-black text-amber-600 dark:text-amber-400">1915</p>
            </div>
          </a>

          <a
            href="tel:108"
            className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-2xl flex items-center gap-3 hover:bg-emerald-100 transition-colors"
          >
            <div className="p-2 bg-emerald-600 text-white rounded-xl">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Medical Ambulance</p>
              <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">108 / 102</p>
            </div>
          </a>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Frequently Asked Questions
        </h2>

        <div className="space-y-2">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-3 text-left font-bold text-xs text-slate-800 dark:text-slate-100 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {openFaq === idx && (
                <div className="p-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
