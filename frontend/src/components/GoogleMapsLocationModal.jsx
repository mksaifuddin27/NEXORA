import React, { useState } from 'react';
import { MapPin, Search, ExternalLink, Navigation, X, Check, Building2, } from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { POPULAR_CITIES, getGoogleMapsSearchUrl } from '../utils/geo';
export const GoogleMapsLocationModal = ({ isOpen, onClose, }) => {
    const { userLocation, requestCurrentLocation, selectCityPreset, searchLocationWithGoogle, isLoading, errorMessage, } = useLocation();
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchFeedback, setSearchFeedback] = useState(null);
    if (!isOpen)
        return null;
    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim())
            return;
        setIsSearching(true);
        setSearchFeedback(null);
        const success = await searchLocationWithGoogle(query.trim());
        setIsSearching(false);
        if (success) {
            setSearchFeedback(`Location updated to "${query.trim()}"!`);
            setTimeout(() => {
                onClose();
            }, 700);
        }
    };
    const handleOpenGoogleMapsExternal = () => {
        const target = query.trim() || userLocation?.cityName || 'Hyderabad';
        window.open(getGoogleMapsSearchUrl(target), '_blank', 'noopener,noreferrer');
    };
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-navy-900 border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
              <MapPin className="w-5 h-5"/>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Google Maps Location Search</h3>
              <p className="text-xs text-slate-400">Pinpoint your search radius & calculate exact distances</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 space-y-4 overflow-y-auto">
          <form onSubmit={handleSearchSubmit} className="space-y-3">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none"/>
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type any area, landmark, or street (e.g. Hitec City, Bandra, Indiranagar)..." className="w-full pl-10 pr-24 py-3 rounded-xl bg-navy-950 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition" autoFocus/>
              <button type="submit" disabled={isSearching || !query.trim()} className="absolute right-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-40 transition">
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Powered by OpenStreetMap & Google Maps Coordinates</span>
              <button type="button" onClick={handleOpenGoogleMapsExternal} className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold">
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3"/>
              </button>
            </div>
          </form>

          {searchFeedback && (<div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
              <Check className="w-4 h-4"/>
              <span>{searchFeedback}</span>
            </div>)}

          {errorMessage && (<div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300">
              {errorMessage}
            </div>)}

          {/* GPS Quick Action */}
          <div className="pt-2">
            <button onClick={() => {
            requestCurrentLocation();
            onClose();
        }} disabled={isLoading} className="w-full py-3 px-4 rounded-xl bg-navy-850 hover:bg-navy-800 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2 transition">
              <Navigation className="w-4 h-4 text-emerald-400"/>
              <span>{isLoading ? 'Detecting device...' : 'Detect My Device Location (GPS)'}</span>
            </button>
          </div>

          {/* Popular Metro Hub Presets */}
          <div className="space-y-2 pt-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Popular City Hubs
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {POPULAR_CITIES.map((city) => {
            const isSelected = userLocation?.cityName === city.name;
            return (<button key={city.name} onClick={() => {
                    selectCityPreset(city);
                    onClose();
                }} className={`p-3 rounded-xl text-left border text-xs transition flex items-start gap-2.5 ${isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white font-semibold'
                    : 'bg-navy-950/70 border-white/10 text-slate-300 hover:bg-navy-800 hover:border-white/20'}`}>
                    <Building2 className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`}/>
                    <div className="min-w-0">
                      <div className="font-semibold text-white truncate">{city.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{city.description || city.state}</div>
                    </div>
                  </button>);
        })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-navy-950/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-indigo-400"/>
            <span className="truncate max-w-[250px]">Current: <strong className="text-white">{userLocation?.cityName || 'Not Set'}</strong></span>
          </div>
          <button onClick={onClose} className="px-4 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-750 text-white text-xs font-semibold transition">
            Done
          </button>
        </div>
      </div>
    </div>);
};
