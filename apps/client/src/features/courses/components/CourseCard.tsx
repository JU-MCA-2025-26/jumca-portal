import type { CourseDto } from "@jumca/shared";

interface CourseCardProps {
  course: CourseDto;
}

export default function CourseCard({ course }: CourseCardProps) {
  const mapping = course.semesterMapping;
  const elective = course.elective;
  const isTheory = mapping?.type === "THEORY";

  return (
    <div className="card-hover p-5 flex flex-col justify-between h-full bg-surface border border-border rounded-lg shadow-xs transition-all hover:border-primary/40">
      <div>
        {/* Header Tags */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-surface2 text-primary border border-border2">
            {course.code}
          </span>
          <div className="flex items-center gap-1.5">
            {elective && (
              <span className="text-[0.625rem] font-bold tracking-wider uppercase px-2 py-0.5 rounded border border-warning/30 bg-warning/10 text-warning">
                {elective.basket.replace("_", " ")}
              </span>
            )}
            {mapping && (
              <span
                className={`text-[0.625rem] font-bold tracking-wider uppercase px-2 py-0.5 rounded border ${
                  isTheory
                    ? "border-info/30 bg-info/10 text-info"
                    : "border-success/30 bg-success/10 text-success"
                }`}
              >
                {mapping.type}
              </span>
            )}
          </div>
        </div>

        {/* Course Name */}
        <h3 className="text-base font-bold text-text leading-snug mb-3">{course.name}</h3>
      </div>

      {/* Course Stats / Details Footer */}
      {mapping && (
        <div className="mt-4 pt-3 border-t border-border/60 text-xs text-text-muted space-y-2">
          {/* Periods & Credits */}
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

          {/* Marks breakdown */}
          <div className="flex items-center justify-between text-[0.7rem] bg-bg/50 px-2.5 py-1.5 rounded border border-border/40">
            <span>
              Exam: <strong className="text-text">{mapping.examMarks}</strong>
            </span>
            <span>
              Sessional: <strong className="text-text">{mapping.sessionalMarks}</strong>
            </span>
            <span>
              Total: <strong className="text-text-secondary font-bold">{mapping.totalMarks}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
