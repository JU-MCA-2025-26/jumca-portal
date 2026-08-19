import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext.tsx";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-bg">
        <p className="animate-glitch text-4xl font-bold text-glow-red">
          <span className="text-primary">#</span>
          <span className="text-text">JUMCA</span>
        </p>
        <p className="text-[0.625rem] font-bold uppercase tracking-widest text-text-muted prompt">
          Loading session
        </p>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
