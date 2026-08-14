import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Upload,
  AlertOctagon,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Loader2,
  ExternalLink,
  MessageSquare,
  Mail,
  QrCode,
  Smartphone,
  Lock,
  MessageCircle,
  PhoneCall,
} from 'lucide-react';
import { ScamAnalysisResult, ScamSource } from '../../types';
import { analyzeScam } from '../../services/api';

export const ScamDetectorScreen: React.FC = () => {
  const [sourceChannel, setSourceChannel] = useState<ScamSource>('sms');
  const [inputText, setInputText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ScamAnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);

  const sampleScams = [
    {
      title: '⚡ Electricity Cutoff (MSEB/BSES/Discom)',
      text: 'Dear Consumer, your electricity power will be disconnected tonight at 9:30 PM from the main sub-station because your previous month bill was not updated. Please immediately contact Electricity Officer Sharma on 9876543210 or pay via upi://pay?pa=discom.bill@okhdfcbank',
      source: 'sms' as ScamSource,
    },
    {
      title: '🚔 Fake Digital Arrest / CBI Video Call',
      text: 'Urgent Notice: A courier parcel sent in your name containing passports and illegal contraband was intercepted at Mumbai Airport by Customs. A non-bailable warrant is issued against you. Connect immediately to Skype Video Call with CBI Investigation Unit or your bank accounts will be seized.',
      source: 'whatsapp' as ScamSource,
    },
    {
      title: '💸 YouTube Like / Telegram Task (₹3,500/day)',
      text: 'Greetings! You are shortlisted for Google Maps Review & YouTube video like part-time job. Earn ₹3,500 - ₹8,000 daily from home. Instant payment via UPI. To activate VIP task level 1, transfer ₹500 refundable security deposit to UPI ID: task.activation@paytm',
      source: 'whatsapp' as ScamSource,
    },
    {
      title: '🏦 Bank Account Blocked / PAN KYC Link',
      text: 'Dear SBI/HDFC Customer, your YONO / NetBanking access is disabled today due to unlinked PAN card. Update KYC immediately to avoid permanent account block: http://sbi-yono-kyc-update.xyz/login',
      source: 'sms' as ScamSource,
    },
    {
      title: '🚗 Traffic e-Challan Fake APK Notice',
      text: 'Notice: Unpaid traffic violation e-Challan of ₹2,000 recorded on vehicle. Pay within 24 hours to avoid court summons. Click to download challan receipt and settle: http://echallan-parivahan-v2.apk',
      source: 'sms' as ScamSource,
    },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!inputText.trim() && !imagePreview) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeScam(
        inputText || 'Analyze uploaded screenshot for scam and phishing indicators',
        sourceChannel,
        imagePreview || undefined
      );
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSample = (sample: (typeof sampleScams)[0]) => {
    setSourceChannel(sample.source);
    setInputText(sample.text);
    setImagePreview(null);
    setAnalysisResult(null);
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
            <ShieldAlert className="w-6 h-6 fill-current text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">AI Scam & Phishing Detector</h1>
            <p className="text-xs text-rose-100">
              Analyze SMS, WhatsApp, Emails, or UPI Screenshots in real time
            </p>
          </div>
        </div>
      </div>

      {/* Source Selection Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
        <button
          onClick={() => setSourceChannel('sms')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            sourceChannel === 'sms'
              ? 'bg-rose-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          SMS Text
        </button>
        <button
          onClick={() => setSourceChannel('whatsapp')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            sourceChannel === 'whatsapp'
              ? 'bg-rose-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          WhatsApp
        </button>
        <button
          onClick={() => setSourceChannel('email')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            sourceChannel === 'email'
              ? 'bg-rose-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          Email
        </button>
        <button
          onClick={() => setSourceChannel('screenshot')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            sourceChannel === 'screenshot'
              ? 'bg-rose-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          Screenshot
        </button>
        <button
          onClick={() => setSourceChannel('upi')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            sourceChannel === 'upi'
              ? 'bg-rose-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          Fake UPI / QR
        </button>
      </div>

      {/* Input Form */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          Paste the message content or upload a screenshot to analyze:
        </label>

        <textarea
          rows={4}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Paste ${sourceChannel.toUpperCase()} message or link here...`}
          className="w-full bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs sm:text-sm rounded-xl p-3 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
        />

        {/* Screenshot / QR Image upload */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors">
            <Upload className="w-4 h-4 text-rose-500" />
            <span>{imagePreview ? 'Change Screenshot' : 'Upload Screenshot / QR Code'}</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || (!inputText.trim() && !imagePreview)}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 disabled:opacity-50 transition-colors shadow-xs"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deep Scanning...</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4" />
                <span>Run Scam Analysis</span>
              </>
            )}
          </button>
        </div>

        {imagePreview && (
          <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center gap-3">
            <img src={imagePreview} alt="Screenshot" className="w-14 h-14 object-cover rounded-lg border" />
            <div className="text-xs text-slate-600 dark:text-slate-300">
              <p className="font-bold">Screenshot Attached</p>
              <p className="text-[10px] text-slate-400">Gemini OCR will parse text & visual cues</p>
            </div>
          </div>
        )}

        {/* Sample Scams Quick Test */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
            Test with common real-life scam examples:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {sampleScams.map((s, idx) => (
              <button
                key={idx}
                onClick={() => loadSample(s)}
                className="text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 transition-colors"
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scam Analysis Output Card */}
      {analysisResult && (
        <div
          className={`rounded-2xl p-5 border shadow-md space-y-4 ${
            analysisResult.threatLevel === 'CRITICAL_SCAM'
              ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800'
              : analysisResult.threatLevel === 'SUSPICIOUS'
              ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800'
              : 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800'
          }`}
        >
          {/* Risk Score Gauge & Threat Badge */}
          <div className="flex items-center justify-between border-b pb-3 border-current/10">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-md ${
                  analysisResult.threatLevel === 'CRITICAL_SCAM'
                    ? 'bg-rose-600'
                    : analysisResult.threatLevel === 'SUSPICIOUS'
                    ? 'bg-amber-500'
                    : 'bg-emerald-600'
                }`}
              >
                {analysisResult.riskScore}%
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                  Risk Level Detected
                </span>
                <h3 className="text-base font-black tracking-tight">
                  {analysisResult.threatLevel === 'CRITICAL_SCAM'
                    ? '🚨 DANGEROUS SCAM DETECTED'
                    : analysisResult.threatLevel === 'SUSPICIOUS'
                    ? '⚠️ HIGH SUSPICION ALERT'
                    : '✅ LIKELY SAFE / VERIFIED'}
                </h3>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 border">
              {analysisResult.scamType}
            </span>
          </div>

          {/* Explanation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-1">
              Why it is dangerous:
            </h4>
            <p className="text-xs sm:text-sm leading-relaxed">{analysisResult.explanation}</p>
          </div>

          {/* Red Flags List */}
          {analysisResult.redFlags && analysisResult.redFlags.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-1 text-rose-700 dark:text-rose-300">
                Identified Red Flags:
              </h4>
              <ul className="space-y-1">
                {analysisResult.redFlags.map((flag, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Safety Recommendations */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-1 text-emerald-700 dark:text-emerald-300">
              Immediate Safety Steps:
            </h4>
            <ul className="space-y-1">
              {analysisResult.safetySteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action CTAs */}
          <div className="pt-3 border-t border-current/10 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold">
              Action: {analysisResult.recommendedAction}
            </span>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `⚠️ *SCAM ALERT DETECTED via LifeFix AI:*\n\nType: ${analysisResult.scamType}\nRisk Score: ${analysisResult.riskScore}%\n\nWhy it's dangerous: ${analysisResult.explanation}\n\nCheck suspicious messages free here: https://ais-pre-4fy65rbgd5eou2omkr7dpx-575046237981.asia-southeast1.run.app`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Warn Family on WhatsApp</span>
              </a>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `Scam Alert Reported: ${analysisResult.scamType} - Risk ${analysisResult.riskScore}%: ${analysisResult.explanation}`
                  );
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold flex items-center gap-1.5 shadow-2xs border"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Alert'}</span>
              </button>

              <a
                href="tel:1930"
                className="px-3 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                title="Indian National Cyber Fraud Helpline"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call 1930 Helpline</span>
              </a>

              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-rose-700 transition-colors"
              >
                <span>cybercrime.gov.in</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
