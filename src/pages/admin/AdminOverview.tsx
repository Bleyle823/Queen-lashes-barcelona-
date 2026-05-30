import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { adminAnalytics, adminListBookings, type AnalyticsResponse, type StoredBooking } from "@/lib/admin-api";

const formatEur = (cents: number) => `${(cents / 100).toFixed(2)} €`;

const AdminOverview = () => {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [upcoming, setUpcoming] = useState<StoredBooking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const today = format(new Date(), "yyyy-MM-dd");
    const from = format(subDays(new Date(), 30), "yyyy-MM-dd");

    Promise.all([
      adminAnalytics({ from, to: today }),
      adminListBookings({ from: today }),
    ])
      .then(([a, b]) => {
        if (cancelled) return;
        setAnalytics(a);
        setUpcoming(b.bookings.filter((x) => x.status === "confirmed").slice(0, 6));
      })
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl text-ink">Dashboard</h1>
        <p className="text-ink/70 text-sm mt-1">Last 30 days overview.</p>
      </header>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 text-sm">{error}</div>}

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Bookings (30d)" value={loading ? "…" : String(analytics?.counted_bookings ?? 0)} />
        <Stat label="Revenue (30d)" value={loading ? "…" : formatEur(analytics?.revenue_cents ?? 0)} />
        <Stat
          label="Cancelled / refunded"
          value={
            loading
              ? "…"
              : String((analytics?.by_status?.cancelled ?? 0) + (analytics?.by_status?.refunded ?? 0))
          }
        />
        <Stat label="Upcoming" value={loading ? "…" : String(upcoming.length)} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-border bg-muted/20 p-5">
          <h2 className="font-display text-lg text-ink mb-3">Revenue by treatment</h2>
          {loading ? (
            <p className="text-ink/60 text-sm">Loading…</p>
          ) : !analytics?.by_treatment?.length ? (
            <p className="text-ink/60 text-sm">No paid bookings yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {analytics.by_treatment.map((t) => (
                <li key={t.slug} className="py-2 flex items-center justify-between text-sm">
                  <span className="text-ink">{t.name}</span>
                  <span className="text-ink/70">
                    {t.count} × · <strong className="text-ink">{formatEur(t.revenue_cents)}</strong>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border border-border bg-muted/20 p-5">
          <h2 className="font-display text-lg text-ink mb-3">Upcoming appointments</h2>
          {loading ? (
            <p className="text-ink/60 text-sm">Loading…</p>
          ) : upcoming.length === 0 ? (
            <p className="text-ink/60 text-sm">No upcoming bookings.</p>
          ) : (
            <ul className="divide-y divide-border">
              {upcoming.map((b) => (
                <li key={b.id} className="py-2 flex items-center justify-between text-sm">
                  <div>
                    <p className="text-ink">
                      {b.first_name} {b.last_name}
                    </p>
                    <p className="text-ink/60 text-xs">
                      {b.treatment_name}, {b.slot_date} {String(b.slot_start).slice(0, 5)}
                    </p>
                  </div>
                  <span className="text-ink/70 text-xs">{formatEur(b.total_amount_cents)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
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

export default AdminOverview;
