"use client";

import { useState } from "react";

export function usePortfolio() {
  const [loading, setLoading] =
    useState(false);

  return {
    loading,
    setLoading,
  };
}