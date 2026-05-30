/**
 * Stripe-related browser config.
 *
 * Booking persistence is handled server-side: `POST /api/create-checkout-session`
 * stores booking metadata on the Stripe session, and the API server saves the
 * booking row + sends the confirmation email when payment succeeds (via the
 * Stripe webhook OR when the success page calls `GET /api/checkout-session-status`).
 *
 * Therefore there is no client-side `createBooking` anymore; see
 * `src/lib/stripe-checkout.ts` and `server/index.mjs`.
 */

export function getStripePublishableKey(): string {
  const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.trim();

  if (!key) {
    console.warn("VITE_STRIPE_PUBLISHABLE_KEY not found in environment variables");
    return "";
  }

  return key;
}
