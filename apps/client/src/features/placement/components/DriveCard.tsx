import type { PlacementDriveSummary, DriveStatus } from "../types/index.ts";

// Helpers
function abbr(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return name.slice(0, 3).toUpperCase();
  return words
    .slice(0, 3)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const statusCfg: Record<DriveStatus, { label: string; cls: string }> = {
  ACTIVE: { label: "OPEN", cls: "border-success text-success" },
  UPCOMING: { label: "UPCOMING", cls: "border-border2 text-text-muted" },
  CLOSED: { label: "CLOSED", cls: "border-primary/40 text-primary" },
};

// Component
interface DriveCardProps {
  drive: PlacementDriveSummary;
  onClick: (id: string) => void;
}

export function DriveCard({ drive, onClick }: DriveCardProps) {
  const cfg = statusCfg[drive.status] ?? statusCfg.UPCOMING;
  const isOpen = drive.status === "ACTIVE";

  return (
    <button
      type="button"
      onClick={() => onClick(drive.id)}
      className="card-hover text-left w-full cursor-pointer focus-visible:ring-1 focus-visible:ring-primary"
      aria-label={`View ${drive.company.name} — ${drive.role}`}
    >
      {/* Top row: company + badge */}
      <div className="flex items-start justify-between gap-3 p-5 pb-4">
        <div className="flex items-center gap-3">
          {/* Logo abbreviation */}
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm
                       text-[0.625rem] font-bold text-text-secondary"
            style={{
              background: "var(--color-surface2)",
              border: "1px solid var(--color-border2)",
            }}
          >
            {abbr(drive.company.name)}
          </div>

          <div>
            <p className="text-[0.9rem] font-bold text-text leading-tight">{drive.company.name}</p>
            <p className="text-[0.75rem] text-text-secondary mt-0.5">{drive.role}</p>
          </div>
        </div>

        {/* Status badge */}
        <span className={`tag-base shrink-0 mt-0.5 ${cfg.cls}`} style={{ borderWidth: "1px" }}>
          {cfg.label}
        </span>
      </div>

      {/* Divider */}
      <div className="border-t border-border mx-5" />

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 px-5 py-4">
        <div>
          <p className="text-[0.55rem] font-bold uppercase tracking-[0.18em] text-text-muted mb-1">
            Package
          </p>
          <p className={`text-base font-bold ${isOpen ? "text-primary" : "text-text-muted"}`}>
            {drive.minCTC ?? "—"}
            {drive.maxCTC && drive.maxCTC !== drive.minCTC ? ` – ${drive.maxCTC}` : ""}
          </p>
        </div>
        <div>
          <p className="text-[0.55rem] font-bold uppercase tracking-[0.18em] text-text-muted mb-1">
            Min CGPA
          </p>
          <p className="text-base font-bold text-text">{drive.minCGPA ?? "—"}</p>
        </div>
        <div>
          <p className="text-[0.55rem] font-bold uppercase tracking-[0.18em] text-text-muted mb-1">
            Deadline
          </p>
          <p className="text-base font-bold text-text">{formatDate(drive.driveDate)}</p>
        </div>
      </div>
    </button>
  );
}
