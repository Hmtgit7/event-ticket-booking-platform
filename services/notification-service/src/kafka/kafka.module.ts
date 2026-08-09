import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { KafkaConsumerService } from './kafka-consumer.service';
import { BookingConfirmedHandler } from './booking-confirmed.handler';

@Module({
  imports: [NotificationsModule],
  providers: [KafkaConsumerService, BookingConfirmedHandler],
})
export class KafkaModule {}
