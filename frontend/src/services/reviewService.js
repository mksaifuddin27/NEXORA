import { apiRequest, DATA_MODE } from './apiClient';
import { MockStore } from './mockStorage';
function normalizeRating(r) {
    return {
        rating_id: r.ratingId,
        user_id: r.userId,
        user_name: r.userName,
        provider_id: r.providerId,
        rating: r.rating,
        review: r.review,
        created_at: r.createdAt,
    };
}
export const reviewService = {
    async getReviewsByProviderId(providerId) {
        if (DATA_MODE === 'live') {
            try {
                const list = await apiRequest(`/ratings/provider/${providerId}`);
                return list.map(normalizeRating);
            }
            catch (err) {
                console.warn('Backend provider ratings fetch failed:', err);
            }
        }
        return MockStore.getReviewsByProvider(providerId);
    },
    async getAllReviews() {
        if (DATA_MODE === 'live') {
            try {
                const list = await apiRequest('/admin/ratings');
                return list.map(normalizeRating);
            }
            catch (err) {
                console.warn('Backend all ratings fetch failed:', err);
            }
        }
        return MockStore.getReviews();
    },
    async createReview(data) {
        if (DATA_MODE === 'live') {
            const saved = await apiRequest('/ratings', {
                method: 'POST',
                body: JSON.stringify({
                    providerId: data.provider_id,
                    bookingId: data.booking_id,
                    rating: data.rating,
                    review: data.review,
                }),
            });
            return normalizeRating(saved);
        }
        const newReview = {
            rating_id: Date.now(),
            user_id: data.user_id,
            user_name: data.user_name,
            provider_id: data.provider_id,
            rating: data.rating,
            review: data.review,
            created_at: new Date().toISOString(),
        };
        return MockStore.addReview(newReview);
    },
    async deleteReview(reviewId) {
        if (DATA_MODE === 'live') {
            try {
                await apiRequest(`/admin/ratings/${reviewId}`, {
                    method: 'DELETE',
                });
                return true;
            }
            catch (err) {
                console.warn('Backend review deletion failed:', err);
            }
        }
        return MockStore.deleteReview(reviewId);
    },
};
