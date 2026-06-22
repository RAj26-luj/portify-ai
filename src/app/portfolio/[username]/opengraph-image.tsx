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

export default async function Image({
  params,
}: Props) {
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

  const title =
    portfolio.ogTitle ||
    portfolio.title ||
    portfolio.username;

  const subtitle =
    portfolio.ogSubtitle ||
    portfolio.tagline ||
    portfolio.currentRole ||
    "";

  const description =
    portfolio.ogDescription ||
    portfolio.bio ||
    "";

  const coverImage =
    portfolio.coverImage ||
    portfolio.profileImage ||
    null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#0f172a",
          color: "white",
        }}
      >
        {coverImage && (
          <img
            src={coverImage}
            alt="Cover"
            width={1200}
            height={630}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(15,23,42,0.92), rgba(15,23,42,0.65))",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
            padding: "80px",
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.1,
              maxWidth: 900,
            }}
          >
            {title}
          </div>

          {subtitle && (
            <div
              style={{
                marginTop: 20,
                fontSize: 34,
                opacity: 0.95,
                maxWidth: 900,
              }}
            >
              {subtitle}
            </div>
          )}

          {description && (
            <div
              style={{
                marginTop: 30,
                fontSize: 26,
                lineHeight: 1.4,
                opacity: 0.85,
                maxWidth: 850,
              }}
            >
              {description.length > 220
                ? `${description.slice(0, 220)}...`
                : description}
            </div>
          )}
        </div>
      </div>
    ),
    size
  );
}