import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAlumniProfile } from "../api/alumni.ts";
import ConnectRequestModal from "../components/ConnectRequestModal.tsx";
import { ArrowLeftIcon, ExternalLinkIcon, MapPinIcon } from "@/components/ui/Icons.tsx";
import { buildExternalProfileUrl } from "@/features/profile/pages/0_profile_helpers.tsx";

const EXTERNAL_LINKS: Array<{
  key: "github" | "leetcode" | "gfg" | "codeforces" | "linkedinUrl";
  label: string;
}> = [
  { key: "github", label: "GitHub" },
  { key: "linkedinUrl", label: "LinkedIn" },
  { key: "leetcode", label: "LeetCode" },
  { key: "gfg", label: "GeeksforGeeks" },
  { key: "codeforces", label: "Codeforces" },
];

export function AlumniProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: profile, isLoading, error } = useAlumniProfile(id); // data is the profile directly
  const [showConnectModal, setShowConnectModal] = useState(false);

  if (isLoading) {
    return (
      <div>
        <div className="card h-64 animate-pulse bg-surface2" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div>
        <button
          type="button"
          onClick={() => navigate("/dashboard/alumni")}
          className="flex items-center gap-1 text-xs font-bold text-text-secondary hover:text-text"
        >
          <ArrowLeftIcon className="h-3 w-3" /> Back to Alumni Network
        </button>
        <div className="card mt-4 p-8 text-center text-sm text-danger">
          {error ? error.message : "Alumni not found."}
        </div>
      </div>
    );
  }

  const links = EXTERNAL_LINKS.filter((l) => profile.data[l.key]);

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate("/dashboard/alumni")}
        className="flex items-center gap-1 text-xs font-bold text-text-secondary hover:text-text"
      >
        <ArrowLeftIcon className="h-3 w-3" /> Back to Alumni Network
      </button>

      <div className="card mt-4 overflow-hidden">
        <div className="relative h-48 w-full bg-surface2">
          {profile.data.avatarUrl && /^https?:\/\//i.test(profile.data.avatarUrl.trim()) ? (
            <img
              src={profile.data.avatarUrl.trim()}
              alt={profile.data.fullName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-text-muted">
              {profile.data.fullName
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
        </div>

        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-text">{profile.data.fullName}</h1>
              {profile.data.company && (
                <p className="mt-1 text-sm font-bold text-primary">{profile.data.company}</p>
              )}
              {profile.data.jobRole && (
                <p className="text-sm text-text-secondary">{profile.data.jobRole}</p>
              )}
              {profile.data.location && (
                <p className="mt-2 flex items-center gap-1 text-xs text-text-muted">
                  <MapPinIcon className="h-3.5 w-3.5" />
                  {profile.data.location}
                </p>
              )}
              <p className="mt-1 text-xs text-text-muted">
                Batch {profile.data.graduationYear ?? profile.data.batch} · Roll No.{" "}
                {profile.data.rollNumber}
              </p>
            </div>

            {profile.data.openToConnect ? (
              <button
                type="button"
                onClick={() => setShowConnectModal(true)}
                className="rounded bg-primary px-4 py-2 text-xs font-bold text-text-inverse transition-colors hover:bg-primary-hover"
              >
                Connect
              </button>
            ) : (
              <span className="tag-base tag-default">Not open to connect</span>
            )}
          </div>

          {profile.data.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {profile.data.tags.map((tag) => (
                <span key={tag} className="tag-base tag-default">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {profile.data.bio && (
            <div className="mt-6">
              <p className="section-label mb-2">About</p>
              <p className="text-sm leading-relaxed text-text-secondary">{profile.data.bio}</p>
            </div>
          )}

          {links.length > 0 && (
            <div className="mt-6">
              <p className="section-label mb-2">Links</p>
              <div className="flex flex-wrap gap-2">
                {links.map((l) => {
                  const rawVal = profile.data[l.key] as string;
                  const safeHref = buildExternalProfileUrl(l.key, rawVal);
                  if (!safeHref) return null;
                  return (
                    <a
                      key={l.key}
                      href={safeHref}
                      target="_blank"
                      rel="noreferrer"
                      className="tag-base tag-primary flex items-center gap-1"
                    >
                      {l.label}
                      <ExternalLinkIcon className="h-2.5 w-2.5" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {showConnectModal && (
        <ConnectRequestModal
          alumniId={profile.data.id}
          alumniName={profile.data.fullName}
          onClose={() => setShowConnectModal(false)}
        />
      )}
    </div>
  );
}
