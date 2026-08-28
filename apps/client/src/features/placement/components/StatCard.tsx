import type { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  value: string | number;
  label: string;
  sublabel: string;
  loading?: boolean;
}

export function StatCard({ icon, value, label, sublabel, loading }: StatCardProps) {
  return (
    <div
      className="card relative flex-1 min-w-0 p-5"
      style={{ borderTop: "2px solid var(--color-primary)" }}
    >
      {/* Icon */}
      <div
        className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-sm"
        style={{ background: "color-mix(in srgb, var(--color-primary) 12%, transparent)" }}
      >
        <span className="text-primary [&>svg]:size-4">{icon}</span>
      </div>

      {/* Value */}
      {loading ? (
        <div className="mb-2 h-8 w-24 animate-pulse rounded bg-surface2" />
      ) : (
        <p className="stat-value mb-1">{value}</p>
      )}

      {/* Labels */}
      <p className="text-[0.625rem] font-bold uppercase tracking-[0.18em] text-text-muted">
        {label}
      </p>
      <p className="mt-0.5 text-[0.75rem] text-text-secondary">{sublabel}</p>
    </div>
  );
}
