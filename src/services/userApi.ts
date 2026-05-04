import { apiGet, apiPost, getAccessToken } from "./apiClient";

export type OwnerApplicationStatus = "pending" | "approved" | "rejected";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role?: "user" | "admin" | "owner";
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
  preferences?: {
    ownerApplication?: {
      status?: OwnerApplicationStatus;
      requestedAt?: string;
      approvedAt?: string;
      rejectedAt?: string;
    };
    [key: string]: unknown;
  };
}

export const userApi = {
  getProfile: async (): Promise<UserProfile> => {
    if (!getAccessToken()) {
      throw new Error('No access token available');
    }
    return apiGet<UserProfile>("/auth/me");
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    if (!getAccessToken()) {
      throw new Error('No access token available');
    }
    return apiPost<UserProfile>("/auth/me", data);
  },

  getSavedProperties: async (): Promise<string[]> => {
    if (!getAccessToken()) {
      return [];
    }
    const profile = await apiGet<UserProfile>("/auth/me");
    return profile.savedIds || [];
  },

  toggleSavedProperty: async (propertyId: string): Promise<string[]> => {
    return apiPost<string[]>(`/users/saved/${propertyId}`);
  }
};
