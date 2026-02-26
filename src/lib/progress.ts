"use client";

import { useState, useCallback } from "react";

export interface ProgressEntry {
  contentType: "module" | "lab";
  contentId: string;
  startedAt: string;
  completedAt: string | null;
  percent: number;
}

const STORAGE_KEY = "ai-escuela-progress";

function readLocalProgress(): Record<string, ProgressEntry> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeLocalProgress(entries: Record<string, ProgressEntry>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function entryKey(contentType: string, contentId: string): string {
  return `${contentType}:${contentId}`;
}

export function useProgress() {
  const [entries, setEntries] = useState<Record<string, ProgressEntry>>(() => readLocalProgress());
  const loading = false;

  const getProgress = useCallback(
    (contentType: string, contentId: string): ProgressEntry | undefined => {
      return entries[entryKey(contentType, contentId)];
    },
    [entries],
  );

  const updateProgress = useCallback(
    async (contentType: "module" | "lab", contentId: string, percent: number) => {
      const key = entryKey(contentType, contentId);
      const existing = entries[key];
      const now = new Date().toISOString();

      const entry: ProgressEntry = {
        contentType,
        contentId,
        startedAt: existing?.startedAt || now,
        completedAt: percent >= 100 ? now : null,
        percent: Math.min(100, Math.max(0, percent)),
      };

      const updated = { ...entries, [key]: entry };
      setEntries(updated);
      writeLocalProgress(updated);

      try {
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entry),
        });
      } catch {
        // localStorage is source of truth; server sync is best-effort
      }
    },
    [entries],
  );

  const allEntries = Object.values(entries);
  const totalItems = allEntries.length;
  const globalPercent =
    totalItems > 0 ? Math.round(allEntries.reduce((sum, e) => sum + e.percent, 0) / totalItems) : 0;

  return {
    entries: allEntries,
    loading,
    getProgress,
    updateProgress,
    globalPercent,
  };
}
