"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import IntroLoader from "./intro-loader";

export default function IntroLoaderProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isPortfolioRoute = pathname.startsWith("/portfolio/");

  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (isPortfolioRoute) {
    return <>{children}</>;
  }

  if (!ready) {
    return null;
  }

  return <>{children}</>;
}
