import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bus as BusIcon, CreditCard, User, ShieldCheck, ArrowRight, MapPin, Calendar, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { bookingApi } from '../services/bookingApi';
import { Bus } from '../services/busApi';

const BusBooking: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { bus?: Bus, travelers?: number } | undefined;
  
  if (!state || !state.bus) {
    navigate('/buses');
    return null;
  }

  const { bus } = state;
  const travelers = state.travelers || 1;

  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAmount = Number(bus.price) * travelers;

  const handleBooking = async () => {
    if (!firstName || !lastName || !email || !phone) {
      alert("Please fill in all traveler details.");
      setStep(1);
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        type: 'bus',
        travelDate: new Date(bus.departureTime).toISOString(),
        totalAmount,
        currency: bus.currency || 'INR',
        busData: {
            ...bus,
            travelerCount: travelers,
            traveler: { firstName, lastName, email, phone },
        },
        metadata: {
            name: `${firstName} ${lastName}`,
            email: email,
            phoneNumber: phone,
        }
      };

      const res = await bookingApi.createBooking(payload);
      navigate(`/booking-success/${res.id}`, { state: { type: 'bus' } });
    } catch (error: any) {
      console.error("Booking failed:", error);
      alert(error.message || "Booking failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg pt-24 pb-32">
      <div className="max-w-5xl mx-auto px-6 space-y-12">
        
        {/* Editorial Header */}
        <div className="relative overflow-hidden bg-brand-primary rounded-[48px] p-10 md:p-16 text-white shadow-2xl">
          <BusIcon className="absolute -right-20 -bottom-20 w-80 h-80 text-white/5 rotate-12" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
            <div className="space-y-6 max-w-2xl">
              <span className="micro-label text-brand-accent-light block">Coach Reservation</span>
              <h1 className="editorial-title text-5xl md:text-7xl leading-tight">
                Secure Your <span className="serif-italic editorial-skew inline-block text-brand-accent-light">Travel</span>
              </h1>
              <p className="font-serif italic text-xl text-white/60">
                Confirm your details to finalize your premium bus journey.
              </p>
            </div>
            <div className="glass-card-dark p-8 rounded-[40px] md:min-w-[280px] text-center md:text-right border-white/5 shadow-inner">
               <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-3">Total Payable</div>
               <div className="text-5xl font-display font-extrabold text-white">
                 <span className="text-2xl text-brand-accent-light mr-1">₹</span>
                 {totalAmount.toLocaleString()}
               </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Stepper Header */}
            <div className="flex items-center gap-4 px-2">
               <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs transition-all duration-500 ${step === 1 ? 'bg-brand-accent text-white scale-110 shadow-lg shadow-brand-accent/30' : 'bg-slate-200 text-slate-500'}`}>1</div>
               <div className="h-px flex-1 bg-slate-100 max-w-[100px]" />
               <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs transition-all duration-500 ${step === 2 ? 'bg-brand-accent text-white scale-110 shadow-lg shadow-brand-accent/30' : 'bg-slate-200 text-slate-500'}`}>2</div>
               <span className="ml-4 font-display font-bold text-brand-primary uppercase tracking-widest text-xs">
                 {step === 1 ? 'Traveler Information' : 'Secure Payment'}
               </span>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="glass-card p-10 rounded-[48px] space-y-10"
                >
                  <div className="space-y-2">
                    <h3 className="text-3xl font-display font-bold text-brand-primary">Passenger <span className="serif-italic text-brand-accent">Information</span></h3>
                    <p className="text-slate-500 text-sm">Please ensure the details match the traveler's official identification.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                      <input 
                        type="text" 
                        value={firstName} onChange={e => setFirstName(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-100 rounded-3xl py-5 px-8 focus:bg-white focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent/50 outline-none font-bold text-brand-primary transition-all"
                        placeholder="Sarah"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                      <input 
                        type="text" 
                        value={lastName} onChange={e => setLastName(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-100 rounded-3xl py-5 px-8 focus:bg-white focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent/50 outline-none font-bold text-brand-primary transition-all"
                        placeholder="Smith"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                      <input 
                        type="email" 
                        value={email} onChange={e => setEmail(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-100 rounded-3xl py-5 px-8 focus:bg-white focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent/50 outline-none font-bold text-brand-primary transition-all"
                        placeholder="sarah.smith@reside.com"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                      <input 
                        type="tel" 
                        value={phone} onChange={e => setPhone(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-100 rounded-3xl py-5 px-8 focus:bg-white focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent/50 outline-none font-bold text-brand-primary transition-all"
                        placeholder="+91 88888 00000"
                      />
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <button 
                      onClick={() => setStep(2)}
                      className="bg-brand-primary hover:bg-brand-accent text-white py-5 px-12 rounded-[2rem] font-display font-bold transition-all duration-500 shadow-xl shadow-brand-primary/20 flex items-center gap-3 group"
                    >
                      <span>CONTINUE TO PAYMENT</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-card p-10 rounded-[48px] space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-3xl font-display font-bold text-brand-primary">Secure <span className="serif-italic text-brand-accent">Payment</span></h3>
                    <button onClick={() => setStep(1)} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-brand-accent transition-colors">Edit Details</button>
                  </div>

                  <div className="bg-brand-accent/5 border border-brand-accent/20 rounded-[32px] p-8 flex items-start gap-6">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-brand-accent shrink-0">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-display font-bold text-brand-primary tracking-tight">StayEase Transaction Shield</h4>
                      <p className="text-sm text-slate-600">Your reservation is secure with our encrypted payment gateway and priority support.</p>
                    </div>
                  </div>

                  <div className="space-y-6 pt-4">
                    <div className="flex items-center gap-4 text-slate-400">
                      <div className="h-px flex-1 bg-slate-100" />
                      <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Transaction Summary</span>
                      <div className="h-px flex-1 bg-slate-100" />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-slate-600 font-medium pb-4 border-b border-slate-100">
                        <span>Base Fare per Seat</span>
                        <span>₹{Number(bus.price).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-600 font-medium pb-4 border-b border-slate-100">
                        <span>Number of Travelers</span>
                        <span>x {travelers}</span>
                      </div>
                      <div className="flex justify-between items-center text-xl font-display font-extrabold text-brand-primary pt-2">
                        <span>Total Due</span>
                        <span className="text-brand-accent">₹{totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleBooking}
                    disabled={isSubmitting}
                    className="w-full py-6 bg-brand-primary hover:bg-brand-accent text-white rounded-[2rem] font-display font-bold text-lg transition-all duration-500 shadow-2xl shadow-brand-primary/30 flex justify-center items-center gap-3 disabled:opacity-50"
                  >
                    {isSubmitting ? "PROCESSING TRANSACTION..." : `RESERVE NOW · ₹${totalAmount.toLocaleString()}`}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Review Sidebar */}
          <div className="space-y-8">
            <div className="glass-card p-8 rounded-[40px] space-y-8">
              <h4 className="text-sm uppercase tracking-widest text-slate-400 font-bold border-b border-slate-100 pb-4">Trip Highlights</h4>
              
              <div className="space-y-8">
                <div className="flex items-center gap-5">
                   <div className="w-14 h-14 bg-brand-bg rounded-2xl flex items-center justify-center text-brand-accent shadow-inner">
                     <BusIcon className="w-6 h-6" />
                   </div>
                   <div>
                     <div className="text-sm font-bold text-brand-primary uppercase tracking-tight leading-tight">{bus.operator}</div>
                     <div className="text-[10px] font-bold text-slate-400 mt-0.5">{bus.busType || 'Premium Luxury'}</div>
                   </div>
                </div>

                <div className="relative pl-6 space-y-8 before:absolute before:left-[10px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-brand-accent before:to-transparent">
                  <div className="relative">
                    <div className="absolute -left-[20px] top-1.5 w-[10px] h-[10px] rounded-full border-2 border-brand-accent bg-white" />
                    <div className="text-sm font-bold text-brand-primary">{new Date(bus.departureTime).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{bus.source}</div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[20px] top-1.5 w-[10px] h-[10px] rounded-full bg-slate-300" />
                    <div className="text-sm font-bold text-brand-primary">{new Date(bus.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{bus.destination}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                   <div className="space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Bus No.</span>
                      <span className="text-xs font-bold text-brand-primary">{bus.busNumber || 'ST-909'}</span>
                   </div>
                   <div className="space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Travelers</span>
                      <span className="text-xs font-bold text-brand-primary">{travelers} Passenger</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 rounded-[40px] bg-brand-bg border-brand-primary/10 shadow-inner">
               <div className="flex items-center gap-4 mb-4">
                 <ShieldCheck className="w-6 h-6 text-brand-accent" />
                 <h5 className="font-display font-bold text-brand-primary">StayEase Exclusive</h5>
               </div>
               <ul className="space-y-3">
                 {['Luxury Recliner', 'WiFi Included', 'Safe & Sanitized'].map(perk => (
                   <li key={perk} className="flex items-center gap-3 text-xs font-medium text-brand-primary/60 italic font-serif">
                     <span className="w-1 h-1 rounded-full bg-brand-accent" /> {perk}
                   </li>
                 ))}
               </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusBooking;
