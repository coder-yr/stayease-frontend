import React from 'react';
import { ArrowRight, CalendarDays, ChevronRight, Clock3, IndianRupee, MapPin, Sparkles, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { packageApi, TourPackage } from '../services/packageApi';

const toIsoDate = (date: Date) => {
  const next = new Date(date);
  next.setDate(next.getDate() + 1);
  return next.toISOString().split('T')[0];
};

const ToursAndPackages: React.FC = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = React.useState<TourPackage[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const loadPackages = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await packageApi.listPackages();
        setPackages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load packages');
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };

    void loadPackages();
  }, []);

  const handleBookNow = (travelPackage: TourPackage) => {
    const travelDate = toIsoDate(new Date());
    navigate(`/checkout?type=package&packageId=${encodeURIComponent(travelPackage.id)}&travelDate=${travelDate}`);
  };

  const handleViewDetails = (travelPackage: TourPackage) => {
    navigate(`/packages/${encodeURIComponent(travelPackage.id)}`);
  };

  const getDurationLabel = (travelPackage: TourPackage) => {
    if (typeof travelPackage.durationDays === 'number' && travelPackage.durationDays > 0) {
      return `${travelPackage.durationDays}D / ${Math.max(1, travelPackage.durationDays - 1)}N`;
    }
    return 'Flexible duration';
  };

  const getRatingLabel = (travelPackage: TourPackage) => {
    if (typeof travelPackage.rating === 'number') {
      return travelPackage.rating.toFixed(1);
    }
    return '4.8';
  };

  const getMetadataChips = (travelPackage: TourPackage) => {
    const chips = [
      getDurationLabel(travelPackage),
      travelPackage.theme ?? 'Curated itinerary',
      travelPackage.transportMode ?? 'Mix of stay + transfers'
    ];

    return chips.filter(Boolean).slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-[#f8faf7]">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-3xl space-y-6 mb-14">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold uppercase tracking-[0.3em]">
            <Sparkles className="w-4 h-4" />
            Curated Packages
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-slate-900 uppercase tracking-tighter leading-[0.92]">
            Tours that feel <span className="text-brand-accent italic serif-italic">intentional</span>.
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl">
            Browse AI-ready tour packages with direct booking into checkout. Each option is built to support fast decisions and low-friction conversion.
          </p>
        </div>

        {error && (
          <div className="mb-8 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
            Could not load packages from API: {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-120 rounded-[40px] bg-white animate-pulse border border-slate-100 shadow-sm" />
            ))}
          </div>
        ) : packages.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {packages.map((travelPackage, index) => {
              const image = travelPackage.images?.[0] ?? 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80';
              const chips = getMetadataChips(travelPackage);
              return (
                <motion.article
                  key={travelPackage.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleViewDetails(travelPackage)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleViewDetails(travelPackage);
                    }
                  }}
                  className="group bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)] hover:-translate-y-1 transition-transform cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
                >
                  <div className="relative h-72 overflow-hidden">
                    <img src={image} alt={travelPackage.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent" />
                    <div className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-xl text-white border border-white/20 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em]">
                      <MapPin className="w-3.5 h-3.5" />
                      {travelPackage.destination}
                    </div>
                    <div className="absolute top-5 right-5 inline-flex items-center gap-1 rounded-full bg-slate-950/70 backdrop-blur-xl text-white border border-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em]">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {getRatingLabel(travelPackage)}
                    </div>
                    <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-white">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/70">From</p>
                        <div className="flex items-center gap-2 text-3xl font-display font-bold">
                          <IndianRupee className="w-6 h-6 text-brand-accent" />
                          {Number(travelPackage.price).toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div className="rounded-full bg-brand-accent text-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.3em]">
                        Best Value
                      </div>
                    </div>
                  </div>

                  <div className="p-8 space-y-6">
                    <div className="space-y-3">
                      <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight uppercase leading-[1.02]">
                        {travelPackage.name}
                      </h2>
                      <p className="text-slate-500 leading-relaxed">
                        {travelPackage.description || 'Curated experience with direct booking and conversion-friendly checkout.'}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {chips.map((chip, chipIndex) => (
                        <span key={`${chip}-${chipIndex}`} className="inline-flex items-center gap-2 rounded-full bg-slate-50 border border-slate-100 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
                          <Clock3 className="w-3.5 h-3.5 text-brand-accent" />
                          {chip}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                      <CalendarDays className="w-4 h-4 text-brand-accent" />
                      Flexible itinerary
                    </div>

                    {Array.isArray(travelPackage.inclusions) && travelPackage.inclusions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {travelPackage.inclusions.slice(0, 4).map((inclusion, idx) => (
                          <span key={idx} className="px-3 py-2 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
                            {String(inclusion)}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => handleViewDetails(travelPackage)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-4 text-[10px] font-bold uppercase tracking-[0.28em] text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        View details
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleBookNow(travelPackage)}
                        className="inline-flex items-center justify-center gap-3 rounded-full bg-slate-900 text-white px-4 py-4 text-[10px] font-bold uppercase tracking-[0.28em] hover:bg-brand-accent transition-colors"
                      >
                        Book now
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[40px] border border-dashed border-slate-200 bg-white/80 p-16 text-center text-slate-500">
            No packages are configured yet. Add tour packages through the backend admin endpoint to start surfacing them here.
          </div>
        )}
      </section>
    </div>
  );
};

export default ToursAndPackages;