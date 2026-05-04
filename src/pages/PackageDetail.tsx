import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Bus, CalendarDays, Clock3, Hotel, IndianRupee, MapPin, Star, Train } from 'lucide-react';
import { packageApi, TourPackage } from '../services/packageApi';

type DayPlan = {
  day: number;
  title: string;
  details: string;
};

type ReviewItem = {
  id: string;
  name: string;
  rating: number;
  text: string;
};

const fallbackImages = [
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1400&q=80'
];

const toStringList = (value: TourPackage['inclusions']): string[] => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean);
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) => {
      if (Array.isArray(item)) {
        return item.map((nested) => `${key}: ${String(nested)}`);
      }
      if (item && typeof item === 'object') {
        return Object.entries(item as Record<string, unknown>).map(
          ([nestedKey, nestedVal]) => `${key} ${nestedKey}: ${String(nestedVal)}`
        );
      }
      return [`${key}: ${String(item)}`];
    });
  }
  return [];
};

const buildDayPlans = (travelPackage: TourPackage): DayPlan[] => {
  const inclusions = toStringList(travelPackage.inclusions);
  const days = Math.max(3, Math.min(6, inclusions.length || 4));
  return Array.from({ length: days }).map((_, index) => {
    const day = index + 1;
    const focus = inclusions[index] ?? (day === 1 ? 'Arrival and local orientation' : day === days ? 'Leisure and departure' : 'Guided activities and local exploration');
    return {
      day,
      title: day === 1 ? `Arrival in ${travelPackage.destination}` : day === days ? 'Departure Day' : `Explore Day ${day}`,
      details: focus
    };
  });
};

const buildReviews = (travelPackage: TourPackage): ReviewItem[] => [
  {
    id: `${travelPackage.id}-r1`,
    name: 'Aarav S.',
    rating: 5,
    text: `Great package planning for ${travelPackage.destination}. The day-wise schedule was clear and super easy to follow.`
  },
  {
    id: `${travelPackage.id}-r2`,
    name: 'Neha P.',
    rating: 4.8,
    text: 'Hotel check-in and local transfers were smooth. Perfect if you want a low-stress trip with good value.'
  },
  {
    id: `${travelPackage.id}-r3`,
    name: 'Rohan M.',
    rating: 4.7,
    text: 'Loved the itinerary balance of sightseeing and free time. Support team was responsive during travel.'
  }
];

const getPackageHighlights = (travelPackage: TourPackage) => {
  const highlights = [
    travelPackage.durationDays ? `${travelPackage.durationDays} Days` : 'Flexible Duration',
    travelPackage.theme ?? 'Curated Experience',
    travelPackage.transportMode ?? 'Stay + Transfers'
  ];

  return highlights.filter(Boolean).slice(0, 3);
};

const PackageDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [travelPackage, setTravelPackage] = React.useState<TourPackage | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [activeImage, setActiveImage] = React.useState(0);

  React.useEffect(() => {
    const loadPackage = async () => {
      if (!id) return;
      setLoading(true);
      setError('');
      try {
        const data = await packageApi.getPackageById(id);
        setTravelPackage(data ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load package details');
      } finally {
        setLoading(false);
      }
    };
    void loadPackage();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8faf7] flex items-center justify-center">
        <div className="w-20 h-20 rounded-full border-4 border-slate-100 border-t-brand-accent animate-spin" />
      </div>
    );
  }

  if (!travelPackage || error) {
    return (
      <div className="min-h-screen bg-[#f8faf7] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-2xl font-display font-bold text-slate-900 uppercase tracking-tight">Package not found</p>
        <p className="text-slate-500">{error || 'The requested package is unavailable.'}</p>
        <button
          onClick={() => navigate('/tours')}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white hover:bg-brand-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to packages
        </button>
      </div>
    );
  }

  const images = travelPackage.images?.length ? travelPackage.images : fallbackImages;
  const inclusions = toStringList(travelPackage.inclusions);
  const dayPlans = buildDayPlans(travelPackage);
  const reviews = buildReviews(travelPackage);
  const highlights = getPackageHighlights(travelPackage);
  const travelDate = new Date();
  travelDate.setDate(travelDate.getDate() + 1);
  const travelDateIso = travelDate.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-[#f8faf7] pb-20">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 space-y-10">
        <button
          onClick={() => navigate('/tours')}
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to tours
        </button>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-7 space-y-4">
            <div className="relative h-110 rounded-[36px] overflow-hidden border border-slate-100 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)]">
              <img src={images[activeImage]} alt={travelPackage.name} className="w-full h-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-linear-to-t from-slate-950/75 via-slate-900/10 to-transparent text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/70">Package destination</p>
                <p className="text-3xl font-display font-bold uppercase tracking-tight">{travelPackage.destination}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {images.slice(0, 3).map((image, index) => (
                <button
                  key={image}
                  onClick={() => setActiveImage(index)}
                  className={`h-24 rounded-2xl overflow-hidden border ${activeImage === index ? 'border-brand-accent' : 'border-slate-100'}`}
                >
                  <img src={image} alt={`${travelPackage.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="xl:col-span-5 bg-white rounded-[36px] border border-slate-100 p-8 shadow-sm space-y-7">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.26em] text-emerald-700">
                <CalendarDays className="w-4 h-4" />
                Trip planner ready
              </div>
              <h1 className="text-4xl font-display font-bold text-slate-900 uppercase tracking-tight">{travelPackage.name}</h1>
              <div className="flex items-center gap-2 text-slate-500">
                <MapPin className="w-4 h-4 text-brand-accent" />
                <span>{travelPackage.destination}</span>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed">
              {travelPackage.description || 'Curated package with complete travel flow including stay planning, transport handoff, and guided day schedule.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">Rating</p>
                <p className="mt-2 flex items-center gap-2 text-lg font-bold text-slate-900">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  {typeof travelPackage.rating === 'number' ? travelPackage.rating.toFixed(1) : '4.8'}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">Reviews</p>
                <p className="mt-2 text-lg font-bold text-slate-900">{typeof travelPackage.reviewCount === 'number' ? `${travelPackage.reviewCount}+` : '240+'}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">Start point</p>
                <p className="mt-2 text-lg font-bold text-slate-900 truncate">{travelPackage.startPoint ?? 'Flexible pickup'}</p>
              </div>
            </div>

            {highlights.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {highlights.map((highlight, index) => (
                  <span key={`${highlight}-${index}`} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-600">
                    <Clock3 className="w-3.5 h-3.5 text-brand-accent" />
                    {highlight}
                  </span>
                ))}
              </div>
            )}

            <div className="rounded-3xl bg-slate-950 text-white p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/70">Package price</p>
              <div className="mt-2 flex items-center gap-2 text-4xl font-display font-bold">
                <IndianRupee className="w-8 h-8 text-brand-accent" />
                {Number(travelPackage.price).toLocaleString('en-IN')}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/checkout?type=package&packageId=${encodeURIComponent(travelPackage.id)}&travelDate=${travelDateIso}`)}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white hover:bg-brand-accent transition-colors"
              >
                Book package
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/planner')}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Ask AI for this trip
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-8">
          <div className="bg-white rounded-4xl border border-slate-100 p-8">
            <h2 className="text-2xl font-display font-bold text-slate-900 uppercase tracking-tight mb-6">Day-wise itinerary</h2>
            <div className="space-y-4">
              {dayPlans.map((plan) => (
                <motion.div
                  key={plan.day}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-accent">Day {plan.day}</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">{plan.title}</p>
                  <p className="mt-2 text-slate-600">{plan.details}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-4xl border border-slate-100 p-8">
            <h2 className="text-2xl font-display font-bold text-slate-900 uppercase tracking-tight mb-6">Guest reviews</h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-2xl border border-slate-100 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold text-slate-900">{review.name}</p>
                    <div className="inline-flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-amber-500" />
                      <span className="font-bold text-sm">{review.rating}</span>
                    </div>
                  </div>
                  <p className="mt-2 text-slate-600">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white rounded-4xl border border-slate-100 p-8">
            <h3 className="text-xl font-display font-bold text-slate-900 uppercase tracking-tight mb-5">Included services</h3>
            <div className="space-y-3">
              {(inclusions.length ? inclusions : ['Hotel stay', 'Daily breakfast', 'Airport transfer', 'Local support']).map((item, index) => (
                <div key={`${item}-${index}`} className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 text-sm font-medium text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-4xl border border-slate-100 p-8 space-y-4">
            <h3 className="text-xl font-display font-bold text-slate-900 uppercase tracking-tight">Transport and stay</h3>
            <div className="rounded-2xl border border-slate-100 p-4 flex items-start gap-3">
              <Hotel className="w-5 h-5 mt-0.5 text-brand-accent" />
              <div>
                <p className="font-bold text-slate-900">Hotel</p>
                <p className="text-sm text-slate-600">Curated 3-4 star stay near city center with flexible check-in support.</p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 p-4 flex items-start gap-3">
              <Bus className="w-5 h-5 mt-0.5 text-brand-accent" />
              <div>
                <p className="font-bold text-slate-900">Bus transfers</p>
                <p className="text-sm text-slate-600">Optional inter-city and sightseeing buses arranged as per itinerary day.</p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 p-4 flex items-start gap-3">
              <Train className="w-5 h-5 mt-0.5 text-brand-accent" />
              <div>
                <p className="font-bold text-slate-900">Train options</p>
                <p className="text-sm text-slate-600">Best-value train alternatives available if you prefer lower-cost travel.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PackageDetail;
