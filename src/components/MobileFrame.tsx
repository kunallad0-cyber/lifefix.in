import React from 'react';
import {
  Home,
  MessageSquare,
  ShieldCheck,
  Search,
  Bell,
  Mic,
  BrainCircuit,
  Settings,
  HelpCircle,
  Camera,
} from 'lucide-react';

interface MobileFrameProps {
  isMobileFrame: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadNotifsCount: number;
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  isMobileFrame,
  activeTab,
  setActiveTab,
  unreadNotifsCount,
  children,
}) => {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'chat', label: 'Solve AI', icon: MessageSquare },
    { id: 'scam', label: 'Scam Shield', icon: ShieldCheck },
    { id: 'services', label: 'Services', icon: Search },
    { id: 'voice', label: 'Voice AI', icon: Mic },
    { id: 'memory', label: 'Memory', icon: BrainCircuit },
  ];

  if (!isMobileFrame) {
    // Web Desktop Canvas View
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors pb-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Desktop Tab Header Navigation bar */}
          <div className="mb-6 flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
            <div className="flex items-center gap-1 min-w-max">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 pl-4 border-l border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setActiveTab('image_analyzer')}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'image_analyzer'
                    ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Multimodal Image Analyzer"
              >
                <Camera className="w-4 h-4" />
                <span className="hidden xl:inline">Vision AI</span>
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`relative p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'notifications'
                    ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`p-2 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('help')}
                className={`p-2 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'help'
                    ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Help & FAQ"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Canvas Main Screen Content */}
          <main className="w-full">{children}</main>
        </div>
      </div>
    );
  }

  // Mobile App Phone Mockup View
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-200 dark:bg-slate-950 flex items-center justify-center p-2 sm:p-6 transition-colors">
      {/* Mobile Device Frame Chassis */}
      <div className="w-full max-w-[430px] h-[860px] max-h-[92vh] bg-slate-900 rounded-[48px] p-3 shadow-2xl border-4 border-slate-700 dark:border-slate-800 relative flex flex-col overflow-hidden">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-50 flex items-center justify-between px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
          <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        {/* Mobile Screen Shell */}
        <div className="w-full h-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-[38px] flex flex-col overflow-hidden relative">
          {/* Mobile Top Status Bar */}
          <div className="pt-3 px-6 pb-2 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-40 border-b border-slate-200/50 dark:border-slate-800/50">
            <span>{currentTime}</span>
            <div className="flex items-center gap-2 text-[10px]">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>

          {/* Screen Content Scrollable Container */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 pb-20">
            {children}
          </div>

          {/* Bottom Fixed App Navigation Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-2 flex items-center justify-around z-40">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* iOS Home Indicator bar */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-400 dark:bg-slate-600 rounded-full z-50 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
