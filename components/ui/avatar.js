import { cn } from "../../lib/utils";

export function Avatar({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-xs font-medium text-emerald-800",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

