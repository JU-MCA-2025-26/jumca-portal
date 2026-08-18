import { Github, Linkedin, Globe, ExternalLink, User } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { LogoutButton } from "@/components/ui/LogoutButton.tsx";
import type { SemesterCourse, SocialLink } from "../types/index.ts";
import type { UserProfile } from "@/features/auth/types/index.ts";

// Placeholder courses (replace with API call when endpoint is ready)
const PLACEHOLDER_COURSES: SemesterCourse[] = [
  { code: "CS601", name: "Data Structures & Algorithms", credits: 4, grade: "A", attendance: 89 },
  { code: "CS602", name: "Operating Systems", credits: 3, grade: "A-", attendance: 82 },
  { code: "CS603", name: "Database Management Systems", credits: 3, grade: "A+", attendance: 95 },
  { code: "CS604", name: "Computer Networks", credits: 3, grade: "B+", attendance: 78 },
  { code: "CS605", name: "Machine Learning", credits: 4, grade: "A", attendance: 91 },
  { code: "CS606", name: "Software Engineering", credits: 3, grade: "A-", attendance: 85 },
];

// Helpers
function gradeColor(grade: string): string {
  if (["O", "A+", "A"].includes(grade)) return "text-success";
  if (["A-", "B+"].includes(grade)) return "text-warning";
  return "text-primary";
}

function attendanceFill(pct: number): string {
  if (pct >= 85) return "bg-success";
  if (pct >= 75) return "bg-warning";
  return "bg-primary";
}

function buildYear(batch: string | undefined): string {
  if (!batch) return "M.C.A.";

  const parts = batch.split("-");
  const batchStartYear = parseInt(parts[0], 10);
  let batchEndYear = parseInt(parts[1], 10);

  // If end year is 2 digits (e.g., "26"), convert it to 4 digits ("2026")
  if (batchEndYear < 100) {
    batchEndYear = Math.floor(batchStartYear / 100) * 100 + batchEndYear;
  }

  const currentYear = new Date().getFullYear();

  // If the current year is past the graduation year
  if (currentYear > batchEndYear) {
    return "Course Completed";
  }

  // Calculate year of study (e.g., 2025 start in 2025 calendar year = 1st Year)
  const yearsIn = currentYear - batchStartYear + 1;

  // Guard against displaying negative or zero years if accessed early
  if (yearsIn <= 0) return "1st Year";

  const ordinal = yearsIn === 1 ? "1st" : yearsIn === 2 ? "2nd" : `${yearsIn}th`;

  return `${ordinal} Year`;
}

// Social links builder
function buildSocialLinks(profile: UserProfile | null): SocialLink[] {
  if (!profile) return [];
  const links: SocialLink[] = [];

  if (profile.github)
    links.push({
      platform: "github",
      label: "GitHub",
      url: `https://github.com/${profile.github}`,
    });
  if (profile.linkedin)
    links.push({
      platform: "linkedin",
      label: "LinkedIn",
      url: profile.linkedin.startsWith("http")
        ? profile.linkedin
        : `https://linkedin.com/in/${profile.linkedin}`,
    });
  if (profile.leetcode)
    links.push({
      platform: "leetcode",
      label: "LeetCode",
      url: `https://leetcode.com/${profile.leetcode}`,
    });
  if (profile.gfg)
    links.push({
      platform: "gfg",
      label: "GFG",
      url: `https://auth.geeksforgeeks.org/user/${profile.gfg}`,
    });
  if (profile.codeforces)
    links.push({
      platform: "codeforces",
      label: "Codeforces",
      url: `https://codeforces.com/profile/${profile.codeforces}`,
    });
  if (profile.portfolio)
    links.push({ platform: "portfolio", label: "Portfolio", url: profile.portfolio });

  return links;
}

function platformIcon(platform: SocialLink["platform"]) {
  switch (platform) {
    case "github":
      return <Github size={13} />;
    case "linkedin":
      return <Linkedin size={13} />;
    case "portfolio":
      return <Globe size={13} />;
    default:
      return <ExternalLink size={13} />;
  }
}

// Sub-components
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-3 last:border-0">
      <span className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-text-muted">
        {label}
      </span>
      <span className="text-[0.8rem] font-bold text-text tabular">{value}</span>
    </div>
  );
}

function SocialLinkRow({ link }: { link: SocialLink }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between py-2.5 border-b border-border last:border-0
                 text-text-muted hover:text-primary transition-colors group"
    >
      <div className="flex items-center gap-2.5">
        <span className="text-primary opacity-70 group-hover:opacity-100 transition-opacity">
          {platformIcon(link.platform)}
        </span>
        <span className="text-[0.6rem] font-bold uppercase tracking-[0.15em]">{link.label}</span>
      </div>
      <ExternalLink size={11} className="opacity-0 group-hover:opacity-60 transition-opacity" />
    </a>
  );
}

