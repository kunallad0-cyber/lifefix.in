import React, { useState } from 'react';
import { Brain, Plus, Trash2, ShieldCheck, HeartHandshake, Car, CreditCard, Sparkles } from 'lucide-react';
import { MemoryItem } from '../../types';

interface MemoryScreenProps {
  memories: MemoryItem[];
}

export const MemoryScreen: React.FC<MemoryScreenProps> = ({ memories: initialMemories }) => {
  const [items, setItems] = useState<MemoryItem[]>(initialMemories);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryItem['category']>('preference');

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    const item: MemoryItem = {
      id: `mem_${Date.now()}`,
      category: newCategory,
      title: newTitle.trim(),
      detail: newDetail.trim(),
      lastUpdated: 'Just now',
    };
    setItems([item, ...items]);
    setNewTitle('');
    setNewDetail('');
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 rounded-2xl p-5 text-white shadow-lg flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Brain className="w-5 h-5" />
            <h1 className="text-lg font-black">AI Long-Term Memory Vault</h1>
          </div>
          <p className="text-xs text-purple-100 max-w-sm">
            LifeFix securely retains household specifics so you never need to repeat model numbers or health constraints.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-xl bg-white text-indigo-700 font-bold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 transition-transform shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Memory</span>
        </button>
      </div>

      {/* Memory Cards Grid */}
      <div className="space-y-3">
        {items.map((mem) => (
          <div
            key={mem.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-start justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded">
                  {mem.category}
                </span>
                <span className="text-[10px] text-slate-400">• Updated {mem.lastUpdated}</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                {mem.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {mem.detail}
              </p>
            </div>

            <button
              onClick={() => handleDelete(mem.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
              title="Forget this memory"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Save New AI Memory
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-xl p-2.5 border border-slate-200 dark:border-slate-700"
              >
                <option value="preference">Personal Preference</option>
                <option value="family">Family & Health Note</option>
                <option value="vehicle_home">Home & Appliance Detail</option>
                <option value="service">Trusted Service Provider</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Memory Title
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. AC Filter Size / Allergic to Penicillin"
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-xl p-2.5 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Detail
              </label>
              <textarea
                rows={3}
                value={newDetail}
                onChange={(e) => setNewDetail(e.target.value)}
                placeholder="Specific instructions or model serial numbers..."
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-xl p-2.5 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
              >
                Save Memory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
