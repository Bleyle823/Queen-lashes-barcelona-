import { useEffect, useState } from "react";
import { toast } from "sonner";
import { adminGetSettings, adminUpdateSettings, type AdminSettings } from "@/lib/admin-api";

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState<AdminSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    adminGetSettings()
      .then((d) => !cancelled && setSettings(d.settings))
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const updateBusiness = (patch: Partial<NonNullable<AdminSettings["business"]>>) =>
    setSettings((s) => ({ ...s, business: { ...(s.business || {}), ...patch } }));

  const updateHours = (patch: Partial<NonNullable<AdminSettings["hours"]>>) =>
    setSettings((s) => ({
      ...s,
      hours: {
        weekday: { start: 9, end: 18 },
        weekend: { start: 10, end: 16 },
        slot_minutes: 60,
        advance_hours: 12,
        ...(s.hours || {}),
        ...patch,
      },
    }));

  const save = async () => {
    setSaving(true);
    try {
      await adminUpdateSettings({
        business: settings.business,
        hours: settings.hours,
      });
      toast.success("Settings saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-ink/70 text-sm">Loading…</p>;
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <header>
        <h1 className="font-display text-3xl text-ink">Settings</h1>
        <p className="text-ink/70 text-sm mt-1">Business information and default booking rules.</p>
      </header>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 text-sm">{error}</div>}

      <section className="border border-border bg-muted/20 p-5 space-y-4">
        <h2 className="font-display text-lg text-ink">Business</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Name">
            <input
              type="text"
              value={settings.business?.name || ""}
              onChange={(e) => updateBusiness({ name: e.target.value })}
              className="bg-background border border-border px-2 py-1.5 text-sm w-full"
            />
          </Field>
          <Field label="Email (replies / receipts)">
            <input
              type="email"
              value={settings.business?.email || ""}
              onChange={(e) => updateBusiness({ email: e.target.value })}
              className="bg-background border border-border px-2 py-1.5 text-sm w-full"
            />
          </Field>
          <Field label="Phone">
            <input
              type="tel"
              value={settings.business?.phone || ""}
              onChange={(e) => updateBusiness({ phone: e.target.value })}
              className="bg-background border border-border px-2 py-1.5 text-sm w-full"
            />
          </Field>
          <Field label="Address">
            <input
              type="text"
              value={settings.business?.address || ""}
              onChange={(e) => updateBusiness({ address: e.target.value })}
              className="bg-background border border-border px-2 py-1.5 text-sm w-full"
            />
          </Field>
        </div>
      </section>

      <section className="border border-border bg-muted/20 p-5 space-y-4">
        <h2 className="font-display text-lg text-ink">Default hours</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Weekday open (hour)">
            <input
              type="number"
              min={0}
              max={23}
              value={settings.hours?.weekday?.start ?? 9}
              onChange={(e) =>
                updateHours({
                  weekday: { ...(settings.hours?.weekday || { start: 9, end: 18 }), start: Number(e.target.value) },
                })
              }
              className="bg-background border border-border px-2 py-1.5 text-sm w-full"
            />
          </Field>
          <Field label="Weekday close (hour)">
            <input
              type="number"
              min={0}
              max={23}
              value={settings.hours?.weekday?.end ?? 18}
              onChange={(e) =>
                updateHours({
                  weekday: { ...(settings.hours?.weekday || { start: 9, end: 18 }), end: Number(e.target.value) },
                })
              }
              className="bg-background border border-border px-2 py-1.5 text-sm w-full"
            />
          </Field>
          <Field label="Weekend open (hour)">
            <input
              type="number"
              min={0}
              max={23}
              value={settings.hours?.weekend?.start ?? 10}
              onChange={(e) =>
                updateHours({
                  weekend: { ...(settings.hours?.weekend || { start: 10, end: 16 }), start: Number(e.target.value) },
                })
              }
              className="bg-background border border-border px-2 py-1.5 text-sm w-full"
            />
          </Field>
          <Field label="Weekend close (hour)">
            <input
              type="number"
              min={0}
              max={23}
              value={settings.hours?.weekend?.end ?? 16}
              onChange={(e) =>
                updateHours({
                  weekend: { ...(settings.hours?.weekend || { start: 10, end: 16 }), end: Number(e.target.value) },
                })
              }
              className="bg-background border border-border px-2 py-1.5 text-sm w-full"
            />
          </Field>
          <Field label="Slot length (minutes)">
            <input
              type="number"
              min={15}
              step={15}
              value={settings.hours?.slot_minutes ?? 60}
              onChange={(e) => updateHours({ slot_minutes: Number(e.target.value) })}
              className="bg-background border border-border px-2 py-1.5 text-sm w-full"
            />
          </Field>
          <Field label="Min advance booking (hours)">
            <input
              type="number"
              min={0}
              value={settings.hours?.advance_hours ?? 12}
              onChange={(e) => updateHours({ advance_hours: Number(e.target.value) })}
              className="bg-background border border-border px-2 py-1.5 text-sm w-full"
            />
          </Field>
        </div>
        <p className="text-[11px] text-ink/60">
          Hours are stored for reference; the public slot generator currently uses fixed defaults in
          <code> src/utils/booking.ts</code>. Override specific dates in the Availability tab.
        </p>
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving}
          className="bg-peach hover:bg-[hsl(var(--peach-hover))] text-ink font-display tracking-widest px-6 py-2 text-sm disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save settings"}
        </button>
      </div>
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="block text-[10px] tracking-[0.2em] uppercase text-ink/60 mb-1">{label}</span>
    {children}
  </label>
);

export default AdminSettingsPage;
