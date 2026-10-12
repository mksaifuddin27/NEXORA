import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  Clock,
  MapPin,
  Phone,
  AlertCircle,
  XCircle,
  CheckCircle,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/bookingService';
import { Booking, BookingStatus } from '../types';
import { EmptyState } from '../components/EmptyState';
import { formatCurrency, formatTime, formatDate } from '../utils/formatters';

export const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusTab, setStatusTab] = useState<'ALL' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const list = await bookingService.getBookingsByUserId(user.user_id);
        setBookings(list);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const handleCancelBooking = async (bookingId: number) => {
    if (!window.confirm('Are you sure you want to cancel this booking reservation?')) {
      return;
    }

    setCancellingId(bookingId);
    try {
      await bookingService.cancelBooking(bookingId);
      setBookings((prev) =>
        prev.map((b) => (b.booking_id === bookingId ? { ...b, status: 'CANCELLED' } : b))
      );
    } catch (err) {
      alert('Could not cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusTab === 'UPCOMING') return b.status === 'CONFIRMED' || b.status === 'PENDING';
    if (statusTab === 'COMPLETED') return b.status === 'COMPLETED';
    if (statusTab === 'CANCELLED') return b.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white flex items-center gap-2.5">
            <CalendarCheck className="w-8 h-8 text-indigo-400" />
            My Bookings & Reservations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track status, service schedules, and cancellations across all providers.
          </p>
        </div>

        <Link
          to="/services"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-indigo-600 text-white font-bold text-xs shadow-glow-indigo hover:opacity-95 transition flex items-center gap-2 self-start sm:self-auto"
        >
          <span>Discover More Services</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex rounded-2xl bg-navy-900 p-1.5 border border-white/10 w-fit">
        {(['ALL', 'UPCOMING', 'COMPLETED', 'CANCELLED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              statusTab === tab
                ? 'bg-brand-primary text-white shadow-glow-indigo'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab === 'ALL' ? 'All Bookings' : tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Booking List */}
      {isLoading ? (
        <div className="py-16 text-center text-slate-400">
          <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs">Loading your booking history...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <EmptyState
          title="No Bookings in this Category"
          description="You don't have any bookings matching this status filter. Browse our 5 service categories to book a new slot."
          actionLabel="Explore Services"
          onAction={() => (window.location.href = '/services')}
        />
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b.booking_id}
              className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-brand-primary/40"
            >
              {/* Left Details */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-navy-800 text-slate-400 border border-white/5">
                    REF #{b.booking_id}
                  </span>
                  {b.category_name && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                      {b.category_name}
                    </span>
                  )}
                  {/* Status Badge */}
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                      b.status === 'CONFIRMED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : b.status === 'PENDING'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : b.status === 'COMPLETED'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-secondary transition">
                    {b.provider_name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-300 mt-0.5">
                    Service: {b.service_name}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-brand-secondary" />
                    <span>{b.booking_date} at {formatTime(b.booking_time)}</span>
                  </div>

                  {b.provider_address && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate max-w-[200px]">{b.provider_address}</span>
                    </div>
                  )}

                  {b.provider_phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{b.provider_phone}</span>
                    </div>
                  )}
                </div>

                {b.notes && (
                  <p className="text-[11px] text-slate-400 italic">
                    Note: "{b.notes}"
                  </p>
                )}
              </div>

              {/* Right Price & Actions */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-white/5 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Total Amount</span>
                  <span className="text-lg font-extrabold text-white">
                    {formatCurrency(b.total_price)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/providers/${b.provider_id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-navy-800 hover:bg-navy-750 text-xs font-semibold text-slate-200 border border-white/10 transition"
                  >
                    View Provider
                  </Link>

                  {(b.status === 'CONFIRMED' || b.status === 'PENDING') && (
                    <button
                      onClick={() => handleCancelBooking(b.booking_id)}
                      disabled={cancellingId === b.booking_id}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition"
                    >
                      {cancellingId === b.booking_id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
