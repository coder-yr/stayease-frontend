import { apiGet, apiPost } from "./apiClient";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  university?: string;
  studentId?: string;
  avatar?: string;
  memberSince?: string;
  notificationPrefs?: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  savedIds?: string[];
  preferences?: Record<string, any>;
}

export const userApi = {
  getProfile: async (): Promise<UserProfile> => {
    return apiGet<UserProfile>("/auth/me");
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    return apiPost<UserProfile>("/auth/me", data);
  },

  getSavedProperties: async (): Promise<string[]> => {
    const profile = await apiGet<UserProfile>("/auth/me");
    return profile.savedIds || [];
  },

  toggleSavedProperty: async (propertyId: string): Promise<string[]> => {
    return apiPost<string[]>(`/users/saved/${propertyId}`);
  }
};
