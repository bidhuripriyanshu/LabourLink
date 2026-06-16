"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { en } from "./en";
import { hi } from "./hi";

const dictionaries = { en, hi };
const STORAGE_KEY = "labourlink-lang";

const LanguageContext = createContext({
  lang: "en",
  switchLang: () => {},
  t: (key) => key,
});

/**
 * LanguageProvider — wraps the app to provide i18n context.
 * Stores the user's preference in localStorage.
 */
export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");

  // Load saved preference on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && dictionaries[saved]) {
        setLang(saved);
      }
    } catch {
      // localStorage may be unavailable (SSR, private mode, etc.)
    }
  }, []);

  const switchLang = useCallback((newLang) => {
    if (dictionaries[newLang]) {
      setLang(newLang);
      try {
        localStorage.setItem(STORAGE_KEY, newLang);
      } catch {
        // ignore
      }
    }
  }, []);

  const toggle = useCallback(() => {
    switchLang(lang === "en" ? "hi" : "en");
  }, [lang, switchLang]);

  const t = useCallback(
    (key, replacements) => {
      let text = dictionaries[lang]?.[key] || dictionaries.en?.[key] || key;
      // Support simple {placeholder} replacements
      if (replacements) {
        Object.entries(replacements).forEach(([k, v]) => {
          text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        });
      }
      return text;
    },
    [lang]
  );

  const value = useMemo(
    () => ({ lang, switchLang, toggle, t }),
    [lang, switchLang, toggle, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * useLanguage — full context access (lang, switchLang, toggle, t)
 */
export function useLanguage() {
  return useContext(LanguageContext);
}

/**
 * useT — shorthand for just the translation function
 * Usage: const t = useT();  then t("key") or t("key", { count: 5 })
 */
export function useT() {
  const { t } = useContext(LanguageContext);
  return t;
}
