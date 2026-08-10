import type { Metadata } from "next";
import { ErrorFallback } from "@/components/common/error-fallback";
import { NoResultsIllustration } from "@/icons/empty-state-icons";

export const metadata: Metadata = {
  title: "Page not found — GrabMyTicket",
};

/**
 * App-wide 404. Next.js renders this automatically for any unmatched
 * route, and it's also what `notFound()` triggers from inside a page.
 */
export default function NotFound() {
  return (
    <ErrorFallback
      icon={<NoResultsIllustration className="size-32" />}
      title="Page not found"
      description="The page you're looking for doesn't exist or may have moved. Check the URL, or head back to explore events."
    />
  );
}
