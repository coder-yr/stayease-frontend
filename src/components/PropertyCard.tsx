import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Sparkles, Heart, MapPin, CheckCircle2, Star, ArrowRight } from 'lucide-react';
import { Property } from '../services/propertyApi';

interface PropertyCardProps {
  property: Property;
  index?: number;
  isLiked?: boolean;
  onLike?: (e: React.MouseEvent, id: string) => void;
  onClick?: (id: string) => void;
  isFeatured?: boolean;
  /** Optional custom badge element shown over the image (top-left, below the default badge) */
  badge?: React.ReactNode;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  index = 0, 
  isLiked = false, 
  onLike, 
  onClick,
  isFeatured = false,
  badge,
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onClick?.(property.id)}
      className="group bg-white rounded-[48px] overflow-hidden border border-slate-100 hover:border-brand-accent/20 hover:shadow-[0_40px_80px_-20px_rgba(6,78,59,0.1)] transition-all duration-700 cursor-pointer flex flex-col relative hover:-translate-y-2"
      role="article"
      aria-label={`${property.name} in ${property.location}`}
    >
      {/* Image Area */}
      <div className="h-[300px] overflow-hidden relative">
        <img 
          src={property.image} 
          alt={`${property.name} — ${property.location}`}
          className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" aria-hidden="true" />
        
        {/* Floating Badges */}
        <div className="absolute top-8 left-8 flex flex-col gap-3">
          <div className="flex items-center gap-2 bg-brand-accent text-white px-5 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-2xl border border-white/20">
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            Sanctuary Verified
          </div>
          {isFeatured && (
            <div className="flex items-center gap-2 bg-slate-900/60 backdrop-blur-xl text-white px-5 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-brand-accent" aria-hidden="true" />
              Editor's Choice
            </div>
          )}
          {/* Custom badge passed from parent (e.g. "Certified Sanctuary" on PG page) */}
          {badge && <div>{badge}</div>}
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onLike?.(e, property.id);
          }}
          aria-label={isLiked ? `Remove ${property.name} from saved` : `Save ${property.name}`}
          aria-pressed={isLiked}
          className={`absolute top-8 right-8 w-12 h-12 backdrop-blur-2xl border border-white/20 rounded-full transition-all shadow-2xl flex items-center justify-center ${isLiked ? 'bg-rose-500 text-white border-rose-500' : 'bg-white/10 text-white hover:bg-white/30'}`}
        >
          <Heart className={`w-5 h-5 transition-all ${isLiked ? 'fill-white' : ''}`} aria-hidden="true" />
        </button>

        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex items-center gap-2 text-white/90 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
             <MapPin className="w-3.5 h-3.5 text-brand-accent" aria-hidden="true" />
             {property.location}
          </div>
          <h3 className="text-2xl font-display font-bold text-white tracking-tight leading-none">{property.name}</h3>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-10 flex flex-col justify-between flex-1">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2" aria-label="Amenities">
            {property.amenities.slice(0, 3).map((amenity, i) => (
              <div key={i} className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[8px] font-bold text-slate-500 uppercase tracking-widest group-hover:bg-brand-accent/5 group-hover:border-brand-accent/20 group-hover:text-brand-accent transition-colors">
                <CheckCircle2 className="w-2.5 h-2.5 text-brand-accent" aria-hidden="true" />
                {amenity}
              </div>
            ))}
          </div>
          <p className="text-slate-400 text-sm font-medium leading-relaxed font-serif italic line-clamp-2">
            {property.description || "Experience a masterwork of architectural serenity designed for the modern explorer."}
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Pricing From</div>
            <div className="text-3xl font-display font-bold text-slate-900 tracking-tighter">
              ₹{(property.price * 84).toLocaleString()}
              <span className="text-slate-400 text-xs font-serif italic lowercase font-medium ml-2">/night</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100" aria-label={`Rating: ${property.rating} out of 5`}>
              <Star className="w-3.5 h-3.5 fill-brand-accent text-brand-accent" aria-hidden="true" />
              {property.rating}
            </div>
            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center group-hover:bg-brand-accent transition-all shadow-xl shadow-slate-900/10 group-active:scale-90 duration-500" aria-hidden="true">
              <ArrowRight className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
