import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bus as BusIcon, ArrowRight, MapPin, Calendar, Clock, Search, Filter, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { busApi, Bus } from '../services/busApi';

const Buses: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { source?: string; destination?: string; date?: string } | undefined;

  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [searchParams, setSearchParams] = useState({
    source: state?.source || 'Delhi',
    destination: state?.destination || 'Manali',
    date: state?.date || '2026-10-24'
  });

  const handleSearch = async () => {
    setLoading(true);
    const results = await busApi.searchBuses(searchParams.source, searchParams.destination);
    setBuses(results);
    setLoading(false);
  };

  useEffect(() => {
    if (state?.source || state?.destination) {
      handleSearch();
    } else {
      handleSearch();
    }
  }, [state]);

  const handleBook = (bus: Bus) => {
    navigate('/buses/book', { state: { bus, ...searchParams } });
  };

  return (
    <div className="min-h-screen bg-brand-bg pt-20 pb-32">
      {/* Editorial Header */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <span className="micro-label mb-4 block">Premium Coach Travel</span>
          <h1 className="editorial-title text-brand-primary mb-2">
            Highway <span className="serif-italic editorial-skew inline-block text-brand-accent">Serenity</span>
          </h1>
          <p className="font-serif italic text-xl text-brand-primary/60 max-w-xl">
            Luxury on the road. Experience the convenience of private travel with the elegance of a boutique hotel.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* Search Bar - Premium Glassmorphism */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-[40px] p-4 lg:p-6 shadow-2xl shadow-brand-primary/10 relative z-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2 px-4 border-r border-slate-100 last:border-0">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Origin</label>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-brand-accent" />
                <input 
                  type="text" 
                  value={searchParams.source}
                  onChange={e => setSearchParams(p => ({ ...p, source: e.target.value }))}
                  className="w-full bg-transparent border-none font-display font-semibold text-brand-primary outline-none focus:ring-0 placeholder:text-slate-300"
                  placeholder="From?"
                />
              </div>
            </div>

            <div className="space-y-2 px-4 border-r border-slate-100 last:border-0">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Destination</label>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-brand-accent" />
                <input 
                  type="text" 
                  value={searchParams.destination}
                  onChange={e => setSearchParams(p => ({ ...p, destination: e.target.value }))}
                  className="w-full bg-transparent border-none font-display font-semibold text-brand-primary outline-none focus:ring-0 placeholder:text-slate-300"
                  placeholder="To?"
                />
              </div>
            </div>

            <div className="space-y-2 px-4 border-r border-slate-100 last:border-0">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Date of Travel</label>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-brand-accent" />
                <input 
                  type="text" 
                  value={searchParams.date}
                  onChange={e => setSearchParams(p => ({ ...p, date: e.target.value }))}
                  className="w-full bg-transparent border-none font-display font-semibold text-brand-primary outline-none focus:ring-0"
                />
              </div>
            </div>

            <button 
              onClick={handleSearch}
              className="bg-brand-primary hover:bg-brand-accent text-white py-4 px-8 rounded-3xl font-display font-bold transition-all duration-500 shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-3 group"
            >
              <Search className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span>SEARCH BUSES</span>
            </button>
          </div>
        </motion.div>

        {/* Results Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar / Filters */}
          <div className="hidden lg:block space-y-8">
            <div className="space-y-4">
              <h4 className="text-sm uppercase tracking-widest text-brand-primary/40 font-bold flex items-center gap-2">
                <Filter className="w-4 h-4" /> Amenities
              </h4>
              <div className="space-y-3">
                {['Volvo Multi-Axle', 'AC Sleeper', 'WiFi Enabled', 'Water Bottle', 'Charging Point'].map(filter => (
                  <label key={filter} className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-5 h-5 rounded-md border-2 border-slate-200 group-hover:border-brand-accent transition-colors flex items-center justify-center text-white text-[10px]">
                      <div className="w-full h-full rounded-md bg-brand-accent opacity-0 group-hover:opacity-10 scale-0 group-hover:scale-100 transition-all" />
                    </div>
                    <span className="text-xs font-medium text-slate-600 group-hover:text-brand-primary transition-colors">{filter}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Main Results */}
          <div className="lg:col-span-3 space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-6">
              <h2 className="text-2xl font-display font-bold text-brand-primary">
                {loading ? 'Finding Coaches...' : `${buses.length} Curated Departures`}
              </h2>
            </div>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-48 rounded-[32px] bg-slate-100 animate-pulse" />
                  ))}
                </motion.div>
              ) : buses.length > 0 ? (
                <div className="grid gap-6">
                  {buses.map((bus, idx) => (
                    <motion.div 
                      key={bus.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="glass-card hover:bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group flex flex-col md:flex-row items-center gap-10"
                    >
                      {/* Operator Icon */}
                      <div className="flex items-center gap-6 w-full md:w-56 shrink-0 relative">
                        <div className="w-16 h-16 bg-brand-bg text-brand-accent rounded-3xl flex items-center justify-center group-hover:bg-brand-accent group-hover:text-white transition-colors duration-500 shadow-inner">
                          <BusIcon className="w-8 h-8" />
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-brand-primary text-xl leading-tight group-hover:text-brand-accent transition-colors">{bus.operator}</h4>
                          <div className="flex items-center gap-2 mt-1">
                             <ShieldCheck className="w-3 h-3 text-brand-accent" />
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{bus.busType || 'Luxury AC'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Journey Visualization */}
                      <div className="flex-1 flex items-center justify-between w-full">
                        <div className="text-left w-28">
                          <div className="text-3xl font-display font-bold text-brand-primary tracking-tight">
                            {new Date(bus.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">{bus.source}</div>
                        </div>

                        <div className="flex-1 px-8 flex flex-col items-center relative group/journey">
                          <div className="text-[10px] font-bold text-brand-accent mb-3 uppercase tracking-widest opacity-80">{bus.duration || 'Scenic Route'}</div>
                          <div className="w-full h-[2px] bg-slate-100 relative mb-4">
                             <div className="absolute top-0 left-0 h-full w-0 bg-brand-accent group-hover:w-full transition-all duration-1000" />
                             <span className="absolute -top-[3px] w-2 h-2 rounded-full bg-slate-200 left-0 shadow-sm" />
                             <span className="absolute -top-[3px] w-2 h-2 rounded-full bg-slate-200 right-0 shadow-sm" />
                          </div>
                          <div className="flex items-center gap-3 text-slate-300">
                             <Clock className="w-3 h-3" />
                             <span className="text-[9px] font-bold uppercase tracking-widest">Timely Departure</span>
                          </div>
                        </div>

                        <div className="text-right w-28">
                          <div className="text-3xl font-display font-bold text-brand-primary tracking-tight">
                            {new Date(bus.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">{bus.destination}</div>
                        </div>
                      </div>

                      {/* Pricing & Booking */}
                      <div className="w-full md:w-56 shrink-0 flex flex-col items-center md:items-end gap-6 md:pl-10 border-t md:border-t-0 md:border-l border-slate-100 pt-8 md:pt-0">
                        <div className="text-center md:text-right">
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Standard Fare</div>
                          <div className="text-4xl font-display font-extrabold text-brand-primary flex items-baseline gap-1">
                            <span className="text-lg font-bold text-brand-accent">₹</span>
                            {Number(bus.price).toLocaleString()}
                          </div>
                        </div>
                        <button 
                          onClick={() => handleBook(bus)}
                          className="w-full py-4 bg-brand-primary hover:bg-brand-accent text-white rounded-2xl font-display font-bold text-xs uppercase tracking-[0.2em] transition-all duration-500 shadow-xl shadow-brand-primary/10 flex items-center justify-center gap-3"
                        >
                          Select Seat <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/50 backdrop-blur-sm p-20 rounded-[48px] border border-dashed border-slate-200 text-center space-y-6"
                >
                  <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-[32px] flex items-center justify-center mx-auto transition-transform hover:scale-110">
                    <BusIcon className="w-12 h-12" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-display font-bold text-brand-primary">No coaches scheduled</h3>
                    <p className="text-slate-500 font-serif italic text-lg max-w-md mx-auto">
                      All seats for this route may be reserved. Try an alternative date or nearby destination.
                    </p>
                  </div>
                  <button className="text-brand-accent font-bold uppercase text-[10px] tracking-[0.3em] hover:text-brand-primary transition-colors">
                    Check Nearby Hubs &rarr;
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buses;
