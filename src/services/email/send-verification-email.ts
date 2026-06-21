import { sendEmail } from "@/lib/nodemailer";

export async function sendVerificationEmail(
  email: string,
  token: string,
  userId?: string
) {
  const code = token;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  await sendEmail({
    to: email,
    userId,
    type: "VERIFICATION",
    subject: "Verify your Portify AI account",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Account</title>
        <style>
          body { margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; }
          .container { max-width: 520px; margin: 40px auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .logo { font-size: 20px; font-weight: 800; color: #0f172a; text-decoration: none; display: block; margin-bottom: 24px; }
          .title { font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; }
          .text { font-size: 15px; line-height: 24px; color: #334155; margin: 0 0 16px 0; }
          .code-box { margin: 30px 0; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #0f172a; background-color: #f1f5f9; padding: 16px; border-radius: 12px; font-family: monospace; }
          .footer { margin-top: 32px; border-top: 1px solid #f1f5f9; pt: 16px; font-size: 12px; color: #94a3b8; line-height: 18px; }
        </style>
      </head>
      <body>
        <div class="container">
          <a href="${appUrl}" class="logo">Portify AI</a>
          <h1 class="title">Verify Your Account</h1>
          
          <p class="text">Welcome to Portify AI.</p>
          <p class="text">Enter the verification code below on the verification page to activate your account.</p>

          <div class="code-box">${code}</div>

          <p class="text">If you did not create this account, you can safely ignore this email.</p>
          
          <div class="footer">
            <p>© 2026 Portify AI. Secure platform notification.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}