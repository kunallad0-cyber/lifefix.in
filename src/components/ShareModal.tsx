import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  QrCode,
  Smartphone,
  Download,
  ExternalLink,
  MessageCircle,
  Send,
  Twitter,
  Linkedin,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'social' | 'qr' | 'install'>('whatsapp');

  if (!isOpen) return null;

  const appUrl = 'https://ais-pre-4fy65rbgd5eou2omkr7dpx-575046237981.asia-southeast1.run.app';
  const shortUrl = 'https://tinyurl.com/2822ntcv';

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const whatsappMessageEn = `🚨 *Protect Your Family from Online & UPI Scams!*

LifeFix AI is a free AI tool that instantly checks:
⚡ Fake Electricity Bill Cut-off SMS
💸 Fake UPI QR codes & Payment screenshots
🚔 "Digital Arrest" & fake CBI/Police video call threats
📱 WhatsApp & Telegram part-time job fraud
🔧 Plus diagnoses broken home appliances & fixes bills!

👉 *Try it free on your phone:* ${shortUrl}`;

  const whatsappMessageHi = `🚨 *अपने परिवार को ऑनलाइन और UPI फ्रॉड से बचाएं!*

LifeFix AI एक फ्री AI ऐप है जो तुरंत पकड़ता है:
⚡ बिजली बिल कटने वाले फर्जी SMS
💸 फर्जी UPI QR कोड और पेमेंट स्क्रीनशॉट
🚔 'डिजिटल अरेस्ट' और फर्जी पुलिस कॉल के झांसे
📱 यूट्यूब लाइक और टेलीग्राम पार्ट-टाइम जॉब स्कैम
🔧 इसके अलावा घरेलू रिपेयर और बिल की सही जानकारी!

👉 *बिना डाउनलोड किए फ्री में चलाएं:* ${shortUrl}`;

  const redditTemplate = `Title: I built LifeFix AI - A free AI tool to protect Indians from UPI scams, digital arrest fraud & solve daily household issues

Hey everyone,

With the massive surge in digital arrest scams, fake electricity bill disconnection SMS, and Telegram task frauds targeting our parents and friends in India, I created LifeFix AI.

What it does:
1. AI Scam Detector: Paste any suspicious SMS, WhatsApp message, or screenshot of a UPI QR code to get an instant threat score and safety steps.
2. Voice & Multilingual: Speak your problem in Hindi or English (great for non-tech-savvy family members).
3. Household Appliance & Bill Diagnosis: Upload photos of error codes or surge electricity bills.
4. Direct 1930 Cyber Cell & Citizen Portal integration.

It's completely free and works directly as a web app on Android/iOS:
Link: ${appUrl}

Would love your feedback and thoughts on what other Indian scam patterns we should add!`;

  const linkedinTemplate = `Excited to share LifeFix AI — an AI-powered safety and life assistant built to protect citizens from the escalating wave of cyber fraud, fake UPI requests, and digital arrest scams in India.

🛡️ Key Capabilities:
• Real-time Multimodal Scam & Phishing Detection
• Hindi & English Voice Assistant
• Instant Guidance connected with National Cyber Crime Helpline (1930)
• Appliance Diagnostics & Local Service Guidance

Experience it live on mobile/desktop: ${appUrl}

#CyberSecurity #ArtificialIntelligence #GeminiAI #FinTech #India #BuildInPublic`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
    appUrl
  )}&bgcolor=ffffff&color=4f46e5&margin=10`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Share & Grow LifeFix AI
              </h2>
              <span className="text-xs px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold rounded-full border border-emerald-300 dark:border-emerald-800">
                1-Click Viral
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Help protect friends, family, and society groups from scams in India
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'whatsapp'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Groups</span>
          </button>

          <button
            onClick={() => setActiveTab('social')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'social'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Reddit & LinkedIn</span>
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'qr'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Scan QR Code</span>
          </button>

          <button
            onClick={() => setActiveTab('install')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'install'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android Install</span>
          </button>
        </div>

        {/* Tab 1: WhatsApp Sharing */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-4">
            {/* Quick 1-Click WhatsApp buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessageEn)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-transform active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Share English on WhatsApp</span>
              </a>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessageHi)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-transform active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>व्हाट्सएप पर शेयर करें (हिंदी)</span>
              </a>
            </div>

            {/* Template Preview (English) */}
            <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  English WhatsApp Group Template
                </span>
                <button
                  onClick={() => copyToClipboard(whatsappMessageEn, 'wa_en')}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {copiedKey === 'wa_en' ? (
                    <span className="flex items-center gap-1 text-emerald-500 font-bold">
                      <Check className="w-3.5 h-3.5" /> Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy className="w-3.5 h-3.5" /> Copy Text
                    </span>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                {whatsappMessageEn}
              </p>
            </div>

            {/* Template Preview (Hindi) */}
            <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  हिंदी व्हाट्सएप ग्रुप मैसेज
                </span>
                <button
                  onClick={() => copyToClipboard(whatsappMessageHi, 'wa_hi')}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {copiedKey === 'wa_hi' ? (
                    <span className="flex items-center gap-1 text-emerald-500 font-bold">
                      <Check className="w-3.5 h-3.5" /> Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy className="w-3.5 h-3.5" /> Copy Text
                    </span>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                {whatsappMessageHi}
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Social Media (Reddit & LinkedIn & X) */}
        {activeTab === 'social' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  `Check out LifeFix AI — AI problem solver & scam shield for fake UPI, electricity bills & digital arrest scams in India: ${appUrl}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-black transition-colors"
              >
                <Twitter className="w-4 h-4" />
                <span>Post on X</span>
              </a>

              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(appUrl)}&text=${encodeURIComponent(
                  'LifeFix AI - Free Scam Shield & Problem Solver'
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-sky-500 text-white font-bold text-xs rounded-xl hover:bg-sky-600 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Telegram</span>
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(appUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-blue-700 text-white font-bold text-xs rounded-xl hover:bg-blue-800 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            </div>

            {/* Reddit Template */}
            <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                  r/india & r/developersIndia Post Template
                </span>
                <button
                  onClick={() => copyToClipboard(redditTemplate, 'reddit')}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {copiedKey === 'reddit' ? (
                    <span className="flex items-center gap-1 text-emerald-500 font-bold">
                      <Check className="w-3.5 h-3.5" /> Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy className="w-3.5 h-3.5" /> Copy Post
                    </span>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-4 whitespace-pre-line">
                {redditTemplate}
              </p>
            </div>

            {/* LinkedIn Template */}
            <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  LinkedIn Post Template
                </span>
                <button
                  onClick={() => copyToClipboard(linkedinTemplate, 'linkedin')}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {copiedKey === 'linkedin' ? (
                    <span className="flex items-center gap-1 text-emerald-500 font-bold">
                      <Check className="w-3.5 h-3.5" /> Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy className="w-3.5 h-3.5" /> Copy Post
                    </span>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-3 whitespace-pre-line">
                {linkedinTemplate}
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: QR Code for Offline Print / Housing Society Posters */}
        {activeTab === 'qr' && (
          <div className="text-center space-y-4 py-2">
            <div className="inline-block p-4 bg-white rounded-2xl border border-slate-200 shadow-md">
              <img
                src={qrImageUrl}
                alt="LifeFix AI QR Code"
                className="w-48 h-48 mx-auto rounded-lg"
              />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Scan to Open LifeFix AI Instantly
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                Scan with Google Lens, Paytm, PhonePe, or iPhone Camera. Perfect for housing society notice boards or local shops!
              </p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => copyToClipboard(appUrl, 'app_url')}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
              >
                {copiedKey === 'app_url' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copiedKey === 'app_url' ? 'Link Copied!' : 'Copy Direct Link'}</span>
              </button>

              <a
                href={qrImageUrl}
                download="LifeFix-AI-QR-Code.png"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-bold text-white flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Save QR Image</span>
              </a>
            </div>
          </div>
        )}

        {/* Tab 4: Android App Installation Instructions */}
        {activeTab === 'install' && (
          <div className="space-y-4">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl border border-indigo-200 dark:border-indigo-800 flex items-start gap-3">
              <Smartphone className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-slate-900 dark:text-white">
                  Zero App Store Download Required!
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  Because LifeFix AI is a Progressive Web App (PWA), any Android or iPhone user in India can install it to their home screen in 5 seconds.
                </p>
              </div>
            </div>

            {/* 3 Step Android Guide */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                How to Install on Android (Chrome):
              </h4>
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-200">
                  Open <strong>{appUrl}</strong> in Google Chrome on your phone.
                </p>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-200">
                  Tap the <strong>3 vertical dots menu (⋮)</strong> in the top-right of Chrome.
                </p>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-200">
                  Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer with Direct & Short Links */}
        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span>Short Link:</span>
            <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
              {shortUrl}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(shortUrl, 'footer_short_copy')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shrink-0 flex items-center gap-1"
            >
              {copiedKey === 'footer_short_copy' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'footer_short_copy' ? 'Copied Short Link!' : 'Copy Short Link'}</span>
            </button>
            <button
              onClick={() => copyToClipboard(appUrl, 'footer_copy')}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
            >
              {copiedKey === 'footer_copy' ? 'Copied Full Link!' : 'Copy Full URL'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
