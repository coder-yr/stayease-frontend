import { apiPost, apiGet } from "./apiClient";

export interface BookingCreateRequest {
  type: string;
  travelDate: string;
  hotelId: string;
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
    nights?: number;
    checkInDate?: string;
    checkOutDate?: string;
  };
}

export interface Booking {
  id: string;
  userId: string;
  type: string;
  travelDate: string;
  hotelId: string;
  status: string;
  totalAmount: number;
  currency: string;
  metadata?: Record<string, unknown>;
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
  }
};
