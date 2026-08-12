import type { Metadata } from "next";
import { NotificationsContainer } from "@/containers/notifications/notifications-container";

export const metadata: Metadata = { title: "Notifications" };

export default function UserNotificationsPage() {
  return <NotificationsContainer audience="USER" />;
}
