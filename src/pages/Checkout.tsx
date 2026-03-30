import React from 'react';
import { 
  CheckCircle2, 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  Info, 
  Calendar, 
  Users, 
  MapPin, 
  Star, 
  ArrowRight, 
  Smartphone, 
  Wallet,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { propertyApi, Property } from '../services/propertyApi';
import { bookingApi } from '../services/bookingApi';
import { getAccessToken } from '../services/apiClient';
import Toast, { useToast } from '../components/Toast';

// Moved to top to avoid hoisting issues
const GraduationCap = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    aria-hidden="true"
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);

const Checkout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toasts, addToast, dismiss } = useToast();
  const [step, setStep] = React.useState(1);
  const [property, setProperty] = React.useState<Property | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const [coupon, setCoupon] = React.useState('');
  const [hasAuthToken, setHasAuthToken] = React.useState(!!getAccessToken());
  
  const [searchParams] = useSearchParams();
  
  // Booking dates from URL
  const [checkInDate] = React.useState(searchParams.get('checkIn') || '2026-10-24');
  const [checkOutDate] = React.useState(searchParams.get('checkOut') || '2026-10-31');
  const [tier] = React.useState('deluxe'); 

  // Step 2 form state
  const [form, setForm] = React.useState({ 
    name: '', 
    email: '', 
    university: '', 
    studentId: '',
    phoneNumber: '',
    specialRequests: ''
  });

  // Step 3 card state
  const [card, setCard] = React.useState({ number: '', expiry: '', cvv: '' });

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

  // Keep auth state in sync if token changes after sign-in.
  React.useEffect(() => {
    const syncAuthToken = () => setHasAuthToken(!!getAccessToken());

    syncAuthToken();
    window.addEventListener('storage', syncAuthToken);
    window.addEventListener('focus', syncAuthToken);

    return () => {
      window.removeEventListener('storage', syncAuthToken);
      window.removeEventListener('focus', syncAuthToken);
    };
  }, []);

  // Show one-time guidance only when there is no token.
  React.useEffect(() => {
    if (!hasAuthToken) {
      // Log helpful instructions to console
      console.log(
        '%c📌 TESTING CHECKOUT WITHOUT LOGIN PAGE',
        'font-size: 16px; font-weight: bold; color: #ef4444;'
      );
      console.log(
        '%cTo test the booking flow, you need an auth token:\n\n' +
        '1️⃣  Get a token from signup:\n' +
        '   curl -X POST http://localhost:4000/api/auth/signup \\\n' +
        '     -H "Content-Type: application/json" \\\n' +
        '     -d "{\n' +
        '       \\"email\\": \\"test@university.edu\\",\n' +
        '       \\"password\\": \\"Test123!@#\\",\n' +
        '       \\"name\\": \\"Test Student\\"\n' +
        '     }"\n\n' +
        '2️⃣  Copy the "accessToken" from the response\n\n' +
        '3️⃣  Paste in the console:\n' +
        '   localStorage.setItem("accessToken", "your_token_here")\n\n' +
        '4️⃣  Reload this page and complete the booking!\n\n' +
        'Or navigate directly to: http://localhost:5173/checkout/cmnbl1zds0000vp5choiit8eb',
        'font-size: 12px; color: #666; line-height: 1.6; white-space: pre-wrap; font-family: monospace;'
      );
      addToast('error', 'Authentication Required', 'You need to sign in first. See console for testing instructions.');
    }
  }, [hasAuthToken, addToast]);

  const steps = [
    { id: 1, name: 'REVIEW', icon: Calendar },
    { id: 2, name: 'DETAILS', icon: Users },
    { id: 3, name: 'PAYMENT', icon: CreditCard },
  ];

  const isPG = React.useMemo(() => {
    if (!property) return false;
    const cat = property.category?.toLowerCase() || '';
    const name = property.name.toLowerCase();
    return cat.includes('student') || cat.includes('pg') || cat.includes('coliving') || name.includes('residence') || name.includes('sanctuary');
  }, [property]);

  const nights = React.useMemo(() => {
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diff = end.getTime() - start.getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [checkInDate, checkOutDate]);

  const pricing = React.useMemo(() => {
    if (!property) return { base: 0, service: 0, tax: 0, deposit: 0, discount: 0, total: 0 };
    
    const baseInr = property.price * (property.price < 500 ? 84 : 1);
    
    if (isPG) {
      const base = baseInr; // Monthly rent
      const service = 1200;
      const deposit = baseInr * 0.2;
      const discount = 3500;
      return { base, service, tax: 0, deposit, discount, total: base + service + deposit - discount };
    } else {
      const base = baseInr * nights;
      const service = 1500;
      const tax = base * 0.12;
      const discount = 0;
      return { base, service, tax, deposit: 0, discount, total: base + service + tax - discount };
    }
  }, [property, isPG, nights]);

  const totalAmount = pricing.total;

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center space-y-8">
        <div className="w-24 h-24 border-4 border-slate-100 border-t-brand-accent rounded-full animate-spin" aria-hidden="true"></div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] animate-pulse">Establishing secure connection...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center space-y-8">
        <AlertCircle className="w-16 h-16 text-rose-400" aria-hidden="true" />
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">Sanctuary not found...</p>
        <button onClick={() => navigate('/hotels')} className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-brand-accent transition-all">Return to discovery</button>
      </div>
    );
  }


  const handleStep2Continue = () => {
    const commonFields = form.name.trim() && form.email.trim() && /\S+@\S+\.\S+/.test(form.email);
    
    if (!commonFields) {
      addToast('error', 'Invalid Details', 'Please provide a valid name and email address.');
      return;
    }

    if (isPG) {
      if (!form.university.trim() || !form.studentId.trim()) {
        addToast('error', 'Missing Details', 'Please provide your University and Student ID.');
        return;
      }
    } else {
      if (!form.phoneNumber.trim()) {
        addToast('error', 'Missing Details', 'Please provide a contact phone number.');
        return;
      }
    }

    setStep(3);
  };

  const handlePayment = async () => {
    // Check auth token first
    if (!hasAuthToken) {
      addToast('error', 'Not Signed In', 'Please sign up or log in to complete your booking. Use the development console to test with a token.');
      return;
    }

    if (!card.number.trim() || card.number.replace(/\s/g, '').length < 16) {
      addToast('error', 'Invalid Card', 'Please enter a valid 16-digit card number.');
      return;
    }
    if (!card.expiry.trim() || !/^\d{2}\/\d{2}$/.test(card.expiry)) {
      addToast('error', 'Invalid Expiry', 'Please enter expiry in MM/YY format.');
      return;
    }
    if (!card.cvv.trim() || card.cvv.length < 3) {
      addToast('error', 'Invalid CVV', 'Please enter a valid CVV code.');
      return;
    }
    if (!termsAccepted) {
      addToast('error', 'Terms Required', 'Please accept the Terms of Service to proceed.');
      return;
    }

    setSubmitting(true);
    try {
      setHasAuthToken(!!getAccessToken());
      const diffTime = Math.abs(new Date(checkOutDate).getTime() - new Date(checkInDate).getTime());
      const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const booking = await bookingApi.createBooking({
        type: isPG ? 'pg' : 'hotel',
        travelDate: new Date(checkInDate).toISOString(),
        hotelId: id!,
        totalAmount,
        currency: 'INR',
        metadata: {
          name: form.name,
          email: form.email,
          ...(isPG ? {
            university: form.university,
            studentId: form.studentId,
          } : {
            phoneNumber: form.phoneNumber,
            specialRequests: form.specialRequests,
          }),
          tier,
          nights,
          checkInDate: checkInDate,
          checkOutDate: checkOutDate
        }
      });

      addToast('success', 'Booking Confirmed', 'Your booking has been created successfully!');
      navigate(`/booking-success/${booking.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create booking';
      
      // Check if it's an auth error
      if (message.includes('401') || message.includes('token') || message.includes('Unauthorized')) {
        addToast('error', 'Authentication Error', 'Your session has expired. Please sign in again.');
        setHasAuthToken(false);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('jwt');
      } else {
        addToast('error', 'Booking Error', message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <Toast toasts={toasts} onDismiss={dismiss} />

      {/* Auth Warning Banner */}
      {!hasAuthToken && (
        <div className="bg-rose-50 border-b-2 border-rose-200 px-6 py-6">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <AlertCircle className="w-6 h-6 text-rose-500 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold text-rose-900 text-sm uppercase tracking-wider mb-1">
                Account Sign-In Required
              </h3>
              <p className="text-rose-700 text-xs">
                You need to sign in to complete your booking. 
                {' '}<code className="bg-rose-100 px-2 py-1 rounded text-[10px]">localStorage.setItem('accessToken', 'your_token')</code>
                {' '}in the console to test, or create an account via the signup API.
              </p>
            </div>
            <button 
              onClick={() => navigate('/hotels')}
              className="px-6 py-2 bg-rose-600 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-rose-700 transition-colors flex-shrink-0"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="bg-white border-b border-slate-100 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors text-xs font-bold tracking-widest uppercase"
            aria-label="Go back"
          >
            <ArrowRight className="w-4 h-4 rotate-180" aria-hidden="true" />
            Back
          </button>
          
          <div className="flex items-center gap-12 relative" role="progressbar" aria-label="Checkout steps" aria-valuenow={step} aria-valuemin={1} aria-valuemax={3}>
            <div className="absolute top-5 left-0 w-full h-px bg-slate-100 z-0" aria-hidden="true"></div>
            {steps.map((s) => (
              <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
                <motion.div 
                  initial={false}
                  animate={{ 
                    scale: step === s.id ? 1.1 : 1,
                    backgroundColor: step >= s.id ? 'var(--color-brand-accent)' : '#ffffff',
                    borderColor: step >= s.id ? 'var(--color-brand-accent)' : '#e2e8f0',
                    color: step >= s.id ? '#ffffff' : '#cbd5e1'
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 shadow-sm"
                  aria-label={`Step ${s.id}: ${s.name}${step > s.id ? ' (completed)' : step === s.id ? ' (current)' : ''}`}
                >
                  {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : <s.icon className="w-4 h-4" />}
                </motion.div>
                <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${step >= s.id ? 'text-slate-900' : 'text-slate-300'}`}>
                  {s.name}
                </span>
              </div>
            ))}
          </div>

          <div className="w-24 hidden md:block" aria-hidden="true"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Form Area */}
          <div className="lg:col-span-8 space-y-12">

            {/* ── STEP 1: REVIEW ── */}
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-1 h-8 bg-brand-accent rounded-full" aria-hidden="true"></div>
                    <h2 className="text-3xl font-display font-bold text-slate-900 uppercase tracking-tight">Review your stay</h2>
                  </div>
                  
                  <div className="bg-slate-50 rounded-[40px] p-10 border border-slate-100 flex flex-col md:flex-row gap-10">
                    <div className="w-full md:w-48 h-48 rounded-[32px] overflow-hidden shadow-2xl flex-shrink-0">
                      <img src={property.image} alt={property.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="flex-1 space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="text-2xl font-display font-bold text-slate-900">{property.name}</h3>
                          <div className="flex items-center gap-1.5 text-sm font-bold text-brand-accent bg-white px-3 py-1.5 rounded-xl shadow-sm" aria-label={`Rating: ${property.rating}`}>
                            <Star className="w-4 h-4 fill-brand-accent" aria-hidden="true" />
                            {property.rating}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                          <MapPin className="w-4 h-4 text-brand-accent" aria-hidden="true" />
                          {property.location}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200/50">
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Check-in</span>
                          <div className="text-lg font-bold text-slate-900">
                            {new Date(checkInDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Check-out</span>
                          <div className="text-lg font-bold text-slate-900">
                            {new Date(checkOutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-brand-accent/5 rounded-[32px] p-8 border border-brand-accent/20 flex items-start gap-6">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-accent shadow-sm flex-shrink-0">
                    <Info className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-brand-primary uppercase tracking-widest text-xs">Cancellation Policy</h4>
                    <p className="text-sm text-brand-primary/60 leading-relaxed italic font-serif">
                      <span className="font-bold">Free cancellation until Oct 20.</span> After that, cancel before Oct 22 for a 50% refund.
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setStep(2)}
                  className="w-full bg-slate-900 text-white py-6 rounded-[24px] font-bold text-sm tracking-[0.2em] uppercase shadow-2xl hover:bg-brand-accent transition-all flex items-center justify-center gap-3"
                >
                  CONTINUE TO DETAILS
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </button>
              </motion.div>
            )}

            {/* ── STEP 2: DETAILS ── */}
            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                <div className="space-y-10">
                  <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-display font-bold text-slate-900 uppercase tracking-tight">{isPG ? 'Student Details' : 'Guest Details'}</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {isPG ? (
                      [
                        { label: 'Full Name', key: 'name', type: 'text', placeholder: 'John Doe' },
                        { label: 'Email Address', key: 'email', type: 'email', placeholder: 'john@university.edu' },
                        { label: 'University Name', key: 'university', type: 'text', placeholder: 'Your University' },
                        { label: 'Student ID Number', key: 'studentId', type: 'text', placeholder: 'ID Number' },
                      ]
                    ) : (
                      [
                        { label: 'Full Name', key: 'name', type: 'text', placeholder: 'John Doe' },
                        { label: 'Email Address', key: 'email', type: 'email', placeholder: 'john@example.com' },
                        { label: 'Phone Number', key: 'phoneNumber', type: 'tel', placeholder: '+1 (555) 000-0000' },
                        { label: 'Special Requests', key: 'specialRequests', type: 'text', placeholder: 'Late check-in, etc.' },
                      ]
                    ).map(({ label, key, type, placeholder }) => (
                      <div key={key} className="space-y-3">
                        <label htmlFor={`field-${key}`} className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">{label}</label>
                        <input
                          id={`field-${key}`}
                          type={type}
                          placeholder={placeholder}
                          value={form[key as keyof typeof form]}
                          onChange={(e) => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent focus:bg-white transition-all outline-none"
                          required
                          aria-required="true"
                        />
                      </div>
                    ))}
                  </div>

                  {isPG && (
                    <div className="bg-brand-accent/5 rounded-[32px] p-8 border border-brand-accent/20 flex items-start gap-6">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-accent shadow-sm flex-shrink-0">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-brand-primary uppercase tracking-widest text-xs">Student Discount Applied!</h4>
                        <p className="text-sm text-brand-primary/60 leading-relaxed italic font-serif">
                          Your student status has been verified. You've saved <span className="font-bold">₹3,500</span> on this booking.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-6">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex-1 bg-white text-slate-400 py-6 rounded-[24px] font-bold text-xs tracking-[0.2em] uppercase border border-slate-100 hover:bg-slate-50 hover:text-slate-900 transition-all"
                  >
                    BACK
                  </button>
                  <button 
                    onClick={handleStep2Continue}
                    className="flex-[2] bg-slate-900 text-white py-6 rounded-[24px] font-bold text-sm tracking-[0.2em] uppercase shadow-2xl hover:bg-brand-accent transition-all flex items-center justify-center gap-3"
                  >
                    PROCEED TO PAYMENT
                    <ArrowRight className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: PAYMENT ── */}
            {step === 3 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                <div className="space-y-10">
                  <div className="flex items-center gap-4">
                    <div className="w-1 h-8 bg-brand-accent rounded-full" aria-hidden="true"></div>
                    <h2 className="text-3xl font-display font-bold text-slate-900 uppercase tracking-tight">Payment Options</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" role="group" aria-label="Payment method">
                    <button className="p-8 border-2 border-slate-900 bg-slate-900 text-white rounded-[32px] flex flex-col items-center gap-4 transition-all shadow-2xl" aria-pressed="true">
                      <CreditCard className="w-8 h-8" aria-hidden="true" />
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase">CARD</span>
                    </button>
                    <button className="p-8 border-2 border-slate-50 hover:border-emerald-100 bg-slate-50 rounded-[32px] flex flex-col items-center gap-4 transition-all group" aria-pressed="false">
                      <Smartphone className="w-8 h-8 text-slate-300 group-hover:text-emerald-600 transition-colors" aria-hidden="true" />
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 group-hover:text-slate-900 transition-colors">APPLE PAY</span>
                    </button>
                    <button className="p-8 border-2 border-slate-50 hover:border-emerald-100 bg-slate-50 rounded-[32px] flex flex-col items-center gap-4 transition-all group" aria-pressed="false">
                      <Wallet className="w-8 h-8 text-slate-300 group-hover:text-emerald-600 transition-colors" aria-hidden="true" />
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 group-hover:text-slate-900 transition-colors">CRYPTO</span>
                    </button>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label htmlFor="card-number" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Card Number</label>
                      <div className="relative">
                        <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" aria-hidden="true" />
                        <input
                          id="card-number"
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                          value={card.number}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                            setCard(prev => ({ ...prev, number: val.replace(/(.{4})/g, '$1 ').trim() }));
                          }}
                          className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent focus:bg-white transition-all outline-none"
                          aria-required="true"
                          inputMode="numeric"
                          autoComplete="cc-number"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label htmlFor="card-expiry" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Expiry Date</label>
                        <input
                          id="card-expiry"
                          type="text"
                          placeholder="MM/YY"
                          maxLength={5}
                          value={card.expiry}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, '');
                            if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2, 4);
                            setCard(prev => ({ ...prev, expiry: val }));
                          }}
                          className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent focus:bg-white transition-all outline-none"
                          aria-required="true"
                          inputMode="numeric"
                          autoComplete="cc-exp"
                        />
                      </div>
                      <div className="space-y-3">
                        <label htmlFor="card-cvv" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">CVV</label>
                        <div className="relative">
                          <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" aria-hidden="true" />
                          <input
                            id="card-cvv"
                            type="password"
                            placeholder="***"
                            maxLength={4}
                            value={card.cvv}
                            onChange={(e) => setCard(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                            className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent focus:bg-white transition-all outline-none"
                            aria-required="true"
                            inputMode="numeric"
                            autoComplete="cc-csc"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100 flex items-center gap-6">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-accent shadow-sm flex-shrink-0">
                      <ShieldCheck className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 uppercase tracking-widest text-[10px]">Secure Encryption</h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-medium">
                        Your payment information is encrypted with industry-standard 256-bit SSL.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Coupon code */}
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="COUPON CODE" 
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                      className="w-full pl-6 pr-24 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-bold tracking-widest uppercase focus:ring-2 focus:ring-brand-accent focus:bg-white transition-all outline-none"
                      aria-label="Enter coupon code"
                    />
                    <button
                      className="absolute right-2 top-2 bottom-2 px-4 bg-slate-900 text-white rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-brand-accent transition-colors"
                      onClick={() => {
                        if (!coupon.trim()) { addToast('error', 'No Code', 'Please enter a coupon code.'); return; }
                        addToast('error', 'Invalid Code', `"${coupon}" is not a valid promo code.`);
                      }}
                    >
                      APPLY
                    </button>
                  </div>

                  {/* Terms checkbox */}
                  <div className="flex items-start gap-4 bg-slate-50 p-6 rounded-[24px] border border-slate-100">
                    <input 
                      type="checkbox" 
                      id="terms" 
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded-md border-slate-200 text-brand-accent focus:ring-brand-accent cursor-pointer accent-green-600"
                      aria-required="true"
                    />
                    <label htmlFor="terms" className="text-xs text-slate-500 leading-relaxed font-medium cursor-pointer">
                      I agree to the <span className="text-brand-accent font-bold underline">Terms of Service</span>, <span className="text-brand-accent font-bold underline">Privacy Policy</span>, and the <span className="text-brand-accent font-bold underline">Cancellation Policy</span> of StayEase.
                    </label>
                  </div>

                  <div className="flex gap-6">
                    <button 
                      onClick={() => setStep(2)}
                      className="flex-1 bg-white text-slate-400 py-6 rounded-[24px] font-bold text-xs tracking-[0.2em] uppercase border border-slate-100 hover:bg-slate-50 hover:text-slate-900 transition-all"
                    >
                      BACK
                    </button>
                    <button 
                      onClick={handlePayment}
                      disabled={submitting}
                      className="flex-[2] bg-slate-900 text-white py-6 rounded-[24px] font-bold text-sm tracking-[0.2em] uppercase shadow-2xl hover:bg-brand-accent transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          PROCESSING...
                        </>
                      ) : (
                        <>
                          CONFIRM &amp; PAY ₹{totalAmount.toLocaleString()}
                          <Lock className="w-5 h-5" aria-hidden="true" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-40 space-y-8">
              <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 p-10 space-y-10">
                <div className="space-y-2">
                  <h3 className="text-xl font-display font-bold text-slate-900 uppercase tracking-tight">Price Summary</h3>
                  <div className="w-12 h-1 bg-brand-accent rounded-full" aria-hidden="true"></div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-400 uppercase tracking-widest text-[10px]">{isPG ? 'Base Rent' : `${nights} Night Stay`}</span>
                    <span className="text-slate-900 font-bold">₹{pricing.base.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-400 uppercase tracking-widest text-[10px]">Service Fee</span>
                    <span className="text-slate-900 font-bold">₹{pricing.service.toLocaleString()}</span>
                  </div>
                  {isPG ? (
                    <>
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-slate-400 uppercase tracking-widest text-[10px]">Security Deposit</span>
                        <span className="text-slate-900 font-bold">₹{pricing.deposit.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-brand-accent uppercase tracking-widest text-[10px]">Student Discount</span>
                        <span className="text-brand-accent">-₹{pricing.discount.toLocaleString()}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-slate-400 uppercase tracking-widest text-[10px]">Tax & VAT (12%)</span>
                      <span className="text-slate-900 font-bold">₹{pricing.tax.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="pt-8 border-t border-slate-100 flex justify-between items-end">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Total Amount</span>
                      <div className="text-3xl font-display font-bold text-slate-900" aria-live="polite">₹{totalAmount.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-8 border-t border-slate-50">
                    {['Instant Confirmation', 'No Hidden Fees', 'Secure Checkout'].map(item => (
                      <div key={item} className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <div className="w-2 h-2 bg-brand-accent rounded-full" aria-hidden="true"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 rounded-[40px] p-10 text-white space-y-8 relative overflow-hidden group cursor-pointer" onClick={() => navigate('/support')}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-brand-accent/40 transition-all duration-500" aria-hidden="true"></div>
                <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-brand-accent border border-white/10">
                    <Info className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h4 className="text-xl font-display font-bold uppercase tracking-tight">Need Assistance?</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    Our support team is available 24/7 to help you with your booking.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-brand-accent font-bold text-[10px] uppercase tracking-widest relative z-10">
                  Contact Support <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
