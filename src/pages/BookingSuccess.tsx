import React from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  Share2, 
  LayoutDashboard,
  Calendar,
  MapPin,
  Clock,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate, useParams } from 'react-router-dom';
import { propertyApi, Property } from '../services/propertyApi';
import { bookingApi, Booking } from '../services/bookingApi';

const BookingSuccess: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = React.useState<Booking | null>(null);
  const [property, setProperty] = React.useState<Property | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchBooking = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const bookingData = await bookingApi.getBooking(id);
        setBooking(bookingData);
        
        // Fetch property details
        if (bookingData.hotelId) {
          const propData = await propertyApi.getPropertyById(bookingData.hotelId);
          setProperty(propData || null);
        }
      } catch (error) {
        console.error('Failed to fetch booking:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center space-y-8">
        <div className="w-24 h-24 border-4 border-slate-100 border-t-brand-accent rounded-full animate-spin" aria-hidden="true"></div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] animate-pulse">Loading confirmation details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center space-y-8">
        <AlertCircle className="w-16 h-16 text-rose-400" aria-hidden="true" />
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">Booking not found...</p>
        <button onClick={() => navigate('/hotels')} className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-brand-accent transition-all">Return to discovery</button>
      </div>
    );
  }

  // Format check-in date from booking.travelDate
  const formattedCheckIn = booking.travelDate
    ? new Date(booking.travelDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'TBA';
  
  // Format check-out date from metadata or calculate from check-in + nights
  let formattedCheckOut = 'TBA';
  if (booking.metadata?.checkOutDate) {
    formattedCheckOut = new Date(booking.metadata.checkOutDate as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } else if (booking.travelDate && booking.metadata?.nights) {
    // Fallback: calculate check-out from check-in date + nights if checkOutDate is missing
    const checkOut = new Date(booking.travelDate);
    checkOut.setDate(checkOut.getDate() + (booking.metadata.nights as number));
    formattedCheckOut = checkOut.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  return (
    <div className="bg-[#FBFCFD] min-h-screen pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          className="w-32 h-32 bg-brand-accent rounded-[40px] flex items-center justify-center text-white shadow-2xl shadow-brand-accent/40 mx-auto mb-12"
        >
          <CheckCircle2 className="w-16 h-16" />
        </motion.div>

        <div className="space-y-6 mb-16">
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-brand-accent/20"></span>
            <span className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.4em]">Reservation Confirmed</span>
            <span className="h-px w-12 bg-brand-accent/20"></span>
          </div>
          <h1 className="text-6xl font-display font-bold text-slate-900 uppercase tracking-tighter leading-none">
            Your Sanctuary <br />
            <span className="text-brand-accent italic serif-italic">Awaits.</span>
          </h1>
          <p className="text-slate-400 font-serif italic text-lg">
            "We've sent the confirmation details and check-in instructions to your inbox."
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-[48px] p-10 border border-slate-100 shadow-2xl shadow-slate-200/50 mb-16 text-left space-y-10"
        >
          {/* Booking ID Header */}
          <div className="bg-brand-accent/10 rounded-[24px] p-6 border border-brand-accent/20">
            <p className="text-[10px] font-bold text-brand-accent uppercase tracking-widest mb-2">Booking Confirmation ID</p>
            <p className="text-2xl font-display font-bold text-slate-900 tabular-nums font-mono">{booking.id}</p>
          </div>

          {property && (
            <div className="flex flex-col md:flex-row gap-8 items-center border-b border-slate-50 pb-10">
              <div className="w-32 h-32 rounded-[32px] overflow-hidden shadow-xl shrink-0">
                <img src={property.image} alt={property.name} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-bold text-slate-900 tracking-tight uppercase">{property.name}</h3>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <MapPin className="w-4 h-4 text-brand-accent" />
                  {property.location}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
             <div className="space-y-4">
                <div className="flex items-center gap-3 text-brand-accent">
                  <Calendar className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest font-sans">Check-in</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-bold text-slate-900 uppercase tracking-tight">{formattedCheckIn}</p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-3 h-3 text-slate-300" /> After 2:00 PM
                  </p>
                </div>
             </div>
             <div className="space-y-4">
                <div className="flex items-center gap-3 text-brand-accent">
                  <Calendar className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest font-sans">Check-out</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-bold text-slate-900 uppercase tracking-tight">{formattedCheckOut}</p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-3 h-3 text-slate-300" /> Before 11:00 AM
                  </p>
                </div>
             </div>
          </div>

          <div className="pt-10 border-t border-slate-50 flex flex-col sm:flex-row gap-8 justify-between items-start sm:items-center">
             <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Total Amount</p>
                <p className="text-3xl font-bold text-slate-900">₹{booking.totalAmount.toLocaleString('en-IN')}</p>
             </div>
             <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Booking Status</p>
                <p className="inline-block px-4 py-2 bg-brand-accent/10 text-brand-accent font-bold text-sm rounded-full uppercase">{booking.status}</p>
             </div>
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-12 py-5 bg-brand-primary text-white rounded-full font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-brand-accent transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
          >
            <LayoutDashboard className="w-5 h-5" />
            Go to Dashboard
          </button>
          <button 
            onClick={() => navigate('/')}
            className="px-12 py-5 bg-white text-slate-900 border border-slate-100 rounded-full font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            Back to Home
          </button>
        </div>

        <div className="mt-20 flex items-center justify-center gap-12">
           <button className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
             <Share2 className="w-4 h-4" /> Share Perspective
           </button>
           <button className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
             Help with Booking <ArrowRight className="w-4 h-4" />
           </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
