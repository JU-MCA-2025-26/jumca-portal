import { useNavigate } from "react-router-dom";
import type { AlumniListItem } from "@jumca/shared";
import { MapPinIcon, ExternalLinkIcon } from "@/components/ui/Icons.tsx";

interface AlumniCardProps {
  alumni: AlumniListItem;
}

export default function AlumniCard({ alumni }: AlumniCardProps) {
  const navigate = useNavigate();

  const goToProfile = () => navigate(`/dashboard/alumni/${alumni.id}`);

  return (
    <div
      className="card-hover overflow-hidden cursor-pointer group"
      role="button"
      tabIndex={0}
      onClick={goToProfile}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") goToProfile();
      }}
    >
      {/* Photo */}
      <div className="relative h-40 w-full overflow-hidden bg-surface2">
        {alumni.avatarUrl ? (
          <img
            src={alumni.avatarUrl}
            alt={alumni.fullName}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-text-muted">
            {alumni.fullName
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

        {alumni.openToConnect && (
          <span className="tag-base absolute right-2 top-2 border-success/30 bg-success/15 text-success">
            OPEN TO CONNECT
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="text-sm font-bold text-text">{alumni.fullName}</h3>

        {alumni.company && <p className="mt-1 text-xs font-bold text-primary">{alumni.company}</p>}
        {alumni.jobRole && <p className="text-xs text-text-secondary">{alumni.jobRole}</p>}

        {alumni.location && (
          <p className="mt-2 flex items-center gap-1 text-xs text-text-muted">
            <MapPinIcon className="h-3 w-3" />
            {alumni.location}
          </p>
        )}

        {alumni.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {alumni.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag-base tag-default">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="text-xs text-text-muted">
            Batch {alumni.graduationYear ?? alumni.batch}
          </span>
          <span className="flex items-center gap-1 text-xs font-bold text-primary">
            Connect
            <ExternalLinkIcon className="h-3 w-3" />
          </span>
        </div>
      </div>
    </div>
  );
}
