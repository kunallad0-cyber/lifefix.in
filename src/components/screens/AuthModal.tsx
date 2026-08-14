import React, { useState } from 'react';
import { X, UserCheck, Mail, Lock, LogIn, Sparkles, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../../types';

interface AuthModalProps {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ user, setUser, onClose }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'guest'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (provider: 'google' | 'apple' | 'email' | 'guest') => {
    let name = 'Alex Rivera';
    let userEmail = 'alex.rivera@example.com';

    if (provider === 'guest') {
      name = 'Guest User';
      userEmail = 'guest@lifefix.ai';
    } else if (email) {
      name = email.split('@')[0];
      userEmail = email;
    }

    setUser({
      ...user,
      name,
      email: userEmail,
      authProvider: provider,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-2 shadow-md">
            <Sparkles className="w-6 h-6 fill-current" />
          </div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            LifeFix AI Account
          </h2>
          <p className="text-xs text-slate-500">
            Sign in to synchronize AI memory, save scam alerts & local services
          </p>
        </div>

        {/* Current Auth Status */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs space-y-1">
          <p className="font-bold text-slate-700 dark:text-slate-200">Currently Logged In As:</p>
          <p className="text-indigo-600 dark:text-indigo-400 font-semibold">{user.name} ({user.email})</p>
          <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded font-bold uppercase inline-block mt-1">
            Method: {user.authProvider}
          </span>
        </div>

        {/* Auth Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => handleLogin('google')}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="font-bold text-indigo-600">G</span> Continue with Google
          </button>

          <button
            onClick={() => handleLogin('apple')}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <span></span> Continue with Apple
          </button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white dark:bg-slate-900 px-2 text-slate-400 font-bold">
                or Email Login
              </span>
            </div>
          </div>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address..."
            className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-xl p-2.5 border border-slate-200 dark:border-slate-700"
          />

          <button
            onClick={() => handleLogin('email')}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-xs"
          >
            Sign In with Email
          </button>

          <button
            onClick={() => handleLogin('guest')}
            className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 pt-1"
          >
            Continue in Guest Mode
          </button>
        </div>
      </div>
    </div>
  );
};
