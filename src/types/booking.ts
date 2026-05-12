import type { Treatment, TreatmentVariant } from "@/data/treatments";

export interface BookingSlot {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  startTime: string; // 24hr format (HH:MM)
  endTime: string; // 24hr format (HH:MM)
  available: boolean;
}

export interface BookingDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  notes?: string;
}

export interface BookingData {
  treatment: Treatment;
  slot: BookingSlot;
  details: BookingDetails;
  /** EUR cents paid online (booking deposit). */
  depositAmountCents: number;
  /** Full menu price for the service; remaining balance due at the appointment when applicable. */
  servicePriceCents: number | null;
  /** Required when `treatment.bookingVariants` is non-empty */
  selectedVariant?: TreatmentVariant;
  /** Full service title (e.g. after payment from `treatment_name` on the booking). */
  serviceLabel?: string;
}

export interface ConfirmedBooking extends BookingData {
  id: string;
  createdAt: Date;
  status: 'confirmed' | 'cancelled' | 'completed';
  stripePaymentIntentId?: string;
}

export enum BookingStep {
  TREATMENT = 'treatment',
  DATETIME = 'datetime', 
  DETAILS = 'details',
  SUMMARY = 'summary',
  PAYMENT = 'payment',
  CONFIRMATION = 'confirmation'
}