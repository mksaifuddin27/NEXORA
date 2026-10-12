import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
} from 'lucide-react';
import { Provider, ServiceItem, AvailabilitySlot } from '../types';
import { providerService } from '../services/providerService';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatTime } from '../utils/formatters';

interface BookingModalProps {
  provider: Provider;
  categoryName?: string;
  initialServiceId?: number;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess?: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  provider,
  categoryName,
  initialServiceId,
  isOpen,
  onClose,
  onBookingSuccess,
}) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(initialServiceId || null);
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-13');
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setConfirmedBookingId(null);
      setError(null);
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [servList, slotList] = await Promise.all([
          providerService.getServicesByProviderId(provider.provider_id),
          providerService.getSlotsByProviderId(provider.provider_id),
        ]);
        setServices(servList);
        setSlots(slotList);
        if (servList.length > 0 && !selectedServiceId) {
          setSelectedServiceId(servList[0].service_id);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch provider availability.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isOpen, provider.provider_id]);

  if (!isOpen) return null;

  const selectedService = services.find((s) => s.service_id === selectedServiceId);
  const availableSlotsForDate = slots.filter(
    (s) => s.available_date === selectedDate && s.status === 'AVAILABLE'
  );
  const selectedSlot = slots.find((s) => s.availability_id === selectedSlotId);

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      setError('Please sign in to confirm your booking.');
      return;
    }

    if (!selectedService) {
      setError('Please select a service.');
      return;
    }

    if (!selectedSlot) {
      setError('Please select an available time slot.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const newBooking = await bookingService.createBooking({
        user_id: user.user_id,
        provider_id: provider.provider_id,
        service_id: selectedService.service_id,
        booking_date: selectedDate,
        booking_time: selectedSlot.start_time,
        notes: notes.trim(),
        total_price: selectedService.price,
        provider_name: provider.provider_name,
        service_name: selectedService.service_name,
        user_name: user.full_name,
        category_id: provider.category_id,
        category_name: categoryName || 'Service',
        provider_address: provider.address,
        provider_phone: provider.phone,
        slot_id: selectedSlot.availability_id,
      });

      setConfirmedBookingId(newBooking.booking_id);
      if (onBookingSuccess) onBookingSuccess();
    } catch (err: any) {
      setError(err?.message || 'Could not complete booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-navy-900 border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-navy-950">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-secondary">
              Reserve Appointment / Slot
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">{provider.provider_name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedBookingId ? (
          /* Confirmation Screen */
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white">Booking Confirmed!</h3>
              <p className="text-sm text-slate-300 mt-1">
                Your reservation ID is <span className="font-mono font-bold text-brand-secondary">#{confirmedBookingId}</span>
              </p>
            </div>

            {/* Summary card */}
            <div className="p-4 rounded-2xl bg-navy-850 border border-white/10 text-left text-xs space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Provider:</span>
                <span className="font-semibold text-white">{provider.provider_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Service:</span>
                <span className="font-semibold text-white">{selectedService?.service_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date & Time:</span>
                <span className="font-semibold text-white">{selectedDate} at {selectedSlot && formatTime(selectedSlot.start_time)}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2 text-sm">
                <span className="font-bold text-slate-200">Total Price:</span>
                <span className="font-bold text-emerald-400">{selectedService && formatCurrency(selectedService.price)}</span>
              </div>
            </div>

            {/* Notice about mock data per prompt specification */}
            <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs flex items-start gap-2.5 text-left">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-brand-secondary" />
              <p>
                <strong>Phase 1 Demonstration:</strong> This booking has been simulated and saved to your local session state. In Phase 2, this will persist to the MySQL database via Spring Boot REST APIs.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl bg-navy-800 hover:bg-navy-750 text-slate-200 text-xs font-semibold transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  navigate('/my-bookings');
                }}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-primary to-indigo-600 text-white text-xs font-semibold shadow-glow-indigo transition"
              >
                View My Bookings
              </button>
            </div>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleConfirmBooking} className="p-5 sm:p-6 space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* 1. Service Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Select Service
              </label>
              {isLoading ? (
                <div className="h-20 bg-navy-850 rounded-xl animate-pulse" />
              ) : services.length === 0 ? (
                <p className="text-xs text-slate-400">No specific services listed for this provider.</p>
              ) : (
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {services.map((s) => (
                    <label
                      key={s.service_id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                        selectedServiceId === s.service_id
                          ? 'border-brand-primary bg-indigo-500/15 shadow-sm'
                          : 'border-white/10 bg-navy-850 hover:bg-navy-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="service"
                          checked={selectedServiceId === s.service_id}
                          onChange={() => setSelectedServiceId(s.service_id)}
                          className="accent-brand-primary"
                        />
                        <div>
                          <div className="text-xs font-bold text-white">{s.service_name}</div>
                          <div className="text-[11px] text-slate-400">{s.description}</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 shrink-0">
                        {formatCurrency(s.price)}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Date Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Select Date
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['2026-10-13', '2026-10-14', '2026-10-15'].map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => {
                      setSelectedDate(d);
                      setSelectedSlotId(null);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition ${
                      selectedDate === d
                        ? 'border-brand-primary bg-brand-primary/20 text-white font-bold'
                        : 'border-white/10 bg-navy-850 text-slate-300 hover:bg-navy-800'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 text-brand-secondary" />
                    <span>{d}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Time Slot Grid */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Available Time Slots
              </label>
              {availableSlotsForDate.length === 0 ? (
                <div className="p-3 rounded-xl bg-navy-850 border border-white/10 text-center text-xs text-slate-400">
                  <p>No remaining slots on this date. Please pick another date.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableSlotsForDate.map((slot) => (
                    <button
                      type="button"
                      key={slot.availability_id}
                      onClick={() => setSelectedSlotId(slot.availability_id)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition ${
                        selectedSlotId === slot.availability_id
                          ? 'border-brand-primary bg-gradient-to-r from-brand-primary to-indigo-600 text-white font-bold shadow-glow-indigo'
                          : 'border-white/10 bg-navy-850 text-slate-200 hover:border-white/30'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatTime(slot.start_time)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Special Requests / Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Special Requests / Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g., Window seating, wheelchair assistance, allergic to certain chemicals..."
                rows={2}
                className="w-full rounded-xl bg-navy-850 border border-white/10 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary"
              />
            </div>

            {/* Submit button */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">Total Due:</span>
                <span className="text-base font-extrabold text-white">
                  {selectedService ? formatCurrency(selectedService.price) : '—'}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !selectedSlotId || !selectedServiceId}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-indigo-600 text-white text-xs font-bold shadow-glow-indigo hover:opacity-95 disabled:opacity-50 transition flex items-center gap-2"
              >
                {isSubmitting ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Confirm Booking</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
