import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ 
  items, 
  className = "" 
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {item.path ? (
            <Link 
              to={item.path}
              className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] hover:text-brand-accent transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className={`text-[10px] font-bold uppercase tracking-[0.3em] ${item.active ? 'text-brand-accent' : 'text-slate-400'}`}>
              {item.label}
            </span>
          )}
          {idx < items.length - 1 && (
            <ChevronRight className="w-3 h-3 text-slate-300" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;
