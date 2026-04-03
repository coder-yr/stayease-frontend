import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  getMyHotels,
  createHotel,
  updateMyHotel,
  deleteMyHotel,
  Hotel,
  HotelInput
} from '../services/hotelApi';
import { userApi, UserProfile } from '../services/userApi';
import { getAccessToken } from '../services/apiClient';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  X,
  Sparkles,
  ArrowLeft,
  MapPin,
  ShieldCheck,
  Clock,
  Ban,
  Home
} from 'lucide-react';

const emptyForm = (): Partial<HotelInput> => ({
  name: '',
  location: '',
  price: 0,
  rating: 0,
  reviewCount: 0,
  category: 'Hotel',
  description: '',
  deposit: undefined,
  rules: '',
  mealsIncluded: undefined
});

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<HotelInput>>(emptyForm);
  const [formError, setFormError] = useState('');

  const load = useCallback(async () => {
    if (!getAccessToken()) {
      navigate('/login', { replace: true, state: { from: '/owner/dashboard' } });
      return;
    }
    setLoading(true);
    try {
      const [p, list] = await Promise.all([
        userApi.getProfile(),
        getMyHotels().catch(() => [] as Hotel[])
      ]);
      setProfile(p);
      setHotels(list);
    } catch {
      navigate('/login', { replace: true });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    void load();
  }, [load]);

  const canManageListings =
    profile?.role === 'owner' || profile?.role === 'admin';

  const ownerApp = profile?.preferences?.ownerApplication;
  const ownerStatus = ownerApp?.status;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    try {
      const payload: Partial<HotelInput> = {
        ...formData,
        price: Number(formData.price),
        rating: formData.rating != null ? Number(formData.rating) : 0,
        reviewCount: formData.reviewCount != null ? Number(formData.reviewCount) : 0,
        description: formData.description?.trim() || undefined,
        rules: formData.rules?.trim() || undefined,
        deposit:
          formData.category === 'PG' && formData.deposit != null && !Number.isNaN(Number(formData.deposit))
            ? Number(formData.deposit)
            : undefined,
        mealsIncluded:
          formData.category === 'PG' ? Boolean(formData.mealsIncluded) : undefined
      };

      if (editingId) {
        await updateMyHotel(editingId, payload);
      } else {
        await createHotel(payload as HotelInput);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData(emptyForm());
      void load();
    } catch (error) {
      console.error('Failed to save hotel:', error);
      setFormError('Could not save. Check required fields and try again.');
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData(emptyForm());
    setFormError('');
    setShowForm(true);
  };

  const handleEdit = (hotel: Hotel) => {
    setFormData({
      name: hotel.name,
      location: hotel.location,
      price: Number(hotel.price),
      rating: Number(hotel.rating),
      reviewCount: hotel.reviewCount,
      category: hotel.category,
      description: hotel.description ?? '',
      deposit: hotel.deposit != null ? Number(hotel.deposit) : undefined,
      rules: hotel.rules ?? '',
      mealsIncluded: hotel.mealsIncluded ?? undefined
    });
    setEditingId(hotel.id);
    setFormError('');
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this listing? This cannot be undone.')) return;
    try {
      await deleteMyHotel(id);
      void load();
    } catch (error) {
      console.error('Failed to delete hotel:', error);
      alert('Failed to delete listing.');
    }
  };

  const statusBadge = (status: string) => {
    const map = {
      pending: 'bg-amber-50 text-amber-800 border-amber-200',
      approved: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      rejected: 'bg-rose-50 text-rose-800 border-rose-200'
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${map[status as keyof typeof map] ?? map.pending}`}
      >
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-brand-accent/30 border-t-brand-accent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading host console…</p>
        </div>
      </div>
    );
  }

  if (!canManageListings) {
    return (
      <div className="min-h-screen bg-brand-bg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[min(100vw,800px)] h-[min(100vw,800px)] rounded-full bg-brand-accent/5 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-4 py-16 md:py-24">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-accent hover:text-brand-accent-light mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to StayEase
          </Link>

          {ownerStatus === 'pending' && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-[40px] p-10 md:p-12 border border-slate-100 shadow-xl shadow-brand-primary/5 text-center space-y-6"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Clock className="w-8 h-8" />
              </div>
              <span className="micro-label text-amber-700/90">Owner application</span>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-primary">
                We&apos;re reviewing your request
              </h1>
              <p className="text-slate-600 font-serif italic leading-relaxed">
                An administrator will approve your host access in AdminJS (Users → Approve Owner Access).
                You&apos;ll be able to list properties here once your role is set to Hotel Owner.
              </p>
              <Link to="/dashboard" className="inline-flex btn-primary px-8 py-3 text-xs font-bold uppercase tracking-widest">
                Go to my account
              </Link>
            </motion.div>
          )}

          {ownerStatus === 'rejected' && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-[40px] p-10 md:p-12 border border-slate-100 shadow-xl shadow-brand-primary/5 text-center space-y-6"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                <Ban className="w-8 h-8" />
              </div>
              <span className="micro-label text-rose-700/90">Application update</span>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-primary">
                Host application wasn&apos;t approved
              </h1>
              <p className="text-slate-600">
                If you have questions, reach out via Support. You can continue using StayEase as a guest.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/support" className="inline-flex btn-primary px-8 py-3 text-xs font-bold uppercase tracking-widest justify-center">
                  Contact support
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center px-8 py-3 rounded-2xl border border-slate-200 text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50"
                >
                  Dashboard
                </Link>
              </div>
            </motion.div>
          )}

          {ownerStatus !== 'pending' && ownerStatus !== 'rejected' && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-[40px] p-10 md:p-12 border border-slate-100 shadow-xl shadow-brand-primary/5 space-y-8"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-brand-accent">
                  <Building2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="micro-label">Become a host</span>
                  <h1 className="text-2xl md:text-3xl font-display font-bold text-brand-primary mt-1">
                    List on StayEase
                  </h1>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Sign up with a host account to submit an application. After an admin approves you in{' '}
                <strong className="text-brand-primary font-semibold">StayEase Admin</strong>, this page becomes your
                listing console.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/signup" className="inline-flex btn-primary px-8 py-3 text-xs font-bold uppercase tracking-widest justify-center">
                  Register as host
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-8 py-3 rounded-2xl border border-slate-200 text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50"
                >
                  Sign in
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-0 w-96 h-96 rounded-full bg-brand-accent/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[min(100vw,600px)] h-[min(100vw,600px)] rounded-full bg-brand-primary/5 blur-3xl translate-y-1/3" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-10 md:py-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-accent hover:text-brand-accent-light transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              Home
            </Link>
            <div className="flex items-center gap-3">
              <span className="micro-label">Host console</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-primary tracking-tight">
              Your <span className="text-gradient">listings</span>
            </h1>
            <p className="text-slate-500 font-serif italic max-w-lg">
              New submissions go to <strong className="font-sans not-italic text-brand-primary">pending</strong> until
              approved in StayEase Admin.
            </p>
          </div>
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center justify-center gap-2 btn-primary px-6 py-3.5 text-xs font-bold uppercase tracking-widest shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add property
          </button>
        </div>

        <div className="grid gap-6">
          {hotels.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-[32px] p-12 md:p-16 border border-dashed border-slate-200 text-center space-y-4"
            >
              <Sparkles className="w-12 h-12 text-brand-accent/40 mx-auto" />
              <h2 className="text-xl font-display font-bold text-brand-primary">No listings yet</h2>
              <p className="text-slate-500 max-w-md mx-auto">
                Create your first property. Required fields match the admin panel: name, location, and nightly price.
              </p>
              <button type="button" onClick={openAdd} className="mt-4 btn-accent px-8 py-3 text-xs font-bold uppercase tracking-widest">
                Add property
              </button>
            </motion.div>
          ) : (
            hotels.map((hotel, i) => (
              <motion.div
                key={hotel.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-[28px] p-6 md:p-8 border border-slate-100/80 shadow-lg shadow-brand-primary/5 hover:shadow-xl hover:border-brand-accent/20 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl md:text-2xl font-display font-bold text-brand-primary">{hotel.name}</h2>
                      {statusBadge(hotel.status)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <MapPin className="w-4 h-4 text-brand-accent shrink-0" />
                      {hotel.location}
                    </div>
                    {hotel.description && (
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">{hotel.description}</p>
                    )}
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="font-bold text-brand-primary">
                        ₹{Number(hotel.price).toLocaleString()}
                        <span className="text-slate-400 font-normal"> / night</span>
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-600">{hotel.category}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-amber-600 font-medium">★ {Number(hotel.rating).toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 lg:flex-col lg:items-stretch shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEdit(hotel)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 text-brand-accent hover:bg-emerald-50 text-xs font-bold uppercase tracking-widest transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(hotel.id)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-rose-100 text-rose-600 hover:bg-rose-50 text-xs font-bold uppercase tracking-widest transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <p className="mt-10 flex items-start gap-2 text-xs text-slate-400 max-w-2xl">
          <ShieldCheck className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
          <span>
            Upload photos and fine-tune amenities in <strong className="text-slate-600">StayEase Admin</strong> after
            submission, or ask your administrator to enrich the record before approval.
          </span>
        </p>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-primary/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowForm(false);
              setEditingId(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="bg-white rounded-[28px] shadow-2xl shadow-brand-primary/15 max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-[28px] z-10">
                <div>
                  <span className="micro-label">{editingId ? 'Update listing' : 'New listing'}</span>
                  <h2 className="text-xl font-display font-bold text-brand-primary mt-1">
                    {editingId ? 'Edit property' : 'Add property'}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {formError && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                    {formError}
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                    Property name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name ?? ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent/50 outline-none text-brand-primary shadow-sm"
                    placeholder="e.g. Emerald Boutique Stay"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location ?? ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent/50 outline-none text-brand-primary shadow-sm"
                    placeholder="City, area"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                    Price per night (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={1}
                    value={formData.price === undefined || formData.price === 0 ? '' : formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value === '' ? 0 : Number(e.target.value) })
                    }
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent/50 outline-none text-brand-primary shadow-sm"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category ?? 'Hotel'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent/50 outline-none text-brand-primary shadow-sm"
                  >
                    <option value="Hotel">Hotel</option>
                    <option value="PG">PG / Student Housing</option>
                  </select>
                </div>

                {formData.category === 'PG' && (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                        Security deposit (₹)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={formData.deposit ?? ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            deposit: e.target.value === '' ? undefined : Number(e.target.value)
                          })
                        }
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent/50 outline-none text-brand-primary shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                        House rules
                      </label>
                      <textarea
                        value={formData.rules ?? ''}
                        onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent/50 outline-none text-brand-primary shadow-sm resize-none"
                      />
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(formData.mealsIncluded)}
                        onChange={(e) => setFormData({ ...formData, mealsIncluded: e.target.checked })}
                        className="rounded border-slate-300 text-brand-accent focus:ring-brand-accent"
                      />
                      <span className="text-sm font-medium text-slate-700">Meals included</span>
                    </label>
                  </>
                )}

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description ?? ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent/50 outline-none text-brand-primary shadow-sm resize-none"
                    placeholder="Highlights guests should know…"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 btn-primary py-3.5 text-xs font-bold uppercase tracking-widest">
                    {editingId ? 'Save changes' : 'Submit for approval'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                    }}
                    className="px-6 py-3.5 rounded-2xl border border-slate-200 text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
