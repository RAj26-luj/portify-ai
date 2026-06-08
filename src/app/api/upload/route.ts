import { NextResponse } from "next/server";

import { auth } from "@/auth";

import {
  uploadDocument,
  uploadImage,
  uploadVideo,
} from "@/lib/upload";

import { rateLimit } from "@/lib/rate-limit";

const folders = [
  "profiles",
  "covers",
  "projects",
  "certificates",
  "resumes",
  "videos",
];

export async function POST(
  req: Request
) {
  try {
    const session =
      await auth();

    if (
      !session?.user?.id
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const ip =
      req.headers.get(
        "x-forwarded-for"
      ) ?? "unknown";

    const limit =
      rateLimit(
        `upload:${ip}`,
        20,
        60_000
      );

    if (!limit.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Too many upload requests",
        },
        {
          status: 429,
        }
      );
    }

    const body =
      await req.json();

    const {
      file,
      folder,
      type,
    } = body;

    if (
      !file ||
      !folder ||
      !type
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !folders.includes(
        folder
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid folder",
        },
        {
          status: 400,
        }
      );
    }

    let result;

    switch (type) {
      case "image":
        result =
          await uploadImage(
            file,
            folder
          );
        break;

      case "document":
        result =
          await uploadDocument(
            file,
            folder
          );
        break;

      case "video":
        result =
          await uploadVideo(
            file,
            folder
          );
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            error:
              "Invalid upload type",
          },
          {
            status: 400,
          }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Upload failed",
      },
      {
        status: 500,
      }
    );
  }
}