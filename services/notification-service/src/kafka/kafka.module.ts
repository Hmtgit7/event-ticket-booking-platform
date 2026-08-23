import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { KafkaConsumerService } from './kafka-consumer.service';
import { BookingConfirmedHandler } from './booking-confirmed.handler';
import { AccountDeletedHandler } from './account-deleted.handler';
import { PersonaRemovedHandler } from './persona-removed.handler';

@Module({
  imports: [NotificationsModule],
  providers: [KafkaConsumerService, BookingConfirmedHandler, AccountDeletedHandler, PersonaRemovedHandler],
})
export class KafkaModule {}
