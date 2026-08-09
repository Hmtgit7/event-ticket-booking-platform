import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationResponseDto, PageResponseDto } from './dto/notification-response.dto';
import { NotificationType } from './notification-type';

/** Every write here is scoped to a userId, mirroring the Java services' "every endpoint operates only on the caller's own data" rule. */
@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, type: NotificationType, title: string, message: string, referenceId?: string): Promise<void> {
    await this.prisma.notification.create({
      data: { userId, type, title, message, referenceId },
    });
  }

  async findMine(userId: string, page: number, size: number): Promise<PageResponseDto<NotificationResponseDto>> {
    const [items, totalElements] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: page * size,
        take: size,
      }),
      this.prisma.notification.count({ where: { userId } }),
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

  async unreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({ where: { userId, read: false } });
  }
}
