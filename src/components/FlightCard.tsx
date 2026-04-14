import React from 'react';
import { motion } from 'motion/react';
import { Plane, ArrowRight } from 'lucide-react';
import { Flight } from '../services/flightApi';

interface FlightCardProps {
  flight: Flight;
  index?: number;
  onClick?: (flight: Flight) => void;
}

const FlightCard: React.FC<FlightCardProps> = ({ 
  flight, 
  index = 0, 
  onClick 
}) => {
  const [logoFailed, setLogoFailed] = React.useState(false);

  const airlineLabel = flight.airline?.trim() || 'Airline';
  const fallbackInitials = airlineLabel
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-white rounded-[32px] md:rounded-[48px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all p-6 md:p-12 relative overflow-hidden group cursor-pointer"
      onClick={() => onClick?.(flight)}
    >
      {/* Flight Card Layout */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-8 md:gap-12">
        {/* Airline Info */}
        <div className="flex items-center gap-4 md:gap-6 w-full md:w-56">
          <div className="w-14 h-14 md:w-20 md:h-20 rounded-[20px] md:rounded-[28px] bg-slate-50 border border-slate-100 flex items-center justify-center p-3 md:p-5 group-hover:scale-110 transition-transform duration-500">
            {logoFailed ? (
              <div className="w-full h-full rounded-xl bg-white border border-slate-100 flex items-center justify-center text-xs md:text-sm font-bold text-slate-600">
                {fallbackInitials}
              </div>
            ) : (
              <img
                src={flight.logo}
                alt={flight.airline}
                className="w-full h-full object-contain"
                onError={() => setLogoFailed(true)}
              />
            )}
          </div>
          <div className="space-y-1">
            <h4 className="text-base md:text-lg font-display font-bold text-slate-900 uppercase tracking-tight">{flight.airline}</h4>
            <p className="text-[8px] md:text-[9px] font-bold text-brand-accent uppercase tracking-[0.2em]">{flight.class}</p>
          </div>
        </div>

        {/* Journey Details */}
        <div className="flex-1 w-full flex items-center justify-between md:px-6 md:border-x border-slate-50 gap-4">
          {/* Departure */}
          <div className="text-left space-y-1 md:space-y-2 shrink-0">
            <div className="text-2xl md:text-4xl font-display font-bold text-slate-900 tabular-nums leading-none tracking-tighter">{flight.departure.time}</div>
            <div className="space-y-1">
              <div className="text-[10px] md:text-xs font-bold text-slate-900 uppercase tracking-widest">{flight.departure.iata}</div>
              <p className="hidden md:block text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] max-w-[100px] leading-tight">{flight.departure.city}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex-1 px-4 md:px-12 flex flex-col items-center justify-center gap-3 md:gap-4 overflow-hidden">
            <div className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">{flight.duration}</div>
            <div className="w-full relative py-2">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-slate-100"></div>
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-brand-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-1000"></div>
              
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white border border-slate-100 rounded-full z-10"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white border border-slate-100 rounded-full z-10 group-hover:border-brand-accent transition-colors duration-500"></div>
              
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-2 bg-white flex items-center justify-center z-20 group-hover:translate-x-[10px] md:group-hover:translate-x-[20px] transition-transform duration-1000">
                <Plane className="w-3 h-3 text-brand-accent rotate-90" />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[8px] md:text-[9px] font-bold text-brand-accent uppercase tracking-[0.2em]">{flight.stops}</span>
            </div>
          </div>

          {/* Arrival */}
          <div className="text-right space-y-1 md:space-y-2 shrink-0">
            <div className="text-2xl md:text-4xl font-display font-bold text-slate-900 tabular-nums leading-none tracking-tighter">{flight.arrival.time}</div>
            <div className="space-y-1">
              <div className="text-[10px] md:text-xs font-bold text-slate-900 uppercase tracking-widest">{flight.arrival.iata}</div>
              <p className="hidden md:block text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] max-w-[100px] leading-tight ml-auto">{flight.arrival.city}</p>
            </div>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 md:w-48 text-right">
          <div className="space-y-0.5 md:space-y-1">
            <div className="text-[8px] md:text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]">All Inclusive</div>
            <div className="text-2xl md:text-4xl font-display font-bold text-slate-900 tracking-tighter leading-none">{flight.price}</div>
          </div>
          <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-900 text-white rounded-2xl md:rounded-[28px] flex items-center justify-center group-hover:bg-brand-accent transition-all shadow-xl shadow-slate-900/10 group-active:scale-90 duration-500">
            <ArrowRight className="w-6 h-6 md:w-8 md:h-8" />
          </div>
        </div>
      </div>

      {/* Tag Ribbon - Now Always Visible */}
      {flight.tag && (
        <div className="absolute top-0 right-8 md:right-12 px-6 py-2 bg-gradient-to-r from-brand-accent to-brand-primary text-white text-[9px] font-bold uppercase tracking-[0.3em] rounded-b-2xl shadow-lg border-x border-b border-white/20 transform origin-top translate-y-0 opacity-100 z-10">
          {flight.tag}
        </div>
      )}
    </motion.div>
  );
};

export default FlightCard;
