/** Tiny shared fetch helper for the API server. */

const apiBase =
  typeof import.meta.env.VITE_API_BASE_URL === "string"
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "")
    : "";

export function apiUrl(path: string): string {
  return `${apiBase}${path}`;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function readJson<T>(res: Response): Promise<T> {
  const raw = await res.text();
  const trimmed = raw.trim();

  if (!trimmed) {
    if (res.status === 502 || res.status === 503 || res.status === 504) {
      throw new ApiError(
        "Payment server unreachable. Run `npm run dev` so the API on port 4242 starts with the app.",
        res.status,
      );
    }
    throw new ApiError(
      "Empty response from API. Confirm the API process is running and `STRIPE_SECRET_KEY` is set in `.env`.",
      res.status,
    );
  }

  let body: unknown;
  try {
    body = JSON.parse(trimmed);
  } catch {
    throw new ApiError(`Invalid response from API: ${trimmed.slice(0, 160)}`, res.status);
  }

  if (!res.ok) {
    const message =
      (typeof body === "object" && body && "error" in body && String((body as { error: unknown }).error)) ||
      `Request failed (${res.status})`;
    throw new ApiError(message, res.status);
  }
  return body as T;
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(path), init);
  return readJson<T>(res);
}

export async function apiPost<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
    ...init,
  });
  return readJson<T>(res);
}

export async function apiPut<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(path), {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
    ...init,
  });
  return readJson<T>(res);
}

export async function apiDelete<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(path), { method: "DELETE", ...init });
  return readJson<T>(res);
}
