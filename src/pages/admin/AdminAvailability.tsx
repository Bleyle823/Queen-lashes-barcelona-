import { useCallback, useEffect, useState } from "react";
import { format, addDays } from "date-fns";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  adminListAvailability,
  adminAddAvailability,
  adminDeleteAvailability,
  type AvailabilityRow,
} from "@/lib/admin-api";

const today = () => format(new Date(), "yyyy-MM-dd");
const ninetyDays = () => format(addDays(new Date(), 90), "yyyy-MM-dd");

type Mode = "block_day" | "block_slot" | "open_slot";

const AdminAvailability = () => {
  const [rows, setRows] = useState<AvailabilityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [from, setFrom] = useState(today());
  const [to, setTo] = useState(ninetyDays());

  const [mode, setMode] = useState<Mode>("block_day");
  const [date, setDate] = useState(today());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { availability } = await adminListAvailability({ from, to });
      setRows(availability);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        date,
        start_time: mode === "block_day" ? null : startTime,
        end_time: mode === "block_day" ? null : endTime,
        available: mode === "open_slot",
        note: note || null,
      };
      await adminAddAvailability(payload);
      toast.success("Override added");
      setNote("");
      await reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this override?")) return;
    try {
      await adminDeleteAvailability(id);
      toast.success("Removed");
      await reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to remove");
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl text-ink">Availability</h1>
        <p className="text-ink/70 text-sm mt-1">
          Block dates or specific slots, or open extra slots beyond default business hours.
        </p>
      </header>

      <form onSubmit={handleAdd} className="border border-border bg-muted/20 p-5 space-y-4">
        <h2 className="font-display text-lg text-ink">Add override</h2>

        <div className="flex gap-1 border border-border w-fit">
          {(
            [
              { id: "block_day" as Mode, label: "Close whole day" },
              { id: "block_slot" as Mode, label: "Block one slot" },
              { id: "open_slot" as Mode, label: "Open extra slot" },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`px-3 py-1.5 text-xs ${mode === m.id ? "bg-peach/30 text-ink" : "text-ink/70 hover:bg-muted"}`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <label className="block">
            <span className="block text-[10px] tracking-[0.2em] uppercase text-ink/60 mb-1">Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="bg-background border border-border px-2 py-1.5 text-sm w-full"
            />
          </label>
          {mode !== "block_day" && (
            <>
              <label className="block">
                <span className="block text-[10px] tracking-[0.2em] uppercase text-ink/60 mb-1">Start</span>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="bg-background border border-border px-2 py-1.5 text-sm w-full"
                />
              </label>
              <label className="block">
                <span className="block text-[10px] tracking-[0.2em] uppercase text-ink/60 mb-1">End</span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="bg-background border border-border px-2 py-1.5 text-sm w-full"
                />
              </label>
            </>
          )}
          <label className="block sm:col-span-1 col-span-1">
            <span className="block text-[10px] tracking-[0.2em] uppercase text-ink/60 mb-1">Note (optional)</span>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={200}
              className="bg-background border border-border px-2 py-1.5 text-sm w-full"
              placeholder="e.g. Holiday"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-peach hover:bg-[hsl(var(--peach-hover))] text-ink font-display tracking-widest px-6 py-2 text-sm disabled:opacity-60"
        >
          {saving ? "Saving…" : "Add override"}
        </button>
      </form>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-display text-lg text-ink">Current overrides</h2>
          <div className="flex gap-2">
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
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 text-sm">{error}</div>}

        <div className="border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-ink/70 text-left text-xs uppercase tracking-wider">
              <tr>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Note</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-ink/60">
                    Loading…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-ink/60">
                    No overrides in this range.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="border-t border-border hover:bg-muted/20">
                    <td className="px-3 py-2 text-ink whitespace-nowrap">{r.date}</td>
                    <td className="px-3 py-2 text-ink/80 whitespace-nowrap">
                      {r.start_time
                        ? `${String(r.start_time).slice(0, 5)}–${String(r.end_time || "").slice(0, 5)}`
                        : "All day"}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`text-[11px] uppercase tracking-wider px-2 py-0.5 ${
                          r.available ? "bg-green-100 text-green-800" : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {r.available ? "Open" : "Closed"}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-ink/70">{r.note || "—"}</td>
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => void handleDelete(r.id)}
                        className="text-ink/60 hover:text-rose-600 p-1"
                        title="Delete override"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminAvailability;
