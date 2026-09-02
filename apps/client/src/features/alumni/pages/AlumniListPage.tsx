// AlumniListPage.tsx
import { useMemo, useState } from "react";
import { useAlumniList, useGraduationYears } from "../api/alumni.ts"; // updated import
import AlumniCard from "../components/AlumniCard.tsx";
import YearFilterTabs from "../components/YearFilterTabs.tsx";
import AlumniSearchBar from "../components/AlumniSearchBar.tsx";
import type { AlumniListItem } from "@jumca/shared";
import PageHeader from "@/components/layout/PageHeader.tsx";

const PAGE_SIZE = 12;

export function AlumniListPage() {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data: yearsData } = useGraduationYears(); // get data from hook
  const years = yearsData?.data ?? [];

  const params = useMemo(
    () => ({
      search: search || undefined,
      year: selectedYear ?? undefined,
      page,
      limit: PAGE_SIZE,
    }),
    [search, selectedYear, page],
  );

  const { data: alumniData, isLoading, error } = useAlumniList(params);
  const items = alumniData?.data.data ?? [];
  const total = alumniData?.data.total ?? 0;

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <PageHeader
        heading="alumni network"
        title="our seniors"
        subheading="Connect with alumni for mentorship, referrals, and career guidance"
      />

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <YearFilterTabs
          years={years}
          selectedYear={selectedYear}
          onSelect={(year) => {
            setSelectedYear(year);
            setPage(1);
          }}
        />
        <AlumniSearchBar
          onSearch={(term) => {
            setSearch(term);
            setPage(1);
          }}
        />
      </div>

      {error && (
        <div className="card mt-6 p-4 text-sm text-danger">
          Couldn't load alumni: {error.message}
        </div>
      )}

      {!error && isLoading && items.length === 0 && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card h-72 animate-pulse bg-surface2" />
          ))}
        </div>
      )}

      {!isLoading && !error && items.length === 0 && (
        <div className="card mt-6 p-8 text-center text-sm text-text-muted">
          No alumni found{search ? ` for "${search}"` : ""}.
        </div>
      )}

      {items.length > 0 && (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((alumni: AlumniListItem) => (
              <AlumniCard key={alumni.id} alumni={alumni} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={isLoading || page <= 1}
                className="rounded border border-border2 px-3 py-1.5 text-xs font-bold text-text-secondary hover:text-text disabled:opacity-30"
              >
                Prev
              </button>
              <span className="text-xs text-text-muted tabular">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={isLoading || page >= totalPages}
                className="rounded border border-border2 px-3 py-1.5 text-xs font-bold text-text-secondary hover:text-text disabled:opacity-30"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
