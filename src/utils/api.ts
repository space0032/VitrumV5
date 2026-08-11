import { AuthUser } from '../types';

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const AUTH_TOKEN_KEY = "vitrum_auth_token";
export const AUTH_USER_KEY = "vitrum_auth_user";

const readStoredUser = (): AuthUser | null => {
  try {
    return JSON.parse(localStorage.getItem(AUTH_USER_KEY) || "null");
  } catch {
    return null;
  }
};

/**
 * A helper function to make authenticated requests to our FastAPI backend.
 * All calls go through here so we have one place to manage headers and error handling.
 * Attaches the logged-in user's session token and role so the backend can authorize writes.
 */
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;

    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedUser = readStoredUser();

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string> | undefined),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    if (storedUser?.role) {
        headers["x-user-role"] = storedUser.role;
    }

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `API Request failed with status ${response.status}`);
    }

    const text = await response.text();
    if (!text) {
        return null;
    }
    return JSON.parse(text);
};
