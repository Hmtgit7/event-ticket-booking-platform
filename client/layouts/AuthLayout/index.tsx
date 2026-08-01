import type { ReactNode } from "react";

import { AuthBrandRow } from "@/components/auth/auth-brand-row";
import { EventImageCarousel } from "@/components/auth/event-image-carousel";

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-dvh bg-background text-foreground lg:h-dvh lg:overflow-hidden">
      <div className="mx-auto grid min-h-dvh w-full max-w-[1500px] gap-4 p-4 lg:h-dvh lg:min-h-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.78fr)] lg:p-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(460px,0.72fr)]">
        <section className="hidden min-h-0 lg:block" aria-label="Event highlights">
          <EventImageCarousel />
        </section>

        <section className="flex min-h-[calc(100dvh-2rem)] flex-col lg:min-h-0">
          <div className="mb-8 text-ink lg:hidden">
            <AuthBrandRow />
          </div>
          <div className="flex flex-1 items-center justify-center">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
