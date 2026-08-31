import type { YearStat, SalaryBand } from "../types/index.ts";

// Placement rate bar chart
interface BarChartProps {
  data: YearStat[];
}

export function PlacementBarChart({ data }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.placed), 1);
  const yTicks = [0, Math.round(max * 0.25), Math.round(max * 0.5), Math.round(max * 0.75), max];

  return (
    <div className="card p-4 sm:p-5 flex flex-col gap-3 sm:gap-4 flex-1">
      <p className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-text-muted">
        Placement Rate — {data[0]?.year ?? "—"} to {data.at(-1)?.year ?? "—"}
      </p>
      <div className="flex flex-1 min-h-0 gap-2 sm:gap-3">
        {/* Y-axis */}
        <div className="flex flex-col-reverse justify-between py-1 pr-1 sm:pr-2">
          {yTicks.map((t) => (
            <span
              key={t}
              className="text-[0.55rem] sm:text-[0.6rem] text-text-muted tabular leading-none"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Bars */}
        <div className="flex flex-1 min-h-0 gap-1.5 sm:gap-2 border-l border-b border-border pb-1 pl-1">
          {data.map((d) => {
            const pct = (d.placed / max) * 100;
            return (
              <div key={d.year} className="group flex flex-1 flex-col items-center gap-1">
                <div className="relative w-full flex-1 flex items-end">
                  {/* Hover tooltip */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-surface2 border border-border px-1.5 py-0.5 text-[0.6rem] font-bold text-text opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {d.placed} placed
                  </div>
                  <div
                    className="w-full rounded-t-sm transition-all duration-500"
                    style={{
                      height: `${pct}%`,
                      background: "var(--color-primary)",
                      minHeight: "3px",
                    }}
                  />
                </div>
                <span className="text-[0.55rem] sm:text-[0.6rem] font-bold text-text-muted">
                  <span className="hidden sm:inline">{d.year}</span>
                  <span className="sm:hidden">{String(d.year).slice(2)}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Salary distribution horizontal bars
interface HBarChartProps {
  data: SalaryBand[];
}

export function SalaryBandChart({ data }: HBarChartProps) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="card p-4 sm:p-5 flex flex-col gap-3 sm:gap-4 h-full">
      <p className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-text-muted">
        Salary Distribution (LPA)
      </p>

      <div className="flex flex-col justify-between flex-1 min-h-0 gap-2 sm:gap-3">
        {data.map((band) => {
          const pct = (band.count / max) * 100;
          return (
            <div key={band.label} className="flex items-center gap-2 sm:gap-3">
              {/* Label */}
              <span className="w-9 sm:w-12 shrink-0 text-right text-[0.6rem] sm:text-[0.7rem] text-text-muted font-bold">
                {band.label}
              </span>

              {/* Bar track */}
              <div className="relative flex-1 h-2.5 sm:h-3 bg-surface2 rounded-sm overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full rounded-sm transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    background: "var(--color-primary)",
                    minWidth: "4px",
                  }}
                />
              </div>

              {/* Count */}
              <span className="w-5 sm:w-6 shrink-0 text-[0.6rem] sm:text-[0.7rem] font-bold text-text-secondary tabular">
                {band.count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
