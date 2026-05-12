import type { StoredBooking } from "@/lib/stripe-checkout";
import { adminGet, adminPost, adminPut, adminDelete } from "@/lib/admin-auth";

export type { StoredBooking };

export type AdminTreatment = {
  slug: string;
  name: string;
  description: string | null;
  price_cents: number;
  duration_minutes: number;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type AvailabilityRow = {
  id: string;
  date: string;
  start_time: string | null;
  end_time: string | null;
  available: boolean;
  note: string | null;
  created_at: string;
};

export type AdminSettings = {
  business?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  hours?: {
    weekday: { start: number; end: number };
    weekend: { start: number; end: number };
    slot_minutes: number;
    advance_hours: number;
  };
  [key: string]: unknown;
};

export type AnalyticsResponse = {
  total_bookings: number;
  counted_bookings: number;
  revenue_cents: number;
  currency: string;
  by_status: Record<string, number>;
  by_treatment: { slug: string; name: string; count: number; revenue_cents: number }[];
  by_day: { date: string; count: number; revenue_cents: number }[];
};

// Bookings
export const adminListBookings = (params: {
  from?: string;
  to?: string;
  status?: string;
  search?: string;
} = {}) => {
  const q = new URLSearchParams();
  if (params.from) q.set("from", params.from);
  if (params.to) q.set("to", params.to);
  if (params.status) q.set("status", params.status);
  if (params.search) q.set("search", params.search);
  const qs = q.toString();
  return adminGet<{ bookings: StoredBooking[] }>(`/api/admin/bookings${qs ? `?${qs}` : ""}`);
};

export const adminGetBooking = (id: string) =>
  adminGet<{ booking: StoredBooking }>(`/api/admin/bookings/${id}`);

export const adminUpdateBooking = (id: string, patch: Partial<StoredBooking>) =>
  adminPut<{ booking: StoredBooking }>(`/api/admin/bookings/${id}`, patch);

export const adminRefundBooking = (id: string) =>
  adminPost<{ booking: StoredBooking; refund: { id: string; status: string; amount: number } }>(
    `/api/admin/bookings/${id}/refund`,
  );

export const adminResendBookingEmail = (id: string) =>
  adminPost<{ result: { customerSent: boolean; adminSent: boolean; dev?: boolean; error?: string } }>(
    `/api/admin/bookings/${id}/resend-email`,
  );

// Availability
export const adminListAvailability = (params: { from?: string; to?: string } = {}) => {
  const q = new URLSearchParams();
  if (params.from) q.set("from", params.from);
  if (params.to) q.set("to", params.to);
  const qs = q.toString();
  return adminGet<{ availability: AvailabilityRow[] }>(`/api/admin/availability${qs ? `?${qs}` : ""}`);
};

export const adminAddAvailability = (input: {
  date: string;
  start_time?: string | null;
  end_time?: string | null;
  available: boolean;
  note?: string | null;
}) => adminPost<{ availability: AvailabilityRow }>(`/api/admin/availability`, input);

export const adminDeleteAvailability = (id: string) =>
  adminDelete<{ ok: boolean }>(`/api/admin/availability/${id}`);

// Treatments
export const adminListTreatments = () =>
  adminGet<{ treatments: AdminTreatment[] }>(`/api/admin/treatments`);

export const adminUpsertTreatment = (input: Partial<AdminTreatment> & { slug: string; name: string }) =>
  adminPut<{ treatment: AdminTreatment }>(`/api/admin/treatments`, input);

export const adminDeleteTreatment = (slug: string) =>
  adminDelete<{ ok: boolean }>(`/api/admin/treatments/${encodeURIComponent(slug)}`);

// Settings
export const adminGetSettings = () => adminGet<{ settings: AdminSettings }>(`/api/admin/settings`);
export const adminUpdateSettings = (updates: Partial<AdminSettings>) =>
  adminPut<{ settings: AdminSettings }>(`/api/admin/settings`, updates);

// Analytics
export const adminAnalytics = (params: { from?: string; to?: string } = {}) => {
  const q = new URLSearchParams();
  if (params.from) q.set("from", params.from);
  if (params.to) q.set("to", params.to);
  const qs = q.toString();
  return adminGet<AnalyticsResponse>(`/api/admin/analytics${qs ? `?${qs}` : ""}`);
};
