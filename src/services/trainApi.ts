import { apiGet } from './apiClient';

export interface Train {
  id: string;
  operator: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration?: string;
  classType?: string;
  price: number | string;
  currency: string;
  trainNumber?: string;
}

export const trainApi = {
  searchTrains: async (source?: string, destination?: string) => {
    const query = new URLSearchParams();
    if (source) query.append('source', source);
    if (destination) query.append('destination', destination);
    
    try {
      const url = `/trains/search?${query.toString()}`;
      console.log(`[Train API] Fetching from: ${url}`);
      const response = await apiGet<Train[]>(url);
      console.log(`[Train API] Received ${response?.length || 0} trains`);
      return response || [];
    } catch (e) {
      console.error("Failed to fetch trains", e);
      return [];
    }
  }
};
