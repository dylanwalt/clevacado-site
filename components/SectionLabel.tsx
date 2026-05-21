interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionLabel({
  children,
  className = "",
}: SectionLabelProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 mb-4 ${className}`}
    >
      <span
        className="text-xs font-bold tracking-widest uppercase"
        style={{ color: "#2F8F46" }}
      >
        {children}
      </span>
      <span
        className="inline-block h-px w-8"
        style={{ backgroundColor: "#2F8F46" }}
        aria-hidden="true"
      />
    </div>
  );
}
