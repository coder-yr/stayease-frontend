import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, ChevronDown, CheckCircle2 } from 'lucide-react';

interface FilterOption {
  name: string;
  options: string[];
}

interface FilterBarProps {
  filters: FilterOption[];
  selectedFilters: Record<string, string>;
  onFilterChange: (name: string, value: string) => void;
  onReset: () => void;
  className?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  filters, 
  selectedFilters, 
  onFilterChange, 
  onReset,
  className = ""
}) => {
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);

  return (
    <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-8 ${className}`}>
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
        <button 
          onClick={onReset}
          className="flex items-center gap-3 px-8 py-5 bg-brand-accent text-white rounded-2xl text-[10px] font-bold tracking-widest uppercase shadow-xl shadow-brand-accent/20 active:scale-95 transition-all shrink-0"
        >
          <Filter className="w-4 h-4" />
          {Object.keys(selectedFilters).length > 0 ? `Reset (${Object.keys(selectedFilters).length})` : 'Filter Results'}
        </button>
        
        {filters.map((filter, idx) => (
          <div key={idx} className="relative shrink-0">
            <button 
              onClick={() => setActiveDropdown(activeDropdown === filter.name ? null : filter.name)}
              className={`flex items-center gap-3 px-8 py-5 rounded-2xl text-[10px] font-bold transition-all uppercase tracking-widest border ${selectedFilters[filter.name] ? 'bg-brand-accent/5 border-brand-accent text-brand-accent' : 'bg-white border-slate-100 text-slate-500 hover:border-brand-accent hover:text-brand-accent'}`}
            >
              {selectedFilters[filter.name] || filter.name}
              <ChevronDown className={`w-3.5 h-3.5 text-slate-300 transition-transform ${activeDropdown === filter.name ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {activeDropdown === filter.name && (
                <>
                  <div className="fixed inset-0 z-[90]" onClick={() => setActiveDropdown(null)}></div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 mt-4 w-72 bg-white rounded-3xl shadow-[0_32px_128px_rgba(0,0,0,0.2)] border border-slate-100 p-8 z-[100]"
                  >
                    <div className="space-y-4">
                      {filter.options.map((option, i) => (
                        <button 
                          key={i}
                          onClick={() => {
                            onFilterChange(filter.name, option);
                            setActiveDropdown(null);
                          }}
                          className={`w-full flex items-center justify-between px-6 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${selectedFilters[filter.name] === option ? 'bg-brand-accent text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                          {option}
                          {selectedFilters[filter.name] === option && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
