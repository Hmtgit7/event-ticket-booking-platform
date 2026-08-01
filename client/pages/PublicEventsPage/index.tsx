import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { PublicEventsBrowser } from "@/components/public-events/public-events-browser";
import { MarketingLayout } from "@/layouts/MarketingLayout";

export function PublicEventsPage() {
  return (
    <MarketingLayout>
      <section className="bg-canvas px-3 py-3 sm:px-5 sm:py-5 dark:bg-[#0d0a07]">
        <div className="overflow-hidden rounded-[30px] border border-white/8 bg-[#15110d] text-on-elevated shadow-[0_30px_90px_rgba(21,19,15,0.22)] dark:border-white/10 dark:bg-[#110e0a]">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand">Browse events</p>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
                Find the right room, crowd, and night out.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-on-elevated/68">
                Explore shows, workshops, launches, and local experiences with clear filters before checkout.
              </p>
              <Link href="/auth/signup" className="mt-7 inline-flex h-12 items-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-brand-foreground shadow-lg shadow-brand/20">
                Publish your event
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="relative min-h-[420px] overflow-hidden rounded-[28px] border border-white/10 bg-cover bg-center shadow-2xl shadow-black/30" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1400&q=85)" }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 rounded-[22px] border border-white/10 bg-black/35 p-5 backdrop-blur-md">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand"><Sparkles className="size-4" />Public discovery</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Filter by category, city, price, and popularity.</h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicEventsBrowser />
    </MarketingLayout>
  );
}

export default PublicEventsPage;
