import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-bg font-mono">
      <p className="text-[0.625rem] font-bold uppercase tracking-[0.35em] text-text-muted">
        amra kara?
      </p>

      <h1 className="text-glow-red m-0 animate-glitch text-[clamp(3rem,10vw,5.5rem)] font-bold tracking-[-0.02em]">
        <span className="text-primary">#</span>
        <span className="text-text">JUMCA</span>
      </h1>

      <p className="m-0 text-sm font-bold tracking-widest text-text-secondary">
        huhh hahh, <span className="text-primary">huhh hahh</span>
      </p>

      <button
        type="button"
        onClick={() => navigate("/login")}
        className="mt-6 rounded px-6 py-2.5 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-text-inverse bg-primary shadow-glow-sm transition-colors hover:bg-primary-hover"
      >
        Login
      </button>

      <div className="mt-8 flex items-center gap-2 rounded border border-border2 px-4 py-2 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-text-muted">
        <span className="live-dot" />
        Dev server running
      </div>
    </div>
  );
}

export default LandingPage;
