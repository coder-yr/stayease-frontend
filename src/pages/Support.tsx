import React from 'react';
import { 
  Search, 
  MessageCircle, 
  Phone, 
  Mail, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  Globe,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

const Support: React.FC = () => {
  const faqs = [
    { question: 'How do I cancel my booking?', category: 'Bookings' },
    { question: 'What is the student verification process?', category: 'Students' },
    { question: 'How can I pay using crypto?', category: 'Payments' },
    { question: 'Is my security deposit refundable?', category: 'Refunds' },
  ];

  const contactMethods = [
    { icon: MessageCircle, title: 'Live Chat', desc: 'Average response: 2 mins', color: 'bg-brand-accent/10 text-brand-accent' },
    { icon: Phone, title: 'Call Us', desc: '+91 1800-STAY-EASE', color: 'bg-brand-accent/10 text-brand-accent' },
    { icon: Mail, title: 'Email Support', desc: 'support@stayease.com', color: 'bg-rose-50 text-rose-600' },
  ];

  return (
    <div className="bg-white min-h-screen pb-32">
      {/* Hero Section */}
      <section className="bg-brand-primary py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-accent/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <span className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.3em] block">HELP CENTER</span>
            <h1 className="text-6xl md:text-8xl font-display font-bold text-white leading-[0.85] tracking-tighter uppercase">
              How can we <br />
              <span className="text-brand-accent italic">assist</span> you?
            </h1>
          </motion.div>

          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 w-6 h-6" />
            <input 
              type="text" 
              placeholder="Search for topics, guides, or FAQs..." 
              className="w-full pl-16 pr-8 py-6 bg-white/5 border border-white/10 rounded-[32px] text-white font-medium focus:ring-2 focus:ring-brand-accent transition-all outline-none"
            />
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactMethods.map((method, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className="bg-white p-10 rounded-[40px] shadow-2xl shadow-brand-primary/5 border border-slate-100 space-y-6 group cursor-pointer"
            >
              <div className={`w-16 h-16 ${method.color} rounded-[24px] flex items-center justify-center transition-all duration-500 group-hover:scale-110`}>
                <method.icon className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-bold text-slate-900 uppercase tracking-tight">{method.title}</h3>
                <p className="text-slate-400 text-sm font-serif italic">{method.desc}</p>
              </div>
              <div className="flex items-center gap-2 text-brand-primary font-bold text-xs uppercase tracking-widest pt-4">
                Connect Now <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Meet the Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-40">
        <div className="text-center mb-20 space-y-6">
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-brand-primary/20"></span>
            <span className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.3em] block">OUR PEOPLE</span>
            <span className="h-px w-12 bg-brand-primary/20"></span>
          </div>
          <h2 className="text-6xl font-display font-bold text-slate-900 uppercase tracking-tighter">Real humans, <br /> <span className="text-brand-accent italic serif-italic">real support.</span></h2>
          <p className="text-slate-400 font-serif italic text-lg max-w-2xl mx-auto">"We're not just a platform; we're a team of travelers dedicated to making your journey seamless."</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { name: 'Arjun Mehta', role: 'Head of Support', img: 'https://i.pravatar.cc/150?u=arjun' },
            { name: 'Priya Rai', role: 'Safety Specialist', img: 'https://i.pravatar.cc/150?u=priya' },
            { name: 'Kevin Smith', role: 'Housing Expert', img: 'https://i.pravatar.cc/150?u=kevin' },
            { name: 'Aisha Khan', role: 'Travel Concierge', img: 'https://i.pravatar.cc/150?u=aisha' }
          ].map((member, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className="text-center space-y-4"
            >
              <div className="aspect-square rounded-[40px] overflow-hidden border-2 border-brand-primary/10 shadow-xl">
                <img src={member.img} alt={member.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 uppercase tracking-tight">{member.name}</h4>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-display font-bold text-slate-900 uppercase">Frequently Asked Questions</h2>
          <p className="text-slate-500 font-serif italic">Quick answers to the most common questions from our community.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="group bg-slate-50 rounded-[24px] p-8 border border-transparent hover:border-brand-primary/20 hover:bg-white hover:shadow-xl transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest">{faq.category}</span>
                  <h4 className="text-xl font-bold text-slate-900">{faq.question}</h4>
                </div>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-8">
          <button className="bg-brand-primary text-white px-12 py-5 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-brand-accent transition-all shadow-xl">
            View All FAQs
          </button>
        </div>
      </section>

      {/* Trust Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-40">
        <div className="bg-brand-primary rounded-[60px] p-16 md:p-24 text-white flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mt-32"></div>
          
          <div className="max-w-xl space-y-6 relative z-10 text-center md:text-left">
            <h2 className="text-5xl font-display font-bold leading-tight uppercase">Your safety is our <br /> <span className="text-brand-accent italic">top priority.</span></h2>
            <p className="text-emerald-100/60 text-lg font-serif italic">"We use industry-leading security protocols to ensure your data and transactions are always protected."</p>
          </div>

          <div className="grid grid-cols-2 gap-8 relative z-10">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Verified Listings</span>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                <Clock className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">24/7 Monitoring</span>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                <Zap className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Instant Support</span>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                <Globe className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Global Standards</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Support;
