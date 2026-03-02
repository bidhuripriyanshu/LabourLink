"use client";

import { createContext, useContext, useState } from "react";
import { cn } from "../../lib/utils";
import { X } from "lucide-react";

const SheetContext = createContext(null);

export function Sheet({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
}

export function SheetTrigger({ children, className }) {
  const ctx = useContext(SheetContext);
  if (!ctx) return null;

  const { setOpen } = ctx;

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Open menu"
      className={cn(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50 md:hidden",
        className
      )}
    >
      {children}
    </button>
  );
}

export function SheetContent({ children, side = "left", title }) {
  const ctx = useContext(SheetContext);
  if (!ctx) return null;

  const { open, setOpen } = ctx;

  return (
    <>
      <div
        role="presentation"
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-out md:hidden",
          open ? "visible opacity-100" : "invisible opacity-0"
        )}
        onClick={() => setOpen(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title || "Navigation menu"}
        className={cn(
          "fixed top-0 z-50 flex h-full w-[min(20rem,85vw)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out md:hidden",
          side === "left"
            ? "left-0"
            : "right-0",
          open
            ? "translate-x-0"
            : side === "left"
              ? "-translate-x-full"
              : "translate-x-full"
        )}
      >
        {children}
      </div>
    </>
  );
}

export function useSheet() {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error("useSheet must be used within Sheet");
  return ctx;
}