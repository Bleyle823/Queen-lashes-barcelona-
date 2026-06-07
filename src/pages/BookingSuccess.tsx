import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingConfirmation from "@/components/booking/BookingConfirmation";
import {
  fetchCheckoutSessionStatus,
  type StoredBooking,
} from "@/lib/stripe-checkout";
import { getTreatment } from "@/data/treatments";
import type { BookingData } from "@/types/booking";
import { useTranslation } from "@/i18n/LocaleProvider";
import type { Locale } from "@/i18n/types";

function bookingDataFromStored(b: StoredBooking, locale: Locale): BookingData | null {
  const treatment = getTreatment(b.treatment_slug, locale);
  if (!treatment) return null;

  const servicePriceCents =
    typeof b.service_price_cents === "number" && Number.isFinite(b.service_price_cents)
      ? b.service_price_cents
      : null;

  return {
    treatment,
    slot: {
      id: `${b.slot_date}-${b.slot_start.slice(0, 5)}`,
      date: b.slot_date,
      startTime: b.slot_start.slice(0, 5),
      endTime: b.slot_end.slice(0, 5),
      available: true,
    },
    details: {
      firstName: b.first_name,
      lastName: b.last_name,
      email: b.email,
      phone: b.phone ?? undefined,
      notes: b.notes ?? undefined,
    },
    depositAmountCents: b.total_amount_cents,
    servicePriceCents,
    serviceLabel: b.treatment_name,
  };
}

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { t, locale } = useTranslation();
  const s = t.booking.success;

  const [status, setStatus] = useState<"loading" | "paid" | "unpaid" | "error">("loading");
  const [message, setMessage] = useState<string>("");
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [bookingId, setBookingId] = useState("");
  const [paymentRef, setPaymentRef] = useState("");
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setMessage(s.missingSession);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const session = await fetchCheckoutSessionStatus(sessionId);
        if (cancelled) return;

        setReceiptUrl(null);

        if (!session.paid || !session.booking) {
          setStatus("unpaid");
          setMessage(
            session.payment_status === "unpaid" ? s.unpaidMessage : s.pendingMessage,
          );
          return;
        }

        const data = bookingDataFromStored(session.booking, locale);
        if (!data) {
          setStatus("error");
          setMessage(s.treatmentMismatch);
          return;
        }

        setBookingData(data);
        setBookingId(session.booking.id);
        setPaymentRef(session.booking.stripe_payment_intent_id || sessionId);
        setReceiptUrl(session.booking.receipt_url);
        setStatus("paid");
      } catch (e) {
        if (cancelled) return;
        setStatus("error");
        setMessage(e instanceof Error ? e.message : s.genericError);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId, locale, s]);

  useEffect(() => {
    if (status !== "paid" || !sessionId || receiptUrl) return;
    const timer = setTimeout(async () => {
      try {
        const session = await fetchCheckoutSessionStatus(sessionId);
        if (session.booking?.receipt_url) setReceiptUrl(session.booking.receipt_url);
      } catch {
        /* ignore */
      }
    }, 2200);
    return () => clearTimeout(timer);
  }, [status, sessionId, receiptUrl]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-4xl mx-auto px-6 lg:px-10 py-8">
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center min-h-[320px] gap-3 text-ink/80">
            <div className="w-8 h-8 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
            <p>{s.confirming}</p>
          </div>
        )}

        {status === "error" && (
          <div className="max-w-md mx-auto text-center space-y-4">
            <h1 className="font-display text-2xl text-ink">{s.errorTitle}</h1>
            <p className="text-ink/80 text-sm">{message}</p>
            <Link
              to="/booking"
              className="inline-block bg-peach hover:bg-[hsl(var(--peach-hover))] text-ink font-display tracking-widest px-8 py-3"
            >
              {s.backToBooking}
            </Link>
          </div>
        )}

        {status === "unpaid" && (
          <div className="max-w-md mx-auto text-center space-y-4">
            <h1 className="font-display text-2xl text-ink">{s.unpaidTitle}</h1>
            <p className="text-ink/80 text-sm">{message}</p>
            <Link
              to="/booking"
              className="inline-block bg-peach hover:bg-[hsl(var(--peach-hover))] text-ink font-display tracking-widest px-8 py-3"
            >
              {s.returnToBooking}
            </Link>
          </div>
        )}

        {status === "paid" && bookingData && (
          <BookingConfirmation
            bookingData={bookingData}
            bookingId={bookingId}
            paymentIntentId={paymentRef}
            receiptUrl={receiptUrl}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BookingSuccess;
