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
    portfolio.coverImage || portfolio.profileImage || null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          overflow: "hidden",
          background: "#000",
        }}
      >
        {coverImage ? (
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
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 40,
              background: "#111827",
            }}
          >
            No Cover Image
          </div>
        )}
      </div>
    ),
    size
  );
}