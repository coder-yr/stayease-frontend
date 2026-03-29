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
  private readonly AMADEUS_API_URL = 'https://test.api.amadeus.com/v2/shopping/flight-offers';

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

    const originCode = params.origin.match(/\(([^)]+)\)/)?.[1] || params.origin.substring(0, 3).toUpperCase();
    const destCode = params.destination.match(/\(([^)]+)\)/)?.[1] || params.destination.substring(0, 3).toUpperCase();

    try {
      const data = await apiGet<{ source: string; items: any[] }>(
        `/flights?source=${encodeURIComponent(originCode)}&destination=${encodeURIComponent(destCode)}&date=${encodeURIComponent(params.date)}&adults=${params.adults}&travelClass=${encodeURIComponent(params.class)}`
      );

      const items = Array.isArray(data.items) ? data.items : [];
      if (items.length) {
        return items.map((item, idx) => this.mapApiFlight(item, idx, params.class));
      }
    } catch (error) {
      console.warn('Backend flight API unavailable, using mock flights.', error);
    }

    /* 
    // REAL API IMPLEMENTATION EXAMPLE (Amadeus)
    try {
      const response = await fetch(`${this.AMADEUS_API_URL}?originLocationCode=${params.origin}&destinationLocationCode=${params.destination}&departureDate=${params.date}&adults=${params.adults}`, {
        headers: {
          'Authorization': `Bearer ${process.env.AMADEUS_ACCESS_TOKEN}`
        }
      });
      const data = await response.json();
      return this.transformAmadeusToFlight(data.data);
    } catch (error) {
       console.error("API Fetch Error:", error);
    }
    */

    // HIGH-FIDELITY DYNAMIC MOCK DATA (Returns variations based on search)
    // In a real scenario, this would be replaced with actual transformed API data
    const airlines = [
      { name: 'Air India', logo: 'https://images.unsplash.com/photo-1610337673044-720471f83677?auto=format&fit=crop&w=100&q=80' },
      { name: 'IndiGo', logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&w=100&q=80' },
      { name: 'Vistara', logo: 'https://images.unsplash.com/photo-1544015759-137fb939308e?auto=format&fit=crop&w=100&q=80' },
      { name: 'Akasa Air', logo: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=100&q=80' }
    ];

    return airlines.map((airline, idx) => {
      const basePrice = 4000 + (Math.random() * 8000);
      const hour = 5 + (idx * 3);
      const depTime = `${hour.toString().padStart(2, '0')}:${(Math.random() > 0.5 ? '15' : '45')}`;
      const durationHours = 1 + Math.floor(Math.random() * 3);
      const durationMinutes = Math.random() > 0.5 ? '30' : '45';
      
      const arrivalHour = (hour + durationHours) % 24;
      const arrTime = `${arrivalHour.toString().padStart(2, '0')}:${(Math.random() > 0.5 ? '05' : '25')}`;

      const tags = ['Cheapest', 'Fastest', 'Best Experience', 'Top Rated'];

      return {
        id: `FL-${idx}-${Date.now()}`,
        airline: airline.name,
        logo: airline.logo,
        departure: {
          time: depTime,
          city: params.origin.split(' (')[0],
          airport: `${params.origin.split(' (')[0]} Int'l`,
          iata: originCode
        },
        arrival: {
          time: arrTime,
          city: params.destination.split(' (')[0],
          airport: `${params.destination.split(' (')[0]} Int'l`,
          iata: destCode
        },
        duration: `${durationHours}h ${durationMinutes}m`,
        stops: Math.random() > 0.7 ? '1 Stop' : 'Non-stop',
        price: `₹${Math.round(basePrice).toLocaleString()}`,
        tag: tags[idx % tags.length],
        class: params.class
      };
    });
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
