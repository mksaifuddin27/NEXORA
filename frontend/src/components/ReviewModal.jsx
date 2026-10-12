import React, { useState } from 'react';
import { X, Star, Sparkles, AlertCircle } from 'lucide-react';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
export const ReviewModal = ({ provider, isOpen, onClose, onReviewSubmitted, }) => {
    const { user, isAuthenticated } = useAuth();
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    if (!isOpen)
        return null;
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated || !user) {
            setError('Please sign in to leave a review.');
            return;
        }
        if (!reviewText.trim()) {
            setError('Please write a brief feedback comment.');
            return;
        }
        setIsSubmitting(true);
        setError(null);
        try {
            await reviewService.createReview({
                user_id: user.user_id,
                user_name: user.full_name,
                provider_id: provider.provider_id,
                rating,
                review: reviewText.trim(),
            });
            if (onReviewSubmitted)
                onReviewSubmitted();
            onClose();
        }
        catch (err) {
            setError(err?.message || 'Failed to submit review.');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-navy-900 border border-white/15 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-navy-950">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Rate & Review
            </span>
            <h2 className="text-lg font-bold text-white mt-0.5">{provider.provider_name}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {error && (<div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0"/>
              <span>{error}</span>
            </div>)}

          {/* Star picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Your Rating (1 to 5 Stars)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (<button type="button" key={star} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} onClick={() => setRating(star)} className="p-1 focus:outline-none transition-transform hover:scale-110">
                  <Star className={`w-8 h-8 ${(hoverRating || rating) >= star
                ? 'fill-amber-400 text-amber-400'
                : 'text-slate-600'}`}/>
                </button>))}
              <span className="ml-3 text-sm font-bold text-amber-400">
                {(hoverRating || rating)} / 5 Stars
              </span>
            </div>
          </div>

          {/* Feedback text */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Your Experience & Feedback
            </label>
            <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Describe service quality, staff friendliness, punctuality, cleanliness, or suggestions..." rows={4} required className="w-full rounded-xl bg-navy-850 border border-white/10 px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary"/>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-navy-800 text-slate-300 text-xs font-semibold hover:bg-navy-750 transition">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-primary to-indigo-600 text-white text-xs font-bold shadow-glow-indigo hover:opacity-95 disabled:opacity-50 transition flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5"/>
              {isSubmitting ? 'Posting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>);
};
