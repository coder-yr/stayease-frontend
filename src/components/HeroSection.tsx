import React from 'react';
import { motion } from 'motion/react';

interface HeroSectionProps {
  label: string;
  title: string | React.ReactNode;
  subtitle?: string;
  background?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  label, 
  title, 
  subtitle, 
  background, 
  children,
  className = ""
}) => {
  return (
    <section className={`relative pt-24 pb-20 px-4 overflow-hidden ${className}`}>
      {background}
      
      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 mb-16"
        >
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-brand-accent/30"></span>
            <span className="micro-label">{label}</span>
            <span className="h-px w-8 bg-brand-accent/30"></span>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-[8rem] font-display font-bold text-brand-primary uppercase tracking-tighter leading-tight lg:leading-none">
            {title}
          </h1>
          
          {subtitle && (
            <p className="text-slate-500 font-serif italic text-xl max-w-xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        {children}
      </div>
    </section>
  );
};

export default HeroSection;
