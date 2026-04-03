import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { getPendingHotels, approveHotel, rejectHotel, Hotel } from '../services/hotelApi';
import { CheckCircle, XCircle, Building2, User, Home, Sparkles } from 'lucide-react';

export default function AdminDashboard() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingHotels();
  }, []);

  const loadPendingHotels = async () => {
    try {
      const data = await getPendingHotels();
      setHotels(data);
    } catch (error) {
      console.error('Failed to load pending hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveHotel(id);
      loadPendingHotels();
    } catch (error) {
      console.error('Failed to approve hotel:', error);
      alert('Failed to approve hotel');
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Reject this hotel submission?')) return;
    try {
      await rejectHotel(id);
      loadPendingHotels();
    } catch (error) {
      console.error('Failed to reject hotel:', error);
      alert('Failed to reject hotel');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-brand-accent/30 border-t-brand-accent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading approvals…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg relative overflow-hidden">
      <div className="absolute top-20 right-0 w-[min(100vw,600px)] h-[min(100vw,600px)] rounded-full bg-brand-accent/5 blur-3xl pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 py-10 md:py-14">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-accent hover:text-brand-accent-light mb-8"
        >
          <Home className="w-4 h-4" />
          Home
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <span className="micro-label">Admin · API queue</span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-primary tracking-tight flex items-center gap-3 flex-wrap">
              <Building2 className="w-9 h-9 text-brand-accent shrink-0" />
              Pending <span className="text-gradient">hotels</span>
            </h1>
            <p className="text-slate-500 text-sm max-w-xl">
              Quick approvals here; full editing and uploads live in{' '}
              <strong className="text-brand-primary">StayEase Admin</strong> (AdminJS at{' '}
              <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">/admin</code>).
            </p>
          </div>
          <span className="inline-flex items-center gap-2 self-start md:self-auto px-4 py-2 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            {hotels.length} pending
          </span>
        </div>

        <div className="grid gap-6">
          {hotels.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-[32px] p-12 md:p-16 border border-dashed border-slate-200 text-center space-y-4"
            >
              <CheckCircle className="w-14 h-14 text-brand-accent/50 mx-auto" />
              <h2 className="text-xl font-display font-bold text-brand-primary">All caught up</h2>
              <p className="text-slate-500">No pending hotel submissions in the API queue.</p>
            </motion.div>
          ) : (
            hotels.map((hotel, i) => (
              <motion.div
                key={hotel.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass-card rounded-[28px] p-6 md:p-8 border border-slate-100/80 shadow-lg shadow-brand-primary/5 border-l-4 border-l-amber-400"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-display font-bold text-brand-primary">{hotel.name}</h3>
                    <p className="text-slate-600">{hotel.location}</p>
                    {hotel.description && (
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">{hotel.description}</p>
                    )}
                    <div className="flex flex-wrap gap-3 text-sm text-slate-600 pt-2">
                      <span className="font-bold text-brand-primary">
                        ₹{Number(hotel.price).toLocaleString()}/night
                      </span>
                      <span className="text-slate-300">·</span>
                      <span>★ {Number(hotel.rating).toFixed(1)}</span>
                      <span className="text-slate-300">·</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded-lg text-xs font-semibold">{hotel.category}</span>
                    </div>
                    {hotel.ownerId && (
                      <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
                        <User className="w-3.5 h-3.5" />
                        <span>Owner ID: {hotel.ownerId}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => void handleApprove(hotel.id)}
                      className="inline-flex items-center gap-2 btn-accent px-4 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleReject(hotel.id)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 text-[10px] font-bold uppercase tracking-widest transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
