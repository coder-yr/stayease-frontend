import React from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  User, 
  Heart, 
  Share2, 
  ArrowRight, 
  ChevronRight, 
  Bookmark, 
  TrendingUp, 
  Sparkles,
  MessageSquare,
  MoreHorizontal
} from 'lucide-react';
import { motion } from 'motion/react';

const Journal: React.FC = () => {
  const categories = ['All Stories', 'Travel', 'Student Living', 'Budget Tips', 'City Guides'];
  
  const articles = [
    {
      id: 1,
      title: "The Modern Nomad's Guide to Student Living.",
      excerpt: "Discover how today's students are redefining shared spaces and finding sanctuary in the heart of bustling cities.",
      author: 'Elena Rodriguez',
      role: 'Editorial Director',
      readTime: '8 min read',
      category: 'Featured Story',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1000',
      featured: true
    },
    {
      id: 2,
      title: 'Hidden Gems: 5 European Cities Every Student Must Visit.',
      excerpt: "From the cobblestone streets of Prague to the sun-soaked plazas of Valencia, we've mapped out the ultimate budget-friendly escapes.",
      author: 'Marcus Chen',
      readTime: '12 min read',
      category: 'TRAVEL',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 3,
      title: 'The Art of Shared Cooking: Gourmet on a Budget.',
      excerpt: "Cooking with flatmates doesn't have to be a chore. Master the skills of meal prepping for four under $20.",
      author: 'Sarah Jenkins',
      readTime: '6 min read',
      category: 'BUDGET TIPS',
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 4,
      title: "Living High in Dubai: A Student's Perspective.",
      excerpt: "Navigate the luxury capital of the world without breaking the bank. Insider tips on housing and leisure.",
      author: 'David Okafor',
      readTime: '15 min read',
      category: 'CITY GUIDES',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=600'
    }
  ];

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Hero Section */}
      <section className="bg-slate-950 py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-emerald-400/30"></span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.3em] block">THE JOURNAL</span>
              <span className="h-px w-12 bg-emerald-400/30"></span>
            </div>
            <h1 className="text-7xl md:text-9xl font-display font-bold text-white leading-[0.8] tracking-tighter uppercase">
              Stories <br />
              <span className="text-emerald-500 italic serif-italic">& Insights</span>
            </h1>
            <p className="text-emerald-100/60 font-serif italic text-xl max-w-2xl mx-auto">
              "A collection of hand-picked narratives from the world's most curious travelers."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] shadow-2xl shadow-emerald-900/10 overflow-hidden flex flex-col lg:flex-row items-stretch border border-slate-100"
        >
          <div className="lg:w-1/2 h-[500px] lg:h-auto overflow-hidden">
            <img 
              src={articles[0].image} 
              alt={articles[0].title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center space-y-8">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.3em]">FEATURED STORY</span>
              <span className="h-px flex-grow bg-emerald-100"></span>
              <span className="text-[10px] font-serif italic text-slate-400 uppercase tracking-widest">Editor's Choice</span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-display font-bold text-slate-900 leading-[0.9] tracking-tight uppercase">
              The Modern <br />
              <span className="text-emerald-500 italic serif-italic">Nomad's Guide</span>
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed max-w-md font-serif italic">
              Discover how today's students are redefining shared spaces and finding sanctuary in the heart of bustling cities.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-100">
                <img src="https://i.pravatar.cc/150?u=elena" alt="Elena" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">Elena Rodriguez</div>
                <div className="text-xs text-slate-400 uppercase tracking-widest">Editorial Director • 8 min read</div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
            <div className="flex bg-slate-900/5 backdrop-blur-md border border-brand-accent/20 p-2 rounded-full mb-12">
              {['Features', 'Interviews', 'Guides'].map((tab) => (
                <button 
                  key={tab}
                  className={`px-12 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                    tab === 'Features' 
                      ? 'bg-brand-accent text-white shadow-2xl shadow-brand-accent/20' 
                      : 'text-brand-accent hover:bg-brand-accent/5'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
      </section>

      {/* Article Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {articles.slice(1).map((article) => (
            <motion.div 
              key={article.id}
              whileHover={{ y: -10 }}
              className="group cursor-pointer space-y-8"
            >
              <div className="aspect-[4/5] rounded-[48px] overflow-hidden border border-slate-100 shadow-sm relative">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-8 left-8">
                  <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                     <span className="text-[9px] font-bold text-brand-accent uppercase tracking-widest leading-none">{article.category}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4 px-2">
                <h3 className="text-3xl font-display font-bold text-slate-900 group-hover:text-brand-accent transition-colors leading-tight uppercase">{article.title}</h3>
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-4 border-t border-slate-50">
                  <span>{article.readTime}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-accent"></div>
                  <span>By {article.author}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Letter from Editor */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 text-center space-y-12">
        <div className="flex items-center justify-center gap-4">
          <span className="h-px w-8 bg-emerald-200"></span>
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.3em]">A THOUGHT</span>
          <span className="h-px w-8 bg-emerald-200"></span>
        </div>
        <blockquote className="text-4xl md:text-6xl font-serif italic text-slate-900 leading-tight">
          "Travel is not about the destination, but the <span className="text-emerald-600">human connections</span> we make along the way."
        </blockquote>
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-100 shadow-xl">
            <img src="https://i.pravatar.cc/150?u=sarah" alt="Editor" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-1">
            <cite className="text-xs font-bold text-slate-900 uppercase tracking-widest not-italic">Sarah Jenkins</cite>
            <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Editor-in-Chief</p>
          </div>
        </div>
      </section>

      {/* Deep Dive Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
        <div className="bg-slate-50 rounded-[60px] p-16 md:p-24 text-center space-y-12 relative overflow-hidden border border-slate-100">
          {/* Quote Mark Decoration */}
          <div className="absolute top-12 right-12 text-[200px] font-serif text-slate-200 leading-none select-none opacity-50">”</div>
          
          <div className="space-y-4 relative z-10">
            <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em]">Deep Dive</div>
            <h2 className="text-5xl md:text-7xl font-display font-bold text-slate-900 leading-tight uppercase tracking-tighter">Finding <span className="text-emerald-500 italic serif-italic">Silence</span> <br /> in the Chaos.</h2>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">May 12, 2024 • Long Read</div>
          </div>

          <div className="max-w-2xl mx-auto text-left space-y-8 relative z-10">
            <p className="text-slate-600 text-lg leading-relaxed">
              In the heart of Mumbai, where the pulse of the city never truly slows, finding a space that feels like your own is more than a luxury—it's a necessity for survival. Student housing has traditionally been seen as a temporary transit point, a place of bunk beds and shared chaos.
            </p>
            
            <div className="pl-8 border-l-4 border-emerald-600 py-4 italic text-2xl text-emerald-600 font-serif leading-relaxed">
              "The modern sanctuary isn't defined by its square footage, but by the intentionality of the light and the silence it provides."
            </div>

            <p className="text-slate-600 text-lg leading-relaxed">
              We spoke with local architects who are reimagining compact living. By utilizing vertical space and high-end tonal layering, they are transforming 200-square-foot studios into expansive retreats that nourish the mind.
            </p>
          </div>

          <div className="flex items-center justify-center gap-8 pt-12 border-t border-slate-200 relative z-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Share this story</span>
            <div className="flex gap-4">
              <button className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:bg-emerald-600 hover:text-white transition-all">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:bg-emerald-600 hover:text-white transition-all">
                <Bookmark className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:bg-emerald-600 hover:text-white transition-all">
                <Heart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Journal;
