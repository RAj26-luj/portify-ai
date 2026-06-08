import { getPortfolioByUsername } from "@/actions/portfolio";
import { getActiveTheme } from "@/actions/theme";
import type {
  Metadata,
} from "next";
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{
    username: string;
  }>;
}

export default async function PortfolioPage({
  params,
}: Props) {
  const { username } =
    await params;

  const portfolio =
    await getPortfolioByUsername(
      username
    );

  if (!portfolio) {
    return (
      <div className="p-10">
        Portfolio Not Found
      </div>
    );
  }

  const theme =
    await getActiveTheme(
      portfolio.id
    );

  const dark =
    theme?.darkMode;

  return (
    <main
      className={`mx-auto max-w-6xl p-8 ${
        dark
          ? "bg-black text-white"
          : ""
      }`}
    >
      <h1 className="text-5xl font-bold">
        {portfolio.title ??
          portfolio.username}
      </h1>

      {portfolio.tagline && (
        <p className="mt-4 text-xl">
          {portfolio.tagline}
        </p>
      )}

      <p className="mt-6">
        {portfolio.bio}
      </p>
      {portfolio.resume &&
  portfolio.allowResumeDownload && (
    <a
      href={`/api/resume/download?portfolioId=${portfolio.id}`}
      className="mt-6 inline-block rounded bg-blue-600 px-4 py-2 text-white"
    >
      Download Resume
    </a>
)}
      <div className="mt-10">
        <h2 className="mb-4 text-2xl font-semibold">
          Active Theme
        </h2>

        <p>
          {theme?.name ??
            "Default"}
        </p>
      </div>
    </main>
  );
}
export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { username } =
    await params;

  const portfolio =
    await getPortfolioByUsername(
      username
    );

  if (!portfolio) {
    return {
      title:
        "Portfolio Not Found",
    };
  }

  const title =
    portfolio.seoTitle ??
    portfolio.title ??
    portfolio.username;

  const description =
    portfolio.seoDescription ??
    portfolio.bio ??
    "Professional portfolio";

 const image =
  portfolio.seoImage ??
  `/portfolio/${username}/opengraph-image`;
  

  return {
    title,

    description,

    keywords:
      portfolio.seoKeywords
        ?.split(",")
       .map((k: string) =>
  k.trim()
) ?? [],

    openGraph: {
      title,
      description,
      images: image
        ? [image]
        : [],
      type: "website",
    },

    twitter: {
      card:
        "summary_large_image",
      title,
      description,
      images: image
        ? [image]
        : [],
    },
  };
}