import { apiRequest, DATA_MODE } from './apiClient';
import { MockStore } from './mockStorage';
import { Booking, BookingStatus } from '../types';

interface BackendBooking {
  bookingId: number;
  userId: number;
  userName: string;
  providerId: number;
  providerName: string;
  categoryId?: number;
  categoryName?: string;
  providerAddress?: string;
  providerPhone?: string;
  serviceId: number;
  serviceName: string;
  bookingDate: string;
  bookingTime: string;
  status: BookingStatus;
  totalPrice: number;
  notes?: string;
  createdAt: string;
}

function normalizeBooking(b: BackendBooking): Booking {
  return {
    booking_id: b.bookingId,
    user_id: b.userId,
    provider_id: b.providerId,
    service_id: b.serviceId,
    booking_date: b.bookingDate,
    booking_time: b.bookingTime,
    status: b.status,
    created_at: b.createdAt,
    notes: b.notes,
    total_price: b.totalPrice,
    provider_name: b.providerName,
    service_name: b.serviceName,
    user_name: b.userName,
    category_id: b.categoryId,
    category_name: b.categoryName,
    provider_address: b.providerAddress,
    provider_phone: b.providerPhone,
  };
}

export const bookingService = {
  async getBookingsByUserId(userId: number): Promise<Booking[]> {
    if (DATA_MODE === 'live') {
      try {
        const list = await apiRequest<BackendBooking[]>('/bookings/my');
        return list.map(normalizeBooking);
      } catch (err) {
        console.warn('Backend user bookings fetch failed:', err);
      }
    }
    return MockStore.getBookingsByUser(userId);
  },

  async getAllBookings(): Promise<Booking[]> {
    if (DATA_MODE === 'live') {
      try {
        const list = await apiRequest<BackendBooking[]>('/admin/bookings');
        return list.map(normalizeBooking);
      } catch (err) {
        console.warn('Backend all bookings fetch failed:', err);
      }
    }
    return MockStore.getBookings();
  },

  async getBookingsByProviderId(providerId: number): Promise<Booking[]> {
    if (DATA_MODE === 'live') {
      try {
        const list = await apiRequest<BackendBooking[]>(`/officer/provider/${providerId}/bookings`);
        return list.map(normalizeBooking);
      } catch (err) {
        console.warn('Backend provider bookings fetch failed:', err);
      }
    }
    return MockStore.getBookingsByProvider(providerId);
  },

  async createBooking(bookingData: {
    user_id: number;
    provider_id: number;
    service_id: number;
    booking_date: string;
    booking_time: string;
    notes?: string;
    total_price: number;
    provider_name: string;
    service_name: string;
    user_name: string;
    category_id: number;
    category_name: string;
    provider_address: string;
    provider_phone: string;
    slot_id?: number;
  }): Promise<Booking> {
    if (DATA_MODE === 'live') {
      const saved = await apiRequest<BackendBooking>('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          providerId: bookingData.provider_id,
          serviceId: bookingData.service_id,
          bookingDate: bookingData.booking_date,
          startTime: bookingData.booking_time,
          slotId: bookingData.slot_id,
          notes: bookingData.notes,
        }),
      });
      return normalizeBooking(saved);
    }

    // Mock Mode fallback
    if (bookingData.slot_id) {
      MockStore.updateSlotStatus(bookingData.slot_id, 'BOOKED');
    }

    const newBooking: Booking = {
      booking_id: Date.now(),
      user_id: bookingData.user_id,
      provider_id: bookingData.provider_id,
      service_id: bookingData.service_id,
      booking_date: bookingData.booking_date,
      booking_time: bookingData.booking_time,
      status: 'CONFIRMED',
      created_at: new Date().toISOString(),
      notes: bookingData.notes,
      total_price: bookingData.total_price,
      provider_name: bookingData.provider_name,
      service_name: bookingData.service_name,
      user_name: bookingData.user_name,
      category_id: bookingData.category_id,
      category_name: bookingData.category_name,
      provider_address: bookingData.provider_address,
      provider_phone: bookingData.provider_phone,
    };

    return MockStore.addBooking(newBooking);
  },

  async cancelBooking(bookingId: number): Promise<boolean> {
    if (DATA_MODE === 'live') {
      try {
        await apiRequest<BackendBooking>(`/bookings/${bookingId}/cancel`, {
          method: 'PUT',
        });
        return true;
      } catch (err) {
        console.warn('Backend booking cancellation failed:', err);
      }
    }
    const updated = MockStore.updateBookingStatus(bookingId, 'CANCELLED');
    return !!updated;
  },

  async updateBookingStatus(bookingId: number, status: BookingStatus): Promise<Booking | null> {
    if (DATA_MODE === 'live') {
      try {
        const updated = await apiRequest<BackendBooking>(`/officer/bookings/${bookingId}/status`, {
          method: 'PUT',
          body: JSON.stringify({ status }),
        });
        return normalizeBooking(updated);
      } catch (err) {
        console.warn('Backend booking status update failed:', err);
      }
    }
    const updated = MockStore.updateBookingStatus(bookingId, status);
    return updated || null;
  },
};
