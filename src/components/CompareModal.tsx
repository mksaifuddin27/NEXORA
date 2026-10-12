import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import {
  X,
  Star,
  ShieldCheck,
  Clock,
  ArrowRight,
  Trash2,
  DollarSign,
  Navigation,
} from 'lucide-react';
import { formatDistance } from '../utils/formatters';

interface CompareModalProps {
  onQuickBook?: (providerId: number) => void;
}

export const CompareModal: React.FC<CompareModalProps> = () => {
  const { compareList, isCompareModalOpen, setIsCompareModalOpen, removeFromCompare, clearCompare } = useCompare();
  const navigate = useNavigate();

  if (!isCompareModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-navy-900 border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-navy-950">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              Side-by-Side Comparison
              <span className="text-xs px-2.5 py-1 rounded-full bg-brand-primary/20 text-brand-secondary border border-brand-primary/30">
                {compareList.length} Providers
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Compare ratings, services, distance, price levels, and availability to make the right choice.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={clearCompare}
              className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </button>
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Table / Grid */}
        <div className="p-4 sm:p-6 overflow-x-auto flex-1">
          {compareList.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p>No providers selected for comparison.</p>
            </div>
          ) : (
            <div className="min-w-[700px] grid gap-4" style={{ gridTemplateColumns: `repeat(${compareList.length}, minmax(220px, 1fr))` }}>
              {compareList.map((p) => (
                <div
                  key={p.provider_id}
                  className="bg-navy-850 rounded-2xl border border-white/10 p-4 flex flex-col justify-between space-y-5"
                >
                  {/* Top image & remove */}
                  <div className="relative h-36 rounded-xl overflow-hidden">
                    <img
                      src={p.image_url}
                      alt={p.provider_name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeFromCompare(p.provider_id)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-rose-600 transition"
                      title="Remove"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    {p.verification_status === 'VERIFIED' && (
                      <span className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/80 text-white backdrop-blur-sm">
                        <ShieldCheck className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>

                  {/* Title & Category */}
                  <div>
                    <h3 className="text-base font-bold text-white line-clamp-1">{p.provider_name}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.description}</p>
                  </div>

                  {/* Criteria 1: Rating */}
                  <div className="p-3 rounded-xl bg-navy-900 border border-white/5 space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Rating & Reviews
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-white">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{p.rating_avg.toFixed(1)}</span>
                      <span className="text-xs text-slate-400">({p.review_count} verified reviews)</span>
                    </div>
                  </div>

                  {/* Criteria 2: Calculated Distance */}
                  <div className="p-3 rounded-xl bg-navy-900 border border-white/5 space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Distance from you
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
                      <Navigation className="w-3.5 h-3.5 text-brand-secondary shrink-0" />
                      <span>{formatDistance(p.distance_km)}</span>
                    </div>
                  </div>

                  {/* Criteria 3: Price Level */}
                  <div className="p-3 rounded-xl bg-navy-900 border border-white/5 space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Price Tier
                    </div>
                    <div className="flex items-center gap-1 text-sm font-bold text-emerald-400">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{p.price_range}</span>
                    </div>
                  </div>

                  {/* Criteria 4: Operational Hours */}
                  <div className="p-3 rounded-xl bg-navy-900 border border-white/5 space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Operating Hours
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="line-clamp-1">{p.opening_hours}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 space-y-2">
                    <button
                      onClick={() => {
                        setIsCompareModalOpen(false);
                        navigate(`/providers/${p.provider_id}`);
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-brand-primary to-indigo-600 text-white text-xs font-bold shadow-glow-indigo hover:opacity-95 transition flex items-center justify-center gap-1.5"
                    >
                      View & Book
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
