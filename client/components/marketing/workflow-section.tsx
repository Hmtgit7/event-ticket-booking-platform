import { CheckCircle2 } from "lucide-react";
import { HOW_IT_WORKS, TRUST_SIGNALS } from "@/constants/marketing-content";

export function WorkflowSection() {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-surface py-16 sm:py-20 dark:bg-[#17130e]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">How it works</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
            A public route for guests. A private dashboard for teams.
          </h2>
          <p className="mt-5 text-sm leading-6 text-ink-muted">
            Guests get focused browsing while organizers keep operational tools tucked inside the dashboard.
          </p>
        </div>

        <div className="grid gap-4">
          {HOW_IT_WORKS.map((step, index) => (
            <div key={step} className="flex gap-4 rounded-[22px] border border-line bg-canvas p-5 shadow-sm dark:bg-[#211b14]">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-brand text-sm font-bold text-brand-foreground">
                {index + 1}
              </div>
              <p className="pt-2 text-sm font-medium leading-6 text-ink">{step}</p>
            </div>
          ))}
        </div>
      </div>

      <div id="trust" className="mx-auto mt-12 w-full max-w-7xl scroll-mt-24 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-3 rounded-[26px] border border-white/10 bg-[#15110d] p-4 text-on-elevated shadow-2xl shadow-black/20 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_SIGNALS.map((signal) => (
            <p key={signal} className="flex items-center gap-2 rounded-2xl bg-white/8 p-3 text-sm font-semibold">
              <CheckCircle2 className="size-4 text-brand" />
              {signal}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
