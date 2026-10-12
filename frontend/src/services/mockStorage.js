import { INITIAL_CATEGORIES, INITIAL_USERS, INITIAL_PROVIDERS, INITIAL_SERVICES, INITIAL_SLOTS, INITIAL_BOOKINGS, INITIAL_REVIEWS, } from '../mock/data';
const STORAGE_KEYS = {
    CATEGORIES: 'nexora_categories_v1',
    USERS: 'nexora_users_v1',
    PROVIDERS: 'nexora_providers_v1',
    SERVICES: 'nexora_services_v1',
    SLOTS: 'nexora_slots_v1',
    BOOKINGS: 'nexora_bookings_v1',
    REVIEWS: 'nexora_reviews_v1',
};
function getStoredOrInit(key, initialData) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) {
            localStorage.setItem(key, JSON.stringify(initialData));
            return initialData;
        }
        return JSON.parse(raw);
    }
    catch {
        return initialData;
    }
}
function save(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    }
    catch (err) {
        console.error('Failed to save to localStorage:', err);
    }
}
// Initialized memory/local storage store
export class MockStore {
    static categories = getStoredOrInit(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    static users = getStoredOrInit(STORAGE_KEYS.USERS, INITIAL_USERS);
    static providers = getStoredOrInit(STORAGE_KEYS.PROVIDERS, INITIAL_PROVIDERS);
    static services = getStoredOrInit(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    static slots = getStoredOrInit(STORAGE_KEYS.SLOTS, INITIAL_SLOTS);
    static bookings = getStoredOrInit(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    static reviews = getStoredOrInit(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    // Categories
    static getCategories() {
        return [...this.categories];
    }
    static addCategory(category) {
        this.categories.push(category);
        save(STORAGE_KEYS.CATEGORIES, this.categories);
        return category;
    }
    // Users
    static getUsers() {
        return [...this.users];
    }
    static addUser(user) {
        this.users.push(user);
        save(STORAGE_KEYS.USERS, this.users);
        return user;
    }
    // Providers
    static getProviders() {
        return [...this.providers];
    }
    static getProviderById(id) {
        return this.providers.find((p) => p.provider_id === id);
    }
    static updateProvider(id, updates) {
        const idx = this.providers.findIndex((p) => p.provider_id === id);
        if (idx !== -1) {
            this.providers[idx] = { ...this.providers[idx], ...updates };
            save(STORAGE_KEYS.PROVIDERS, this.providers);
            return this.providers[idx];
        }
        return undefined;
    }
    // Services
    static getServices() {
        return [...this.services];
    }
    static getServicesByProvider(providerId) {
        return this.services.filter((s) => s.provider_id === providerId);
    }
    static addService(service) {
        this.services.push(service);
        save(STORAGE_KEYS.SERVICES, this.services);
        return service;
    }
    static updateService(serviceId, updates) {
        const idx = this.services.findIndex((s) => s.service_id === serviceId);
        if (idx !== -1) {
            this.services[idx] = { ...this.services[idx], ...updates };
            save(STORAGE_KEYS.SERVICES, this.services);
            return this.services[idx];
        }
        return undefined;
    }
    static deleteService(serviceId) {
        const prevLen = this.services.length;
        this.services = this.services.filter((s) => s.service_id !== serviceId);
        save(STORAGE_KEYS.SERVICES, this.services);
        return this.services.length < prevLen;
    }
    // Slots
    static getSlots() {
        return [...this.slots];
    }
    static getSlotsByProvider(providerId) {
        return this.slots.filter((s) => s.provider_id === providerId);
    }
    static addSlot(slot) {
        this.slots.push(slot);
        save(STORAGE_KEYS.SLOTS, this.slots);
        return slot;
    }
    static updateSlotStatus(slotId, status) {
        const slot = this.slots.find((s) => s.availability_id === slotId);
        if (slot) {
            slot.status = status;
            save(STORAGE_KEYS.SLOTS, this.slots);
        }
    }
    static deleteSlot(slotId) {
        const prevLen = this.slots.length;
        this.slots = this.slots.filter((s) => s.availability_id !== slotId);
        save(STORAGE_KEYS.SLOTS, this.slots);
        return this.slots.length < prevLen;
    }
    // Bookings
    static getBookings() {
        return [...this.bookings];
    }
    static getBookingsByUser(userId) {
        return this.bookings.filter((b) => b.user_id === userId);
    }
    static getBookingsByProvider(providerId) {
        return this.bookings.filter((b) => b.provider_id === providerId);
    }
    static addBooking(booking) {
        this.bookings.unshift(booking);
        save(STORAGE_KEYS.BOOKINGS, this.bookings);
        return booking;
    }
    static updateBookingStatus(bookingId, status) {
        const b = this.bookings.find((item) => item.booking_id === bookingId);
        if (b) {
            b.status = status;
            save(STORAGE_KEYS.BOOKINGS, this.bookings);
            return b;
        }
        return undefined;
    }
    // Reviews
    static getReviews() {
        return [...this.reviews];
    }
    static getReviewsByProvider(providerId) {
        return this.reviews.filter((r) => r.provider_id === providerId);
    }
    static addReview(review) {
        this.reviews.unshift(review);
        save(STORAGE_KEYS.REVIEWS, this.reviews);
        // Recompute provider average rating and count
        const provReviews = this.reviews.filter((r) => r.provider_id === review.provider_id);
        const avg = provReviews.reduce((sum, r) => sum + r.rating, 0) / provReviews.length;
        this.updateProvider(review.provider_id, {
            rating_avg: Math.round(avg * 10) / 10,
            review_count: provReviews.length,
        });
        return review;
    }
    static deleteReview(reviewId) {
        const prev = this.reviews.length;
        this.reviews = this.reviews.filter((r) => r.rating_id !== reviewId);
        save(STORAGE_KEYS.REVIEWS, this.reviews);
        return this.reviews.length < prev;
    }
    // Reset to initial defaults (handy test helper)
    static resetAll() {
        Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
        this.categories = [...INITIAL_CATEGORIES];
        this.users = [...INITIAL_USERS];
        this.providers = [...INITIAL_PROVIDERS];
        this.services = [...INITIAL_SERVICES];
        this.slots = [...INITIAL_SLOTS];
        this.bookings = [...INITIAL_BOOKINGS];
        this.reviews = [...INITIAL_REVIEWS];
    }
}
