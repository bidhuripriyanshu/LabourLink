import { cn } from "../../lib/utils";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn("border-b px-5 py-4 sm:px-6 sm:py-5", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn("text-sm font-semibold text-slate-900 sm:text-base", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }) {
  return (
    <div className={cn("px-5 py-4 sm:px-6 sm:py-5", className)} {...props} />
  );
}

