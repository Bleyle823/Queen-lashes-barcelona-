import { useCallback, useEffect, useMemo, useState } from "react";
import { Mail, RefreshCw, Search, X } from "lucide-react";
import { toast } from "sonner";
import {
  adminListBookings,
  adminUpdateBooking,
  adminResendBookingEmail,
  adminRefundBooking,
  type StoredBooking,
} from "@/lib/admin-api";

type StatusFilter = "" | StoredBooking["status"];

const STATUSES: StoredBooking["status"][] = [
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
  "refunded",
];

const formatEur = (cents: number) => `${(cents / 100).toFixed(2)} €`;
const formatDate = (d: string, t: string) => `${d} ${String(t).slice(0, 5)}`;

const exportCsv = (rows: StoredBooking[]) => {
  const header = [
    "id",
    "created_at",
    "slot_date",
    "slot_start",
    "treatment_name",
    "first_name",
    "last_name",
    "email",
    "phone",
    "status",
    "total_amount_cents",
    "service_price_cents",
    "stripe_payment_intent_id",
  ];
  const csv = [
    header.join(","),
    ...rows.map((r) =>
      header
        .map((k) => {
          const v = (r as unknown as Record<string, unknown>)[k];
          if (v == null) return "";
          const s = String(v).replace(/"/g, '""');
          return /[",\n]/.test(s) ? `"${s}"` : s;
        })
        .join(","),
    ),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState<StoredBooking[]>([]);
  const [status, setStatus] = useState<StatusFilter>("");
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<StoredBooking | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { bookings } = await adminListBookings({
        status: status || undefined,
        search: search || undefined,
        from: from || undefined,
        to: to || undefined,
      });
      setBookings(bookings);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [status, search, from, to]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const totalRevenue = useMemo(
    () =>
      bookings
        .filter((b) => b.status !== "cancelled" && b.status !== "refunded")
        .reduce((s, b) => s + (b.total_amount_cents || 0), 0),
    [bookings],
  );

  const handleStatusChange = async (b: StoredBooking, next: StoredBooking["status"]) => {
    try {
      await adminUpdateBooking(b.id, { status: next });
      toast.success(`Status updated to ${next}`);
      await reload();
      if (active?.id === b.id) setActive({ ...active, status: next });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    }
  };

  const handleResend = async (b: StoredBooking) => {
    try {
      const { result } = await adminResendBookingEmail(b.id);
      if (result.dev) toast.message("Email logged to server console (dev mode).");
      else if (result.customerSent) toast.success("Confirmation email sent.");
      else toast.error(result.error || "Email did not send.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Email failed");
    }
  };

  const handleRefund = async (b: StoredBooking) => {
    if (!confirm(`Refund ${formatEur(b.total_amount_cents)} to ${b.email}?`)) return;
    try {
      await adminRefundBooking(b.id);
      toast.success("Refund issued.");
      await reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Refund failed");
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">Bookings</h1>
          <p className="text-ink/70 text-sm mt-1">
            {bookings.length} bookings · {formatEur(totalRevenue)} revenue
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => exportCsv(bookings)}
            className="px-3 py-2 text-sm border border-border hover:bg-muted"
            disabled={!bookings.length}
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => void reload()}
            className="px-3 py-2 text-sm border border-border hover:bg-muted flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </header>

      <div className="flex flex-wrap gap-3 items-end border border-border bg-muted/20 p-3">
        <label className="block">
          <span className="block text-[10px] tracking-[0.2em] uppercase text-ink/60 mb-1">Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className="bg-background border border-border px-2 py-1.5 text-sm"
          >
            <option value="">All</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="block text-[10px] tracking-[0.2em] uppercase text-ink/60 mb-1">From</span>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="bg-background border border-border px-2 py-1.5 text-sm"
          />
        </label>
        <label className="block">
          <span className="block text-[10px] tracking-[0.2em] uppercase text-ink/60 mb-1">To</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="bg-background border border-border px-2 py-1.5 text-sm"
          />
        </label>
        <label className="block flex-1 min-w-[220px]">
          <span className="block text-[10px] tracking-[0.2em] uppercase text-ink/60 mb-1">Search</span>
          <div className="flex items-center gap-2 bg-background border border-border px-2 py-1.5">
            <Search className="w-3.5 h-3.5 text-ink/50" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name or email"
              className="bg-transparent outline-none text-sm flex-1"
            />
          </div>
        </label>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 text-sm">{error}</div>}

      <div className="border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-ink/70 text-left text-xs uppercase tracking-wider">
            <tr>
              <th className="px-3 py-2">When</th>
              <th className="px-3 py-2">Customer</th>
              <th className="px-3 py-2">Treatment</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2 text-right">Payment</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-ink/60">
                  Loading…
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-ink/60">
                  No bookings match these filters.
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id} className="border-t border-border hover:bg-muted/20">
                  <td className="px-3 py-2 text-ink whitespace-nowrap">{formatDate(b.slot_date, b.slot_start)}</td>
                  <td className="px-3 py-2">
                    <p className="text-ink">
                      {b.first_name} {b.last_name}
                    </p>
                    <p className="text-ink/60 text-xs">{b.email}</p>
                  </td>
                  <td className="px-3 py-2 text-ink/80">{b.treatment_name}</td>
                  <td className="px-3 py-2">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-3 py-2 text-right text-ink whitespace-nowrap">
                    <div>{formatEur(b.total_amount_cents)}</div>
                    {typeof b.service_price_cents === "number" &&
                    Number.isFinite(b.service_price_cents) &&
                    b.service_price_cents > b.total_amount_cents ? (
                      <div className="text-[11px] text-ink/55 leading-tight mt-0.5">
                        Bal. {formatEur(b.service_price_cents - b.total_amount_cents)}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => setActive(b)}
                      className="text-xs px-2 py-1 border border-border hover:bg-muted"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {active && (
        <BookingDetailDrawer
          booking={active}
          onClose={() => setActive(null)}
          onStatusChange={handleStatusChange}
          onResend={handleResend}
          onRefund={handleRefund}
        />
      )}
    </div>
  );
};

const StatusBadge = ({ status }: { status: StoredBooking["status"] }) => {
  const colour = {
    confirmed: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-gray-100 text-gray-800",
    no_show: "bg-amber-100 text-amber-800",
    refunded: "bg-rose-100 text-rose-800",
  }[status];
  return <span className={`px-2 py-0.5 text-[11px] uppercase tracking-wider ${colour}`}>{status}</span>;
};

const BookingDetailDrawer = ({
  booking,
  onClose,
  onStatusChange,
  onResend,
  onRefund,
}: {
  booking: StoredBooking;
  onClose: () => void;
  onStatusChange: (b: StoredBooking, next: StoredBooking["status"]) => Promise<void>;
  onResend: (b: StoredBooking) => Promise<void>;
  onRefund: (b: StoredBooking) => Promise<void>;
}) => {
  const balanceAtVisit =
    typeof booking.service_price_cents === "number" && Number.isFinite(booking.service_price_cents)
      ? Math.max(0, booking.service_price_cents - booking.total_amount_cents)
      : null;

  const lines: [string, React.ReactNode][] = [
    ["Booking ID", <code className="text-xs" key="id">{booking.id}</code>],
    ["Treatment", booking.treatment_name],
    ["Slot", `${booking.slot_date} ${String(booking.slot_start).slice(0, 5)}–${String(booking.slot_end).slice(0, 5)}`],
    ["Customer", `${booking.first_name} ${booking.last_name}`],
    ["Email", booking.email],
    ["Phone", booking.phone || "-"],
    ["Notes", booking.notes || "-"],
    ["Deposit paid (online)", formatEur(booking.total_amount_cents)],
    ...(typeof booking.service_price_cents === "number" && Number.isFinite(booking.service_price_cents)
      ? ([
          ["Service total (menu)", formatEur(booking.service_price_cents)],
          ["Balance due at visit", balanceAtVisit != null ? formatEur(balanceAtVisit) : "-"],
        ] as [string, React.ReactNode][])
      : []),
    ["Stripe session", booking.stripe_session_id ? <code className="text-xs" key="ss">{booking.stripe_session_id}</code> : "-"],
    [
      "Receipt",
      booking.receipt_url ? (
        <a href={booking.receipt_url} target="_blank" rel="noreferrer" className="underline text-xs" key="r">
          Open Stripe receipt
        </a>
      ) : (
        "-"
      ),
    ],
    ["Email sent at", booking.email_sent_at || "Not sent"],
    ["Created at", booking.created_at],
  ];

  return (
    <div
      className="fixed inset-0 bg-black/30 flex justify-end z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <aside className="w-full max-w-md bg-background h-full overflow-y-auto border-l border-border">
        <header className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-display text-xl text-ink">Booking details</h2>
          <button type="button" onClick={onClose} className="p-1 text-ink/70 hover:text-ink">
            <X className="w-4 h-4" />
          </button>
        </header>

        <div className="p-5 space-y-5">
          <div className="space-y-2 text-sm">
            {lines.map(([label, value]) => (
              <div key={label} className="grid grid-cols-3 gap-3">
                <span className="text-ink/60 text-xs uppercase tracking-wider">{label}</span>
                <div className="col-span-2 text-ink break-words">{value}</div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs text-ink/70 mb-1">Status</label>
            <select
              value={booking.status}
              onChange={(e) => void onStatusChange(booking, e.target.value as StoredBooking["status"])}
              className="bg-background border border-border px-2 py-1.5 text-sm w-full"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              onClick={() => void onResend(booking)}
              className="px-3 py-2 text-sm border border-border hover:bg-muted flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              Resend confirmation
            </button>
            {booking.stripe_payment_intent_id && booking.status !== "refunded" && (
              <button
                type="button"
                onClick={() => void onRefund(booking)}
                className="px-3 py-2 text-sm border border-rose-300 text-rose-700 hover:bg-rose-50"
              >
                Refund payment
              </button>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default AdminBookings;
