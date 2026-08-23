import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { accountDeletedTemplate } from '../email/email.templates';
import { AccountDeletedEvent } from './account-deleted-event.interface';

/**
 * The account is already anonymized in auth-service's own database by the
 * time this runs - email/fullName here are the pre-anonymization values
 * auth-service captured and put directly in the event payload, so this
 * never needs to read anything back. Nothing to write to the in-app
 * notifications table either: the account this would belong to no longer
 * has working credentials to log back in and see it, so an email is the
 * only channel that actually reaches the person.
 */
@Injectable()
export class AccountDeletedHandler {
  private readonly logger = new Logger(AccountDeletedHandler.name);

  constructor(private readonly emailService: EmailService) {}

  async handle(event: AccountDeletedEvent): Promise<void> {
    const html = accountDeletedTemplate({ fullName: event.fullName, deletedAt: event.deletedAt });
    await this.emailService.send(event.email, event.fullName, 'Your GrabMyTicket account has been deleted', html);
    this.logger.log(`Processed user.account.deleted for user ${event.userId}`);
  }
}
