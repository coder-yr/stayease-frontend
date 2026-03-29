import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Plane, Hotel, GraduationCap, User } from 'lucide-react';
import { getAccessToken } from '../services/apiClient';

/**
 * MobileNav — bottom navigation bar visible only on mobile (md: hidden).
 * Items are kept consistent with the desktop Navbar links.
 * The AI route (/ai) is intentionally excluded because App.tsx hides the
 * shell (including MobileNav) on /ai — linking it here would create a dead-end.
 */
const MobileNav: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(!!getAccessToken());

  React.useEffect(() => {
    const syncAuthState = () => setIsAuthenticated(!!getAccessToken());

    syncAuthState();
    window.addEventListener('storage', syncAuthState);
    window.addEventListener('focus', syncAuthState);

    return () => {
      window.removeEventListener('storage', syncAuthState);
      window.removeEventListener('focus', syncAuthState);
    };
  }, []);

  const items = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Plane, label: 'Flights', path: '/flights' },
    { icon: Hotel, label: 'Hotels', path: '/hotels' },
    { icon: GraduationCap, label: 'PG / Rooms', path: '/pg' },
    { icon: User, label: isAuthenticated ? 'Dashboard' : 'Sign In', path: isAuthenticated ? '/dashboard' : '/login' },
  ];

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 border-t ${
        isAuthenticated ? 'pb-safe' : ''
      } bg-white/80 backdrop-blur-2xl border-slate-200/50 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] ring-1 ring-black/5 rounded-t-3xl`}
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {items.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            aria-label={label}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1.5 py-3 px-4 rounded-full transition-all duration-500 min-w-[64px] ${
                isActive
                  ? 'text-white bg-[#1a2b2b] shadow-lg shadow-black/10 translate-y-[-6px]'
                  : 'text-slate-400 hover:text-slate-600 active:scale-90'
              }`
            }
          >
            <Icon className="w-5 h-5" aria-hidden="true" />
            <span className="text-[8px] font-bold uppercase tracking-wider leading-none">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;
