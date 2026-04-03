import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { apiPost } from '../services/apiClient';

type AuthResponse = {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
    preferences?: Record<string, unknown> | null;
  };
  session: {
    accessToken: string;
    tokenType: 'Bearer';
  };
};

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState<'user' | 'owner'>('user');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setIsSubmitting(true);

    try {
      const data = await apiPost<AuthResponse>('/auth/signup', {
        name: name.trim(),
        email: email.trim(),
        password,
        accountType
      });

      localStorage.setItem('accessToken', data.session.accessToken);
      localStorage.setItem('session', JSON.stringify(data.session));
      localStorage.setItem('user', JSON.stringify(data.user));

      if (accountType === 'owner') {
        setInfo('Owner request submitted. An admin must approve your owner access.');
      }

      navigate(accountType === 'owner' ? '/owner/dashboard' : '/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      setError(message.includes('{') ? 'Unable to create account. Please try again.' : message);
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
        <div className="mx-auto w-full max-w-sm lg:w-96 my-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Link to="/" className="flex items-center gap-2 mb-12">
              <span className="text-3xl font-display font-bold text-brand-primary tracking-tight">Stay<span className="text-brand-accent italic font-serif">Ease</span></span>
            </Link>
            
            <h2 className="text-3xl font-display font-bold text-brand-primary">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Join the StayEase community today.
            </p>
          </motion.div>

          <motion.div 
            className="mt-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                  {error}
                </div>
              )}

              {info && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                  {info}
                </div>
              )}

              <motion.div variants={itemVariants}>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-600 mb-2">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAccountType('user')}
                    className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                      accountType === 'user'
                        ? 'border-brand-accent bg-brand-accent/10 text-brand-accent'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Traveler
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('owner')}
                    className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                      accountType === 'owner'
                        ? 'border-brand-accent bg-brand-accent/10 text-brand-accent'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Hotel Owner
                  </button>
                </div>
                {accountType === 'owner' && (
                  <p className="mt-2 text-xs text-slate-500">
                    Owner accounts are reviewed by admin before listing hotels.
                  </p>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-600 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent/50 transition-all outline-none text-brand-primary shadow-sm"
                    placeholder="John Doe"
                  />
                </div>
              </motion.div>

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
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-600 mb-2">
                  Password
                </label>
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
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 btn-primary group disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                  <span className="text-sm font-semibold tracking-wide">
                    {isSubmitting ? 'Creating account...' : 'Create Account'}
                  </span>
                  {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </button>
              </motion.div>
            </form>

            <motion.div variants={itemVariants} className="mt-8 text-center">
              <p className="text-sm font-medium text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="text-brand-accent hover:text-brand-accent-light hover:underline font-semibold transition-colors">
                  Sign in
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
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
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
               <span className="micro-label text-brand-accent-light tracking-[0.3em]">StayEase Sign Up</span>
             </div>
             <h3 className="text-4xl font-display font-medium text-white mb-4 leading-tight">
               Your gateway to premium travel experiences starts here.
             </h3>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
