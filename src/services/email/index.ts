import { sendEmail } from "@/lib/nodemailer";

export async function sendVerificationEmail(
  email: string,
  token: string
) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  return sendEmail({
    to: email,
    subject: "Verify Your Email",
    html: `
      <h2>Verify Your Email</h2>
      <p>Click below to verify your account.</p>
      <a href="${url}">
        Verify Email
      </a>
    `,
  });
}

export async function sendResetPasswordEmail(
  email: string,
  token: string
) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  return sendEmail({
    to: email,
    subject: "Reset Password",
    html: `
      <h2>Reset Password</h2>
      <p>Click below to reset your password.</p>
      <a href="${url}">
        Reset Password
      </a>
    `,
  });
}

export async function sendApprovalEmail(
  email: string
) {
  return sendEmail({
    to: email,
    subject: "Account Approved",
    html: `
      <h2>Account Approved</h2>
      <p>Your account has been approved.</p>
    `,
  });
}

export async function sendRejectionEmail(
  email: string
) {
  return sendEmail({
    to: email,
    subject: "Account Rejected",
    html: `
      <h2>Account Rejected</h2>
      <p>Your account was rejected by admin.</p>
    `,
  });
}