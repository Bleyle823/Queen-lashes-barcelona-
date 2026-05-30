import { CheckCircle, Calendar, Clock, User, Mail, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import type { BookingData } from "@/types/booking";
import {
  formatAppointmentDuration,
  formatBookingDateTime,
  formatPrice,
  getBookingServiceLabel,
} from "@/utils/booking";

interface Props {
  bookingData: BookingData;
  bookingId: string;
  paymentIntentId: string;
  receiptUrl?: string | null;
}

const BookingConfirmation = ({
  bookingData,
  bookingId,
  paymentIntentId,
  receiptUrl,
}: Props) => {
  const { treatment, slot, details, depositAmountCents, servicePriceCents } = bookingData;
  const serviceTitle = getBookingServiceLabel(bookingData);
  const balanceDue =
    servicePriceCents != null ? Math.max(0, servicePriceCents - depositAmountCents) : null;
  const depositFlow = servicePriceCents != null && servicePriceCents > depositAmountCents;

  return (
    <div className="space-y-8 text-center">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="font-display text-3xl md:text-4xl text-ink">Booking Confirmed!</h1>
        <p className="text-ink/80 max-w-md mx-auto">
          Thank you, {details.firstName}! Your appointment is reserved
          {depositFlow ? " and your booking deposit was received." : ". Your payment was received."}
        </p>
      </div>

      <div className="bg-muted border p-6 text-left max-w-md mx-auto space-y-4">
        <div className="text-center pb-3 border-b border-border">
          <h2 className="font-display text-lg text-ink">Booking Details</h2>
          <p className="text-xs text-ink/60">Booking ID: {bookingId}</p>
        </div>

        <div className="flex items-start gap-3">
          <img src={treatment.bookingImage ?? treatment.image} alt={treatment.name} className="w-12 h-12 object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-ink text-sm">{serviceTitle}</h3>
            <p className="text-ink/70 text-xs">{treatment.tagline}</p>
            {depositFlow ? (
              <div className="text-ink/70 text-xs mt-2 space-y-0.5">
                <p>
                  Service total: <span className="text-ink font-medium">{formatPrice(servicePriceCents!)}</span>
                </p>
                <p>
                  Deposit paid: <span className="text-ink font-medium">{formatPrice(depositAmountCents)}</span>
                </p>
                {balanceDue != null ? (
                  <p>
                    Due after your visit: <span className="text-ink font-medium">{formatPrice(balanceDue)}</span>
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="text-ink/70 text-xs mt-0.5">Paid online: {formatPrice(depositAmountCents)}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-ink/60 flex-shrink-0" />
            <span className="text-ink">{formatBookingDateTime(slot.date, slot.startTime)}</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Clock className="w-4 h-4 text-ink/60 flex-shrink-0" />
            <span className="text-ink/80">
              Duration: {formatAppointmentDuration(treatment.bookingDurationMinutes)}
            </span>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <div className="text-xs text-ink/60">Payment reference</div>
          <p className="text-sm text-ink/80 font-mono break-all">{paymentIntentId}</p>
          {receiptUrl ? (
            <a
              href={receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm font-medium text-ink underline underline-offset-2 hover:text-ink/80"
            >
              View Stripe payment receipt
            </a>
          ) : (
            <p className="text-xs text-ink/60">
              If a hosted receipt link is not shown yet, check your inbox. Stripe sends a receipt to the email you used at
              checkout when receipts are enabled in your Stripe Dashboard.
            </p>
          )}
        </div>

        <div className="space-y-2 pt-3 border-t border-border">
          <div className="flex items-center gap-3 text-sm">
            <User className="w-4 h-4 text-ink/60 flex-shrink-0" />
            <span className="text-ink">
              {details.firstName} {details.lastName}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-ink/60 flex-shrink-0" />
            <span className="text-ink/80">{details.email}</span>
          </div>

          {details.notes && (
            <div className="flex items-start gap-3 text-sm">
              <MessageSquare className="w-4 h-4 text-ink/60 flex-shrink-0 mt-0.5" />
              <span className="text-ink/80">{details.notes}</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-accent/20 border border-accent/30 p-6 text-left max-w-md mx-auto">
        <h3 className="font-display text-lg text-ink mb-3">What Happens Next?</h3>
        <ul className="space-y-2 text-sm text-ink/80">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-ink/40 rounded-full mt-2 flex-shrink-0" />
            You&apos;ll receive a confirmation email with all booking details
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-ink/40 rounded-full mt-2 flex-shrink-0" />
            The exact studio address will be shared 24 hours before your appointment
          </li>
          {depositFlow ? (
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-ink/40 rounded-full mt-2 flex-shrink-0" />
              Please bring a card or cash for the remaining balance after your treatment
            </li>
          ) : null}
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-ink/40 rounded-full mt-2 flex-shrink-0" />
            We&apos;ll send a reminder text/email the day before your visit
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-ink/40 rounded-full mt-2 flex-shrink-0" />
            For any changes, please contact us at least 24 hours in advance
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/"
          className="bg-peach hover:bg-[hsl(var(--peach-hover))] text-ink font-display tracking-widest px-8 py-3 transition-colors text-center"
        >
          Back to Home
        </Link>
        <Link
          to="/treatments"
          className="border border-ink text-ink hover:bg-ink hover:text-background font-display tracking-widest px-8 py-3 transition-colors text-center"
        >
          Browse Treatments
        </Link>
      </div>

      <div className="text-center text-sm text-ink/70 space-y-1">
        <p>Questions about your booking?</p>
        <p>
          Email us at{" "}
          <a href="mailto:hello@queenlashesbarcelona.com" className="text-ink hover:underline">
            hello@queenlashesbarcelona.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default BookingConfirmation;
