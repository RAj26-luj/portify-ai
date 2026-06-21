import nodemailer from "nodemailer";

import { prisma } from "./prisma";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: Number(process.env.SMTP_PORT) === 465,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

type EmailType =
  | "VERIFICATION"
  | "APPROVAL"
  | "REJECTION"
  | "PASSWORD_RESET"
  | "CONTACT_NOTIFICATION"
  | "SYSTEM";

export async function sendEmail({
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
  type?: EmailType;
}) {
  try {
 const result = await transporter.sendMail({
  from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
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

export async function verifyEmailTransport() {
  try {
    await transporter.verify();
    return true;
  } catch {
    return false;
  }
}