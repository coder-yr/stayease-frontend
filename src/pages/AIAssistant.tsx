import React from 'react';
import { 
  Sparkles, 
  Send, 
  Mic, 
  Paperclip, 
  Bot, 
  User, 
  Plane, 
  Hotel, 
  Train, 
  MapPin, 
  Star, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Zap, 
  MessageSquare, 
  X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { useNavigate } from 'react-router-dom';

const AIAssistant: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = React.useState([
    {
      id: 1,
      type: 'bot',
      text: "Hello! I'm your StayEase AI Concierge. How can I help you plan your perfect trip today?",
      timestamp: '10:00 AM'
    }
  ]);
  const [inputValue, setInputValue] = React.useState('');

  const suggestions = [
    { text: 'Find luxury hotels in Singapore', icon: Hotel },
    { text: 'Cheapest flights to Tokyo', icon: Plane },
    { text: 'Student housing near NUS', icon: MapPin },
    { text: 'Best time to visit Bali', icon: Clock },
  ];

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newUserMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newUserMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        text: "That's a great question! Based on your preferences, I've found some excellent options for you. Here are the top recommendations:",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        card: {
          title: 'The Zenith Luxury Suites',
          location: 'Downtown, Singapore',
          rating: 4.9,
          price: 245,
          image: 'https://picsum.photos/seed/hotel1/400/300'
        }
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-primary/10">
            <Sparkles className="w-6 h-6 text-brand-accent" />
          </div>
          <div>
            <h2 className="text-lg font-display font-bold text-slate-900">StayEase AI Concierge</h2>
            <div className="flex items-center gap-1.5 text-xs text-brand-accent font-bold uppercase tracking-widest">
              <span className="w-2 h-2 bg-brand-accent rounded-full animate-pulse"></span>
              Online & Ready
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-accent transition-colors">
            <Clock className="w-4 h-4" />
            History
          </button>
          <button 
            onClick={() => navigate(-1)}
            className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scrollbar-hide">
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-4 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-none shadow-sm ${
                msg.type === 'bot' ? 'bg-brand-accent text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}>
                {msg.type === 'bot' ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
              </div>
              <div className={`flex flex-col gap-2 max-w-[80%] ${msg.type === 'user' ? 'items-end' : ''}`}>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.type === 'bot' 
                    ? 'bg-white text-slate-700 border border-slate-100 rounded-tl-none' 
                    : 'bg-slate-900 text-white rounded-tr-none'
                }`}>
                  {msg.text}
                </div>
                
                {/* Rich Card Response */}
                {msg.card && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xl w-full sm:w-80 group cursor-pointer"
                  >
                    <div className="h-40 overflow-hidden relative">
                      <img src={msg.card.image} alt={msg.card.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-bold">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        {msg.card.rating}
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <h4 className="font-bold text-slate-900 group-hover:text-brand-accent transition-colors">{msg.card.title}</h4>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="w-3 h-3" />
                        {msg.card.location}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                        <div className="text-xs text-slate-400">
                          From <span className="text-slate-900 font-bold text-lg">${msg.card.price}</span>
                        </div>
                        <button className="p-2 bg-slate-50 text-slate-900 rounded-lg hover:bg-brand-accent hover:text-white transition-all">
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{msg.timestamp}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-4 md:p-6 shadow-2xl">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Suggestions */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {suggestions.map((s, idx) => (
              <button 
                key={idx}
                onClick={() => setInputValue(s.text)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-xs font-bold text-slate-600 hover:bg-brand-accent/10 hover:text-brand-accent hover:border-brand-accent/20 transition-all whitespace-nowrap shadow-sm"
              >
                <s.icon className="w-3 h-3" />
                {s.text}
              </button>
            ))}
          </div>

          {/* Main Input */}
          <div className="relative flex items-center gap-3">
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-3 text-slate-400">
                <button className="hover:text-brand-accent transition-colors"><Paperclip className="w-5 h-5" /></button>
              </div>
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything... (e.g. 'Plan a 3-day trip to Singapore')" 
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all shadow-inner"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 text-slate-400">
                <button className="hover:text-brand-accent transition-colors"><Mic className="w-5 h-5" /></button>
                <button 
                  onClick={handleSend}
                  className="bg-slate-900 text-white p-2 rounded-xl hover:bg-brand-accent transition-all shadow-sm active:scale-90"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Secure & Private</div>
            <div className="flex items-center gap-1.5"><Zap className="w-3 h-3" /> Real-time Data</div>
            <div className="flex items-center gap-1.5"><MessageSquare className="w-3 h-3" /> 24/7 Support</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
