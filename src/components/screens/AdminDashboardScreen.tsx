import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldAlert,
  TrendingUp,
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  LayoutDashboard,
  DollarSign,
  Activity,
  Search,
} from 'lucide-react';
import { AdminAnalytics } from '../../types';
import { fetchAdminAnalytics } from '../../services/api';
import { MOCK_ADMIN_ANALYTICS } from '../../data/mockData';

export const AdminDashboardScreen: React.FC = () => {
  const [data, setData] = useState<AdminAnalytics>(MOCK_ADMIN_ANALYTICS);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'scam_logs' | 'providers'>('overview');

  const reloadData = async () => {
    setIsLoading(true);
    const res = await fetchAdminAnalytics();
    if (res) setData(res);
    setIsLoading(false);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-indigo-400" />
            <h1 className="text-lg font-black tracking-tight">LifeFix CTO & Admin Control Center</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time telemetry, AI query distribution, scam threat logs, & provider verifications
          </p>
        </div>
        <button
          onClick={reloadData}
          disabled={isLoading}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh Stats</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-indigo-600 mb-1">
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
              +14%
            </span>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {data.totalUsers.toLocaleString()}
          </span>
          <p className="text-[11px] text-slate-500 font-medium">Total Registered Users</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-rose-500 mb-1">
            <ShieldAlert className="w-5 h-5" />
            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950 px-1.5 py-0.5 rounded">
              Active
            </span>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {data.scamsBlocked.toLocaleString()}
          </span>
          <p className="text-[11px] text-slate-500 font-medium">Scams Intercepted</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-500 mb-1">
            <Award className="w-5 h-5" />
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
              Verified
            </span>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {data.verifiedProviders}
          </span>
          <p className="text-[11px] text-slate-500 font-medium">Vetted Local Providers</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-amber-500 mb-1">
            <DollarSign className="w-5 h-5" />
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
              MRR
            </span>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            ${data.monthlyRevenue.toLocaleString()}
          </span>
          <p className="text-[11px] text-slate-500 font-medium">Monthly Pro Revenue</p>
        </div>
      </div>

      {/* Admin Section Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('monetization')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'monetization'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Monetization & Payouts 💰</span>
        </button>
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          AI Analytics & Categories
        </button>
        <button
          onClick={() => setActiveTab('scam_logs')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'scam_logs'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Live Scam Threat Log
        </button>
        <button
          onClick={() => setActiveTab('providers')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'providers'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Provider Moderation
        </button>
      </div>

      {/* Tab: Monetization & Payouts Engine */}
      {activeTab === 'monetization' && (
        <div className="space-y-4">
          {/* Revenue Streams Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-slate-900 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">1. Subscriptions MRR</span>
                <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full">Active</span>
              </div>
              <p className="text-xl font-black text-emerald-700 dark:text-emerald-400">
                ₹{((data.monthlyRevenueInr || 2360000) / 100000).toFixed(2)} Lakh / mo
              </p>
              <p className="text-[11px] text-slate-500 mt-1">From ₹99 Pro & ₹199 Family Shield plans</p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-slate-900 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300">2. Trade Lead Commission</span>
                <span className="text-[10px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded-full">15% Fee</span>
              </div>
              <p className="text-xl font-black text-indigo-700 dark:text-indigo-400">
                ₹{((data.leadCommissionEarned || 485000) / 100000).toFixed(2)} Lakh
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Earned on 3,240 technician bookings</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-slate-900 p-4 rounded-2xl border border-amber-200 dark:border-amber-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300">3. Affiliate Parts & Kits</span>
                <span className="text-[10px] font-black bg-amber-600 text-white px-2 py-0.5 rounded-full">Amazon / FK</span>
              </div>
              <p className="text-xl font-black text-amber-700 dark:text-amber-400">
                ₹{((data.affiliateCommissionEarned || 182400) / 100000).toFixed(2)} Lakh
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Earned on 1,420 spare tool purchases</p>
            </div>
          </div>

          {/* Owner Payout Settings Box */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Owner Bank / UPI Payout Gateway
                </h3>
                <p className="text-xs text-slate-500">
                  Where your earned subscription & lead revenue is deposited directly.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
                Payout Status: Ready
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Settlement UPI ID / VPA
                </label>
                <input
                  type="text"
                  defaultValue="kunallad0@okhdfcbank"
                  className="w-full bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Settlement Bank Account / IFSC
                </label>
                <input
                  type="text"
                  defaultValue="HDFC0001092 •••• 9924"
                  className="w-full bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-500">Auto-payouts execute every Monday at 10:00 AM IST.</span>
              <button
                onClick={() => alert("✅ Payout Request Submitted!\n\n₹30,27,400 will be deposited to kunallad0@okhdfcbank via IMPS.")}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
              >
                Withdraw Available Balance (₹30.27L)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: AI Query Analytics Distribution */}
      {activeTab === 'overview' && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Gemini AI Query Distribution by Domain
          </h3>

          <div className="space-y-3">
            {data.aiQueriesByCategory.map((cat, idx) => {
              const total = data.aiQueriesByCategory.reduce((a, b) => a + b.count, 0);
              const percentage = Math.round((cat.count / total) * 100);

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span>{cat.category}</span>
                    <span>{cat.count.toLocaleString()} queries ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-teal-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Scam Threat Logs */}
      {activeTab === 'scam_logs' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Live Blocked Scam & Phishing Stream
            </h3>
            <span className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950 px-2.5 py-0.5 rounded-full">
              4 Recent Flags
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {data.scamThreatLog.map((log) => (
              <div key={log.id} className="p-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 font-bold shrink-0">
                    {log.score}%
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{log.type}</h4>
                    <p className="text-slate-500">Reported by {log.user} • {log.date}</p>
                  </div>
                </div>

                <span className="font-bold text-rose-600 bg-rose-50 dark:bg-rose-950 px-2.5 py-1 rounded-lg">
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Provider Moderation Queue */}
      {activeTab === 'providers' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Local Trade Provider Verification Queue
            </h3>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {data.providerModerationList.map((p) => (
              <div key={p.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{p.name}</h4>
                  <p className="text-slate-500">{p.category} • Rating ★ {p.rating}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold px-2.5 py-1 rounded-lg uppercase ${
                      p.status === 'verified'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : p.status === 'pending'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
