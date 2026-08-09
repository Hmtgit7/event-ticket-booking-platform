import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email';

/**
 * Sends transactional email through Brevo's API - same provider and pattern
 * as auth-service's BrevoEmailSender.java. Falls back to logging the email
 * to the console when BREVO_API_KEY isn't set, so local dev never needs a
 * real Brevo account (same fallback behavior as auth-service).
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {}

  async send(toEmail: string, toName: string, subject: string, htmlContent: string): Promise<void> {
    const apiKey = this.configService.get<string>('BREVO_API_KEY');

    if (!apiKey) {
      this.logger.log(`[console-stub email] to=${toEmail} subject="${subject}"\n${htmlContent}`);
      return;
    }

    const senderEmail = this.configService.get<string>('BREVO_SENDER_EMAIL');
    const senderName = this.configService.get<string>('BREVO_SENDER_NAME');

    const response = await fetch(BREVO_ENDPOINT, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: toEmail, name: toName }],
        subject,
        htmlContent,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      this.logger.error(`Brevo rejected email send to ${toEmail}: ${response.status} - ${body}`);
      // A booking is already confirmed and paid for by the time this runs -
      // a failed email must never look like a failed booking, so we log and
      // move on rather than throwing back up into the Kafka consumer.
    }
  }
}
