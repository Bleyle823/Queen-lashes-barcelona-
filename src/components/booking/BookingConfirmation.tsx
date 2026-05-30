import { CheckCircle, Calendar, Clock, User, Mail, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import type { BookingData } from "@/types/booking";
import {
  formatAppointmentDuration,
  formatBookingDateTime,
  formatPrice,
  getBookingServiceLabel,
} from "@/utils/booking";
import { useTranslation } from "@/i18n/LocaleProvider";
import { interpolate } from "@/i18n/translations";

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
  const { t, locale } = useTranslation();
  const c = t.booking.confirmation;
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
        <h1 className="font-display text-3xl md:text-4xl text-ink">{c.title}</h1>
        <p className="text-ink/80 max-w-md mx-auto">
          {depositFlow
            ? interpolate(c.thankYouDeposit, { name: details.firstName })
            : interpolate(c.thankYouPaid, { name: details.firstName })}
        </p>
      </div>

      <div className="bg-muted border p-6 text-left max-w-md mx-auto space-y-4">
        <div className="text-center pb-3 border-b border-border">
          <h2 className="font-display text-lg text-ink">{c.detailsTitle}</h2>
          <p className="text-xs text-ink/60">
            {c.bookingId} {bookingId}
          </p>
        </div>

        <div className="flex items-start gap-3">
          <img
            src={treatment.bookingImage ?? treatment.image}
            alt={treatment.name}
            className="w-12 h-12 object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-ink text-sm">{serviceTitle}</h3>
            <p className="text-ink/70 text-xs">{treatment.tagline}</p>
            {depositFlow ? (
              <div className="text-ink/70 text-xs mt-2 space-y-0.5">
                <p>
                  {c.serviceTotal}{" "}
                  <span className="text-ink font-medium">{formatPrice(servicePriceCents!)}</span>
                </p>
                <p>
                  {c.depositPaid}{" "}
                  <span className="text-ink font-medium">{formatPrice(depositAmountCents)}</span>
                </p>
                {balanceDue != null ? (
                  <p>
                    {c.dueAfterVisit}{" "}
                    <span className="text-ink font-medium">{formatPrice(balanceDue)}</span>
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="text-ink/70 text-xs mt-0.5">
                {c.paidOnline} {formatPrice(depositAmountCents)}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-ink/60 flex-shrink-0" />
            <span className="text-ink">{formatBookingDateTime(slot.date, slot.startTime, locale)}</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Clock className="w-4 h-4 text-ink/60 flex-shrink-0" />
            <span className="text-ink/80">
              {c.duration} {formatAppointmentDuration(treatment.bookingDurationMinutes, locale)}
            </span>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <div className="text-xs text-ink/60">{c.paymentRef}</div>
          <p className="text-sm text-ink/80 font-mono break-all">{paymentIntentId}</p>
          {receiptUrl ? (
            <a
              href={receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm font-medium text-ink underline underline-offset-2 hover:text-ink/80"
            >
              {c.viewReceipt}
            </a>
          ) : (
            <p className="text-xs text-ink/60">{c.receiptHint}</p>
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
        <h3 className="font-display text-lg text-ink mb-3">{c.nextTitle}</h3>
        <ul className="space-y-2 text-sm text-ink/80">
          {c.nextSteps.map((step, index) => {
            if (index === 2 && !depositFlow) return null;
            return (
              <li key={index} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-ink/40 rounded-full mt-2 flex-shrink-0" />
                {step}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/"
          className="bg-peach hover:bg-[hsl(var(--peach-hover))] text-ink font-display tracking-widest px-8 py-3 transition-colors text-center"
        >
          {c.backHome}
        </Link>
        <Link
          to="/treatments"
          className="border border-ink text-ink hover:bg-ink hover:text-background font-display tracking-widest px-8 py-3 transition-colors text-center"
        >
          {c.browseTreatments}
        </Link>
      </div>

      <div className="text-center text-sm text-ink/70 space-y-1">
        <p>{c.questions}</p>
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
