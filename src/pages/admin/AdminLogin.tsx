import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { adminLogin, getStoredAdminToken } from "@/lib/admin-auth";

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo =
    typeof (location.state as { from?: string } | null)?.from === "string"
      ? ((location.state as { from?: string }).from as string)
      : "/admin";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (getStoredAdminToken()) {
      navigate(redirectTo, { replace: true });
    }
  }, [navigate, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await adminLogin(password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border border-border bg-muted/30 p-8 space-y-6"
      >
        <div>
          <p className="text-[10px] tracking-[0.25em] text-ink/60 uppercase">Queenlashes</p>
          <h1 className="font-display text-2xl text-ink mt-1">Admin sign in</h1>
          <p className="text-ink/70 text-sm mt-2">
            Enter the admin password to manage bookings, availability, and settings.
          </p>
        </div>

        <label className="block">
          <span className="text-xs text-ink/70">Password</span>
          <div className="mt-1 flex items-center gap-2 border border-border bg-background px-3 py-2 focus-within:border-peach">
            <Lock className="w-4 h-4 text-ink/50" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
              className="flex-1 bg-transparent outline-none text-sm text-ink"
              placeholder="••••••••"
            />
          </div>
        </label>

        {error && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 p-3" role="alert">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !password}
          className="w-full bg-peach hover:bg-[hsl(var(--peach-hover))] text-ink font-display tracking-widest px-8 py-3 transition-colors disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>

        <p className="text-[11px] text-ink/50 text-center">
          Set <code>ADMIN_PASSWORD</code> in <code>.env</code> on the server.
        </p>
      </form>
    </div>
  );
};

export default AdminLogin;
