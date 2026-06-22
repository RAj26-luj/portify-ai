import { getPortfolioByUsername } from "@/actions/portfolio";
import { recordView } from "@/actions/analytics";
import ThemeRenderer from "@/components/theme/theme-renderer";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadataBase = new URL(
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
);

interface Props {
  params: Promise<{
    username: string;
  }>;
}

export default async function PortfolioPage({
  params,
}: Props) {
  const { username } = await params;

  const result = await getPortfolioByUsername(username);

  if (!result.success || !result.data) {
    notFound();
  }

  const portfolio = result.data;

  if (
    !portfolio.isPublic ||
    portfolio.status !== "PUBLISHED"
  ) {
    notFound();
  }

  await recordView(portfolio.id);

  return (
    <ThemeRenderer
      key={
        portfolio.profileImage ||
        portfolio.updatedAt?.toString()
      }
      portfolio={portfolio}
      themeId={
        portfolio.themePreference?.activeTheme ||
        "DEFAULT"
      }
    />
  );
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { username } = await params;

  const result = await getPortfolioByUsername(username);

  if (!result.success || !result.data) {
    return {
      title: "Portfolio Not Found",
      description: "This portfolio is unavailable.",
    };
  }

  const portfolio = result.data;

  if (
    !portfolio.isPublic ||
    portfolio.status !== "PUBLISHED"
  ) {
    return {
      title: "Portfolio Not Found",
      description: "This portfolio is unavailable.",
    };
  }

 const title =
  portfolio.title ||
  portfolio.username ||
  "Protfolio";



const description =
  portfolio.resumeHeadline ||
  portfolio.tagline ||
  "Professional portfolio";

const image = `${process.env.NEXT_PUBLIC_APP_URL}/portfolio/${username}/opengraph-image`;

return {
  title,
  description,

  icons: {
    icon:
      portfolio.profileImage ||
      portfolio.coverImage ||
      "/icon.svg",
  },

  openGraph: {
    title,
    description,
    type: "website",
    images: [
      {
        url: image,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [image],
  },
};
}