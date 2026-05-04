import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, ChevronDown, Navigation, Calendar as CalendarIcon, ArrowRight, Plane } from 'lucide-react';
import { flightApi, SearchParams } from '../services/flightApi';
import CustomCalendar from './CustomCalendar';

interface FlightSearchCardProps {
  onSearch: (params: SearchParams) => void;
  initialParams?: Partial<SearchParams>;
  className?: string;
}

const FlightSearchCard: React.FC<FlightSearchCardProps> = ({ 
  onSearch, 
  initialParams,
  className = ""
}) => {
  const [tripType, setTripType] = React.useState<'round' | 'one'>(initialParams?.tripType || 'round');
  const [origin, setOrigin] = React.useState(initialParams?.origin || 'Bengaluru (BLR)');
  const [destination, setDestination] = React.useState(initialParams?.destination || 'Mumbai (BOM)');
  const [date, setDate] = React.useState(initialParams?.date || '24 Oct, 2024');
  const [travelers, setTravelers] = React.useState({
    adults: initialParams?.adults || 1,
    children: 0,
    infants: 0
  });
  const [seatClass, setSeatClass] = React.useState(initialParams?.class || 'Economy');
  
  const [showTravelerDropdown, setShowTravelerDropdown] = React.useState(false);
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [originSuggestions, setOriginSuggestions] = React.useState<string[]>([]);
  const [destSuggestions, setDestSuggestions] = React.useState<string[]>([]);
  const [showOriginSug, setShowOriginSug] = React.useState(false);
  const [showDestSug, setShowDestSug] = React.useState(false);

  const handleOriginChange = async (val: string) => {
    setOrigin(val);
    if (val.length > 1) {
      const results = await flightApi.getCitySuggestions(val);
      setOriginSuggestions(results);
      setShowOriginSug(true);
    } else {
      setShowOriginSug(false);
    }
  };

  const handleDestChange = async (val: string) => {
    setDestination(val);
    if (val.length > 1) {
      const results = await flightApi.getCitySuggestions(val);
      setDestSuggestions(results);
      setShowDestSug(true);
    } else {
      setShowDestSug(false);
    }
  };

  const handleSearch = () => {
    onSearch({
      origin,
      destination,
      date,
      adults: travelers.adults,
      class: seatClass,
      tripType
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={`bg-white rounded-[48px] shadow-2xl shadow-emerald-900/10 border border-slate-100 p-8 md:p-12 relative group z-20 ${className}`}
    >
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-accent via-teal-500 to-emerald-400"></div>
      
      {/* Trip Type Tabs */}
      <div className="flex gap-8 mb-10 border-b border-slate-50 pb-6 items-center flex-wrap">
        <div className="flex gap-8">
          <button 
            onClick={() => setTripType('round')}
            className={`text-[10px] font-bold uppercase tracking-[0.2em] pb-4 relative transition-colors ${tripType === 'round' ? 'text-brand-accent' : 'text-slate-400'}`}
          >
            Round Trip
            {tripType === 'round' && <motion.div layoutId="tripTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-accent" />}
          </button>
          <button 
            onClick={() => setTripType('one')}
            className={`text-[10px] font-bold uppercase tracking-[0.2em] pb-4 relative transition-colors ${tripType === 'one' ? 'text-brand-accent' : 'text-slate-400'}`}
          >
            One Way
            {tripType === 'one' && <motion.div layoutId="tripTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-accent" />}
          </button>
        </div>
        
        <div className="h-4 w-px bg-slate-100 hidden sm:block"></div>
        
        <div className="relative">
          <div 
            onClick={() => setShowTravelerDropdown(!showTravelerDropdown)}
            className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-brand-accent transition-colors"
          >
            <Users className="w-4 h-4" />
            {travelers.adults + travelers.children + travelers.infants} Traveler{travelers.adults + travelers.children + travelers.infants > 1 ? 's' : ''}, {seatClass}
            <ChevronDown className={`w-3 h-3 transition-transform ${showTravelerDropdown ? 'rotate-180' : ''}`} />
          </div>

          <AnimatePresence>
            {showTravelerDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 mt-4 w-[320px] bg-white border border-slate-100 rounded-[32px] shadow-2xl z-[100] p-8 space-y-8"
              >
                <div className="space-y-6">
                  {/* Adults */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900 uppercase">Adults</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest">Aged 12+</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setTravelers(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
                        className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-brand-accent transition-all font-bold"
                      >-</button>
                      <span className="text-sm font-bold w-4 text-center">{travelers.adults}</span>
                      <button 
                        onClick={() => setTravelers(prev => ({ ...prev, adults: Math.min(9, prev.adults + 1) }))}
                        className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-brand-accent transition-all font-bold"
                      >+</button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900 uppercase">Children</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest">Aged 2-12</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setTravelers(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
                        className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-brand-accent transition-all font-bold"
                      >-</button>
                      <span className="text-sm font-bold w-4 text-center">{travelers.children}</span>
                      <button 
                        onClick={() => setTravelers(prev => ({ ...prev, children: Math.min(9, prev.children + 1) }))}
                        className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-brand-accent transition-all font-bold"
                      >+</button>
                    </div>
                  </div>

                  <div className="h-px bg-slate-50"></div>

                  {/* Class */}
                  <div className="space-y-4">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Travel Class</p>
                    <div className="grid grid-cols-2 gap-2">
                      {['Economy', 'Premium', 'Business', 'First'].map((cls) => (
                        <button
                          key={cls}
                          onClick={() => setSeatClass(cls)}
                          className={`px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${seatClass === cls ? 'bg-brand-accent text-white shadow-lg shadow-brand-accent/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                        >
                          {cls}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setShowTravelerDropdown(false)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-brand-accent transition-all active:scale-95"
                >
                  Apply Changes
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Inputs Form */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        {/* Origin */}
        <div className="md:col-span-3 space-y-3 text-left">
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Origin</label>
          <div className="relative group/input">
            <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-accent/40 w-5 h-5 group-focus-within/input:text-brand-accent transition-colors" />
            <input 
              type="text" 
              value={origin}
              onChange={(e) => handleOriginChange(e.target.value)}
              onBlur={() => setTimeout(() => setShowOriginSug(false), 200)}
              placeholder="Departing from..."
              className="w-full pl-12 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent/50 transition-all outline-none"
            />
            {showOriginSug && originSuggestions.length > 0 && (
              <ul className="absolute z-[100] w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                {originSuggestions.map((sug, idx) => (
                  <li 
                    key={idx} 
                    className="px-6 py-4 hover:bg-emerald-50 cursor-pointer text-sm font-bold text-slate-600 hover:text-brand-accent transition-colors uppercase tracking-widest"
                    onClick={() => { setOrigin(sug); setShowOriginSug(false); }}
                  >
                    {sug}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Swap Button */}
        <div className="md:col-span-1 flex justify-center pb-2">
          <button 
            onClick={() => { setOrigin(destination); setDestination(origin); }}
            className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-brand-accent hover:bg-brand-accent hover:text-white transition-all shadow-sm active:scale-90"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Destination */}
        <div className="md:col-span-3 space-y-3 text-left">
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Destination</label>
          <div className="relative group/input">
            <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-accent/40 w-5 h-5 rotate-90 group-focus-within/input:text-brand-accent transition-colors" />
            <input 
              type="text" 
              value={destination}
              onChange={(e) => handleDestChange(e.target.value)}
              onBlur={() => setTimeout(() => setShowDestSug(false), 200)}
              placeholder="Arriving at..."
              className="w-full pl-12 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent/50 transition-all outline-none"
            />
            {showDestSug && destSuggestions.length > 0 && (
              <ul className="absolute z-[100] w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                {destSuggestions.map((sug, idx) => (
                  <li 
                    key={idx} 
                    className="px-6 py-4 hover:bg-emerald-50 cursor-pointer text-sm font-bold text-slate-600 hover:text-brand-accent transition-colors uppercase tracking-widest"
                    onClick={() => { setDestination(sug); setShowDestSug(false); }}
                  >
                    {sug}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Date */}
        <div className="md:col-span-3 space-y-3 text-left relative">
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Departure Date</label>
          <div 
            className="relative group/input cursor-pointer"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-accent/40 w-5 h-5 group-hover:text-brand-accent transition-colors" />
            <div className="w-full pl-12 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-900 group-hover:bg-white transition-all">
              {date}
            </div>
            {showDatePicker && (
              <div 
                className="absolute top-full left-0 mt-4 z-[110]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="fixed inset-0 z-[-1]" onClick={() => setShowDatePicker(false)}></div>
                <CustomCalendar 
                  onSelect={(d) => { setDate(d); setShowDatePicker(false); }} 
                  selectedDate={date}
                  onClose={() => setShowDatePicker(false)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Search Action */}
        <div className="md:col-span-2">
          <button 
            onClick={handleSearch}
            className="w-full py-5 bg-slate-950 text-white rounded-[28px] text-[10px] font-bold uppercase tracking-[0.3em] shadow-2xl hover:bg-brand-accent transition-all active:scale-95 flex items-center justify-center gap-3 group/btn"
          >
            <Plane className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
            Find Flights
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FlightSearchCard;
