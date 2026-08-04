interface AdminSectionTitleProps {
  eyebrow: string;
  title: string;
}

/**
 * Two-line heading used in every admin content section.
 */
export function AdminSectionTitle({ eyebrow, title }: AdminSectionTitleProps) {
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
