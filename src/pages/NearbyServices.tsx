import React from 'react';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  Star, 
  Phone, 
  Search, 
  Filter, 
  ArrowLeft, 
  ArrowRight, 
  X,
  Zap,
  CheckCircle2,
  Utensils,
  Droplets,
  Dumbbell,
  Coffee,
  ChevronRight,
  ShieldCheck,
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface Service {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: { user: string; rating: number; review: string }[];
  distance: string;
  time: string;
  image: string;
  isFeatured?: boolean;
  status: string;
  phone: string;
  website: string;
}

const NearbyServices: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = React.useState('Food & Dining');
  const [selectedService, setSelectedService] = React.useState<Service | null>(null);

  const categories = [
    { id: 'Food & Dining', label: 'Dining', icon: Utensils },
    { id: 'Laundry', label: 'Laundry', icon: Droplets },
    { id: 'Gym', label: 'Fitness', icon: Dumbbell },
    { id: 'Cafes', label: 'Coffee', icon: Coffee },
  ];

  const services: Service[] = [
    {
      id: '1',
      name: 'The Urban Kitchen',
      category: 'Food & Dining',
      rating: 4.8,
      reviews: [
        { user: 'Alex R.', rating: 5, review: 'Incredible atmosphere and the food is consistently fresh.' },
        { user: 'Sarah M.', rating: 4.5, review: 'Great spot for a quick lunch in the heart of the city.' }
      ],
      distance: '0.2 km',
      time: '5 min walk',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400',
      isFeatured: true,
      status: 'Open Now',
      phone: '+91 80 2234 5678',
      website: 'urbankitchen.com'
    },
    {
      id: '2',
      name: 'QuickClean Laundry',
      category: 'Laundry',
      rating: 4.5,
      reviews: [
        { user: 'John D.', rating: 4, review: 'Reliable service, clothes always come back crisp.' }
      ],
      distance: '0.4 km',
      time: '8 min walk',
      image: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&q=80&w=400',
      status: 'Closes Soon',
      phone: '+91 80 3345 6789',
      website: 'quickclean.in'
    },
    {
      id: '3',
      name: 'Iron Paradise Gym',
      category: 'Gym',
      rating: 4.9,
      reviews: [
        { user: 'Mike T.', rating: 5, review: 'Best equipment in the area, very motivating environment.' }
      ],
      distance: '0.6 km',
      time: '12 min walk',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400',
      isFeatured: true,
      status: 'Open Now',
      phone: '+91 80 4456 7890',
      website: 'ironparadise.com'
    }
  ];

  const filteredServices = services.filter(s => s.category === activeCategory);

  return (
    <div className="flex flex-col h-screen bg-brand-bg overflow-hidden">
      {/* Header */}
      <div className="bg-white px-8 py-6 flex items-center justify-between border-b border-slate-100 z-30">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>
              <h1 className="text-xl font-display font-bold text-slate-900 uppercase tracking-tighter">Nearby Essentials</h1>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bangalore, India • Current Location</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search services, food, laundry..." 
              className="pl-12 pr-6 py-3 bg-[#F8F9FB] border-none rounded-2xl text-sm focus:ring-2 focus:ring-brand-accent transition-all w-80"
            />
          </div>
          <button className="p-3 bg-[#F8F9FB] rounded-2xl text-slate-600 hover:text-brand-accent transition-all">
            <Filter className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Services List */}
        <div className="w-1/3 border-r border-slate-100 bg-white overflow-y-auto scrollbar-hide">
          <div className="p-8 space-y-8">
            <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {categories.map((category) => (
                <div key={category.id} className="flex flex-col items-center gap-2">
                  <div className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    activeCategory === category.id 
                      ? 'bg-brand-accent/5 border-brand-accent text-brand-accent shadow-sm' 
                      : 'bg-white border-slate-100 text-slate-400 hover:border-brand-accent/30'
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                  >
                    <category.icon className="w-6 h-6 mx-auto" />
                  </div>
                  <span className={`text-[8px] font-bold uppercase tracking-widest ${
                    activeCategory === category.id ? 'text-brand-accent' : 'text-slate-400'
                  }`}>{category.label}</span>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Results Found ({filteredServices.length})</h3>
                <button className="text-xs font-bold text-brand-accent">Sort by Distance</button>
              </div>
              
              <motion.div 
                className="space-y-6"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                  }
                }}
              >
                {filteredServices.map((service) => (
                  <motion.div 
                    key={service.id}
                    layoutId={service.id}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      show: { opacity: 1, x: 0, transition: { duration: 0.4 } }
                    }}
                    onClick={() => setSelectedService(service)}
                    className={`p-5 rounded-[32px] border transition-all cursor-pointer group relative ${
                      selectedService?.id === service.id 
                        ? 'bg-brand-accent/5 border-brand-accent ring-4 ring-brand-accent/10' 
                        : 'bg-[#F8F9FB] border-transparent hover:border-brand-accent/20 hover:bg-white hover:shadow-xl hover:shadow-brand-accent/10'
                    }`}
                  >
                    <div className="flex gap-6">
                      <div className="relative shrink-0">
                        <img src={service.image} alt={service.name} className="w-24 h-24 object-cover rounded-2xl shadow-sm" />
                        {service.isFeatured && (
                          <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 bg-white/90 backdrop-blur-md rounded-lg shadow-sm">
                            <Star className="w-3 h-3 fill-brand-accent text-brand-accent" />
                            <span className="text-[10px] font-bold tabular-nums">{service.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-slate-900 text-lg group-hover:text-brand-accent transition-colors">{service.name}</h4>
                            <p className="text-xs text-slate-400 font-medium">{service.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {service.distance}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {service.time}
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                           <div className="flex items-center gap-1.5 text-brand-accent">
                              <Zap className="w-3 h-3 fill-brand-accent" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">Iris Verified</span>
                           </div>
                           <button className="p-2 bg-slate-50 text-slate-900 rounded-lg hover:bg-brand-accent hover:text-white transition-all">
                              <ArrowRight className="w-4 h-4" />
                           </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Perspective Map View */}
        <div className="flex-1 bg-slate-100 flex flex-col">
          {selectedService ? (
            <div className="flex-1 flex flex-col p-8 gap-8 overflow-y-auto">
              {/* Map UI */}
              <div className="relative h-2/3 min-h-[400px] w-full bg-slate-200 rounded-[48px] shadow-2xl overflow-hidden group">
                <img src="https://picsum.photos/seed/map/1200/800" alt="Map" className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 transition-all duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                
                <div className="absolute inset-0 p-12 flex flex-col justify-between pointer-events-none">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></div>
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Discover Local Essence</span>
                  </div>
                  
                  <div className="flex justify-between items-end pointer-events-auto">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-1">{selectedService.category}</div>
                        <h3 className="text-4xl md:text-5xl font-display font-bold text-white uppercase tracking-tighter leading-none">{selectedService.name}</h3>
                      </div>
                      <button className="flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 px-8 py-4 rounded-full text-white hover:bg-white/20 transition-all group">
                         <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Navigation className="w-4 h-4 text-white" />
                         </div>
                         <span className="text-[10px] font-bold uppercase tracking-widest tracking-[0.2em]">Open Perspective Map</span>
                      </button>
                    </div>
                    
                    <div className="flex flex-col items-end gap-6">
                      <div className="flex -space-x-3">
                          {[1,2,3].map(j => (
                            <div key={j} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                              <img src={`https://i.pravatar.cc/150?u=${j}`} alt="user" />
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
                <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-brand-accent ring-8 ring-brand-accent/5">
                        <Phone className="w-6 h-6" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-slate-900 group-hover:text-brand-accent transition-colors">{selectedService.phone}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">24/7 Response Guaranteed</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Customer Perspective</h4>
                       <div className="flex items-center gap-1.5 bg-brand-accent/10 px-3 py-1.5 rounded-full text-brand-accent font-bold text-[10px]">
                          <Zap className="w-3.5 h-3.5 fill-brand-accent" />
                          98% POSITIVE
                       </div>
                    </div>
                    <div className="space-y-6">
                      {(selectedService.reviews || []).map((review, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="p-6 bg-slate-50 rounded-[32px] space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Star className="w-3.5 h-3.5 fill-brand-accent text-brand-accent" />
                              <span className="text-xs font-bold text-slate-900">{review.rating}</span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 font-serif italic leading-relaxed line-clamp-2">"{review.review}"</p>
                          <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
                            <div className="w-5 h-5 rounded-full bg-brand-accent/10 flex items-center justify-center">
                              <CheckCircle2 className="w-3 h-3 text-brand-accent" />
                            </div>
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{review.user}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-brand-primary p-12 rounded-[48px] text-center shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent opacity-5 rounded-full blur-[100px] transform translate-x-1/2 -translate-y-1/2"></div>
                  <div className="relative z-10 flex flex-col items-center justify-center h-full">
                    <div className="flex items-center justify-center gap-2 mb-6">
                      <div className="w-8 h-px bg-brand-accent/30"></div>
                      <Zap className="w-4 h-4 text-brand-accent" />
                      <div className="w-8 h-px bg-brand-accent/30"></div>
                    </div>
                    <h2 className="text-3xl font-display font-bold text-white uppercase tracking-tighter mb-4">
                      Need Something <span className="text-brand-accent italic serif-italic lowercase">specific?</span>
                    </h2>
                    <p className="text-white/60 font-serif italic text-base max-w-sm mx-auto mb-10 leading-relaxed">
                      "Tell Iris what you're looking for, and she'll curate the perfect recommendation."
                    </p>
                    <button className="w-full bg-white text-slate-900 py-5 rounded-[24px] font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-brand-accent hover:text-white transition-all shadow-2xl active:scale-95 duration-500">
                       Direct Assistance
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-8">
              <div className="w-32 h-32 bg-white rounded-[40px] shadow-2xl flex items-center justify-center text-brand-primary/10">
                <Navigation className="w-16 h-16" />
              </div>
              <div className="space-y-4">
                <h3 className="text-4xl font-display font-bold text-slate-900 uppercase tracking-tighter">Choose Your <br/> Perspective</h3>
                <p className="text-xl text-slate-400 font-serif italic max-w-sm mx-auto">Select a service to explore its specific details and community reviews.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NearbyServices;
