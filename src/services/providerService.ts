import { apiRequest, DATA_MODE } from './apiClient';
import { MockStore } from './mockStorage';
import { Provider, Category, ServiceItem, AvailabilitySlot, DiscoveryFilters, UserLocation } from '../types';
import { calculateDistanceKm } from '../utils/geo';

interface BackendCategory {
  categoryId: number;
  categoryName: string;
  slug: string;
  description: string;
  iconName: string;
  featuredImage: string;
  active: boolean;
}

interface BackendProvider {
  providerId: number;
  officerId: number;
  officerName?: string;
  categoryId: number;
  categoryName?: string;
  providerName: string;
  description: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  openingHours: string;
  verificationStatus: Provider['verification_status'];
  bookingSupported: boolean;
  active: boolean;
  imageUrl: string;
  priceRange: Provider['price_range'];
  ratingAvg: number;
  reviewCount: number;
  distanceKm?: number | null;
  createdAt?: string;
}

interface BackendService {
  serviceId: number;
  providerId: number;
  serviceName: string;
  description: string;
  price: number;
  durationMins?: number;
  active: boolean;
}

interface BackendSlot {
  availabilityId: number;
  providerId: number;
  availableDate: string;
  startTime: string;
  endTime: string;
  status: AvailabilitySlot['status'];
  capacity: number;
}

function normalizeCategory(c: BackendCategory): Category {
  return {
    category_id: c.categoryId,
    category_name: c.categoryName,
    slug: c.slug as any,
    description: c.description,
    iconName: c.iconName,
    featured_image: c.featuredImage,
    provider_count: 5,
  };
}

function normalizeProvider(p: BackendProvider): Provider {
  return {
    provider_id: p.providerId,
    officer_id: p.officerId,
    category_id: p.categoryId,
    provider_name: p.providerName,
    description: p.description,
    phone: p.phone,
    address: p.address,
    city: p.city,
    latitude: p.latitude,
    longitude: p.longitude,
    verification_status: p.verificationStatus,
    image_url: p.imageUrl,
    gallery: [],
    opening_hours: p.openingHours,
    rating_avg: p.ratingAvg,
    review_count: p.reviewCount,
    price_range: p.priceRange || '$$',
    distance_km: p.distanceKm,
    featured: p.ratingAvg >= 4.7,
    isOpenNow: true,
  };
}

function normalizeService(s: BackendService): ServiceItem {
  return {
    service_id: s.serviceId,
    provider_id: s.providerId,
    service_name: s.serviceName,
    description: s.description,
    price: s.price,
    duration_mins: s.durationMins,
  };
}

function normalizeSlot(s: BackendSlot): AvailabilitySlot {
  return {
    availability_id: s.availabilityId,
    provider_id: s.providerId,
    available_date: s.availableDate,
    start_time: s.startTime,
    end_time: s.endTime,
    status: s.status,
  };
}

