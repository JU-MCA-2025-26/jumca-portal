interface YearFilterTabsProps {
  years: number[];
  selectedYear: number | null;
  onSelect: (year: number | null) => void;
}

export default function YearFilterTabs({ years, selectedYear, onSelect }: YearFilterTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`rounded px-3 py-1.5 text-xs font-bold tracking-wide transition-colors ${
          selectedYear === null
            ? "bg-primary text-text-inverse"
            : "border border-border2 bg-surface2 text-text-secondary hover:text-text"
        }`}
      >
        ALL
      </button>
      {years.map((year) => (
        <button
          key={year}
          type="button"
          onClick={() => onSelect(year)}
          className={`rounded px-3 py-1.5 text-xs font-bold tracking-wide transition-colors ${
            selectedYear === year
              ? "bg-primary text-text-inverse"
              : "border border-border2 bg-surface2 text-text-secondary hover:text-text"
          }`}
        >
          {year}
        </button>
      ))}
    </div>
  );
}
