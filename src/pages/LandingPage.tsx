import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Compass,
  Layers,
  CalendarCheck,
  Star,
  Users,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';
import { CategoryCard } from '../components/CategoryCard';
import { ProviderCard } from '../components/ProviderCard';
import { BookingModal } from '../components/BookingModal';
import { GoogleMapsLocationModal } from '../components/GoogleMapsLocationModal';
import { providerService } from '../services/providerService';
import { Category, Provider } from '../types';
import { useLocation } from '../context/LocationContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { userLocation } = useLocation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProviders, setFeaturedProviders] = useState<Provider[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuickBookProvider, setSelectedQuickBookProvider] = useState<Provider | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [cats, featured] = await Promise.all([
        providerService.getCategories(),
        providerService.getFeaturedProviders(userLocation),
      ]);
      setCategories(cats);
      setFeaturedProviders(featured);
    };
    fetchData();
  }, [userLocation]);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/services');
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-12 pb-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Discover & Book <br />
            <span className="text-indigo-400">
              Verified Local Services
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Find trusted restaurants, hotels, healthcare clinics, 24/7 pharmacies, and professional salons across your neighborhood.
          </p>

          {/* Unified Search Bar with Google Maps Location selector */}
          <form
            onSubmit={handleHeroSearch}
            className="max-w-3xl mx-auto p-2 rounded-2xl bg-navy-900 border border-white/15 shadow-xl flex flex-col sm:flex-row items-center gap-2 group focus-within:border-indigo-500 transition"
          >
            <div className="flex items-center gap-3 w-full px-3 py-2">
              <Search className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-400 transition" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search restaurants, doctors, salons, pharmacies..."
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto px-2">
              {/* Google Maps Location Pill */}
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-navy-950 border border-white/10 hover:border-indigo-500/50 text-xs text-slate-300 transition shrink-0"
              >
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span className="max-w-[130px] truncate font-medium">
                  {userLocation?.cityName || 'Set Location'}
                </span>
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shrink-0 shadow-sm"
              >
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Quick Metrics */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-left">
            <div className="p-3 rounded-xl bg-navy-900/60 border border-white/10">
              <div className="text-lg font-bold text-white">5 Categories</div>
              <div className="text-[11px] text-slate-400">Urban Essentials</div>
            </div>
            <div className="p-3 rounded-xl bg-navy-900/60 border border-white/10">
              <div className="text-lg font-bold text-emerald-400">100% Verified</div>
              <div className="text-[11px] text-slate-400">Vetted Providers</div>
            </div>
            <div className="p-3 rounded-xl bg-navy-900/60 border border-white/10">
              <div className="text-lg font-bold text-indigo-400">Google Maps</div>
              <div className="text-[11px] text-slate-400">Precise Distance</div>
            </div>
            <div className="p-3 rounded-xl bg-navy-900/60 border border-white/10">
              <div className="text-lg font-bold text-amber-400">Real Reviews</div>
              <div className="text-[11px] text-slate-400">Customer Feedback</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FIVE CORE CATEGORIES SECTION */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
              Browse Categories
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white">
              Every Essential Service In One Place
            </h2>
          </div>
          <Link
            to="/services"
            className="text-xs font-semibold text-indigo-300 hover:text-white flex items-center gap-1.5 transition"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.category_id} category={category} />
          ))}
        </div>
      </section>

      {/* 3. FEATURED PROVIDERS */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
              Top Picks Near You
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white">
              Highly Rated Local Establishments
            </h2>
          </div>
          <Link
            to="/services?mode=best-overall"
            className="text-xs font-semibold text-indigo-300 hover:text-white flex items-center gap-1.5 transition"
          >
            <span>See All Top Rated</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredProviders.map((provider) => (
            <ProviderCard
              key={provider.provider_id}
              provider={provider}
              onQuickBook={(p) => setSelectedQuickBookProvider(p)}
            />
          ))}
        </div>
      </section>

      {/* 4. KEY SYSTEM PILLARS */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Why Use NEXORA
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-white">
            Built for Transparency, Convenience & Accuracy
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-navy-900 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Haversine GPS Accuracy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates real physical distance from your location without inaccurate estimated radiuses.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-navy-900 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Side-by-Side Comparison</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compare ratings, prices, distance, and services across up to 4 establishments in one screen.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-navy-900 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Star className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Weighted Rating Quality</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bayesian scores ensure verified feedback outweighs artificial single-review ratings.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-navy-900 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Real-Time Slot Booking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pessimistic database locking prevents overbooking and guarantees confirmed reservations.
            </p>
          </div>
        </div>
      </section>

      {/* 5. FOR SERVICE OFFICERS / ESTABLISHMENTS */}
      <section className="rounded-3xl bg-gradient-to-r from-navy-900 to-navy-850 border border-white/10 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            For Service Providers
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            List Your Business & Manage Daily Appointments
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Register as an Officer to configure services, post live calendar slots, and manage incoming customer reservations.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/register"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
          >
            Register as Officer
          </Link>
          <Link
            to="/officer"
            className="px-5 py-2.5 rounded-xl bg-navy-950 border border-white/10 hover:bg-navy-800 text-slate-300 text-xs font-semibold transition"
          >
            Officer Portal
          </Link>
        </div>
      </section>

      {/* Booking Modal Instance */}
      {selectedQuickBookProvider && (
        <BookingModal
          provider={selectedQuickBookProvider}
          isOpen={!!selectedQuickBookProvider}
          onClose={() => setSelectedQuickBookProvider(null)}
        />
      )}

      {/* Google Maps Location Modal */}
      <GoogleMapsLocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </div>
  );
};
