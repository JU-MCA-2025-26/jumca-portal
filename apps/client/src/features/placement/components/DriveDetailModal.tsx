import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  X,
  ExternalLink,
  FileText,
  Bookmark,
  ChevronRight,
  Calendar,
  GraduationCap,
  TrendingUp,
  Users,
} from "lucide-react";
import { useDriveDetail } from "../api/placements.ts";
import type { DriveStatus, PlacedAlumni, DriveResource } from "../types/index.ts";

// Helpers (unchanged)
function abbr(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return name.slice(0, 3).toUpperCase();
  return words
    .slice(0, 3)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const resourceIcon: Record<string, typeof FileText> = {
  OA_PAPER: FileText,
  INTERVIEW_NOTES: Bookmark,
  JD: FileText,
  RESUME_TIPS: FileText,
  OTHER: FileText,
};

const resourceLabel: Record<string, string> = {
  OA_PAPER: "Online Assessment Paper",
  INTERVIEW_NOTES: "Interview Notes",
  JD: "Job Description (PDF)",
  RESUME_TIPS: "Resume Tips",
  OTHER: "Resource",
};

const statusCfg: Record<DriveStatus, { label: string; bg: string; text: string }> = {
  ACTIVE: { label: "OPEN", bg: "bg-success/10", text: "text-success" },
  UPCOMING: { label: "UPCOMING", bg: "bg-surface3", text: "text-text-muted" },
  CLOSED: { label: "CLOSED", bg: "bg-primary/10", text: "text-primary" },
};

function AlumniCircle({
  alumni,
  onNavigate,
}: {
  alumni: PlacedAlumni;
  onNavigate: (roll: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onNavigate(alumni.rollNumber)}
      title={`${alumni.fullName} · ${alumni.offer.ctc}`}
      className="group flex flex-col items-center gap-1.5"
      aria-label={`View ${alumni.fullName}'s profile`}
    >
      <div
        className="relative h-12 w-12 rounded-full overflow-hidden
                   border-2 border-border2 group-hover:border-primary
                   transition-all duration-150 bg-surface2"
      >
        {alumni.profile?.avatarUrl ? (
          <img
            src={alumni.profile.avatarUrl}
            alt={alumni.fullName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="h-full w-full flex items-center justify-center
                          text-[0.625rem] font-bold text-text-secondary
                          group-hover:text-primary transition-colors"
          >
            {initials(alumni.fullName)}
          </div>
        )}
        {alumni.offer.status === "ACCEPTED" && (
          <span
            className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success
                       border border-bg flex items-center justify-center text-[0.4rem]"
          >
            ✓
          </span>
        )}
      </div>
      <span
        className="w-12 text-center text-[0.55rem] font-bold uppercase
                   tracking-wide text-text-muted group-hover:text-text
                   transition-colors leading-tight truncate"
      >
        {alumni.fullName.split(" ")[0]}
      </span>
    </button>
  );
}

function ResourceRow({ res }: { res: DriveResource }) {
  const Icon = resourceIcon[res.type] ?? FileText;
  const label = resourceLabel[res.type] ?? "Resource";
  return (
    <a
      href={res.fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded border border-border px-3 py-2.5
                 hover:border-primary/40 hover:bg-surface2 transition-all group"
    >
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm"
        style={{ background: "color-mix(in srgb, var(--color-primary) 10%, transparent)" }}
      >
        <Icon size={14} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[0.8rem] font-bold text-text truncate">{res.title}</p>
        <p className="text-[0.65rem] text-text-muted">{label}</p>
      </div>
      <ExternalLink
        size={12}
        className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
      />
    </a>
  );
}

function ModalSkeleton() {
  return (
    <div className="flex flex-col gap-5 animate-pulse p-4 sm:p-8">
      <div className="h-7 w-48 rounded bg-surface2" />
      <div className="h-4 w-32 rounded bg-surface2" />
      <div className="mt-2 h-32 rounded bg-surface2" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded bg-surface2" />
        ))}
      </div>
    </div>
  );
}

interface DriveDetailModalProps {
  driveId: string | null;
  onClose: () => void;
}

