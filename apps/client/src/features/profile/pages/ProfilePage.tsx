import { useState } from "react";
import {
  User,
  Trophy,
  Code2,
  Star,
  Award,
  Pencil,
  Github,
  Linkedin,
  Globe,
  Shield,
  X,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import EditProfileModal from "../components/EditProfileModal.tsx";
import { useUpdateProfile } from "../api/profile.ts";
import type { SemesterCourse, SemesterSGPA, Achievement } from "../types/index.ts";

// Placeholder courses matching design
const PLACEHOLDER_COURSES: SemesterCourse[] = [
  { code: "CSE/MCA/T/211A", name: "Software Engineering", credits: 4, grade: "A", attendance: 89 },
  {
    code: "CSE/MCA/T/212A",
    name: "Automata and Language Processors",
    credits: 3,
    grade: "A-",
    attendance: 82,
  },
  {
    code: "CSE/MCA/T/213A",
    name: "Data Communication & Networks",
    credits: 3,
    grade: "A+",
    attendance: 95,
  },
  {
    code: "CSE/MCA/T/214B",
    name: "Machine Learning (Elective I)",
    credits: 3,
    grade: "B+",
    attendance: 78,
  },
  {
    code: "CSE/MCA/T/215D",
    name: "Web Technologies (Elective II)",
    credits: 4,
    grade: "A",
    attendance: 91,
  },
  {
    code: "CSE/MCA/T/216E",
    name: "Natural Language Processing (Elective III)",
    credits: 3,
    grade: "A-",
    attendance: 85,
  },
];

const DEFAULT_TECHNICAL_SKILLS = [
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

const DEFAULT_SEMESTER_SGPA: SemesterSGPA[] = [
  { sem: "Sem I", sgpa: 8.4 },
  { sem: "Sem II", sgpa: 8.9 },
  { sem: "Sem III", sgpa: 9.1 },
  { sem: "Sem IV", sgpa: 9.4 },
];

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    icon: "Trophy",
    title: "Dept. Hackathon 2025 — 2nd Place",
    date: "Nov 2025",
  },
  {
    icon: "Code2",
    title: "320+ problems on LeetCode",
    date: "Ongoing",
  },
  {
    icon: "Star",
    title: "Technical Head — MCA Society",
    date: "2025-26",
  },
  {
    icon: "Award",
    title: "Dean Merit List — Sem II",
    date: "2025",
  },
];

const ICON_MAP: Record<string, React.ElementType> = {
  Trophy,
  Code2,
  Star,
  Award,
  Globe,
  Shield,
};
const ICON_OPTIONS = ["Trophy", "Code2", "Star", "Award", "Globe", "Shield"];

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

