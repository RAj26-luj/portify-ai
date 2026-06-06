import { sendEmail } from "@/lib/nodemailer";
import { emailLayout } from "./templates";

export async function sendVerificationEmail(
  email: string,
  token: string
) {
  const url =
    `${process.env.NEXTAUTH_URL}/verify?token=${token}`;

  await sendEmail({
    to: email,

    subject:
      "Verify your Portify AI account",

    html: emailLayout(
  "Verify Your Account",
  `
    <p>
      Click below to verify your account.
    </p>

    <a href="${url}">
      Verify Account
    </a>
  `
),
  });
}