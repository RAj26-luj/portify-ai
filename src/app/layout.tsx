import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers/session-provider";
import IntroLoaderProvider from "@/components/intro-loader-provider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),

  title: "Portify AI",

  description:
    "Create stunning developer portfolios from your resume. Showcase projects, skills, achievements, certifications, analytics, and more.",

  openGraph: {
    title: "Portify AI",
    description: "Create stunning developer portfolios from your resume.",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Portify AI",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Portify AI",
    description: "Create stunning developer portfolios from your resume.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <IntroLoaderProvider>{children}</IntroLoaderProvider>
        </Providers>
      </body>
    </html>
  );
}
