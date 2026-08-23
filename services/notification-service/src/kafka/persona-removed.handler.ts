import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { personaRemovedTemplate } from '../email/email.templates';
import { PersonaRemovedEvent } from './persona-removed-event.interface';

/**
 * Unlike AccountDeletedHandler, the account is still live here - just
 * missing one role - so this is purely a heads-up email, no suppression of
 * anything, and no in-app notification either (same reasoning as
 * BookingConfirmedHandler's organizer-only in-app note doesn't apply: the
 * removed persona's dashboard is exactly the inbox they'd no longer see it in).
 */
@Injectable()
export class PersonaRemovedHandler {
  private readonly logger = new Logger(PersonaRemovedHandler.name);

  constructor(private readonly emailService: EmailService) {}

  async handle(event: PersonaRemovedEvent): Promise<void> {
    const html = personaRemovedTemplate({ fullName: event.fullName, scope: event.scope, removedAt: event.removedAt });
    const scopeLabel = event.scope === 'CUSTOMER' ? 'customer' : 'organizer';
    await this.emailService.send(event.email, event.fullName, `Your ${scopeLabel} profile was removed`, html);
    this.logger.log(`Processed user.persona.removed (${event.scope}) for user ${event.userId}`);
  }
}
