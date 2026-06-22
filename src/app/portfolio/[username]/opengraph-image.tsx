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

export default async function Image({
  params,
}: Props) {
  const username = decodeURIComponent(
    params.username
  );

  const result =
    await getPortfolioByUsername(username);

  if (!result.success || !result.data) {
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
          }}
        >
          Portfolio Not Found
        </div>
      ),
      size
    );
  }

  const portfolio = result.data;
  console.log("OG PORTFOLIO:", {
  username: portfolio.username,
  coverImage: portfolio.coverImage,
  profileImage: portfolio.profileImage,
  seoImage: portfolio.seoImage,
});

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
    "Professional Portfolio";

  const coverImage =
    portfolio.coverImage ||
    portfolio.profileImage ||
    null;

  const logo = new URL(
    "/portify-logo.svg",
    process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000"
  ).toString();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background:
            "linear-gradient(135deg,#0f172a,#1e293b)",
          color: "white",
          overflow: "hidden",
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
              top: 0,
              left: 0,
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
              "rgba(15,23,42,0.75)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 40,
            right: 40,
            display: "flex",
            alignItems: "center",
            gap: 16,
            zIndex: 10,
          }}
        >
          <img
            src={logo}
            width={60}
            height={60}
            alt="Portify AI"
          />

          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            Portify AI
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "80px",
            width: "100%",
            position: "relative",
            zIndex: 10,
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
                marginTop: 24,
                fontSize: 36,
                opacity: 0.9,
              }}
            >
              {subtitle}
            </div>
          )}

          {description && (
            <div
              style={{
                marginTop: 28,
                fontSize: 28,
                opacity: 0.75,
                maxWidth: 900,
              }}
            >
              {description.length > 180
                ? `${description.slice(
                    0,
                    180
                  )}...`
                : description}
            </div>
          )}

          <div
            style={{
              marginTop: 40,
              fontSize: 22,
              opacity: 0.65,
            }}
          >
            Portfolio • Projects • Skills •
            Experience
          </div>
        </div>
      </div>
    ),
    size
  );
}