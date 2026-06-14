import axios from "axios";

interface StoredUser {
  uuid: string;
  first_name: string;
  last_name: string;
  email: string;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function setToken(token: string): void {
  document.cookie = `auth_token=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
  localStorage.setItem("auth_token", token);
}

export function removeToken(): void {
  document.cookie = "auth_token=; path=/; max-age=0; SameSite=Lax";
  localStorage.removeItem("auth_token");
}

export function setUser(user: StoredUser): void {
  localStorage.setItem("auth_user", JSON.stringify(user));
}

export function getUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("auth_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function removeUser(): void {
  localStorage.removeItem("auth_user");
}

export function clearAuth(): void {
  removeToken();
  removeUser();
}

export default api;
