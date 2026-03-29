import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { apiPost } from '../services/apiClient';

type AuthResponse = {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
  };
  session: {
    accessToken: string;
    tokenType: 'Bearer';
  };
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const data = await apiPost<AuthResponse>('/auth/login', {
        email: email.trim(),
        password
      });

      localStorage.setItem('accessToken', data.session.accessToken);
      localStorage.setItem('session', JSON.stringify(data.session));
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message.includes('{') ? 'Invalid email or password.' : message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex relative overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-1/4 -right-1/4 w-[100vw] h-[100vw] rounded-full bg-brand-primary/5 blur-3xl mix-blend-multiply" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[80vw] h-[80vw] rounded-full bg-brand-accent/5 blur-3xl mix-blend-multiply" />
      </div>

      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-32 z-10 w-full lg:w-1/2">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Link to="/" className="flex items-center gap-2 mb-12">
              <span className="text-3xl font-display font-bold text-brand-primary tracking-tight">Stay<span className="text-brand-accent italic font-serif">Ease</span></span>
            </Link>
            
            <h2 className="text-3xl font-display font-bold tracking-tight text-brand-primary">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Enter your details to access your account.
            </p>
          </motion.div>

          <motion.div 
            className="mt-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                  {error}
                </div>
              )}

              <motion.div variants={itemVariants}>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-600 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent/50 transition-all outline-none text-brand-primary shadow-sm"
                    placeholder="name@example.com"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-600">
                    Password
                  </label>
                  <a href="#" className="flex-shrink-0 text-xs font-semibold text-brand-accent hover:text-brand-accent-light transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent/50 transition-all outline-none text-brand-primary shadow-sm"
                    placeholder="••••••••"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 btn-primary group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span className="text-sm font-semibold tracking-wide">
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                  </span>
                  {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </button>
              </motion.div>
            </form>

            <motion.div variants={itemVariants} className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-brand-bg text-slate-500 font-medium">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <button className="flex justify-center items-center gap-2 w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  Google
                </button>
                <button className="flex justify-center items-center gap-2 w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.254-.447-1.27.098-2.646 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.376.202 2.394.1 2.646.64.699 1.026 1.591 1.026 2.682 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  GitHub
                </button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8 text-center">
              <p className="text-sm font-medium text-slate-500">
                Don't have an account?{' '}
                <Link to="/signup" className="text-brand-accent hover:text-brand-accent-light hover:underline font-semibold transition-colors">
                  Sign up for free
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Hero Image Section */}
      <motion.div 
        className="hidden lg:block lg:flex-1 relative"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="absolute inset-0 w-full h-full">
          <img
            className="absolute inset-0 w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1542314831-c6a4d27eceh1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="StayEase Premium Property"
          />
          <div className="hero-image-overlay absolute inset-0 mix-blend-multiply opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/90 via-brand-primary/20 to-transparent" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-16 flex flex-col justify-end">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-xl text-brand-bg relative z-10"
          >
             <div className="flex items-center gap-2 mb-4">
               <Sparkles className="w-5 h-5 text-brand-accent-light" />
               <span className="micro-label text-brand-accent-light tracking-[0.3em]">StayEase Exclusives</span>
             </div>
             <h3 className="text-4xl font-display font-medium text-white mb-4 leading-tight">
               Discover extraordinary places with unexpected perks.
             </h3>
             <p className="text-lg text-white/80 font-sans font-light">
               Join a curated network of visionary travelers and access premium properties around the globe.
             </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
