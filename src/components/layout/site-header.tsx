"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SPRING } from "@/lib/motion";
import { LogoMark } from "@/components/visual/logo";
import { buttonClasses } from "@/components/ui/button";

const navItems = [
  { href: "/topics", label: "Topics" },
  { href: "/scenarios", label: "Practice" },
  { href: "/support", label: "Support" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-forest-100/80 bg-canvas">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 rounded-md" aria-label="MINDSTEP home">
          <LogoMark decorative />
          <span className="text-lg font-semibold tracking-tight text-forest">
            MIND<span className="text-teal-600">STEP</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center rounded-full bg-mint-100 p-1 ring-1 ring-[#d3ebe4] md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                  active ? "text-sage" : "text-mist hover:text-forest",
                )}
              >
                {active ? (
                  <motion.span
                    aria-hidden="true"
                    layoutId="primary-nav-pill"
                    className="absolute inset-0 rounded-full bg-forest shadow-[0_1px_2px_rgba(14,41,40,0.12)]"
                    style={{ borderRadius: 999 }}
                    transition={SPRING.snappy}
                  />
                ) : null}
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
          <Link
            href="/safety"
            className="ml-1.5 rounded-full bg-[#faf3dc] px-3 py-1.5 text-sm font-semibold text-[#7d621a] ring-1 ring-[#f0e2b0] transition-colors hover:bg-[#f5ecce]"
          >
            Need help now?
          </Link>
        </nav>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
          className="min-h-11 min-w-11 rounded-lg text-forest hover:bg-forest-100 md:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="mx-auto h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
            {open ? <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" /> : <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />}
          </svg>
        </button>
      </div>

      {open ? (
        <nav id="mobile-menu" aria-label="Primary mobile" className="border-t border-forest-100 bg-canvas px-4 pb-4 pt-2 md:hidden">
          <ul className="flex flex-col">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex min-h-12 items-center rounded-lg px-3 text-base font-medium",
                      active ? "bg-forest-100 text-forest-900" : "text-ink hover:bg-forest-100/60",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li className="pt-2">
              <Link href="/safety" onClick={() => setOpen(false)} className="mb-2 flex min-h-12 items-center justify-center rounded-full bg-[#faf3dc] px-3 text-base font-semibold text-[#7d621a] ring-1 ring-[#f0e2b0]">
                Need help now?
              </Link>
              <Link href="/topics" onClick={() => setOpen(false)} className={buttonClasses("primary", "md", "w-full")}>
                Open topics
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
