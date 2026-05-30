import { format, addDays, isWeekend, isBefore, startOfDay, addMinutes, parseISO } from "date-fns";
import { enUS, es as esLocale } from "date-fns/locale";
import type { BookingData, BookingSlot } from "@/types/booking";
import type { Locale } from "@/i18n/types";
import { translations } from "@/i18n/translations";
// Business hours: Mon-Fri 9:00-18:00, Sat-Sun by request only
const BUSINESS_HOURS = {
  weekday: { start: 9, end: 18 },
  weekend: { start: 10, end: 16 },
};

const BOOKING_ADVANCE_LIMIT_HOURS = 12;

/** EUR cents charged online to confirm any booking (must match server BOOKING_DEPOSIT_CENTS). */
export const BOOKING_DEPOSIT_CENTS = 2000;

export function timeStringToMinutes(time: string): number {
  const s = String(time).slice(0, 5);
  const [hs, ms] = s.split(":");
  const h = parseInt(hs, 10) || 0;
  const m = parseInt(ms, 10) || 0;
  return h * 60 + m;
}

/** Half-open intervals [aStart, aEnd) vs [bStart, bEnd) in minutes since midnight. */
export function intervalsOverlapMinutes(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd;
}

function slotOverlapsExisting(
  dateStr: string,
  startMin: number,
  endMin: number,
  existingBookings: BookingSlot[],
): boolean {
  return existingBookings.some((b) => {
    if (b.date !== dateStr) return false;
    const oStart = timeStringToMinutes(b.startTime);
    const oEnd = timeStringToMinutes(b.endTime);
    return intervalsOverlapMinutes(startMin, endMin, oStart, oEnd);
  });
}

/**
 * Generate bookable slots on the hour. closingHour is the hour when the business day ends
 * (last appointment must end by this time, e.g. 18 → appointments end at 18:00).
 */
export function generateTimeSlots(
  date: Date,
  existingBookings: BookingSlot[] = [],
  durationMinutes: number = 60,
): BookingSlot[] {
  const dateStr = format(date, "yyyy-MM-dd");
  const now = new Date();
  const minBookingTime = addMinutes(now, BOOKING_ADVANCE_LIMIT_HOURS * 60);

  if (isBefore(date, startOfDay(minBookingTime))) {
    return [];
  }

  const isWeekendDay = isWeekend(date);
  const hours = isWeekendDay ? BUSINESS_HOURS.weekend : BUSINESS_HOURS.weekday;
  const closingMinuteOfDay = hours.end * 60;

  const slots: BookingSlot[] = [];

  for (let hour = hours.start; hour < hours.end; hour++) {
    const startTime = `${hour.toString().padStart(2, "0")}:00`;
    const slotStart = parseISO(`${dateStr}T${startTime}`);
    const slotEndDt = addMinutes(slotStart, durationMinutes);
    const endTime = format(slotEndDt, "HH:mm");

    const startMinuteOfDay = hour * 60;
    const endMinuteOfDay = startMinuteOfDay + durationMinutes;

    if (endMinuteOfDay > closingMinuteOfDay) {
      continue;
    }

    if (isBefore(slotStart, minBookingTime)) {
      continue;
    }

    const isBooked = slotOverlapsExisting(dateStr, startMinuteOfDay, endMinuteOfDay, existingBookings);

    slots.push({
      id: `${dateStr}-${startTime}`,
      date: dateStr,
      startTime,
      endTime,
      available: !isBooked,
    });
  }

  return slots;
}

export function getAvailableDates(): Date[] {
  const dates: Date[] = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    dates.push(addDays(today, i));
  }

  return dates;
}

export function formatPrice(cents: number): string {
  return `${(cents / 100).toFixed(0)}€`;
}

export function parseTreatmentPrice(priceStr: string): number {
  const match = priceStr.match(/(\d+)€/);
  if (match) {
    return parseInt(match[1], 10) * 100;
  }
  return 0;
}

export function formatBookingDateTime(date: string, startTime: string, locale: Locale = "en"): string {
  const dateTime = parseISO(`${date}T${startTime}`);
  const dateLocale = locale === "es" ? esLocale : enUS;
  const pattern =
    locale === "es" ? "EEEE, d 'de' MMMM 'de' yyyy 'a las' HH:mm" : "EEEE, MMMM do, yyyy 'at' h:mm a";
  return format(dateTime, pattern, { locale: dateLocale });
}

/** Human-readable appointment length for UI copy. */
export function formatAppointmentDuration(minutes: number, locale: Locale = "en"): string {
  const d = translations[locale].booking.duration;
  if (minutes === 60) return d.oneHour;
  if (minutes === 120) return d.twoHours;
  if (minutes > 0 && minutes % 60 === 0) {
    const h = minutes / 60;
    return d.hours.replace("{{count}}", String(h));
  }
  return d.minutes.replace("{{count}}", String(minutes));
}

export function getBookingServiceLabel(data: Pick<BookingData, "treatment" | "selectedVariant" | "serviceLabel">): string {
  if (data.serviceLabel) return data.serviceLabel;
  if (data.selectedVariant) return `${data.treatment.name}, ${data.selectedVariant.label}`;
  return data.treatment.name;
}
