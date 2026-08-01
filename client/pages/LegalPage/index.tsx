import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LEGAL_PAGES, type LegalPageKey } from "@/constants/legal-content";
import { MarketingLayout } from "@/layouts/MarketingLayout";

interface LegalPageProps {
  pageKey?: LegalPageKey;
}

export function LegalPage({ pageKey = "terms" }: LegalPageProps) {
  const page = LEGAL_PAGES[pageKey];

  return (
    <MarketingLayout>
      <section className="bg-canvas py-14 sm:py-20">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-brand">
            <ArrowLeft className="size-4" />
            Back home
          </Link>

          <div className="mt-8 rounded-[28px] bg-surface p-6 shadow-sm sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand">{page.eyebrow}</p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
              {page.title}
            </h1>
            <p className="mt-4 text-sm font-medium text-ink-muted">{page.updated}</p>

            <div className="mt-10 space-y-5">
              {page.sections.map((section) => (
                <section key={section.title} className="rounded-2xl border border-line bg-canvas p-5">
                  <h2 className="text-lg font-semibold text-ink">{section.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">{section.body}</p>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}

export default LegalPage;
