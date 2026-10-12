import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Clock, Phone, ShieldCheck, Calendar, Layers, ArrowLeft, Sparkles, MessageSquare, Navigation, ExternalLink, } from 'lucide-react';
import { providerService } from '../services/providerService';
import { reviewService } from '../services/reviewService';
import { MapPreview } from '../components/MapPreview';
import { BookingModal } from '../components/BookingModal';
import { ReviewModal } from '../components/ReviewModal';
import { EmptyState } from '../components/EmptyState';
import { useLocation } from '../context/LocationContext';
import { useCompare } from '../context/CompareContext';
import { formatCurrency, formatDistance, formatDate } from '../utils/formatters';
import { getGoogleMapsSearchUrl, getGoogleMapsDirectionsUrl } from '../utils/geo';
export const ProviderDetailsPage = () => {
    const { id } = useParams();
    const providerId = id ? parseInt(id, 10) : null;
    const { userLocation } = useLocation();
    const { isComparing, addToCompare, removeFromCompare } = useCompare();
    const [provider, setProvider] = useState(null);
    const [category, setCategory] = useState(null);
    const [services, setServices] = useState([]);
    const [slots, setSlots] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // Modals
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [selectedServiceIdForBooking, setSelectedServiceIdForBooking] = useState(undefined);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    useEffect(() => {
        if (!providerId)
            return;
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [prov, cats, servList, slotList, revList] = await Promise.all([
                    providerService.getProviderById(providerId, userLocation),
                    providerService.getCategories(),
                    providerService.getServicesByProviderId(providerId),
                    providerService.getSlotsByProviderId(providerId),
                    reviewService.getReviewsByProviderId(providerId),
                ]);
                setProvider(prov);
                if (prov) {
                    const cat = cats.find((c) => c.category_id === prov.category_id) || null;
                    setCategory(cat);
                }
                setServices(servList);
                setSlots(slotList);
                setReviews(revList);
            }
            catch (err) {
                console.error(err);
            }
            finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [providerId, userLocation]);
    if (isLoading) {
        return (<div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
        <p className="text-sm text-slate-400">Loading verified provider profile...</p>
      </div>);
    }
    if (!provider) {
        return (<div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState title="Provider Not Found" description="The establishment you are looking for may have been delisted or does not exist." actionLabel="Return to Discovery" onAction={() => (window.location.href = '/services')}/>
      </div>);
    }
    const comparing = isComparing(provider.provider_id);
    const handleBookService = (serviceId) => {
        setSelectedServiceIdForBooking(serviceId);
        setIsBookingOpen(true);
    };
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back button */}
      <Link to="/services" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition">
        <ArrowLeft className="w-4 h-4"/>
        <span>Back to Services</span>
      </Link>

      {/* 1. HERO BANNER & HEADER */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-navy-900 shadow-2xl">
        {/* Banner Image */}
        <div className="relative h-64 sm:h-96 w-full">
          <img src={provider.image_url} alt={provider.provider_name} className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent"/>

          {/* Top badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {category && (<span className="px-3 py-1 rounded-full text-xs font-bold bg-navy-950/80 backdrop-blur-md text-brand-secondary border border-white/10">
                  {category.category_name}
                </span>)}
              {provider.verification_status === 'VERIFIED' && (<span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                  <ShieldCheck className="w-4 h-4"/>
                  Verified Provider
                </span>)}
            </div>

            <button onClick={() => {
            if (comparing)
                removeFromCompare(provider.provider_id);
            else
                addToCompare(provider);
        }} className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border transition flex items-center gap-1.5 ${comparing
            ? 'bg-brand-primary text-white border-brand-primary shadow-glow-indigo'
            : 'bg-navy-900/80 text-slate-200 border-white/20 hover:bg-navy-800'}`}>
              <Layers className="w-3.5 h-3.5"/>
              <span>{comparing ? 'In Comparison' : 'Add to Compare'}</span>
            </button>
          </div>

          {/* Bottom Title & Stats */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
                {provider.provider_name.replace(/\[Demo.*?\]/gi, '').trim()}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-navy-900/80 border border-white/10">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400"/>
                  <span className="font-bold text-white">{provider.rating_avg.toFixed(1)}</span>
                  <span className="text-slate-400">({provider.review_count} reviews)</span>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-navy-900/80 border border-white/10">
                  <Navigation className="w-4 h-4 text-brand-secondary"/>
                  <span>{formatDistance(provider.distance_km)}</span>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-navy-900/80 border border-white/10 font-bold text-emerald-400">
                  <span>Price: {provider.price_range}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button onClick={() => setShowContactModal(true)} className="px-4 py-2.5 rounded-xl bg-navy-850 hover:bg-navy-800 text-slate-200 border border-white/15 text-xs font-bold transition flex items-center gap-2">
                <Phone className="w-3.5 h-3.5"/>
                <span>Contact Provider</span>
              </button>
              <button onClick={() => handleBookService()} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-indigo-600 text-white font-bold text-xs shadow-glow-indigo hover:opacity-95 transition flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5"/>
                <span>Book Appointment</span>
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Strip if available */}
        {provider.gallery && provider.gallery.length > 0 && (<div className="p-4 bg-navy-950/80 border-t border-white/10 flex items-center gap-3 overflow-x-auto">
            {provider.gallery.map((imgUrl, idx) => (<img key={idx} src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-24 h-16 rounded-lg object-cover border border-white/10 hover:opacity-90 transition"/>))}
          </div>)}
      </div>

      {/* 2. MAIN DETAILS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Description, Services Offered, Reviews */}
        <div className="lg:col-span-2 space-y-8">
          {/* About */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
            <h2 className="text-lg font-bold text-white">About the Establishment</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {provider.description}
            </p>
          </div>

          {/* Services & Pricing Menu */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Services & Pricing</h2>
                <p className="text-xs text-slate-400">Select an offering to reserve your appointment</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-primary/20 text-indigo-300">
                {services.length} Listed
              </span>
            </div>

            <div className="divide-y divide-white/5">
              {services.map((s) => (<div key={s.service_id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-white group-hover:text-brand-secondary transition">
                      {s.service_name}
                    </div>
                    <div className="text-xs text-slate-400 max-w-md">{s.description}</div>
                    {s.duration_mins && (<div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3"/>
                        <span>Approx. {s.duration_mins} mins</span>
                      </div>)}
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    <span className="text-sm font-extrabold text-emerald-400">
                      {formatCurrency(s.price)}
                    </span>
                    <button onClick={() => handleBookService(s.service_id)} className="px-4 py-2 rounded-xl bg-navy-800 hover:bg-brand-primary text-white text-xs font-semibold border border-white/10 transition">
                      Book Slot
                    </button>
                  </div>
                </div>))}
            </div>
          </div>

          {/* Customer Reviews & Feedback */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-400"/>
                  Verified Reviews ({reviews.length})
                </h2>
                <p className="text-xs text-slate-400">Real feedback from patrons who booked via NEXORA</p>
              </div>

              <button onClick={() => setIsReviewModalOpen(true)} className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold hover:bg-amber-500/30 transition flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5"/>
                Write Review
              </button>
            </div>

            {reviews.length === 0 ? (<p className="text-xs text-slate-400 py-4">No reviews yet. Be the first to share your experience!</p>) : (<div className="space-y-4">
                {reviews.map((r) => (<div key={r.rating_id} className="p-4 rounded-xl bg-navy-850/80 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-brand-primary/30 flex items-center justify-center font-bold text-[10px] text-white">
                          {r.user_name.charAt(0)}
                        </div>
                        <span className="font-semibold text-white">{r.user_name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: r.rating }).map((_, i) => (<Star key={i} className="w-3 h-3 fill-amber-400"/>))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{r.review}</p>
                    <div className="text-[10px] text-slate-500">{formatDate(r.created_at)}</div>
                  </div>))}
              </div>)}
          </div>
        </div>

        {/* Right Col: Operating Hours, Location Map, Booking Card */}
        <div className="space-y-6">
          {/* Quick Book Box */}
          <div className="glass-card rounded-2xl p-6 border border-brand-primary/40 shadow-glow-indigo/40 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-secondary"/>
              Check Availability & Book
            </h3>
            <p className="text-xs text-slate-400">
              Pick an upcoming slot to reserve your spot instantly.
            </p>
            <button onClick={() => handleBookService()} className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-primary to-indigo-600 text-white font-bold text-xs shadow-glow-indigo hover:opacity-95 transition">
              Open Booking Calendar
            </button>
          </div>

          {/* Operating Hours Card */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400"/>
              Operating Hours
            </h3>
            <div className="text-sm font-semibold text-white">{provider.opening_hours}</div>
            <div className="text-xs text-slate-400 flex items-center gap-2 pt-1 border-t border-white/5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"/>
              <span>Status: Verified & Open</span>
            </div>
          </div>

          {/* Location & Map Section */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-secondary"/>
              Location & Directions
            </h3>
            <p className="text-xs text-slate-300">{provider.address}, {provider.city}</p>
            <div className="text-xs font-semibold text-indigo-300">
              {formatDistance(provider.distance_km)}
            </div>

            {/* Google Maps Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a href={getGoogleMapsDirectionsUrl(provider.latitude, provider.longitude)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-sm">
                <Navigation className="w-3.5 h-3.5"/>
                <span>Directions</span>
              </a>
              <a href={getGoogleMapsSearchUrl(`${provider.provider_name}, ${provider.address}, ${provider.city}`)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-navy-800 hover:bg-navy-750 text-slate-200 border border-white/10 text-xs font-semibold transition">
                <ExternalLink className="w-3.5 h-3.5 text-red-400"/>
                <span>Google Maps</span>
              </a>
            </div>

            {/* Embedded Map for this single provider */}
            <div className="pt-2">
              <MapPreview providers={[provider]} userLocation={userLocation} heightClass="h-48"/>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal provider={provider} categoryName={category?.category_name} initialServiceId={selectedServiceIdForBooking} isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)}/>

      {/* Review Modal */}
      <ReviewModal provider={provider} isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} onReviewSubmitted={async () => {
            const revs = await reviewService.getReviewsByProviderId(provider.provider_id);
            setReviews(revs);
            const p = await providerService.getProviderById(provider.provider_id, userLocation);
            if (p)
                setProvider(p);
        }}/>

      {/* Contact Provider Modal */}
      {showContactModal && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-navy-900 border border-white/15 rounded-3xl p-6 max-w-sm w-full space-y-4">
            <h3 className="text-lg font-bold text-white">Contact {provider.provider_name}</h3>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-navy-850">
                <Phone className="w-4 h-4 text-brand-secondary"/>
                <a href={`tel:${provider.phone}`} className="font-semibold text-white hover:underline">
                  {provider.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-navy-850">
                <MapPin className="w-4 h-4 text-brand-secondary shrink-0"/>
                <span>{provider.address}</span>
              </div>
            </div>
            <button onClick={() => setShowContactModal(false)} className="w-full py-2.5 rounded-xl bg-navy-800 text-slate-200 text-xs font-semibold">
              Close
            </button>
          </div>
        </div>)}
    </div>);
};
