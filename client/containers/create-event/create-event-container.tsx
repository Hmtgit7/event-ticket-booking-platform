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
import { eventService } from "@/services/event.service";
import { ApiError } from "@/lib/api-client";
import type { CreateEventPayload } from "@/interfaces/event-api.interface";

function validate(step: CreateEventStep, draft: CreateEventDraft): string | null {
  if (step === 1) {
    if (!draft.title.trim())       return "Event title is required.";
    if (!draft.category)           return "Please select a category.";
    if (!draft.description.trim()) return "Description is required.";
  }
  if (step === 2) {
    if (!draft.date)            return "Please select a date.";
    if (!draft.time)            return "Please set a start time.";
    if (!draft.endTime)         return "Please set an end time.";
    if (!draft.venue.trim())    return "Venue name is required.";
    if (!draft.address.trim())  return "Address is required.";
    if (!draft.city.trim())     return "City is required.";
  }
  if (step === 3) {
    if (draft.ticketTiers.length === 0) return "Add at least one ticket tier.";
    for (const tier of draft.ticketTiers) {
      if (!tier.name.trim())    return "Every ticket tier needs a name.";
      if (tier.price < 0)       return "Ticket price cannot be negative.";
      if (!tier.quantityTotal || tier.quantityTotal < 1)
        return `Set a quantity for the "${tier.name || "unnamed"}" tier.`;
    }
  }
  return null;
}

/** Combines a date + time input into an ISO instant. If `endTime` is earlier than `startTime`, rolls over to the next day. */
function toStartEndIso(date: string, startTime: string, endTime: string) {
  const startAt = new Date(`${date}T${startTime}`);
  let endAt = new Date(`${date}T${endTime}`);
  if (endAt <= startAt) {
    endAt = new Date(endAt.getTime() + 24 * 60 * 60 * 1000);
  }
  return { startAt: startAt.toISOString(), endAt: endAt.toISOString() };
}

function buildPayload(draft: CreateEventDraft, publishImmediately: boolean): CreateEventPayload {
  const { startAt, endAt } = toStartEndIso(draft.date, draft.time, draft.endTime);
  return {
    title: draft.title.trim(),
    category: draft.category,
    description: draft.description.trim(),
    venueName: draft.venue.trim(),
    address: draft.address.trim(),
    city: draft.city.trim(),
    latitude: draft.lat ?? null,
    longitude: draft.lng ?? null,
    startAt,
    endAt,
    bannerImageUrl: draft.bannerUrl ?? null,
    bannerPublicId: draft.bannerPublicId ?? null,
    ticketTypes: draft.ticketTiers.map((t) => ({
      name: t.name.trim(),
      price: t.price,
      quantityTotal: t.quantityTotal ?? 0,
    })),
    publishImmediately,
  };
}

function extractErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const body = err.body as { message?: string } | undefined;
    return body?.message || "Something went wrong. Please try again.";
  }
  return "Something went wrong. Please check your connection and try again.";
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
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<"draft" | "publish" | null>(null);

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

  async function handleSubmit(mode: "draft" | "publish") {
    const err = validate(3, draft);
    if (err) { setError(err); return; }

    setSaving(true);
    setError(null);
    try {
      const payload = buildPayload(draft, mode === "publish");
      await eventService.createEvent(payload);
      setSaved(mode);
      setTimeout(() => router.push(NavRoute.Events), 1500);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (saved) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 rounded-2xl border border-line bg-surface p-10 text-center">
        <p className="text-4xl">🎉</p>
        <h2 className="font-heading text-2xl font-extrabold text-ink">
          {saved === "publish" ? "Event published!" : "Draft saved!"}
        </h2>
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
        <Button variant="outline" onClick={handleBack} disabled={step === 1 || saving}>
          ← Back
        </Button>
        <div className="flex gap-2">
          {step < 3 ? (
            <Button onClick={handleNext}>Continue →</Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => handleSubmit("draft")} disabled={saving}>
                {saving ? "Saving…" : "Save as draft"}
              </Button>
              <Button onClick={() => handleSubmit("publish")} disabled={saving}>
                {saving ? "Publishing…" : "Publish event"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
