import React from 'react';
import { 
  Map as MapIcon, 
  MapPin, 
  ChevronDown, 
  ArrowUpDown,
  TrendingUp,
  Map,
  X,
  LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { propertyApi, Property } from '../services/propertyApi';
import HeroSection from '../components/HeroSection';
import PropertyCard from '../components/PropertyCard';
import FilterBar from '../components/FilterBar';
import Breadcrumbs from '../components/Breadcrumbs';

const HotelListings: React.FC = () => {
  const navigate = useNavigate();
  const [likedItems, setLikedItems] = React.useState<string[]>([]);
  const [sortBy, setSortBy] = React.useState('Recommended');
  const [viewMode, setViewMode] = React.useState<'grid' | 'map'>('grid');
  const [allResults, setAllResults] = React.useState<Property[]>([]);
  const [filteredResults, setFilteredResults] = React.useState<Property[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = React.useState<Record<string, string>>({});

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  React.useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      const data = await propertyApi.getProperties();
      setAllResults(data);
      setFilteredResults(data);
      setLoading(false);
    };
    fetchProperties();
  }, []);

  // Filter Logic
  React.useEffect(() => {
    let results = [...allResults];

    if (selectedFilters['Price']) {
        const p = selectedFilters['Price'];
        if (p === 'Under ₹5,000') results = results.filter(h => h.price * 84 < 5000);
        else if (p === '₹5,000 - ₹10,000') results = results.filter(h => h.price * 84 >= 5000 && h.price * 84 <= 10000);
        else if (p === 'Over ₹10,000') results = results.filter(h => h.price * 84 > 10000);
    }

    if (selectedFilters['Star Rating']) {
      // Extract the number from options like '5 Stars', '4 Stars & Up', '3 Stars & Up'
      const ratingMatch = selectedFilters['Star Rating'].match(/^(\d)/);
      const r = ratingMatch ? parseFloat(ratingMatch[1]) : 0;
      results = results.filter(h => h.rating >= r);
    }

    if (selectedFilters['Property Type']) {
        const type = selectedFilters['Property Type'].toLowerCase();
        results = results.filter(h => h.category.toLowerCase().includes(type) || h.name.toLowerCase().includes(type));
    }

    // Sort Logic
    if (sortBy === 'Price: Low to High') {
      results.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price: High to Low') {
      results.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'Rating') {
      results.sort((a, b) => b.rating - a.rating);
    }

    setFilteredResults(results);
  }, [selectedFilters, sortBy, allResults]);

  const filters = [
    { name: 'Price', options: ['Under ₹5,000', '₹5,000 - ₹10,000', 'Over ₹10,000'] },
    // Using numeric string values so parseFloat works cleanly
    { name: 'Star Rating', options: ['5 Stars', '4 Stars & Up', '3 Stars & Up'] },
    { name: 'Property Type', options: ['Hotel', 'Resort', 'Villa', 'Apartment'] },
    { name: 'Amenities', options: ['Pool', 'Spa', 'Gym', 'Free WiFi'] },
  ];

  const breadcrumbs = [
    { label: 'Discovery', path: '/' },
    { label: 'Luxury Sanctuaries', active: true }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB]">
      {/* Premium Header Section */}
      <HeroSection 
        label="Discovery"
        title={<>Curated <span className="text-brand-accent italic serif-italic lowercase">stays</span></>}
        className="bg-white border-b border-slate-100"
        background={
          <>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-accent/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -ml-48 -mb-48"></div>
          </>
        }
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 text-left mt-[-2rem] relative z-20">
          <Breadcrumbs items={breadcrumbs} className="mb-4 md:mb-0" />
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Available Units</p>
              <p className="text-2xl font-display font-bold text-slate-900 tracking-tight uppercase">{filteredResults.length} <span className="text-brand-accent">Verified</span></p>
            </div>
            <button 
              onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
              className="flex items-center gap-3 bg-slate-950 text-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-2xl hover:bg-brand-accent transition-all active:scale-95 border border-white/10"
            >
              {viewMode === 'grid' ? <Map className="w-4 h-4 text-brand-accent" /> : <LayoutGrid className="w-4 h-4 text-brand-accent" />}
              {viewMode === 'grid' ? 'View Map' : 'View Gallery'}
            </button>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 relative z-[100] flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <FilterBar 
            filters={filters}
            selectedFilters={selectedFilters}
            onFilterChange={(name, val) => setSelectedFilters(prev => ({ ...prev, [name]: val }))}
            onReset={() => setSelectedFilters({})}
            className="flex-1"
          />

          <div className="flex items-center gap-8 justify-between lg:justify-end border-t lg:border-t-0 pt-6 lg:pt-0 border-slate-100">
            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <TrendingUp className="w-4 h-4 text-brand-accent" />
              Price Trend: <span className="text-brand-accent text-xs">Low-Med</span>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setActiveDropdown(activeDropdown === 'sort' ? null : 'sort')}
                className="flex items-center gap-3 text-[10px] font-bold text-slate-900 hover:text-brand-accent transition-colors uppercase tracking-widest whitespace-nowrap"
              >
                <ArrowUpDown className="w-4 h-4 text-brand-accent" />
                Sort: {sortBy}
              </button>

              <AnimatePresence>
                {activeDropdown === 'sort' && (
                  <>
                    <div className="fixed inset-0 z-[90]" onClick={() => setActiveDropdown(null)}></div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-4 w-64 bg-slate-900 text-white border border-slate-800 rounded-[32px] shadow-3xl z-[300] p-6 space-y-2"
                    >
                      {['Recommended', 'Price: Low to High', 'Price: High to Low', 'Rating'].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => {
                            setSortBy(opt);
                            setActiveDropdown(null);
                          }}
                          className={`w-full text-left px-5 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${sortBy === opt ? 'bg-brand-accent text-white shadow-xl shadow-brand-accent/20' : 'hover:bg-white/10 text-slate-300 transition-colors'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </HeroSection>

      {/* Results Section */}
      <section className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 py-20">
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
            >
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-[550px] bg-white rounded-[48px] animate-pulse border border-slate-100 shadow-sm"></div>
                ))
              ) : filteredResults.length > 0 ? (
                filteredResults.map((hotel, idx) => (
                  <PropertyCard 
                    key={hotel.id}
                    property={hotel}
                    index={idx}
                    isLiked={likedItems.includes(hotel.id)}
                    onLike={toggleLike}
                    onClick={(id) => navigate(`/property/${id}`)}
                    isFeatured={idx === 0}
                  />
                ))
              ) : (
                <div className="col-span-full py-40 flex flex-col items-center gap-8 text-center bg-white/50 backdrop-blur-md rounded-[56px] border border-slate-100 shadow-sm">
                   <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                      <X className="w-10 h-10" />
                   </div>
                   <div className="space-y-4">
                      <h3 className="text-3xl font-display font-bold text-slate-900 uppercase tracking-tight">No Sanctuaries Found</h3>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest max-w-xs mx-auto">Try adjusting your filters to find your perfect sanctuary.</p>
                   </div>
                   <button 
                    onClick={() => setSelectedFilters({})}
                    className="px-8 py-4 bg-brand-accent text-white rounded-full text-[10px] font-bold uppercase tracking-widest"
                   >
                    Clear All Filters
                   </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="map"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="h-[800px] w-full bg-slate-100 rounded-[64px] border border-slate-200 overflow-hidden relative shadow-2xl"
            >
               <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-950 rounded-full flex items-center justify-center mx-auto text-brand-accent shadow-2xl">
                       <MapIcon className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-slate-900 uppercase tracking-tight">Interactive Map Active</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Searching for nearby sanctuaries...</p>
                  </div>
               </div>
               <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1600&q=80" alt="Map View" className="w-full h-full object-cover grayscale opacity-30" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load More Section */}
        <div className="py-32 flex flex-col items-center gap-8">
           <div className="w-24 h-px bg-slate-200"></div>
           <button className="px-16 py-6 border border-slate-200 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all shadow-sm active:scale-95 duration-500">
             Discover More Sanctuaries
           </button>
           <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Showing {filteredResults.length} of {allResults.length} Premium Results</p>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="bg-slate-950 py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="space-y-4 text-center md:text-left">
             <h4 className="text-3xl md:text-5xl font-display font-bold text-white uppercase tracking-tighter">Your safety is our <span className="text-brand-accent serif-italic lowercase">priority.</span></h4>
             <p className="text-slate-400 text-xs md:text-sm font-bold uppercase tracking-widest">Every property is human-verified by the StayEase trust & safety team.</p>
          </div>
          <button onClick={() => navigate('/support')} className="bg-white text-slate-900 px-12 py-5 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-brand-accent hover:text-white transition-all shadow-2xl">
            Learn About Safety
          </button>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent rounded-full blur-[150px] opacity-10 -mr-48 -mt-48"></div>
      </section>
    </div>
  );
};

export default HotelListings;
