import nodemailer from "nodemailer";

import { prisma } from "./prisma";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: Number(process.env.SMTP_PORT) === 465,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export { transporter };

type MailType =
  | "VERIFICATION"
  | "APPROVAL"
  | "REJECTION"
  | "PASSWORD_RESET"
  | "DELETE_ACCOUNT"
  | "CONTACT_NOTIFICATION"
  | "SYSTEM";

export async function sendMail({
  to,
  subject,
  html,
  userId,
  type = "SYSTEM",
}: {
  to: string;
  subject: string;
  html: string;
  userId?: string;
  type?: MailType;
}) {
  try {
    const result = await transporter.sendMail({
      from:
        process.env.SMTP_FROM ??
        process.env.SMTP_USER,
      to,
      subject,
      html,
    });

    await prisma.emailLog.create({
      data: {
        userId,
        recipient: to,
        subject,
        type,
        status: "SENT",
        sentAt: new Date(),
      },
    });

    return result;
  } catch (error) {
    await prisma.emailLog.create({
      data: {
        userId,
        recipient: to,
        subject,
        type,
        status: "FAILED",
      },
    });

    throw error;
  }
}

export async function sendDeleteAccountCodeEmail({
  email,
  code,
  userId,
}: {
  email: string;
  code: string;
  userId?: string;
}) {
  return sendMail({
    to: email,
    userId,
    type: "DELETE_ACCOUNT",
    subject: "Delete Account Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Delete Account Verification</h2>

        <p>You requested to permanently delete your Portify AI account.</p>

        <p>Enter the verification code below to continue:</p>

        <div style="margin: 24px 0; text-align: center;">
          <div
            style="
              display: inline-block;
              padding: 16px 32px;
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              border-radius: 8px;
              background: #f3f4f6;
            "
          >
            ${code}
          </div>
        </div>

        <p>This code expires when your session ends.</p>

        <p>If you did not request account deletion, you can safely ignore this email.</p>
      </div>
    `,
  });
}

export async function sendChangePasswordCodeEmail({
  email,
  code,
  userId,
}: {
  email: string;
  code: string;
  userId?: string;
}) {
  return sendMail({
    to: email,
    userId,
    type: "PASSWORD_RESET",
    subject: "Password Change Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Change Verification</h2>

        <p>You requested to change your Portify AI password.</p>

        <p>Enter the verification code below to continue:</p>

        <div style="margin: 24px 0; text-align: center;">
          <div
            style="
              display: inline-block;
              padding: 16px 32px;
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              border-radius: 8px;
              background: #f3f4f6;
            "
          >
            ${code}
          </div>
        </div>

        <p>This code expires when your session ends.</p>

        <p>If you did not request a password change, you can safely ignore this email.</p>
      </div>
    `,
  });
}

export async function verifyMailConnection() {
  try {
    await transporter.verify();
    return true;
  } catch {
    return false;
  }
}