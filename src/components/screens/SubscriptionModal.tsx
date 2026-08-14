import React, { useState } from 'react';
import {
  X,
  Check,
  Zap,
  ShieldCheck,
  Sparkles,
  CreditCard,
  Lock,
  Loader2,
  Smartphone,
  Building,
  QrCode,
  ArrowRight,
  Receipt,
  Users,
} from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../../data/mockData';
import { UserProfile, SubscriptionPlan } from '../../types';

interface SubscriptionModalProps {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  user,
  setUser,
  onClose,
}) => {
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(
    SUBSCRIPTION_PLANS.find((p) => p.id === 'premium') || SUBSCRIPTION_PLANS[1]
  );
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('user@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const getPrice = (plan: SubscriptionPlan) => {
    if (currency === 'INR') {
      return billingCycle === 'yearly' ? plan.priceYearlyInr : plan.priceMonthlyInr;
    } else {
      return billingCycle === 'yearly' ? plan.priceYearlyUsd : plan.priceMonthlyUsd;
    }
  };

  const handleSubscribe = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setUser({ ...user, plan: 'premium' });
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1300);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 relative my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          !showCheckout ? (
            <>
              {/* Header & Badges */}
              <div className="text-center space-y-1.5 pt-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 text-white text-[11px] font-black uppercase tracking-wider shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>LifeFix AI Subscription & Safety Plans</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Protect Your Money, Family & Home with AI
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Unlimited fake UPI/SMS scam detection, real-time voice diagnostics, & priority emergency trade dispatch.
                </p>
              </div>

              {/* Currency & Billing Period Controls */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                {/* Currency Switcher */}
                <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setCurrency('INR')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      currency === 'INR'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    🇮🇳 India (INR ₹)
                  </button>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      currency === 'USD'
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    🌐 Global (USD $)
                  </button>
                </div>

                {/* Monthly / Yearly Switcher */}
                <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      billingCycle === 'monthly'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                        : 'text-slate-500'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                      billingCycle === 'yearly'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                        : 'text-slate-500'
                    }`}
                  >
                    <span>Annual</span>
                    <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-full font-black">
                      Save 40%
                    </span>
                  </button>
                </div>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {SUBSCRIPTION_PLANS.map((plan) => {
                  const isCurrent = user.plan === plan.id;
                  const isSelected = selectedPlan.id === plan.id;

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      className={`rounded-2xl p-3.5 border flex flex-col justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-md ring-2 ring-indigo-500/20'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                      }`}
                    >
                      <div>
                        {/* Plan Header */}
                        <div className="flex items-center justify-between mb-1 min-h-[22px]">
                          <span className="text-xs font-black text-slate-900 dark:text-white">
                            {plan.name}
                          </span>
                          {plan.badge && (
                            <span className="text-[8px] font-black tracking-tight uppercase px-1.5 py-0.5 rounded-full bg-indigo-600 text-white">
                              {plan.badge}
                            </span>
                          )}
                        </div>

                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-2 leading-tight">
                          {plan.tagline}
                        </p>

                        {/* Price */}
                        <div className="mb-3">
                          <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                            {getPrice(plan)}
                          </span>
                        </div>

                        {/* Features List */}
                        <ul className="space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                          {plan.features.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-1 leading-tight">
                              <Check className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlan(plan);
                          if (plan.id !== 'free') {
                            setShowCheckout(true);
                          } else {
                            setUser({ ...user, plan: 'free' });
                            onClose();
                          }
                        }}
                        className={`mt-4 w-full py-2 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                          plan.id !== 'free'
                            ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-90 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {isCurrent
                          ? 'Current Active'
                          : plan.id !== 'free'
                          ? `Choose ${plan.name.split(' ')[0]}`
                          : 'Stay Free'}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Trust & Guarantee Banner */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Instant 1-Click Cancel anytime • UPI AutoPay & Card supported</span>
                </div>
                <button
                  onClick={() => setShowCheckout(true)}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          ) : (
            /* Checkout & Payment Step */
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-600 text-white">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Secure Checkout - {selectedPlan.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Total Due: <strong className="text-indigo-600 dark:text-indigo-400">{getPrice(selectedPlan)}</strong> ({billingCycle} billing)
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white underline font-semibold"
                >
                  Change Plan
                </button>
              </div>

              {/* Payment Methods Tabs */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs font-bold transition-all ${
                    paymentMethod === 'upi'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>UPI / QR</span>
                </button>

                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs font-bold transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-800 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <span>Debit / Cards</span>
                </button>

                <button
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs font-bold transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-800 dark:text-purple-300 ring-2 ring-purple-500/20'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Building className="w-4 h-4 text-purple-600" />
                  <span>Net Banking</span>
                </button>
              </div>

              {/* UPI Form */}
              {paymentMethod === 'upi' && (
                <div className="space-y-3 p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Enter UPI ID / VPA (Google Pay, PhonePe, Paytm, BHIM)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@okhdfcbank"
                        className="flex-1 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        className="px-3 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-bold text-xs"
                      >
                        Verify
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    <span>A secure payment request will be sent to your UPI App.</span>
                  </div>
                </div>
              )}

              {/* Card Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      defaultValue="4242 •••• •••• 4242"
                      className="w-full bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        defaultValue="12 / 28"
                        className="w-full bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        defaultValue="789"
                        className="w-full bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* NetBanking Form */}
              {paymentMethod === 'netbanking' && (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    Select Your Bank
                  </label>
                  <select className="w-full bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700">
                    <option>HDFC Bank</option>
                    <option>State Bank of India (SBI)</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <Lock className="w-4 h-4 shrink-0" />
                <span>256-Bit SSL Encrypted by Razorpay & Stripe. Instant activation.</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setShowCheckout(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Back
                </button>
                <button
                  onClick={handleSubscribe}
                  disabled={isProcessing}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying Payment...</span>
                    </>
                  ) : (
                    <span>Pay {getPrice(selectedPlan)} & Activate</span>
                  )}
                </button>
              </div>
            </div>
          )
        ) : (
          /* Payment Success View */
          <div className="text-center py-4 space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Payment Successful!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {selectedPlan.name} is now active on your account (Order ID: #LFX-99824).
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700 text-left max-w-sm mx-auto space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Plan:</span>
                <strong className="text-slate-800 dark:text-slate-200">{selectedPlan.name}</strong>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Amount Paid:</span>
                <strong className="text-emerald-600">{getPrice(selectedPlan)}</strong>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Next Billing:</span>
                <strong className="text-slate-800 dark:text-slate-200">
                  {billingCycle === 'yearly' ? 'August 2027' : 'September 2026'}
                </strong>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md hover:bg-indigo-700 transition-colors"
            >
              Start Using Pro Features
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
