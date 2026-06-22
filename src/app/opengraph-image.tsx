import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
 const logo = "/portify-logo.svg";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0f172a, #1e293b)",
          color: "white",
          padding: 80,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 40,
          }}
        >
          <img
            src={logo}
            width={180}
            height={180}
            alt="Portify AI"
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontSize: 72,
                fontWeight: 800,
              }}
            >
              Portify AI
            </div>

            <div
              style={{
                fontSize: 32,
                marginTop: 12,
                opacity: 0.9,
              }}
            >
              Build Stunning Portfolio Websites
            </div>

            <div
              style={{
                fontSize: 24,
                marginTop: 20,
                opacity: 0.75,
                maxWidth: 700,
              }}
            >
              Resume → Portfolio • Multiple Themes •
              Projects • Skills • Achievements • Analytics
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}