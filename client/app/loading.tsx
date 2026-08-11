import { FullPageLoader } from "@/components/common/full-page-loader";

/**
 * Root-level loading UI. Next.js shows this for any navigation into a
 * segment that doesn't have a closer `loading.tsx` of its own — i.e. app
 * boot, and any marketing/auth page. Dashboard segments each define their
 * own `loading.tsx` (skeleton-based, not this) so this file never fires
 * once you're inside a dashboard shell.
 */
export default function RootLoading() {
  return <FullPageLoader />;
}
