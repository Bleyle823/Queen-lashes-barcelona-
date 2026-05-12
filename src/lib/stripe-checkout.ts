import type { BookingData } from "@/types/booking";
import { apiGet, apiPost } from "@/lib/api";

export type StoredBooking = {
  id: string;
  treatment_slug: string;
  treatment_name: string;
  slot_date: string;
  slot_start: string;
  slot_end: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  notes: string | null;
  total_amount_cents: number;
  /** Menu price when deposit checkout is used; null for legacy rows. */
  service_price_cents?: number | null;
  currency: string;
  status: "confirmed" | "completed" | "cancelled" | "no_show" | "refunded";
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  receipt_url: string | null;
  email_sent_at: string | null;
  created_at: string;
  updated_at: string;
};

/** POST body for `server/index.mjs` checkout session creation. */
export function bookingToCheckoutPayload(booking: BookingData) {
  const priceFromVariant = booking.selectedVariant?.price;
  const treatmentPrice = priceFromVariant ?? booking.treatment.price ?? "";

  const displayName = booking.selectedVariant
    ? `${booking.treatment.name} — ${booking.selectedVariant.label}`
    : booking.treatment.name;

  return {
    treatmentSlug: booking.treatment.slug,
    treatmentName: displayName,
    treatmentPrice,
    variantId: booking.selectedVariant?.id ?? "",
    variantLabel: booking.selectedVariant?.label ?? "",
    slot: {
      id: booking.slot.id,
      date: booking.slot.date,
      startTime: booking.slot.startTime,
      endTime: booking.slot.endTime,
    },
    details: {
      firstName: booking.details.firstName,
      lastName: booking.details.lastName,
      email: booking.details.email,
      phone: booking.details.phone ?? "",
      notes: booking.details.notes ?? "",
    },
  };
}

export async function createHostedCheckoutSession(booking: BookingData): Promise<string> {
  const data = await apiPost<{ url?: string }>("/api/create-checkout-session", bookingToCheckoutPayload(booking));
  if (!data.url) throw new Error("No checkout URL returned");
  return data.url;
}

export type CheckoutSessionStatusResponse = {
  paid: boolean;
  payment_status: string;
  status: string;
  payment_intent_id: string;
  amount_total: number | null;
  currency: string | null;
  metadata: Record<string, string>;
  booking_id: string | null;
  booking: StoredBooking | null;
};

export async function fetchCheckoutSessionStatus(
  sessionId: string,
): Promise<CheckoutSessionStatusResponse> {
  const q = new URLSearchParams({ session_id: sessionId });
  return apiGet<CheckoutSessionStatusResponse>(`/api/checkout-session-status?${q.toString()}`);
}

export type PublicAvailability = {
  blocked: { date: string; startTime: string | null; endTime: string | null; note: string | null }[];
  extra: { date: string; startTime: string | null; endTime: string | null; note: string | null }[];
  booked: { date: string; startTime: string; endTime: string; treatment_slug: string }[];
};

export async function fetchPublicAvailability(from: string, to: string): Promise<PublicAvailability> {
  const q = new URLSearchParams({ from, to });
  return apiGet<PublicAvailability>(`/api/availability?${q.toString()}`);
}
