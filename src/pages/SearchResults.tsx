import React from 'react';
import { 
  Search, 
  Filter, 
  Map as MapIcon, 
  List, 
  Star, 
  MapPin, 
  Wifi, 
  Coffee, 
  Wind, 
  ChevronDown, 
  ArrowUpDown,
  Share2,
  Heart,
  LayoutGrid,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { propertyApi, Property } from '../services/propertyApi';

const SearchResults: React.FC = () => {
  const navigate = useNavigate();
  const [likedItems, setLikedItems] = React.useState<string[]>([]);
  const [sortBy, setSortBy] = React.useState('Recommended');

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const [results, setResults] = React.useState<Property[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      const data = await propertyApi.getProperties();
      setResults(data);
      setLoading(false);
    };
    fetchProperties();
  }, []);

  const filterDropdowns = ['Price', 'Rating', 'Distance', 'Amenities'];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 overflow-hidden">
      {/* Search Header - Refined Premium Look */}
      <div className="bg-white border-b border-slate-100 px-4 md:px-6 py-6 md:py-8 sticky top-16 z-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 relative z-10">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-brand-primary rounded-[20px] md:rounded-[28px] flex items-center justify-center text-white shadow-xl shadow-brand-primary/20">
                <Search className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>
                  <h1 className="text-xl md:text-3xl font-display font-bold text-slate-900 uppercase tracking-tight">Bangalore, IN</h1>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">340+ STAYS • OCT 24 - OCT 31 • 1 TRAVELER</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="text-right">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Showing</p>
                 <p className="text-lg font-display font-bold text-slate-900 tracking-tight uppercase">340+ <span className="text-brand-accent">Sanctuaries</span></p>
               </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex items-center justify-between gap-6 overflow-x-auto scrollbar-hide pb-2">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-3 px-6 md:px-8 py-4 bg-slate-900 text-white rounded-[20px] text-[10px] font-bold tracking-[0.2em] uppercase shadow-2xl active:scale-95 transition-all">
                <Filter className="w-4 h-4 text-brand-accent" />
                Filters
              </button>
              <div className="h-8 w-[1px] bg-slate-100 hidden md:block mx-2"></div>
              {filterDropdowns.map((dropdown, idx) => (
                <button 
                  key={idx}
                  onClick={() => alert(`Opening ${dropdown} filter...`)}
                  className="flex items-center gap-3 px-6 md:px-8 py-4 bg-white border border-slate-100 rounded-[20px] text-[10px] font-bold text-slate-500 hover:bg-slate-50 hover:border-brand-accent/30 transition-all whitespace-nowrap uppercase tracking-[0.2em]"
                >
                  {dropdown}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => setSortBy(prev => prev === 'Recommended' ? 'Price: Low to High' : 'Recommended')}
              className="hidden lg:flex items-center gap-3 text-[10px] font-bold text-slate-900 hover:text-brand-accent transition-colors uppercase tracking-[0.2em]"
            >
              <ArrowUpDown className="w-4 h-4 text-brand-accent" />
              Sort: {sortBy}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-slate-50">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1440px] mx-auto">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[500px] bg-white rounded-[32px] md:rounded-[48px] animate-pulse border border-slate-100"></div>
              ))
            ) : (
              results.map((item, idx) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  className="bg-white rounded-[32px] md:rounded-[48px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-700 border border-slate-100 flex flex-col group cursor-pointer relative"
                  onClick={() => navigate(`/property/${item.id}`)}
                >
                  <div className="h-[240px] md:h-[280px] overflow-hidden relative">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
                    
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                      <div className="bg-brand-accent text-white px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-xl border border-white/20">
                        Sanctuary
                      </div>
                      <div className="bg-white/10 backdrop-blur-xl text-white px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-lg border border-white/20">
                        {item.category}
                      </div>
                    </div>

                    <button 
                      onClick={(e) => toggleLike(e, item.id)}
                      className={`absolute top-6 right-6 w-10 h-10 backdrop-blur-xl border border-white/20 rounded-full transition-all shadow-xl flex items-center justify-center group/heart ${likedItems.includes(item.id) ? 'bg-rose-500 text-white' : 'bg-white/10 text-white hover:bg-rose-500'}`}
                    >
                      <Heart className={`w-4 h-4 transition-all ${likedItems.includes(item.id) ? 'fill-white' : ''}`} />
                    </button>

                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-white/80 text-[8px] font-bold uppercase tracking-widest">
                          <MapPin className="w-3 h-3 text-brand-accent" />
                          {item.location.split(',')[0]}
                        </div>
                        <h3 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight leading-none">{item.name}</h3>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 flex flex-col justify-between gap-6 h-full font-sans">
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-1.5">
                        {item.amenities.slice(0, 3).map((amenity, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                            <CheckCircle2 className="w-2.5 h-2.5 text-brand-accent" />
                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Starting From</div>
                          <div className="text-xl font-display font-bold text-slate-900 leading-none">₹{(item.price * 84).toLocaleString()}<span className="text-slate-400 text-[10px] font-serif italic ml-1 lowercase">/night</span></div>
                        </div>
                        <div className="w-[1px] h-6 bg-slate-100 mx-2"></div>
                        <div className="flex items-center gap-1 text-slate-900 font-bold text-xs">
                          <Star className="w-3.5 h-3.5 fill-brand-accent text-brand-accent" />
                          {item.rating}
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-brand-accent transition-all shadow-xl active:scale-90 duration-500">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Pagination/Load More */}
          <div className="py-20 flex flex-col items-center gap-6">
             <div className="w-24 h-px bg-slate-200"></div>
             <button 
               onClick={() => alert('Fetching more premium sanctuaries for you...')}
               className="px-12 py-5 border border-slate-200 rounded-[28px] text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-95"
             >
               Discover More Results
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
