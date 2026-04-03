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
import { chatApi } from '../services/chatApi';

const AIAssistant: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = React.useState([
    {
      id: 1,
      type: 'bot',
      text: "Hello! I'm your StayEase AI concierge. I can help you find stays, plan local experiences, or manage your bookings. How can I assist you today?",
      timestamp: '10:00 AM',
      showSuggestions: true
    }
  ]);
  const [inputValue, setInputValue] = React.useState('');
  const [isSending, setIsSending] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const suggestions = [
    { text: 'Plan trip to Goa under ₹8000', icon: Hotel },
    { text: 'Find pet-friendly stays in Manali', icon: MapPin },
    { text: 'Top hostels for students in Bangalore', icon: Clock },
  ];

  const normalizeAssistantText = (text: string) => {
    const trimmed = text.trim();
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (typeof parsed === 'string') return parsed;
      } catch {
        return trimmed.slice(1, -1);
      }
    }
    return trimmed;
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const prompt = inputValue.trim();
    setErrorMessage('');
    setIsSending(true);

    const newUserMessage = {
      id: messages.length + 1,
      type: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newUserMessage]);
    setInputValue('');

    try {
      const response = await chatApi.sendMessage(prompt);
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        text: normalizeAssistantText(response.message),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      setErrorMessage('Failed to reach the AI assistant. Please make sure you are logged in and the backend is running.');
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          type: 'bot',
          text: 'The AI assistant is temporarily unavailable.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSuggestionClick = (text: string) => {
    const newUserMessage = {
      id: messages.length + 1,
      type: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newUserMessage]);

    // Send the message
    (async () => {
      setErrorMessage('');
      setIsSending(true);
      try {
        const response = await chatApi.sendMessage(text);
        const botResponse = {
          id: messages.length + 2,
          type: 'bot',
          text: normalizeAssistantText(response.message),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botResponse]);
      } catch (error) {
        setErrorMessage('Failed to reach the AI assistant.');
        setMessages(prev => [
          ...prev,
          {
            id: prev.length + 1,
            type: 'bot',
            text: 'The AI assistant is temporarily unavailable.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } finally {
        setIsSending(false);
      }
    })();
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-brand-accent" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">STAYEASE AI</span>
              <div className="flex items-center gap-1 text-xs text-brand-accent font-bold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-pulse"></span>
                Online & Ready
              </div>
            </div>
          </div>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {errorMessage && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 text-sm text-amber-900">
          {errorMessage}
        </div>
      )}

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
              <div className={`flex flex-col gap-3 max-w-[80%] ${msg.type === 'user' ? 'items-end' : ''}`}>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.type === 'bot' 
                    ? 'bg-white text-slate-700 border border-slate-100 rounded-tl-none' 
                    : 'bg-slate-900 text-white rounded-tr-none'
                }`}>
                  {msg.type === 'bot' ? (
                    <div className="space-y-1.5">
                      {msg.text.split('\n').filter(Boolean).map((line, i) => {
                        const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('📌') || line.startsWith('  •');
                        const isIndented = line.startsWith('  ');
                        const cleaned = line.replace(/^[•\-📌]\s*/, '').replace(/^  •\s*/, '');
                        // Bold markdown **text**
                        const parts = cleaned.split(/(\*\*[^*]+\*\*)/g).map((part, pi) =>
                          part.startsWith('**') && part.endsWith('**')
                            ? <strong key={pi}>{part.slice(2, -2)}</strong>
                            : part
                        );
                        if (isBullet) return (
                          <div key={i} className={`flex gap-2 ${isIndented ? 'ml-4' : ''}`}>
                            <span className="text-brand-accent font-bold mt-0.5 shrink-0">•</span>
                            <span>{parts}</span>
                          </div>
                        );
                        if (cleaned.endsWith(':') && !isIndented) return (
                          <p key={i} className="font-bold text-slate-900 mt-2">{parts}</p>
                        );
                        return <p key={i}>{parts}</p>;
                      })}
                    </div>
                  ) : msg.text}
                </div>

                {/* Suggestion Buttons */}
                {msg.showSuggestions && msg.type === 'bot' && (
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleSuggestionClick(s.text)}
                        className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:bg-brand-accent hover:text-white hover:border-brand-accent transition-all shadow-sm whitespace-nowrap"
                      >
                        {s.text}
                      </button>
                    ))}
                  </div>
                )}
                
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
                        <span className="text-orange-500 bg-orange-50 px-2 py-1 rounded">FEATURED</span>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <h4 className="font-bold text-slate-900 group-hover:text-brand-accent transition-colors">{msg.card.title}</h4>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-slate-500">
                          <MapPin className="w-3 h-3" />
                          {msg.card.location}
                        </div>
                        <div className="flex items-center gap-1 text-yellow-500 font-bold">
                          <Star className="w-3 h-3 fill-yellow-500" />
                          {msg.card.rating}
                        </div>
                      </div>
                      <div className="pt-3 border-t border-slate-100">
                        <div className="text-xs text-slate-400">
                          From <span className="text-slate-900 font-bold text-lg">${msg.card.price}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Transport Options */}
                {msg.transport && (
                  <div className="w-full space-y-2">
                    <div className="text-xs font-bold text-slate-500 uppercase">Recommended Transport</div>
                    {msg.transport.map((t: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center">
                            {t.icon}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{t.name}</div>
                            <div className="text-[10px] text-slate-500">{t.description}</div>
                          </div>
                        </div>
                        <div className="text-sm font-bold text-slate-900">{t.price}</div>
                      </div>
                    ))}
                  </div>
                )}
                
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{msg.timestamp}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-4 md:p-6 shadow-2xl">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Main Input */}
          <div className="relative flex items-center gap-3">
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask anything... (e.g. 'Plan a 3-day trip to Singapore')" 
                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all shadow-sm"
              />
              <button 
                onClick={handleSend}
                disabled={isSending}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-900 text-white p-2.5 rounded-full hover:bg-brand-accent transition-all shadow-sm active:scale-90 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            POWERED BY STAYEASE WISDOM ENGINE - AI GENERATED CONTENT MAY VARY
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
