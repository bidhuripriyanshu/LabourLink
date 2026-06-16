"use client";

import { useLanguage } from "../lib/i18n/LanguageContext";
import { Globe2 } from "lucide-react";

/**
 * LangToggle — a pill-shaped button to switch between English and Hindi.
 * Shows the *other* language name to switch to.
 */
export default function LangToggle({ className = "" }) {
  const { lang, toggle } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={lang === "en" ? "Switch to Hindi" : "Switch to English"}
      className={`group inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-md active:scale-[0.96] ${className}`}
    >
      <Globe2 className="h-3.5 w-3.5 text-slate-400 transition-colors group-hover:text-indigo-500" />
      <span>{lang === "en" ? "हिंदी" : "English"}</span>
    </button>
  );
}
