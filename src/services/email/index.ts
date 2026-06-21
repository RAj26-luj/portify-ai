export { sendVerificationEmail } from "./send-verification-email";
export { sendForgotPasswordEmail } from "./send-forgot-password-email";
export { sendContactEmail } from "./send-contact-email";
export { sendAdminNotification } from "./send-admin-notification";

import { sendEmail } from "@/lib/nodemailer";

// --- SIMPLE IN-MEMORY ANTI-SPAM RATE LIMITER ---
// Tracks email volume per recipient address over a sliding timeline bucket window.
const emailRateLimitTracker = new Map<string, { count: number; resetAt: number }>();
const MAX_EMAILS_PER_WINDOW = 5; 
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 Minutes

function verifySpamGatePass(email: string): boolean {
  const now = Date.now();
  const lowerEmail = email.toLowerCase().trim();
  const record = emailRateLimitTracker.get(lowerEmail);

  if (!record || now > record.resetAt) {
    emailRateLimitTracker.set(lowerEmail, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }

  if (record.count >= MAX_EMAILS_PER_WINDOW) {
    return false;
  }

  record.count += 1;
  return true;
}

// --- PREMIUM RENDER ENGINE TEMPLATE FRAMEWORK ---
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface EmailWrapperOptions {
  preheader: string;
  title: string;
  bodyHtml: string;
  ctaText?: string;
  ctaUrl?: string;
}

function buildBaseEmailTemplate({ preheader, title, bodyHtml, ctaText, ctaUrl }: EmailWrapperOptions): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="light dark">
      <meta name="supported-color-schemes" content="light dark">
      <title>${title}</title>
      <style>
        :root { color-scheme: light dark; supported-color-schemes: light dark; }
        body { margin: 0; padding: 0; width: 100% !important; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #f8fafc; padding: 40px 0; }
        .container { max-width: 520px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .header { padding: 32px 40px 20px 40px; text-align: left; }
        .logo { font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.025em; text-decoration: none; }
        .content { padding: 0 40px 32px 40px; font-size: 15px; line-height: 24px; color: #334155; }
        .title { font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; tracking: -0.02em; }
        .btn-container { margin: 28px 0 20px 0; }
        .btn { display: inline-block; background-color: #0f172a; color: #ffffff !important; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 28px; border-radius: 10px; box-shadow: 0 2px 4px rgba(15, 23, 42, 0.08); transition: background-color 0.15s ease; }
        .footer { padding: 24px 40px; background-color: #fafafa; border-top: 1px solid #f1f5f9; text-align: center; font-size: 12px; color: #94a3b8; }
        .footer a { color: #64748b; text-decoration: underline; }
        @media (prefers-color-scheme: dark) {
          body, .wrapper { background-color: #030306 !important; }
          .container { background-color: #07070b !important; border-color: rgba(255,255,255,0.08) !important; }
          .logo, .title { color: #ffffff !important; }
          .content { color: #9ff1f5f9 / 0.8 !important; color: #cbd5e1 !important; }
          .btn { background-color: #ffffff !important; color: #030306 !important; }
          .footer { background-color: #09090e !important; border-top-color: rgba(255,255,255,0.04) !important; color: #64748b !important; }
        }
      </style>
    </head>
    <body>
      <span style="display: none; max-height: 0px; overflow: hidden;">${preheader}</span>
      <div class="wrapper">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center">
              <div class="container">
                <div class="header">
                  <a href="${APP_URL}" class="logo">Portify AI</a>
                </div>
                <div class="content">
                  <h1 class="title">${title}</h1>
                  ${bodyHtml}
                  ${ctaText && ctaUrl ? `
                    <div class="btn-container">
                      <a href="${ctaUrl}" class="btn">${ctaText}</a>
                    </div>
                  ` : ""}
                </div>
                <div class="footer">
                  <p>© 2026 Portify AI. Secure platform notification.</p>
                  <p>If you did not request this, you can safely ignore this email.</p>
                </div>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </body>
    </html>
  `;
}

// --- DYNAMIC EMAIL SERVICE DISPATCH EXPORTS ---

export async function sendApprovalEmail(email: string, userId?: string) {
  if (!verifySpamGatePass(email)) return;

  return sendEmail({
    to: email,
    userId,
    type: "APPROVAL",
    subject: "🎉 Your Portify AI creator account is ready!",
    html: buildBaseEmailTemplate({
      preheader: "Great news! Your account approval is complete.",
      title: "Account Approved",
      bodyHtml: `<p>We reviewed your registration form—welcome to the platform! Your space is ready for you to build, customize, and publish your professional portfolio showcase.</p>`,
      ctaText: "Launch Workspace",
      ctaUrl: APP_URL,
    }),
  });
}

export async function sendRejectionEmail(email: string, userId?: string) {
  if (!verifySpamGatePass(email)) return;

  return sendEmail({
    to: email,
    userId,
    type: "REJECTION",
    subject: "Update regarding your Portify AI account application",
    html: buildBaseEmailTemplate({
      preheader: "Your profile application state status updates.",
      title: "Application Status Update",
      bodyHtml: `
        <p>Thank you for your interest in Portify AI. At this time, our administration group was unable to approve your application queue entry.</p>
        <p>Common reasons for rejection include unverifiable registry listings, inadequate experience links, or duplicate applications. If you believe this was an error, please reach out to our support lines.</p>
      `,
    }),
  });
}

export async function sendBlockedEmail(email: string, userId?: string) {
  if (!verifySpamGatePass(email)) return;

  return sendEmail({
    to: email,
    userId,
    type: "SYSTEM",
    subject: "🚨 Important notice: Portify AI profile status change",
    html: buildBaseEmailTemplate({
      preheader: "Your administrative profile configuration has been suspended.",
      title: "Account Suspended",
      bodyHtml: `
        <p>This notification is to inform you that your Portify AI account profile has been suspended by an administrator due to platform guideline compliance monitoring.</p>
        <p>While suspended, public access pathways to your portfolios are temporarily offline and dashboard workspace access is closed.</p>
      `,
    }),
  });
}

export async function sendUnblockedEmail(email: string, userId?: string) {
  if (!verifySpamGatePass(email)) return;

  return sendEmail({
    to: email,
    userId,
    type: "SYSTEM",
    subject: "Your Portify AI profile access is fully restored",
    html: buildBaseEmailTemplate({
      preheader: "Good news! Your profile restriction has been cleared.",
      title: "Account Restored",
      bodyHtml: `<p>Following a verification review checklist audit, your administrative suspension holds have been entirely cleared. Your account, portfolios, and dashboard configurations are now fully live and accessible.</p>`,
      ctaText: "Open Dashboard",
      ctaUrl: APP_URL,
    }),
  });
}