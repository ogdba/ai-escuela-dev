interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: SectionHeaderProps) {
  const alignment = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={`flex flex-col gap-2 ${alignment}`}>
      {eyebrow ? (
        <span className="inline-flex items-center rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{title}</h2>
      {subtitle ? (
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
