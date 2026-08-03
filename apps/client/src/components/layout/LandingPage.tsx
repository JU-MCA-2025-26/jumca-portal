function LandingPage() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        backgroundColor: "var(--color-bg)",
        fontFamily: "var(--font-mono)",
      }}
    >
      <p
        style={{
          fontSize: "0.625rem",
          fontWeight: 700,
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: "var(--color-text-muted)",
        }}
      >
        amra kara?
      </p>

      <h1
        style={{
          fontSize: "clamp(3rem, 10vw, 5.5rem)",
          fontWeight: 700,
          margin: 0,
          letterSpacing: "-0.02em",
          animation: "glitch 3s ease-in-out infinite",
          textShadow:
            "0 0 20px color-mix(in srgb, #E53935 60%, transparent), 0 0 60px color-mix(in srgb, #E53935 20%, transparent)",
        }}
      >
        <span style={{ color: "var(--color-primary)" }}>#</span>
        <span style={{ color: "var(--color-text)" }}>JUMCA</span>
      </h1>

      <p
        style={{
          fontSize: "0.875rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          color: "var(--color-text-secondary)",
          margin: 0,
        }}
      >
        huhh hahh, <span style={{ color: "var(--color-primary)" }}>huhh hahh</span>
      </p>

      <div
        style={{
          marginTop: "2rem",
          padding: "0.5rem 1rem",
          border: "1px solid var(--color-border2)",
          borderRadius: "0.25rem",
          fontSize: "0.625rem",
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--color-text-muted)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: "0.375rem",
            height: "0.375rem",
            borderRadius: "9999px",
            background: "var(--color-success)",
          }}
        />
        Dev server running
      </div>
    </div>
  );
}

export default LandingPage;
