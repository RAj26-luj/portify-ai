import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers/session-provider";

export const metadata: Metadata = {
  title: "Portify AI",
  description: "AI-Powered Portfolio Builder",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}