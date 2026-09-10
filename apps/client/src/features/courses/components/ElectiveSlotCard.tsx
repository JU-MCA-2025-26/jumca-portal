import { useEffect, useState } from "react";
import type { CourseDto, ElectiveGroupDto } from "@jumca/shared";
import { useSaveElective } from "../api/courses.ts";

interface ElectiveSlotCardProps {
  group: ElectiveGroupDto;
  selectedCourseFromDb?: CourseDto;
}

const BASKET_DISPLAY_NAMES: Record<string, string> = {
  ELECTIVE_I: "Elective - I",
  ELECTIVE_II: "Elective - II",
  ELECTIVE_III: "Elective - III",
};

export default function ElectiveSlotCard({ group, selectedCourseFromDb }: ElectiveSlotCardProps) {
  // Default to user selection from database or first course in the basket
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>(
    selectedCourseFromDb?.code ?? group.courses[0]?.code ?? ""
  );

  useEffect(() => {
    if (selectedCourseFromDb?.code) {
      setSelectedCourseCode(selectedCourseFromDb.code);
    }
  }, [selectedCourseFromDb?.code]);

  const saveElectiveMutation = useSaveElective();

  const selectedCourse =
    group.courses.find((c) => c.code === selectedCourseCode) || group.courses[0];
  const mapping = selectedCourse?.semesterMapping;

  const basketTitle =
    BASKET_DISPLAY_NAMES[group.basket] || group.basket.replace("_", " ");

  const handleSelectChange = (newCourseCode: string) => {
    setSelectedCourseCode(newCourseCode);

    // Perform HTTP POST server request to update/save the elective in the database
    saveElectiveMutation.mutate({
      courseCode: newCourseCode,
      basket: group.basket,
      semester: group.semester || "3",
    });
  };

  return (
    <div className="card-hover p-5 flex flex-col justify-between h-full bg-surface border-2 border-warning/40 rounded-lg shadow-xs transition-all hover:border-warning">
      <div>
        {/* Header Tags */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-surface2 text-primary border border-border2">
            {selectedCourse?.code || "ELECTIVE"}
          </span>
          <div className="flex items-center gap-1.5">
            {saveElectiveMutation.isPending && (
              <span className="text-[0.625rem] font-bold text-text-muted animate-pulse">
                Saving to DB...
              </span>
            )}
            <span className="text-[0.625rem] font-bold tracking-wider uppercase px-2 py-0.5 rounded border border-warning/30 bg-warning/10 text-warning">
              {basketTitle}
            </span>
          </div>
        </div>

        {/* Selected Course Title */}
        <h3 className="text-base font-bold text-text leading-snug mb-3">
          {selectedCourse?.name || basketTitle}
        </h3>

        {/* Elective Selector Dropdown */}
        <div className="mt-3 space-y-1">
          <label className="block text-[0.6875rem] font-bold uppercase tracking-wider text-text-muted">
            Select Elective Subject:
          </label>
          <select
            value={selectedCourseCode}
            onChange={(e) => handleSelectChange(e.target.value)}
            disabled={saveElectiveMutation.isPending}
            className="w-full text-xs font-medium bg-bg text-text border border-border rounded-md p-2 focus:outline-hidden focus:border-primary cursor-pointer transition-colors disabled:opacity-50"
          >
            {group.courses.map((course) => (
              <option key={course.code} value={course.code}>
                {course.code} — {course.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Course Stats / Details Footer */}
      {mapping && (
        <div className="mt-4 pt-3 border-t border-border/60 text-xs text-text-muted space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.7rem]">
              L-T-P:{" "}
              <strong className="text-text">
                {mapping.periodL}-{mapping.periodT}-{mapping.periodP}
              </strong>
            </span>
            <span className="font-semibold text-text-secondary">
              Credits: <span className="text-primary font-bold">{mapping.creditPoints}</span>
            </span>
          </div>

          <div className="flex items-center justify-between text-[0.7rem] bg-bg/50 px-2.5 py-1.5 rounded border border-border/40">
            <span>
              Exam: <strong className="text-text">{mapping.examMarks}</strong>
            </span>
            <span>
              Sessional: <strong className="text-text">{mapping.sessionalMarks}</strong>
            </span>
            <span>
              Total:{" "}
              <strong className="text-text-secondary font-bold">{mapping.totalMarks}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
