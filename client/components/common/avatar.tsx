import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  className?: string;
}

/** Initials avatar — avoids bundling a real headshot for dummy/demo data. */
export function Avatar({ name, className }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-on-elevated",
        className,
      )}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}
