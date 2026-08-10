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
      <h2 className="mt-1 text-xl font-bold text-ink">
        {title}
      </h2>
    </div>
  );
}
