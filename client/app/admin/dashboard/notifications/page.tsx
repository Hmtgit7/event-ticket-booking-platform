import type { Metadata } from "next";
import { NotificationsContainer } from "@/containers/notifications/notifications-container";

export const metadata: Metadata = { title: "Notifications" };

export default function AdminNotificationsPage() {
  return <NotificationsContainer audience="ADMIN" />;
}
