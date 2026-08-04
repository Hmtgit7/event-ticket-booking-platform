"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "@/components/dashboard/create-event/step-indicator";
import { EventBasicInfo } from "@/components/dashboard/create-event/event-basic-info";
import { EventDateLocation } from "@/components/dashboard/create-event/event-date-location";
import { EventTicketsMedia } from "@/components/dashboard/create-event/event-tickets-media";
import { EMPTY_DRAFT, type CreateEventDraft, type CreateEventStep } from "@/types/create-event.types";
import { NavRoute } from "@/enums/nav-route.enum";

function validate(step: CreateEventStep, draft: CreateEventDraft): string | null {
  if (step === 1) {
    if (!draft.title.trim())       return "Event title is required.";
    if (!draft.category)           return "Please select a category.";
    if (!draft.description.trim()) return "Description is required.";
  }
  if (step === 2) {
    if (!draft.date)         return "Please select a date.";
    if (!draft.time)         return "Please set a start time.";
    if (!draft.venue.trim()) return "Venue name is required.";
    if (!draft.city.trim())  return "City is required.";
  }
  return null;
}

/**
 * Multi-step create-event form.
 * Steps: Basic Info → Date & Location → Tickets & Media → Submit.
 */
export function CreateEventContainer() {
  const router = useRouter();
  const [step,  setStep]  = useState<CreateEventStep>(1);
  const [draft, setDraft] = useState<CreateEventDraft>(EMPTY_DRAFT);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function patch(p: Partial<CreateEventDraft>) {
    setDraft((prev) => ({ ...prev, ...p }));
    setError(null);
  }

  function handleNext() {
    const err = validate(step, draft);
    if (err) { setError(err); return; }
    setStep((s) => Math.min(s + 1, 3) as CreateEventStep);
  }

  function handleBack() {
    setError(null);
    setStep((s) => Math.max(s - 1, 1) as CreateEventStep);
  }

  function handleSubmit(status: "draft" | "publish") {
    const err = validate(step, draft);
    if (err) { setError(err); return; }
    // TODO: wire to POST /api/events with { ...draft, status }
    console.info("Create event payload:", { ...draft, status });
    setSaved(true);
    setTimeout(() => router.push(NavRoute.Events), 1500);
  }

  if (saved) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 rounded-2xl border border-line bg-surface p-10 text-center">
        <p className="text-4xl">🎉</p>
        <h2 className="font-heading text-2xl font-extrabold text-ink">Event saved!</h2>
        <p className="text-sm text-ink-muted">Redirecting you to My Events…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Stepper header ── */}
      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">New Event</p>
          <h1 className="mt-1 font-heading text-2xl font-extrabold text-ink">Create an event</h1>
        </div>
        <StepIndicator current={step} />
      </div>

      {/* ── Form card ── */}
      <div className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
        {step === 1 && <EventBasicInfo    draft={draft} onChange={patch} />}
        {step === 2 && <EventDateLocation draft={draft} onChange={patch} />}
        {step === 3 && <EventTicketsMedia draft={draft} onChange={patch} />}

        {error && (
          <p className="mt-4 rounded-xl border border-brand/30 bg-brand/5 px-4 py-3 text-sm text-brand" role="alert">
            {error}
          </p>
        )}
      </div>

      {/* ── Nav buttons ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" onClick={handleBack} disabled={step === 1}>
          ← Back
        </Button>
        <div className="flex gap-2">
          {step < 3 ? (
            <Button onClick={handleNext}>Continue →</Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => handleSubmit("draft")}>Save as draft</Button>
              <Button onClick={() => handleSubmit("publish")}>Publish event</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
