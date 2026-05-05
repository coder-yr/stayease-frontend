import { apiPost, apiGet } from "./apiClient";

export interface BookingCreateRequest {
  type: string;
  travelDate: string;
  hotelId?: string;
  packageId?: string;
  flightData?: any;
  packageData?: any;
  busData?: any;
  trainData?: any;
  totalAmount: number;
  currency?: string;
  metadata?: {
    name: string;
    email: string;
    university?: string;
    studentId?: string;
    phoneNumber?: string;
    specialRequests?: string;
    tier?: string;
    guests?: number;
    nights?: number;
    checkInDate?: string;
    checkOutDate?: string;
    packageName?: string;
    packageDestination?: string;
  };
}

export interface Booking {
  id: string;
  userId: string;
  type: string;
  travelDate: string;
  hotelId?: string;
  packageId?: string;
  status: string;
  totalAmount: number;
  currency: string;
  metadata?: Record<string, unknown>;
  packageData?: Record<string, unknown>;
  busData?: Record<string, unknown>;
  trainData?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export const bookingApi = {
  createBooking: async (data: BookingCreateRequest): Promise<Booking> => {
    return apiPost<Booking>("/bookings", data);
  },

  getBooking: async (id: string): Promise<Booking> => {
    return apiGet<Booking>(`/bookings/${id}`);
  },

  listMyBookings: async (): Promise<Booking[]> => {
    return apiGet<Booking[]>("/bookings/mine");
  },
  
  confirmBooking: async (id: string, paymentMethod: string): Promise<any> => {
    return apiPost<any>(`/bookings/${id}/confirm`, { paymentMethod });
  },

  getOwnerBookings: async (): Promise<Booking[]> => {
    return apiGet<Booking[]>("/bookings/owner-bookings");
  }
};
