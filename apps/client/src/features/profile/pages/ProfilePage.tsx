import { User, Trophy, Code2, Star, Award } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import type { SemesterCourse, SemesterSGPA } from "../types/index.ts";

// Placeholder courses matching design
const PLACEHOLDER_COURSES: SemesterCourse[] = [
  { code: "CS601", name: "Data Structures & Algorithms", credits: 4, grade: "A", attendance: 89 },
  { code: "CS602", name: "Operating Systems", credits: 3, grade: "A-", attendance: 82 },
  { code: "CS603", name: "Database Management Systems", credits: 3, grade: "A+", attendance: 95 },
  { code: "CS604", name: "Computer Networks", credits: 3, grade: "B+", attendance: 78 },
  { code: "CS605", name: "Machine Learning", credits: 4, grade: "A", attendance: 91 },
  { code: "CS606", name: "Software Engineering", credits: 3, grade: "A-", attendance: 85 },
];

const TECHNICAL_SKILLS = [
  "C++",
  "Python",
  "Java",
  "SQL",
  "React",
  "Node.js",
  "Git",
  "Linux",
  "DSA",
  "ML",
  "Docker",
];

const SEMESTER_SGPA: SemesterSGPA[] = [
  { sem: "Sem I", sgpa: 8.4 },
  { sem: "Sem II", sgpa: 8.9 },
  { sem: "Sem III", sgpa: 9.1 },
  { sem: "Sem IV", sgpa: 9.4 },
  { sem: "Sem V", sgpa: 9.3 },
];

const ACHIEVEMENTS = [
  {
    icon: Trophy,
    title: "Dept. Hackathon 2025 — 2nd Place",
    date: "Nov 2025",
  },
  {
    icon: Code2,
    title: "320+ problems on LeetCode",
    date: "Ongoing",
  },
  {
    icon: Star,
    title: "Technical Head — CSE Society",
    date: "2025-26",
  },
  {
    icon: Award,
    title: "Dean Merit List — Sem IV",
    date: "2024",
  },
];

// Helpers
const gradeColor = (grade: string): string => {
  if (["O", "A+", "A"].includes(grade)) return "text-success";
  if (grade === "A-") return "text-[#2dd4bf]";
  if (["B+", "B"].includes(grade)) return "text-warning";
  return "text-primary";
};

const attendanceFill = (pct: number): string => {
  if (pct >= 85) return "bg-[#10b981]";
  return "bg-warning";
};

const buildYear = (batch: string | undefined): string => {
  if (!batch) return "2nd Year";

  const parts = batch.split("-");
  const batchStartYear = parseInt(parts[0], 10);
  let batchEndYear = parseInt(parts[1], 10);

  if (batchEndYear < 100) {
    batchEndYear = Math.floor(batchStartYear / 100) * 100 + batchEndYear;
  }

  const currentYear = new Date().getFullYear();

  if (currentYear > batchEndYear) {
    return "Course Completed";
  }

  const yearsIn = currentYear - batchStartYear + 1;
  if (yearsIn <= 0) return "1st Year";

  const ordinal = yearsIn === 1 ? "1st" : yearsIn === 2 ? "2nd" : `${yearsIn}th`;
  return `${ordinal} Year`;
};

const InfoRow = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex items-center justify-between border-b border-border py-3 last:border-0">
      <span className="text-[0.625rem] font-bold uppercase tracking-[0.18em] text-text-muted">
        {label}
      </span>
      <span className="text-[0.8rem] font-medium text-text tabular font-mono">{value}</span>
    </div>
  );
};

