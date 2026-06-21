"use client";

import { useCallback, useState } from "react";

type Analytics = {
  totalViews: number;
  uniqueVisitors: number;
  resumeDownloads: number;
  contactRequests: number;
  projectClicks: number;
};

export function useAnalytics(portfolioId?: string) {
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (!portfolioId) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/analytics?portfolioId=${portfolioId}`, {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to fetch analytics");
      }

      setAnalytics(data?.data ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch analytics");
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  }, [portfolioId]);

  return {
    analytics,
    loading,
    error,
    fetchAnalytics,
    setAnalytics,
  };
}