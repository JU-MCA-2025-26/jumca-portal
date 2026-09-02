import { useState } from "react";
import { X, Plus, Loader2 } from "lucide-react";
import { useUpdateProfile } from "../api/profile.ts";
import type { AuthUser } from "@/features/auth/types/index.ts";

interface EditProfileModalProps {
  user: AuthUser;
  onClose: () => void;
}

export default function EditProfileModal({ user, onClose }: EditProfileModalProps) {
  const [fullName, setFullName] = useState(user.fullName || "");
  const [avatarUrl, setAvatarUrl] = useState(user.profile?.avatarUrl || "");
  const [bio, setBio] = useState(user.profile?.bio || "");
  const [github, setGithub] = useState(user.profile?.github || "");
  const [linkedinUrl, setLinkedinUrl] = useState(user.profile?.linkedinUrl || "");
  const [leetcode, setLeetcode] = useState(user.profile?.leetcode || "");
  const [gfg, setGfg] = useState(user.profile?.gfg || "");
  const [codeforces, setCodeforces] = useState(user.profile?.codeforces || "");
  const [company, setCompany] = useState(user.profile?.company || "");
  const [jobRole, setJobRole] = useState(user.profile?.jobRole || "");
  const [location, setLocation] = useState(user.profile?.location || "");

  // Technical skills tags
  const [tags, setTags] = useState<string[]>(
    user.profile?.tags || ["C++", "Python", "Java", "SQL", "React", "Node.js", "Git", "DSA"],
  );
  const [tagInput, setTagInput] = useState("");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { mutateAsync, isPending } = useUpdateProfile();

  const handleAddTag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      await mutateAsync({
        fullName,
        avatarUrl: avatarUrl.trim() || undefined,
        bio: bio.trim() || undefined,
        github: github.trim() || undefined,
        linkedinUrl: linkedinUrl.trim() || undefined,
        leetcode: leetcode.trim() || undefined,
        gfg: gfg.trim() || undefined,
        codeforces: codeforces.trim() || undefined,
        company: company.trim() || undefined,
        jobRole: jobRole.trim() || undefined,
        location: location.trim() || undefined,
        tags,
      });
      onClose();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to update profile");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="card w-full max-w-2xl p-6 my-8 animate-slide-up relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-text-muted hover:text-text p-1 transition-colors"
        >
          <X size={20} />
        </button>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <p className="section-label mb-1">Edit Profile</p>
            <h2 className="text-xl font-bold text-text">Update Profile Details</h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Personalize your public profile, social links, and skills badge list.
            </p>
          </div>

          {errorMsg && (
            <div className="rounded bg-danger/10 border border-danger/30 p-3 text-xs text-danger">
              {errorMsg}
            </div>
          )}

          {/* General Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border pb-1">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-base"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="input-base"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Bio / About Me
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Short bio about your academic background and interests..."
                rows={3}
                className="input-base resize-none"
              />
            </div>
          </div>

          {/* Technical Skills / Tags */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border pb-1">
              Technical Skills & Badges
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add skill (e.g. React, C++, Docker)..."
                className="input-base flex-1"
              />
              <button
                type="button"
                onClick={() => handleAddTag()}
                className="px-3.5 py-1.5 rounded bg-surface2 border border-border2 text-xs font-bold text-text hover:bg-surface3 flex items-center gap-1 shrink-0"
              >
                <Plus size={14} /> Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 rounded-xs border border-border2 bg-surface2 px-2.5 py-1 text-[0.75rem] font-medium text-text-secondary"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-text-muted hover:text-danger transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Coding & Social Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border pb-1">
              Social & Coding Profiles
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  GitHub Profile URL
                </label>
                <input
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/username"
                  className="input-base"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="input-base"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  LeetCode Handle / URL
                </label>
                <input
                  type="text"
                  value={leetcode}
                  onChange={(e) => setLeetcode(e.target.value)}
                  placeholder="username or URL"
                  className="input-base"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Codeforces Handle / URL
                </label>
                <input
                  type="text"
                  value={codeforces}
                  onChange={(e) => setCodeforces(e.target.value)}
                  placeholder="username or URL"
                  className="input-base"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  GeeksforGeeks Profile URL
                </label>
                <input
                  type="text"
                  value={gfg}
                  onChange={(e) => setGfg(e.target.value)}
                  placeholder="https://geeksforgeeks.org/user/username"
                  className="input-base"
                />
              </div>
            </div>
          </div>

          {/* Professional / Career Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border pb-1">
              Professional & Career Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google, TCS"
                  className="input-base"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Job Role / Title
                </label>
                <input
                  type="text"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  placeholder="e.g. SDE-1, Intern"
                  className="input-base"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bangalore, Remote"
                  className="input-base"
                />
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-border2 px-4 py-2 text-xs font-bold text-text-secondary hover:text-text transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded bg-primary px-5 py-2 text-xs font-bold text-text-inverse transition-colors hover:bg-primary-hover disabled:opacity-50 flex items-center gap-2"
            >
              {isPending && <Loader2 size={14} className="animate-spin" />}
              {isPending ? "Saving Changes..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
