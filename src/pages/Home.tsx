import React from 'react';
import { 
  Plane, 
  Hotel, 
  Train, 
  Bus, 
  Home as HomeIcon, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Plus,
  LayoutGrid
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import FlowingMenu from '../components/FlowingMenu';
import { propertyApi, Property } from '../services/propertyApi';
import { flightApi, FeaturedDeal } from '../services/flightApi';
import UniversalSearchCard from '../components/UniversalSearchCard';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('flights');

  const categories = [
    { label: 'HOTELS', icon: Hotel, color: 'text-brand-accent', path: '/hotels' },
    { label: 'FLIGHTS', icon: Plane, color: 'text-orange-500', path: '/flights' },
    { label: 'TRAINS', icon: Train, color: 'text-rose-500', path: '/trains' },
    { label: 'BUSES', icon: Bus, color: 'text-blue-500', path: '/buses' },
    { label: 'PG/ROOMS', icon: HomeIcon, color: 'text-slate-600', path: '/pg' },
    { label: 'ACTIVITIES', icon: LayoutGrid, color: 'text-slate-600', path: '/search' },
  ];

  const [properties, setProperties] = React.useState<Property[]>([]);
  const [flightDeals, setFlightDeals] = React.useState<FeaturedDeal[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [props, flights] = await Promise.all([
        propertyApi.getProperties(),
        flightApi.getFeaturedDeals()
      ]);
      setProperties(props);
      setFlightDeals(flights);
      setLoading(false);
    };
    fetchData();
  }, []);

  const stories = [
    {
      title: 'How to Pack Light for a 2-Week Solo Journey',
      category: 'LIFESTYLE',
      readTime: '5 MIN READ',
      description: 'Master the art of minimalist travel without compromising on your style or essentials.',
      image: 'https://picsum.photos/seed/pack/600/400'
    },
    {
      title: 'Finding the Perfect PG: A Survivor\'s Guide',
      category: 'STUDENT LIVING',
      readTime: '8 MIN READ',
      description: 'Everything you need to check before signing that rental agreement in a new city.',
      image: 'https://picsum.photos/seed/room/600/400'
    },
    {
      title: '10 Street Foods in Old Delhi You Can\'t Miss',
      category: 'CULINARY',
      readTime: '4 MIN READ',
      description: 'Embark on a flavorful journey through the narrow lanes of Chandni Chowk.',
      image: 'https://picsum.photos/seed/food/600/400'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section — pb ensures the AI button clears before the category bar overlaps */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 pb-28 md:pb-36 z-40">
        {/* Immersive Background */}
        <div className="hero-image-container">
          <img 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80" 
            alt="Immersive Landscape" 
            className="opacity-90"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 hero-image-overlay"></div>
        </div>

        <div className="relative z-10 max-w-7xl w-full px-4 text-center space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-center gap-4">
              <span className="h-px w-8 bg-brand-accent/30"></span>
              <span className="micro-label">The Curated Wanderer</span>
              <span className="h-px w-8 bg-brand-accent/30"></span>
            </div>
            
            <div className="editorial-skew">
              <h1 className="editorial-title text-white">
                Your Home <br />
                <span className="text-brand-accent italic serif-italic">Everywhere.</span>
              </h1>
            </div>

            <div className="flex flex-col items-center gap-4 pt-4">
              <p className="text-emerald-100/70 font-serif italic text-xl max-w-xl mx-auto leading-relaxed">
                "Travel is the only thing you buy that makes you richer."
              </p>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-brand-primary/40 backdrop-blur-md border border-brand-accent/20 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-brand-accent" />
                  <span className="text-[9px] font-bold text-brand-accent uppercase tracking-widest">Human-Verified Experiences</span>
                </div>
            </div>
          </motion.div>

          <UniversalSearchCard 
            activeTab={activeTab} 
            className="mx-auto z-30" 
          />

          {/* AI Prompt - Subtle */}
          <motion.button 
            onClick={() => navigate('/ai')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 text-white/80 px-10 py-4 rounded-full text-[9px] font-bold uppercase tracking-[0.3em] flex items-center gap-4 mx-auto hover:bg-white/10 hover:text-white transition-all group"
          >
            <Sparkles className="w-4 h-4 text-brand-accent group-hover:animate-pulse" />
            Plan with AI Assistant
            <span className="h-px w-4 bg-white/20"></span>
            <span className="text-brand-accent">Curate my journey</span>
          </motion.button>
        </div>
      </section>

      {/* Category Icons - z-50 so it sits above the hero (z-40) when pulled up */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-50">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-slate-200 border border-slate-200 rounded-[40px] overflow-hidden shadow-2xl"
        >
          {categories.map((cat, idx) => (
            <motion.div 
              key={idx}
              variants={fadeUpItem}
              whileHover={{ backgroundColor: "rgba(255, 255, 255, 1)", scale: 1.02, zIndex: 10, borderRadius: '40px' }}
              onClick={() => navigate(cat.path)}
              className="bg-white/90 backdrop-blur-md p-8 flex flex-col items-center gap-4 cursor-pointer transition-colors group relative"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${cat.color} bg-slate-50 group-hover:scale-110 transition-transform duration-500`}>
                <cat.icon className="w-6 h-6" />
              </div>
              <span className="text-[9px] font-bold text-slate-400 tracking-[0.3em] uppercase group-hover:text-brand-primary transition-colors">{cat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Featured Deals - Technical Editorial Grid */}
      <section className="py-40 bg-[#fdfcfb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="micro-label">Limited Collections</span>
                <span className="h-px w-12 bg-brand-accent/30"></span>
              </div>
              <h2 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-brand-primary uppercase tracking-tighter leading-none">
                Skyward <span className="text-brand-accent italic serif-italic underline decoration-brand-accent/20 underline-offset-8">Bound.</span>
              </h2>
            </div>
            <Link to="/search" className="group flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent">
              Explore All Offers
              <div className="w-10 h-10 rounded-full border border-brand-accent/20 flex items-center justify-center group-hover:bg-brand-accent group-hover:text-white transition-all">
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </div>
            </Link>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-slate-200 border border-slate-200 rounded-[64px] overflow-hidden shadow-sm"
          >
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-[600px] bg-white animate-pulse"></div>
              ))
            ) : (
              properties.slice(0, 3).map((prop, idx) => (
                <motion.div 
                  key={idx}
                  variants={fadeUpItem}
                  whileHover={{ y: -12, shadow: "0 20px 40px -20px rgba(0,0,0,0.1)", zIndex: 10 }}
                  onClick={() => navigate(`/property/${prop.id}`)}
                  className="bg-white p-10 space-y-10 group cursor-pointer hover:bg-slate-50 transition-all duration-500 relative"
                >
                  <div className="aspect-[4/5] overflow-hidden relative rounded-[40px]">
                    <img 
                      src={prop.image} 
                      alt={prop.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-6 left-6 bg-brand-accent text-white text-[9px] font-bold px-4 py-2 rounded-full shadow-xl uppercase tracking-widest flex items-center gap-2">
                      <ShieldCheck className="w-3 h-3" />
                      Sanctuary Verified
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <span className="text-[9px] font-bold text-brand-accent uppercase tracking-[0.2em]">{prop.category} Luxury</span>
                      <h3 className="text-3xl font-display font-bold text-slate-900 leading-tight">{prop.name}</h3>
                    </div>
                    
                    <p className="text-slate-500 text-sm leading-relaxed font-medium line-clamp-2">
                      {prop.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                      <div className="space-y-1">
                         <div className="text-[9px] text-slate-300 line-through font-bold uppercase tracking-widest">₹{(prop.price * 1.2).toLocaleString()}</div>
                         <div className="text-3xl font-display font-bold text-brand-accent tracking-tighter">
                           ₹{prop.price.toLocaleString()}
                           <span className="text-slate-400 text-[10px] font-medium ml-2 uppercase tracking-widest">/ Night</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">View Details</span>
                         <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-brand-accent group-hover:text-white transition-all">
                           <Plus className="w-6 h-6" />
                         </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* Popular Destinations - Oversized Typographic */}
      <section className="py-40 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-accent/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -ml-48 -mb-48"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-32 gap-12">
            <div className="space-y-8 max-w-2xl">
              <div className="flex items-center gap-4">
                <span className="micro-label !text-brand-accent">Global Landmarks</span>
                <span className="h-px w-12 bg-brand-accent/20"></span>
              </div>
              <h2 className="text-7xl md:text-9xl lg:text-[clamp(5rem,20vw,10rem)] font-display font-bold text-white uppercase tracking-tighter leading-[0.8]">
                Iconic <br />
                <span className="text-brand-accent italic serif-italic">Escapes</span>
              </h2>
            </div>
            <p className="text-emerald-100/40 font-serif italic text-xl max-w-xs leading-relaxed">
              "The world is a book and those who do not travel read only one page."
            </p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8"
          >
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="md:col-span-4 h-[500px] bg-white/5 animate-pulse rounded-[64px]"></div>
              ))
            ) : (
              flightDeals.slice(0, 3).map((deal, idx) => (
                <motion.div 
                  key={idx}
                  variants={fadeUpItem}
                  whileHover={{ y: -10, scale: 1.02 }}
                  onClick={() => navigate('/flights')}
                  className={`${idx === 0 ? 'md:col-span-8' : 'md:col-span-4'} relative h-[500px] rounded-[64px] overflow-hidden group cursor-pointer shadow-2xl border border-white/5`}
                >
                  <img 
                    src={deal.image} 
                    alt={deal.to} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent p-12 flex flex-col justify-end">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="text-[4rem] font-display font-bold text-white/10 leading-none">0{idx + 1}</span>
                        <div className="h-px flex-1 bg-white/10"></div>
                      </div>
                      <h3 className="text-4xl font-display font-bold text-white uppercase tracking-tight">{deal.to}</h3>
                      <div className="flex items-center justify-between">
                        <p className="text-brand-accent text-[10px] font-bold uppercase tracking-[0.3em]">From {deal.price}</p>
                        <ArrowRight className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* Curated Experiences - Flowing Menu */}
      <section className="py-32 bg-slate-950 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-20 space-y-4">
            <span className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.3em] block">CURATED EXPERIENCES</span>
            <h2 className="text-5xl font-display font-bold uppercase tracking-tighter">The <span className="text-brand-accent italic serif-italic">Wanderlust</span> Edit</h2>
          </div>
          
          <FlowingMenu 
            items={[
              { text: "Alpine Retreats", link: "/search", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80" },
              { text: "Coastal Escapes", link: "/search", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80" },
              { text: "Urban Journeys", link: "/search", image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80" },
              { text: "Hidden Sanctuaries", link: "/search", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80" },
            ]}
          />
        </div>
      </section>

      {/* Traveler Stories & Guides - Magazine Layout */}
      <section className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start mb-32">
            <div className="lg:col-span-5 space-y-10">
              <div className="flex items-center gap-4">
                <span className="micro-label">The Archive</span>
                <span className="h-px w-12 bg-brand-accent/20"></span>
              </div>
              <h2 className="text-7xl md:text-8xl font-display font-bold text-slate-900 uppercase tracking-tighter leading-[0.8]">
                Traveler <br />
                <span className="text-brand-accent italic serif-italic">Stories</span>
              </h2>
              <p className="text-slate-500 text-xl font-serif italic leading-relaxed max-w-md">
                Curated insights and personal narratives from the modern explorer's perspective.
              </p>
            </div>
            <div 
              onClick={() => navigate('/journal')}
              className="lg:col-span-7 h-[400px] rounded-[64px] overflow-hidden shadow-2xl relative group cursor-pointer"
            >
              <img 
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80" 
                alt="Featured Story" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent p-12 flex flex-col justify-end">
                <span className="text-[9px] font-bold text-brand-accent uppercase tracking-[0.4em] mb-4">Editor's Choice</span>
                <h3 className="text-4xl font-display font-bold text-white uppercase tracking-tight max-w-lg group-hover:text-brand-accent transition-colors">The Art of Slow Travel in the Digital Age</h3>
              </div>
            </div>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-16"
          >
            {stories.map((story, idx) => (
              <motion.div 
                key={idx}
                variants={fadeUpItem}
                whileHover={{ y: -10 }}
                onClick={() => navigate('/journal')}
                className="space-y-10 group cursor-pointer"
              >
                <div className="aspect-[3/4] rounded-[56px] overflow-hidden shadow-xl relative">
                  <img 
                    src={story.image} 
                    alt={story.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-brand-primary/10 group-hover:bg-transparent transition-all"></div>
                </div>
                <div className="space-y-6 px-2">
                  <div className="flex items-center gap-4 text-[9px] font-bold text-brand-accent uppercase tracking-[0.3em]">
                    <span>{story.category}</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                    <span className="text-slate-400">{story.readTime}</span>
                  </div>
                  <h3 className="text-3xl font-display font-bold text-slate-900 group-hover:text-brand-accent transition-colors leading-tight">
                    {story.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium line-clamp-3">
                    {story.description}
                  </p>
                  <div className="pt-4 flex items-center gap-3 text-brand-accent font-bold text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                    Read Story <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
