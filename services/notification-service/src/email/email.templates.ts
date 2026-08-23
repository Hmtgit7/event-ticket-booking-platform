/**
 * Minimal inline-styled HTML shell shared by all transactional emails - same
 * shape as auth-service's EmailTemplates.java (kept as a plain copy rather
 * than a shared library so each service stays independently deployable).
 */
export function buttonTemplate(title: string, bodyHtml: string, actionUrl: string, actionLabel: string): string {
  return `
    <div style="font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a;">
      <h2 style="margin: 0 0 16px; font-size: 20px;">${title}</h2>
      <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.5; color: #444;">${bodyHtml}</p>
      <a href="${actionUrl}" style="display: inline-block; background: #6d28d9; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 15px; font-weight: 600;">${actionLabel}</a>
      <p style="margin: 24px 0 0; font-size: 13px; color: #888;">If the button doesn't work, copy and paste this link into your browser:<br>
      <a href="${actionUrl}" style="color: #6d28d9; word-break: break-all;">${actionUrl}</a></p>
    </div>
  `;
}

/** Same shell as buttonTemplate but with no call-to-action link - for purely informational emails where there's nothing to click through to (the account/profile this email is about is, by definition, gone or being taken away). */
export function plainTemplate(title: string, bodyHtml: string): string {
  return `
    <div style="font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a;">
      <h2 style="margin: 0 0 16px; font-size: 20px;">${title}</h2>
      <p style="margin: 0; font-size: 15px; line-height: 1.5; color: #444;">${bodyHtml}</p>
    </div>
  `;
}

export function accountDeletedTemplate(params: { fullName: string; deletedAt: string }): string {
  const body = `
    Hi ${params.fullName},<br><br>
    Your GrabMyTicket account was permanently deleted on
    ${new Date(params.deletedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}.<br><br>
    Your login details have been removed and can't be recovered. If this wasn't you, please contact support right away.
  `;
  return plainTemplate('Your account has been deleted', body);
}

export function personaRemovedTemplate(params: { fullName: string; scope: 'CUSTOMER' | 'ORGANIZER'; removedAt: string }): string {
  const scopeLabel = params.scope === 'CUSTOMER' ? 'customer' : 'organizer';
  const body = `
    Hi ${params.fullName},<br><br>
    Your ${scopeLabel} profile on GrabMyTicket was removed on
    ${new Date(params.removedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}.
    The rest of your account is unaffected and you can keep using it as before.<br><br>
    If this wasn't you, please contact support right away.
  `;
  return plainTemplate(`Your ${scopeLabel} profile was removed`, body);
}

export function bookingConfirmedTemplate(params: {
  eventTitle: string;
  eventStartAt: string;
  ticketTypeName: string;
  quantity: number;
  totalAmount: string;
  bookingCode: string;
  ticketUrl: string;
}): string {
  const body = `
    Your booking for <strong>${params.eventTitle}</strong> is confirmed.<br><br>
    ${params.quantity} × ${params.ticketTypeName} — ₹${params.totalAmount}<br>
    Booking code: <strong>${params.bookingCode}</strong><br>
    Date: ${new Date(params.eventStartAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
  `;
  return buttonTemplate('Your ticket is confirmed 🎟️', body, params.ticketUrl, 'View ticket');
}
