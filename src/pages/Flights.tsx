import React from 'react';
import { 
  Plane, 
  ShieldCheck,
  Zap,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { flightApi, FeaturedDeal, SearchParams } from '../services/flightApi';
import HeroSection from '../components/HeroSection';
import FlightSearchCard from '../components/FlightSearchCard';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } }
};

const Flights: React.FC = () => {
  const navigate = useNavigate();
  const [featuredDeals, setFeaturedDeals] = React.useState<FeaturedDeal[]>([]);
  const [loadingDeals, setLoadingDeals] = React.useState(true);

  React.useEffect(() => {
    const fetchDeals = async () => {
      setLoadingDeals(true);
      const deals = await flightApi.getFeaturedDeals();
      setFeaturedDeals(deals);
      setLoadingDeals(false);
    };
    fetchDeals();
  }, []);

  const handleSearch = (params: SearchParams) => {
    navigate('/flights/results', { 
      state: { 
        ...params,
        origin: params.origin, 
        destination: params.destination, 
        date: params.date,
        tripType: params.tripType,
        class: params.class,
        adults: params.adults
      } 
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfcfb]">
      {/* Hero Section */}
      <HeroSection 
        label="Premium Air Travel"
        title={<>Skyward <span className="text-brand-accent italic serif-italic">Bound.</span></>}
        subtitle="Elevate your journey with curated flights and seamless transitions between skies and soil."
        background={
          <>
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-50 rounded-full blur-[120px] -mr-64 -mt-64 opacity-60"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-50 rounded-full blur-[100px] -ml-64 -mb-64 opacity-60"></div>
          </>
        }
      >
        <FlightSearchCard 
          onSearch={handleSearch}
          initialParams={{
            origin: 'Bengaluru (BLR)',
            destination: 'London (LHR)',
            date: '12 Nov, 2024',
            class: 'Economy',
            adults: 1,
            tripType: 'round'
          }}
        />
      </HeroSection>

      {/* Featured Flights */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="micro-label">Weekly Highlights</span>
                <span className="h-px w-12 bg-emerald-200"></span>
              </div>
              <h2 className="text-5xl font-display font-bold text-slate-900 uppercase tracking-tighter leading-none">
                Autumn <span className="text-brand-accent italic serif-italic">Pathways</span>
              </h2>
            </div>
            <p className="text-slate-400 font-serif italic text-lg max-w-xs">
              Hand-picked routes for the discerning traveler, starting from your city.
            </p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {loadingDeals ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-80 bg-slate-100 rounded-[56px] animate-pulse"></div>
              ))
            ) : (
              featuredDeals.map((deal, idx) => (
                <motion.div 
                  key={idx}
                  variants={fadeUpItem}
                  whileHover={{ y: -12, scale: 1.02 }}
                  onClick={() => navigate('/flights/results', { state: { origin: deal.from, destination: deal.to, date: deal.date, tripType: 'one', class: 'Economy', adults: 1 }})}
                  className="bg-white rounded-[56px] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-100 group cursor-pointer"
                >
                  <div className="h-80 overflow-hidden relative">
                    <img 
                      src={deal.image} 
                      alt={deal.to} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end text-white">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">{deal.from} to</p>
                        <h3 className="text-3xl font-display font-bold uppercase tracking-tight">{deal.to}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold opacity-80">{deal.date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                          <Plane className="w-4 h-4 text-brand-accent" />
                        </div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{deal.airline}</span>
                      </div>
                      <div className="text-2xl font-display font-bold text-brand-accent">{deal.price}</div>
                    </div>
                    <button 
                      className="w-full py-4 rounded-2xl border border-slate-100 font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400 group-hover:bg-brand-accent group-hover:text-white group-hover:border-brand-accent transition-all"
                    >
                      View Flight
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 px-4 bg-brand-primary text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20"
          >
            <motion.div variants={fadeUpItem} className="space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-display font-bold uppercase tracking-tight">Flexible Booking</h3>
              <p className="text-white/60 leading-relaxed font-serif italic text-lg">
                Change or cancel your flights with minimal fees. We understand plans can shift.
              </p>
            </motion.div>
            <motion.div variants={fadeUpItem} className="space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-display font-bold uppercase tracking-tight">Instant Perks</h3>
              <p className="text-white/60 leading-relaxed font-serif italic text-lg">
                Unlock exclusive lounge access and priority boarding when you book through StayEase.
              </p>
            </motion.div>
            <motion.div variants={fadeUpItem} className="space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-display font-bold uppercase tracking-tight">Premium Support</h3>
              <p className="text-white/60 leading-relaxed font-serif italic text-lg">
                Concierge flight assistance 24/7 to help you with delays, upgrades, or luggage.
              </p>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Animated Grid Lines */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
      </section>
    </div>
  );
};

export default Flights;
