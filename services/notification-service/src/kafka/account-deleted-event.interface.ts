/** Mirrors auth-service's AccountDeletedEvent.java field-for-field - the JSON contract, not a shared library (each service stays independently deployable). email/fullName are the pre-anonymization values captured by auth-service before it overwrote them. */
export interface AccountDeletedEvent {
  eventType: 'user.account.deleted';
  userId: string;
  email: string;
  fullName: string;
  deletedAt: string;
}
