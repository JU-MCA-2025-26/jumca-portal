import { NavLink, type NavLinkRenderProps } from "react-router-dom";
import { LayoutGrid, BookOpen, Briefcase, MessageSquare, Users, User, Menu } from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/dashboard/classes", label: "Classes", icon: BookOpen },
  { to: "/dashboard/placements", label: "Placements", icon: Briefcase },
  { to: "/dashboard/interviews", label: "Interviews", icon: MessageSquare },
  { to: "/dashboard/alumni", label: "Alumni", icon: Users },
];

function NavRow({
  to,
  label,
  Icon,
  end = false,
}: {
  to: string;
  label: string;
  Icon: React.ElementType;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }: NavLinkRenderProps) =>
        [
          "relative flex items-center gap-3 px-5 py-2.5 text-[0.6875rem] font-bold tracking-[0.15em] uppercase transition-colors",
          isActive
            ? "bg-[color-mix(in_srgb,var(--color-primary)_5%,transparent)] text-text"
            : "text-text-muted hover:text-text-secondary",
        ].join(" ")
      }
    >
      {({ isActive }: NavLinkRenderProps) => (
        <>
          {isActive && <span className="absolute left-0 top-0 h-full w-0.5 bg-primary" />}
          <Icon size={15} strokeWidth={1.5} color="#e53935" />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}

function Sidebar() {
  return (
    <aside className="flex h-full w-60 flex-col border-r border-border bg-bg">
      {/* Brand */}
      <div className="flex items-center justify-between border-b border-border px-5 py-5">
        <div>
          <p className="text-lg font-bold leading-none tracking-tight text-primary">JUMCA</p>
          <p className="mt-1.5 text-[0.5625rem] font-bold tracking-[0.2em] text-text-muted">
            PORTAL 2025-27
          </p>
        </div>
        <button
          type="button"
          aria-label="Toggle sidebar"
          className="text-text-muted transition-colors hover:text-text-secondary"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto py-4">
        {navItems.map((item) => (
          <NavRow
            key={item.to}
            to={item.to}
            label={item.label}
            Icon={item.icon}
            end={item.to === "/dashboard"}
          />
        ))}
      </nav>

      {/* Profile pinned to the bottom */}
      <div className="border-t border-border py-2">
        <NavRow to="/dashboard/profile" label="Profile" Icon={User} />
      </div>
    </aside>
  );
}

export default Sidebar;
