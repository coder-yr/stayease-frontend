import { apiPost } from './apiClient';

export interface MockPaymentResponse {
  success: boolean;
}

export const paymentApi = {
  approveMockPayment: async (payload: { amount: number; currency?: string; bookingType: string }) => {
    return apiPost<MockPaymentResponse>('/payments/mock', payload);
  }
};