// Generic Edit Modal Dialog wrapper
function EditModal({
  title,
  onClose,
  onSave,
  isPending = false,
  children,
}: {
  title: string;
  onClose: () => void;
  onSave: () => void;
  isPending?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative card border border-border w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <span className="text-[0.75rem] uppercase tracking-widest font-bold text-text font-mono">
              {title}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text transition-colors p-1"
          >
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-5 space-y-4">{children}</div>
        <div className="flex gap-2 px-5 py-4 border-t border-border shrink-0">
          <button
            onClick={onSave}
            disabled={isPending}
            className="flex-1 py-2.5 bg-primary text-text-inverse text-[0.75rem] font-bold uppercase tracking-wider rounded hover:bg-primary-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending && <Loader2 size={14} className="animate-spin" />}
            {isPending ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-border2 text-[0.75rem] font-bold uppercase tracking-wider text-text-muted hover:text-text hover:border-border transition-colors rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

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
              <th className="w-28 pl-5">Code</th>
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

const SemesterSgpaCard = ({ semData, onEdit }: { semData: SemesterSGPA[]; onEdit: () => void }) => {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-5">
        <p className="text-[0.6875rem] font-bold tracking-[0.18em] uppercase text-text-muted">
          SEMESTER SGPA
        </p>
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1 text-[0.7rem] font-medium text-text-muted hover:text-primary transition-colors"
          title="Edit SGPA"
        >
          <Pencil size={12} />
          <span>Edit</span>
        </button>
      </div>
      <div className="space-y-4">
        {semData.map((item) => (
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

const AchievementsCard = ({
  achievements,
  onEdit,
}: {
  achievements: Achievement[];
  onEdit: () => void;
}) => {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-5">
        <p className="text-[0.6875rem] font-bold tracking-[0.18em] uppercase text-text-muted">
          ACHIEVEMENTS
        </p>
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1 text-[0.7rem] font-medium text-text-muted hover:text-primary transition-colors"
          title="Edit Achievements"
        >
          <Pencil size={12} />
          <span>Edit</span>
        </button>
      </div>
      <div className="space-y-4">
        {achievements.map((item, idx) => {
          const Icon = (item.icon && ICON_MAP[item.icon]) || Trophy;
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
        {achievements.length === 0 && (
          <p className="text-xs text-text-muted italic">No achievements added yet.</p>
        )}
      </div>
    </div>
  );
};

const TechnicalSkillsCard = ({ skills, onEdit }: { skills: string[]; onEdit: () => void }) => {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[0.6875rem] font-bold tracking-[0.18em] uppercase text-text-muted">
          TECHNICAL SKILLS
        </p>
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1 text-[0.7rem] font-medium text-text-muted hover:text-primary transition-colors"
          title="Edit Technical Skills"
        >
          <Pencil size={12} />
          <span>Edit</span>
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
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
  bio,
  github,
  linkedinUrl,
  leetcode,
  codeforces,
  gfg,
  onEditClick,
  onImageEditClick,
}: {
  fullName: string;
  rollNumber: string;
  year: string;
  cgpa: string;
  email: string;
  batch: string;
  avatarUrl?: string | null;
  bio?: string | null;
  github?: string | null;
  linkedinUrl?: string | null;
  leetcode?: string | null;
  codeforces?: string | null;
  gfg?: string | null;
  onEditClick: () => void;
  onImageEditClick: () => void;
}) => {
  return (
    <div className="card overflow-hidden relative">
      {/* Cover diagonal stripes */}
      <div
        className="h-28 w-full relative"
        style={{
          background:
            "repeating-linear-gradient(135deg, rgba(61, 13, 13, 0.95) 0px, rgba(61, 13, 13, 0.95) 1.5px, #120303 1.5px, #120303 8px)",
        }}
      >
        <button
          type="button"
          onClick={onEditClick}
          className="absolute right-3 top-3 rounded-full bg-surface2/90 border border-border2 p-1.5 text-xs text-text-secondary hover:text-text hover:bg-surface3 transition-colors flex items-center gap-1 px-2.5"
          title="Edit Profile"
        >
          <Pencil size={13} />
          <span className="font-semibold text-[0.7rem]">Edit</span>
        </button>
      </div>

      {/* Avatar with hover overlay trigger */}
      <div className="flex justify-center -mt-10 mb-3">
        <div className="relative group h-20 w-20 rounded-xs border-2 border-border2 bg-surface2 flex items-center justify-center overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt={fullName} className="h-full w-full object-cover" />
          ) : (
            <User size={32} className="text-text-muted" />
          )}
          <button
            type="button"
            onClick={onImageEditClick}
            className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Edit Photo"
          >
            <Pencil size={16} className="text-white" />
          </button>
        </div>
      </div>

      {/* Identity */}
      <div className="px-5 pb-4 text-center">
        <h2 className="text-lg font-bold text-text">{fullName}</h2>
        <p className="mt-0.5 text-[0.75rem] text-text-muted font-mono">
          {rollNumber} · MCA · {year}
        </p>

        {bio && (
          <p className="mt-2 text-xs text-text-secondary italic line-clamp-2 px-2">"{bio}"</p>
        )}

        {/* Status badges */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="tag-base tag-success text-[0.625rem] px-2.5 py-0.5 font-bold tracking-[0.15em]">
            ACTIVE
          </span>
          <span className="tag-base tag-info text-[0.625rem] px-2.5 py-0.5 font-bold tracking-[0.15em]">
            ELIGIBLE
          </span>
        </div>

        {/* Social / Profile Links */}
        <div className="mt-4 flex items-center justify-center gap-2.5 pt-3 border-t border-border/50">
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noreferrer"
              className="text-text-muted hover:text-primary transition-colors p-1"
              title="GitHub Profile"
            >
              <Github size={16} />
            </a>
          )}
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="text-text-muted hover:text-primary transition-colors p-1"
              title="LinkedIn Profile"
            >
              <Linkedin size={16} />
            </a>
          )}
          {leetcode && (
            <a
              href={leetcode.startsWith("http") ? leetcode : `https://leetcode.com/${leetcode}`}
              target="_blank"
              rel="noreferrer"
              className="text-text-muted hover:text-primary transition-colors text-xs font-bold font-mono px-1.5 py-0.5 rounded border border-border2"
              title="LeetCode Profile"
            >
              LC
            </a>
          )}
          {codeforces && (
            <a
              href={
                codeforces.startsWith("http")
                  ? codeforces
                  : `https://codeforces.com/profile/${codeforces}`
              }
              target="_blank"
              rel="noreferrer"
              className="text-text-muted hover:text-primary transition-colors text-xs font-bold font-mono px-1.5 py-0.5 rounded border border-border2"
              title="Codeforces Profile"
            >
              CF
            </a>
          )}
          {gfg && (
            <a
              href={gfg.startsWith("http") ? gfg : `https://geeksforgeeks.org/user/${gfg}`}
              target="_blank"
              rel="noreferrer"
              className="text-text-muted hover:text-primary transition-colors text-xs font-bold font-mono px-1.5 py-0.5 rounded border border-border2"
              title="GeeksforGeeks Profile"
            >
              GFG
            </a>
          )}
        </div>
      </div>

      {/* Info rows */}
      <div className="border-t border-border px-5 pb-2">
        <InfoRow label="ROLL NO" value={rollNumber} />
        <InfoRow label="CGPA" value={`${cgpa} / 10.0`} />
        <InfoRow label="EMAIL" value={email} />
        <InfoRow label="BATCH" value={batch} />
        <InfoRow label="PROGRAM" value={`Master of Computer Applications`} />
      </div>
    </div>
  );
};

export const ProfilePage = () => {
  const { user } = useAuth();
  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useUpdateProfile();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  type ModalType = "image" | "skills" | "sgpa" | "achievements" | null;
  const [activeSubModal, setActiveSubModal] = useState<ModalType>(null);

  // Profile data
  const fullName = user?.fullName || "Student Account";
  const rollNumber = user?.rollNumber || "002510503001";
  const email = user?.email || "student@jumca.com";
  const batch = user?.batch || "2025-27";
  const year = user?.batch ? buildYear(user.batch) : "2nd Year";
  const avatarUrl = user?.profile?.avatarUrl;
  const bio = user?.profile?.bio;
  const github = user?.profile?.github;
  const linkedinUrl = user?.profile?.linkedinUrl;
  const leetcode = user?.profile?.leetcode;
  const codeforces = user?.profile?.codeforces;
  const gfg = user?.profile?.gfg;

  const skills =
    user?.profile?.tags && user.profile.tags.length > 0
      ? user.profile.tags
      : DEFAULT_TECHNICAL_SKILLS;

  // Local state for interactive cards (SGPA & Achievements)
  const [semData, setSemData] = useState<SemesterSGPA[]>(DEFAULT_SEMESTER_SGPA);
  const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);

  // Temporary state for sub-modals
  const [tempImg, setTempImg] = useState("");
  const [tempSkills, setTempSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [tempSem, setTempSem] = useState<SemesterSGPA[]>([]);
  const [tempAch, setTempAch] = useState<Achievement[]>([]);

  const openSubModal = (type: NonNullable<ModalType>) => {
    if (type === "image") setTempImg(avatarUrl || "");
    if (type === "skills") {
      setTempSkills([...skills]);
      setNewSkillInput("");
    }
    if (type === "sgpa") setTempSem(semData.map((s) => ({ ...s })));
    if (type === "achievements") setTempAch(achievements.map((a) => ({ ...a })));
    setActiveSubModal(type);
  };

  const handleSaveSubModal = async () => {
    if (activeSubModal === "image") {
      await updateProfile({ avatarUrl: tempImg.trim() || undefined });
    } else if (activeSubModal === "skills") {
      await updateProfile({ tags: tempSkills });
    } else if (activeSubModal === "sgpa") {
      setSemData([...tempSem]);
    } else if (activeSubModal === "achievements") {
      setAchievements([...tempAch]);
    }
    setActiveSubModal(null);
  };

  const cgpa = "9.2";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">{fullName}</h1>
          <p className="text-xs text-text-secondary mt-1">
            Master of Computer Applications — {year}, Batch {batch}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsEditModalOpen(true)}
          className="rounded bg-surface2 border border-border2 px-3.5 py-2 text-xs font-bold text-text hover:bg-surface3 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Pencil size={14} className="text-primary" />
          Edit Profile
        </button>
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
            bio={bio}
            github={github}
            linkedinUrl={linkedinUrl}
            leetcode={leetcode}
            codeforces={codeforces}
            gfg={gfg}
            onEditClick={() => setIsEditModalOpen(true)}
            onImageEditClick={() => openSubModal("image")}
          />
          <TechnicalSkillsCard skills={skills} onEdit={() => openSubModal("skills")} />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          <CoursesTable courses={PLACEHOLDER_COURSES} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SemesterSgpaCard semData={semData} onEdit={() => openSubModal("sgpa")} />
            <AchievementsCard
              achievements={achievements}
              onEdit={() => openSubModal("achievements")}
            />
          </div>
        </div>
      </div>

      {/* ── IMAGE EDIT MODAL ── */}
      {activeSubModal === "image" && (
        <EditModal
          title="Edit Profile Photo"
          onClose={() => setActiveSubModal(null)}
          onSave={handleSaveSubModal}
          isPending={isUpdatingProfile}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="h-24 w-24 rounded-xs border-2 border-border2 bg-surface2 overflow-hidden flex items-center justify-center">
                {tempImg ? (
                  <img
                    src={tempImg}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "";
                    }}
                  />
                ) : (
                  <User size={40} className="text-text-muted" />
                )}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Avatar Image URL
              </label>
              <input
                type="url"
                value={tempImg}
                onChange={(e) => setTempImg(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="input-base font-mono text-xs"
              />
              <p className="text-[0.7rem] text-text-muted mt-1.5 font-mono">
                Paste any direct image URL. Preview updates on save.
              </p>
            </div>
          </div>
        </EditModal>
      )}

      {/* ── SKILLS EDIT MODAL ── */}
      {activeSubModal === "skills" && (
        <EditModal
          title="Edit Technical Skills"
          onClose={() => setActiveSubModal(null)}
          onSave={handleSaveSubModal}
          isPending={isUpdatingProfile}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-2">
                Current Skills
              </label>
              <div className="flex flex-wrap gap-2 min-h-10 p-2 rounded border border-border2 bg-surface1">
                {tempSkills.map((s, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-xs border border-border2 bg-surface2 px-2.5 py-1 text-xs font-medium text-text-secondary"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => setTempSkills((prev) => prev.filter((_, idx) => idx !== i))}
                      className="text-text-muted hover:text-danger transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {tempSkills.length === 0 && (
                  <p className="text-xs text-text-muted italic">No skills added yet.</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Add New Skill
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newSkillInput.trim()) {
                      e.preventDefault();
                      setTempSkills((prev) => [...prev, newSkillInput.trim()]);
                      setNewSkillInput("");
                    }
                  }}
                  placeholder="e.g. TypeScript, GraphQL"
                  className="input-base flex-1"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newSkillInput.trim()) {
                      setTempSkills((prev) => [...prev, newSkillInput.trim()]);
                      setNewSkillInput("");
                    }
                  }}
                  className="px-3.5 py-1.5 rounded bg-surface2 border border-border2 text-xs font-bold text-text hover:bg-surface3 flex items-center gap-1 shrink-0"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
              <p className="text-[0.7rem] text-text-muted mt-1.5 font-mono">
                Press Enter or click Add to append a skill.
              </p>
            </div>
          </div>
        </EditModal>
      )}

      {/* ── SGPA EDIT MODAL ── */}
      {activeSubModal === "sgpa" && (
        <EditModal
          title="Edit Semester SGPA"
          onClose={() => setActiveSubModal(null)}
          onSave={handleSaveSubModal}
        >
          <div className="space-y-3">
            {tempSem.map((s, i) => (
              <div key={s.sem} className="flex items-center gap-3">
                <span className="text-xs font-mono text-text-secondary w-16 shrink-0">{s.sem}</span>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={s.sgpa}
                  onChange={(e) =>
                    setTempSem((prev) =>
                      prev.map((item, idx) =>
                        idx === i ? { ...item, sgpa: parseFloat(e.target.value) } : item,
                      ),
                    )
                  }
                  className="flex-1 accent-primary cursor-pointer"
                />
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={s.sgpa}
                  onChange={(e) => {
                    const v = Math.min(10, Math.max(0, parseFloat(e.target.value) || 0));
                    setTempSem((prev) =>
                      prev.map((item, idx) => (idx === i ? { ...item, sgpa: v } : item)),
                    );
                  }}
                  className="w-16 input-base text-center text-xs font-mono py-1 px-1"
                />
              </div>
            ))}
          </div>
        </EditModal>
      )}

      {/* ── ACHIEVEMENTS EDIT MODAL ── */}
      {activeSubModal === "achievements" && (
        <EditModal
          title="Edit Achievements"
          onClose={() => setActiveSubModal(null)}
          onSave={handleSaveSubModal}
        >
          <div className="space-y-4">
            {tempAch.map((a, i) => (
              <div
                key={i}
                className="border border-border2 rounded p-3 space-y-2.5 relative bg-surface1"
              >
                <button
                  type="button"
                  onClick={() => setTempAch((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-2 right-2 text-text-muted hover:text-danger transition-colors p-1"
                  title="Delete Achievement"
                >
                  <Trash2 size={14} />
                </button>

                {/* Icon options */}
                <div className="flex items-center gap-1.5 flex-wrap pr-6">
                  {ICON_OPTIONS.map((opt) => {
                    const Ic = ICON_MAP[opt];
                    const isSelected = a.icon === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() =>
                          setTempAch((prev) =>
                            prev.map((item, idx) => (idx === i ? { ...item, icon: opt } : item)),
                          )
                        }
                        className={`p-1.5 rounded border transition-colors ${
                          isSelected
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border2 text-text-muted hover:text-text hover:border-border"
                        }`}
                        title={opt}
                      >
                        <Ic size={14} />
                      </button>
                    );
                  })}
                </div>

                <input
                  type="text"
                  value={a.title}
                  onChange={(e) =>
                    setTempAch((prev) =>
                      prev.map((item, idx) =>
                        idx === i ? { ...item, title: e.target.value } : item,
                      ),
                    )
                  }
                  placeholder="Achievement title or description"
                  className="input-base text-xs"
                />

                <input
                  type="text"
                  value={a.date}
                  onChange={(e) =>
                    setTempAch((prev) =>
                      prev.map((item, idx) =>
                        idx === i ? { ...item, date: e.target.value } : item,
                      ),
                    )
                  }
                  placeholder="Date / Year (e.g. Nov 2025)"
                  className="input-base text-xs font-mono"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                setTempAch((prev) => [...prev, { icon: "Award", title: "", date: "" }])
              }
              className="w-full py-2.5 border border-dashed border-border2 text-xs font-bold uppercase tracking-wider text-text-muted hover:text-primary hover:border-primary/50 transition-colors flex items-center justify-center gap-2 rounded"
            >
              <Plus size={14} /> Add Achievement
            </button>
          </div>
        </EditModal>
      )}

      {/* Main Edit Profile Modal */}
      {isEditModalOpen && user && (
        <EditProfileModal user={user} onClose={() => setIsEditModalOpen(false)} />
      )}
    </div>
  );
};
