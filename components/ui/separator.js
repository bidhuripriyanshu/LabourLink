import { cn } from "../../lib/utils";

export function Separator({ className, orientation = "horizontal" }) {
  return (
    <div
      className={cn(
        "bg-zinc-100",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
    />
  );
}

