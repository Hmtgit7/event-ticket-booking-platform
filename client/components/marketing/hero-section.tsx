import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { HeroMediaCarousel } from "@/components/marketing/hero-media-carousel";
import { HERO_STATS } from "@/constants/marketing-content";

export function HeroSection() {
  return (
    <section className="overflow-hidden bg-canvas px-3 py-3 text-ink sm:px-5 sm:py-5 dark:bg-[#0d0a07]">
      <div className="rounded-[30px] border border-white/8 bg-[#15110d] text-on-elevated shadow-[0_34px_120px_rgba(21,19,15,0.28)] dark:border-white/10 dark:bg-[#110e0a] dark:shadow-black/50">
        <div className="mx-auto grid min-h-[660px] w-full max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand">Event ticketing platform</p>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.04] tracking-tight text-on-elevated sm:text-6xl">
              Premium ticketing for events people talk about.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-on-elevated/68">
              Launch a polished event page, sell tickets, and keep every booking organized from one calm GrabMyTicket workspace.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/events" className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-brand-foreground shadow-lg shadow-brand/20">
                <Search className="size-4" />
                Browse events
              </Link>
              <Link href="/auth/signup" className="inline-flex h-12 items-center gap-2 rounded-xl bg-on-elevated px-5 text-sm font-bold text-[#17140f] shadow-lg shadow-black/20">
                Start free
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="mt-9 grid max-w-lg grid-cols-3 gap-3">
              {HERO_STATS.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/8 p-4 shadow-inner shadow-white/5">
                  <p className="text-2xl font-semibold tracking-tight">{stat.value}</p>
                  <p className="mt-1 text-xs font-medium text-on-elevated/55">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <HeroMediaCarousel />
        </div>
      </div>
    </section>
  );
}
