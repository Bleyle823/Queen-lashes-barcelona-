import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, CalendarRange, CreditCard, Sparkles, Settings, LogOut, Calendar } from "lucide-react";
import { clearAdminToken } from "@/lib/admin-auth";

const navItems = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarRange },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
  { to: "/admin/availability", label: "Availability", icon: Calendar },
  { to: "/admin/treatments", label: "Treatments", icon: Sparkles },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    clearAdminToken();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-60 border-r border-border bg-muted/40 flex flex-col">
        <div className="px-5 py-5 border-b border-border">
          <p className="text-[10px] tracking-[0.25em] text-ink/60 uppercase">Queenlashes</p>
          <p className="font-display text-lg text-ink">Admin Console</p>
        </div>
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 text-sm rounded-sm transition-colors ${
                  isActive ? "bg-peach/20 text-ink" : "text-ink/70 hover:bg-muted hover:text-ink"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={handleSignOut}
          className="m-3 flex items-center gap-2 px-3 py-2 text-sm text-ink/70 hover:bg-muted hover:text-ink rounded-sm border border-border"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </aside>

      <main className="flex-1 overflow-x-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
