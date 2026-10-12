import React, { useState } from 'react';
import { useNavigate, useLocation as useRouterLocation } from 'react-router-dom';
import {
  Menu,
  MapPin,
  Search,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { useCompare } from '../context/CompareContext';
import { GoogleMapsLocationModal } from './GoogleMapsLocationModal';

interface TopBarProps {
  onOpenMobileSidebar: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenMobileSidebar }) => {
  const { userLocation } = useLocation();
  const { compareList, setIsCompareModalOpen } = useCompare();
  const [isLocModalOpen, setIsLocModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const routerLocation = useRouterLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/services');
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full h-16 border-b border-white/10 bg-navy-950/80 backdrop-blur-xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger + breadcrumb title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-400">
          <span>NEXORA</span>
          <span>/</span>
          <span className="text-white capitalize">
            {routerLocation.pathname.replace('/', '') || 'Home'}
          </span>
        </div>
      </div>

      {/* Center: Search input */}
      <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search restaurants, clinics, hotels, salons..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-navy-900 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
      </form>

      {/* Right: Google Maps Location & Compare Tray */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => setIsLocModalOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-navy-900 border border-white/10 hover:border-indigo-500/50 text-xs text-slate-300 transition"
          title="Search or change location with Google Maps"
        >
          <MapPin className="w-3.5 h-3.5 text-red-400" />
          <span className="max-w-[130px] sm:max-w-[180px] truncate font-semibold text-white">
            {userLocation?.cityName || 'Set Location'}
          </span>
        </button>

        {compareList.length > 0 && (
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold transition shadow-sm hover:bg-indigo-500"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Compare ({compareList.length})</span>
          </button>
        )}
      </div>

      <GoogleMapsLocationModal
        isOpen={isLocModalOpen}
        onClose={() => setIsLocModalOpen(false)}
      />
    </header>
  );
};
