import { useLocation } from "react-router-dom";
import { Search, Bell } from "lucide-react";

function Topbar() {
  const { pathname } = useLocation();

  const crumbs = pathname
    .split("/")
    .filter(Boolean)
    .filter((segment) => segment !== "dashboard");

  const breadcrumb = ["JUMCA", "DASHBOARD", ...crumbs.map((c) => c.toUpperCase())];

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-6">
      <p className="text-[0.6875rem] font-bold tracking-[0.2em] text-text-muted">
        {breadcrumb.join(" / ")}
      </p>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search portal..."
            className="input-base w-64 py-2! pl-8 text-xs"
          />
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded border border-border2 text-text-secondary transition-colors hover:text-text"
        >
          <Bell size={15} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>
      </div>
    </header>
  );
}

export default Topbar;
