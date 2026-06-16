"use client";

import { useState } from "react";
import { Globe2, Phone, Twitter, Send } from "lucide-react";
import { Separator } from "../components/ui/separator";
import { useT } from "../lib/i18n/LanguageContext";

export default function Footer() {
  const year = new Date().getFullYear();
  const [form, setForm] = useState({ name: "", role: "", rating: 5, message: "" });
  const [status, setStatus] = useState("idle");
  const t = useT();

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, rating: Number(form.rating) }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ name: "", role: "", rating: 5, message: "" });
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <footer className="border-t bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 text-[11px] text-slate-500 sm:px-6 sm:py-7 sm:text-xs">
        <div className="grid gap-6 sm:grid-cols-[1fr,1fr,1fr,1.6fr]">
          {/* About */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">
              LabourLink
            </p>
            <p className="max-w-md text-[11px] leading-relaxed text-slate-500 sm:text-xs">
              {t("footer.about")}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">
              {t("footer.product")}
            </p>
            <ul className="space-y-1">
              <li>
                <a href="/jobs" className="text-[11px] text-slate-500 transition-colors hover:text-indigo-600 sm:text-xs">
                  {t("footer.browseJobs")}
                </a>
              </li>
              <li>
                <a href="/register?role=CONTRACTOR" className="text-[11px] text-slate-500 transition-colors hover:text-indigo-600 sm:text-xs">
                  {t("footer.postJob")}
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-[11px] text-slate-500 transition-colors hover:text-indigo-600 sm:text-xs">
                  {t("footer.howItWorks")}
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">
              {t("footer.company")}
            </p>
            <ul className="space-y-1">
              <li><a href="#about" className="text-[11px] text-slate-500 transition-colors hover:text-indigo-600 sm:text-xs">{t("footer.aboutLink")}</a></li>
              <li><a href="/privacy" className="text-[11px] text-slate-500 transition-colors hover:text-indigo-600 sm:text-xs">{t("footer.privacy")}</a></li>
              <li><a href="/terms" className="text-[11px] text-slate-500 transition-colors hover:text-indigo-600 sm:text-xs">{t("footer.terms")}</a></li>
              <li><a href="/contact" className="text-[11px] text-slate-500 transition-colors hover:text-indigo-600 sm:text-xs">{t("footer.contact")}</a></li>
            </ul>
          </div>

          {/* Feedback form */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-600 bg-gray-100 px-3 py-1 rounded-full inline-block">
              {t("footer.feedback")}
            </p>
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={t("footer.yourName")}
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-[11px] text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder={t("footer.role")}
                  required
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-[11px] text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: e.target.value })}
                  className="rounded-md border border-slate-200 px-2 py-1.5 text-[11px] text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value={5}>★ 5</option>
                  <option value={4}>★ 4</option>
                  <option value={3}>★ 3</option>
                  <option value={2}>★ 2</option>
                  <option value={1}>★ 1</option>
                </select>
                <textarea
                  placeholder={t("footer.yourFeedback")}
                  required
                  rows={1}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-[11px] text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-1.5 text-[11px] font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
              >
                <Send className="h-3 w-3" />
                {status === "sending" ? t("footer.sending") : t("common.submit")}
              </button>
              {status === "sent" && (
                <p className="text-[10px] text-emerald-600 font-medium">{t("footer.thankYou")}</p>
              )}
              {status === "error" && (
                <p className="text-[10px] text-rose-600 font-medium">{t("footer.errorFeedback")}</p>
              )}
            </form>
          </div>
        </div>

        <Separator className="bg-slate-200" />

        <div className="flex flex-col items-center justify-between gap-2 text-center text-[11px] text-slate-400 sm:flex-row">
          <p>{t("footer.copyright", { year })}</p>
          <div className="flex items-center gap-3">
            <a href="/contact" className="inline-flex items-center gap-1 transition-colors hover:text-indigo-600">
              <Phone className="h-3 w-3" /><span>{t("footer.contact")}</span>
            </a>
            <a href="#" className="inline-flex items-center gap-1 transition-colors hover:text-indigo-600">
              <Globe2 className="h-3 w-3" /><span>{t("footer.website")}</span>
            </a>
            <a href="#" className="inline-flex items-center gap-1 transition-colors hover:text-indigo-600">
              <Twitter className="h-3 w-3" /><span>{t("footer.social")}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
