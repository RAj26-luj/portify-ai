"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./use-auth";
import type { Portfolio } from "@prisma/client";

type PortfolioWithRelations = Portfolio & {
  resume?: any;
  analytics?: any;
  themePreference?: any;
  sectionSettings?: any[];
  media?: any[];
  projects?: any[];
  educations?: any[];
  experiences?: any[];
  skills?: any[];
  skillCategories?: any[];
  achievements?: any[];
  certifications?: any[];
  publications?: any[];
  testimonials?: any[];
  socialLinks?: any[];
  codingProfiles?: any[];
  customSections?: any[];
  openSourceProjects?: any[];
  contactMessages?: any[];
  views?: any[];
  resumeDownloads?: any[];
  projectClicks?: any[];
  snapshots?: any[];
  themeHistories?: any[];
  resumeVersions?: any[];
  reports?: any[];
};

export function usePortfolio() {
  const { user, authenticated } = useAuth();

  const [portfolio, setPortfolio] = useState<PortfolioWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/portfolio/me", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to fetch portfolio");
      }

      setPortfolio(data?.data ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch portfolio");
      setPortfolio(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated && user?.id) {
      fetchPortfolio();
    } else {
      setPortfolio(null);
      setLoading(false);
    }
  }, [authenticated, user?.id, fetchPortfolio]);

  return {
    portfolio,
    setPortfolio,
    loading,
    error,
    refetch: fetchPortfolio,
  };
}