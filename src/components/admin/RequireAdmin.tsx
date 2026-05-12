import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getStoredAdminToken } from "@/lib/admin-auth";
import { adminGet } from "@/lib/admin-auth";

const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const stored = getStoredAdminToken();
  const tokenRef = stored?.token ?? "";
  const [verified, setVerified] = useState<"checking" | "ok" | "fail">(stored ? "checking" : "fail");

  useEffect(() => {
    if (!tokenRef) return;
    let cancelled = false;
    adminGet<{ ok: boolean }>("/api/admin/me")
      .then(() => {
        if (!cancelled) setVerified("ok");
      })
      .catch(() => {
        if (!cancelled) setVerified("fail");
      });
    return () => {
      cancelled = true;
    };
  }, [tokenRef]);

  if (!stored || verified === "fail") {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  if (verified === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center text-ink/70 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
          Verifying session…
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RequireAdmin;
