import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  User, 
  Menu, 
  X, 
  Sparkles, 
  ChevronDown,
  LogOut,
  CreditCard,
  History,
  Settings,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getAccessToken } from '../services/apiClient';
import { userApi, UserProfile } from '../services/userApi';
import { walletApi, WalletInfo } from '../services/walletApi';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isAuthenticated, setIsAuthenticated] = React.useState(!!getAccessToken());
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
  const [wallet, setWallet] = React.useState<WalletInfo | null>(null);
  const [showUserDropdown, setShowUserDropdown] = React.useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll handler for glassmorphism
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync auth state and fetch user data
  React.useEffect(() => {
    const syncAuthState = async () => {
      const token = getAccessToken();
      setIsAuthenticated(!!token);
      
      if (token && !userProfile) {
        try {
          const [profile, walletInfo] = await Promise.all([
            userApi.getProfile().catch(() => null),
            walletApi.getWalletInfo().catch(() => null)
          ]);
          setUserProfile(profile);
          setWallet(walletInfo);
        } catch (err) {
          console.warn('Failed to fetch navbar user data:', err);
        }
      }
    };

    syncAuthState();
    window.addEventListener('storage', syncAuthState);
    window.addEventListener('focus', syncAuthState);

    return () => {
      window.removeEventListener('storage', syncAuthState);
      window.removeEventListener('focus', syncAuthState);
    };
  }, [location.pathname, isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserProfile(null);
    navigate('/');
    window.location.reload();
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Flights', path: '/flights' },
    { name: 'Hotels', path: '/hotels' },
    { name: 'PG / Rooms', path: '/pg' },
  ];

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-500 border-b ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-2xl border-slate-200/60 py-2 shadow-sm' 
          : 'bg-white border-transparent py-5'
      }`}
      role="navigation" 
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12 md:h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group/logo" aria-label="StayEase Home">
            <div className="w-10 h-10 bg-[#064e3b] rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-900/10 group-hover/logo:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 fill-white/20" />
            </div>
            <span className="text-2xl font-display font-bold text-[#1a2b2b] tracking-tight">Stay<span className="text-[#10b981] italic font-serif">Ease</span></span>
          </Link>

          {/* Nav Links Container */}
          <div className="hidden lg:flex items-center bg-[#f8fafc] border border-slate-200/50 p-1.5 rounded-full relative">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative z-10 px-6 py-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                  location.pathname === link.path 
                    ? 'text-white' 
                    : 'text-slate-400 hover:text-[#1a2b2b]'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div 
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 bg-[#1a2b2b] rounded-full -z-10 shadow-lg shadow-black/10"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Soft Search Bar */}
          <div className="hidden xl:flex items-center flex-1 max-w-[400px] mx-6">
            <div className="relative w-full group/search">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-3.5 h-3.5 group-focus-within/search:text-[#10b981] transition-colors" aria-hidden="true" />
              <input 
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search..." 
                className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-slate-100 rounded-full text-xs font-semibold placeholder:text-slate-300 focus:bg-white focus:border-[#10b981]/30 focus:ring-4 focus:ring-[#10b981]/5 transition-all outline-none"
              />
            </div>
          </div>

          {/* AI Assistant Button (Dark Pill) */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              to="/ai" 
              className="relative group bg-[#1a2b2b] text-white px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-[#111d1d] hover:shadow-xl hover:shadow-[#1a2b2b]/10 active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              AI Assistant
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className={`flex items-center gap-2 p-1 rounded-full transition-all ${
                    showUserDropdown ? 'bg-slate-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-[#ecfdf5] text-[#10b981] flex items-center justify-center font-bold text-sm border border-[#d1fae5]">
                    {userProfile?.name?.charAt(0).toUpperCase() || <User size={18} />}
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-300 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showUserDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowUserDropdown(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-64 bg-white rounded-2xl shadow-2xl shadow-black/5 border border-slate-100 z-20 overflow-hidden"
                      >
                        <div className="p-5 bg-[#f8fafc] border-b border-slate-100">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#10b981] mb-1">Authenticated</p>
                          <p className="font-bold text-[#1a2b2b] truncate">{userProfile?.name}</p>
                          <p className="text-xs text-slate-400 truncate tracking-tight">{userProfile?.email}</p>
                        </div>
                        
                        <div className="p-2.5">
                          <Link to="/dashboard" onClick={() => setShowUserDropdown(false)} className="flex items-center gap-3 w-full p-3 rounded-xl text-xs font-bold text-slate-500 hover:bg-[#ecfdf5] hover:text-[#10b981] transition-all">
                            <History className="w-4 h-4 opacity-70" /> My Bookings
                          </Link>
                          <Link to="/dashboard" onClick={() => setShowUserDropdown(false)} className="flex items-center gap-3 w-full p-3 rounded-xl text-xs font-bold text-slate-500 hover:bg-[#ecfdf5] hover:text-[#10b981] transition-all">
                            <CreditCard className="w-4 h-4 opacity-70" /> Wallet ({wallet?.balance ? `₹${wallet.balance.toLocaleString()}` : '₹0'})
                          </Link>
                          <Link to="/dashboard" onClick={() => setShowUserDropdown(false)} className="flex items-center gap-3 w-full p-3 rounded-xl text-xs font-bold text-slate-500 hover:bg-[#ecfdf5] hover:text-[#10b981] transition-all">
                            <Settings className="w-4 h-4 opacity-70" /> Settings
                          </Link>
                        </div>

                        <div className="p-2 border-t border-slate-100">
                          <button 
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full p-3 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 transition-all"
                          >
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-[#1a2b2b] transition-colors px-6 py-2.5 rounded-full hover:bg-slate-50 border border-slate-100"
              >
                Sign In
              </Link>
            )}

            <button className="p-2.5 text-slate-300 hover:text-[#1a2b2b] transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="md:hidden fixed inset-0 z-[60] bg-white flex flex-col pt-20"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-2 text-slate-300 hover:text-[#1a2b2b] transition-colors"
            >
              <X size={32} />
            </button>

            <div className="px-8 mb-10">
              <span className="text-3xl font-display font-bold text-[#1a2b2b] tracking-tight">Stay<span className="text-[#10b981] italic font-serif">Ease</span></span>
              <p className="text-slate-400 text-sm mt-3 font-medium">Elevating your travel experience.</p>
            </div>

            <div className="flex-1 px-4 space-y-3 overflow-y-auto pb-40">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between p-6 rounded-[2rem] transition-all ${
                    location.pathname === link.path
                    ? 'bg-[#ecfdf5] text-[#1a2b2b] shadow-sm translate-x-2'
                    : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-lg font-bold uppercase tracking-[0.2em]">{link.name}</span>
                  <ChevronDown className="-rotate-90 w-4 h-4 opacity-20" />
                </Link>
              ))}
              
              <Link
                to="/ai"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-6 rounded-[2rem] bg-[#1a2b2b] text-white shadow-xl shadow-[#1a2b2b]/20"
              >
                <div className="flex items-center gap-4">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <span className="text-lg font-bold uppercase tracking-[0.2em]">AI Assistant</span>
                </div>
                <ChevronDown className="-rotate-90 w-4 h-4 opacity-50" />
              </Link>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-8 space-y-4 border-t border-slate-100 bg-white/95 backdrop-blur-xl">
              {isAuthenticated ? (
                <div className="flex items-center gap-5 p-5 rounded-[2rem] bg-white shadow-2xl shadow-black/5 border border-slate-100">
                  <div className="w-14 h-14 rounded-full bg-[#ecfdf5] text-[#10b981] flex items-center justify-center font-bold text-xl border border-[#d1fae5]">
                    {userProfile?.name?.charAt(0).toUpperCase() || <User />}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-bold text-[#1a2b2b] text-lg truncate leading-tight">{userProfile?.name}</p>
                    <p className="text-sm text-slate-400 truncate tracking-tight">{userProfile?.email}</p>
                  </div>
                  <button onClick={handleLogout} className="p-4 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all">
                    <LogOut size={22} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center p-6 rounded-[2rem] bg-[#1a2b2b] text-white font-bold uppercase tracking-widest shadow-2xl shadow-[#1a2b2b]/20"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
