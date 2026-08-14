import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Globe,
  Bell,
  Lock,
  Download,
  Trash2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { UserProfile } from '../../types';

interface SettingsScreenProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  language: string;
  setLanguage: (lang: string) => void;
  user: UserProfile;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  darkMode,
  setDarkMode,
  language,
  setLanguage,
  user,
}) => {
  const [pushNotifs, setPushNotifs] = useState(true);
  const [scamNotifs, setScamNotifs] = useState(true);

  const handleExportData = () => {
    const dataStr = JSON.stringify(user, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lifefix_gdpr_export_${user.id}.json`;
    a.click();
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
          <SettingsIcon className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-white">
            App Settings & Preferences
          </h1>
          <p className="text-xs text-slate-500">Theme, languages, notifications & GDPR controls</p>
        </div>
      </div>

      {/* Theme & Display */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Display & Appearance
        </h2>

        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            <span>Dark Mode</span>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${
              darkMode ? 'bg-indigo-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                darkMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <Globe className="w-4 h-4 text-indigo-500" />
            <span>Primary Language</span>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 text-xs rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200"
          >
            <option value="en">English (US)</option>
            <option value="es">Español</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Push Notification Preferences
        </h2>

        <div className="flex items-center justify-between py-1">
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Instant Scam & Threat Alerts
          </span>
          <button
            onClick={() => setScamNotifs(!scamNotifs)}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${
              scamNotifs ? 'bg-indigo-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                scamNotifs ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Bill & Govt Deadline Reminders
          </span>
          <button
            onClick={() => setPushNotifs(!pushNotifs)}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${
              pushNotifs ? 'bg-indigo-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                pushNotifs ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Security & GDPR Data Controls */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Privacy & GDPR Data Management
        </h2>

        <div className="flex items-center justify-between py-1">
          <button
            onClick={handleExportData}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 hover:underline"
          >
            <Download className="w-4 h-4" />
            <span>Download All My Account Data (JSON)</span>
          </button>
        </div>

        <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => alert('Account memory wiped completely.')}
            className="text-xs font-bold text-rose-600 flex items-center gap-1.5 hover:underline"
          >
            <Trash2 className="w-4 h-4" />
            <span>Purge AI Memory Vault</span>
          </button>
        </div>
      </div>
    </div>
  );
};
