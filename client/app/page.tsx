import { ThemeToggle } from "@/components/theme-toggle";

const swatches = [
  { name: "canvas", className: "bg-canvas" },
  { name: "surface", className: "bg-surface" },
  { name: "surface-elevated", className: "bg-surface-elevated" },
  { name: "ink", className: "bg-ink" },
  { name: "ink-muted", className: "bg-ink-muted" },
  { name: "accent", className: "bg-accent" },
  { name: "positive", className: "bg-positive" },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-canvas text-ink">
      <header className="flex items-center justify-between border-b border-line px-8 py-4">
        <span className="text-lg font-semibold tracking-tight">GrabMyTicket</span>
        <ThemeToggle />
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-8 py-16">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Design tokens</h1>
          <p className="mt-2 text-ink-muted">
            Palette pulled from the Eventopia dashboard reference — same tones,
            wired for light and dark mode.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {swatches.map((s) => (
            <div key={s.name} className="overflow-hidden rounded-2xl border border-line">
              <div className={`h-16 w-full ${s.className}`} />
              <div className="bg-surface px-3 py-2 text-sm text-ink-muted">{s.name}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6">
          <p className="text-sm text-ink-muted">Sidebar-style panel</p>
          <div className="mt-3 rounded-xl bg-surface-elevated p-4 text-on-elevated">
            This block always uses the dark &apos;sidebar&apos; tone, in both themes —
            like the black sidebar in the reference dashboard.
          </div>
        </div>
      </main>
    </div>
  );
}