export const providerService = {
  async getCategories(): Promise<Category[]> {
    if (DATA_MODE === 'live') {
      try {
        const list = await apiRequest<BackendCategory[]>('/categories');
        return list.map(normalizeCategory);
      } catch (err) {
        console.warn('Backend categories fetch failed, falling back to mock:', err);
      }
    }
    return MockStore.getCategories();
  },

  async getProviders(filters?: DiscoveryFilters, userLoc?: UserLocation | null): Promise<Provider[]> {
    if (DATA_MODE === 'live') {
      try {
        const params = new URLSearchParams();
        if (filters?.categoryId) params.append('categoryId', filters.categoryId.toString());
        if (filters?.searchQuery) params.append('q', filters.searchQuery);
        if (filters?.viewMode) params.append('mode', filters.viewMode);
        if (userLoc?.latitude && userLoc?.longitude) {
          params.append('lat', userLoc.latitude.toString());
          params.append('lng', userLoc.longitude.toString());
        }
        if (filters?.maxDistanceKm) params.append('maxDistanceKm', filters.maxDistanceKm.toString());
        if (filters?.minRating) params.append('minRating', filters.minRating.toString());
        if (filters?.priceRange && filters.priceRange !== 'all') params.append('priceRange', filters.priceRange);
        if (filters?.sortBy) params.append('sortBy', filters.sortBy);

        const list = await apiRequest<BackendProvider[]>(`/providers?${params.toString()}`);
        return list.map(normalizeProvider);
      } catch (err) {
        console.warn('Backend providers fetch failed, falling back to mock:', err);
      }
    }

    // Mock Mode fallback
    let list = MockStore.getProviders();
    list = list.map((p) => {
      const distance = userLoc?.latitude && userLoc?.longitude
        ? calculateDistanceKm(userLoc.latitude, userLoc.longitude, p.latitude, p.longitude)
        : null;
      return { ...p, distance_km: distance };
    });

    if (!filters) return list;

    if (filters.categoryId) {
      list = list.filter((p) => p.category_id === filters.categoryId);
    }

    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.provider_name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q)
      );
    }

    if (filters.priceRange && filters.priceRange !== 'all') {
      list = list.filter((p) => p.price_range === filters.priceRange);
    }

    if (filters.minRating && filters.minRating > 0) {
      list = list.filter((p) => p.rating_avg >= filters.minRating!);
    }

    if (filters.maxDistanceKm && filters.maxDistanceKm > 0) {
      list = list.filter((p) => p.distance_km != null && p.distance_km <= filters.maxDistanceKm!);
    }

    switch (filters.viewMode) {
      case 'nearby':
        list = list.filter((p) => p.distance_km != null);
        list.sort((a, b) => (a.distance_km ?? 9999) - (b.distance_km ?? 9999));
        break;
      case 'best-nearby':
        list = list.filter((p) => p.distance_km != null && p.rating_avg >= 4.5);
        list.sort((a, b) => (a.distance_km ?? 9999) - (b.distance_km ?? 9999));
        break;
      case 'best-overall':
        list = list.filter((p) => p.rating_avg >= 4.5);
        list.sort((a, b) => b.rating_avg - a.rating_avg);
        break;
      case 'all':
      default:
        if (filters.sortBy === 'distance') {
          list.sort((a, b) => {
            if (a.distance_km == null) return 1;
            if (b.distance_km == null) return -1;
            return a.distance_km - b.distance_km;
          });
        } else if (filters.sortBy === 'rating') {
          list.sort((a, b) => b.rating_avg - a.rating_avg);
        }
        break;
    }

    return list;
  },

  async getFeaturedProviders(userLoc?: UserLocation | null): Promise<Provider[]> {
    if (DATA_MODE === 'live') {
      try {
        const params = new URLSearchParams();
        if (userLoc?.latitude && userLoc?.longitude) {
          params.append('lat', userLoc.latitude.toString());
          params.append('lng', userLoc.longitude.toString());
        }
        const list = await apiRequest<BackendProvider[]>(`/providers/featured?${params.toString()}`);
        return list.map(normalizeProvider);
      } catch (err) {
        console.warn('Backend featured providers fetch failed:', err);
      }
    }
    const all = await this.getProviders({ viewMode: 'all', sortBy: 'rating' }, userLoc);
    return all.filter((p) => p.featured || p.rating_avg >= 4.7).slice(0, 4);
  },

  async getProviderById(id: number, userLoc?: UserLocation | null): Promise<Provider | null> {
    if (DATA_MODE === 'live') {
      try {
        const params = new URLSearchParams();
        if (userLoc?.latitude && userLoc?.longitude) {
          params.append('lat', userLoc.latitude.toString());
          params.append('lng', userLoc.longitude.toString());
        }
        const prov = await apiRequest<BackendProvider>(`/providers/${id}?${params.toString()}`);
        return normalizeProvider(prov);
      } catch (err) {
        console.warn('Backend provider detail fetch failed:', err);
      }
    }
    const p = MockStore.getProviderById(id);
    if (!p) return null;
    const distance = userLoc?.latitude && userLoc?.longitude
      ? calculateDistanceKm(userLoc.latitude, userLoc.longitude, p.latitude, p.longitude)
      : null;
    return { ...p, distance_km: distance };
  },

  async getServicesByProviderId(providerId: number): Promise<ServiceItem[]> {
    if (DATA_MODE === 'live') {
      try {
        const list = await apiRequest<BackendService[]>(`/providers/${providerId}/services`);
        return list.map(normalizeService);
      } catch (err) {
        console.warn('Backend services fetch failed:', err);
      }
    }
    return MockStore.getServicesByProvider(providerId);
  },

  async getSlotsByProviderId(providerId: number, date?: string): Promise<AvailabilitySlot[]> {
    if (DATA_MODE === 'live') {
      try {
        const endpoint = date ? `/providers/${providerId}/slots?date=${date}` : `/providers/${providerId}/slots`;
        const list = await apiRequest<BackendSlot[]>(endpoint);
        return list.map(normalizeSlot);
      } catch (err) {
        console.warn('Backend slots fetch failed:', err);
      }
    }
    const slots = MockStore.getSlotsByProvider(providerId);
    return date ? slots.filter((s) => s.available_date === date) : slots;
  },
};
