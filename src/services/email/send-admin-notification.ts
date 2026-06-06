import { sendEmail } from "@/lib/nodemailer";
import { emailLayout } from "./templates";
export async function sendAdminNotification(
  subject: string,
  message: string
) {
  const adminEmail =
    process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    return;
  }

  await sendEmail({
    to: adminEmail,
    subject,
   html: emailLayout(
  "Admin Notification",
  `
    <p>
      ${message}
    </p>
  `
),
  });
}