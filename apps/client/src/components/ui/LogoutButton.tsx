import { LogOut } from "lucide-react";
import { useLogout } from "@/features/auth/api/logout.ts";

export const LogoutButton = () => {
  const { mutate: logout, isPending } = useLogout();

  return (
    <button
      onClick={() => logout()}
      disabled={isPending}
      title={isPending ? "Terminating session" : "Logout"}
      className="
        group flex h-9 w-9 items-center justify-center gap-1.5
        rounded-sm border border-(--color-border)
        px-2.5 py-3
        text-xs font-medium
        text-text-muted
        transition-colors duration-200

        hover:bg-(--color-secondary)/10
        hover:text-(--color-primary)

        active:scale-95
        disabled:pointer-events-none
        disabled:opacity-50

        sm:px-3 sm:py-1.5 sm:text-sm
      "
    >
      <LogOut
        size={14}
        strokeWidth={2}
        className="
          shrink-0
          transition-transform duration-200
          group-hover:translate-x-0.5
          sm:size-4
        "
      />

      <span className="hidden xs:inline">{isPending ? "Terminating..." : "Logout"}</span>
    </button>
  );
};
