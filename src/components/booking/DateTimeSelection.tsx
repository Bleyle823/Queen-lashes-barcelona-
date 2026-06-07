import { useState, useMemo } from "react";
import { format, isToday, isTomorrow } from "date-fns";
import { Clock } from "lucide-react";
import type { BookingSlot } from "@/types/booking";
import { generateTimeSlots, getAvailableDates } from "@/utils/booking";
import { useTranslation } from "@/i18n/LocaleProvider";
import { formatDatePart } from "@/i18n/dateLocale";

type AvailabilityEntry = {
  date: string;
  startTime: string | null;
  endTime: string | null;
  note?: string | null;
};

interface Props {
  selectedSlot: BookingSlot | null;
  onSelect: (slot: BookingSlot) => void;
  durationMinutes?: number;
  existingBookings?: BookingSlot[];
  blocked?: AvailabilityEntry[];
  extra?: AvailabilityEntry[];
}

const DateTimeSelection = ({
  selectedSlot,
  onSelect,
  durationMinutes = 60,
  existingBookings = [],
  blocked = [],
  extra = [],
}: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { t, locale } = useTranslation();
  const availableDates = useMemo(() => getAvailableDates(), []);

  const blockedWholeDays = useMemo(
    () => new Set(blocked.filter((b) => !b.startTime).map((b) => b.date)),
    [blocked],
  );

  const blockedSlotKeys = useMemo(
    () => new Set(blocked.filter((b) => b.startTime).map((b) => `${b.date}-${b.startTime}`)),
    [blocked],
  );

  const timeSlots = useMemo(() => {
    if (!selectedDate) return [];
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    if (blockedWholeDays.has(dateStr)) return [];

    const generated = generateTimeSlots(selectedDate, existingBookings, durationMinutes);

    const extraForDay = extra
      .filter((e) => e.date === dateStr && e.startTime && e.endTime)
      .map((e) => ({
        id: `${e.date}-${e.startTime}`,
        date: e.date,
        startTime: e.startTime as string,
        endTime: e.endTime as string,
        available: true,
      }));

    const merged = new Map<string, BookingSlot>();
    for (const s of generated) merged.set(s.id, s);
    for (const s of extraForDay) merged.set(s.id, s);

    for (const key of blockedSlotKeys) {
      const slot = merged.get(key);
      if (slot) merged.set(key, { ...slot, available: false });
    }

    return Array.from(merged.values()).sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [selectedDate, existingBookings, extra, blockedSlotKeys, blockedWholeDays, durationMinutes]);

  const formatDateDisplay = (date: Date): string => {
    const datePart = formatDatePart(date, locale, "short");
    if (isToday(date)) return `${t.booking.datetime.today}, ${datePart}`;
    if (isTomorrow(date)) return `${t.booking.datetime.tomorrow}, ${datePart}`;
    return formatDatePart(date, locale, "weekday");
  };

  const formatTimeDisplay = (time: string): string => {
    const [hours, minutes] = time.split(":").map(Number);
    if (locale === "es" || locale === "de") {
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    }
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-ink mb-2">{t.booking.datetime.title}</h2>
        <p className="text-ink/70 text-sm">{t.booking.datetime.subtitle}</p>
      </div>

      <div>
        <h3 className="font-display text-lg text-ink mb-3">{t.booking.datetime.availableDates}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {availableDates.slice(0, 14).map((date, index) => {
            const dateStr = format(date, "yyyy-MM-dd");
            const isClosed = blockedWholeDays.has(dateStr);
            return (
              <button
                key={index}
                onClick={() => !isClosed && setSelectedDate(date)}
                disabled={isClosed}
                className={`p-3 border text-sm transition-all ${
                  isClosed
                    ? "border-border bg-muted text-ink/40 cursor-not-allowed"
                    : selectedDate?.toDateString() === date.toDateString()
                      ? "border-peach bg-peach/10 text-ink"
                      : "border-border text-ink/80 hover:bg-muted/50 hover:border-peach"
                }`}
              >
                {formatDateDisplay(date)}
                {isClosed && <span className="block text-[10px] mt-0.5">{t.booking.datetime.closed}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div>
          <h3 className="font-display text-lg text-ink mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {t.booking.datetime.availableTimes}
          </h3>

          {timeSlots.length === 0 ? (
            <div className="p-6 bg-muted border text-center text-ink/70">
              <p>{t.booking.datetime.noSlots}</p>
              <p className="text-sm mt-1">{t.booking.datetime.noSlotsHint}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => slot.available && onSelect(slot)}
                  disabled={!slot.available}
                  className={`p-3 border text-sm transition-all ${
                    !slot.available
                      ? "border-border bg-muted text-ink/40 cursor-not-allowed"
                      : selectedSlot?.id === slot.id
                        ? "border-peach bg-peach text-white"
                        : "border-border text-ink/80 hover:border-peach hover:bg-peach/10"
                  }`}
                >
                  {formatTimeDisplay(slot.startTime)}
                  {durationMinutes > 60 ? (
                    <span className="block text-[10px] mt-0.5 opacity-90">
                      {t.booking.datetime.to} {formatTimeDisplay(slot.endTime)}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DateTimeSelection;
