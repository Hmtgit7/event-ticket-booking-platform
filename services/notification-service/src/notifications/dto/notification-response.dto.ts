export class NotificationResponseDto {
  id: string;
  type: string;
  title: string;
  message: string;
  referenceId: string | null;
  read: boolean;
  createdAt: Date;
}

export class PageResponseDto<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
