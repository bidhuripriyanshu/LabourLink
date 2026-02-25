"use client";

import { useState } from "react";
import { cn } from "../../lib/utils";

export function Accordion({ className, children }) {
  return (
    <div className={cn("divide-y divide-zinc-100 rounded-2xl border border-zinc-100 bg-white", className)}>
      {children}
    </div>
  );
}

export function AccordionItem({ value, openItem, setOpenItem, children }) {
  const isOpen = openItem === value;
  return (
    <div className={cn("px-4 sm:px-5", isOpen ? "bg-zinc-50" : "")}>
      {typeof children === "function"
        ? children({ isOpen, toggle: () => setOpenItem(isOpen ? null : value) })
        : children}
    </div>
  );
}

export function useAccordionState(defaultValue = null) {
  const [openItem, setOpenItem] = useState(defaultValue);
  return { openItem, setOpenItem };
}

