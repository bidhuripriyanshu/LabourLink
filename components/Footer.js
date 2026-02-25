import { Globe2, MessageCircle, Phone, Twitter } from "lucide-react";
import { Separator } from "../components/ui/separator";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 text-[11px] text-slate-500 sm:px-6 sm:py-7 sm:text-xs">
        <div className="grid gap-4 sm:grid-cols-[2fr,1.2fr,1.2fr]">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            LabourLink
            </p>
            <p className="max-w-md text-[11px] leading-relaxed text-slate-500 sm:text-xs">
              A simple, mobile‑first platform that helps daily wage labourers
              find nearby work and helps contractors hire trusted, verified
              workers without middlemen.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Product
            </p>
            <ul className="space-y-1">
              <li>
                <a
                  href="/jobs"
                  className="text-[11px] text-slate-500 hover:text-indigo-700 sm:text-xs"
                >
                  Browse jobs
                </a>
              </li>
              <li>
                <a
                  href="/register?role=CONTRACTOR"
                  className="text-[11px] text-slate-500 hover:text-indigo-700 sm:text-xs"
                >
                  Post a job
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-[11px] text-slate-500 hover:text-indigo-700 sm:text-xs"
                >
                  How it works
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Company
            </p>
            <ul className="space-y-1">
              <li>
                <a
                  href="#about"
                  className="text-[11px] text-slate-500 hover:text-indigo-700 sm:text-xs"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="text-[11px] text-slate-500 hover:text-indigo-700 sm:text-xs"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-[11px] text-slate-500 hover:text-indigo-700 sm:text-xs"
                >
                  Terms
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-[11px] text-slate-500 hover:text-indigo-700 sm:text-xs"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="bg-slate-200" />

        <div className="flex flex-col items-center justify-between gap-2 text-center text-[11px] text-slate-400 sm:flex-row">
            <p>© {year} LabourLink. All rights reserved.</p>
            <div className="flex items-center gap-3">
            <a href="/contact" className="inline-flex items-center gap-1 hover:text-indigo-700">
              <Phone className="h-3 w-3" />
              <span>Contact</span>
            </a>
            <a href="https://example.com" className="inline-flex items-center gap-1 hover:text-indigo-700">
              <Globe2 className="h-3 w-3" />
              <span>Website</span>
            </a>
            <a href="https://x.com" className="inline-flex items-center gap-1 hover:text-indigo-700">
              <Twitter className="h-3 w-3" />
              <span>Social</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

