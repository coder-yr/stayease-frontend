import React from 'react';
import { 
  Plane, 
  Filter, 
  ChevronDown, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { flightApi, Flight, SearchParams } from '../services/flightApi';
import { useLocation, useNavigate } from 'react-router-dom';
import FlightCard from '../components/FlightCard';

const FlightResults: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParamsState = location.state as SearchParams;

  const [flights, setFlights] = React.useState<Flight[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Filter & Sort State
  const [activeStops, setActiveStops] = React.useState<string[]>([]);
  const [activeTimes, setActiveTimes] = React.useState<string[]>([]);
  const [activeAirlines, setActiveAirlines] = React.useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = React.useState<Record<string, string>>({});
  const [showSortDropdown, setShowSortDropdown] = React.useState(false);
  const [showMobileFilter, setShowMobileFilter] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<'price' | 'duration'>('price');

  const resetFilters = () => {
    setActiveStops([]);
    setActiveTimes([]);
    setActiveAirlines([]);
  };

  const filteredFlights = flights
    .filter(flight => {
      const stopMatch = activeStops.length === 0 || activeStops.includes(flight.stops);
      const airlineMatch = activeAirlines.length === 0 || activeAirlines.includes(flight.airline);
      return stopMatch && airlineMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'price') {
        return parseInt(a.price.replace(/[^\d]/g, '')) - parseInt(b.price.replace(/[^\d]/g, ''));
      }
      if (sortBy === 'duration') {
        const getMins = (d: string) => {
          const parts = d.match(/\d+/g);
          if (!parts) return 0;
          return parts.length === 2 ? parseInt(parts[0]) * 60 + parseInt(parts[1]) : parseInt(parts[0]);
        };
        return getMins(a.duration) - getMins(b.duration);
      }
      return 0;
    });

  const params: SearchParams = searchParamsState || {
    origin: 'Bengaluru (BLR)',
    destination: 'Mumbai (BOM)',
    date: '24 Oct, 2024',
    adults: 1,
    class: 'Economy'
  };

  React.useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await flightApi.searchFlights(params);
        setFlights(results);
      } catch (err) {
        setError('Failed to fetch real-time flight data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [location.state]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Premium Search Recap Header */}
      <div className="bg-gradient-to-br from-slate-900 via-brand-primary to-slate-900 text-white pt-24 md:pt-40 pb-16 md:pb-24 px-4 md:px-6 sticky top-16 z-30 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-3/4 h-full opacity-5 pointer-events-none hidden md:block">
          <Plane className="w-[1200px] h-full rotate-45 transform translate-x-1/3 -translate-y-1/4 mix-blend-overlay" />
        </div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>
        <div className="absolute -left-64 -top-64 w-[500px] h-[500px] bg-brand-accent/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col gap-10 md:gap-14">
            <div className="space-y-6 md:space-y-8">
              
              {/* Trip Details Badge */}
              <div className="flex items-center gap-3 md:gap-4 scrollbar-hide overflow-x-auto whitespace-nowrap bg-white/5 backdrop-blur-md border border-white/10 w-max px-6 py-3 rounded-full shadow-xl">
                <span className="text-[10px] md:text-xs font-bold text-brand-accent uppercase tracking-[0.2em]">
                  {params.tripType === 'one' ? 'One Way' : 'Round Trip'}
                </span>
                <span className="w-1.5 h-1.5 bg-white/30 rounded-full shrink-0"></span>
                <span className="text-[10px] md:text-xs font-bold text-white/80 uppercase tracking-widest">{params.date}</span>
                <span className="w-1.5 h-1.5 bg-white/30 rounded-full shrink-0"></span>
                <span className="text-[10px] md:text-xs font-bold text-white/80 uppercase tracking-widest">{params.adults} Traveler{params.adults > 1 ? 's' : ''}</span>
                <span className="w-1.5 h-1.5 bg-white/30 rounded-full shrink-0"></span>
                <span className="text-[10px] md:text-xs font-bold text-white/80 uppercase tracking-widest">{params.class}</span>
              </div>
              
              {/* Massive City Typography */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-16">
                <div className="space-y-2">
                  <p className="hidden md:block text-[11px] font-bold text-brand-accent uppercase tracking-[0.4em] drop-shadow-sm">Departure</p>
                  <h1 className="text-5xl md:text-[100px] font-display font-bold uppercase tracking-tighter leading-none drop-shadow-xl text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">
                    {params.origin.match(/\(([^)]+)\)/)?.[1] || params.origin.substring(0,3).toUpperCase()}
                  </h1>
                  <p className="md:hidden text-[9px] font-bold text-brand-accent uppercase tracking-[0.3em] mt-2">{params.origin.split(' (')[0]}</p>
                  <p className="hidden md:block text-sm font-medium text-white/60 mt-2 font-serif italic">{params.origin.split(' (')[0]}</p>
                </div>
                
                {/* Flight Path Indicator */}
                <div className="flex flex-row md:flex-col items-center gap-4 flex-1 md:flex-none w-full md:w-auto opacity-70">
                  <div className="w-full md:w-[2px] h-[2px] md:h-24 bg-gradient-to-r md:bg-gradient-to-b from-transparent via-white/40 to-transparent relative">
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-brand-accent shadow-[0_0_20px_rgba(var(--brand-accent-rgb),0.8)] animate-pulse"></div>
                  </div>
                  <Plane className="w-6 h-6 text-brand-accent rotate-90 md:rotate-180 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] hidden md:block" />
                </div>
                
                <div className="space-y-2 text-right md:text-left ml-auto md:ml-0">
                  <p className="hidden md:block text-[11px] font-bold text-brand-accent uppercase tracking-[0.4em] drop-shadow-sm">Destination</p>
                  <h1 className="text-5xl md:text-[100px] font-display font-bold uppercase tracking-tighter leading-none drop-shadow-xl text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">
                    {params.destination.match(/\(([^)]+)\)/)?.[1] || params.destination.substring(0,3).toUpperCase()}
                  </h1>
                  <p className="md:hidden text-[9px] font-bold text-brand-accent uppercase tracking-[0.3em] mt-2">{params.destination.split(' (')[0]}</p>
                  <p className="hidden md:block text-sm font-medium text-white/60 mt-2 font-serif italic">{params.destination.split(' (')[0]}</p>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 py-12 md:py-20 flex flex-col lg:grid lg:grid-cols-12 gap-10 md:gap-16">
        
        <div className="lg:hidden fixed bottom-24 right-6 z-40">
            <button 
            className="flex items-center gap-3 bg-brand-primary text-white px-6 py-4 rounded-full shadow-2xl border border-white/10 active:scale-95 transition-transform"
            onClick={() => setShowMobileFilter(true)}
            aria-label="Open flight filters"
          >
            <Filter className="w-5 h-5 text-brand-accent" aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase tracking-widest tracking-[0.2em]">Filters</span>
          </button>
        </div>

        {/* Filters Sidebar — desktop always visible, mobile controlled via state */}
        {(showMobileFilter || true) && (
        <div
          id="filter-section"
          className={`lg:col-span-3 ${
            showMobileFilter
              ? 'fixed inset-0 z-[60] flex items-end lg:items-start lg:relative lg:inset-auto'
              : 'hidden lg:block'
          }`}
        >
          {/* Mobile backdrop */}
          {showMobileFilter && (
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setShowMobileFilter(false)}
              aria-hidden="true"
            />
          )}
          <div className="relative w-full lg:w-auto bg-white rounded-t-3xl lg:rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-10 max-h-[85vh] overflow-y-auto lg:max-h-none lg:overflow-visible">
            <div className="flex items-center justify-between pb-6 border-b border-slate-50">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                <Filter className="w-4 h-4 text-brand-accent" />
                Refine
              </h2>
              <div className="flex gap-4 items-center">
                <button 
                  onClick={resetFilters}
                  className="text-[10px] font-bold text-brand-accent uppercase tracking-widest hover:text-brand-primary transition-colors"
                  aria-label="Reset all filters"
                >
                  Reset
                </button>
                <button
                  className="lg:hidden w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
                  onClick={() => setShowMobileFilter(false)}
                  aria-label="Close filters"
                >
                  &times;
                </button>
              </div>
            </div>

            <div className="space-y-10">
              <div className="space-y-5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Stops</label>
                <div className="space-y-3">
                  {['Non-stop', '1 Stop', '2+ Stops'].map((stop, idx) => (
                    <label key={idx} className="flex items-center justify-between group cursor-pointer p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{stop}</span>
                      <div className="relative w-5 h-5">
                        <input 
                          type="checkbox" 
                          checked={activeStops.includes(stop)}
                          onChange={() => {
                            setActiveStops(prev => prev.includes(stop) ? prev.filter(s => s !== stop) : [...prev, stop]);
                          }}
                          className="peer absolute inset-0 opacity-0 cursor-pointer" 
                        />
                        <div className="w-5 h-5 rounded-md border-2 border-slate-200 peer-checked:border-brand-accent peer-checked:bg-brand-accent transition-all flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-5 pt-8 border-t border-slate-50">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Airlines</label>
                <div className="space-y-3">
                  {['Air India', 'IndiGo', 'Vistara', 'Akasa Air'].map((airline, idx) => (
                    <label key={idx} className="flex items-center justify-between group cursor-pointer p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{airline}</span>
                      <div className="relative w-5 h-5">
                        <input 
                          type="checkbox" 
                          checked={activeAirlines.includes(airline)}
                          onChange={() => {
                            setActiveAirlines(prev => prev.includes(airline) ? prev.filter(a => a !== airline) : [...prev, airline]);
                          }}
                          className="peer absolute inset-0 opacity-0 cursor-pointer" 
                        />
                        <div className="w-5 h-5 rounded-md border-2 border-slate-200 peer-checked:border-brand-accent peer-checked:bg-brand-accent transition-all flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Results List */}
        <div className="lg:col-span-9 space-y-8 md:space-y-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-2 gap-4 bg-white/50 backdrop-blur-md p-4 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-accent animate-pulse shadow-[0_0_10px_rgba(var(--brand-accent-rgb),0.6)]"></div>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-[0.2em]">{filteredFlights.length} <span className="text-slate-400 font-medium">Flights Found</span></span>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
              <span className="hidden md:inline text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Sort</span>
              <div className="flex p-1 bg-slate-50 rounded-full border border-slate-100">
                <button 
                  onClick={() => setSortBy('price')}
                  className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${sortBy === 'price' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  Cheapest
                </button>
                <button 
                  onClick={() => setSortBy('duration')}
                  className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${sortBy === 'duration' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  Fastest
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6 md:space-y-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-8">
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin"></div>
                  <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-brand-accent animate-pulse" />
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-display font-bold text-slate-900 uppercase tracking-widest">Searching Skies</h3>
                  <p className="text-sm font-serif italic text-slate-400">Fetching live availability and premium rates...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-white rounded-[40px] p-12 border border-rose-100 flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-rose-500" />
                </div>
                <h3 className="text-2xl font-display font-bold text-slate-900 uppercase tracking-tight">Search Interrupted</h3>
                <p className="text-slate-500 font-serif italic max-w-sm">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-accent transition-all"
                >
                  Retry Search
                </button>
              </div>
            ) : filteredFlights.length === 0 ? (
              <div className="bg-white rounded-[40px] p-12 border border-slate-100 flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center">
                  <Plane className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-2xl font-display font-bold text-slate-900 uppercase tracking-tight">No Flights Found</h3>
                <p className="text-slate-500 font-serif italic max-w-sm">Try adjusting your filters to see more results.</p>
                <button onClick={resetFilters} className="text-brand-accent font-bold text-[10px] uppercase tracking-widest border-b border-brand-accent pb-1">Clear Filters</button>
              </div>
            ) : (
              filteredFlights.map((flight, idx) => (
                <FlightCard 
                  key={flight.id}
                  flight={flight}
                  index={idx}
                  onClick={() => navigate('/flights/booking', { state: { flight } })}
                />
              ))
            )}
          </div>

          {/* Special Note */}
          <div className="py-12 md:py-20 flex flex-col items-center text-center space-y-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 md:w-10 md:h-10 text-slate-300" />
            </div>
            <h3 className="text-xl md:text-2xl font-display font-bold text-slate-900 uppercase tracking-tight">Need a Group Booking?</h3>
            <p className="text-slate-400 font-serif italic text-base md:text-lg max-w-sm px-6">
              Our travel specialists can help you find special rates for 10+ travelers.
            </p>
            <button 
              onClick={() => alert('Our Concierge team will contact you shortly to assist with your group booking.')}
              className="px-10 py-4 bg-white border border-slate-100 rounded-2xl text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95"
            >
              Contact Concierge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightResults;
