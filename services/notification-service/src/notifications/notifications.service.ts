import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationResponseDto, PageResponseDto } from './dto/notification-response.dto';
import { NotificationType } from './notification-type';
import { NotificationAudience } from './notification-audience';

/** Every write here is scoped to a userId AND an audience, mirroring the Java services' "every endpoint operates only on the caller's own data" rule - a dual-role account has one userId but must see isolated USER vs ORGANIZER inboxes. */
@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, audience: NotificationAudience, type: NotificationType, title: string, message: string, referenceId?: string): Promise<void> {
    await this.prisma.notification.create({
      data: { userId, audience, type, title, message, referenceId },
    });
  }

  async findMine(userId: string, audience: NotificationAudience, page: number, size: number): Promise<PageResponseDto<NotificationResponseDto>> {
    const [items, totalElements] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId, audience },
        orderBy: { createdAt: 'desc' },
        skip: page * size,
        take: size,
      }),
      this.prisma.notification.count({ where: { userId, audience } }),
    ]);

    return {
      items,
      page,
      size,
      totalElements,
      totalPages: Math.ceil(totalElements / size),
    };
  }

  async markRead(userId: string, id: string): Promise<void> {
    const result = await this.prisma.notification.updateMany({
      where: { id, userId },
      data: { read: true },
    });
    if (result.count === 0) {
      throw new NotFoundException('Notification not found');
    }
  }

  async unreadCount(userId: string, audience: NotificationAudience): Promise<number> {
    return this.prisma.notification.count({ where: { userId, audience, read: false } });
  }
}
