import { useCallback, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  adminListTreatments,
  adminUpsertTreatment,
  adminDeleteTreatment,
  type AdminTreatment,
} from "@/lib/admin-api";

type EditState = Partial<AdminTreatment> & { isNew?: boolean };

const emptyTreatment = (): EditState => ({
  isNew: true,
  slug: "",
  name: "",
  description: "",
  price_cents: 0,
  duration_minutes: 60,
  active: true,
  sort_order: 0,
});

const AdminTreatments = () => {
  const [rows, setRows] = useState<AdminTreatment[]>([]);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { treatments } = await adminListTreatments();
      setRows(treatments);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const save = async () => {
    if (!editing || !editing.slug || !editing.name) {
      toast.error("Slug and name are required");
      return;
    }
    setSaving(true);
    try {
      await adminUpsertTreatment({
        slug: editing.slug,
        name: editing.name,
        description: editing.description ?? null,
        price_cents: Number(editing.price_cents) || 0,
        duration_minutes: Number(editing.duration_minutes) || 60,
        active: editing.active !== false,
        sort_order: Number(editing.sort_order) || 0,
      });
      toast.success("Saved");
      setEditing(null);
      await reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (slug: string) => {
    if (!confirm(`Delete treatment "${slug}"?`)) return;
    try {
      await adminDeleteTreatment(slug);
      toast.success("Deleted");
      await reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">Treatments</h1>
          <p className="text-ink/70 text-sm mt-1">Prices and active services on the booking page.</p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(emptyTreatment())}
          className="bg-peach hover:bg-[hsl(var(--peach-hover))] text-ink font-display tracking-widest px-4 py-2 text-sm"
        >
          New treatment
        </button>
      </header>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 text-sm">{error}</div>}

      <div className="border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-ink/70 text-left text-xs uppercase tracking-wider">
            <tr>
              <th className="px-3 py-2">Slug</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2 text-right">Price</th>
              <th className="px-3 py-2 text-right">Duration</th>
              <th className="px-3 py-2">Active</th>
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
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-ink/60">
                  No treatments yet.
                </td>
              </tr>
            ) : (
              rows.map((t) => (
                <tr key={t.slug} className="border-t border-border hover:bg-muted/20">
                  <td className="px-3 py-2 text-ink/70 text-xs font-mono">{t.slug}</td>
                  <td className="px-3 py-2 text-ink">{t.name}</td>
                  <td className="px-3 py-2 text-right text-ink">{(t.price_cents / 100).toFixed(2)} €</td>
                  <td className="px-3 py-2 text-right text-ink/80">{t.duration_minutes} min</td>
                  <td className="px-3 py-2">
                    <span
                      className={`text-[11px] uppercase tracking-wider px-2 py-0.5 ${
                        t.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {t.active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => setEditing({ ...t })}
                      className="text-xs px-2 py-1 border border-border hover:bg-muted mr-2"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void remove(t.slug)}
                      className="text-ink/60 hover:text-rose-600 p-1 align-middle"
                      title="Delete"
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

      {editing && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4"
          onClick={(e) => e.target === e.currentTarget && setEditing(null)}
        >
          <div className="bg-background border border-border w-full max-w-md p-5 space-y-4">
            <h2 className="font-display text-xl text-ink">
              {editing.isNew ? "New treatment" : `Edit ${editing.name || ""}`}
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Slug">
                <input
                  type="text"
                  value={editing.slug || ""}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  disabled={!editing.isNew}
                  className="bg-background border border-border px-2 py-1.5 text-sm w-full"
                  placeholder="signature-brows"
                />
              </Field>
              <Field label="Name">
                <input
                  type="text"
                  value={editing.name || ""}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="bg-background border border-border px-2 py-1.5 text-sm w-full"
                />
              </Field>
              <Field label="Price (cents)">
                <input
                  type="number"
                  min={0}
                  value={editing.price_cents ?? 0}
                  onChange={(e) => setEditing({ ...editing, price_cents: Number(e.target.value) })}
                  className="bg-background border border-border px-2 py-1.5 text-sm w-full"
                />
              </Field>
              <Field label="Duration (min)">
                <input
                  type="number"
                  min={1}
                  value={editing.duration_minutes ?? 60}
                  onChange={(e) => setEditing({ ...editing, duration_minutes: Number(e.target.value) })}
                  className="bg-background border border-border px-2 py-1.5 text-sm w-full"
                />
              </Field>
              <Field label="Sort order">
                <input
                  type="number"
                  value={editing.sort_order ?? 0}
                  onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })}
                  className="bg-background border border-border px-2 py-1.5 text-sm w-full"
                />
              </Field>
              <Field label="Active">
                <label className="flex items-center gap-2 text-sm pt-2">
                  <input
                    type="checkbox"
                    checked={editing.active !== false}
                    onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                  />
                  <span className="text-ink/80">Show on booking page</span>
                </label>
              </Field>
            </div>

            <Field label="Description">
              <textarea
                rows={3}
                value={editing.description || ""}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                className="bg-background border border-border px-2 py-1.5 text-sm w-full"
              />
            </Field>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-3 py-2 text-sm border border-border hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void save()}
                disabled={saving}
                className="bg-peach hover:bg-[hsl(var(--peach-hover))] text-ink font-display tracking-widest px-4 py-2 text-sm disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="block text-[10px] tracking-[0.2em] uppercase text-ink/60 mb-1">{label}</span>
    {children}
  </label>
);

export default AdminTreatments;
