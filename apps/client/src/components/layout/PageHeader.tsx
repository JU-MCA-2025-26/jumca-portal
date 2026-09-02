function PageHeader({
  heading,
  title,
  subheading,
}: {
  heading: string;
  title: string;
  subheading: string;
}) {
  return (
    <div className="capitalize">
      <p className="section-label mb-1">{heading}</p>
      <h1 className="text-xl sm:text-2xl font-bold text-text tracking-tight">{title}</h1>
      <p className="mt-1 text-xs sm:text-sm text-text-secondary">{subheading}</p>
    </div>
  );
}

export default PageHeader;
