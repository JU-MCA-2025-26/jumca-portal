import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../components/LoginForm.tsx";
import { useAuthContext } from "../context/AuthContext.tsx";

export const LoginPage = () => {
  const { isAuthenticated, isLoading } = useAuthContext();
  const navigate = useNavigate();

  // If already logged in, skip the login page
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) return null; // ProtectedRoute handles the loading UI

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center bg-bg p-4">
      <div className="absolute inset-0 scanlines z-0" aria-hidden="true" />
      <div className="mb-8 text-center">
        <p className="animate-glitch text-4xl font-bold text-glow-red">
          <span className="text-primary">#</span>
          <span className="text-text">JUMCA</span>
        </p>
        <p className="mt-1 text-[0.625rem] font-bold uppercase tracking-[0.3em] text-text-muted">
          Portal
        </p>
      </div>

      <LoginForm />
    </main>
  );
};
