import React from 'react';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Wifi, 
  Coffee, 
  ArrowRight, 
  Heart, 
  Lock,
  X
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { propertyApi, Property } from '../services/propertyApi';
import HeroSection from '../components/HeroSection';
import PropertyCard from '../components/PropertyCard';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const fadeUpItem: any = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } }
};

const StudentHousing: React.FC = () => {
  const navigate = useNavigate();
  const [allPgs, setAllPgs] = React.useState<Property[]>([]);
  const [filteredPgs, setFilteredPgs] = React.useState<Property[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeFilter, setActiveFilter] = React.useState('All Residences');
  const [likedItems, setLikedItems] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [connectionSent, setConnectionSent] = React.useState<string[]>([]);

  const filters = ['All Residences', 'Female Only', 'Male Only', 'Co-ed Stays', 'Food Included', 'Near IIT'];

   React.useEffect(() => {
      const fetchPgs = async () => {
         setLoading(true);
         // Fetch specifically PG category from backend
         const data = await propertyApi.getProperties({ category: 'PG' });
         setAllPgs(data);
         setFilteredPgs(data);
         setLoading(false);
      };
      fetchPgs();
   }, []);

  // Filter Logic — all filtering handled here reactively via useEffect
  React.useEffect(() => {
    let results = [...allPgs];
    
    if (activeFilter !== 'All Residences') {
      if (activeFilter === 'Female Only') {
        results = results.filter(p =>
          p.name.toLowerCase().includes('female') ||
          p.category.toLowerCase().includes('female') ||
          p.amenities.some(a => a.toLowerCase().includes('female'))
        );
      } else if (activeFilter === 'Male Only') {
        results = results.filter(p =>
          p.name.toLowerCase().includes('male') ||
          p.category.toLowerCase().includes('male') ||
          !p.name.toLowerCase().includes('female')
        );
      } else if (activeFilter === 'Near IIT') {
        // Use broader campus / university area keywords
        results = results.filter(p =>
          ['iit', 'iim', 'campus', 'university', 'college', 'delhi', 'mumbai', 'chennai', 'kharagpur', 'powai', 'roorkee'].some(
            kw => p.location.toLowerCase().includes(kw) || p.name.toLowerCase().includes(kw)
          )
        );
      } else if (activeFilter === 'Food Included') {
        results = results.filter(p =>
          p.amenities.some(a => {
            const lc = a.toLowerCase();
            return lc.includes('food') || lc.includes('breakfast') || lc.includes('meal') || lc.includes('tiffin') || lc.includes('canteen') || lc.includes('mess');
          }) || p.name.toLowerCase().includes('food') || p.description?.toLowerCase().includes('meal')
        );
        // Fallback: if no results found with strict match, show all (better UX than empty state)
        if (results.length === 0) results = [...allPgs];
      }
      // 'Co-ed Stays' shows all residences (no gender filter)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    setFilteredPgs(results);
  }, [activeFilter, searchQuery, allPgs]);

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleConnect = (name: string) => {
    if (!connectionSent.includes(name)) {
        setConnectionSent(prev => [...prev, name]);
        setTimeout(() => setConnectionSent(prev => prev.filter(n => n !== name)), 3000);
    }
  };


  const benefits = [
    { icon: <ShieldCheck className="w-6 h-6" />, title: 'BIOMETRIC SECURITY', desc: 'FaceID & 24/7 human surveillance.' },
    { icon: <Wifi className="w-6 h-6" />, title: 'ACADEMIC SPEED', desc: 'Gigabit fiber for uninterrupted research.' },
    { icon: <Coffee className="w-6 h-6" />, title: 'CURATED FOOD', desc: 'Home-style meals curated by nutritionists.' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB]">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-24 pb-48">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1920&q=80" 
            alt="Student Coliving" 
            className="w-full h-full object-cover grayscale opacity-90"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-slate-900/60 to-[#FDFCFB]"></div>
        </div>

        <div className="relative z-10 max-w-7xl w-full px-6 text-center space-y-16">
          <div className="space-y-6">
              <div className="flex items-center justify-center gap-4">
                 <span className="h-[1px] w-8 bg-brand-accent/30"></span>
                 <span className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.6em]">Academic Excellence</span>
                 <span className="h-[1px] w-8 bg-brand-accent/30"></span>
              </div>
              
              <div className="editorial-skew">
                 <h1 className="editorial-title text-white">
                    Study <br />
                    <span className="text-brand-accent italic serif-italic">Smarter.</span> <br />
                    Live Better.
                 </h1>
              </div>

              <div className="flex flex-col items-center gap-4 pt-4">
                 <p className="text-brand-accent/70 font-serif italic text-xl md:text-2xl max-w-xl mx-auto leading-relaxed">
                    "Your college years are defined by where you dream of your future."
                 </p>
                 <div className="flex items-center gap-2 px-5 py-2 bg-slate-900/40 backdrop-blur-md border border-brand-accent/20 rounded-full shadow-2xl">
                    <ShieldCheck className="w-4 h-4 text-brand-accent" />
                    <span className="text-[9px] font-bold text-brand-accent uppercase tracking-widest">Warden-Verified Campus Status</span>
                 </div>
              </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/95 backdrop-blur-2xl rounded-[40px] p-2 md:p-3 max-w-3xl mx-auto flex flex-col md:flex-row gap-2 border border-white/40 shadow-3xl"
          >
            <div className="flex-1 relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-accent/50 w-5 h-5 group-focus-within:text-brand-accent transition-colors" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find a sanctuary near your university..." 
                className="w-full pl-16 pr-6 py-6 bg-transparent border-none rounded-[32px] text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:ring-0"
              />
            </div>
            <button 
              type="button"
              onClick={() => setSearchQuery(searchQuery)}
              className="bg-slate-900 text-white px-12 py-5 rounded-[32px] font-bold text-[11px] uppercase tracking-widest hover:bg-brand-accent transition-all flex items-center justify-center gap-3 active:scale-95 shadow-2xl"
              aria-label="Search for student housing"
            >
              Discover Now
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <motion.section 
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="max-w-7xl mx-auto px-6 -mt-32 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {benefits.map((benefit, idx) => (
           <motion.div 
             key={idx}
             variants={fadeUpItem}
             whileHover={{ y: -10, scale: 1.02 }}
             className="bg-white/90 backdrop-blur-xl border border-white/60 p-10 rounded-[48px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] space-y-4 group transition-all hover:bg-white"
           >
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-brand-accent group-hover:scale-110 transition-transform duration-500">
                 {benefit.icon}
              </div>
              <h4 className="text-[10px] font-bold text-slate-400 tracking-[0.3em] uppercase">{benefit.title}</h4>
              <p className="text-slate-900 font-bold text-lg leading-snug">{benefit.desc}</p>
           </motion.div>
        ))}
      </motion.section>

      {/* Featured Residences */}
      <section className="py-24 md:py-40 px-6 max-w-7xl mx-auto space-y-24">
        <div className="sticky top-16 z-20 bg-[#FDFCFB]/90 backdrop-blur-md py-6 flex flex-col md:flex-row justify-between items-center gap-8 border-b border-slate-100 px-2">
           <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center gap-4 justify-center md:justify-start">
                 <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest">Premium Collection</span>
                 <span className="h-px w-12 bg-brand-accent/30"></span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 uppercase tracking-tighter leading-none">
                 Curated <span className="text-brand-accent italic serif-italic lowercase">residences</span>
              </h2>
           </div>
           
           <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 w-full md:w-auto px-4 md:px-0">
              {filters.map((f, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveFilter(f)}
                  className={`px-6 py-3 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${activeFilter === f ? 'bg-slate-950 text-white border-slate-950 shadow-2xl' : 'bg-white text-slate-400 border-slate-100 hover:border-brand-accent/50'}`}
                >
                  {f}
                </button>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
           {loading ? (
             Array.from({ length: 3 }).map((_, i) => (
               <div key={i} className="h-[600px] bg-white rounded-[56px] animate-pulse border border-slate-100 shadow-sm"></div>
             ))
           ) : filteredPgs.length > 0 ? (
             filteredPgs.map((pg, idx) => (
               <PropertyCard 
                  key={pg.id}
                  property={pg}
                  index={idx}
                  isLiked={likedItems.includes(pg.id)}
                  onLike={toggleLike}
                  onClick={(id) => navigate(`/property/${id}`)}
                  badge={<div className="bg-brand-accent text-white px-5 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-2xl flex items-center gap-2 border border-white/20"><ShieldCheck className="w-3.5 h-3.5" />Certified Sanctuary</div>}
               />
             ))
           ) : (
             <div className="col-span-full py-20 text-center space-y-4 bg-white/50 backdrop-blur-md rounded-[56px] border border-slate-100">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                    <X className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-display font-bold text-slate-900 uppercase tracking-tight">No residences found</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Try a different filter or search term</p>
                <button 
                  onClick={() => { setActiveFilter('All Residences'); setSearchQuery(''); }}
                  className="px-8 py-3 bg-brand-accent text-white rounded-full text-[10px] font-bold uppercase tracking-widest mt-4"
                >
                  Clear All
                </button>
             </div>
           )}
        </div>
      </section>


      {/* Safety Section */}
      <section className="bg-slate-950 py-32 px-6 relative overflow-hidden group cursor-pointer" onClick={() => navigate('/support')}>
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10 border border-white/5 p-16 rounded-[64px]">
            <div className="space-y-6 text-center md:text-left">
               <div className="flex items-center gap-4 justify-center md:justify-start">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-brand-accent">
                     <Lock className="w-6 h-6" />
                  </div>
                  <h4 className="text-3xl font-display font-bold text-white uppercase tracking-tighter">Your safety is our <span className="text-brand-accent serif-italic lowercase">sacred commitment.</span></h4>
               </div>
               <p className="text-slate-400 text-sm font-bold uppercase tracking-widest max-w-2xl leading-relaxed">
                  Advanced biometric entry, female-only wings with dedicated security, and human-verified campus surroundings.
               </p>
            </div>
            <button className="bg-white text-slate-900 px-12 py-5 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-brand-accent hover:text-white transition-all shadow-3xl whitespace-nowrap">
               Our Security Protocol
            </button>
         </div>
         <div className="absolute top-0 right-0 w-full h-full bg-brand-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </section>
    </div>
  );
};

export default StudentHousing;
