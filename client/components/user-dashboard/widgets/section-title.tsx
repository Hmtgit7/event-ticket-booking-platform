interface SectionTitleProps {
  eyebrow: string;
  title: string;
}

/**
 * Reusable two-line heading used in every user dashboard content section.
 * The `eyebrow` is a small uppercase label; `title` is the main heading.
 */
export function SectionTitle({ eyebrow, title }: SectionTitleProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-brand">
        {eyebrow}
      </p>
      <h2 className="mt-1 font-heading text-2xl font-extrabold text-ink">
        {title}
      </h2>
    </div>
  );
}
