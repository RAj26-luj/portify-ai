"use server";
import { sendEmail } from "@/lib/nodemailer";

export async function sendAdminNotification(subject: string, message: string) {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    return;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  await sendEmail({
    to: adminEmail,
    subject,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Notification</title>
        <style>
          body { margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; }
          .container { max-width: 520px; margin: 40px auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .logo { font-size: 20px; font-weight: 800; color: #0f172a; text-decoration: none; display: block; margin-bottom: 24px; }
          .title { font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; }
          .text { font-size: 15px; line-height: 24px; color: #334155; margin: 0 0 16px 0; }
          .message-box { background: #f8fafc; padding: 16px; border-radius: 12px; border-left: 4px solid #111827; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #334155; white-space: pre-wrap; line-height: 22px; margin: 20px 0; }
          .footer { margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 16px; font-size: 12px; color: #94a3b8; line-height: 18px; }
        </style>
      </head>
      <body>
        <div class="container">
          <a href="${appUrl}" class="logo">Portify AI</a>
          <h1 class="title">Admin Notification</h1>
          
          <p class="text">A new system notification requires your attention.</p>

          <div class="message-box">${message}</div>

          <p class="text">Generated automatically by Portify AI.</p>
          
          <div class="footer">
            <p>© 2026 Portify AI. Internal System Automation Node.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}
