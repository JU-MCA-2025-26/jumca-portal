import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader.tsx";
import { useCourses, useElectives } from "../api/courses.ts";
import CourseCard from "../components/CourseCard.tsx";
import ElectiveSlotCard from "../components/ElectiveSlotCard.tsx";
import type { SemesterTermType, CourseTypeCategory } from "@jumca/shared";
import { BookOpen, Layers, Filter, RefreshCw } from "lucide-react";

const SEMESTER_TABS: { id: SemesterTermType; label: string; year: string }[] = [
  { id: "BRIDGE", label: "Bridge Courses", year: "Preparatory" },
  { id: "SEM_1", label: "Semester 1", year: "1st Year" },
  { id: "SEM_2", label: "Semester 2", year: "1st Year" },
  { id: "SEM_3", label: "Semester 3", year: "2nd Year" },
  { id: "SEM_4", label: "Semester 4", year: "2nd Year" },
];

export default function CoursesPage() {
  const [activeSemester, setActiveSemester] = useState<SemesterTermType>("SEM_3");
  const [filterType, setFilterType] = useState<"ALL" | CourseTypeCategory | "ELECTIVE">("ALL");

  // Fetch courses from database using React Query as per semester (excluding electives from main course list)
  const coursesQuery = useCourses({
    semester: activeSemester,
    type: filterType === "ALL" || filterType === "ELECTIVE" ? undefined : filterType,
    isElective: filterType === "ELECTIVE" ? "true" : "false",
  });

  // Fetch electives grouped by basket accordingly using React Query
  const electivesQuery = useElectives({
    semester: activeSemester,
  });

  const isLoading = coursesQuery.isLoading || electivesQuery.isLoading;
  const isError = coursesQuery.isError || electivesQuery.isError;

  const courses = coursesQuery.data?.data ?? [];
  const electiveGroups = electivesQuery.data?.data ?? [];

  // Group regular non-elective courses into Theory and Sessional
  const coreTheoryCourses = courses.filter(
    (c) => c.semesterMapping?.type === "THEORY" && !c.elective,
  );
  const sessionalCourses = courses.filter(
    (c) => c.semesterMapping?.type === "SESSIONAL" && !c.elective,
  );

  const currentTab = SEMESTER_TABS.find((t) => t.id === activeSemester);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <PageHeader
        heading="Academics"
        title="Courses & Curriculum"
        subheading="Explore core theory subjects, lab sessionals, and elective slots per semester."
      />

      {/* Semester Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-border pb-2 no-scrollbar">
        {SEMESTER_TABS.map((tab) => {
          const isActive = activeSemester === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSemester(tab.id)}
              className={`flex flex-col items-start px-4 py-2.5 rounded-lg border text-left font-medium transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-primary/10 border-primary text-primary font-bold shadow-xs"
                  : "bg-surface border-border text-text-muted hover:text-text hover:border-border2"
              }`}
            >
              <span className="text-xs tracking-wider uppercase opacity-80">{tab.year}</span>
              <span className="text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Controls Bar: Filters & Refresh */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-surface p-4 rounded-lg border border-border">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Filter:
          </span>
          <div className="flex flex-wrap gap-1.5 ml-2">
            {[
              { id: "ALL", label: "Full Curriculum" },
              { id: "THEORY", label: "Core Theory" },
              { id: "SESSIONAL", label: "Sessional / Lab" },
              { id: "ELECTIVE", label: "Electives" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id as typeof filterType)}
                className={`text-xs px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  filterType === f.id
                    ? "bg-primary text-white font-semibold"
                    : "bg-surface2 text-text-secondary hover:text-text"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            coursesQuery.refetch();
            electivesQuery.refetch();
          }}
          disabled={isLoading}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition-colors cursor-pointer"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-48 rounded-xl bg-surface2/60 animate-pulse border border-border"
            />
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="p-6 rounded-lg bg-error/10 border border-error/30 text-center space-y-3">
          <p className="text-sm font-semibold text-error">
            Failed to load courses from the database. Please try again.
          </p>
          <button
            onClick={() => {
              coursesQuery.refetch();
              electivesQuery.refetch();
            }}
            className="px-4 py-2 text-xs font-bold bg-error text-white rounded shadow-xs hover:bg-error/90 cursor-pointer"
          >
            Retry Fetching
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {!isLoading && !isError && (
        <div className="space-y-10">
          {/* Core Theory & Elective Courses Section */}
          {(filterType === "ALL" || filterType === "THEORY" || filterType === "ELECTIVE") && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <div className="flex items-center gap-2 text-text font-bold text-lg">
                  <BookOpen size={20} className="text-info" />
                  <h2>Theory & Elective Courses ({currentTab?.label})</h2>
                </div>
                {electiveGroups.length > 0 && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-warning/15 text-warning border border-warning/30">
                    {electiveGroups.length} Electives
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* 1. Core Theory Subjects */}
                {filterType !== "ELECTIVE" &&
                  coreTheoryCourses.map((course) => (
                    <CourseCard key={course.code} course={course} />
                  ))}

                {/* 2. Elective Slots placed in their respective slot & basket */}
                {filterType !== "THEORY" &&
                  electiveGroups.map((group) => (
                    <ElectiveSlotCard
                      key={group.basket}
                      group={group}
                      selectedCourseFromDb={electivesQuery.data?.userSelections?.[group.basket]}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Sessional & Practical Labs Section */}
          {(filterType === "ALL" || filterType === "SESSIONAL") && sessionalCourses.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-text font-bold text-lg border-b border-border pb-2">
                <Layers size={20} className="text-success" />
                <h2>Sessional & Practical Labs</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {sessionalCourses.map((course) => (
                  <CourseCard key={course.code} course={course} />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {coreTheoryCourses.length === 0 &&
            electiveGroups.length === 0 &&
            sessionalCourses.length === 0 && (
              <div className="p-12 text-center bg-surface border border-border rounded-lg">
                <p className="text-text-muted text-sm font-medium">
                  No subjects or electives found for the selected semester and filter criteria.
                </p>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
