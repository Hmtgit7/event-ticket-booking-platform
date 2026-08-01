import { FEATURE_CARDS } from "@/constants/marketing-content";

export function FeatureSection() {
  return (
    <section id="organizers" className="scroll-mt-24 border-y border-line bg-surface py-16 sm:py-20 dark:bg-[#17130e]">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">For organizers</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
            Everything from first publish to final check-in.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-ink-muted">
            Build listings, track demand, and run the room without turning the dashboard into noise.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {FEATURE_CARDS.map(({ title, body, icon: Icon }) => (
            <article key={title} className="rounded-[22px] border border-line bg-canvas p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl dark:bg-[#211b14] dark:shadow-black/20">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-brand/12 text-brand ring-1 ring-brand/20">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-ink">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-ink-muted">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
