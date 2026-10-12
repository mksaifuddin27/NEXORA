import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, MapPin, Search, CalendarCheck, Sparkles, ArrowRight, Layers, Star, AlertTriangle, RefreshCw, } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { providerService } from '../services/providerService';
import { bookingService } from '../services/bookingService';
import { CategoryCard } from '../components/CategoryCard';
import { ProviderCard } from '../components/ProviderCard';
import { BookingModal } from '../components/BookingModal';
import { POPULAR_CITIES } from '../utils/geo';
export const UserDashboard = () => {
    const { user } = useAuth();
    const { userLocation, permissionStatus, isLoading: isLocLoading, errorMessage: locError, requestCurrentLocation, selectCityPreset, } = useLocation();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [featuredProviders, setFeaturedProviders] = useState([]);
    const [recentBookings, setRecentBookings] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedQuickBook, setSelectedQuickBook] = useState(null);
    useEffect(() => {
        const loadDashboardData = async () => {
            const [cats, featured] = await Promise.all([
                providerService.getCategories(),
                providerService.getFeaturedProviders(userLocation),
            ]);
            setCategories(cats);
            setFeaturedProviders(featured);
            if (user?.user_id) {
                const bookings = await bookingService.getBookingsByUserId(user.user_id);
                setRecentBookings(bookings.slice(0, 3));
            }
        };
        loadDashboardData();
    }, [userLocation, user?.user_id]);
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/services?q=${encodeURIComponent(searchQuery.trim())}`);
        }
        else {
            navigate('/services');
        }
    };
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* 1. PERSONALIZED WELCOME & LOCATION HEADER */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-navy-900 via-navy-850 to-indigo-950/60 border border-white/10 shadow-2xl overflow-hidden">
        {/* Glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none"/>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-primary/20 text-brand-secondary border border-brand-primary/30">
                Citizen Portal
              </span>
              <span className="text-xs text-slate-400">Welcome to NEXORA Discovery</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
              Hello, {user?.full_name.split(' ')[0] || 'Friend'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Ready to explore top-rated healthcare, dining, accommodations, pharmacies, and salons near your current location.
            </p>
          </div>

          {/* Location Control Card */}
          <div className="p-4 rounded-2xl bg-navy-950/80 border border-white/15 backdrop-blur-md space-y-3 min-w-[280px]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-400">ACTIVE LOCATION</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${userLocation?.source === 'gps'
            ? 'bg-emerald-500/20 text-emerald-300'
            : 'bg-indigo-500/20 text-indigo-300'}`}>
                {userLocation?.source === 'gps' ? 'GPS Active' : 'City Selected'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <MapPin className={`w-4 h-4 ${userLocation?.source === 'gps' ? 'text-emerald-400' : 'text-brand-secondary'}`}/>
              <span className="truncate">{userLocation?.cityName || 'Location Not Set'}</span>
            </div>

            {locError && (<div className="text-[11px] text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3 shrink-0"/>
                <span>{locError}</span>
              </div>)}

            <div className="pt-1 flex gap-2">
              <button onClick={requestCurrentLocation} disabled={isLocLoading} className="flex-1 py-1.5 px-2.5 rounded-lg bg-brand-primary/20 hover:bg-brand-primary/30 text-brand-secondary border border-brand-primary/30 text-[11px] font-semibold transition flex items-center justify-center gap-1">
                <RefreshCw className={`w-3 h-3 ${isLocLoading ? 'animate-spin' : ''}`}/>
                <span>{isLocLoading ? 'Locating...' : 'Use GPS'}</span>
              </button>

              <select onChange={(e) => {
            const city = POPULAR_CITIES.find((c) => c.name === e.target.value);
            if (city)
                selectCityPreset(city);
        }} value={userLocation?.cityName || ''} className="py-1.5 px-2 rounded-lg bg-navy-850 border border-white/10 text-slate-200 text-[11px] focus:outline-none">
                <option value="" disabled>Change City</option>
                {POPULAR_CITIES.map((c) => (<option key={c.name} value={c.name}>{c.name}</option>))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SEARCH BAR & QUICK ACCESS SHORTCUTS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSearch} className="p-2 rounded-2xl bg-navy-900 border border-white/15 shadow-xl flex items-center gap-2 group focus-within:border-brand-primary transition">
            <div className="flex items-center gap-3 w-full px-3 py-1.5">
              <Search className="w-5 h-5 text-slate-400 group-focus-within:text-brand-secondary transition"/>
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search across 5 categories, provider names, services, or locations..." className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"/>
            </div>
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-indigo-600 text-white font-bold text-xs shadow-glow-indigo hover:opacity-95 transition shrink-0">
              Search
            </button>
          </form>
        </div>

        {/* Quick Links to Bookings */}
        <div className="flex gap-2">
          <Link to="/my-bookings" className="flex-1 p-3 rounded-2xl bg-navy-900 border border-white/10 hover:border-brand-primary/40 flex items-center justify-between text-xs font-semibold text-white transition group">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-brand-primary"/>
              <span>My Bookings</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-navy-800 text-[10px] text-slate-300">
              {recentBookings.length}
            </span>
          </Link>
        </div>
      </div>

      {/* 3. THREE DISCOVERY OPTIONS: ALL, NEARBY, BEST (WITH BEST NEARBY & BEST OVERALL) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-brand-secondary"/>
            Discovery Hub
          </h2>
          <span className="text-xs text-slate-400">Choose discovery mode</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Option 1: All Services */}
          <Link to="/services?mode=all" className="glass-card rounded-2xl p-5 border border-white/10 hover:border-brand-primary/50 group block space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Layers className="w-5 h-5"/>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-brand-secondary transition">
              All Services
            </h3>
            <p className="text-xs text-slate-400">
              Browse the complete catalog of verified providers across all categories.
            </p>
          </Link>

          {/* Option 2: Nearby Services */}
          <Link to="/services?mode=nearby" className="glass-card rounded-2xl p-5 border border-white/10 hover:border-brand-primary/50 group block space-y-2">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Compass className="w-5 h-5"/>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-brand-secondary transition">
              Nearby Services
            </h3>
            <p className="text-xs text-slate-400">
              Sorted strictly by actual physical distance from your active location coordinates.
            </p>
          </Link>

          {/* Option 3: Best Services with Sub-choices */}
          <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Star className="w-5 h-5"/>
              </div>
              <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                4.5★+ Rated
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Best Services</h3>
              <p className="text-xs text-slate-400">
                Top rated establishments curated by verified citizen reviews.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link to="/services?mode=best-nearby" className="py-1.5 px-2 rounded-lg bg-navy-800 hover:bg-navy-750 text-[11px] font-semibold text-center text-slate-200 border border-white/10 transition">
                Best Nearby
              </Link>
              <Link to="/services?mode=best-overall" className="py-1.5 px-2 rounded-lg bg-gradient-to-r from-brand-primary to-indigo-600 text-[11px] font-semibold text-center text-white shadow-sm transition">
                Best Overall
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 4. FIVE CATEGORY CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Explore Categories</h2>
            <p className="text-xs text-slate-400">Select an industry to browse specialized services</p>
          </div>
          <Link to="/services" className="text-xs font-semibold text-indigo-300 hover:text-white flex items-center gap-1 transition">
            All <ArrowRight className="w-3.5 h-3.5"/>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((c) => (<CategoryCard key={c.category_id} category={c}/>))}
        </div>
      </div>

      {/* 5. FEATURED & RECOMMENDED PROVIDERS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400"/>
              Recommended Near You
            </h2>
            <p className="text-xs text-slate-400">Highly rated verified providers in your metropolitan region</p>
          </div>
          <Link to="/services?mode=best-overall" className="text-xs font-semibold text-indigo-300 hover:text-white flex items-center gap-1 transition">
            View More <ArrowRight className="w-3.5 h-3.5"/>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProviders.map((p) => (<ProviderCard key={p.provider_id} provider={p} onQuickBook={(prov) => setSelectedQuickBook(prov)}/>))}
        </div>
      </div>

      {/* 6. RECENT BOOKINGS PREVIEW */}
      {recentBookings.length > 0 && (<div className="p-6 rounded-2xl bg-navy-900 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-indigo-400"/>
              Your Recent Bookings
            </h3>
            <Link to="/my-bookings" className="text-xs text-brand-secondary hover:underline">
              View All Bookings
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentBookings.map((b) => (<div key={b.booking_id} className="p-4 rounded-xl bg-navy-850 border border-white/5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white line-clamp-1">{b.provider_name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${b.status === 'CONFIRMED'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : b.status === 'PENDING'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-rose-500/20 text-rose-300'}`}>
                    {b.status}
                  </span>
                </div>
                <div className="text-slate-300">{b.service_name}</div>
                <div className="text-slate-400 text-[11px]">
                  {b.booking_date} at {b.booking_time}
                </div>
              </div>))}
          </div>
        </div>)}

      {/* Booking Modal */}
      {selectedQuickBook && (<BookingModal provider={selectedQuickBook} isOpen={!!selectedQuickBook} onClose={() => setSelectedQuickBook(null)}/>)}
    </div>);
};
