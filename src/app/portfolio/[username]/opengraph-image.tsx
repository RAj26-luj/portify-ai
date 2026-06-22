import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

interface Props {
  params: Promise<{
    username: string;
  }>;
}

export default async function Image({ params }: Props) {
  const { username } = await params;

  const portfolio = await prisma.portfolio.findFirst({
    where: {
      username,
    },
  });

  if (!portfolio) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0f172a",
            color: "white",
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          Portfolio Not Found
        </div>
      ),
      size
    );
  }

  const coverImage =
    portfolio.coverImage ||
    portfolio.profileImage ||
    new URL(
      "/icon.svg",
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    ).toString();

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          overflow: "hidden",
          position: "relative",
          background: "#000",
        }}
      >
        <img
          src={coverImage}
          alt="Cover"
          width={1200}
          height={630}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.15))",
          }}
        />

      
      </div>
    ),
    size
  );
}