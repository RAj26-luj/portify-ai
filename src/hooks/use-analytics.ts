"use client";

import { useState } from "react";

export function useAnalytics() {
  const [loading, setLoading] =
    useState(false);

  return {
    loading,
    setLoading,
  };
}