const CoursesTable = ({ courses }: { courses: SemesterCourse[] }) => {
  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border">
        <p className="text-[0.6875rem] font-bold tracking-[0.18em] uppercase text-text">
          CURRENT SEMESTER COURSES
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="portal-table">
          <thead>
            <tr>
              <th className="w-24 pl-5">Code</th>
              <th>Course</th>
              <th className="w-16 text-center">Cr.</th>
              <th className="w-20 text-center">Grade</th>
              <th className="w-48 text-right pr-5">Attendance</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.code}>
                {/* Code */}
                <td className="pl-5">
                  <span className="font-mono text-primary text-[0.8rem] font-medium">{c.code}</span>
                </td>

                {/* Course name */}
                <td>
                  <span className="text-text font-normal text-[0.8rem]">{c.name}</span>
                </td>

                {/* Credits */}
                <td className="text-center">
                  <span className="text-text-secondary text-[0.8rem] font-mono tabular">
                    {c.credits}
                  </span>
                </td>

                {/* Grade */}
                <td className="text-center">
                  <span className={`text-[0.8rem] font-bold ${gradeColor(c.grade)}`}>
                    {c.grade}
                  </span>
                </td>

                {/* Attendance bar + percentage */}
                <td className="pr-5">
                  <div className="flex items-center gap-3 justify-end">
                    <div className="h-1 w-28 bg-surface3 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${attendanceFill(c.attendance)}`}
                        style={{ width: `${c.attendance}%` }}
                      />
                    </div>
                    <span className="text-[0.75rem] font-medium tabular w-8 text-right text-text-secondary font-mono">
                      {c.attendance}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SemesterSgpaCard = () => {
  return (
    <div className="card p-5">
      <p className="text-[0.6875rem] font-bold tracking-[0.18em] uppercase text-text-muted mb-5">
        SEMESTER SGPA
      </p>
      <div className="space-y-4">
        {SEMESTER_SGPA.map((item) => (
          <div key={item.sem} className="flex items-center gap-4">
            <span className="text-[0.75rem] text-text-secondary font-mono w-16 shrink-0">
              {item.sem}
            </span>
            <div className="flex-1 h-0.5 bg-surface3 relative overflow-hidden rounded-full">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${(item.sgpa / 10) * 100}%` }}
              />
            </div>
            <span className="text-[0.75rem] font-bold text-text tabular w-8 text-right shrink-0 font-mono">
              {item.sgpa.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AchievementsCard = () => {
  return (
    <div className="card p-5">
      <p className="text-[0.6875rem] font-bold tracking-[0.18em] uppercase text-text-muted mb-5">
        ACHIEVEMENTS
      </p>
      <div className="space-y-4">
        {ACHIEVEMENTS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-start gap-3.5">
              <Icon size={16} className="text-primary mt-0.5 shrink-0" strokeWidth={1.75} />
              <div className="min-w-0 flex-1">
                <p className="text-[0.8rem] font-medium text-text leading-tight">{item.title}</p>
                <p className="text-[0.7rem] text-text-muted mt-0.5">{item.date}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TechnicalSkillsCard = () => {
  return (
    <div className="card p-5">
      <p className="text-[0.6875rem] font-bold tracking-[0.18em] uppercase text-text-muted mb-4">
        TECHNICAL SKILLS
      </p>
      <div className="flex flex-wrap gap-2">
        {TECHNICAL_SKILLS.map((skill) => (
          <span
            key={skill}
            className="rounded-xs border border-border2 bg-surface2 px-2.5 py-1 text-[0.75rem] font-medium text-text-secondary transition-colors hover:text-text hover:border-border"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

const ProfileCard = ({
  fullName,
  rollNumber,
  year,
  cgpa,
  email,
  batch,
  avatarUrl,
}: {
  fullName: string;
  rollNumber: string;
  year: string;
  cgpa: string;
  email: string;
  batch: string;
  avatarUrl?: string | null;
}) => {
  return (
    <div className="card overflow-hidden">
      {/* Cover diagonal stripes */}
      <div
        className="h-28 w-full"
        style={{
          background:
            "repeating-linear-gradient(135deg, rgba(61, 13, 13, 0.95) 0px, rgba(61, 13, 13, 0.95) 1.5px, #120303 1.5px, #120303 8px)",
        }}
      />

      {/* Avatar */}
      <div className="flex justify-center -mt-10 mb-3">
        <div className="h-20 w-20 rounded-xs border-2 border-border2 bg-surface2 flex items-center justify-center overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt={fullName} className="h-full w-full object-cover" />
          ) : (
            <User size={32} className="text-text-muted" />
          )}
        </div>
      </div>

      {/* Identity */}
      <div className="px-5 pb-5 text-center">
        <h2 className="text-lg font-bold text-text">{fullName}</h2>
        <p className="mt-0.5 text-[0.75rem] text-text-muted font-mono">
          {rollNumber} · B.Tech CSE · {year}
        </p>

        {/* Status badges */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="tag-base tag-success text-[0.625rem] px-2.5 py-0.5 font-bold tracking-[0.15em]">
            ACTIVE
          </span>
          <span className="tag-base tag-info text-[0.625rem] px-2.5 py-0.5 font-bold tracking-[0.15em]">
            ELIGIBLE
          </span>
        </div>
      </div>

      {/* Info rows */}
      <div className="border-t border-border px-5 pb-2">
        <InfoRow label="ROLL NO" value={rollNumber} />
        <InfoRow label="CGPA" value={`${cgpa} / 10.0`} />
        <InfoRow label="EMAIL" value={email} />
        <InfoRow label="BATCH" value={batch} />
        <InfoRow label="SECTION" value="A" />
      </div>
    </div>
  );
};

export const ProfilePage = () => {
  const { user } = useAuth();

  const fullName = user?.fullName || "Aarav Shah";
  const rollNumber = user?.rollNumber || "CS21001";
  const email = user?.email || "aarav@cse.edu";
  const batch = user?.batch || "2021 - 2025";
  const year = user?.batch ? buildYear(user.batch) : "2nd Year";
  const avatarUrl = user?.profile?.avatarUrl;
  const cgpa = "9.2";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">{fullName}</h1>
        <p className="text-xs text-text-secondary mt-1">
          B.Tech Computer Science — {year}, Section A
        </p>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          <ProfileCard
            fullName={fullName}
            rollNumber={rollNumber}
            year={year}
            cgpa={cgpa}
            email={email}
            batch={batch}
            avatarUrl={avatarUrl}
          />
          <TechnicalSkillsCard />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          <CoursesTable courses={PLACEHOLDER_COURSES} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SemesterSgpaCard />
            <AchievementsCard />
          </div>
        </div>
      </div>
    </div>
  );
};
