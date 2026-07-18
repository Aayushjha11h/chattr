"use client";

import { useEffect, useCallback } from "react";

export function useKeyboard(shortcuts: Record<string, () => void>) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const modifier = e.metaKey || e.ctrlKey ? "cmd+" : e.altKey ? "alt+" : "";
      const combo = `${modifier}${key}`;

      if (shortcuts[combo]) {
        e.preventDefault();
        shortcuts[combo]();
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}