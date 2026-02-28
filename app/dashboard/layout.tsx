import Link from "next/link";
import { LayoutDashboard, CalendarPlus2, CalendarClock, History, Bell, Settings, LogOut } from "lucide-react";

const sidebarItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Book Appointment", href: "/dashboard/book", icon: CalendarPlus2 },
  { label: "My Appointments", href: "/dashboard", icon: CalendarClock },
  { label: "History", href: "/dashboard", icon: History },
  { label: "Alerts", href: "/dashboard", icon: Bell },
  { label: "Settings", href: "/dashboard", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <h2 className="mb-5 text-xl font-bold text-primary-700">ReserveLink</h2>
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-primary-50 hover:text-primary-700"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/"
              className="mt-3 flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Link>
          </nav>
        </aside>

        <section>{children}</section>
      </div>
    </main>
  );
}
