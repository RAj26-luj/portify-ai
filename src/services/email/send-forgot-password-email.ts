import { sendEmail } from "@/lib/nodemailer";
import { emailLayout } from "./templates";
export async function sendForgotPasswordEmail(
  email: string,
  token: string
) {
  const url =
    `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  await sendEmail({
    to: email,

    subject:
      "Reset your Portify AI password",

    html: emailLayout(
  "Reset Password",
  `
    <p>
      Click below to reset your password.
    </p>

    <a href="${url}">
      Reset Password
    </a>

    <p>
      This link expires in 1 hour.
    </p>
  `
),
  });
}