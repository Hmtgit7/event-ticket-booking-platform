"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Ticket,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { ApiError, apiClient } from "@/lib/api-client";
import {
  useBookingFlowStore,
  type BookingStep,
} from "@/stores/booking-flow-store";
import { useUIStore } from "@/stores/ui-store";
import { featureCards } from "@/constants/featureCards";
import { bookingSteps } from "@/constants/bookingSteps";
import { quickStats } from "@/constants/quickStats";
import { HealthResponse } from "@/types/healthResponse";

function stepIndex(step: BookingStep) {
  return bookingSteps.findIndex((item) => item.id === step);
}

function describeError(error: unknown) {
  if (error instanceof ApiError) {
    if (
      typeof error.body === "object" &&
      error.body &&
      "message" in error.body
    ) {
      const message = (error.body as { message?: unknown }).message;
      if (typeof message === "string") {
        return `${error.status}: ${message}`;
      }
    }

    return `${error.status}: ${error.message}`;
  }

  return error instanceof Error ? error.message : "Unknown API error";
}

export default function Home() {
  const { eventId, step, ticketSelections, startBooking, setStep, reset } =
    useBookingFlowStore();
  const {
    sidebarCollapsed,
    toggleSidebar,
    activeModal,
    openModal,
    closeModal,
  } = useUIStore();

  const healthQuery = useQuery({
    queryKey: ["gateway-health"],
    queryFn: () => apiClient.get<HealthResponse>("/actuator/health"),
    enabled: false,
    retry: 0,
  });

  const bookedTickets = Object.values(ticketSelections).reduce(
    (total, quantity) => total + quantity,
    0,
  );
  const currentStepIndex = stepIndex(step);
  const canAdvance = currentStepIndex < bookingSteps.length - 1;
  const nextStepId = canAdvance ? bookingSteps[currentStepIndex + 1].id : step;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-brand/15 blur-3xl" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-positive/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.32),transparent_72%)] opacity-60 dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_72%)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between rounded-full border border-line bg-surface/90 px-5 py-3 shadow-sm backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-sm">
              <Ticket className="size-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-muted">
                GrabMyTicket
              </p>
              <p className="text-sm text-ink-muted">
                Centralized booking, live state, and resilient API calls
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-line bg-background px-3 py-1 text-xs text-ink-muted sm:flex">
              <ShieldCheck className="size-3.5 text-positive" />
              React Query + Zustand ready
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="grid flex-1 gap-6 py-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="flex flex-col gap-6">
            <div className="rounded-[2rem] border border-line bg-surface/90 p-6 shadow-[0_24px_80px_rgba(23,20,15,0.12)] backdrop-blur sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-line bg-background px-3 py-1 text-xs font-medium text-ink-muted">
                  Ticketing platform
                </span>
                <span className="rounded-full border border-line bg-background px-3 py-1 text-xs font-medium text-ink-muted">
                  API-first
                </span>
                <span className="rounded-full border border-positive/25 bg-positive/10 px-3 py-1 text-xs font-medium text-positive">
                  Live state in sync
                </span>
              </div>

              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
                Book tickets with one UI, one API client, and one source of
                truth for local state.
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-ink-muted">
                The homepage now acts as a control room: start a booking, move
                through the flow, probe the gateway, and keep browser-only state
                in Zustand while server data stays in React Query.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  className="gap-2"
                  onClick={() => startBooking("event-2026-08-opening-night")}
                >
                  <Sparkles className="size-4" />
                  Start booking
                  <ArrowRight className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => void healthQuery.refetch()}
                >
                  <RefreshCw
                    className={`size-4 ${healthQuery.isFetching ? "animate-spin" : ""}`}
                  />
                  Probe API
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => openModal("booking-help")}
                >
                  Open helper
                </Button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {quickStats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-line bg-background p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.22em] text-ink-muted">
                      {item.label}
                    </p>
                    <p className="mt-2 text-lg font-medium text-ink">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {featureCards.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="rounded-[1.75rem] border border-line bg-surface p-5 shadow-sm"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-background text-brand">
                      <Icon className="size-5" />
                    </div>
                    <h2 className="mt-4 text-lg font-semibold tracking-tight text-ink">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-ink-muted">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>

          <aside className="flex flex-col gap-6">
            <div className="rounded-[2rem] border border-line bg-surface/90 p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.22em] text-ink-muted">
                    Booking flow
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                    {eventId ? "Active session" : "Ready to start"}
                  </h2>
                </div>

                <div className="rounded-full border border-line bg-background px-3 py-1 text-xs text-ink-muted">
                  {sidebarCollapsed ? "Sidebar collapsed" : "Sidebar expanded"}
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {bookingSteps.map((item, index) => {
                  const active = index === currentStepIndex;
                  const completed = index < currentStepIndex;

                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl border p-4 ${
                        active
                          ? "border-brand bg-brand/10"
                          : completed
                            ? "border-positive/30 bg-positive/10"
                            : "border-line bg-background"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 text-sm font-medium text-ink">
                            {completed ? (
                              <CheckCircle2 className="size-4 text-positive" />
                            ) : active ? (
                              <CircleAlert className="size-4 text-brand" />
                            ) : (
                              <span className="h-2.5 w-2.5 rounded-full bg-line" />
                            )}
                            {item.label}
                          </div>
                          <p className="mt-1 text-sm text-ink-muted">
                            {item.description}
                          </p>
                        </div>

                        {active ? (
                          <span className="rounded-full bg-brand px-2.5 py-1 text-[11px] font-medium text-brand-foreground">
                            Current
                          </span>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 rounded-2xl border border-line bg-background p-4 text-sm text-ink-muted">
                <div className="flex items-center gap-2 text-ink">
                  <MapPin className="size-4 text-brand" />
                  Session summary
                </div>
                <div className="mt-3 grid gap-2">
                  <p>Event: {eventId ?? "No booking started yet"}</p>
                  <p>Tickets selected: {bookedTickets}</p>
                  <p>Current modal: {activeModal ?? "None"}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="secondary" onClick={() => setStep(nextStepId)}>
                  Next step
                </Button>
                <Button variant="outline" onClick={reset}>
                  Reset flow
                </Button>
                <Button variant="ghost" onClick={toggleSidebar}>
                  Toggle sidebar
                </Button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-line bg-surface-elevated p-6 text-on-elevated shadow-[0_24px_70px_rgba(21,19,15,0.35)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.22em] text-on-elevated/70">
                    Live API probe
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-on-elevated">
                    Centralized error handling
                  </h2>
                </div>

                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-on-elevated/75">
                  {healthQuery.isFetching
                    ? "Checking..."
                    : healthQuery.isError
                      ? "Needs attention"
                      : healthQuery.data
                        ? "Healthy"
                        : "Idle"}
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-on-elevated/75">
                  {healthQuery.data
                    ? `Gateway status: ${healthQuery.data.status ?? "unknown"}`
                    : "The probe is disabled until you trigger it. When it runs, all failures flow through ApiError."}
                </p>

                {healthQuery.error ? (
                  <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-on-elevated">
                    {describeError(healthQuery.error)}
                  </div>
                ) : null}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-on-elevated/60">
                    Query cache
                  </p>
                  <p className="mt-2 text-sm text-on-elevated/85">
                    React Query handles request state, retries, and future
                    invalidation.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-on-elevated/60">
                    UI state
                  </p>
                  <p className="mt-2 text-sm text-on-elevated/85">
                    Zustand keeps modal and flow state local without polluting
                    server data.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  className="border-white/15 bg-transparent text-on-elevated hover:bg-white/10"
                  onClick={() => void healthQuery.refetch()}
                >
                  <RefreshCw
                    className={`mr-2 size-4 ${healthQuery.isFetching ? "animate-spin" : ""}`}
                  />
                  Refresh probe
                </Button>
                <Button
                  variant="ghost"
                  className="text-on-elevated hover:bg-white/10 hover:text-on-elevated"
                  onClick={() => closeModal()}
                >
                  Close helper
                  <ChevronRight className="ml-2 size-4" />
                </Button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-line bg-surface p-6 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-medium text-ink">
                <MapPin className="size-4 text-brand" />
                Notes from the flow
              </div>
              <p className="mt-3 text-sm leading-6 text-ink-muted">
                The booking store persists the current step and selection state
                only. Server reads and writes stay behind the API client so
                error handling and request formatting stay centralized.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-ink-muted">
                <span className="rounded-full border border-line bg-background px-3 py-1">
                  {canAdvance ? "Flow can advance" : "Flow completed"}
                </span>
                <span className="rounded-full border border-line bg-background px-3 py-1">
                  {healthQuery.isError
                    ? "Probe error visible"
                    : "Probe dormant"}
                </span>
                <span className="rounded-full border border-line bg-background px-3 py-1">
                  {activeModal ? `Modal: ${activeModal}` : "No modal open"}
                </span>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
