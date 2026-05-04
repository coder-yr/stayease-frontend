import React from 'react';
import { 
  MapPin, 
  Shield, 
  Star, 
  ArrowRight, 
  ArrowLeft, 
  Heart, 
  Share2, 
  Wifi, 
  Wind, 
  Coffee, 
  Info,
  Calendar
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { propertyApi, Property } from '../services/propertyApi';

const formatInr = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`;

const buildDefaultTiers = (monthlyInr: number) => {
  const base = Math.max(1000, monthlyInr);
  return [
    { name: 'Essential Suite', price: formatInr(base), availability: 'AVAILABLE' },
    { name: 'Premium Suite', price: formatInr(base * 1.18), availability: 'LIMITED' },
    { name: 'Signature Suite', price: formatInr(base * 1.35), availability: '2 LEFT' }
  ];
};

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = React.useState<Property | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedTier, setSelectedTier] = React.useState(0);
  
  // Date Selection State
  const [checkIn, setCheckIn] = React.useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });
  
  const [checkOut, setCheckOut] = React.useState(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 8);
    return nextWeek.toISOString().split('T')[0];
  });

  const nights = React.useMemo(() => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [checkIn, checkOut]);

  React.useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      setLoading(true);
      const data = await propertyApi.getPropertyById(id);
      setProperty(data || null);
      setLoading(false);
    };
    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center space-y-8">
        <div className="w-24 h-24 border-4 border-slate-100 border-t-brand-accent rounded-full animate-spin"></div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] animate-pulse">Summoning your sanctuary...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center space-y-12">
        <h2 className="text-4xl font-display font-bold text-slate-900 uppercase tracking-tighter">Sanctuary Not Found</h2>
        <button onClick={() => navigate('/search')} className="px-10 py-4 bg-slate-900 text-white rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-brand-accent transition-all shadow-2xl">
          Back to Discovery
        </button>
      </div>
    );
  }

  const images = property.images || [property.image];
  const isPG = (() => {
    const cat = property.category?.toLowerCase() || '';
    const name = property.name.toLowerCase();
    return cat.includes('student') || cat.includes('pg') || cat.includes('coliving') || name.includes('residence') || name.includes('sanctuary');
  })();
  const monthlyInr = Number(property.price ?? 0) * (Number(property.price) < 500 ? 84 : 1);
  
  const rawTiers = Array.isArray(property.tiers) ? property.tiers : [];
  const validTiers = rawTiers.filter((t: any) => t && t.name && t.price);
  const tiers = validTiers.length > 0 ? validTiers.map((t: any) => ({
    name: t.name,
    price: String(t.price).includes('₹') ? String(t.price) : formatInr(Number(t.price.replace(/[^\d.-]/g, '')) || monthlyInr),
    availability: t.availability || 'AVAILABLE'
  })) : buildDefaultTiers(monthlyInr);

  const activeTier = tiers[Math.min(selectedTier, tiers.length - 1)];

  const handleBooking = () => {
    if (!property?.id) return;
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      tier: activeTier.name,
      guests: '1'
    });
    navigate(`/checkout/${property.id}?${params.toString()}`);
  };

  const amenities = property.amenities && property.amenities.length > 0 ? property.amenities : ['WiFi', '24x7 Security', 'Housekeeping'];
  const nearby = property.nearby && property.nearby.length > 0
    ? property.nearby
    : [
        {
          name: 'Metro Link Station',
          distance: '7 min walk',
          image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: 'Student Food Court',
          distance: '5 min walk',
          image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80'
        },
        {
          name: '24x7 Health Clinic',
          distance: '9 min walk',
          image: 'https://images.unsplash.com/photo-1576765608622-067973a79f53?auto=format&fit=crop&w=600&q=80'
        }
      ];
  const depositInr = property.deposit ? formatInr(property.deposit) : formatInr(monthlyInr * 0.2);
  const maintenanceInr = formatInr(monthlyInr * 0.05);

  return (
    <div className="bg-white min-h-screen pb-32">
      {/* Dynamic Header Overlay */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-white/70 backdrop-blur-2xl border-b border-slate-100 py-3 md:py-4 px-4 md:px-8 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.02)] hidden md:flex">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-slate-50 rounded-full hover:bg-slate-100 transition-all border border-slate-100">
             <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <div className="hidden sm:block">
            <h1 className="text-base md:text-xl font-display font-bold text-slate-900 tracking-tight uppercase">{property.name} <span className="text-brand-accent serif-italic lowercase">{property.category}</span> Sanctuary</h1>
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-8">
           <div className="text-right hidden md:block">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Total Stay</p>
             <p className="text-lg font-display font-bold text-slate-900 leading-none">
               {activeTier.price}<span className="text-xs font-serif italic text-slate-400 font-medium ml-1">{isPG ? 'per mo' : 'per night'}</span>
               {!isPG && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-2">(+ {property.taxRate}% Tax)</span>}
             </p>
           </div>
           <button 
             onClick={handleBooking}
             className="bg-slate-900 text-white px-6 md:px-10 py-3 md:py-4 rounded-full font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-brand-accent transition-all flex items-center gap-2 group"
           >
             Book Now
             <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
           </button>
        </div>
      </div>

      {/* Hero Image Section - Immersive Grid */}
      <section className="pt-24 md:pt-32 px-4 md:px-8 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 h-[500px] md:h-[700px]">
          <div className="md:col-span-2 h-full relative rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl group">
             <img src={images[0]} alt={`${property.name} — Lobby`} className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" aria-hidden="true"></div>
             <div className="absolute top-6 right-6 flex items-center gap-3 z-10">
               <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-white/30 transition-all" aria-label="Save property">
                 <Heart className="w-4 h-4" />
               </button>
               <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-white/30 transition-all" aria-label="Share property">
                 <Share2 className="w-4 h-4" />
               </button>
             </div>
             <div className="absolute top-8 left-8 bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-2 rounded-full text-[10px] font-bold text-white uppercase tracking-[0.3em]">
               The Lobby Experience
             </div>
          </div>
          <div className="hidden md:grid md:col-span-1 grid-rows-2 gap-4">
             <div className="relative rounded-[40px] overflow-hidden shadow-xl group">
               <img src={images[1] ?? images[0]} alt={`${property.name} — Room`} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" />
             </div>
             <div className="relative rounded-[40px] overflow-hidden shadow-xl group">
               <img src={images[2] ?? images[0]} alt={`${property.name} — Dining`} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" />
             </div>
          </div>
          <div className="hidden md:block md:col-span-1 h-full relative rounded-[60px] overflow-hidden shadow-xl group">
             <img src={images[3] ?? images[0]} alt={`${property.name} — Details`} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" />
             <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700" aria-hidden="true">
                <button className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 shadow-2xl">
                  View All Photos
                </button>
             </div>
          </div>
        </div>
      </section>

      {/* Main Content Content */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 mt-12 md:mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Left: Detail Stream */}
          <div className="lg:col-span-7 space-y-20 md:space-y-32">
            
            {/* Intro Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' as const }}
              className="space-y-8 md:space-y-12"
            >
              <div className="flex flex-wrap gap-3">
                 <span className="bg-brand-accent/10 text-brand-accent text-[9px] font-bold px-5 py-2 rounded-full uppercase tracking-[0.3em] border border-brand-accent/20">{property.category} Living</span>
                 <span className="bg-slate-50 text-slate-500 text-[9px] font-bold px-5 py-2 rounded-full uppercase tracking-[0.3em] flex items-center gap-2 border border-slate-100">
                    <Star className="w-3.5 h-3.5 fill-brand-accent text-brand-accent" />
                    {property.rating} · {property.reviews} Reviews
                 </span>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-4xl md:text-7xl font-display font-bold text-slate-900 leading-[0.92] tracking-tighter uppercase">
                  {property.name}
                </h2>
                <div className="flex items-center gap-3 text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-[0.4em] pt-4">
                  <MapPin className="w-5 h-5 text-brand-accent" />
                  {property.location}
                </div>
              </div>

              <p className="text-slate-500 text-lg md:text-2xl font-medium leading-relaxed max-w-2xl font-serif italic opacity-80">
                "{property.description || "Experience a lifestyle curated for the visionaries of tomorrow. Our suites are more than just a stay—they are your sanctuary in the heart of the city's hustle."}"
              </p>
            </motion.div>

            {/* Amenities Grid */}
            <div className="space-y-12">
              <div className="flex items-center gap-6">
                <h3 className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.6em] whitespace-nowrap">Service Excellence</h3>
                <div className="h-[1px] w-full bg-slate-100"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16">
                  {amenities.map((amenity, idx) => (
                    <div key={idx} className="flex gap-8 group">
                       <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center text-slate-400 group-hover:bg-brand-primary group-hover:text-white transition-all duration-700 shrink-0 border border-slate-100">
                          {amenity.toLowerCase().includes('wifi') ? <Wifi className="w-8 h-8" /> : 
                           amenity.toLowerCase().includes('pool') ? <Coffee className="w-8 h-8" /> :
                           amenity.toLowerCase().includes('ac') ? <Wind className="w-8 h-8" /> :
                           <Shield className="w-8 h-8" />}
                       </div>
                       <div className="space-y-2 pt-2">
                          <h4 className="text-xl font-bold text-slate-900 tracking-tight uppercase">{amenity}</h4>
                          <p className="text-slate-400 text-sm font-medium leading-relaxed">Premium convenience included</p>
                       </div>
                    </div>
                  ))}
                  {property.mealsIncluded && (
                    <div className="flex gap-8 group">
                       <div className="w-20 h-20 bg-emerald-50 rounded-[32px] flex items-center justify-center text-emerald-600 group-hover:bg-brand-primary group-hover:text-white transition-all duration-700 shrink-0 border border-emerald-100">
                          <Coffee className="w-8 h-8" />
                       </div>
                       <div className="space-y-2 pt-2">
                          <h4 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Meals Included</h4>
                          <p className="text-slate-400 text-sm font-medium leading-relaxed">Delicious nutritional dining</p>
                       </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Property Rules */}
            {property.rules && (
              <div className="space-y-12">
                <div className="flex items-center gap-6">
                  <h3 className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.6em] whitespace-nowrap">House Protocols</h3>
                  <div className="h-[1px] w-full bg-slate-100"></div>
                </div>
                <div className="bg-slate-50 p-10 rounded-[48px] border border-slate-100 italic font-serif text-lg text-slate-600 leading-relaxed">
                   "{property.rules}"
                </div>
              </div>
            )}

            {/* Neighborhood Spotlight */}
            <div className="space-y-12">
               <div className="flex items-center justify-between">
                  <h3 className="text-2xl md:text-4xl font-display font-bold text-slate-900 uppercase">Neighborhood <span className="text-brand-accent serif-italic lowercase">spotlight</span></h3>
                  <button onClick={() => alert('Searching 50+ nearby hotspots...')} className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] hover:text-slate-900 transition-colors">See all locations</button>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  {nearby.map((item, idx) => (
                    <div key={idx} className="group cursor-pointer">
                      <div className="h-48 md:h-64 rounded-[40px] overflow-hidden mb-6 shadow-xl border border-slate-100">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110" />
                      </div>
                      <div className="px-4">
                        <h4 className="text-lg font-bold text-slate-900 mb-1">{item.name}</h4>
                        <p className="text-[10px] font-bold text-brand-accent uppercase tracking-widest">{item.distance}</p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

          </div>

          {/* Right: Floating Booking Sidebar */}
          <div className="lg:col-span-5">
             <div className="sticky top-32 bg-slate-100 rounded-[60px] p-8 md:p-12 space-y-10 border border-slate-200 shadow-2xl overflow-hidden group/card shadow-brand-accent/5">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                
                <div className="relative z-10 flex justify-between items-end">
                  <div className="space-y-1">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isPG ? 'Monthly Membership' : 'Nightly Rate'}</p>
                   {/* Dynamic price from selected tier */}
                   <h3 className="text-5xl font-display font-bold text-slate-900 tracking-tighter uppercase">{activeTier.price}</h3>
                   {!isPG && <p className="text-[10px] font-bold text-brand-accent uppercase tracking-widest mt-2">+ {property.taxRate}% Tax & Fees at checkout</p>}
                 </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-[9px] font-bold text-white bg-slate-900 px-4 py-2 rounded-full shadow-2xl">
                      <Info className="w-3.5 h-3.5 text-brand-accent" />
                      BEST PRICE UNIT
                    </div>
                  </div>
                </div>

                <div className="relative z-10 space-y-8 pt-6 border-t border-slate-200">
                  
                  {/* Enhanced Date Picker Card */}
                  <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm group/datecard hover:border-brand-accent/30 hover:shadow-2xl hover:shadow-brand-accent/5 transition-all duration-500">
                    <div className="p-1 bg-slate-50 border-b border-slate-100 flex items-center justify-between px-6 py-2">
                       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">Stay Duration</span>
                       <div className="flex bg-brand-accent text-white px-3 py-1 rounded-full items-center gap-1.5 shadow-lg shadow-brand-accent/20 animate-in fade-in zoom-in duration-500">
                          <span className="text-[10px] font-black uppercase tracking-widest tabular-nums">{nights}</span>
                          <span className="text-[8px] font-bold uppercase tracking-widest">{nights === 1 ? 'Night' : 'Nights'}</span>
                       </div>
                    </div>
                                        <div className="grid grid-cols-2 divide-x divide-slate-100">
                       <div className="p-6 space-y-3 hover:bg-slate-50/50 transition-colors group/checkin">
                          <div className="flex items-center gap-2">
                             <Calendar className="w-3 h-3 text-brand-accent" />
                             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Check-in</span>
                          </div>
                          <input 
                            type="date" 
                            value={checkIn}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setCheckIn(e.target.value)}
                            className="w-full bg-transparent text-sm font-bold text-slate-900 uppercase tracking-tighter outline-none cursor-pointer"
                          />
                       </div>
                       <div className="p-6 space-y-3 hover:bg-slate-50/50 transition-colors group/checkout">
                          <div className="flex items-center gap-2">
                             <Calendar className="w-3 h-3 text-brand-accent" />
                             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Check-out</span>
                          </div>
                          <input 
                            type="date" 
                            value={checkOut}
                            min={checkIn}
                            onChange={(e) => setCheckOut(e.target.value)}
                            className="w-full bg-transparent text-sm font-bold text-slate-900 uppercase tracking-tighter outline-none cursor-pointer"
                          />
                       </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 ml-4">Suite Tier Selection</label>
                    <div className="grid grid-cols-1 gap-3">
                       {tiers.map((tier, i) => (
                         <div 
                           key={i} 
                           onClick={() => setSelectedTier(i)}
                           className={`flex items-center justify-between p-6 rounded-[32px] border transition-all cursor-pointer ${selectedTier === i ? 'bg-white border-brand-accent shadow-2xl shadow-brand-accent/10' : 'bg-white/50 border-slate-200 hover:border-slate-300'}`}
                         >
                            <div className="flex items-center gap-4">
                               <div className={`w-3 h-3 rounded-full border-2 ${selectedTier === i ? 'bg-brand-accent border-brand-accent' : 'border-slate-300'}`}></div>
                               <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">{tier.name}</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">{tier.availability}</span>
                         </div>
                       ))}
                    </div>
                  </div>

                  <div className="flex bg-brand-accent/10 border border-brand-accent/20 px-3 py-1 rounded-full items-center gap-2">
                    <Star className="w-3 h-3 fill-brand-accent text-brand-accent" />
                    <span className="text-[10px] font-bold text-brand-accent tabular-nums">{property.rating} ({property.reviews} reviews)</span>
                  </div>

                  {isPG && (
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                       <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Deposit</p>
                        <p className="text-lg font-bold text-slate-900">{depositInr}</p>
                       </div>
                       <div className="space-y-1 text-right">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Maintenance</p>
                        <p className="text-lg font-bold text-slate-900">{maintenanceInr}</p>
                       </div>
                    </div>
                  )}

                  <button 
                     onClick={handleBooking}
                     className="w-full bg-brand-primary text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] shadow-2xl shadow-brand-primary/10 hover:bg-brand-accent transition-all transform active:scale-95 duration-500 flex items-center justify-center gap-3"
                     aria-label={`Book ${property.name}`}
                   >
                     Confirm Reservation
                     <ArrowRight className="w-6 h-6" aria-hidden="true" />
                   </button>

                  <p className="text-center text-[9px] font-bold text-brand-accent uppercase tracking-[0.4em] animate-pulse">
                    Only 2 suites left in this category
                  </p>
                </div>
             </div>
          </div>

        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-slate-100 p-4 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
         <div>
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">From {activeTier.price}{isPG ? '/mo' : '/night'}</p>
           <p className="text-xs font-bold text-emerald-600 uppercase tracking-[0.2em]">All Serviced Included</p>
         </div>
         <button 
           onClick={handleBooking}
           className="bg-slate-900 text-white px-10 py-4 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
         >
           Reserve
         </button>
      </div>
    </div>
  );
};

export default PropertyDetail;