export function DriveDetailModal({ driveId, onClose }: DriveDetailModalProps) {
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);
  const { data: drive, isLoading, isError } = useDriveDetail(driveId);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  const cfg = drive ? (statusCfg[drive.status] ?? statusCfg.UPCOMING) : null;

  const goToProfile = (roll: string) => {
    onClose();
    navigate(`/dashboard/profile/${roll}`);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={drive?.company.name ?? "Drive details"}
    >
      <div
        className="absolute inset-0 bg-bg/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative z-10 flex flex-col bg-surface border border-border
                   rounded-none sm:rounded-md shadow-card-hover animate-slide-up
                   overflow-hidden w-full max-w-270 h-auto max-h-screen sm:max-h-[92vh]"
      >
        {!isLoading && drive && (
          <div
            className="shrink-0 flex flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-6 sm:py-4
                       border-b border-border"
            style={{
              background: "linear-gradient(90deg, #1a0505 0%, var(--color-surface) 60%)",
            }}
          >
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div
                className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-sm
                           text-[0.65rem] sm:text-[0.7rem] font-bold text-text-secondary border border-border2"
                style={{ background: "var(--color-surface2)" }}
              >
                {abbr(drive.company.name)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg font-bold text-text leading-none truncate">
                    {drive.company.name}
                  </h2>
                  {cfg && (
                    <span
                      className={`tag-base ${cfg.bg} ${cfg.text}`}
                      style={{ borderColor: "transparent" }}
                    >
                      {cfg.label}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-[0.7rem] sm:text-[0.8rem] text-text-secondary truncate">
                  {drive.role}
                  {drive.company.sector && (
                    <span className="ml-2 text-text-muted">· {drive.company.sector}</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {drive.applyLink && (
                <a
                  href={drive.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-sm px-3 py-1.5 sm:px-4 sm:py-2
                             bg-primary hover:bg-primary-hover text-white
                             text-[0.55rem] sm:text-[0.625rem] font-bold uppercase tracking-widest
                             transition-colors"
                >
                  Apply Now <ExternalLink size={11} />
                </a>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="p-1.5 text-text-muted hover:text-text hover:bg-surface2
                           rounded transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {(isLoading || isError) && (
          <div className="absolute top-3 right-3 z-10">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-text-muted hover:text-text hover:bg-surface2 rounded"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {isLoading && <ModalSkeleton />}

        {isError && (
          <div className="flex flex-1 items-center justify-center text-text-muted text-sm p-4">
            Failed to load drive details. Please try again.
          </div>
        )}

        {!isLoading && !isError && drive && (
          <div className="flex flex-1 min-h-0 flex-col sm:flex-row divide-y sm:divide-x divide-border">
            {/* Left: JD + drive info */}
            <div className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 gap-4 sm:gap-5 flex flex-col">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    icon: TrendingUp,
                    label: "Package",
                    val: `${drive.minCTC ?? "—"}${drive.maxCTC && drive.maxCTC !== drive.minCTC ? ` – ${drive.maxCTC}` : ""}`,
                  },
                  { icon: GraduationCap, label: "Min CGPA", val: String(drive.minCGPA ?? "—") },
                  { icon: Calendar, label: "Drive Date", val: formatDate(drive.driveDate) },
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} className="rounded border border-border bg-surface2 px-3 py-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Icon size={12} className="text-primary" />
                      <span className="text-[0.55rem] font-bold uppercase tracking-[0.18em] text-text-muted">
                        {label}
                      </span>
                    </div>
                    <p className="text-base font-bold text-text">{val}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="section-label mb-3">About the Role</p>
                {drive.jd ? (
                  <div className="text-[0.8rem] text-text-secondary leading-[1.75] whitespace-pre-wrap">
                    {drive.jd}
                  </div>
                ) : drive.description ? (
                  <p className="text-[0.8rem] text-text-secondary leading-[1.75]">
                    {drive.description}
                  </p>
                ) : (
                  <p className="text-[0.8rem] text-text-muted italic">
                    Job description not yet uploaded for this drive.
                  </p>
                )}
              </div>
            </div>

            {/* Right: Alumni + Resources */}
            <div className="flex-1 min-w-0 overflow-y-auto flex flex-col">
              <div className="p-4 sm:p-5 border-b border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Users size={14} className="text-primary" />
                  <p className="section-label">
                    {drive.placedAlumni.length > 0
                      ? `Alumni Here (${drive.placedAlumni.length})`
                      : "Alumni Here"}
                  </p>
                </div>

                {drive.placedAlumni.length > 0 ? (
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    {drive.placedAlumni.map((a) => (
                      <AlumniCircle key={a.id} alumni={a} onNavigate={goToProfile} />
                    ))}
                  </div>
                ) : (
                  <p className="text-[0.75rem] text-text-muted">
                    No alumni placements recorded for this company yet.
                  </p>
                )}
              </div>

              <div className="flex-1 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="section-label">Prep Resources</p>
                  {drive.resources.length > 0 && (
                    <span className="text-[0.6rem] text-text-muted">
                      {drive.resources.length} files
                    </span>
                  )}
                </div>

                {drive.resources.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {drive.resources.map((r) => (
                      <ResourceRow key={r.id} res={r} />
                    ))}
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center justify-center py-8 gap-3
                               rounded border border-dashed border-border"
                  >
                    <FileText size={22} className="text-text-muted" />
                    <p className="text-[0.75rem] text-text-muted text-center">
                      No prep resources yet.
                      <br />
                      Previous interview notes and OA papers will appear here.
                    </p>
                  </div>
                )}
              </div>

              {drive.placedAlumni.length > 0 && (
                <div className="shrink-0 px-4 sm:px-5 pb-3 sm:pb-4">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate("/dashboard/alumni");
                    }}
                    className="flex items-center gap-1 text-[0.7rem] text-text-muted
                               hover:text-primary transition-colors"
                  >
                    View all alumni <ChevronRight size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
