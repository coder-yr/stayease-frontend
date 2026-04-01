import React from 'react';
import { 
  Plane, 
  User, 
  MapPin, 
  ArrowRight, 
  ArrowLeft,
  ChevronDown,
  ShieldCheck,
  CreditCard,
  Mail,
  Smartphone,
  CheckCircle2,
  Zap,
  Tag
} from 'lucide-react';
import { motion } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Flight } from '../services/flightApi';
import { bookingApi } from '../services/bookingApi';

const FlightBooking: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const flightState = location.state?.flight as Flight;
  const searchState = location.state as { flight?: Flight; adults?: number };
  const travelerCount = searchState?.adults || 1;

  // Guard: if no flight data, redirect back to flights
  React.useEffect(() => {
    if (!flightState) {
      navigate('/flights', { replace: true });
    }
  }, [flightState, navigate]);

  const flightDetails = flightState ? {
    airline: flightState.airline,
    logo: flightState.logo,
    from: `${flightState.departure.city} (${flightState.departure.iata})`,
    to: `${flightState.arrival.city} (${flightState.arrival.iata})`,
    date: '24 Oct, 2024',
    departure: flightState.departure.time,
    arrival: flightState.arrival.time,
    duration: flightState.duration,
    class: flightState.class,
    fare: flightState.price,
    taxes: '₹760',
    total: `₹${(parseInt(flightState.price.replace('₹', '').replace(',', '')) + 760).toLocaleString()}`
  } : {
    airline: 'Air India',
    logo: 'https://images.unsplash.com/photo-1610337673044-720471f83677?auto=format&fit=crop&w=100&q=80',
    from: 'Bengaluru (BLR)',
    to: 'Mumbai (BOM)',
    date: '24 Oct, 2024',
    departure: '06:15',
    arrival: '08:45',
    duration: '2h 30m',
    class: 'Economy',
    fare: '₹5,840',
    taxes: '₹760',
    total: '₹6,600'
  };

  const [addons, setAddons] = React.useState({ protection: false, fastPass: false });
  const [promoCode, setPromoCode] = React.useState('');
  const [discount, setDiscount] = React.useState(0);
  const [promoStatus, setPromoStatus] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [title, setTitle] = React.useState('Mr.');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const baseFare = parseInt(flightDetails.fare.replace(/[^\d]/g, ''));
  const taxes = 760;
  const addonCost = (addons.protection ? 499 : 0) + (addons.fastPass ? 199 : 0);
  const totalAmount = baseFare + taxes + addonCost - discount;

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      setPromoStatus({ type: 'error', message: 'Please enter a promo code.' });
      return;
    }
    if (promoCode.toUpperCase() === 'STAYEASE') {
      setDiscount(500);
      setPromoStatus({ type: 'success', message: '₹500 discount applied! Code STAYEASE accepted.' });
    } else {
      setDiscount(0);
      setPromoStatus({ type: 'error', message: `"${promoCode}" is not a valid promo code.` });
    }
  };

  const handleBooking = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
      alert("Please fill in all traveler details (Name, Email, Phone).");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        type: 'flight',
        travelDate: new Date().toISOString(), // Backend expects a proper ISO date
        totalAmount: totalAmount,
        currency: 'INR',
        flightData: {
            ...flightDetails,
            travelerCount,
            traveler: { title, firstName, lastName, email, phone },
            addons,
            discount
        },
        metadata: {
            name: `${title} ${firstName} ${lastName}`,
            email: email,
            phoneNumber: phone,
        }
      };

      const res = await bookingApi.createBooking(payload);
      navigate(`/booking-success/${res.id}`, { state: { type: 'flight' } });
    } catch (error: any) {
      console.error("Booking failed:", error);
      let errMsg = "Something went wrong while confirming your booking. Please try again.";
      try {
        const errorData = JSON.parse(error.message);
        if (errorData && errorData.message) {
          errMsg = errorData.message;
        }
      } catch (e) {
        if (error.response?.data?.message) {
          errMsg = error.response.data.message;
        } else if (typeof error === 'string') {
          errMsg = error;
        } else if (error.message) {
          errMsg = error.message;
        }
      }
      alert(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 overflow-x-hidden pb-32 lg:pb-0">
      {/* Journey Header */}
      <div className="bg-brand-primary text-white pt-24 md:pt-40 pb-12 md:pb-20 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none hidden md:block">
          <Plane className="w-[800px] h-full rotate-12 transform translate-x-1/4" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12">
          <div className="space-y-4 md:space-y-8">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[8px] md:text-[10px] font-bold text-brand-accent uppercase tracking-[0.3em] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
              Back to Results
            </button>
            <div className="space-y-2 md:space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-brand-accent shadow-[0_0_10px_rgba(5,150,105,0.8)]"></span>
                <span className="text-[8px] md:text-[10px] font-bold text-white/50 uppercase tracking-[0.4em]">Flight Booking in Progress</span>
              </div>
              <h1 className="text-3xl md:text-8xl font-display font-bold uppercase tracking-tighter leading-[0.9]">
                {flightDetails.from.split(' (')[0]} <span className="text-white/20 italic font-serif inline-block px-1 md:px-4 leading-none">to</span> <br className="md:hidden" /> {flightDetails.to.split(' (')[0]}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4 md:gap-8 bg-white/5 backdrop-blur-xl p-4 md:p-8 rounded-[24px] md:rounded-[40px] border border-white/10 w-fit">
            <div className="text-center shrink-0">
              <p className="text-[8px] md:text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Departure</p>
              <p className="text-base md:text-xl font-bold uppercase tabular-nums">{flightDetails.departure}</p>
            </div>
            <div className="w-px h-8 md:h-12 bg-white/10"></div>
            <div className="text-center shrink-0">
              <p className="text-[8px] md:text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Travelers</p>
              <p className="text-base md:text-xl font-bold uppercase">{String(travelerCount).padStart(2, '0')} {travelerCount === 1 ? 'Adult' : 'Adults'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 py-10 md:py-20 flex flex-col lg:grid lg:grid-cols-12 gap-10 md:gap-16">
        {/* Left Column: Forms */}
        <div className="lg:col-span-8 space-y-10 md:space-y-16">
          
          {/* Mobile Journey Recap (Horizontal) */}
          <div className="lg:hidden bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                <Plane className="w-6 h-6 text-brand-accent" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">{flightDetails.airline}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{flightDetails.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-display font-bold text-slate-900 tabular-nums">₹{totalAmount.toLocaleString()}</p>
              <button className="text-[10px] font-bold text-brand-accent uppercase tracking-widest">Details</button>
            </div>
          </div>

          {/* Passenger Section */}
          <section className="space-y-6 md:space-y-10">
            <div className="flex items-center gap-4 px-2">
              <div className="w-10 h-10 md:w-16 md:h-16 rounded-[20px] md:rounded-[24px] bg-brand-primary text-white flex items-center justify-center">
                <User className="w-5 h-5 md:w-8 md:h-8" />
              </div>
              <div>
                <h2 className="text-xl md:text-3xl font-display font-bold text-slate-900 uppercase tracking-tight">Lead Traveler</h2>
                <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Adult 1 (Primary Traveler)</p>
              </div>
            </div>

            <div className="bg-white rounded-[32px] md:rounded-[48px] p-8 md:p-12 border border-slate-100 shadow-sm space-y-8 md:space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                <div className="md:col-span-3 space-y-3">
                  <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Title</label>
                  <div className="relative">
                    <select 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl md:rounded-[32px] px-6 md:px-8 py-4 md:py-6 text-xs md:text-sm font-bold uppercase tracking-widest outline-none focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent appearance-none"
                    >
                      <option>Mr.</option>
                      <option>Ms.</option>
                      <option>Dr.</option>
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="md:col-span-4 space-y-3">
                  <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">First Name</label>
                  <input 
                    type="text" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. ARYA"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl md:rounded-[32px] px-6 md:px-8 py-4 md:py-6 text-xs md:text-sm font-bold uppercase tracking-widest focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent transition-all outline-none"
                  />
                </div>
                <div className="md:col-span-5 space-y-3">
                  <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Last Name</label>
                  <input 
                    type="text" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. STARK"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl md:rounded-[32px] px-6 md:px-8 py-4 md:py-6 text-xs md:text-sm font-bold uppercase tracking-widest focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent transition-all outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pt-8 md:pt-12 border-t border-slate-50">
                <div className="space-y-4">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Communication Email</label>
                  <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-accent" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="YOU@EXAMPLE.COM"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl md:rounded-[32px] pl-16 pr-8 py-4 md:py-6 text-xs md:text-sm font-bold uppercase tracking-widest focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent transition-all outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Mobile Number</label>
                  <div className="relative">
                    <Smartphone className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-accent" />
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl md:rounded-[32px] pl-16 pr-8 py-4 md:py-6 text-xs md:text-sm font-bold tabular-nums tracking-widest focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Add-ons Section */}
          <section className="space-y-6 md:space-y-10 text-[10px] font-bold">
            <div className="flex items-center gap-4 px-2">
              <div className="w-10 h-10 md:w-16 md:h-16 rounded-[20px] md:rounded-[24px] bg-brand-primary text-white flex items-center justify-center">
                <Tag className="w-5 h-5 md:w-8 md:h-8" />
              </div>
              <h2 className="text-xl md:text-3xl font-display font-bold text-slate-900 uppercase tracking-tight">Enhance Journey</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-8 md:p-10 rounded-[32px] md:rounded-[48px] border border-slate-100 shadow-sm cursor-pointer group hover:bg-brand-accent/5 transition-all"
              >
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-14 h-14 md:w-20 md:h-20 rounded-[20px] md:rounded-[28px] bg-white border border-slate-100 flex items-center justify-center group-hover:bg-brand-accent transition-colors duration-500">
                    <ShieldCheck className="w-6 h-6 md:w-10 md:h-10 text-brand-accent group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm md:text-lg font-bold text-slate-900 uppercase">Protection</h3>
                    <p className="text-[9px] md:text-[10px] font-bold text-brand-accent uppercase tracking-widest mt-1">+ ₹499 pp</p>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-slate-500 font-serif italic mb-8 leading-relaxed">Full coverage for medical emergencies and baggage loss during flight.</p>
                <button 
                  onClick={() => setAddons(prev => ({ ...prev, protection: !prev.protection }))}
                  className={`w-full py-4 text-[9px] md:text-[10px] font-bold rounded-2xl md:rounded-[32px] border transition-all uppercase tracking-widest ${addons.protection ? 'bg-brand-accent text-white border-brand-accent' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-brand-accent'}`}
                >
                  {addons.protection ? 'Protection Added' : 'Add Protection'}
                </button>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-8 md:p-10 rounded-[32px] md:rounded-[48px] border border-slate-100 shadow-sm cursor-pointer group hover:bg-sky-50/30 transition-all"
              >
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-14 h-14 md:w-20 md:h-20 rounded-[20px] md:rounded-[28px] bg-white border border-slate-100 flex items-center justify-center group-hover:bg-sky-600 transition-colors duration-500">
                    <Zap className="w-6 h-6 md:w-10 md:h-10 text-sky-600 group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm md:text-lg font-bold text-slate-900 uppercase">Fast Pass</h3>
                    <p className="text-[9px] md:text-[10px] font-bold text-sky-600 uppercase tracking-widest mt-1">Starts ₹199</p>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-slate-500 font-serif italic mb-8 leading-relaxed">Priority check-in and faster security clearance at Bengaluru airport.</p>
                <button 
                  onClick={() => setAddons(prev => ({ ...prev, fastPass: !prev.fastPass }))}
                  className={`w-full py-4 text-[9px] md:text-[10px] font-bold rounded-2xl md:rounded-[32px] border transition-all uppercase tracking-widest ${addons.fastPass ? 'bg-sky-600 text-white border-sky-600' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-sky-600'}`}
                >
                  {addons.fastPass ? 'Seat Selected' : 'Add Preferred Seat'}
                </button>
              </motion.div>
            </div>
          </section>

          {/* Desktop Payment Button */}
          <div className="hidden lg:block pt-16 border-t border-slate-100">
            <button 
              onClick={handleBooking}
              disabled={isSubmitting}
              className={`w-full text-white p-10 rounded-[48px] font-bold text-[16px] tracking-[0.5em] uppercase hover:bg-brand-accent transition-all duration-700 flex items-center justify-center gap-8 shadow-2xl hover:shadow-brand-accent/30 active:scale-95 group ${isSubmitting ? 'bg-slate-400 cursor-not-allowed opacity-70' : 'bg-slate-900'}`}
              aria-label={`Pay ₹${totalAmount.toLocaleString()} and confirm booking`}
            >
              {isSubmitting ? 'PROCESSING...' : 'PROCEED TO PAYMENT'}
              {!isSubmitting && <CreditCard className="w-8 h-8 group-hover:translate-x-2 transition-transform duration-500" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Right Column: Pricing Summary */}
        <div className="lg:col-span-4 h-fit space-y-10 order-first lg:order-last">
          <div className="sticky top-40 space-y-8">
            <div className="bg-brand-primary rounded-[32px] md:rounded-[48px] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-accent/10 rounded-full blur-[100px] -mr-24 -mt-24"></div>
              
              <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em] mb-12">Fare Details</h2>
              
              <div className="space-y-10 relative z-10">
                <div className="flex items-center justify-between pb-8 border-b border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-all duration-500">
                      <Plane className="w-6 h-6 text-brand-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">{flightDetails.airline}</p>
                      <p className="text-xs font-bold uppercase tracking-widest">{flightDetails.class}</p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-brand-accent" />
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center text-[11px] font-bold text-white/40 uppercase tracking-[0.2em]">
                    <span>Base Fare</span>
                    <span className="text-white tabular-nums">{flightDetails.fare}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-bold text-white/40 uppercase tracking-[0.2em]">
                    <span>Surcharges</span>
                    <span className="text-white tabular-nums">₹{taxes.toLocaleString()}</span>
                  </div>
                  {addonCost > 0 && (
                    <div className="flex justify-between items-center text-[11px] font-bold text-emerald-400 uppercase tracking-[0.2em] animate-in fade-in slide-in-from-top-1">
                      <span>Add-ons</span>
                      <span className="tabular-nums">+ ₹{addonCost.toLocaleString()}</span>
                    </div>
                  )}
                  {discount > 0 && (
                    <div className="flex justify-between items-center text-[11px] font-bold text-rose-400 uppercase tracking-[0.2em] animate-in fade-in slide-in-from-top-1">
                      <span>Discount</span>
                      <span className="tabular-nums">- ₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="pt-10 border-t border-white/10 flex justify-between items-end">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">Total Payment</span>
                      <div className="text-5xl font-display font-bold text-brand-accent tracking-tighter leading-none">₹{totalAmount.toLocaleString()}</div>
                    </div>
                    <Zap className="w-8 h-8 text-brand-accent/50" />
                  </div>
                </div>

                <div className="pt-10 flex items-center gap-4 border-t border-white/5">
                  <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] leading-relaxed">StayEase Protection<br/>included in fare</p>
                </div>
              </div>
            </div>

            {/* Offers card */}
            <div className="bg-white rounded-[32px] md:rounded-[48px] p-8 md:p-10 border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-4">
                <Tag className="w-5 h-5 text-brand-accent" />
                <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.3em]">Promo Code</h4>
              </div>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="TRY 'STAYEASE'" 
                  value={promoCode}
                  onChange={(e) => { setPromoCode(e.target.value); setPromoStatus(null); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                  className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-4 focus:ring-brand-accent/5 focus:border-brand-accent transition-all"
                  aria-label="Enter promo code"
                />
                <button 
                  onClick={handleApplyPromo}
                  className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[9px] font-bold uppercase tracking-widest hover:bg-brand-accent transition-all"
                >
                  Apply
                </button>
              </div>
              {/* Inline promo status instead of alert() */}
              {promoStatus && (
                <p className={`text-[10px] font-bold uppercase tracking-widest mt-2 ${promoStatus.type === 'success' ? 'text-brand-accent' : 'text-rose-500'}`}>
                  {promoStatus.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button (Mobile Only) */}
      <div className="lg:hidden fixed bottom-24 left-4 right-4 z-40">
        <button 
          onClick={handleBooking}
          disabled={isSubmitting}
          className={`w-full text-white rounded-[32px] p-6 shadow-2xl flex items-center justify-between active:scale-[0.98] transition-all ${isSubmitting ? 'bg-slate-500 opacity-70 cursor-not-allowed' : 'bg-slate-900'}`}
          aria-label={`Pay ₹${totalAmount.toLocaleString()} and confirm booking`}
        >
          <div className="text-left">
            <p className="text-[8px] font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Total to Pay</p>
            <p className="text-2xl font-display font-bold tabular-nums">₹{totalAmount.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">{isSubmitting ? 'WAIT...' : 'Pay Now'}</span>
            {!isSubmitting && (
              <div className="w-10 h-10 rounded-full bg-brand-accent flex items-center justify-center">
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};

export default FlightBooking;
