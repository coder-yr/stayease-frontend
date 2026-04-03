import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  ArrowRight,
  Send
} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-slate-600 pt-24 pb-12 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-3xl font-display font-bold text-brand-accent tracking-tight">StayEase</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              StayEase is your all-in-one travel and student housing platform. We simplify your journey from booking flights to finding the perfect home away from home.
            </p>
            <div className="flex items-center gap-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="StayEase on Facebook" className="text-slate-300 hover:text-brand-accent transition-all transform hover:scale-110">
                <Facebook className="w-5 h-5" aria-hidden="true" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="StayEase on Twitter" className="text-slate-300 hover:text-brand-accent transition-all transform hover:scale-110">
                <Twitter className="w-5 h-5" aria-hidden="true" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="StayEase on Instagram" className="text-slate-300 hover:text-brand-accent transition-all transform hover:scale-110">
                <Instagram className="w-5 h-5" aria-hidden="true" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="StayEase on YouTube" className="text-slate-300 hover:text-brand-accent transition-all transform hover:scale-110">
                <Youtube className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-8">
            <h4 className="text-slate-900 font-bold uppercase tracking-[0.2em] text-[10px]">PRODUCTS</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link to="/search?type=flights" className="text-slate-400 hover:text-brand-accent transition-colors">Flights</Link></li>
              <li><Link to="/search?type=hotels" className="text-slate-400 hover:text-brand-accent transition-colors">Hotels</Link></li>
              <li><Link to="/search?type=trains" className="text-slate-400 hover:text-brand-accent transition-colors">Trains</Link></li>
              <li><Link to="/pg" className="text-slate-400 hover:text-brand-accent transition-colors">PG/Rooms</Link></li>
              <li><Link to="/nearby" className="text-slate-400 hover:text-brand-accent transition-colors">Nearby Services</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-8">
            <h4 className="text-slate-900 font-bold uppercase tracking-[0.2em] text-[10px]">COMPANY</h4>
            <ul className="space-y-4 text-sm font-bold">
              {/* /about and /careers redirect to /support via App.tsx redirects */}
              <li><Link to="/support" className="text-slate-400 hover:text-brand-accent transition-colors">About Us</Link></li>
              <li><Link to="/journal" className="text-slate-400 hover:text-brand-accent transition-colors">Travel Journal</Link></li>
              <li><Link to="/support" className="text-slate-400 hover:text-brand-accent transition-colors">Help Center</Link></li>
              <li><Link to="/support" className="text-slate-400 hover:text-brand-accent transition-colors">Careers</Link></li>
              <li><Link to="/support" className="text-slate-400 hover:text-brand-accent transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-8">
            <h4 className="text-slate-900 font-bold uppercase tracking-[0.2em] text-[10px]">NEWSLETTER</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-6 pr-14 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-brand-accent transition-all outline-none"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-accent text-white rounded-xl flex items-center justify-center hover:bg-brand-primary transition-all shadow-lg shadow-brand-accent/20">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">© 2026 StayEase Inc. All rights reserved.</p>
          <div className="flex items-center gap-10">
            <a href="#" className="text-[10px] font-bold text-slate-300 hover:text-brand-accent transition-colors uppercase tracking-widest">Privacy Policy</a>
            <a href="#" className="text-[10px] font-bold text-slate-300 hover:text-brand-accent transition-colors uppercase tracking-widest">Terms of Service</a>
            <a href="#" className="text-[10px] font-bold text-slate-300 hover:text-brand-accent transition-colors uppercase tracking-widest">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
