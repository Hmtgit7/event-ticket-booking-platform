import { SectionTitle } from "./section-title";
import { DUMMY_NOTIFICATIONS } from "@/constants/user-dashboard-data";

/**
 * Renders the "What needs attention" notifications panel.
 * Data comes from the shared dummy-data constant.
 */
export function NotificationList() {
  return (
    <article className="rounded-2xl border border-line bg-surface p-5">
      <SectionTitle eyebrow="Updates" title="What needs attention" />
      <ul className="mt-4 flex flex-col gap-3">
        {DUMMY_NOTIFICATIONS.map((item) => (
          <li
            key={item}
            className="rounded-xl border border-line bg-background px-4 py-3 text-sm text-ink"
          >
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
