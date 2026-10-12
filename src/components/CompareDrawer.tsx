import React from 'react';
import { useCompare } from '../context/CompareContext';
import { X, Layers, ArrowRight, Trash2 } from 'lucide-react';

export const CompareDrawer: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare, setIsCompareModalOpen } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4 animate-in slide-in-from-bottom-5">
      <div className="bg-navy-900/95 border border-brand-primary/40 rounded-2xl shadow-2xl backdrop-blur-xl p-3 sm:p-4 flex items-center justify-between gap-3 text-white">
        {/* Left icon & count */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center text-brand-secondary shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Compare Providers</span>
              <span className="px-1.5 py-0.2 rounded-full bg-brand-primary text-[10px]">
                {compareList.length} / 4
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Side-by-side metric comparison
            </p>
          </div>
        </div>

        {/* Selected Provider Avatars */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {compareList.map((p) => (
            <div
              key={p.provider_id}
              className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-lg bg-navy-800 border border-white/10 text-xs shrink-0"
            >
              <img
                src={p.image_url}
                alt={p.provider_name}
                className="w-5 h-5 rounded-md object-cover"
              />
              <span className="max-w-[100px] truncate text-[11px] font-medium text-slate-200">
                {p.provider_name}
              </span>
              <button
                onClick={() => removeFromCompare(p.provider_id)}
                className="text-slate-400 hover:text-rose-400 p-0.5 rounded transition"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clearCompare}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-navy-800 rounded-lg transition"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-primary to-indigo-600 text-white text-xs font-bold shadow-glow-indigo hover:opacity-95 transition flex items-center gap-1.5"
          >
            Compare Now
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
