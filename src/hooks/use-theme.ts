"use client";

import { useState } from "react";

export function useTheme() {
  const [theme, setTheme] =
    useState("default");

  return {
    theme,
    setTheme,
  };
}