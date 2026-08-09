/** Shapes returned by notification-service. Field names match NotificationResponseDto exactly. */

export interface NotificationResponse {
  id: string;
  type: string;
  title: string;
  message: string;
  referenceId: string | null;
  read: boolean;
  createdAt: string;
}
