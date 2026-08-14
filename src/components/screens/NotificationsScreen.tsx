import React, { useState } from 'react';
import {
  Bell,
  ShieldAlert,
  CreditCard,
  Building2,
  CloudRain,
  CheckCircle2,
  Clock,
  Filter,
  ArrowRight,
} from 'lucide-react';
import { NotificationItem } from '../../types';

interface NotificationsScreenProps {
  notifications: NotificationItem[];
  onOpenScamScanner?: () => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  notifications: initialNotifs,
  onOpenScamScanner,
}) => {
  const [notifs, setNotifs] = useState<NotificationItem[]>(initialNotifs);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const toggleRead = (id: string) => {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const filtered = notifs.filter((n) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'unread') return !n.read;
    return n.category === filterCategory;
  });

  const getIcon = (cat: string) => {
    switch (cat) {
      case 'scam':
        return <ShieldAlert className="w-5 h-5 text-rose-500" />;
      case 'bill':
        return <CreditCard className="w-5 h-5 text-blue-500" />;
      case 'govt':
        return <Building2 className="w-5 h-5 text-indigo-500" />;
      case 'weather':
        return <CloudRain className="w-5 h-5 text-amber-500" />;
      default:
        return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Smart Alerts & Reminders
          </h1>
        </div>
        <button
          onClick={() => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })))}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Mark all as read
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
        {['all', 'unread', 'scam', 'bill', 'govt', 'weather'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
              filterCategory === cat
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filtered.map((n) => (
          <div
            key={n.id}
            onClick={() => toggleRead(n.id)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              !n.read
                ? 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-800 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 opacity-75'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                {getIcon(n.category)}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {n.title}
                  </h3>
                  <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  {n.message}
                </p>

                {n.actionText && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (n.category === 'scam' && onOpenScamScanner) {
                        onOpenScamScanner();
                      }
                    }}
                    className="mt-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
                  >
                    <span>{n.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
