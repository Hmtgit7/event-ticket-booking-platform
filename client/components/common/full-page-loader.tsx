import { BrandLogo } from "@/components/common/brand-logo";

/**
 * Full-screen branded loader — used only for top-level app/section boot
 * (root `app/loading.tsx`, and anywhere navigating into a whole new area of
 * the app with no content on screen yet to skeletonize). Once real content
 * exists on screen (dashboards, lists, details), skeletons are the right
 * tool instead — this is deliberately not reused inside dashboards.
 */
export function FullPageLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-canvas">
      <BrandLogo />
      <span className="size-8 animate-spin rounded-full border-[3px] border-line border-t-brand" aria-hidden="true" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
