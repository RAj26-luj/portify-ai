import { ImageResponse } from "next/og";
import { getPortfolioByUsername } from "@/actions/portfolio";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

interface Props {
  params: {
    username: string;
  };
}

export default async function Image({ params }: Props) {
  const result = await getPortfolioByUsername(params.username);

  if (!result.success || !result.data) {
    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 48,
        }}
      >
        Portfolio Not Found
      </div>,
      size
    );
  }

  const portfolio = result.data;

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
          justifyContent: "center",
          padding: 80,
          background: "#0f172a",
          color: "white",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700 }}>
          {title}
        </div>

        {subtitle && (
          <div
            style={{
              fontSize: 36,
              marginTop: 20,
              opacity: 0.9,
            }}
          >
            {subtitle}
          </div>
        )}

        {description && (
          <div
            style={{
              fontSize: 28,
              marginTop: 30,
              opacity: 0.8,
            }}
          >
            {description}
          </div>
        )}
      </div>
    ),
    size
  );
}