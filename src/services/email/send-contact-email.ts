import { sendEmail } from "@/lib/nodemailer";

export async function sendContactEmail({
  ownerEmail,
  visitorName,
  visitorEmail,
  subject,
  message,
}: {
  ownerEmail: string;
  visitorName: string;
  visitorEmail: string;
  subject?: string;
  message: string;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  await sendEmail({
    to: ownerEmail,
    subject: subject ?? "New Portfolio Contact Request",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Request</title>
        <style>
          body { margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; }
          .container { max-width: 520px; margin: 40px auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .logo { font-size: 20px; font-weight: 800; color: #0f172a; text-decoration: none; display: block; margin-bottom: 24px; }
          .title { font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; }
          .text { font-size: 15px; line-height: 24px; color: #334155; margin: 0 0 16px 0; }
          .meta-box { background: #f1f5f9; padding: 16px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0; }
          .meta-box p { margin: 4px 0; font-size: 14px; color: #334155; }
          .message-box { background: #f8fafc; padding: 16px; border-radius: 12px; border-left: 4px solid #111827; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #334155; white-space: pre-wrap; line-height: 22px; }
          .footer { margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 16px; font-size: 12px; color: #94a3b8; line-height: 18px; }
        </style>
      </head>
      <body>
        <div class="container">
          <a href="${appUrl}" class="logo">Portify AI</a>
          <h1 class="title">New Contact Request</h1>
          
          <p class="text">Someone would like to contact you through your Portify AI portfolio.</p>

          <div class="meta-box">
            <p><strong>Name:</strong> ${visitorName}</p>
            <p><strong>Email:</strong> ${visitorEmail}</p>
          </div>

          <p class="text"><strong>Message:</strong></p>
          <div class="message-box">${message}</div>

          <p class="text" style="margin-top: 24px;">
            You can contact the visitor directly using the email address provided above.
          </p>
          
          <div class="footer">
            <p>© 2026 Portify AI. Portfolio notification delivery hub.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}