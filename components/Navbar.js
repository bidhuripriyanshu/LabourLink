"use client";

import { useSession, signOut } from "next-auth/react";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink } from "./ui/navigation-menu";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger, useSheet } from "./ui/sheet";
import { Separator } from "./ui/separator";
import { X, Menu } from "lucide-react";

function MobileNavContent() {
  const { setOpen } = useSheet();
  const { data: session } = useSession();
  const close = () => setOpen(false);

  const navLinks = [
    { href: "/jobs", label: "Jobs" },
    { href: "#how-it-works", label: "How it works" },
    { href: "#about", label: "About" },
  ];

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
        <span className="text-sm font-semibold text-slate-900">Menu</span>
        <button
          type="button"
          onClick={close}
          aria-label="Close menu"
          className="-mr-2 flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-4 py-5">
        {navLinks.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            onClick={close}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-white hover:text-indigo-600"
          >
            {label}
          </a>
        ))}
        <Separator className="my-3 bg-slate-200" />
        <div className="flex flex-col gap-2 px-3">
          {session?.user ? (
            <>
              <Button as="a" href={session.user.role === "LABOUR" ? "/dashboard/labour" : session.user.role === "CONTRACTOR" ? "/dashboard/contractor" : "/admin"} size="md" onClick={close} className="justify-start">
                Dashboard
              </Button>
              <Button variant="ghost" size="md" onClick={() => { close(); signOut({ callbackUrl: "/" }); }} className="justify-start">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button as="a" href="/login" variant="ghost" size="md" onClick={close} className="justify-start">
                Login
              </Button>
              <Button as="a" href="/register" size="md" onClick={close} className="justify-start">
                Sign up
              </Button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}

export default function Navbar() {
  const { data: session } = useSession();
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <a href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
            LL
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900 sm:text-base">
            LabourLink
            </span>
            <span className="text-[11px] text-slate-500 sm:text-xs">
              Hire local. Work local.
            </span>
          </div>
        </a>

        <div className="flex items-center gap-3">
          <NavigationMenu>
            <NavigationMenuItem>
              <NavigationMenuLink href="/jobs">Jobs</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="#how-it-works">How it works</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="#about">About</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenu>

          <div className="hidden items-center gap-2 md:flex">
            {session?.user ? (
              <>
                <Button as="a" href={session.user.role === "LABOUR" ? "/dashboard/labour" : session.user.role === "CONTRACTOR" ? "/dashboard/contractor" : "/admin"} variant="ghost" size="sm">
                  Dashboard
                </Button>
                <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button as="a" href="/login" variant="ghost" size="sm">
                  Login
                </Button>
                <Button as="a" href="/register" size="sm">
                  Sign up
                </Button>
              </>
            )}
          </div>

          <Sheet>
            <SheetTrigger>
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" title="Navigation menu">
              <MobileNavContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

