import React, { useState } from 'react';
import {
  Send,
  Image as ImageIcon,
  Mic,
  Sparkles,
  Loader2,
  Wrench,
  ShieldAlert,
  Stethoscope,
  Building2,
  Car,
  CreditCard,
  Scale,
  GraduationCap,
  X,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  Bot,
  User,
  MapPin,
  Radio,
} from 'lucide-react';
import { ChatMessage, LocalService, ProblemCategory, UserProfile, DeviceLocation } from '../../types';
import { solveProblemWithAI } from '../../services/api';

interface ProblemSolverScreenProps {
  user: UserProfile;
  currentLocation?: DeviceLocation;
  initialCategory?: ProblemCategory;
  onNavigateToService?: (serviceId: string) => void;
}

export const ProblemSolverScreen: React.FC<ProblemSolverScreenProps> = ({
  user,
  currentLocation,
  initialCategory,
  onNavigateToService,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: `Hello ${user.name.split(' ')[0]}! I am **LifeFix AI**, your universal real-life problem solver.\n\nType, upload a photo, or tap the mic to ask anything—from fixing household leaks and resolving scam messages to understanding government forms or health advice!`,
      timestamp: 'Just now',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProblemCategory>(
    initialCategory || 'general'
  );
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const categoryChips: { id: ProblemCategory; label: string; icon: any }[] = [
    { id: 'general', label: 'All Problems', icon: Sparkles },
    { id: 'scam', label: 'Scam Shield', icon: ShieldAlert },
    { id: 'repair', label: 'Home Repair', icon: Wrench },
    { id: 'health', label: 'Health Guidance', icon: Stethoscope },
    { id: 'government', label: 'Govt & Taxes', icon: Building2 },
    { id: 'bills', label: 'Bills & Money', icon: CreditCard },
    { id: 'travel', label: 'Travel & Auto', icon: Car },
    { id: 'legal', label: 'Legal Info', icon: Scale },
    { id: 'education', label: 'Education', icon: GraduationCap },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if (!inputQuery.trim() && !selectedImageBase64) return;

    const userMsgText = inputQuery.trim() || 'Analyzed uploaded image for solution';
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: selectedCategory,
      image: selectedImageBase64 || undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    const currentImg = selectedImageBase64;
    setSelectedImageBase64(null);
    setIsLoading(true);

    try {
      const activeLocStr = currentLocation
        ? `${currentLocation.city}, ${currentLocation.state}, ${currentLocation.country}`
        : user.location;

      const res = await solveProblemWithAI(
        userMsgText,
        selectedCategory,
        currentImg || undefined,
        {
          location: activeLocStr,
          plan: user.plan,
          familyMembers: user.familyMembersCount,
        }
      );

      const aiMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        sender: 'ai',
        text: res.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: (res.category as ProblemCategory) || selectedCategory,
        suggestedServices: res.suggestedServices,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[750px] bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Top Header Category Chips */}
      <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          {categoryChips.map((chip) => {
            const Icon = chip.icon;
            const isSelected = selectedCategory === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setSelectedCategory(chip.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-2px'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-bl-2px'
              }`}
            >
              {msg.image && (
                <img
                  src={msg.image}
                  alt="Uploaded problem"
                  className="w-full max-h-48 object-cover rounded-xl mb-3 border border-white/20"
                />
              )}

              {/* Render formatted text */}
              <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {msg.text}
              </div>

              {/* Suggested Local Service Cards if returned by AI */}
              {msg.suggestedServices && msg.suggestedServices.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Recommended Certified Providers Nearby
                  </p>
                  {msg.suggestedServices.map((srv) => (
                    <div
                      key={srv.id}
                      onClick={() => onNavigateToService && onNavigateToService(srv.id)}
                      className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:border-indigo-400 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={srv.image}
                          alt={srv.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                            {srv.name}
                          </h5>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">
                            ★ {srv.rating} • {srv.distanceKm} km • {srv.hourlyRate}
                          </p>
                        </div>
                      </div>
                      <button className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-bold flex items-center gap-1">
                        <PhoneCall className="w-3 h-3" />
                        <span>Book</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <span
                className={`text-[10px] block mt-2 text-right ${
                  msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 shadow-xs mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-xs p-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <span>LifeFix AI is formulating solutions & searching nearby options...</span>
          </div>
        )}
      </div>

      {/* Image Preview attachment box before sending */}
      {selectedImageBase64 && (
        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={selectedImageBase64}
              alt="Preview"
              className="w-10 h-10 rounded-lg object-cover border"
            />
            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Image Attached for AI Analysis
            </span>
          </div>
          <button
            onClick={() => setSelectedImageBase64(null)}
            className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Location Context Pill */}
      {currentLocation && (
        <div className="px-3 py-1 bg-blue-50/70 dark:bg-blue-950/30 border-t border-blue-100 dark:border-blue-900/40 flex items-center justify-between text-[11px] text-blue-700 dark:text-blue-300">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
            <span className="truncate">
              Tailoring fixes for: <strong>{currentLocation.city}, {currentLocation.state}</strong>
            </span>
          </div>
          <span className="text-[10px] text-blue-500 font-semibold shrink-0">
            {currentLocation.isLiveGps ? '📍 Live GPS' : '🗺️ Region Set'}
          </span>
        </div>
      )}

      {/* Input Bar */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <label className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors">
          <ImageIcon className="w-4 h-4" />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>

        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Describe your problem (${selectedCategory})...`}
          className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={handleSend}
          disabled={isLoading || (!inputQuery.trim() && !selectedImageBase64)}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white transition-colors shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
