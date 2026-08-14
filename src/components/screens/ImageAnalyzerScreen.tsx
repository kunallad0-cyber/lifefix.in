import React, { useState } from 'react';
import {
  Camera,
  Upload,
  Loader2,
  Wrench,
  FileText,
  Pill,
  Receipt,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { ImageAnalysisResult } from '../../types';
import { analyzeImage } from '../../services/api';

export const ImageAnalyzerScreen: React.FC = () => {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [userPrompt, setUserPrompt] = useState('');
  const [category, setCategory] = useState<string>('appliance');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ImageAnalysisResult | null>(null);

  const samplePresets = [
    {
      title: 'Leaking Washing Machine Drain',
      category: 'appliance',
      image: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&q=80&w=400',
      prompt: 'Washing machine is leaking water from the bottom during spin cycle. What is wrong?',
    },
    {
      title: 'High Electricity Bill Breakdown',
      category: 'bill',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400',
      prompt: 'Check why my summer electricity bill surged by 40% and if there are unexpected fees.',
    },
    {
      title: 'Prescription Medicine Label',
      category: 'medicine',
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=400',
      prompt: 'Explain dosage, food restrictions, and non-diagnostic precautions for this label.',
    },
    {
      title: 'Error Code E04 HVAC Display',
      category: 'error_code',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400',
      prompt: 'HVAC unit displaying error E04. How do I reset or fix it safely?',
    },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async (imgToUse?: string, promptToUse?: string, catToUse?: string) => {
    const targetImage = imgToUse || imageBase64;
    if (!targetImage) return;

    setIsAnalyzing(true);
    try {
      const res = await analyzeImage(
        targetImage,
        promptToUse || userPrompt || 'Analyze this image and provide solutions',
        catToUse || category
      );
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectPreset = (preset: (typeof samplePresets)[0]) => {
    setImageBase64(preset.image);
    setUserPrompt(preset.prompt);
    setCategory(preset.category);
    runAnalysis(preset.image, preset.prompt, preset.category);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">Vision AI & Image Understanding</h1>
            <p className="text-xs text-teal-100">
              Snap a picture of broken appliances, bills, medicine labels, receipts, or error codes
            </p>
          </div>
        </div>
      </div>

      {/* Preset Scenarios Selector */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          Try Quick Image Scenarios:
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {samplePresets.map((p, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectPreset(p)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 cursor-pointer hover:border-teal-500 transition-all shadow-2xs flex flex-col items-center text-center"
            >
              <img src={p.image} alt={p.title} className="w-full h-20 object-cover rounded-lg mb-2" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                {p.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Image Upload Box */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-1/3 aspect-video sm:aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center p-3 relative bg-slate-50 dark:bg-slate-800 overflow-hidden">
            {imageBase64 ? (
              <img src={imageBase64} alt="Target" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <div className="text-center">
                <Upload className="w-8 h-8 text-teal-500 mx-auto mb-1" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Upload Photo
                </span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>

          <div className="flex-1 space-y-3 w-full">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-xl p-2.5 border border-slate-200 dark:border-slate-700"
              >
                <option value="appliance">Broken Appliance / Plumbing</option>
                <option value="bill">Bill / Receipt / Invoice</option>
                <option value="medicine">Medicine Label / Prescription</option>
                <option value="document">Legal Document / Govt Notice</option>
                <option value="error_code">Machinery Error Code / Light</option>
                <option value="general">General Product / Object</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Question or Symptom Description:
              </label>
              <input
                type="text"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="e.g. Water leaking from valve, strange buzzing noise..."
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-xl p-2.5 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              onClick={() => runAnalysis()}
              disabled={isAnalyzing || !imageBase64}
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-colors shadow-xs"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Multimodal Inspection Running...</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  <span>Analyze Image Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Output Result */}
      {result && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                AI Visual Diagnostic
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {result.problemTitle}
              </h3>
            </div>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                result.urgency === 'urgent' || result.urgency === 'high'
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
              }`}
            >
              Urgency: {result.urgency}
            </span>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Visual Inspection Analysis:
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              {result.description}
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-0.5">
              Estimated Cost / Repair Difficulty:
            </h4>
            <p className="text-xs font-semibold text-teal-600 dark:text-teal-400">
              {result.estimatedCostOrDifficulty}
            </p>
          </div>

          {result.immediateSteps && result.immediateSteps.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Immediate Action Roadmap:
              </h4>
              <ul className="space-y-1">
                {result.immediateSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.safetyWarning && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-2 text-xs text-amber-800 dark:text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{result.safetyWarning}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
