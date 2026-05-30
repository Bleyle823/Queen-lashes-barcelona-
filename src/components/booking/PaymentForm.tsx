import { useState } from "react";
import { CreditCard, Lock, ExternalLink } from "lucide-react";
import type { BookingData } from "@/types/booking";
import { formatPrice } from "@/utils/booking";
import { createHostedCheckoutSession } from "@/lib/stripe-checkout";
import { useTranslation } from "@/i18n/LocaleProvider";
import { interpolate } from "@/i18n/translations";

interface Props {
  bookingData: BookingData;
}

const PaymentForm = ({ bookingData }: Props) => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const { depositAmountCents, servicePriceCents } = bookingData;
  const balanceDue =
    servicePriceCents != null ? Math.max(0, servicePriceCents - depositAmountCents) : null;

  const handleStripeCheckout = async () => {
    setError(null);
    setIsRedirecting(true);
    try {
      const url = await createHostedCheckoutSession(bookingData);
      window.location.assign(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.booking.payment.checkoutError);
      setIsRedirecting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-ink mb-2">{t.booking.payment.title}</h2>
        <p className="text-ink/70 text-sm">{t.booking.payment.subtitle}</p>
      </div>

      <div className="bg-muted border p-4 space-y-3">
        {servicePriceCents != null ? (
          <div className="flex justify-between items-center text-sm border-b border-border pb-3">
            <span className="text-ink/80">{t.booking.payment.serviceTotal}</span>
            <span className="font-display text-ink">{formatPrice(servicePriceCents)}</span>
          </div>
        ) : null}
        <div className="flex justify-between items-center">
          <span className="text-ink/80">{t.booking.payment.depositDue}</span>
          <span className="font-display text-xl text-ink">{formatPrice(depositAmountCents)}</span>
        </div>
        {balanceDue != null && servicePriceCents != null ? (
          <p className="text-xs text-ink/65 pt-1">
            {t.booking.payment.balanceAtVisit}{" "}
            <strong className="text-ink">{formatPrice(balanceDue)}</strong>
          </p>
        ) : null}
      </div>

      <div className="flex items-start gap-2 text-xs text-ink/60 bg-accent/10 p-3 border border-accent/20">
        <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>{t.booking.payment.secureNote}</p>
      </div>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 p-3" role="alert">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleStripeCheckout}
        disabled={isRedirecting}
        className="w-full bg-peach hover:bg-[hsl(var(--peach-hover))] text-ink font-display tracking-widest px-8 py-4 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isRedirecting ? (
          <>
            <div className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
            {t.booking.payment.redirecting}
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4" />
            {interpolate(t.booking.payment.payDeposit, { amount: formatPrice(depositAmountCents) })}
            <ExternalLink className="w-4 h-4 opacity-70" aria-hidden />
          </>
        )}
      </button>
    </div>
  );
};

export default PaymentForm;