function CoursesTable({ courses }: { courses: SemesterCourse[] }) {
  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border">
        <p className="uppercase">Current Semester Courses</p>
      </div>

      {/* Table */}
      <table className="portal-table">
        <thead>
          <tr>
            <th className="w-24">Code</th>
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
              <td>
                <span className="font-light text-primary text-[0.8rem]">{c.code}</span>
              </td>

              {/* Course name */}
              <td>
                <span className="text-text font-light text-[0.8rem]">{c.name}</span>
              </td>

              {/* Credits */}
              <td className="text-center">
                <span className="text-text-secondary text-[0.8rem]">{c.credits}</span>
              </td>

              {/* Grade */}
              <td className="text-center">
                <span className={`text-sm font-bold ${gradeColor(c.grade)}`}>{c.grade}</span>
              </td>

              {/* Attendance bar + percentage */}
              <td className="pr-5">
                <div className="flex items-center gap-3 justify-end">
                  <div className="progress-bar w-28">
                    <div
                      className={`progress-bar-fill ${attendanceFill(c.attendance)}`}
                      style={{ width: `${c.attendance}%` }}
                    />
                  </div>
                  <span
                    className={`text-[0.75rem] font-bold tabular w-8 text-right ${
                      c.attendance < 75 ? "text-primary" : "text-text-secondary"
                    }`}
                  >
                    {c.attendance}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Main page
export function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  const { fullName, rollNumber, email, role, batch, profile, isActive } = user;
  const year = buildYear(batch);
  const batchLabel = batch || "—";
  const socialLinks = buildSocialLinks(profile);
  const cgpa = "9.2"; // TODO: derive from grades API when available

  return (
    <div className="p-6 space-y-1">
      <p className="section-label mb-1">Student Profile</p>
      <h1 className="text-2xl font-bold text-text tracking-tight">{fullName}</h1>
      <p className="text-sm text-text-secondary mb-6">M.C.A.-I</p>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[320px_1fr]">
        <div className="flex flex-col gap-4">
          <div className="card overflow-hidden">
            {/* Cover gradient */}
            <div
              className="h-28 w-full"
              style={{
                background: "linear-gradient(135deg, #3D0D0D 0%, #1a0505 60%, #0A0A0A 100%)",
              }}
            />

            {/* Avatar */}
            <div className="flex justify-center -mt-10 mb-3">
              <div
                className="h-20 w-20 rounded-sm border-2 border-border2 bg-surface2
                            flex items-center justify-center overflow-hidden"
              >
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={32} className="text-text-muted" />
                )}
              </div>
            </div>

            {/* Identity */}
            <div className="px-5 pb-5 text-center">
              <h2 className="text-lg font-bold text-text">{fullName}</h2>
              <p className="mt-0.5 text-[0.75rem] text-text-muted">
                {rollNumber} · M.C.A. · {year}
              </p>

              {/* Status badges */}
              <div className="mt-3 flex items-center justify-center gap-2">
                {isActive && <span className="tag-base tag-success">Active</span>}
                <span className="tag-base tag-info">Eligible</span>
                <span
                  className={`tag-base ${
                    role === "ADMIN"
                      ? "tag-warning"
                      : role === "ALUMNI"
                        ? "tag-default"
                        : "tag-primary"
                  }`}
                >
                  {role}
                </span>
              </div>
            </div>

            {/* Info rows */}
            <div className="border-t border-border px-5 pb-2">
              <InfoRow label="Roll No" value={rollNumber} />
              <InfoRow label="CGPA" value={`${cgpa} / 10.0`} />
              <InfoRow label="Email" value={email} />
              <InfoRow label="Batch" value={batchLabel} />
              {profile?.phone && <InfoRow label="Phone" value={profile.phone} />}
              {profile?.currentCompany && (
                <InfoRow label="Company" value={profile.currentCompany} />
              )}
              {profile?.designation && <InfoRow label="Designation" value={profile.designation} />}
            </div>
          </div>

          {/* Social links card */}
          {socialLinks.length > 0 && (
            <div className="card px-5 py-2">
              <p className="section-label py-3 border-b border-border mb-1">Social &amp; Coding</p>
              {socialLinks.map((link) => (
                <SocialLinkRow key={link.platform} link={link} />
              ))}
            </div>
          )}

          {/* Bio card */}
          {profile?.bio && (
            <div className="card px-5 py-4">
              <p className="section-label mb-2">About</p>
              <p className="text-[0.8rem] text-text-secondary leading-relaxed">{profile.bio}</p>
            </div>
          )}

          {/* Logout */}
          <div className="flex justify-start pt-1">
            <LogoutButton />
          </div>
        </div>

        <div className="space-y-4">
          <CoursesTable courses={PLACEHOLDER_COURSES} />

          {/* Empty social links prompt */}
          {socialLinks.length === 0 && (
            <div className="card px-5 py-8 text-center">
              <p className="section-label mb-2">Social &amp; Coding Profiles</p>
              <p className="text-xs text-text-muted">
                No social handles added yet. Edit your profile to add GitHub, LeetCode, and more.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
