import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, Hotel, Train, Bus, Home as HomeIcon, MapPin, Calendar as CalendarIcon, Users, ChevronDown, CheckCircle2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CustomCalendar from './CustomCalendar';
import { flightApi } from '../services/flightApi';

interface UniversalSearchCardProps {
  activeTab?: string;
  onSearch?: (params: any) => void;
  className?: string;
}

const UniversalSearchCard: React.FC<UniversalSearchCardProps> = ({ 
  activeTab: initialActiveTab = 'flights',
  onSearch,
  className = ""
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState(initialActiveTab);
  const [searchParams, setSearchParams] = React.useState({
    origin: 'Bengaluru (BLR)',
    destination: 'Mumbai (BOM)',
    date: '24 Oct, 2026',
    travelers: 1
  });

  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [activeSuggestion, setActiveSuggestion] = React.useState<'origin' | 'destination' | null>(null);
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const tabs = [
    { id: 'flights', label: 'Flights', icon: Plane, path: '/flights' },
    { id: 'hotels', label: 'Hotels', icon: Hotel, path: '/hotels' },
    { id: 'trains', label: 'Trains', icon: Train, path: '/trains' },
    { id: 'buses', label: 'Buses', icon: Bus, path: '/buses' },
    { id: 'pg', label: 'PG/Rooms', icon: HomeIcon, path: '/pg' },
  ];

  const handleCitySearch = async (query: string, type: 'origin' | 'destination') => {
    setSearchParams(prev => ({ ...prev, [type]: query }));
    if (query.length > 1) {
      const results = await flightApi.getCitySuggestions(query);
      setSuggestions(results);
      setActiveSuggestion(type);
    } else {
      setSuggestions([]);
      setActiveSuggestion(null);
    }
  };

  const selectCity = (city: string) => {
    if (activeSuggestion) {
      setSearchParams(prev => ({ ...prev, [activeSuggestion]: city }));
      setSuggestions([]);
      setActiveSuggestion(null);
    }
  };

  const handleMainSearch = () => {
    if (onSearch) {
      onSearch(searchParams);
    } else {
      if (activeTab === 'flights') {
        // Pass as a flat SearchParams — FlightResults reads `location.state as SearchParams`
        navigate('/flights/results', {
          state: {
            origin: searchParams.origin,
            destination: searchParams.destination,
            date: searchParams.date,
            adults: searchParams.travelers,
            class: 'Economy',
            tripType: 'one',
          },
        });
      } else if (activeTab === 'hotels') navigate('/hotels');
      else if (activeTab === 'trains') navigate('/trains', { state: { source: searchParams.origin, destination: searchParams.destination, date: searchParams.date } });
      else if (activeTab === 'buses') navigate('/buses', { state: { source: searchParams.origin, destination: searchParams.destination, date: searchParams.date } });
      else if (activeTab === 'pg') navigate('/pg');
      else navigate('/search');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`bg-white/90 backdrop-blur-2xl rounded-[48px] p-8 md:p-12 max-w-6xl mx-auto shadow-[0_32px_128px_-16px_rgba(26,46,42,0.3)] border border-white/40 relative ${className}`}
    >
      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-12 mb-12">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
            }}
            className={`flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all pb-4 relative group ${
              activeTab === tab.id 
                ? 'text-brand-primary' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <tab.icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${activeTab === tab.id ? 'text-brand-primary' : 'text-slate-300'}`} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* Form Grid */}
      <div className="flex flex-col lg:flex-row items-end gap-8">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {/* Origin */}
          <div className="space-y-3 text-left relative">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Departure Point</label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/50 w-5 h-5 group-focus-within:text-brand-primary transition-colors" />
              <input 
                type="text" 
                value={searchParams.origin}
                onChange={(e) => handleCitySearch(e.target.value, 'origin')}
                className="w-full pl-12 pr-4 py-5 bg-slate-50/50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50 transition-all outline-none"
              />
            </div>
            {activeSuggestion === 'origin' && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-4 bg-white/95 backdrop-blur-xl border border-slate-100 rounded-[32px] shadow-2xl z-[100] overflow-hidden">
                {suggestions.map((city, i) => (
                  <button key={i} onClick={() => selectCity(city)} className="w-full px-8 py-5 text-left text-sm font-bold text-slate-900 hover:bg-brand-primary/5 transition-colors border-b border-slate-50 last:border-0">{city}</button>
                ))}
              </div>
            )}
          </div>

          {/* Destination */}
          <div className="space-y-3 text-left relative">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Destination</label>
            <div className="relative group">
              {activeTab === 'flights' ? (
                <Plane className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/50 w-5 h-5 rotate-45 group-focus-within:text-brand-primary transition-colors" />
              ) : activeTab === 'trains' ? (
                <Train className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/50 w-5 h-5 group-focus-within:text-brand-primary transition-colors" />
              ) : activeTab === 'buses' ? (
                <Bus className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/50 w-5 h-5 group-focus-within:text-brand-primary transition-colors" />
              ) : (
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/50 w-5 h-5 group-focus-within:text-brand-primary transition-colors" />
              )}
              <input 
                type="text" 
                value={searchParams.destination}
                onChange={(e) => handleCitySearch(e.target.value, 'destination')}
                className="w-full pl-12 pr-4 py-5 bg-slate-50/50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50 transition-all outline-none"
              />
            </div>
            {activeSuggestion === 'destination' && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-4 bg-white/95 backdrop-blur-xl border border-slate-100 rounded-[32px] shadow-2xl z-[100] overflow-hidden">
                {suggestions.map((city, i) => (
                  <button key={i} onClick={() => selectCity(city)} className="w-full px-8 py-5 text-left text-sm font-bold text-slate-900 hover:bg-brand-primary/5 transition-colors border-b border-slate-50 last:border-0">{city}</button>
                ))}
              </div>
            )}
          </div>

          {/* Date & Travelers */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3 text-left relative">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Date</label>
              <div 
                className="relative group cursor-pointer"
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
                <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/50 w-4 h-4 group-hover:text-brand-primary transition-colors" />
                <div className="w-full pl-10 pr-4 py-5 bg-slate-50/50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-900 group-hover:bg-white transition-all">
                  {searchParams.date.split(',')[0]}
                </div>
                {showDatePicker && (
                  <CustomCalendar 
                    selectedDate={searchParams.date}
                    onSelect={(d) => { setSearchParams(p => ({ ...p, date: d })); setShowDatePicker(false); }} 
                    onClose={() => setShowDatePicker(false)} 
                  />
                )}
              </div>
            </div>
            <div className="space-y-3 text-left">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Travelers</label>
              <div className="relative group">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/50 w-4 h-4" />
                <select 
                  value={searchParams.travelers}
                  onChange={(e) => setSearchParams(p => ({ ...p, travelers: parseInt(e.target.value) }))}
                  className="w-full pl-10 pr-4 py-5 bg-slate-50/50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none appearance-none"
                >
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Search button */}
        <button 
          onClick={handleMainSearch}
          className="w-full lg:w-24 h-24 bg-brand-primary text-white rounded-[32px] flex items-center justify-center shadow-2xl shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all group shrink-0"
        >
          <Search className="w-8 h-8 group-hover:rotate-12 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

export default UniversalSearchCard;
