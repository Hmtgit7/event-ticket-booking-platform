package com.grabmyticket.auth.notification;

/**
 * Minimal inline-styled HTML shell shared by all transactional emails.
 * Kept deliberately simple - most email clients strip <style> blocks, so
 * everything that matters is inline.
 */
final class EmailTemplates {

    private EmailTemplates() {
    }

    static String button(String title, String bodyHtml, String actionUrl, String actionLabel) {
        return """
                <div style="font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a;">
                  <h2 style="margin: 0 0 16px; font-size: 20px;">%s</h2>
                  <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.5; color: #444;">%s</p>
                  <a href="%s" style="display: inline-block; background: #6d28d9; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 15px; font-weight: 600;">%s</a>
                  <p style="margin: 24px 0 0; font-size: 13px; color: #888;">If the button doesn't work, copy and paste this link into your browser:<br>
                  <a href="%s" style="color: #6d28d9; word-break: break-all;">%s</a></p>
                  <p style="margin: 24px 0 0; font-size: 13px; color: #888;">If you didn't request this, you can safely ignore this email.</p>
                </div>
                """.formatted(title, bodyHtml, actionUrl, actionLabel, actionUrl, actionUrl);
    }
}
