import { apiPost, apiUrl, ApiError } from "@/lib/api";

const STORAGE_KEY = "queenlashes.admin.token";
const EXPIRES_KEY = "queenlashes.admin.expiresAt";

export type AdminToken = { token: string; expiresAt: number };

export function getStoredAdminToken(): AdminToken | null {
  try {
    const token = localStorage.getItem(STORAGE_KEY);
    const exp = parseInt(localStorage.getItem(EXPIRES_KEY) || "0", 10);
    if (!token || !exp) return null;
    if (exp < Date.now()) {
      clearAdminToken();
      return null;
    }
    return { token, expiresAt: exp };
  } catch {
    return null;
  }
}

export function setAdminToken(token: string, expiresAt: number) {
  localStorage.setItem(STORAGE_KEY, token);
  localStorage.setItem(EXPIRES_KEY, String(expiresAt));
}

export function clearAdminToken() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(EXPIRES_KEY);
}

export async function adminLogin(password: string): Promise<AdminToken> {
  const data = await apiPost<{ token: string; expiresAt: number }>("/api/admin/login", { password });
  setAdminToken(data.token, data.expiresAt);
  return data;
}

function authHeaders(): Record<string, string> {
  const stored = getStoredAdminToken();
  return stored ? { Authorization: `Bearer ${stored.token}` } : {};
}

async function authedJson<T>(res: Response): Promise<T> {
  const raw = await res.text();
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new ApiError("Empty response from API", res.status);
  }
  let body: unknown;
  try {
    body = JSON.parse(trimmed);
  } catch {
    throw new ApiError(`Invalid response: ${trimmed.slice(0, 160)}`, res.status);
  }
  if (res.status === 401) {
    clearAdminToken();
    throw new ApiError("Session expired. Please sign in again.", 401);
  }
  if (!res.ok) {
    const message =
      (typeof body === "object" && body && "error" in body && String((body as { error: unknown }).error)) ||
      `Request failed (${res.status})`;
    throw new ApiError(message, res.status);
  }
  return body as T;
}

export async function adminGet<T>(path: string): Promise<T> {
  const res = await fetch(apiUrl(path), { headers: authHeaders() });
  return authedJson<T>(res);
}

export async function adminPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(apiUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return authedJson<T>(res);
}

export async function adminPut<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(apiUrl(path), {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return authedJson<T>(res);
}

export async function adminDelete<T>(path: string): Promise<T> {
  const res = await fetch(apiUrl(path), { method: "DELETE", headers: authHeaders() });
  return authedJson<T>(res);
}
