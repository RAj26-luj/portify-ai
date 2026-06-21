import type { Metadata } from "next";

type SeoProps = {
  title?: string;
  description?: string;
  image?: string;
  keywords?: string;
  url?: string;
};

export function buildSeo({
  title,
  description,
  image,
  keywords,
  url,
}: SeoProps): Metadata {
  const siteName =
    "Portify AI";

  const seoTitle =
    title ??
    "Portify AI";

  const seoDescription =
    description ??
    "Build and manage professional portfolios with Portify AI.";

  const seoImage =
    image ??
    "/og-image.png";

  return {
    title: seoTitle,

    description:
      seoDescription,

    keywords,

    openGraph: {
      title: seoTitle,
      description:
        seoDescription,
      url,
      siteName,
      images: [
        {
          url: seoImage,
        },
      ],
      type: "website",
    },

    twitter: {
      card:
        "summary_large_image",
      title: seoTitle,
      description:
        seoDescription,
      images: [seoImage],
    },
  };
}