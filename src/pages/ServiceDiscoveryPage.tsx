import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Star,
  DollarSign,
  Compass,
  Sparkles,
  Layers,
  Map as MapIcon,
  Grid,
  Filter,
  X,
  AlertCircle,
} from 'lucide-react';
import { providerService } from '../services/providerService';
import { Category, Provider, DiscoveryViewMode, DiscoveryFilters } from '../types';
import { ProviderCard } from '../components/ProviderCard';
import { MapPreview } from '../components/MapPreview';
import { BookingModal } from '../components/BookingModal';
import { GoogleMapsLocationModal } from '../components/GoogleMapsLocationModal';
import { EmptyState } from '../components/EmptyState';
import { ProviderCardSkeleton } from '../components/LoadingSkeleton';
import { useLocation } from '../context/LocationContext';

export const ServiceDiscoveryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { userLocation } = useLocation();

  // URL Query Parameters
  const initialCat = searchParams.get('category') ? parseInt(searchParams.get('category')!, 10) : null;
  const initialMode = (searchParams.get('mode') as DiscoveryViewMode) || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [categories, setCategories] = useState<Category[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(initialCat);
  const [viewMode, setViewMode] = useState<DiscoveryViewMode>(initialMode);
  const [priceRange, setPriceRange] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(0); // 0 = any
  const [sortBy, setSortBy] = useState<DiscoveryFilters['sortBy']>('relevance');

  // UI States
  const [showMap, setShowMap] = useState(false);
  const [selectedQuickBookProvider, setSelectedQuickBookProvider] = useState<Provider | null>(null);
  const [filtersDrawerOpen, setFiltersDrawerOpen] = useState(false);
  const [isLocModalOpen, setIsLocModalOpen] = useState(false);

  // Sync category or mode when URL params change
  useEffect(() => {
    if (searchParams.get('category')) {
      setSelectedCategoryId(parseInt(searchParams.get('category')!, 10));
    }
    if (searchParams.get('mode')) {
      setViewMode(searchParams.get('mode') as DiscoveryViewMode);
    }
  }, [searchParams]);

  // Load Categories on mount
  useEffect(() => {
    const fetchCats = async () => {
      const cats = await providerService.getCategories();
      setCategories(cats);
    };
    fetchCats();
  }, []);

  // Fetch Providers whenever filters or user location change
  useEffect(() => {
    const fetchProviders = async () => {
      setIsLoading(true);
      try {
        const filters: DiscoveryFilters = {
          categoryId: selectedCategoryId,
          searchQuery: searchQuery,
          viewMode: viewMode,
          priceRange: priceRange === 'all' ? null : priceRange,
          minRating: minRating > 0 ? minRating : null,
          maxDistanceKm: maxDistanceKm > 0 ? maxDistanceKm : null,
          sortBy: sortBy,
        };
        const list = await providerService.getProviders(filters, userLocation);
        setProviders(list);
      } catch (err) {
        console.error('Error fetching providers:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, [
    selectedCategoryId,
    searchQuery,
    viewMode,
    priceRange,
    minRating,
    maxDistanceKm,
    sortBy,
    userLocation,
  ]);

  const handleModeChange = (mode: DiscoveryViewMode) => {
    setViewMode(mode);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('mode', mode);
    setSearchParams(newParams);
  };

  const handleCategorySelect = (catId: number | null) => {
    setSelectedCategoryId(catId);
    const newParams = new URLSearchParams(searchParams);
    if (catId) {
      newParams.set('category', catId.toString());
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategoryId(null);
    setViewMode('all');
    setPriceRange('all');
    setMinRating(0);
    setMaxDistanceKm(0);
    setSortBy('relevance');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. TOP HEADER & SEARCH */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
              Service Discovery
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Explore, compare, and book verified local service providers in your neighborhood.
            </p>
          </div>

          {/* Google Maps Location & Toggle Map / Grid */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLocModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-navy-900 border border-white/10 hover:border-indigo-500/50 text-slate-200 flex items-center gap-2 transition"
              title="Search and set location on Google Maps"
            >
              <MapPin className="w-4 h-4 text-red-400" />
              <span className="max-w-[150px] truncate">{userLocation?.cityName || 'Set Location'}</span>
            </button>

            <button
              onClick={() => setShowMap(!showMap)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition ${
                showMap
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                  : 'bg-navy-850 text-slate-300 border-white/10 hover:bg-navy-800'
              }`}
            >
              {showMap ? <Grid className="w-4 h-4" /> : <MapIcon className="w-4 h-4" />}
              <span>{showMap ? 'Show Cards' : 'Split Map View'}</span>
            </button>
          </div>
        </div>

        {/* Search Bar & View Mode Tabs */}
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by provider name, specialty, service, or locality..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-navy-900 border border-white/15 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-brand-primary shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Four Distinct Discovery Views */}
          <div className="flex rounded-2xl bg-navy-900 p-1.5 border border-white/10 overflow-x-auto shrink-0">
            <button
              onClick={() => handleModeChange('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                viewMode === 'all'
                  ? 'bg-brand-primary text-white shadow-glow-indigo'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Services</span>
            </button>

            <button
              onClick={() => handleModeChange('nearby')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                viewMode === 'nearby'
                  ? 'bg-brand-primary text-white shadow-glow-indigo'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-brand-secondary" />
              <span>Nearby</span>
            </button>

            <button
              onClick={() => handleModeChange('best-nearby')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                viewMode === 'best-nearby'
                  ? 'bg-brand-primary text-white shadow-glow-indigo'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span>Best Nearby</span>
            </button>

            <button
              onClick={() => handleModeChange('best-overall')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                viewMode === 'best-overall'
                  ? 'bg-brand-primary text-white shadow-glow-indigo'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Best Overall</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. CATEGORY PILL FILTER */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => handleCategorySelect(null)}
          className={`px-4 py-2 rounded-xl text-xs font-bold border transition whitespace-nowrap ${
            selectedCategoryId === null
              ? 'bg-white text-navy-950 border-white shadow-sm'
              : 'bg-navy-900 text-slate-300 border-white/10 hover:bg-navy-850'
          }`}
        >
          All Categories
        </button>
        {categories.map((c) => (
          <button
            key={c.category_id}
            onClick={() => handleCategorySelect(c.category_id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition whitespace-nowrap ${
              selectedCategoryId === c.category_id
                ? 'bg-brand-primary text-white border-brand-primary shadow-glow-indigo'
                : 'bg-navy-900 text-slate-300 border-white/10 hover:bg-navy-850'
            }`}
          >
            {c.category_name}
          </button>
        ))}
      </div>

      {/* 3. SUB-FILTER BAR (Distance, Rating, Price, Sort) */}
      <div className="p-4 rounded-2xl bg-navy-900/80 border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Price Range Filter */}
          <div className="flex items-center gap-1.5 bg-navy-850 px-2.5 py-1.5 rounded-xl border border-white/10">
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none text-xs"
            >
              <option value="all">Any Price</option>
              <option value="$">$ (Budget)</option>
              <option value="$$">$$ (Moderate)</option>
              <option value="$$$">$$$ (Upscale)</option>
              <option value="$$$$">$$$$ (Luxury)</option>
            </select>
          </div>

          {/* Min Rating Filter */}
          <div className="flex items-center gap-1.5 bg-navy-850 px-2.5 py-1.5 rounded-xl border border-white/10">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <select
              value={minRating}
              onChange={(e) => setMinRating(parseFloat(e.target.value))}
              className="bg-transparent text-slate-200 focus:outline-none text-xs"
            >
              <option value="0">Any Rating</option>
              <option value="4.0">4.0★ & Above</option>
              <option value="4.5">4.5★ & Above (Top Tier)</option>
              <option value="4.8">4.8★ & Above (Elite)</option>
            </select>
          </div>

          {/* Max Distance Filter (applicable when distance known) */}
          <div className="flex items-center gap-1.5 bg-navy-850 px-2.5 py-1.5 rounded-xl border border-white/10">
            <Compass className="w-3.5 h-3.5 text-brand-secondary" />
            <select
              value={maxDistanceKm}
              onChange={(e) => setMaxDistanceKm(parseFloat(e.target.value))}
              className="bg-transparent text-slate-200 focus:outline-none text-xs"
            >
              <option value="0">Any Distance</option>
              <option value="3">Within 3 km</option>
              <option value="7">Within 7 km</option>
              <option value="15">Within 15 km</option>
            </select>
          </div>
        </div>

        {/* Sort By Dropdown */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-navy-850 border border-white/10 px-2.5 py-1.5 rounded-xl text-slate-200 text-xs focus:outline-none"
            >
              <option value="relevance">Relevance</option>
              <option value="distance">Distance (Nearest First)</option>
              <option value="rating">Rating (Highest First)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </select>
          </div>

          {(selectedCategoryId || searchQuery || priceRange !== 'all' || minRating > 0 || maxDistanceKm > 0) && (
            <button
              onClick={resetAllFilters}
              className="text-xs text-brand-secondary hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* 4. RESULTS SECTION (GRID OR SPLIT MAP) */}
      {showMap && (
        <div className="mb-8">
          <MapPreview
            providers={providers}
            userLocation={userLocation}
            onSelectProvider={(id) => {
              const el = document.getElementById(`provider-card-${id}`);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>
      )}

      {/* Notice if Nearby mode is selected but user location is not set */}
      {viewMode === 'nearby' && !userLocation && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <strong>Location Required for Nearby Discovery:</strong> Please click "Set Location" or "Use GPS" in the top bar to enable real distance calculations.
          </div>
        </div>
      )}

      {/* Providers Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ProviderCardSkeleton key={i} />
          ))}
        </div>
      ) : providers.length === 0 ? (
        <EmptyState
          title="No Matching Service Providers"
          description="We couldn't find any establishments matching your current criteria. Try widening your distance radius, lowering rating constraints, or clearing filters."
          actionLabel="Reset All Filters"
          onAction={resetAllFilters}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Showing <strong className="text-white">{providers.length}</strong> verified providers</span>
            <span>Compare up to 4 providers using the "Compare" button</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((p) => {
              const cat = categories.find((c) => c.category_id === p.category_id);
              return (
                <div id={`provider-card-${p.provider_id}`} key={p.provider_id}>
                  <ProviderCard
                    provider={p}
                    categoryName={cat?.category_name}
                    onQuickBook={(prov) => setSelectedQuickBookProvider(prov)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {selectedQuickBookProvider && (
        <BookingModal
          provider={selectedQuickBookProvider}
          isOpen={!!selectedQuickBookProvider}
          onClose={() => setSelectedQuickBookProvider(null)}
        />
      )}

      {/* Google Maps Location Search Modal */}
      <GoogleMapsLocationModal
        isOpen={isLocModalOpen}
        onClose={() => setIsLocModalOpen(false)}
      />
    </div>
  );
};
