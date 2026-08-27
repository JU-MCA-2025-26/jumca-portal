import { NavLink, type NavLinkRenderProps } from "react-router-dom";
import { LayoutGrid, BookOpen, Briefcase, MessageSquare, Users, User, X } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";

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
  onClick,
}: {
  to: string;
  label: string;
  Icon: React.ElementType;
  end?: boolean;
  onClick?: () => void;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
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

interface SidebarProps {
  onClose?: () => void;
}

function Sidebar({ onClose }: SidebarProps) {
  const { user } = useAuth();

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
          aria-label="Close sidebar"
          onClick={onClose}
          className="text-text-muted transition-colors hover:text-text-secondary md:hidden"
        >
          <X size={18} />
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
            onClick={onClose}
          />
        ))}
      </nav>

      {/* Profile pinned to the bottom */}
      <div className="border-t border-border py-2">
        <NavRow to="/dashboard/profile" label="Profile" Icon={User} onClick={onClose} />
      </div>

      {/* User footer preview on mobile drawer bottom if user exists */}
      {user && (
        <div className="border-t border-border px-5 py-3.5 flex items-center gap-3 bg-surface">
          <div className="h-9 w-9 rounded bg-surface2 border border-border2 flex items-center justify-center overflow-hidden shrink-0">
            {user.profile?.avatarUrl ? (
              <img src={user.profile.avatarUrl} alt={user.fullName} className="h-full w-full object-cover" />
            ) : (
              <User size={16} className="text-text-muted" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-text truncate">{user.fullName}</p>
            <p className="text-[0.625rem] text-text-muted truncate">{user.rollNumber}</p>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
