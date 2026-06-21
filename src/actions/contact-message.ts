"use server";

import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { getPortfolioId } from "@/lib/get-portfolio-id";
import {
  createContactMessage as createMessage,
  getContactMessages as getMessages,
  markMessageAsSeen,
  deleteMessage,
} from "@/services/contact";

/**
 * Transforms inbox dispatch validation, anti-bot Cloudflare challenges, or rate limit 
 * violations into structured, client-friendly feedback optimized for instant UI alerts.
 */
function handleContactServerError(error: any, fallbackMessage: string) {
  console.error("Contact Message Service Server Exception:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  if (errorMessage.includes("portfolioId required") || errorMessage.includes("portfolioId not found")) {
    return { success: false, error: "Inbox connection failed. Could not find a destination portfolio profile." };
  }
  if (errorMessage.includes("Verification required")) {
    return { success: false, error: "Security check required. Please complete the anti-bot verification checkbox." };
  }
  if (errorMessage.includes("Verification failed")) {
    return { success: false, error: "Security validation failed. Cloudflare verification rejected this token signature." };
  }
  if (errorMessage.includes("Too many messages")) {
    return { success: false, error: "Rate limit reached. Too many contact attempts have been sent from this email address. Please try again later." };
  }
  if (errorMessage.includes("Prisma") || errorMessage.includes("database") || errorMessage.includes("Mongo")) {
    return { success: false, error: "The background mailbox registry is currently performing maintenance logs. Please resend shortly." };
  }

  return { success: false, error: fallbackMessage };
}

export async function createContactMessage(data: {
  portfolioId: string;
  visitorName: string;
  visitorEmail: string;
  note?: string;
  turnstileToken: string;
}) {
  try {
    const resolvedPortfolioId = data.portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return { success: false, error: "Target recipient portfolio profile matching identity was not found." };
    }

    if (!data.visitorName) {
      return { success: false, error: "Sender name context is required to route message records." };
    }

    if (!data.visitorEmail) {
      return { success: false, error: "Sender email address parameters must be supplied to allow correspondence replies." };
    }

    if (!data.turnstileToken) {
      return { success: false, error: "Security authorization challenge checkbox must be fully verified." };
    }

    const verification = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: process.env.TURNSTILE_SECRET_KEY ?? "",
          response: data.turnstileToken,
        }),
      }
    );

    const result = await verification.json();

    if (!result.success) {
      return { success: false, error: "Security handshake error. Security automated verification challenge failed." };
    }

    const emailLimit = rateLimit(
      `contact-email:${data.visitorEmail.toLowerCase()}`,
      3,
      60 * 60 * 1000
    );

    if (!emailLimit.success) {
      return { success: false, error: "Submission frequency limit reached. Please wait an hour before attempting further contact records." };
    }

    const payload = await createMessage({
      portfolioId: resolvedPortfolioId,
      visitorName: data.visitorName,
      visitorEmail: data.visitorEmail,
      note: data.note,
    });

    return { success: true, data: payload };
  } catch (error) {
    return handleContactServerError(error, "Failed to compile background transmission dispatch message record.");
  }
}

export async function getContactMessages(portfolioId: string) {
  try {
    const resolvedPortfolioId = portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return {
        success: false,
        error: "Unable to retrieve conversation feeds. Portfolio parameter mapping context is unresolved.",
        data: []
      };
    }

    const data = await getMessages(resolvedPortfolioId);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to query historical communication streams feed registry:", error);
    return {
      success: false,
      error: "Failed to assemble contact communications pipeline ledger stack feed.",
      data: []
    };
  }
}

export async function markContactMessageSeen(id: string) {
  try {
    if (!id) {
      return { success: false, error: "Missing distinct letter parameter entry string target key." };
    }

    const result = await markMessageAsSeen(id);
    return { success: true, data: result };
  } catch (error) {
    return handleContactServerError(error, "Failed to commit visual reading index updates to database timeline logs.");
  }
}

export async function deleteContactMessage(id: string) {
  try {
    if (!id) {
      return { success: false, error: "Missing targeted inbox trace tracking signature reference key." };
    }

    const result = await deleteMessage(id);
    return { success: true, data: result };
  } catch (error) {
    return handleContactServerError(error, "The specified correspondence history thread row could not be successfully cleared.");
  }
}

export async function getUnreadContactMessageCount(portfolioId: string) {
  try {
    const resolvedPortfolioId = portfolioId || (await getPortfolioId());

    if (!resolvedPortfolioId) {
      return { success: true, data: 0 };
    }

    const count = await prisma.contactMessage.count({
      where: {
        portfolioId: resolvedPortfolioId,
        isSeen: false,
      },
    });

    return { success: true, data: count };
  } catch (error) {
    console.error("Error executing mathematical calculations for aggregate notifications badge layout:", error);
    return {
      success: false,
      error: "Could not compile quantitative calculation for alert badge feeds.",
      data: 0
    };
  }
}