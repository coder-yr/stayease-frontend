import { apiPost } from './apiClient';

export type ChatResponse = {
  message: string;
  context?: Record<string, unknown>;
  chatLogId?: string;
};

export const chatApi = {
  sendMessage: async (message: string): Promise<ChatResponse> => {
    return apiPost<ChatResponse>('/chat', { message });
  }
};