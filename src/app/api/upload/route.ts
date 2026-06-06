import { NextResponse } from "next/server";

import {
  uploadImage,
  uploadFile,
} from "@/lib/upload";

export async function POST(
  req: Request
) {
  try {
    const body =
      await req.json();

    const {
      file,
      folder,
      type,
    } = body;

    const result =
      type === "image"
        ? await uploadImage(
            file,
            folder
          )
        : await uploadFile(
            file,
            folder
          );

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