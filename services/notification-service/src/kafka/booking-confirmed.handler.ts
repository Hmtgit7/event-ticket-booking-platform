import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/notification-type';
import { EmailService } from '../email/email.service';
import { bookingConfirmedTemplate } from '../email/email.templates';
import { BookingConfirmedEvent } from './booking-confirmed-event.interface';

/**
 * What actually happens when a booking.confirmed event arrives: write the
 * in-app notification and send the email. Both run every time - if one
 * throws, we log it in KafkaConsumerService rather than let a bad message
 * block the consumer forever (see that file's catch-and-log comment).
 */
@Injectable()
export class BookingConfirmedHandler {
  private readonly logger = new Logger(BookingConfirmedHandler.name);

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async handle(event: BookingConfirmedEvent): Promise<void> {
    const title = `Booking confirmed: ${event.eventTitle}`;
    const message = `${event.quantity} × ${event.ticketTypeName} — booking ${event.bookingCode}`;

    await this.notificationsService.create(event.userId, NotificationType.BOOKING_CONFIRMED, title, message, event.bookingId);

    // Organizer-facing notification only - never an email here. Email for a
    // booking goes to the customer who paid, not the organizer who received
    // the sale; the organizer's signal is purely in-app.
    const organizerTitle = 'New booking received';
    const organizerMessage = `${event.quantity} × ${event.ticketTypeName} for ${event.eventTitle} — booking ${event.bookingCode}`;
    await this.notificationsService.create(event.organizerId, NotificationType.BOOKING_RECEIVED, organizerTitle, organizerMessage, event.bookingId);

    const frontendBaseUrl = this.configService.get<string>('FRONTEND_BASE_URL');
    const ticketUrl = `${frontendBaseUrl}/user/dashboard/orders/${event.bookingId}`;
    const html = bookingConfirmedTemplate({
      eventTitle: event.eventTitle,
      eventStartAt: event.eventStartAt,
      ticketTypeName: event.ticketTypeName,
      quantity: event.quantity,
      totalAmount: event.totalAmount,
      bookingCode: event.bookingCode,
      ticketUrl,
    });

    await this.emailService.send(event.userEmail, event.userEmail, `Your ticket for ${event.eventTitle} is confirmed`, html);
    this.logger.log(`Processed booking.confirmed for booking ${event.bookingId}`);
  }
}
