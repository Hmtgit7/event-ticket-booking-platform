import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUserId } from '../auth/current-user.decorator';
import { NotificationsService } from './notifications.service';
import { NotificationResponseDto, PageResponseDto } from './dto/notification-response.dto';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('mine')
  findMine(
    @CurrentUserId() userId: string,
    @Query('page') page = '0',
    @Query('size') size = '20',
  ): Promise<PageResponseDto<NotificationResponseDto>> {
    return this.notificationsService.findMine(userId, Number(page), Number(size));
  }

  @Get('unread-count')
  async unreadCount(@CurrentUserId() userId: string): Promise<{ count: number }> {
    const count = await this.notificationsService.unreadCount(userId);
    return { count };
  }

  @Patch(':id/read')
  async markRead(@CurrentUserId() userId: string, @Param('id') id: string): Promise<{ success: true }> {
    await this.notificationsService.markRead(userId, id);
    return { success: true };
  }
}
