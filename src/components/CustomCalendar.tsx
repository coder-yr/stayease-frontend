import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CustomCalendarProps {
  selectedDate: string;
  onSelect: (date: string) => void;
  onClose: () => void;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ selectedDate, onSelect, onClose }) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);
  
  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const formatDate = (day: number) => {
    const monthName = monthNames[month].substring(0, 3);
    return `${day} ${monthName}, ${year}`;
  };

  const isSelected = (day: number) => {
    return selectedDate === formatDate(day);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute z-[300] w-[320px] top-full left-1/2 -translate-x-1/2 mt-4 bg-white border border-slate-100 rounded-[40px] shadow-[0_32px_128px_rgba(0,0,0,0.15)] p-10 overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-accent to-sky-500 opacity-20"></div>
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em]">
            {monthNames[month]} {year}
          </h4>
          <p className="text-[8px] font-bold text-brand-accent uppercase tracking-widest mt-1 italic font-serif">Departure Window</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={prevMonth}
            className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-brand-accent/10 hover:text-brand-accent transition-all border border-slate-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={nextMonth}
            className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-brand-accent/10 hover:text-brand-accent transition-all border border-slate-100"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="text-[8px] font-bold text-slate-400 uppercase text-center tracking-widest">{d}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        
        {Array.from({ length: totalDays }).map((_, i) => {
          const d = i + 1;
          const selected = isSelected(d);
          const current = isToday(d);
          
          return (
            <button 
              key={d}
              onClick={() => {
                onSelect(formatDate(d));
                onClose();
              }}
              className={`aspect-square rounded-2xl text-[10px] font-bold transition-all flex flex-col items-center justify-center relative group ${
                selected 
                  ? 'text-white active:scale-95' 
                  : current
                  ? 'text-brand-accent bg-brand-accent/10 border border-brand-accent/20 hover:bg-brand-accent/20'
                  : 'text-slate-600 hover:bg-brand-accent/5 hover:text-brand-accent active:scale-95'
              }`}
            >
              {selected && (
                <motion.div 
                  layoutId="selected"
                  className="absolute inset-0 bg-brand-accent rounded-xl shadow-lg shadow-brand-accent/20"
                />
              )}
              <span className={`relative z-10 ${selected ? 'text-white' : ''}`}>
                {d}
              </span>
              {selected && <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full z-20"></div>}
              {current && !selected && <div className="absolute top-1.5 right-1.5 w-1 h-1 bg-brand-accent rounded-full"></div>}
            </button>
          );
        })}
      </div>
      
      <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
        <button 
          onClick={onClose}
          className="text-[9px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors"
        >
          Cancel
        </button>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-brand-accent"></div>
           <span className="text-[9px] font-bold text-slate-900 uppercase tracking-widest leading-none">Selected</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CustomCalendar;
