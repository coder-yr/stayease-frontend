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
	X,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { chatApi } from '../services/chatApi';

type RecommendationCard = {
	id: string;
	kind?: 'hotel' | 'package' | 'flight' | 'bus' | 'train';
	title: string;
	subtitle: string;
	priceLabel: string;
	price?: number;
	rating?: number;
	image?: string;
	routePath?: string;
};

type RecommendationSection = {
	key: 'hotels' | 'flights' | 'buses' | 'trains' | 'packages' | 'budget' | 'bestValue' | 'premium' | 'external';
	label: string;
	icon: React.ReactNode;
	cards: RecommendationCard[];
};

type RecommendationBuckets = {
	budget?: RecommendationCard[];
	bestValue?: RecommendationCard[];
	premium?: RecommendationCard[];
};

type ChatMessage = {
	id: number;
	type: 'bot' | 'user';
	text: string;
	timestamp: string;
	showSuggestions?: boolean;
	recommendations?: RecommendationSection[];
	followUpQuestions?: string[];
};

type AIAssistantProps = {
	mode?: 'assistant' | 'trip_planner';
};

const asArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

const toTitleCase = (value: string) =>
	value
		.replace(/_/g, ' ')
		.replace(/\b\w/g, (char) => char.toUpperCase());

const getSectionsFromContext = (context?: Record<string, unknown>): RecommendationSection[] => {
	if (!context) return [];

	const sections: RecommendationSection[] = [];
	const recommendationBuckets = context.recommendations as RecommendationBuckets | undefined;

	if (recommendationBuckets && (recommendationBuckets.budget?.length || recommendationBuckets.bestValue?.length || recommendationBuckets.premium?.length)) {
		if (recommendationBuckets.budget?.length) {
			sections.push({ key: 'budget', label: 'Budget', icon: <Hotel className="w-4 h-4" />, cards: recommendationBuckets.budget });
		}
		if (recommendationBuckets.bestValue?.length) {
			sections.push({ key: 'bestValue', label: 'Best Value', icon: <Sparkles className="w-4 h-4" />, cards: recommendationBuckets.bestValue });
		}
		if (recommendationBuckets.premium?.length) {
			sections.push({ key: 'premium', label: 'Premium', icon: <MapPin className="w-4 h-4" />, cards: recommendationBuckets.premium });
		}
	}

	const externalRaw = asArray<RecommendationCard>(context.externalSuggestions);
	if (externalRaw.length) {
		sections.push({ key: 'external', label: 'External Options', icon: <Sparkles className="w-4 h-4" />, cards: externalRaw });
	}

	if (sections.length) return sections;

	const hotelsRaw = asArray<any>((context.hotels as any)?.items ?? context.hotels);
	const flightsRaw = asArray<any>((context.flights as any)?.items ?? context.flights);
	const busesRaw = asArray<any>(context.buses);
	const trainsRaw = asArray<any>(context.trains);
	const packagesRaw = asArray<any>(context.packages);

	const hotels = hotelsRaw.slice(0, 3).map((hotel) => {
		const images = asArray<string>(hotel.images);
		const hotelId = hotel.id ? String(hotel.id) : '';
		return {
			id: String(hotel.id ?? hotel.name ?? Math.random()),
			kind: 'hotel',
			title: String(hotel.name ?? 'Hotel Option'),
			subtitle: String(hotel.location ?? 'Great location'),
			priceLabel: `₹${Number(hotel.price ?? 0).toLocaleString()}/night`,
			price: Number(hotel.price ?? 0),
			rating: typeof hotel.rating === 'number' ? hotel.rating : undefined,
			image: images[0],
			routePath: hotelId ? `/property/${hotelId}` : undefined,
		} satisfies RecommendationCard;
	});

	const flights = flightsRaw.slice(0, 3).map((flight) => {
		const source = String(flight.source ?? 'SRC');
		const destination = String(flight.destination ?? 'DST');
		return {
			id: String(flight.id ?? flight.externalId ?? `${source}-${destination}`),
			kind: 'flight',
			title: `${source} -> ${destination}`,
			subtitle: `${flight.airline ?? 'Airline'} • ${toTitleCase(String(flight.cabinClass ?? 'economy'))}`,
			priceLabel: `₹${Number(flight.price ?? 0).toLocaleString()}`,
			price: Number(flight.price ?? 0),
		} satisfies RecommendationCard;
	});

	const buses = busesRaw.slice(0, 3).map((bus) => ({
		id: String(bus.id ?? `${bus.source}-${bus.destination}`),
		kind: 'bus',
		title: `${bus.source ?? 'Source'} -> ${bus.destination ?? 'Destination'}`,
		subtitle: `${bus.operator ?? 'Bus'} • ${bus.duration ?? 'Duration unavailable'}`,
		priceLabel: `₹${Number(bus.price ?? 0).toLocaleString()}`,
		price: Number(bus.price ?? 0),
	} satisfies RecommendationCard));

	const trains = trainsRaw.slice(0, 3).map((train) => ({
		id: String(train.id ?? `${train.source}-${train.destination}`),
		kind: 'train',
		title: `${train.source ?? 'Source'} -> ${train.destination ?? 'Destination'}`,
		subtitle: `${train.operator ?? 'Train'} • ${train.duration ?? 'Duration unavailable'}`,
		priceLabel: `₹${Number(train.price ?? 0).toLocaleString()}`,
		price: Number(train.price ?? 0),
	} satisfies RecommendationCard));

	const packages = packagesRaw.slice(0, 3).map((travelPackage) => ({
		id: String(travelPackage.id ?? travelPackage.name ?? Math.random()),
		kind: 'package',
		title: String(travelPackage.name ?? 'Tour Package'),
		subtitle: [
			String(travelPackage.destination ?? 'Curated journey'),
			...(Array.isArray(travelPackage.inclusions) ? travelPackage.inclusions.slice(0, 1).map((value: unknown) => String(value)) : [])
		].join(' • '),
		priceLabel: `₹${Number(travelPackage.price ?? 0).toLocaleString()}`,
		price: Number(travelPackage.price ?? 0),
		image: Array.isArray(travelPackage.images) ? travelPackage.images[0] : undefined,
		routePath: travelPackage.id ? `/packages/${encodeURIComponent(String(travelPackage.id))}` : undefined,
	} satisfies RecommendationCard));

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
	if (packages.length) {
		sections.push({ key: 'packages', label: 'Recommended Packages', icon: <Sparkles className="w-4 h-4" />, cards: packages });
	}

	return sections;
};

