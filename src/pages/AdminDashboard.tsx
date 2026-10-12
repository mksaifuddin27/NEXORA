import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Store,
  CalendarCheck,
  CheckCircle,
  XCircle,
  AlertCircle,
  Layers,
  Star,
  Trash2,
  RefreshCcw,
  Plus,
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { reviewService } from '../services/reviewService';
import { providerService } from '../services/providerService';
import { User, Provider, Category, RatingReview, VerificationStatus } from '../types';
import { formatDate } from '../utils/formatters';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<{
    totalUsers: number;
    totalProviders: number;
    totalBookings: number;
    pendingVerifications: number;
    totalReviews: number;
  }>({
    totalUsers: 0,
    totalProviders: 0,
    totalBookings: 0,
    pendingVerifications: 0,
    totalReviews: 0,
  });

  const [activeTab, setActiveTab] = useState<'PROVIDERS' | 'USERS' | 'REVIEWS' | 'CATEGORIES'>('PROVIDERS');
  const [users, setUsers] = useState<User[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reviews, setReviews] = useState<RatingReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Category Form State
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImg, setCatImg] = useState('');

  const loadAll = async () => {
    setIsLoading(true);
    try {
      const [s, u, p, c, r] = await Promise.all([
        adminService.getSystemStats(),
        adminService.getAllUsers(),
        adminService.getAllProviders(),
        providerService.getCategories(),
        reviewService.getAllReviews(),
      ]);
      setStats(s);
      setUsers(u);
      setProviders(p);
      setCategories(c);
      setReviews(r);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateVerification = async (providerId: number, status: VerificationStatus) => {
    try {
      await adminService.updateProviderVerification(providerId, status);
      setProviders((prev) =>
        prev.map((p) => (p.provider_id === providerId ? { ...p, verification_status: status } : p))
      );
      setStats((prev) => ({
        ...prev,
        pendingVerifications: providers.filter(
          (p) => (p.provider_id === providerId ? status : p.verification_status) === 'PENDING'
        ).length,
      }));
      triggerToast(`Provider status set to ${status}.`);
    } catch {
      alert('Failed to update status.');
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!window.confirm('Delete this user review permanently?')) return;
    try {
      await reviewService.deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r.rating_id !== reviewId));
      triggerToast('Review deleted by moderator.');
    } catch {
      alert('Could not delete review.');
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    try {
      const slugVal = catName.toLowerCase().replace(/\s+/g, '-') as any;
      const newCat = await adminService.addCategory({
        category_name: catName.trim(),
        slug: slugVal,
        description: catDesc || 'Curated local services in this newly registered industry.',
        iconName: 'Compass',
        featured_image: catImg || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      });
      setCategories((prev) => [...prev, newCat]);
      setCatName('');
      setCatDesc('');
      setCatImg('');
      triggerToast(`Category "${newCat.category_name}" registered.`);
    } catch {
      alert('Could not add category.');
    }
  };

  const handleSystemReset = async () => {
    if (!window.confirm('Reset all demo local data to the initial factory seed state?')) return;
    await adminService.resetSystemData();
    await loadAll();
    triggerToast('System data reset to initial seeds.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 p-4 rounded-2xl bg-rose-900 border border-rose-500 text-white text-xs font-bold shadow-2xl animate-in slide-in-from-right-4">
          ✓ {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-850 to-rose-950/50 border border-white/10 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Root Authority
            </span>
            <span className="text-xs text-slate-400">Chief System Administrator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            NEXORA Platform Operations Console
          </h1>
          <p className="text-xs text-slate-400">
            System metrics, provider verification vetting, category catalog, and citizen review moderation.
          </p>
        </div>

        <button
          onClick={handleSystemReset}
          className="px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-750 text-slate-300 border border-white/10 text-xs font-semibold transition flex items-center gap-2 self-start sm:self-auto"
          title="Reset local changes back to seeds"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          <span>Reset Seeds</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-navy-900 border border-white/10">
          <div className="text-xs text-slate-400">Total Users</div>
          <div className="text-2xl font-black text-white mt-1">{stats.totalUsers}</div>
        </div>
        <div className="p-4 rounded-2xl bg-navy-900 border border-white/10">
          <div className="text-xs text-slate-400">Registered Providers</div>
          <div className="text-2xl font-black text-white mt-1">{stats.totalProviders}</div>
        </div>
        <div className="p-4 rounded-2xl bg-navy-900 border border-white/10">
          <div className="text-xs text-slate-400">Total Bookings</div>
          <div className="text-2xl font-black text-brand-secondary mt-1">{stats.totalBookings}</div>
        </div>
        <div className="p-4 rounded-2xl bg-navy-900 border border-white/10">
          <div className="text-xs text-slate-400">Pending Vetting</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{stats.pendingVerifications}</div>
        </div>
        <div className="p-4 rounded-2xl bg-navy-900 border border-white/10">
          <div className="text-xs text-slate-400">Citizen Reviews</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{stats.totalReviews}</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex rounded-2xl bg-navy-900 p-1.5 border border-white/10 overflow-x-auto">
        <button
          onClick={() => setActiveTab('PROVIDERS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'PROVIDERS'
              ? 'bg-brand-primary text-white shadow-glow-indigo'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Provider Verification ({providers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('USERS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'USERS'
              ? 'bg-brand-primary text-white shadow-glow-indigo'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>User Management ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('REVIEWS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'REVIEWS'
              ? 'bg-brand-primary text-white shadow-glow-indigo'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          <span>Review Moderation ({reviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('CATEGORIES')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'CATEGORIES'
              ? 'bg-brand-primary text-white shadow-glow-indigo'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Categories ({categories.length})</span>
        </button>
      </div>

      {/* TAB 1: PROVIDER VERIFICATION */}
      {activeTab === 'PROVIDERS' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-navy-900 border border-white/10 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-white/10">
                <tr>
                  <th className="pb-3 px-3">Provider Name</th>
                  <th className="pb-3 px-3">Location & Phone</th>
                  <th className="pb-3 px-3">Rating</th>
                  <th className="pb-3 px-3">Verification Status</th>
                  <th className="pb-3 px-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {providers.map((p) => (
                  <tr key={p.provider_id} className="hover:bg-navy-850/50">
                    <td className="py-3 px-3 font-semibold text-white">
                      <div>{p.provider_name}</div>
                      <div className="text-[10px] text-slate-500">ID #{p.provider_id}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div>{p.address}</div>
                      <div className="text-slate-400">{p.phone}</div>
                    </td>
                    <td className="py-3 px-3 text-amber-400 font-bold">
                      ★ {p.rating_avg.toFixed(1)} ({p.review_count})
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          p.verification_status === 'VERIFIED'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : p.verification_status === 'PENDING'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {p.verification_status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex gap-2">
                        {p.verification_status !== 'VERIFIED' && (
                          <button
                            onClick={() => handleUpdateVerification(p.provider_id, 'VERIFIED')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[11px] font-bold transition"
                          >
                            Approve
                          </button>
                        )}
                        {p.verification_status !== 'REJECTED' && (
                          <button
                            onClick={() => handleUpdateVerification(p.provider_id, 'REJECTED')}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-[11px] font-bold transition"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === 'USERS' && (
        <div className="p-4 rounded-2xl bg-navy-900 border border-white/10 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-white/10">
              <tr>
                <th className="pb-3 px-3">User ID</th>
                <th className="pb-3 px-3">Full Name</th>
                <th className="pb-3 px-3">Email Address</th>
                <th className="pb-3 px-3">System Role</th>
                <th className="pb-3 px-3">Registered Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => (
                <tr key={u.user_id} className="hover:bg-navy-850/50">
                  <td className="py-3 px-3 font-mono text-slate-500">#{u.user_id}</td>
                  <td className="py-3 px-3 font-semibold text-white">{u.full_name}</td>
                  <td className="py-3 px-3 text-slate-400">{u.email}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'ADMIN'
                          ? 'bg-rose-500/20 text-rose-300'
                          : u.role === 'OFFICER'
                          ? 'bg-indigo-500/20 text-indigo-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400">{formatDate(u.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: REVIEW MODERATION */}
      {activeTab === 'REVIEWS' && (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div
              key={r.rating_id}
              className="p-4 rounded-2xl bg-navy-900 border border-white/10 flex items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{r.user_name}</span>
                  <span className="text-amber-400 font-bold">★ {r.rating} / 5</span>
                  <span className="text-slate-500 text-[10px]">{formatDate(r.created_at)}</span>
                </div>
                <p className="text-slate-300 leading-relaxed max-w-2xl">{r.review}</p>
              </div>

              <button
                onClick={() => handleDeleteReview(r.rating_id)}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-navy-800 rounded-lg transition"
                title="Moderate / Delete review"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: CATEGORY MANAGEMENT */}
      {activeTab === 'CATEGORIES' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Category Form */}
          <div className="p-6 rounded-2xl bg-navy-900 border border-white/10 space-y-4 h-fit">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-brand-secondary" />
              Register New Category
            </h3>
            <form onSubmit={handleAddCategory} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="E.g., Pet Care & Veterinary"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-navy-850 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Description
                </label>
                <textarea
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Category scope and target services..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-navy-850 border border-white/10 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Banner Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={catImg}
                  onChange={(e) => setCatImg(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-navy-850 border border-white/10 text-xs text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-indigo-600 text-white font-bold text-xs shadow-glow-indigo transition"
              >
                Create Category
              </button>
            </form>
          </div>

          {/* Current Categories */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-base font-bold text-white">Registered Categories ({categories.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((c) => (
                <div
                  key={c.category_id}
                  className="p-4 rounded-2xl bg-navy-900 border border-white/10 space-y-2 text-xs"
                >
                  <div className="font-bold text-white text-sm">{c.category_name}</div>
                  <p className="text-slate-400">{c.description}</p>
                  <div className="text-[10px] text-brand-secondary font-semibold">
                    {c.provider_count}+ establishments listed
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
