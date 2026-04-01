import { apiGet } from './apiClient';

export interface Bus {
  id: string;
  operator: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration?: string;
  busType?: string;
  price: number | string;
  currency: string;
  busNumber?: string;
}

export const busApi = {
  searchBuses: async (source?: string, destination?: string) => {
    const query = new URLSearchParams();
    if (source) query.append('source', source);
    if (destination) query.append('destination', destination);
    
    try {
      const url = `/buses/search?${query.toString()}`;
      console.log(`[Bus API] Fetching from: ${url}`);
      const response = await apiGet<Bus[]>(url);
      console.log(`[Bus API] Received ${response?.length || 0} buses`);
      return response || [];
    } catch (e) {
      console.error("Failed to fetch buses", e);
      return [];
    }
  }
};
