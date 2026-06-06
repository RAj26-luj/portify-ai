import { sendEmail } from "@/lib/nodemailer";
import { emailLayout } from "./templates";
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
  await sendEmail({
    to: ownerEmail,

    subject:
      subject ??
      "New Contact Message",

   html: emailLayout(
  "New Portfolio Message",
  `
    <p>
      <strong>Name:</strong>
      ${visitorName}
    </p>

    <p>
      <strong>Email:</strong>
      ${visitorEmail}
    </p>

    <p>
      <strong>Message:</strong>
    </p>

    <p>
      ${message}
    </p>
  `
),
  });
}