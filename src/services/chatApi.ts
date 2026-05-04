import { apiPost } from './apiClient';

export type ChatResponse = {
  message: string;
  context?: Record<string, unknown>;
  chatLogId?: string;
  followUpQuestions?: string[];
};

const CHAT_SESSION_KEY = 'stayease_chat_session_id';

const getChatSessionId = (): string => {
  if (typeof window === 'undefined') {
    return 'server-session';
  }

  const existing = sessionStorage.getItem(CHAT_SESSION_KEY);
  if (existing) return existing;

  const sessionId = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `chat-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  sessionStorage.setItem(CHAT_SESSION_KEY, sessionId);
  return sessionId;
};

export const chatApi = {
  sendMessage: async (
    message: string,
    mode: "assistant" | "trip_planner" = "assistant"
  ): Promise<ChatResponse> => {
    return apiPost<ChatResponse>('/chat', { message, mode, sessionId: getChatSessionId() });
  }
};