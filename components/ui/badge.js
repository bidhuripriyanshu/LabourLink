import { cn } from "../../lib/utils";

export function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "bg-indigo-600 text-white border border-indigo-600",
    secondary: "bg-sky-50 text-sky-800 border border-sky-200",
    outline: "border border-slate-200 text-slate-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium sm:text-xs",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

