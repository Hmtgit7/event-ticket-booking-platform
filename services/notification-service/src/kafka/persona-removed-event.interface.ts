/** Mirrors auth-service's PersonaRemovedEvent.java field-for-field. scope is CUSTOMER or ORGANIZER - the account itself is still active, just missing that one role. */
export interface PersonaRemovedEvent {
  eventType: 'user.persona.removed';
  userId: string;
  email: string;
  fullName: string;
  scope: 'CUSTOMER' | 'ORGANIZER';
  removedAt: string;
}
