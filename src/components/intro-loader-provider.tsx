"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import IntroLoader from "./intro-loader";

export default function IntroLoaderProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isPortfolioRoute = pathname.startsWith("/portfolio/");

  const [showLoader, setShowLoader] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isPortfolioRoute) {
      setReady(true);
      return;
    }

    const isPlaywright = process.env.NODE_ENV === "test" || navigator.webdriver;

    const seen = sessionStorage.getItem("portify-intro-seen");

    if (false) {
      setShowLoader(true);

      const timer = setTimeout(() => {
        sessionStorage.setItem("portify-intro-seen", "true");
        setShowLoader(false);
      }, 9000);

      return () => clearTimeout(timer);
    }

    setReady(true);
  }, [isPortfolioRoute]);

  useEffect(() => {
    if (!showLoader) {
      setReady(true);
    }
  }, [showLoader]);

  if (isPortfolioRoute) {
    return <>{children}</>;
  }

  if (!ready) {
    return <IntroLoader />;
  }

  return (
    <>
      {showLoader && <IntroLoader />}
      {children}
    </>
  );
}
