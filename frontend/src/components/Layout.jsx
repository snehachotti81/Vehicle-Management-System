import { BarChart3, Car, Cog, Menu, ReceiptText, Wrench } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/components", label: "Components", icon: Cog },
  { to: "/vehicles", label: "Vehicles", icon: Car },
  { to: "/services", label: "Services", icon: Wrench },
];

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-panel">
      <header className="sticky top-0 z-20 border-b bg-white">
        <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
          <button
            className="rounded-md border p-2 lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
          <ReceiptText className="text-accent" />
          <div>
            <h1 className="text-lg font-semibold">Vehicle Service Management System</h1>
            <p className="text-xs text-slate-500">Workshop operations and revenue tracking</p>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside
          className={`fixed inset-y-16 left-0 z-10 w-64 border-r bg-white p-4 transition-transform lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] ${
            open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <nav className="space-y-2">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                    isActive ? "bg-accent text-white" : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="w-full p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
