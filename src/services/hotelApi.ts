import { apiGet, apiPost, apiPut, apiDelete, apiPatch } from "./apiClient";

export type Hotel = {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  category: string;
  amenities?: string[];
  fullAmenities?: any[];
  images?: string[];
  description?: string;
  deposit?: number | null;
  rules?: string | null;
  mealsIncluded?: boolean | null;
  status: "pending" | "approved" | "rejected";
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
};

export type HotelInput = Omit<Hotel, "id" | "status" | "ownerId" | "createdAt" | "updatedAt">;

// Owner endpoints
export const getMyHotels = () => apiGet<Hotel[]>("/hotels/my/list");

export const createHotel = (data: HotelInput) => apiPost<Hotel>("/hotels", data);

export const updateMyHotel = (id: string, data: Partial<HotelInput>) => 
  apiPut<Hotel>(`/hotels/my/${id}`, data);

export const deleteMyHotel = (id: string) => 
  apiDelete<null>(`/hotels/my/${id}`);

// Admin endpoints
export const getPendingHotels = () => 
  apiGet<Hotel[]>("/admin/hotels/pending");

export const approveHotel = (id: string) => 
  apiPatch<Hotel>(`/admin/hotels/${id}/approve`);

export const rejectHotel = (id: string) => 
  apiPatch<Hotel>(`/admin/hotels/${id}/reject`);
