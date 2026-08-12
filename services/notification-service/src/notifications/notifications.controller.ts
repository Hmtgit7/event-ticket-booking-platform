import { Controller, Get, Patch, Param, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUserId } from '../auth/current-user.decorator';
import { NotificationsService } from './notifications.service';
import { NotificationResponseDto, PageResponseDto } from './dto/notification-response.dto';
import { NotificationAudience } from './notification-audience';

function parseAudience(raw: string | undefined): NotificationAudience {
  if (raw === NotificationAudience.USER || raw === NotificationAudience.ORGANIZER || raw === NotificationAudience.ADMIN) {
    return raw;
  }
  // Required, not defaulted - a silently-defaulted audience is exactly how the
  // USER/ORGANIZER inboxes ended up merged in the first place.
  throw new BadRequestException('audience query param is required (USER, ORGANIZER, or ADMIN)');
}

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('mine')
  findMine(
    @CurrentUserId() userId: string,
    @Query('audience') audience: string | undefined,
    @Query('page') page = '0',
    @Query('size') size = '20',
  ): Promise<PageResponseDto<NotificationResponseDto>> {
    return this.notificationsService.findMine(userId, parseAudience(audience), Number(page), Number(size));
  }

  @Get('unread-count')
  async unreadCount(@CurrentUserId() userId: string, @Query('audience') audience: string | undefined): Promise<{ count: number }> {
    const count = await this.notificationsService.unreadCount(userId, parseAudience(audience));
    return { count };
  }

  @Patch(':id/read')
  async markRead(@CurrentUserId() userId: string, @Param('id') id: string): Promise<{ success: true }> {
    await this.notificationsService.markRead(userId, id);
    return { success: true };
  }
}
