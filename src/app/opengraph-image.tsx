import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  const logo = new URL(
    "/logo.png", // put your logo png in public/logo.png
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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg,#0f172a,#1e293b)",
          color: "white",
        }}
      >
        <img
          src={logo}
          width={220}
          height={220}
          alt="Portify AI"
          style={{
            marginBottom: 40,
          }}
        />

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
            marginTop: 16,
            opacity: 0.9,
          }}
        >
          Build Stunning Portfolio Websites
        </div>

        <div
          style={{
            fontSize: 24,
            marginTop: 24,
            opacity: 0.75,
          }}
        >
          Resume → Portfolio • Multiple Themes • Projects • Skills
        </div>
      </div>
    ),
    size
  );
}