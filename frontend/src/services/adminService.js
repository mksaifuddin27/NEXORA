import { apiRequest, DATA_MODE } from './apiClient';
import { MockStore } from './mockStorage';
export const adminService = {
    async getSystemStats() {
        if (DATA_MODE === 'live') {
            try {
                const stats = await apiRequest('/admin/stats');
                return {
                    totalUsers: stats.totalUsers || 0,
                    totalProviders: stats.totalProviders || 0,
                    totalBookings: stats.totalBookings || 0,
                    pendingVerifications: stats.pendingVerifications || 0,
                    totalReviews: stats.totalReviews || 0,
                };
            }
            catch (err) {
                console.warn('Backend admin stats fetch failed:', err);
            }
        }
        const users = MockStore.getUsers();
        const providers = MockStore.getProviders();
        const bookings = MockStore.getBookings();
        const reviews = MockStore.getReviews();
        return {
            totalUsers: users.length,
            totalProviders: providers.length,
            totalBookings: bookings.length,
            pendingVerifications: providers.filter((p) => p.verification_status === 'PENDING').length,
            totalReviews: reviews.length,
        };
    },
    async getAllUsers() {
        if (DATA_MODE === 'live') {
            try {
                const list = await apiRequest('/admin/users');
                return list.map((u) => ({
                    user_id: u.userId,
                    full_name: u.fullName,
                    email: u.email,
                    role: u.role,
                    phone: u.phone,
                    created_at: u.createdAt,
                }));
            }
            catch (err) {
                console.warn('Backend admin users fetch failed:', err);
            }
        }
        return MockStore.getUsers();
    },
    async getAllProviders() {
        if (DATA_MODE === 'live') {
            try {
                const list = await apiRequest('/admin/providers');
                return list.map((p) => ({
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
                    rating_avg: p.ratingAvg || 0.0,
                    review_count: p.reviewCount || 0,
                    price_range: p.priceRange || '$$',
                    isOpenNow: true,
                }));
            }
            catch (err) {
                console.warn('Backend admin providers fetch failed:', err);
            }
        }
        return MockStore.getProviders();
    },
    async updateProviderVerification(providerId, status) {
        if (DATA_MODE === 'live') {
            const updated = await apiRequest(`/admin/providers/${providerId}/verification`, {
                method: 'PUT',
                body: JSON.stringify({ status }),
            });
            return {
                provider_id: providerId,
                verification_status: status,
            };
        }
        const updated = MockStore.updateProvider(providerId, { verification_status: status });
        if (!updated)
            throw new Error('Provider not found');
        return updated;
    },
    async addCategory(data) {
        if (DATA_MODE === 'live') {
            const created = await apiRequest('/admin/categories', {
                method: 'POST',
                body: JSON.stringify({
                    categoryName: data.category_name,
                    slug: data.slug,
                    description: data.description,
                    iconName: data.iconName,
                    featuredImage: data.featured_image,
                    active: true,
                }),
            });
            return {
                category_id: created.categoryId,
                category_name: created.categoryName,
                slug: created.slug,
                description: created.description,
                iconName: created.iconName,
                featured_image: created.featuredImage,
                provider_count: 0,
            };
        }
        const newCat = {
            category_id: Date.now(),
            provider_count: 0,
            ...data,
        };
        return MockStore.addCategory(newCat);
    },
    async resetSystemData() {
        MockStore.resetAll();
    },
};
