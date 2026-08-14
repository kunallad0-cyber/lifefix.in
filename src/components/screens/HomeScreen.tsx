import React from 'react';
import {
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Zap,
  Wrench,
  Stethoscope,
  Building2,
  Car,
  Scale,
  GraduationCap,
  CreditCard,
  Search,
  Mic,
  Camera,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  Brain,
  AlertTriangle,
  Flame,
  Share2,
  MessageCircle,
  ShieldCheck,
  Radio,
  LocateFixed,
} from 'lucide-react';
import { LocalService, NotificationItem, MemoryItem, UserProfile, DeviceLocation } from '../../types';

interface HomeScreenProps {
  user: UserProfile;
  services: LocalService[];
  notifications: NotificationItem[];
  memories: MemoryItem[];
  currentLocation?: DeviceLocation;
  onOpenLocationAdvisor?: () => void;
  onNavigate: (tab: string, extra?: any) => void;
  onOpenScamScanner: () => void;
  onOpenShare?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  services,
  notifications,
  memories,
  currentLocation,
  onOpenLocationAdvisor,
  onNavigate,
  onOpenScamScanner,
  onOpenShare,
}) => {
  const highAlert = notifications.find((n) => n.urgency === 'high' && !n.read);

  const categories = [
    { id: 'scam', name: 'Scam Shield', icon: ShieldAlert, color: 'bg-rose-500 text-white', border: 'border-rose-200' },
    { id: 'repair', name: 'Home Repair', icon: Wrench, color: 'bg-amber-500 text-white', border: 'border-amber-200' },
    { id: 'health', name: 'Health Guide', icon: Stethoscope, color: 'bg-emerald-500 text-white', border: 'border-emerald-200' },
    { id: 'government', name: 'Govt & Tax', icon: Building2, color: 'bg-blue-500 text-white', border: 'border-blue-200' },
    { id: 'bills', name: 'Bills & Money', icon: CreditCard, color: 'bg-indigo-500 text-white', border: 'border-indigo-200' },
    { id: 'travel', name: 'Travel & Car', icon: Car, color: 'bg-purple-500 text-white', border: 'border-purple-200' },
    { id: 'legal', name: 'Legal Rights', icon: Scale, color: 'bg-slate-700 text-white', border: 'border-slate-300' },
    { id: 'education', name: 'Education', icon: GraduationCap, color: 'bg-teal-500 text-white', border: 'border-teal-200' },
  ];

  return (
    <div className="space-y-5">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-teal-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-bold bg-white/20 px-2 py-0.5 rounded-full">
                AI Life Assistant
              </span>
              <span className="text-xs text-indigo-100">Welcome back</span>
            </div>
            <h1 className="text-2xl font-black mt-1 tracking-tight">
              Hello, {user.name.split(' ')[0]} 👋
            </h1>
          </div>
          <button
            onClick={() => onNavigate('chat')}
            className="w-10 h-10 rounded-full bg-white text-indigo-600 flex items-center justify-center font-bold shadow-md hover:scale-105 transition-transform"
          >
            <Sparkles className="w-5 h-5 fill-current" />
          </button>
        </div>
        <p className="text-xs text-indigo-100 max-w-md">
          Describe any problem you face—from leaking pipes to suspicious messages or unexpected bills.
        </p>

        {/* Quick Problem Entry Input Bar */}
        <div
          onClick={() => onNavigate('chat')}
          className="mt-4 bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 p-2.5 rounded-xl shadow-md cursor-pointer flex items-center justify-between gap-2 border border-white/20 hover:bg-white transition-all"
        >
          <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 flex-1">
            <Search className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="truncate">Type or describe any problem...</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('voice');
              }}
              className="p-1.5 rounded-lg bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
              title="Voice Assistant"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('image_analyzer');
              }}
              className="p-1.5 rounded-lg bg-teal-50 dark:bg-slate-800 text-teal-600 dark:text-teal-400 hover:bg-teal-100 transition-colors"
              title="Scan Appliance or Document"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Real-Time Location Radar & Regional Safety Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-4 shadow-sm border border-blue-800/60 relative overflow-hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center justify-center shrink-0 mt-0.5">
              <Radio className="w-5 h-5 text-blue-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-950 animate-ping" />
                  Live GPS Radar
                </span>
                <span className="text-xs text-blue-200">
                  {currentLocation?.formattedAddress || `${currentLocation?.city || 'Mumbai'}, ${currentLocation?.state || 'MH'}`}
                </span>
              </div>
              <h3 className="text-sm font-bold mt-1 text-white">
                Real-Time Regional Safety & Utility Advisory
              </h3>
              <p className="text-xs text-blue-200/90 mt-0.5 max-w-md">
                Tracking active local scams, utility outages, seasonal climate hazards & emergency dispatch for your coordinates.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-blue-800/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Cyber Helpline <strong>1930</strong> & Local Grid Mapped</span>
          </div>

          <button
            onClick={onOpenLocationAdvisor}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 self-end sm:self-auto"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Open Regional Radar & Advice</span>
          </button>
        </div>
      </div>

      {/* High Alert Banner (if any) */}
      {highAlert && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl p-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-rose-500 text-white shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider">
                  ⚠️ Active Scam Warning
                </h3>
                <span className="text-[10px] text-rose-500 font-medium">{highAlert.timestamp}</span>
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 mt-0.5">
                {highAlert.title}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                {highAlert.message}
              </p>
              <button
                onClick={onOpenScamScanner}
                className="mt-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
              >
                <span>Analyze Suspicious Message Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Today's Tasks & Pending Issues */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Today's Action Items & Pending Issues
            </h2>
          </div>
          <span className="text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">
            3 Active
          </span>
        </div>

        <div className="space-y-2">
          <div
            onClick={() => onNavigate('image_analyzer')}
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between cursor-pointer hover:border-indigo-300 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Inspect Water Heater Noise
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Appliance memory flag: Rheem 50-Gal
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div
            onClick={() => onNavigate('notifications')}
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between cursor-pointer hover:border-indigo-300 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Review Electricity Bill ($142.50)
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Due in 3 days • Austin Energy
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div
            onClick={() => onNavigate('scam')}
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between cursor-pointer hover:border-indigo-300 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Scam Shield Status: Protected
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  0 suspicious links clicked today
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Problem Categories Grid */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            What do you need help with?
          </h2>
          <button
            onClick={() => onNavigate('chat')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => onNavigate('chat', { category: cat.id })}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:scale-102 transition-all shadow-2xs group text-center"
              >
                <div className={`w-9 h-9 rounded-xl ${cat.color} flex items-center justify-center mb-1.5 shadow-xs group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Memory Snapshot */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-indigo-950/40 rounded-2xl p-4 border border-indigo-100 dark:border-indigo-900/60 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
              AI Memory Vault
            </h3>
          </div>
          <button
            onClick={() => onNavigate('memory')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Manage Memory
          </button>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
          LifeFix remembers your home setup, family health alerts, and preferred local services to tailor every solution.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {memories.slice(0, 2).map((mem) => (
            <div
              key={mem.id}
              className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-indigo-100 dark:border-slate-700"
            >
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {mem.title}
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1 mt-0.5">
                {mem.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* India Scam Shield & WhatsApp Distribution Card */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md shrink-0 mt-0.5">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider font-bold bg-white/20 px-2 py-0.5 rounded-full">
                  India Fraud Defense 🇮🇳
                </span>
                <span className="text-[10px] text-emerald-100">100% Free AI Shield</span>
              </div>
              <h3 className="text-sm font-black mt-1 tracking-tight">
                Protect Family from UPI, Digital Arrest & Bill Scams
              </h3>
              <p className="text-xs text-emerald-100 mt-1 max-w-sm">
                Share LifeFix AI in your family & apartment society WhatsApp groups to safeguard parents and elders.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-white/20 flex items-center justify-between gap-2">
          <button
            onClick={() => onOpenShare?.()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-emerald-800 font-bold text-xs shadow-xs hover:bg-emerald-50 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share on WhatsApp & Social</span>
          </button>

          <a
            href="tel:1930"
            className="flex items-center gap-1 text-xs font-semibold text-emerald-100 hover:text-white"
          >
            <span>Cyber Helpline: <strong>1930</strong></span>
          </a>
        </div>
      </div>

      {/* Nearby Top Rated Services */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Verified Local Services ({user.location})
            </h2>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            See Map & List
          </button>
        </div>

        <div className="space-y-2">
          {services.slice(0, 3).map((srv) => (
            <div
              key={srv.id}
              onClick={() => onNavigate('services', { serviceId: srv.id })}
              className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-indigo-400 transition-all flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <img
                  src={srv.image}
                  alt={srv.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      {srv.name}
                    </h3>
                    {srv.verified && (
                      <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.2 rounded font-bold">
                        VERIFIED
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className="text-amber-500 font-bold">★ {srv.rating}</span>
                    <span>•</span>
                    <span>{srv.distanceKm} km away</span>
                    <span>•</span>
                    <span>{srv.hourlyRate}</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
