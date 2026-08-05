import { Plus, Trash2 } from "lucide-react";
import { ImageUploader } from "@/components/common/image-uploader";
import { FormField, inputCls } from "./form-field";
import { emptyTier, type CreateEventDraft, type TicketTierDraft } from "@/types/create-event.types";

interface EventTicketsMediaProps {
  draft: CreateEventDraft;
  onChange: (patch: Partial<CreateEventDraft>) => void;
}

/**
 * Step 3 — Ticket tiers (General, VIP, etc.) and banner image upload.
 * Supports multiple paid tiers per event; at least one is required.
 */
export function EventTicketsMedia({ draft, onChange }: EventTicketsMediaProps) {
  function updateTier(key: string, patch: Partial<TicketTierDraft>) {
    onChange({
      ticketTiers: draft.ticketTiers.map((t) => (t.key === key ? { ...t, ...patch } : t)),
    });
  }

  function addTier() {
    onChange({ ticketTiers: [...draft.ticketTiers, emptyTier()] });
  }

  function removeTier(key: string) {
    if (draft.ticketTiers.length <= 1) return;
    onChange({ ticketTiers: draft.ticketTiers.filter((t) => t.key !== key) });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-ink">
            Ticket tiers <span className="text-brand">*</span>
          </p>
          <button
            type="button"
            onClick={addTier}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-brand hover:text-brand"
          >
            <Plus className="size-3.5" /> Add tier
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {draft.ticketTiers.map((tier, idx) => (
            <div
              key={tier.key}
              className="grid gap-3 rounded-xl border border-line bg-background p-4 sm:grid-cols-[1.5fr_1fr_1fr_auto]"
            >
              <FormField label="Tier name" htmlFor={`tier-name-${tier.key}`} required={idx === 0}>
                <input
                  id={`tier-name-${tier.key}`}
                  type="text"
                  placeholder="e.g. General, VIP"
                  value={tier.name}
                  onChange={(e) => updateTier(tier.key, { name: e.target.value })}
                  className={inputCls}
                />
              </FormField>

              <FormField label="Price" htmlFor={`tier-price-${tier.key}`} required={idx === 0}>
                <input
                  id={`tier-price-${tier.key}`}
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="0.00"
                  value={tier.price || ""}
                  onChange={(e) => updateTier(tier.key, { price: parseFloat(e.target.value) || 0 })}
                  className={inputCls}
                />
              </FormField>

              <FormField label="Quantity" htmlFor={`tier-qty-${tier.key}`} required={idx === 0}>
                <input
                  id={`tier-qty-${tier.key}`}
                  type="number"
                  min={1}
                  placeholder="100"
                  value={tier.quantityTotal ?? ""}
                  onChange={(e) =>
                    updateTier(tier.key, { quantityTotal: parseInt(e.target.value) || undefined })
                  }
                  className={inputCls}
                />
              </FormField>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removeTier(tier.key)}
                  disabled={draft.ticketTiers.length <= 1}
                  aria-label="Remove tier"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-ink-muted transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-ink-muted">Use price 0 for a free tier.</p>
      </div>

      <ImageUploader
        label="Event banner image"
        hint="PNG, JPG, WebP — max 10 MB. Recommended 1200 × 630 px."
        folder="grabmyticket/events"
        value={draft.bannerUrl}
        onUpload={(url, publicId) => onChange({ bannerUrl: url, bannerPublicId: publicId })}
        onClear={() => onChange({ bannerUrl: undefined, bannerPublicId: undefined })}
        className="min-h-[200px]"
      />
    </div>
  );
}
