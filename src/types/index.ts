export type UserRole = 'USER' | 'OFFICER' | 'ADMIN';

export interface User {
  user_id: number;
  full_name: string;
  email: string;
  role: UserRole;
  phone?: string;
  created_at: string;
}

export interface Category {
  category_id: number;
  category_name: string;
  slug: 'restaurants' | 'hotels' | 'healthcare' | 'pharmacies' | 'salons';
  description: string;
  iconName: string;
  provider_count: number;
  featured_image: string;
}

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface Provider {
  provider_id: number;
  officer_id: number;
  category_id: number;
  provider_name: string;
  description: string;
  phone: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  verification_status: VerificationStatus;
  image_url: string;
  gallery: string[];
  opening_hours: string;
  rating_avg: number;
  review_count: number;
  price_range: '$' | '$$' | '$$$' | '$$$$';
  featured?: boolean;
  isOpenNow?: boolean;
  distance_km?: number | null; // calculated dynamically relative to user coordinates
}

export interface ServiceItem {
  service_id: number;
  provider_id: number;
  service_name: string;
  description: string;
  price: number;
  duration_mins?: number;
}

export type SlotStatus = 'AVAILABLE' | 'BOOKED' | 'UNAVAILABLE';

export interface AvailabilitySlot {
  availability_id: number;
  provider_id: number;
  available_date: string; // YYYY-MM-DD
  start_time: string;     // HH:mm
  end_time: string;       // HH:mm
  status: SlotStatus;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface Booking {
  booking_id: number;
  user_id: number;
  provider_id: number;
  service_id: number;
  booking_date: string;
  booking_time: string;
  status: BookingStatus;
  created_at: string;
  notes?: string;
  total_price: number;
  // Denormalized fields for quick UI access
  provider_name?: string;
  service_name?: string;
  user_name?: string;
  category_id?: number;
  category_name?: string;
  provider_address?: string;
  provider_phone?: string;
}

export interface RatingReview {
  rating_id: number;
  user_id: number;
  user_name: string;
  provider_id: number;
  rating: number; // 1 to 5
  review: string;
  created_at: string;
}

export type DiscoveryViewMode = 'all' | 'nearby' | 'best-nearby' | 'best-overall';

export interface DiscoveryFilters {
  categoryId?: number | null;
  searchQuery?: string;
  viewMode: DiscoveryViewMode;
  maxDistanceKm?: number | null;
  minRating?: number | null;
  priceRange?: string | null;
  onlyAvailable?: boolean;
  sortBy: 'relevance' | 'distance' | 'rating' | 'price-asc' | 'price-desc';
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  cityName?: string;
  source: 'gps' | 'manual' | 'default';
  isPermitted: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role: UserRole;
}
