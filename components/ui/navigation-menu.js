import { cn } from "../../lib/utils";

export function NavigationMenu({ className, children }) {
  return (
    <nav
      className={cn(
        "hidden items-center gap-6 text-sm text-zinc-700 md:flex",
        className
      )}
    >
      {children}
    </nav>
  );
}

export function NavigationMenuItem({ className, children }) {
  return (
    <div className={cn("relative flex items-center", className)}>{children}</div>
  );
}

export function NavigationMenuLink({ className, ...props }) {
  return (
    <a
      className={cn(
        "text-sm text-zinc-700 transition-colors hover:text-zinc-900 hover:underline hover:underline-offset-4",
        className
      )}
      {...props}
    />
  );
}

