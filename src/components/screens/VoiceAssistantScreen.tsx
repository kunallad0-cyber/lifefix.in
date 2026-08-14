import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Globe, Sparkles, Bot, User, RefreshCw } from 'lucide-react';
import { solveProblemWithAI } from '../../services/api';

export const VoiceAssistantScreen: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [selectedLang, setSelectedLang] = useState('en-US');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceLogs, setVoiceLogs] = useState<{ sender: 'user' | 'ai'; text: string; time: string }[]>([
    {
      sender: 'ai',
      text: 'Voice Assistant activated. Tap the microphone to start speaking in your preferred language.',
      time: 'Ready',
    },
  ]);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check for Web Speech API
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = selectedLang;

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [selectedLang]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported in this browser. You can type or use fallback text voice inputs.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (transcript.trim()) {
        processVoiceInput(transcript);
      }
    } else {
      setTranscript('');
      recognitionRef.current.lang = selectedLang;
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const processVoiceInput = async (spokenText: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setVoiceLogs((prev) => [...prev, { sender: 'user', text: spokenText, time: timeNow }]);

    try {
      const res = await solveProblemWithAI(spokenText, 'general');
      const cleanAiText = res.text.replace(/[*#]/g, ''); // Clean markdown for speech
      setVoiceLogs((prev) => [...prev, { sender: 'ai', text: cleanAiText, time: timeNow }]);

      // Speak back using SpeechSynthesis
      speakText(cleanAiText);
    } catch (err) {
      console.error(err);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.slice(0, 300));
      utterance.lang = selectedLang;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Voice Visualizer Stage */}
      <div className="bg-gradient-to-b from-indigo-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl flex flex-col items-center justify-center relative overflow-hidden text-center min-h-[260px]">
        {/* Language selector badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
          <Globe className="w-3.5 h-3.5" />
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="bg-transparent text-white cursor-pointer focus:outline-none"
          >
            <option value="en-US" className="text-slate-900">English (US)</option>
            <option value="es-ES" className="text-slate-900">Español</option>
            <option value="hi-IN" className="text-slate-900">हिंदी (Hindi)</option>
            <option value="fr-FR" className="text-slate-900">Français</option>
            <option value="de-DE" className="text-slate-900">Deutsch</option>
          </select>
        </div>

        {/* Animated Visualizer Mic Pulse Button */}
        <div className="relative my-4">
          {isListening && (
            <div className="absolute inset-0 rounded-full bg-rose-500/40 animate-ping scale-150" />
          )}
          {isSpeaking && (
            <div className="absolute inset-0 rounded-full bg-teal-500/40 animate-pulse scale-125" />
          )}

          <button
            onClick={toggleListening}
            className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all ${
              isListening
                ? 'bg-rose-600 hover:bg-rose-700 text-white scale-110'
                : 'bg-gradient-to-tr from-indigo-500 via-blue-500 to-teal-400 text-white hover:scale-105'
            }`}
          >
            {isListening ? (
              <MicOff className="w-10 h-10 animate-pulse" />
            ) : (
              <Mic className="w-10 h-10" />
            )}
          </button>
        </div>

        <p className="text-sm font-bold tracking-wide">
          {isListening
            ? 'Listening... Speak your problem clearly'
            : isSpeaking
            ? 'LifeFix AI Speaking...'
            : 'Tap Microphone to Speak'}
        </p>

        {transcript && (
          <p className="text-xs text-indigo-200 mt-2 bg-white/10 px-4 py-2 rounded-xl max-w-sm">
            "{transcript}"
          </p>
        )}

        {isSpeaking && (
          <button
            onClick={stopSpeech}
            className="mt-3 px-3 py-1 rounded-full bg-white/20 text-xs font-bold flex items-center gap-1 hover:bg-white/30"
          >
            <VolumeX className="w-3.5 h-3.5" />
            Stop Audio
          </button>
        )}
      </div>

      {/* Voice Conversation History Log */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Voice Conversation Transcript
          </h3>
          <button
            onClick={() => setVoiceLogs([])}
            className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Clear Log
          </button>
        </div>

        <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-1">
          {voiceLogs.map((log, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-xs leading-relaxed ${
                log.sender === 'user'
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900 text-slate-800 dark:text-slate-200'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between font-bold mb-1">
                <span className="flex items-center gap-1.5 text-[11px] text-indigo-600 dark:text-indigo-400">
                  {log.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  {log.sender === 'user' ? 'You Spoke' : 'LifeFix AI Voice Response'}
                </span>
                <span className="text-[10px] text-slate-400">{log.time}</span>
              </div>
              <p>{log.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
