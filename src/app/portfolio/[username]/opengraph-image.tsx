import { ImageResponse } from "next/og";

import { getPortfolioByUsername } from "@/actions/portfolio";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType =
  "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{
    username: string;
  }>;
}) {
  const { username } =
    await params;

  const portfolio =
    await getPortfolioByUsername(
      username
    );

  if (!portfolio) {
    return new ImageResponse(
      <div>Portfolio Not Found</div>,
      size
    );
  }

  const title =
    portfolio.ogTitle ??
    portfolio.title ??
    portfolio.username;

  const subtitle =
    portfolio.ogSubtitle ??
    portfolio.tagline ??
    "";

  const description =
    portfolio.ogDescription ??
    portfolio.bio ??
    "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent:
            "center",
          padding: 80,
          background:
            "#0f172a",
          color: "white",
        }}
      >
        <h1
          style={{
            fontSize: 72,
            margin: 0,
          }}
        >
          {title}
        </h1>

        <p
          style={{
            fontSize: 36,
            marginTop: 24,
          }}
        >
          {subtitle}
        </p>

        <p
          style={{
            fontSize: 28,
            marginTop: 32,
          }}
        >
          {description}
        </p>
      </div>
    ),
    size
  );
}