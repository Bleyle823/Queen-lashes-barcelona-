import { Calendar, Clock, User, Mail, Phone, MessageSquare } from "lucide-react";
import type { BookingData } from "@/types/booking";
import {
  formatAppointmentDuration,
  formatBookingDateTime,
  formatPrice,
  getBookingServiceLabel,
} from "@/utils/booking";

interface Props {
  bookingData: BookingData;
}

const BookingSummary = ({ bookingData }: Props) => {
  const { treatment, slot, details, depositAmountCents, servicePriceCents } = bookingData;
  const serviceTitle = getBookingServiceLabel(bookingData);
  const balanceDue =
    servicePriceCents != null ? Math.max(0, servicePriceCents - depositAmountCents) : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-ink mb-2">Booking Summary</h2>
        <p className="text-ink/70 text-sm">
          Review your appointment. You&apos;ll pay a booking deposit online; the rest is due at the salon after your
          treatment.
        </p>
      </div>

      <div className="bg-muted border p-6 space-y-4">
        {/* Treatment */}
        <div className="flex items-start gap-3">
          <img src={treatment.image} alt={treatment.name} className="w-16 h-16 object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg text-ink">{serviceTitle}</h3>
            <p className="text-ink/80 text-sm font-script text-base">{treatment.tagline}</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-xs text-ink/60 uppercase tracking-wide">Service total</p>
            <p className="font-display text-lg text-ink">
              {servicePriceCents != null ? formatPrice(servicePriceCents) : "—"}
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-4 space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-5 h-5 text-ink/60 flex-shrink-0" />
            <span className="text-ink">{formatBookingDateTime(slot.date, slot.startTime)}</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Clock className="w-5 h-5 text-ink/60 flex-shrink-0" />
            <span className="text-ink/80">
              Duration: {formatAppointmentDuration(treatment.bookingDurationMinutes)}
            </span>
          </div>
        </div>

        <div className="border-t border-border pt-4 space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <User className="w-5 h-5 text-ink/60 flex-shrink-0" />
            <span className="text-ink">
              {details.firstName} {details.lastName}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-5 h-5 text-ink/60 flex-shrink-0" />
            <span className="text-ink/80">{details.email}</span>
          </div>

          {details.phone && (
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-5 h-5 text-ink/60 flex-shrink-0" />
              <span className="text-ink/80">{details.phone}</span>
            </div>
          )}

          {details.notes && (
            <div className="flex items-start gap-3 text-sm">
              <MessageSquare className="w-5 h-5 text-ink/60 flex-shrink-0 mt-0.5" />
              <span className="text-ink/80">{details.notes}</span>
            </div>
          )}
        </div>

        <div className="border-t border-border pt-4 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-ink/80">Booking deposit (pay now)</span>
            <span className="font-display text-ink">{formatPrice(depositAmountCents)}</span>
          </div>
          {balanceDue != null && servicePriceCents != null ? (
            <div className="flex justify-between items-center text-sm">
              <span className="text-ink/80">Due at appointment after service</span>
              <span className="font-display text-ink">{formatPrice(balanceDue)}</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="bg-accent/20 border border-accent/30 p-4 text-sm text-ink/80">
        <p className="font-medium text-ink mb-1">Booking Policy:</p>
        <ul className="space-y-1 text-xs">
          <li>• A deposit confirms your appointment; the remaining balance is paid at the salon after your treatment.</li>
          <li>• Cancellations must be made at least 24 hours in advance</li>
          <li>• You&apos;ll receive a confirmation email with booking details</li>
          <li>• The exact studio address will be shared after booking confirmation</li>
        </ul>
      </div>
    </div>
  );
};

export default BookingSummary;
