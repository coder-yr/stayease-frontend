import React from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Plane, 
  Hotel, 
  Train, 
  Bus,
  MapPin, 
  Star, 
  Clock, 
  X 
} from 'lucide-react';
import { motion } from 'motion/react';

import { useNavigate } from 'react-router-dom';
import { chatApi } from '../services/chatApi';

type RecommendationCard = {
  id: string;
  title: string;
  subtitle: string;
  priceLabel: string;
  rating?: number;
  image?: string;
  routePath?: string;
};

type RecommendationSection = {
  key: 'hotels' | 'flights' | 'buses' | 'trains';
  label: string;
  icon: React.ReactNode;
  cards: RecommendationCard[];
};

type ChatMessage = {
  id: number;
  type: 'bot' | 'user';
  text: string;
  timestamp: string;
  showSuggestions?: boolean;
  recommendations?: RecommendationSection[];
};

const asArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

const toTitleCase = (value: string) =>
  value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

const getSectionsFromContext = (context?: Record<string, unknown>): RecommendationSection[] => {
  if (!context) return [];

  const hotelsRaw = asArray<any>((context.hotels as any)?.items ?? context.hotels);
  const flightsRaw = asArray<any>((context.flights as any)?.items ?? context.flights);
  const busesRaw = asArray<any>(context.buses);
  const trainsRaw = asArray<any>(context.trains);

  const hotels = hotelsRaw.slice(0, 3).map((hotel) => {
    const images = asArray<string>(hotel.images);
    const hotelId = hotel.id ? String(hotel.id) : '';
    return {
      id: String(hotel.id ?? hotel.name ?? Math.random()),
      title: String(hotel.name ?? 'Hotel Option'),
      subtitle: String(hotel.location ?? 'Great location'),
      priceLabel: `₹${Number(hotel.price ?? 0).toLocaleString()}/night`,
      rating: typeof hotel.rating === 'number' ? hotel.rating : undefined,
      image: images[0],
      routePath: hotelId ? `/property/${hotelId}` : undefined
    } satisfies RecommendationCard;
  });

  const flights = flightsRaw.slice(0, 3).map((flight) => {
    const source = String(flight.source ?? 'SRC');
    const destination = String(flight.destination ?? 'DST');
    return {
      id: String(flight.id ?? flight.externalId ?? `${source}-${destination}`),
      title: `${source} -> ${destination}`,
      subtitle: `${flight.airline ?? 'Airline'} • ${toTitleCase(String(flight.cabinClass ?? 'economy'))}`,
      priceLabel: `₹${Number(flight.price ?? 0).toLocaleString()}`
    } satisfies RecommendationCard;
  });

  const buses = busesRaw.slice(0, 3).map((bus) => ({
    id: String(bus.id ?? `${bus.source}-${bus.destination}`),
    title: `${bus.source ?? 'Source'} -> ${bus.destination ?? 'Destination'}`,
    subtitle: `${bus.operator ?? 'Bus'} • ${bus.duration ?? 'Duration unavailable'}`,
    priceLabel: `₹${Number(bus.price ?? 0).toLocaleString()}`
  } satisfies RecommendationCard));

  const trains = trainsRaw.slice(0, 3).map((train) => ({
    id: String(train.id ?? `${train.source}-${train.destination}`),
    title: `${train.source ?? 'Source'} -> ${train.destination ?? 'Destination'}`,
    subtitle: `${train.operator ?? 'Train'} • ${train.duration ?? 'Duration unavailable'}`,
    priceLabel: `₹${Number(train.price ?? 0).toLocaleString()}`
  } satisfies RecommendationCard));

  const sections: RecommendationSection[] = [];

  if (hotels.length) {
    sections.push({ key: 'hotels', label: 'Recommended Hotels', icon: <Hotel className="w-4 h-4" />, cards: hotels });
  }
  if (flights.length) {
    sections.push({ key: 'flights', label: 'Recommended Flights', icon: <Plane className="w-4 h-4" />, cards: flights });
  }
  if (buses.length) {
    sections.push({ key: 'buses', label: 'Recommended Buses', icon: <Bus className="w-4 h-4" />, cards: buses });
  }
  if (trains.length) {
    sections.push({ key: 'trains', label: 'Recommended Trains', icon: <Train className="w-4 h-4" />, cards: trains });
  }

  return sections;
};

const AIAssistant: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = React.useState<ChatMessage[]>([
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
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendations: getSectionsFromContext(response.context)
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
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          recommendations: getSectionsFromContext(response.context)
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

  const handleRecommendationClick = (card: RecommendationCard) => {
    if (!card.routePath) return;
    navigate(card.routePath);
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
                
                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className="w-full space-y-4">
                    {msg.recommendations.map((section) => (
                      <div key={section.key} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                        <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-100 text-sm font-bold text-brand-primary">
                          {section.icon}
                          <span>{section.label}</span>
                        </div>
                        <div className="p-3 grid gap-2">
                          {section.cards.map((card) => (
                            <div
                              key={card.id}
                              onClick={() => handleRecommendationClick(card)}
                              className={`flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white ${
                                card.routePath ? 'cursor-pointer hover:bg-slate-50 transition-colors' : ''
                              }`}
                            >
                              {card.image ? (
                                <img src={card.image} alt={card.title} className="w-16 h-16 rounded-lg object-cover" />
                              ) : (
                                <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                                  {section.icon}
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-slate-900 truncate">{card.title}</p>
                                <p className="text-xs text-slate-500 truncate">{card.subtitle}</p>
                                {typeof card.rating === 'number' && (
                                  <div className="mt-1 flex items-center gap-1 text-xs text-amber-500">
                                    <Star className="w-3 h-3 fill-amber-500" />
                                    <span>{card.rating.toFixed(1)}</span>
                                  </div>
                                )}
                              </div>
                              <div className="text-sm font-bold text-slate-900 whitespace-nowrap">{card.priceLabel}</div>
                            </div>
                          ))}
                        </div>
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
