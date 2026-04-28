// Lightweight client-side store for onboarding + progress (mocked persistence via localStorage).
import { useEffect, useState } from "react";

export type Board = "cbse" | "state";
export type Theme = "light" | "dark";
export type Language = "english" | "kannada" | "hindi" | "sanskrit" | "urdu" | "none";
export type Medium = "english" | "kannada";

export interface UserProfile {
  authed: boolean;
  guest: boolean;
  name: string;
  email?: string;
  theme: Theme;
  board?: Board;
  medium?: Medium; // state-board only
  firstLang?: Language;
  secondLang?: Language;
  thirdLang?: Language;
  onboarded: boolean;
}

export interface Progress {
  // key: `${subjectId}:${chapterIdx}` -> percent 0..100, plus `${subjectId}:${chapterIdx}:passed` boolean
  [key: string]: number | boolean;
}

const PROFILE_KEY = "bettr.profile";
const PROGRESS_KEY = "bettr.progress";

const DEFAULT_PROFILE: UserProfile = {
  authed: false,
  guest: false,
  name: "",
  theme: "light",
  onboarded: false,
};

function read<T>(k: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(k: string, v: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(k, JSON.stringify(v));
  window.dispatchEvent(new CustomEvent("bettr:store"));
}

export function getProfile(): UserProfile {
  return read(PROFILE_KEY, DEFAULT_PROFILE);
}
export function setProfile(p: Partial<UserProfile>) {
  const next = { ...getProfile(), ...p };
  write(PROFILE_KEY, next);
  applyTheme(next.theme);
  return next;
}
export function resetProfile() {
  write(PROFILE_KEY, DEFAULT_PROFILE);
}

export function getProgress(): Progress {
  return read<Progress>(PROGRESS_KEY, {});
}
export function setChapterProgress(subjectId: string, chapterIdx: number, percent: number) {
  const p = getProgress();
  p[`${subjectId}:${chapterIdx}`] = Math.max(0, Math.min(100, percent));
  write(PROGRESS_KEY, p);
}
export function passChapter(subjectId: string, chapterIdx: number) {
  const p = getProgress();
  p[`${subjectId}:${chapterIdx}:passed`] = true;
  p[`${subjectId}:${chapterIdx}`] = 100;
  write(PROGRESS_KEY, p);
}
export function isChapterPassed(subjectId: string, chapterIdx: number): boolean {
  return Boolean(getProgress()[`${subjectId}:${chapterIdx}:passed`]);
}
export function getChapterPercent(subjectId: string, chapterIdx: number): number {
  const v = getProgress()[`${subjectId}:${chapterIdx}`];
  return typeof v === "number" ? v : 0;
}
export function getSubjectPercent(subjectId: string, totalChapters: number): number {
  if (!totalChapters) return 0;
  let total = 0;
  for (let i = 0; i < totalChapters; i++) total += getChapterPercent(subjectId, i);
  return Math.round(total / totalChapters);
}

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const el = document.documentElement;
  if (theme === "dark") el.classList.add("dark");
  else el.classList.remove("dark");
}

// React hook
export function useProfile(): [UserProfile, (p: Partial<UserProfile>) => void] {
  const [p, setP] = useState<UserProfile>(DEFAULT_PROFILE);
  useEffect(() => {
    setP(getProfile());
    const h = () => setP(getProfile());
    window.addEventListener("bettr:store", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("bettr:store", h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return [p, (patch) => setP(setProfile(patch))];
}

export function useProgressTick() {
  const [, set] = useState(0);
  useEffect(() => {
    const h = () => set((n) => n + 1);
    window.addEventListener("bettr:store", h);
    return () => window.removeEventListener("bettr:store", h);
  }, []);
}
