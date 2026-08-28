import { useState } from "react";
import { Building2, Trophy, TrendingUp, BarChart2 } from "lucide-react";
import { StatCard } from "../components/StatCard.tsx";
import { PlacementBarChart, SalaryBandChart } from "../components/PlacementCharts.tsx";
import { DriveCard } from "../components/DriveCard.tsx";
import { DriveDetailModal } from "../components/DriveDetailModal.tsx";
import { usePlacementStats, usePlacementDrives } from "../api/placements.ts";
import type { DriveSector } from "../types/index.ts";

// Filter config
const FILTERS: { label: string; value: DriveSector }[] = [
  { label: "All", value: "ALL" },
  { label: "Service", value: "SERVICE" },
  { label: "Product", value: "PRODUCT" },
  { label: "Intern+PPO", value: "INTERNPPO" },
];

// Page
export function PlacementPage() {
  const [sector, setSector] = useState<DriveSector>("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: stats, isLoading: statsLoading } = usePlacementStats();
  const { data: drives = [], isLoading: drivesLoading } = usePlacementDrives(sector);

  const season = stats
    ? `${new Date().getFullYear()}-${(new Date().getFullYear() + 1).toString().slice(2)} Season`
    : "Current Season";

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <p className="section-label mb-1">Career &amp; Placements</p>
        <h1 className="text-2xl font-bold text-text tracking-tight">Placement Portal</h1>
        <p className="mt-1 text-sm text-text-secondary">
          {season}
          {stats && ` — ${stats.eligibleCount} eligible students across batch`}
        </p>
      </div>

      <div className="flex gap-4 flex-wrap">
        <StatCard
          icon={<Building2 />}
          value={statsLoading ? "…" : (stats?.companiesCount ?? 0)}
          label="Companies Visiting"
          sublabel="This season"
          loading={statsLoading}
        />
        <StatCard
          icon={<Trophy />}
          value={statsLoading ? "…" : (stats?.offersCount ?? 0)}
          label="Offers Made"
          sublabel={stats ? `Out of ${stats.eligibleCount} eligible` : ""}
          loading={statsLoading}
        />
        <StatCard
          icon={<TrendingUp />}
          value={statsLoading ? "…" : (stats?.highestCTC ?? "—")}
          label="Highest CTC"
          sublabel={stats?.highestCTCSource ?? ""}
          loading={statsLoading}
        />
        <StatCard
          icon={<BarChart2 />}
          value={statsLoading ? "…" : (stats?.averageCTC ?? "—")}
          label="Average CTC"
          sublabel="Across all offers"
          loading={statsLoading}
        />
      </div>

      {stats && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2" style={{ height: "240px" }}>
          <PlacementBarChart data={stats.yearlyStats} />
          <SalaryBandChart data={stats.salaryBands} />
        </div>
      )}

      {!stats && !statsLoading && (
        <div className="card flex items-center justify-center h-40 text-text-muted text-sm">
          No historical stats available yet.
        </div>
      )}

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setSector(f.value)}
              className={[
                "px-3.5 py-1.5 text-[0.625rem] font-bold uppercase tracking-widest",
                "rounded-sm border transition-colors",
                sector === f.value
                  ? "bg-primary text-white border-primary"
                  : "text-text-muted border-border2 hover:border-text-muted hover:text-text-secondary",
              ].join(" ")}
            >
              {f.label}
            </button>
          ))}
        </div>

        <span className="text-[0.7rem] text-text-muted shrink-0">
          {drivesLoading
            ? "Loading…"
            : `${drives.length} compan${drives.length === 1 ? "y" : "ies"} shown`}
        </span>
      </div>

      {drivesLoading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card h-36 animate-pulse">
              <div className="p-5 flex gap-3">
                <div className="h-9 w-9 rounded-sm bg-surface2" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 rounded bg-surface2" />
                  <div className="h-3 w-20 rounded bg-surface2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!drivesLoading && drives.length === 0 && (
        <div className="card flex flex-col items-center justify-center py-16 gap-3">
          <Building2 size={28} className="text-text-muted" />
          <p className="text-sm text-text-muted">
            No drives found for <span className="font-bold">{sector}</span>.
          </p>
        </div>
      )}

      {!drivesLoading && drives.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {drives.map((drive) => (
            <DriveCard key={drive.id} drive={drive} onClick={(id) => setSelectedId(id)} />
          ))}
        </div>
      )}

      {selectedId && <DriveDetailModal driveId={selectedId} onClose={() => setSelectedId(null)} />}
    </div>
  );
}