const AIAssistant: React.FC<AIAssistantProps> = ({ mode = 'assistant' }) => {
	const navigate = useNavigate();
	const [messages, setMessages] = React.useState<ChatMessage[]>([
		{
			id: 1,
			type: 'bot',
			text: "Hello! I'm your StayEase travel advisor. Share your destination, dates, and budget, and I'll give ranked picks with smart local tips.",
			timestamp: '10:00 AM',
			showSuggestions: true,
		},
	]);
	const [inputValue, setInputValue] = React.useState('');
	const [isSending, setIsSending] = React.useState(false);
	const [errorMessage, setErrorMessage] = React.useState('');
	const scrollContainerRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollTo({
				top: scrollContainerRef.current.scrollHeight,
				behavior: 'smooth',
			});
		}
	}, [messages, isSending]);

	const suggestions = [
		{ text: '3-day Jaipur plan under ₹12000 for 2 adults', icon: Hotel },
		{ text: 'Best areas to stay in Goa for nightlife + beach', icon: MapPin },
		{ text: 'Compare cheapest vs best-value stays in Manali', icon: Clock },
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

	const pushBotResponse = (response: any) => {
		const botResponse: ChatMessage = {
			id: Date.now(),
			type: 'bot',
			text: normalizeAssistantText(response.message),
			timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
			recommendations: getSectionsFromContext(response.context),
			followUpQuestions: Array.isArray(response.followUpQuestions) ? response.followUpQuestions : undefined,
		};
		setMessages((prev) => [...prev, botResponse]);
	};

	const sendPrompt = async (prompt: string) => {
		setErrorMessage('');
		setIsSending(true);
		try {
			const response = await chatApi.sendMessage(prompt, mode);
			pushBotResponse(response);
		} catch {
			setErrorMessage('Failed to reach the AI assistant. Please make sure you are logged in and backend is running.');
			setMessages((prev) => [
				...prev,
				{
					id: Date.now(),
					type: 'bot',
					text: 'The AI assistant is temporarily unavailable.',
					timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
				},
			]);
		} finally {
			setIsSending(false);
		}
	};

	const handleSend = async () => {
		if (!inputValue.trim()) return;
		const prompt = inputValue.trim();
		setMessages((prev) => [
			...prev,
			{
				id: Date.now(),
				type: 'user',
				text: prompt,
				timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
			},
		]);
		setInputValue('');
		await sendPrompt(prompt);
	};

	const handleSuggestionClick = async (text: string) => {
		setMessages((prev) => [
			...prev,
			{
				id: Date.now(),
				type: 'user',
				text,
				timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
			},
		]);
		await sendPrompt(text);
	};

	const handleRecommendationClick = (card: RecommendationCard) => {
		if (!card.routePath) return;
		if (/^https?:\/\//i.test(card.routePath)) {
			window.open(card.routePath, '_blank', 'noopener,noreferrer');
			return;
		}
		navigate(card.routePath);
	};

	return (
		<div className="flex h-screen flex-col overflow-hidden bg-slate-50">
			<div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
				<div className="flex items-center gap-3">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary">
						<Sparkles className="h-5 w-5 text-brand-accent" />
					</div>
					<div className="flex items-center gap-2">
						<span className="text-xs font-bold uppercase tracking-wider text-slate-400">STAYEASE AI</span>
						<span className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-brand-accent">
							<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-accent" />
							Online
						</span>
					</div>
				</div>
				<button onClick={() => navigate(-1)} className="p-2 text-slate-400 transition-colors hover:text-rose-500">
					<X className="h-6 w-6" />
				</button>
			</div>

			{errorMessage && <div className="border-b border-amber-200 bg-amber-50 px-6 py-3 text-sm text-amber-900">{errorMessage}</div>}

			<div
				ref={scrollContainerRef}
				className="flex-1 space-y-8 overflow-y-auto p-4 scrollbar-hide md:p-8"
			>
				<div className="mx-auto max-w-4xl space-y-8">
					{messages.map((msg) => (
						<motion.div
							key={msg.id}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className={`flex items-start gap-4 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
						>
							<div className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl shadow-sm ${msg.type === 'bot' ? 'bg-brand-accent text-white' : 'border border-slate-200 bg-white text-slate-600'}`}>
								{msg.type === 'bot' ? <Bot className="h-6 w-6" /> : <User className="h-6 w-6" />}
							</div>
							<div className={`flex max-w-[80%] flex-col gap-3 ${msg.type === 'user' ? 'items-end' : ''}`}>
								<div className={`rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${msg.type === 'bot' ? 'rounded-tl-none border border-slate-100 bg-white text-slate-700' : 'rounded-tr-none bg-slate-900 text-white'}`}>
									{msg.type === 'bot' ? (
										<div className="space-y-1.5">
											{msg.text.split('\n').filter(Boolean).map((line, i) => {
												const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('📌') || line.startsWith('  •');
												const isIndented = line.startsWith('  ');
												const cleaned = line.replace(/^[•\-📌]\s*/, '').replace(/^  •\s*/, '');
												const parts = cleaned.split(/(\*\*[^*]+\*\*)/g).map((part, pi) =>
													part.startsWith('**') && part.endsWith('**') ? <strong key={pi}>{part.slice(2, -2)}</strong> : part,
												);
												if (isBullet) {
													return (
														<div key={i} className={`flex gap-2 ${isIndented ? 'ml-4' : ''}`}>
															<span className="mt-0.5 shrink-0 font-bold text-brand-accent">•</span>
															<span>{parts}</span>
														</div>
													);
												}
												if (cleaned.endsWith(':') && !isIndented) return <p key={i} className="mt-2 font-bold text-slate-900">{parts}</p>;
												return <p key={i}>{parts}</p>;
											})}
										</div>
									) : (
										msg.text
									)}
								</div>

								{msg.showSuggestions && msg.type === 'bot' && (
									<div className="flex flex-wrap gap-2">
										{suggestions.map((s, idx) => (
											<button
												key={idx}
												onClick={() => handleSuggestionClick(s.text)}
												className="whitespace-nowrap rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 shadow-sm transition-all hover:border-brand-accent hover:bg-brand-accent hover:text-white"
											>
												{s.text}
											</button>
										))}
									</div>
								)}

								{msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
									<div className="flex flex-wrap gap-2">
										{msg.followUpQuestions.map((question, idx) => (
											<button
												key={idx}
												onClick={() => handleSuggestionClick(question)}
												className="whitespace-nowrap rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 shadow-sm transition-all hover:border-emerald-600 hover:bg-emerald-600 hover:text-white"
											>
												{question}
											</button>
										))}
									</div>
								)}

								{msg.recommendations && msg.recommendations.length > 0 && (
									<div className="w-full space-y-4">
										{msg.recommendations.map((section) => (
											<div key={section.key} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
												<div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold text-brand-primary">
													{section.icon}
													<span>{section.label}</span>
												</div>
												<div className="grid gap-2 p-3">
													{section.cards.map((card) => (
														<div
															key={card.id}
															onClick={() => handleRecommendationClick(card)}
															className={`flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 ${card.routePath ? 'cursor-pointer transition-colors hover:bg-slate-50' : ''}`}
														>
															{card.image ? (
																<img src={card.image} alt={card.title} className="h-16 w-16 rounded-lg object-cover" />
															) : (
																<div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-100 text-slate-400">{section.icon}</div>
															)}
															<div className="min-w-0 flex-1">
																<p className="truncate text-sm font-bold text-slate-900">{card.title}</p>
																<p className="truncate text-xs text-slate-500">{card.subtitle}</p>
																{typeof card.rating === 'number' && (
																	<div className="mt-1 flex items-center gap-1 text-xs text-amber-500">
																		<Star className="h-3 w-3 fill-amber-500" />
																		<span>{card.rating.toFixed(1)}</span>
																	</div>
																)}
															</div>
															<div className="whitespace-nowrap text-sm font-bold text-slate-900">{card.priceLabel}</div>
														</div>
													))}
												</div>
											</div>
										))}
									</div>
								)}

								<span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{msg.timestamp}</span>
							</div>
						</motion.div>
					))}
				</div>
			</div>

			<div className="border-t border-slate-200 bg-white p-4 shadow-2xl md:p-6">
				<div className="mx-auto max-w-4xl space-y-4">
					<div className="relative flex items-center gap-3">
						<div className="relative flex-1">
							<input
								type="text"
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								onKeyDown={(e) => e.key === 'Enter' && handleSend()}
								placeholder="Ask anything... (e.g. 'Plan a 3-day trip to Singapore')"
								className="w-full rounded-full border border-slate-100 bg-slate-50 px-5 py-3 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
							/>
							<button
								onClick={handleSend}
								disabled={isSending}
								className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-900 p-2.5 text-white shadow-sm transition-all active:scale-90 hover:bg-brand-accent disabled:cursor-not-allowed disabled:opacity-60"
							>
								<Send className="h-4 w-4" />
							</button>
						</div>
					</div>
					<div className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
						POWERED BY STAYEASE WISDOM ENGINE - AI GENERATED CONTENT MAY VARY
					</div>
				</div>
			</div>
		</div>
	);
};

export default AIAssistant;
