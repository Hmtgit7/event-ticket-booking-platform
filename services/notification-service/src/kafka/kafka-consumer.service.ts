import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Consumer, Kafka, KafkaConfig } from 'kafkajs';
import { BookingConfirmedEvent } from './booking-confirmed-event.interface';
import { BookingConfirmedHandler } from './booking-confirmed.handler';

/**
 * Plain kafkajs consumer, not @nestjs/microservices' Kafka transport - the
 * producer (booking-service, Spring Kafka) sends a raw JSON string, not
 * NestJS's microservice envelope, so a manual JSON.parse + switch on
 * eventType is simpler and more correct here than fighting a transport
 * built for NestJS-to-NestJS messaging.
 */
@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaConsumerService.name);
  private consumer: Consumer;

  constructor(
    private readonly configService: ConfigService,
    private readonly bookingConfirmedHandler: BookingConfirmedHandler,
  ) {}

  async onModuleInit(): Promise<void> {
    const brokers = (this.configService.get<string>('KAFKA_BOOTSTRAP_SERVERS') ?? 'localhost:9092').split(',');
    const username = this.configService.get<string>('KAFKA_USERNAME');
    const password = this.configService.get<string>('KAFKA_PASSWORD');
    const useSasl = this.configService.get<string>('KAFKA_SASL') === 'true';
    const caCert = this.configService.get<string>('KAFKA_CA_CERT')?.replace(/\\n/g, '\n');
    const rejectUnauthorized = this.configService.get<string>('KAFKA_SSL_REJECT_UNAUTHORIZED') !== 'false';
    const ssl: KafkaConfig['ssl'] = useSasl
      ? caCert
        ? { ca: [caCert], rejectUnauthorized }
        : { rejectUnauthorized }
      : undefined;

    const kafka = new Kafka({
      clientId: 'notification-service',
      brokers,
      ssl,
      sasl: useSasl && username && password ? { mechanism: 'scram-sha-256', username, password } : undefined,
    });

    const topic = this.configService.get<string>('BOOKING_EVENTS_TOPIC') ?? 'booking-events';
    const admin = kafka.admin();
    await admin.connect();
    try {
      const topics = await admin.listTopics();
      if (!topics.includes(topic)) {
        await admin.createTopics({
          waitForLeaders: true,
          topics: [{ topic, numPartitions: 1, replicationFactor: 1 }],
        });
      }
    } finally {
      await admin.disconnect();
    }

    this.consumer = kafka.consumer({
      groupId: this.configService.get<string>('KAFKA_CONSUMER_GROUP_ID') ?? 'notification-service',
    });

    await this.consumer.connect();
    await this.consumer.subscribe({ topic, fromBeginning: false });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        await this.handleMessage(message.value?.toString());
      },
    });

    this.logger.log(`Kafka consumer subscribed to "${topic}"`);
  }

  async onModuleDestroy(): Promise<void> {
    await this.consumer?.disconnect();
  }

  private async handleMessage(raw: string | undefined): Promise<void> {
    if (!raw) {
      return;
    }

    try {
      const event = JSON.parse(raw) as { eventType?: string };

      switch (event.eventType) {
        case 'booking.confirmed':
          await this.bookingConfirmedHandler.handle(event as BookingConfirmedEvent);
          break;
        default:
          this.logger.warn(`Unhandled eventType "${event.eventType}" - ignoring`);
      }
    } catch (error) {
      // Deliberately caught, not rethrown: a bad/unprocessable message
      // shouldn't wedge the consumer for every message behind it. At MVP
      // scope this means a failed message is skipped, not retried - a
      // dead-letter topic is the natural next step once this matters.
      this.logger.error('Failed to process Kafka message', error);
    }
  }
}
