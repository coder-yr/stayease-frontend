import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fdfcfb] flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-accent/5 rounded-full blur-[160px] -mr-80 -mt-80 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -ml-48 -mb-48 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
        className="relative z-10 space-y-12 max-w-2xl"
      >
        {/* 404 Typography */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="h-px w-8 bg-brand-accent/30" />
            <span className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.4em]">Page Not Found</span>
            <span className="h-px w-8 bg-brand-accent/30" />
          </div>
          <h1
            className="font-display font-bold text-brand-primary uppercase tracking-tighter leading-none"
            style={{ fontSize: 'clamp(6rem, 20vw, 14rem)', lineHeight: 0.8 }}
          >
            404
          </h1>
          <p className="text-3xl font-display font-bold text-slate-400 uppercase tracking-tight">
            Sanctuary Not Found
          </p>
        </div>

        <p className="text-slate-500 text-xl font-serif italic leading-relaxed max-w-md mx-auto">
          "The page you're looking for has wandered off the beaten path."
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-3 bg-brand-primary text-white px-10 py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-brand-accent transition-all shadow-2xl shadow-brand-primary/20 group"
          >
            <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Return Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-3 bg-white text-slate-600 px-10 py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] border border-slate-200 hover:bg-slate-50 hover:border-brand-accent/30 transition-all shadow-sm group"
            aria-label="Go back to previous page"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
        </div>

        <div className="flex items-center justify-center gap-10 pt-8 border-t border-slate-100">
          {[
            { label: 'Hotels', path: '/hotels' },
            { label: 'Flights', path: '/flights' },
            { label: 'PG / Rooms', path: '/pg' },
            { label: 'Support', path: '/support' },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-brand-accent transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
