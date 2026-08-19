import { useLogout } from "@/features/auth/api/logout.ts";

export const LogoutButton = () => {
  const { mutate: logout, isPending } = useLogout();

  return (
    <button
      onClick={() => logout()}
      disabled={isPending}
      className="tag-base tag-default hover:border-(--color-primary) hover:text-(--color-primary) cursor-pointer"
    >
      {isPending ? "Terminating..." : "Logout"}
    </button>
  );
};
