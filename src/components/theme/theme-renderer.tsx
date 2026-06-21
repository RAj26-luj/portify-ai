"use client";

import { themeRegistry } from "@/lib/theme/registry";
import { useEffect, useState } from "react";
import { recordView } from "@/actions/analytics";

interface ThemeRendererProps {
  portfolio: any;
  themeId?: string;
}

export default function ThemeRenderer({ portfolio }: ThemeRendererProps) {
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [portfolio?.profileImage]);

  useEffect(() => {
    if (!portfolio?.id) return;

    const visitorHash =
      typeof window !== "undefined"
        ? localStorage.getItem("portfolio-visitor-id") ||
          crypto.randomUUID()
        : undefined;

    if (
      typeof window !== "undefined" &&
      visitorHash
    ) {
      localStorage.setItem(
        "portfolio-visitor-id",
        visitorHash
      );
    }

    recordView(portfolio.id, {
      visitorHash,
    });
  }, [portfolio?.id]);

  const themeKey =
  portfolio?.themePreference?.activeTheme
    ?.toLowerCase() || "default";

const Theme =
  themeRegistry[
    themeKey as keyof typeof themeRegistry
  ] || themeRegistry.default;

return (
  <Theme
    key={key}
    portfolio={portfolio}
  />
);
}