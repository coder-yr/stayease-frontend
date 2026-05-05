type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

type ApiErrorEnvelope = {
  success?: boolean;
  message?: string;
  details?: unknown;
};

const trimSlash = (value: string) => value.replace(/\/+$/, "");

export const API_BASE_URL = trimSlash(
  import.meta.env.VITE_API_BASE_URL ?? "https://stayease-backend-2.onrender.com/api"
);

const parseJsonToken = (value: string): string | null => {
  try {
    const parsed = JSON.parse(value) as unknown;
    if (typeof parsed === "string") return parsed;
    if (parsed && typeof parsed === "object") {
      const maybeToken = (parsed as Record<string, unknown>).accessToken;
      if (typeof maybeToken === "string") return maybeToken;
      const maybeSession = (parsed as Record<string, unknown>).session;
      if (maybeSession && typeof maybeSession === "object") {
        const nestedToken = (maybeSession as Record<string, unknown>).accessToken;
        if (typeof nestedToken === "string") return nestedToken;
      }
    }
  } catch {
    // Ignore parse errors and continue with other token sources.
  }

  return null;
};

export const getAccessToken = (): string | null => {
  const directKeys = ["accessToken", "token", "authToken", "jwt"];
  for (const key of directKeys) {
    const value = localStorage.getItem(key);
    if (value && value.trim()) return value.trim();
  }

  const sessionKeys = ["session", "auth", "user", "stayease_auth"];
  for (const key of sessionKeys) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    const parsedToken = parseJsonToken(raw);
    if (parsedToken) return parsedToken.trim();
  }

  return null;
};

const getAuthHeaders = (): Record<string, string> => {
  const token = getAccessToken();
  if (!token) return {};
  return { "Authorization": `Bearer ${token}` };
};

const extractErrorMessage = async (response: Response): Promise<string> => {
  const text = await response.text().catch(() => "");
  if (!text) return `Request failed with status ${response.status}`;

  try {
    const parsed = JSON.parse(text) as ApiErrorEnvelope;
    if (parsed && typeof parsed.message === "string" && parsed.message.trim()) {
      return parsed.message;
    }
  } catch {
    // Response wasn't JSON; fall back to raw text.
  }

  return text;
};

export const apiGet = async <T>(path: string, init?: RequestInit): Promise<T> => {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
        ...(init?.headers ?? {})
      }
    });
  } catch {
    throw new Error("Unable to reach API server. Ensure backend is reachable at https://stayease-backend-2.onrender.com.");
  }

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  const payload = (await response.json()) as ApiEnvelope<T>;
  return payload.data;
};

export const apiPost = async <T>(path: string, body?: unknown, init?: RequestInit): Promise<T> => {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
        ...(init?.headers ?? {})
      },
      body: body ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new Error("Unable to reach API server. Ensure backend is reachable at https://stayease-backend-2.onrender.com.");
  }

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  const payload = (await response.json()) as ApiEnvelope<T>;
  return payload.data;
};

export const apiPut = async <T>(path: string, body?: unknown, init?: RequestInit): Promise<T> => {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
        ...(init?.headers ?? {})
      },
      body: body ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new Error("Unable to reach API server. Ensure backend is reachable at https://stayease-backend-2.onrender.com.");
  }

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  const payload = (await response.json()) as ApiEnvelope<T>;
  return payload.data;
};

export const apiPatch = async <T>(path: string, body?: unknown, init?: RequestInit): Promise<T> => {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
        ...(init?.headers ?? {})
      },
      body: body ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new Error("Unable to reach API server. Ensure backend is reachable at https://stayease-backend-2.onrender.com.");
  }

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  const payload = (await response.json()) as ApiEnvelope<T>;
  return payload.data;
};

export const apiDelete = async <T>(path: string, init?: RequestInit): Promise<T> => {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
        ...(init?.headers ?? {})
      }
    });
  } catch {
    throw new Error("Unable to reach API server. Ensure backend is reachable at https://stayease-backend-2.onrender.com.");
  }

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  const payload = (await response.json()) as ApiEnvelope<T>;
  return payload.data;
};