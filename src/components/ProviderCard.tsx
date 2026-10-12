import React from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  Check,
  Plus,
  ArrowUpRight,
  Calendar,
} from 'lucide-react';
import { Provider } from '../types';
import { formatDistance } from '../utils/formatters';
import { useCompare } from '../context/CompareContext';

interface ProviderCardProps {
  provider: Provider;
  categoryName?: string;
  onQuickBook?: (provider: Provider) => void;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  categoryName,
  onQuickBook,
}) => {
  const { isComparing, addToCompare, removeFromCompare } = useCompare();
  const comparing = isComparing(provider.provider_id);

  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (comparing) {
      removeFromCompare(provider.provider_id);
    } else {
      addToCompare(provider);
    }
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group border border-white/10 hover:border-brand-primary/40">
      {/* Image Container with Badges */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-navy-900">
        <img
          src={provider.image_url}
          alt={provider.provider_name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {categoryName && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-navy-900/80 backdrop-blur-md text-brand-secondary border border-white/15">
                {categoryName}
              </span>
            )}
            {provider.verification_status === 'VERIFIED' && (
              <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </span>
            )}
          </div>

          {/* Compare Toggle Button */}
          <button
            onClick={toggleCompare}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md border transition flex items-center gap-1 shadow-md ${
              comparing
                ? 'bg-brand-primary text-white border-brand-primary shadow-glow-indigo'
                : 'bg-navy-900/80 text-slate-200 border-white/20 hover:bg-navy-800'
            }`}
            title="Add to side-by-side comparison"
          >
            {comparing ? (
              <>
                <Check className="w-3 h-3" />
                Comparing
              </>
            ) : (
              <>
                <Plus className="w-3 h-3" />
                Compare
              </>
            )}
          </button>
        </div>

        {/* Price & Rating Overlay at Bottom of Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-950/85 backdrop-blur-md border border-white/10 text-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-white">{provider.rating_avg.toFixed(1)}</span>
            <span className="text-slate-400 text-[10px]">({provider.review_count})</span>
          </div>

          <span className="px-2 py-0.5 rounded-md bg-navy-950/85 backdrop-blur-md border border-white/10 text-xs font-bold text-indigo-300 tracking-wider">
            {provider.price_range}
          </span>
        </div>
      </div>

      {/* Details Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <Link
            to={`/providers/${provider.provider_id}`}
            className="group/title block"
          >
            <h3 className="text-base sm:text-lg font-bold text-white group-hover/title:text-indigo-400 transition line-clamp-1">
              {provider.provider_name.replace(/\[Demo.*?\]/gi, '').trim()}
            </h3>
          </Link>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {provider.description}
          </p>
        </div>

        {/* Location & Timings Metadata */}
        <div className="space-y-1.5 text-xs text-slate-300 border-t border-white/10 pt-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-brand-secondary shrink-0" />
            <span className="truncate">{provider.address}</span>
          </div>

          {/* Dynamic Distance Badge */}
          <div className="flex items-center justify-between text-[11px]">
            <span className={`font-medium ${provider.distance_km !== null ? 'text-indigo-300' : 'text-slate-500'}`}>
              {formatDistance(provider.distance_km)}
            </span>

            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3 h-3 text-slate-400" />
              <span className="truncate max-w-[140px]">{provider.opening_hours}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link
            to={`/providers/${provider.provider_id}`}
            className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-navy-800 hover:bg-navy-750 text-slate-200 border border-white/10 text-xs font-semibold transition"
          >
            Details
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => onQuickBook && onQuickBook(provider)}
            className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-gradient-to-r from-brand-primary to-indigo-600 hover:from-brand-primaryHover hover:to-indigo-500 text-white text-xs font-semibold shadow-glow-indigo transition"
          >
            <Calendar className="w-3.5 h-3.5" />
            Book Slot
          </button>
        </div>
      </div>
    </div>
  );
};
