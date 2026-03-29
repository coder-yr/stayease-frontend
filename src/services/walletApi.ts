import { apiGet, apiPost } from "./apiClient";

export interface Transaction {
  id: string;
  userId: string;
  title: string;
  date: string;
  amount: number;
  type: "expense" | "income";
  method: string;
  createdAt: string;
}

export interface WalletInfo {
  balance: number;
  loyaltyPoints: number;
  tier: string;
}

export const walletApi = {
  getWalletInfo: async (): Promise<WalletInfo> => {
    return apiGet<WalletInfo>("/wallet/info");
  },

  getTransactions: async (limit: number = 10): Promise<Transaction[]> => {
    return apiGet<Transaction[]>(`/wallet/transactions?limit=${limit}`);
  },

  topUp: async (amount: number): Promise<WalletInfo> => {
    return apiPost<WalletInfo>("/wallet/topup", { amount });
  }
};
