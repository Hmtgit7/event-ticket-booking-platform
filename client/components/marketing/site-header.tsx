import Link from "next/link";
import { ArrowRight, Menu } from "lucide-react";
import { BrandLogo } from "@/components/common/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { MARKETING_NAV } from "@/constants/marketing-content";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-canvas/92 shadow-sm backdrop-blur-xl dark:bg-[#100d09]/92 dark:shadow-black/30">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <BrandLogo />

        <nav className="hidden items-center gap-6 md:flex">
          {MARKETING_NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-semibold text-ink-muted transition hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block [&_button]:size-10 [&_button]:rounded-xl">
            <ThemeToggle />
          </div>
          <Link href="/auth/login" className="hidden rounded-xl px-3 py-2 text-sm font-bold text-ink hover:bg-surface sm:inline-flex">
            Login
          </Link>
          <Link href="/auth/signup" className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-brand px-4 text-sm font-bold text-brand-foreground shadow-sm shadow-brand/20">
            Start selling
            <ArrowRight className="size-4" />
          </Link>
          <button type="button" aria-label="Open menu" className="flex size-10 items-center justify-center rounded-xl bg-surface md:hidden">
            <Menu className="size-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
