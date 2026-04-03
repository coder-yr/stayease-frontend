import React from 'react';
import { 
  Wallet, 
  User, 
  Calendar, 
  Heart, 
  Bell, 
  Settings, 
  CreditCard, 
  TrendingUp, 
  ChevronRight, 
  Star, 
  MapPin, 
  ShieldCheck, 
  ArrowUpRight, 
  MoreHorizontal,
  Camera,
  LayoutDashboard,
  CheckCircle2,
  Sparkles,
  Lock,
  Mail,
  Smartphone,
  Edit,
  Save,
  X,
  Plane
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { bookingApi, Booking } from '../services/bookingApi';
import { propertyApi, Property } from '../services/propertyApi';
import { userApi, UserProfile } from '../services/userApi';
import { walletApi, WalletInfo, Transaction } from '../services/walletApi';

type TabId = 'dashboard' | 'bookings' | 'saved' | 'wallet' | 'settings';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState<TabId>('dashboard');
  
  // Dashboard States
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [profileDraft, setProfileDraft] = React.useState<Partial<UserProfile>>({});
  const [wallet, setWallet] = React.useState<WalletInfo | null>(null);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [savedProperties, setSavedProperties] = React.useState<Property[]>([]);
  const [realBookings, setRealBookings] = React.useState<(Booking & { property?: Property })[]>([]);
  
  // UI States
  const [isLoading, setIsLoading] = React.useState(true);
  const [editingProfile, setEditingProfile] = React.useState(false);
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [marketingOffers, setMarketingOffers] = React.useState(false);
  const [pushNotifications, setPushNotifications] = React.useState(true);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        console.log('🔄 Fetching dashboard data...');

        // Fetch user profile first as other data might depend on it
        let userData: UserProfile | null = null;
        try {
          userData = await userApi.getProfile();
          console.log('✅ User profile fetched:', userData.name);
          setProfile(userData);
          setProfileDraft(userData);
          setEmailNotifications(userData.notificationPrefs?.email ?? true);
          setPushNotifications(userData.notificationPrefs?.push ?? true);
          setMarketingOffers(userData.notificationPrefs?.marketing ?? false);
        } catch (err) {
          console.error('❌ Failed to fetch user profile:', err);
        }

        // Fetch independent data in parallel
        const [walletData, txData, myBookings] = await Promise.all([
          walletApi.getWalletInfo().catch(err => {
            console.warn('⚠️ Wallet info fetch failed (using mock):', err.message);
            return { balance: 125000, loyaltyPoints: 450, tier: 'Explorer' } as WalletInfo;
          }),
          walletApi.getTransactions().catch(err => {
            console.warn('⚠️ Transaction list fetch failed (using mock):', err.message);
            return [] as Transaction[];
          }),
          bookingApi.listMyBookings().catch(err => {
            console.error('❌ Booking list fetch failed:', err.message);
            return [] as Booking[];
          })
        ]);

        console.log(`✅ Loaded ${myBookings.length} bookings, ${txData.length} transactions.`);
        setWallet(walletData);
        setTransactions(txData);

        // Enrich bookings with property data
        const enrichedBookings = await Promise.all(
          myBookings.map(async (b) => {
            if (b.type === 'flight') {
                return b;
            }
            try {
              if (b.hotelId) {
                const property = await propertyApi.getPropertyById(b.hotelId);
                return { ...b, property };
              }
              return b;
            } catch (err) {
              console.warn(`⚠️ Failed to enrich booking ${b.id}:`, err);
              return b;
            }
          })
        );
        setRealBookings(enrichedBookings);

        // Fetch saved properties if possible
        if (userData?.savedIds?.length) {
          const properties = await Promise.all(
            userData.savedIds.map(id => propertyApi.getPropertyById(id).catch(() => null))
          );
          setSavedProperties(properties.filter(Boolean) as Property[]);
        } else if (userData?.preferences && (userData.preferences as any).savedProperties) {
          // Fallback if savedIds are stored in preferences
          const savedIds = (userData.preferences as any).savedProperties || [];
          const properties = await Promise.all(
            savedIds.map((id: string) => propertyApi.getPropertyById(id).catch(() => null))
          );
          setSavedProperties(properties.filter(Boolean) as Property[]);
        }
      } catch (error) {
        console.error('💥 Critical error in dashboard fetch:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleSaveProfile = async () => {
    if (!profileDraft) return;
    try {
      const updated = await userApi.updateProfile({
        ...profileDraft,
        notificationPrefs: {
          email: emailNotifications,
          push: pushNotifications,
          marketing: marketingOffers
        }
      });
      setProfile(updated);
      setEditingProfile(false);
    } catch (error) {
       console.error('Failed to update profile:', error);
    }
  };

  const sidebarItems: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'saved', label: 'Saved Listings', icon: Heart },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'settings', label: 'Profile Settings', icon: Settings },
  ];

  const Toggle = ({ checked, onChange, id }: { checked: boolean; onChange: (v: boolean) => void; id: string }) => (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-brand-accent ${checked ? 'bg-brand-accent' : 'bg-slate-200'}`}
    >
      <span
        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${checked ? 'left-7' : 'left-1'}`}
        aria-hidden="true"
      />
    </button>
  );

  return (
    <div className="bg-[#F8F9FB] min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-white border-r border-slate-100 flex-none sticky top-16 h-auto lg:h-[calc(100vh-64px)] overflow-y-auto hidden lg:flex flex-col p-8 space-y-10">
        <nav className="space-y-2" role="navigation" aria-label="Dashboard navigation">
          {sidebarItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              aria-current={activeTab === id ? 'page' : undefined}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeTab === id ? 'bg-emerald-50 text-brand-accent' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
              {label}
            </button>
          ))}
        </nav>

        <div className="mt-auto">
          <div className="bg-emerald-600 rounded-4xl p-6 text-white space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-12 -mt-12" aria-hidden="true"></div>
            <h3 className="text-lg font-bold leading-tight">Go Premium</h3>
            <p className="text-emerald-100 text-xs leading-relaxed opacity-80">Unlock exclusive discounts and 24/7 concierge support.</p>
            <button className="w-full bg-white text-emerald-600 py-3 rounded-xl font-bold text-xs hover:bg-emerald-50 transition-all">
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Tab Bar */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto px-4 py-2 bg-white border-b border-slate-100 no-scrollbar">
        {sidebarItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shrink-0 transition-all ${
              activeTab === id ? 'bg-brand-accent text-white' : 'text-slate-400 hover:bg-slate-50'
            }`}
          >
            <Icon className="w-3.5 h-3.5" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* ── DASHBOARD TAB ── */}
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-10">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.3em]">MEMBER DASHBOARD</span>
                    <span className="h-px w-8 bg-brand-accent/20" aria-hidden="true"></span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-display font-bold text-slate-900 uppercase tracking-tighter">
                    Hello, <span className="text-brand-accent italic font-serif">{(profile?.name || 'Explorer').split(' ')[0]}</span>
                  </h1>
                  <p className="text-slate-400 font-serif italic text-lg">"Your next sanctuary is just a few clicks away."</p>
                </div>
                <div className="bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center text-brand-accent">
                    <Sparkles className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Member Status</div>
                    <div className="text-xs font-bold text-brand-accent uppercase tracking-tight">{wallet?.tier || 'Explorer'}</div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Stays', value: isLoading ? '...' : realBookings.length.toString(), change: '+2 this month' },
                  { label: 'Wallet Balance', value: isLoading ? '...' : `₹${(wallet?.balance || 0).toLocaleString()}`, change: '+₹10,000 topped' },
                  { label: 'Saved Places', value: isLoading ? '...' : savedProperties.length.toString(), change: '+3 this week' },
                  { label: 'Loyalty Points', value: isLoading ? '...' : `${wallet?.loyaltyPoints || 0} pts`, change: `${wallet?.tier || 'Explorer'} tier` },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                    <div className="text-2xl font-display font-bold text-slate-900">{stat.value}</div>
                    <div className="text-[10px] text-brand-accent font-bold flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" aria-hidden="true" /> {stat.change}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Bookings preview */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-display font-bold text-slate-900">Recent Bookings</h2>
                  <button onClick={() => setActiveTab('bookings')} className="text-[10px] font-bold text-brand-accent uppercase tracking-widest hover:underline">View All</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {isLoading ? (
                    [1, 2].map(i => <div key={i} className="h-32 bg-slate-200 animate-pulse rounded-[28px]" />)
                  ) : realBookings.length === 0 ? (
                    <div className="col-span-full py-12 text-center bg-white rounded-[28px] border border-dashed border-slate-200">
                       <Sparkles className="w-12 h-12 text-brand-accent/20 mx-auto mb-4" />
                       <p className="text-slate-400 font-serif italic">"Your story is just beginning—book your first sanctuary today."</p>
                    </div>
                  ) : (
                    realBookings.slice(0, 4).map((b) => {
                      const isFlight = b.type === 'flight';
                      const fData = (b as any).flightData;
                      return (
                      <div key={b.id} className="bg-white rounded-[28px] overflow-hidden border border-slate-100 shadow-sm flex gap-4 p-4">
                        <div className={`w-20 h-20 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center ${isFlight ? 'bg-slate-50' : ''}`}>
                          {isFlight ? (
                            <img src={fData?.logo || 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&w=100'} className="w-12 h-12 object-contain" />
                          ) : (
                            <img 
                              src={b.property?.image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400'} 
                              alt={b.property?.name} 
                              className="w-full h-full object-cover" 
                              loading="lazy" 
                            />
                          )}
                        </div>
                        <div className="flex-1 space-y-1 flex flex-col justify-center">
                          <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                            {isFlight ? `${fData?.departure?.iata || 'SRC'} ➔ ${fData?.arrival?.iata || 'DST'} Flight` : (b.property?.name || 'StayEase Sanctuary')}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            {isFlight ? (
                              <><Plane className="w-3 h-3" aria-hidden="true" /> {fData?.airline || 'Airline'}</>
                            ) : (
                              <><MapPin className="w-3 h-3" aria-hidden="true" /> {b.property?.location || 'Unknown location'}</>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{new Date(b.travelDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${b.status === 'confirmed' || b.status === 'Confirmed' ? 'bg-emerald-50 text-brand-accent' : 'bg-rose-50 text-rose-500'}`}>
                              {b.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      )
                    })
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── BOOKINGS TAB ── */}
          {activeTab === 'bookings' && (
            <motion.div key="bookings" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <h1 className="text-4xl font-display font-bold text-slate-900 uppercase tracking-tight">My Bookings</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading ? (
                  [1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-4xl" />)
                ) : realBookings.length === 0 ? (
                  <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-slate-100 flex flex-col items-center gap-6">
                     <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-brand-accent mb-2">
                        <Calendar className="w-10 h-10" />
                     </div>
                     <div className="space-y-2 max-w-xs">
                        <h3 className="text-xl font-bold text-slate-900">No Reservations Yet</h3>
                        <p className="text-sm text-slate-400">Discover your next luxury stay and start making memories with StayEase.</p>
                     </div>
                     <button 
                        onClick={() => navigate('/hotels')}
                        className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-brand-accent transition-all"
                     >
                        Browse Collections
                     </button>
                  </div>
                ) : (
                  realBookings.map((booking) => {
                    const isFlight = booking.type === 'flight';
                    const fData = (booking as any).flightData;
                    
                    return (
                    <motion.div
                      key={booking.id}
                      whileHover={{ y: -8 }}
                      className="bg-white rounded-4xl overflow-hidden border border-slate-100 shadow-sm group cursor-pointer"
                    >
                      <div className="h-48 relative overflow-hidden flex items-center justify-center bg-slate-50">
                        {isFlight ? (
                           <div className="text-center w-full px-8 relative z-10 transition-transform duration-700 group-hover:scale-110">
                              <div className="flex items-center justify-between mb-2">
                                 <div className="text-3xl font-display font-bold text-slate-900">{fData?.departure?.iata || 'SRC'}</div>
                                 <Plane className="w-8 h-8 text-brand-accent mx-4 opacity-50" />
                                 <div className="text-3xl font-display font-bold text-slate-900">{fData?.arrival?.iata || 'DST'}</div>
                              </div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{fData?.airline || 'Airline'}</div>
                           </div>
                        ) : (
                          <img 
                            src={booking.property?.image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400'} 
                            alt={booking.property?.name} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                            loading="lazy" 
                          />
                        )}
                        <div className={`absolute top-4 left-4 px-3 py-1 z-20 rounded-lg text-[10px] font-bold uppercase tracking-widest ${booking.status === 'confirmed' || booking.status === 'Confirmed' ? 'bg-brand-accent text-white' : 'bg-rose-600 text-white'}`}>
                          {booking.status}
                        </div>
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{isFlight ? `Flight to ${fData?.arrival?.city || 'Destination'}` : (booking.property?.name || 'StayEase Sanctuary')}</h3>
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            {isFlight ? <Plane className="w-3 h-3" /> : <MapPin className="w-3 h-3" aria-hidden="true" />}
                            {isFlight ? (fData?.duration || 'Unknown duration') : (booking.property?.location || 'Unknown location')}
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                          <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</div>
                            <div className="text-sm font-bold text-slate-900">{new Date(booking.travelDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                          </div>
                          <div className={`text-xs font-bold uppercase tracking-widest ${booking.status === 'confirmed' || booking.status === 'Confirmed' ? 'text-brand-accent' : 'text-slate-400'}`}>
                            ST-{(booking.id.substring(0,6)).toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )})
                )}
              </div>
            </motion.div>
          )}

          {/* ── SAVED LISTINGS TAB ── */}
          {activeTab === 'saved' && (
            <motion.div key="saved" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <h1 className="text-4xl font-display font-bold text-slate-900 uppercase tracking-tight">Saved Listings</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  [1, 2, 3].map(i => <div key={i} className="h-56 bg-white animate-pulse rounded-4xl" />)
                ) : savedProperties.length === 0 ? (
                  <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-slate-100">
                    <Heart className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                    <p className="text-slate-400 font-serif italic text-lg">"Your sanctuary wishlist awaits."</p>
                  </div>
                ) : (
                  savedProperties.map((listing) => (
                    <div key={listing.id} className="relative group cursor-pointer" onClick={() => navigate(`/property/${listing.id}`)}>
                      <div className="h-56 rounded-4xl overflow-hidden">
                        <img src={listing.image} alt={listing.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent rounded-4xl" aria-hidden="true"></div>
                        <div className="absolute bottom-6 left-6 text-white">
                          <div className="text-sm font-bold line-clamp-1">{listing.name}</div>
                          <div className="text-[10px] opacity-80">{listing.location}</div>
                        </div>
                        <button
                          className="absolute top-4 right-4 w-8 h-8 bg-rose-500 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:scale-110 transition-all"
                          aria-label={`Remove ${listing.name} from saved`}
                          onClick={async (e) => { 
                            e.stopPropagation(); 
                            await userApi.toggleSavedProperty(listing.id);
                            setSavedProperties(prev => prev.filter(p => p.id !== listing.id));
                          }}
                        >
                          <Heart className="w-4 h-4 fill-current" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
                <div onClick={() => navigate('/hotels')} className="bg-slate-100 rounded-4xl flex flex-col items-center justify-center p-8 gap-2 cursor-pointer hover:bg-emerald-50 transition-all group">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
                    <ChevronRight className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Explore More</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── WALLET TAB ── */}
          {activeTab === 'wallet' && (
            <motion.div key="wallet" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <h1 className="text-4xl font-display font-bold text-slate-900 uppercase tracking-tight">My Wallet</h1>
              
              <div className="bg-brand-primary rounded-[40px] p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-brand-accent/20 rounded-full blur-3xl -mr-24 -mt-24" aria-hidden="true"></div>
                <div className="relative z-10 space-y-8">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">Available Balance</div>
                    <div className="text-6xl font-display font-bold tracking-tighter">₹{(wallet?.balance || 0).toLocaleString()}</div>
                    <div className="text-xs text-brand-accent/80 font-bold">{wallet?.loyaltyPoints || 0} Loyalty Points — {wallet?.tier || 'Explorer'} Tier</div>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={async () => {
                         const updated = await walletApi.topUp(1000);
                         setWallet(updated);
                      }}
                      className="flex-1 bg-white text-brand-primary py-4 rounded-2xl font-bold text-sm hover:bg-brand-accent hover:text-white transition-all shadow-lg"
                    >
                      Top Up ₹1,000
                    </button>
                    <button className="flex-1 bg-white/10 backdrop-blur-md text-white border border-white/10 py-4 rounded-2xl font-bold text-sm hover:bg-white/20 transition-all">
                      Transfer
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm space-y-6">
                <h2 className="text-2xl font-display font-bold text-slate-900">Recent Transactions</h2>
                <div className="space-y-4">
                  {isLoading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-50 animate-pulse rounded-3xl" />)
                  ) : transactions.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 font-serif italic">No transactions recorded.</div>
                  ) : (
                    transactions.map((t) => (
                      <div key={t.id} className="flex items-center justify-between p-6 bg-[#F8F9FB] rounded-3xl group cursor-pointer hover:bg-white hover:shadow-xl hover:shadow-brand-accent/10 transition-all border border-transparent hover:border-brand-accent/20">
                        <div className="flex items-center gap-6">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${t.type === 'income' ? 'bg-brand-accent/10 text-brand-accent' : 'bg-rose-50 text-rose-500'}`}>
                            {t.type === 'income' ? <TrendingUp className="w-5 h-5" aria-hidden="true" /> : <CreditCard className="w-5 h-5" aria-hidden="true" />}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900 line-clamp-1">{t.title}</div>
                            <div className="text-xs text-slate-400">{new Date(t.date).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${t.type === 'income' ? 'text-brand-accent' : 'text-rose-500'}`}>
                            {t.type === 'income' ? '+' : '-'}₹{Math.abs(t.amount).toLocaleString()}
                          </div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.method}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── SETTINGS TAB ── */}
          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <h1 className="text-4xl font-display font-bold text-slate-900 uppercase tracking-tight">Profile Settings</h1>

              <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm space-y-10">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-8">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-100">
                        {profile?.avatar ? (
                          <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                             <User className="w-10 h-10" />
                          </div>
                        )}
                      </div>
                      <button className="absolute bottom-0 right-0 w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center text-white border-2 border-white shadow-lg" aria-label="Change profile photo">
                        <Camera className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                    <div>
                      <h2 className="text-2xl font-display font-bold text-slate-900">{profile?.name || 'Explorer'}</h2>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Member since {profile?.memberSince || 'Oct 2023'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (editingProfile) {
                        handleSaveProfile();
                      } else {
                        setEditingProfile(true);
                      }
                    }}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${editingProfile ? 'bg-brand-accent text-white' : 'bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100'}`}
                    aria-label={editingProfile ? 'Save profile changes' : 'Edit profile'}
                  >
                    {editingProfile ? <><Save className="w-4 h-4" aria-hidden="true" /> Save</> : <><Edit className="w-4 h-4" aria-hidden="true" /> Edit</>}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {([
                    { label: 'Full Name', key: 'name', icon: User, type: 'text' },
                    { label: 'Email Address', key: 'email', icon: Mail, type: 'email' },
                    { label: 'Phone Number', key: 'phone', icon: Smartphone, type: 'tel' },
                    { label: 'University', key: 'university', icon: ShieldCheck, type: 'text' },
                  ] as { label: string; key: keyof UserProfile; icon: React.ElementType; type: string }[]).map(({ label, key, icon: Icon, type }) => (
                    <div key={String(key)} className="space-y-2">
                      <label htmlFor={`setting-${String(key)}`} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5" aria-hidden="true" /> {label}
                      </label>
                      <input
                        id={`setting-${String(key)}`}
                        type={type}
                        value={editingProfile ? (profileDraft[key as keyof UserProfile] as string || '') : (profile?.[key as keyof UserProfile] as string || '')}
                        onChange={(e) => setProfileDraft(prev => ({ ...prev, [key]: e.target.value }))}
                        disabled={!editingProfile}
                        className={`w-full px-5 py-4 rounded-2xl text-sm font-medium transition-all outline-none border ${editingProfile ? 'bg-white border-brand-accent/30 focus:ring-2 focus:ring-brand-accent/20' : 'bg-slate-50 border-slate-100 text-slate-700 cursor-default'}`}
                      />
                    </div>
                  ))}
                </div>

                {editingProfile && (
                  <button onClick={() => { setEditingProfile(false); setProfileDraft(profile || {}); }} className="flex items-center gap-2 text-slate-400 hover:text-rose-500 text-xs font-bold uppercase tracking-widest transition-colors">
                    <X className="w-4 h-4" aria-hidden="true" /> Cancel
                  </button>
                )}
              </div>

              {/* Notifications */}
              <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm space-y-8">
                <h2 className="text-2xl font-display font-bold text-slate-900">Notification Preferences</h2>
                <div className="space-y-6">
                  {[
                    { label: 'Email Notifications', desc: 'Receive booking confirmations and invoices via email.', value: emailNotifications, onChange: setEmailNotifications, id: 'notif-email' },
                    { label: 'Push Notifications', desc: 'Get real-time alerts for deals and booking updates.', value: pushNotifications, onChange: setPushNotifications, id: 'notif-push' },
                    { label: 'Marketing Offers', desc: 'Stay updated with personalised travel deals and discounts.', value: marketingOffers, onChange: setMarketingOffers, id: 'notif-marketing' },
                  ].map(({ label, desc, value, onChange, id }) => (
                    <div key={id} className="flex items-center justify-between gap-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <div>
                        <div className="text-sm font-bold text-slate-900">{label}</div>
                        <p className="text-xs text-slate-400 mt-1">{desc}</p>
                      </div>
                      <Toggle checked={value} onChange={onChange} id={id} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Security */}
              <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm space-y-6">
                <h2 className="text-2xl font-display font-bold text-slate-900">Security</h2>
                <button className="flex items-center gap-4 w-full p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-brand-accent/30 hover:bg-brand-accent/5 transition-all group">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-accent shadow-sm">
                    <Lock className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-slate-900 group-hover:text-brand-accent transition-colors">Change Password</div>
                    <div className="text-xs text-slate-400">Last changed 30 days ago</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 ml-auto group-hover:text-brand-accent transition-colors" aria-hidden="true" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;
