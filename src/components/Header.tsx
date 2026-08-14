import React from 'react';
import {
  Smartphone,
  Monitor,
  ShieldAlert,
  Moon,
  Sun,
  Globe,
  UserCheck,
  Zap,
  LayoutDashboard,
  Share2,
  MapPin,
  Radio,
} from 'lucide-react';
import { UserProfile, DeviceLocation } from '../types';

interface HeaderProps {
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  language: string;
  setLanguage: (lang: string) => void;
  user: UserProfile;
  currentLocation?: DeviceLocation;
  onOpenLocationAdvisor?: () => void;
  onOpenAuth: () => void;
  onOpenSubscription: () => void;
  onOpenScamScanner: () => void;
  onOpenShare: () => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isMobileFrame,
  setIsMobileFrame,
  darkMode,
  setDarkMode,
  language,
  setLanguage,
  user,
  currentLocation,
  onOpenLocationAdvisor,
  onOpenAuth,
  onOpenSubscription,
  onOpenScamScanner,
  onOpenShare,
  currentTab,
  setCurrentTab,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Branding & App Title */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-blue-600 to-teal-600 dark:from-indigo-400 dark:to-teal-400 bg-clip-text text-transparent">
                  LifeFix AI
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                  Gemini Powered
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Universal AI Problem Solver & Scam Shield
              </p>
            </div>
          </div>
        </div>

        {/* Center: View Switcher (Mobile App Frame vs Full Web View) */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setIsMobileFrame(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isMobileFrame
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Switch to Mobile App Preview Frame"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile App View</span>
          </button>
          <button
            onClick={() => setIsMobileFrame(false)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              !isMobileFrame
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Switch to Full Width Web Application View"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Full Web View</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Location Radar Button */}
          {onOpenLocationAdvisor && (
            <button
              onClick={onOpenLocationAdvisor}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors shadow-2xs group"
              title="Real-Time Location Radar & Regional Safety Advisory"
            >
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 animate-ping" />
              </div>
              <span className="max-w-[85px] sm:max-w-[120px] truncate">
                {currentLocation?.city || 'Location'}
              </span>
            </button>
          )}

          {/* Share & Viral button */}
          <button
            onClick={onOpenShare}
            className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors shadow-xs"
            title="Share on WhatsApp, Reddit, Telegram & Social Media"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Share 🇮🇳</span>
          </button>

          {/* Quick Scam Scanner button */}
          <button
            onClick={onOpenScamScanner}
            className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors shadow-xs"
          >
            <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
            <span className="hidden sm:inline">Scam Shield</span>
          </button>

          {/* Admin Dashboard shortcut */}
          <button
            onClick={() => setCurrentTab('admin')}
            className={`p-2 rounded-lg text-xs font-medium border transition-colors ${
              currentTab === 'admin'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title="CTO Admin Dashboard"
          >
            <LayoutDashboard className="w-4 h-4" />
          </button>

          {/* Language selector */}
          <div className="relative hidden lg:block">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="appearance-none bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-lg pl-7 pr-4 py-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="en">English (US)</option>
              <option value="es">Español</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
            <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5 pointer-events-none" />
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Premium Plan Badge / Subscription trigger */}
          <button
            onClick={onOpenSubscription}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 ${
              user.plan === 'premium'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:opacity-90'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>{user.plan === 'premium' ? 'PRO ACTIVE' : 'UPGRADE'}</span>
          </button>

          {/* User Profile / Login */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover border border-indigo-400"
            />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-200 hidden md:inline pr-1">
              {user.name.split(' ')[0]}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
