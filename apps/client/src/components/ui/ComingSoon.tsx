// Placeholder component
export default function ComingSoon({ label }: { label: string }) {
  return (
    <div className="p-6">
      <p className="section-label mb-2">Portal</p>
      <h1 className="text-2xl font-bold text-text">{label}</h1>
      <p className="mt-2 text-sm text-text-muted">Coming soon.</p>
    </div>
  );
}
