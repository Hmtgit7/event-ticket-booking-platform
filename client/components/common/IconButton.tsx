import { Bell } from "lucide-react";

export function IconButton({
  icon: Icon,
  label,
}: {
  icon: typeof Bell;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex size-10 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-brand"
    >
      <Icon className="size-[18px]" />
    </button>
  );
}
