import { Plane } from 'lucide-react';
import { apiGet } from './apiClient';

export interface Flight {
  id: string;
  airline: string;
  logo: string;
  departure: {
    time: string;
    city: string;
    airport: string;
    iata: string;
  };
  arrival: {
    time: string;
    city: string;
    airport: string;
    iata: string;
  };
  duration: string;
  stops: string;
  price: string;
  tag: string;
  class: string;
}

export interface FeaturedDeal {
  from: string;
  to: string;
  date: string;
  price: string;
  image: string;
  airline: string;
}

export interface SearchParams {
  origin: string;
  destination: string;
  date: string;
  adults: number;
  class: string;
  tripType?: 'round' | 'one';
}

/**
 * Flight Service to fetch real-time data.
 * Currently uses a high-fidelity mock that mimics real API responses,
 * but can be easily switched to a live Amadeus or SkyScanner API.
 */
class FlightService {
  private static instance: FlightService;

  private readonly cityIataMap: Record<string, string> = {
    bengaluru: 'BLR',
    bangalore: 'BLR',
    mumbai: 'BOM',
    delhi: 'DEL',
    hyderabad: 'HYD',
    chennai: 'MAA',
    kolkata: 'CCU',
    goa: 'GOI',
    pune: 'PNQ',
    ahmedabad: 'AMD'
  };

  private toTime(value: string | Date | undefined): string {
    if (!value) return '00:00';
    const date = new Date(value);
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  private formatDuration(durationRaw?: string | null): string {
    if (!durationRaw) return '2h 00m';
    if (durationRaw.startsWith('PT')) {
      const hours = durationRaw.match(/(\d+)H/)?.[1] ?? '0';
      const mins = durationRaw.match(/(\d+)M/)?.[1] ?? '0';
      return `${hours}h ${mins}m`;
    }
    return durationRaw;
  }

  private normalizeDateForApi(value: string): string {
    const raw = value.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

    const parsed = new Date(raw);
    if (!Number.isNaN(parsed.getTime())) {
      const yyyy = parsed.getFullYear();
      const mm = String(parsed.getMonth() + 1).padStart(2, '0');
      const dd = String(parsed.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }

    return new Date().toISOString().slice(0, 10);
  }

  private normalizeClassForApi(value: string): 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST' {
    const normalized = value.trim().toUpperCase().replace(/\s+/g, '_');
    if (normalized === 'ECONOMY' || normalized === 'PREMIUM_ECONOMY' || normalized === 'BUSINESS' || normalized === 'FIRST') {
      return normalized;
    }
    if (normalized === 'PREMIUM') return 'PREMIUM_ECONOMY';
    return 'ECONOMY';
  }

  private toIataCode(value: string): string {
    const match = value.match(/\(([^)]+)\)/)?.[1]?.trim().toUpperCase();
    if (match && /^[A-Z]{3}$/.test(match)) return match;

    const cityKey = value.split('(')[0].trim().toLowerCase();
    if (this.cityIataMap[cityKey]) return this.cityIataMap[cityKey];

    return value.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase();
  }

  private mapApiFlight(item: any, idx: number, requestedClass: string): Flight {
    const tags = ['Cheapest', 'Fastest', 'Best Experience', 'Top Rated'];
    const airlineCode = String(item.airline ?? 'ST');

    return {
      id: String(item.externalId ?? item.id ?? `FL-${idx}-${Date.now()}`),
      airline: airlineCode,
      logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&w=100&q=80',
      departure: {
        time: this.toTime(item.departureTime),
        city: String(item.source ?? ''),
        airport: `${String(item.source ?? '')} Airport`,
        iata: String(item.source ?? '')
      },
      arrival: {
        time: this.toTime(item.arrivalTime),
        city: String(item.destination ?? ''),
        airport: `${String(item.destination ?? '')} Airport`,
        iata: String(item.destination ?? '')
      },
      duration: this.formatDuration(item.duration),
      stops: Number(item.stops ?? 0) > 0 ? `${item.stops} Stop` : 'Non-stop',
      price: `₹${Math.round(Number(item.price ?? 0) * 84).toLocaleString()}`,
      tag: tags[idx % tags.length],
      class: String(item.cabinClass ?? requestedClass)
    };
  }
  
  private constructor() {}

  public static getInstance(): FlightService {
    if (!FlightService.instance) {
      FlightService.instance = new FlightService();
    }
    return FlightService.instance;
  }

  /**
   * Fetches flights from a real-time source.
   * If you have an Amadeus or SkyScanner API key, uncomment the fetch block.
   */
  public async searchFlights(params: SearchParams): Promise<Flight[]> {
    console.log('Searching flights for:', params);

    const originCode = this.toIataCode(params.origin);
    const destCode = this.toIataCode(params.destination);
    const apiDate = this.normalizeDateForApi(params.date);
    const apiClass = this.normalizeClassForApi(params.class);

    const data = await apiGet<{ source: string; items: any[] }>(
      `/flights?source=${encodeURIComponent(originCode)}&destination=${encodeURIComponent(destCode)}&date=${encodeURIComponent(apiDate)}&adults=${params.adults}&travelClass=${encodeURIComponent(apiClass)}`
    );

    const items = Array.isArray(data.items) ? data.items : [];
    return items.map((item, idx) => this.mapApiFlight(item, idx, params.class));
  }

  public async getAllFlights(): Promise<Flight[]> {
    const data = await apiGet<{ source: string; items: any[] }>(`/flights/all`);
    const items = Array.isArray(data.items) ? data.items : [];
    return items.map((item, idx) => this.mapApiFlight(item, idx, String(item.cabinClass ?? 'ECONOMY')));
  }

  public async getFeaturedDeals(): Promise<FeaturedDeal[]> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      {
        from: 'Bengaluru',
        to: 'London',
        date: '12 Nov',
        price: '₹54,200',
        image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
        airline: 'British Airways'
      },
      {
        from: 'Mumbai',
        to: 'Dubai',
        date: '24 Oct',
        price: '₹18,500',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
        airline: 'Emirates'
      },
      {
        from: 'Delhi',
        to: 'Singapore',
        date: '05 Dec',
        price: '₹22,900',
        image: 'https://images.unsplash.com/photo-1525625232214-998c7042330a?auto=format&fit=crop&w=800&q=80',
        airline: 'Singapore Airlines'
      }
    ];
  }

  public async getCitySuggestions(query: string): Promise<string[]> {
    const cities = [
      'Bengaluru (BLR)', 'London (LHR)', 'Mumbai (BOM)', 'Delhi (DEL)', 
      'Singapore (SIN)', 'Dubai (DXB)', 'New York (JFK)', 'Paris (CDG)',
      'Tokyo (HND)', 'Sydney (SYD)', 'Hyderabad (HYD)', 'Chennai (MAA)'
    ];
    return cities.filter(c => c.toLowerCase().includes(query.toLowerCase()));
  }

  // Example transformation for Amadeus API (Internal use)
  private transformAmadeusToFlight(amadeusData: any[]): Flight[] {
    return []; 
  }
}

export const flightApi = FlightService.getInstance();
