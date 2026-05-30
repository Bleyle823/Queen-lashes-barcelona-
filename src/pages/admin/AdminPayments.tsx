import { useEffect, useMemo, useState } from "react";
import { format, subDays } from "date-fns";
import { adminAnalytics, adminListBookings, type AnalyticsResponse, type StoredBooking } from "@/lib/admin-api";

const formatEur = (cents: number) => `${(cents / 100).toFixed(2)} €`;

const ranges = [
  { id: "7", label: "Last 7 days", days: 7 },
  { id: "30", label: "Last 30 days", days: 30 },
  { id: "90", label: "Last 90 days", days: 90 },
  { id: "365", label: "Last 12 months", days: 365 },
] as const;

const AdminPayments = () => {
  const [rangeId, setRangeId] = useState<(typeof ranges)[number]["id"]>("30");
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [bookings, setBookings] = useState<StoredBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const days = useMemo(() => ranges.find((r) => r.id === rangeId)!.days, [rangeId]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const today = new Date();
    const from = format(subDays(today, days), "yyyy-MM-dd");
    const to = format(today, "yyyy-MM-dd");

    Promise.all([adminAnalytics({ from, to }), adminListBookings({ from, to })])
      .then(([a, b]) => {
        if (cancelled) return;
        setAnalytics(a);
        setBookings(b.bookings);
      })
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [days]);

  const refunded = bookings.filter((b) => b.status === "refunded").length;
  const grossRevenue = analytics?.revenue_cents ?? 0;

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl text-ink">Payments</h1>
          <p className="text-ink/70 text-sm mt-1">Revenue and Stripe transactions.</p>
        </div>
        <div className="flex gap-1 border border-border">
          {ranges.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRangeId(r.id)}
              className={`px-3 py-1.5 text-xs ${
                rangeId === r.id ? "bg-peach/30 text-ink" : "text-ink/70 hover:bg-muted"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </header>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 text-sm">{error}</div>}

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Stat label="Gross revenue" value={loading ? "…" : formatEur(grossRevenue)} />
        <Stat label="Paid bookings" value={loading ? "…" : String(analytics?.counted_bookings ?? 0)} />
        <Stat label="Refunded" value={loading ? "…" : String(refunded)} />
      </section>

      <section className="border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-ink/70 text-left text-xs uppercase tracking-wider">
            <tr>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Customer</th>
              <th className="px-3 py-2">Treatment</th>
              <th className="px-3 py-2">PaymentIntent</th>
              <th className="px-3 py-2 text-right">Amount</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-center text-ink/60">
                  Loading…
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-center text-ink/60">
                  No payments in this range.
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id} className="border-t border-border hover:bg-muted/20">
                  <td className="px-3 py-2 text-ink/80 whitespace-nowrap">{b.created_at?.slice(0, 10)}</td>
                  <td className="px-3 py-2 text-ink">
                    {b.first_name} {b.last_name}
                    <p className="text-ink/60 text-xs">{b.email}</p>
                  </td>
                  <td className="px-3 py-2 text-ink/80">{b.treatment_name}</td>
                  <td className="px-3 py-2 text-ink/60 text-xs font-mono">
                    {b.stripe_payment_intent_id || "-"}
                  </td>
                  <td className="px-3 py-2 text-right text-ink whitespace-nowrap">
                    {formatEur(b.total_amount_cents)}
                  </td>
                  <td className="px-3 py-2 text-ink/80 text-xs uppercase">{b.status}</td>
                  <td className="px-3 py-2">
                    {b.receipt_url ? (
                      <a
                        href={b.receipt_url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline text-xs text-ink"
                      >
                        Receipt
                      </a>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="border border-border bg-muted/20 p-5">
    <p className="text-[10px] tracking-[0.2em] uppercase text-ink/60">{label}</p>
    <p className="font-display text-2xl text-ink mt-1">{value}</p>
  </div>
);

export default AdminPayments;
