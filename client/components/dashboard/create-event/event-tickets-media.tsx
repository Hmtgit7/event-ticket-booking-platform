import { ImageUploader } from "@/components/common/image-uploader";
import { FormField, inputCls, selectCls } from "./form-field";
import type { CreateEventDraft } from "@/types/create-event.types";

interface EventTicketsMediaProps {
  draft: CreateEventDraft;
  onChange: (patch: Partial<CreateEventDraft>) => void;
}

/**
 * Step 3 — Ticket pricing, capacity, and banner image upload.
 */
export function EventTicketsMedia({ draft, onChange }: EventTicketsMediaProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField label="Ticket type" htmlFor="ticketType">
          <select
            id="ticketType"
            value={draft.ticketType}
            onChange={(e) => onChange({ ticketType: e.target.value as CreateEventDraft["ticketType"] })}
            className={selectCls}
          >
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </FormField>

        {draft.ticketType === "paid" && (
          <FormField label="Price (USD)" htmlFor="price" required>
            <input
              id="price"
              type="number"
              min={0}
              step={0.01}
              placeholder="0.00"
              value={draft.price ?? ""}
              onChange={(e) => onChange({ price: parseFloat(e.target.value) || 0 })}
              className={inputCls}
            />
          </FormField>
        )}

        <FormField label="Total capacity" htmlFor="capacity" hint="Max tickets available.">
          <input
            id="capacity"
            type="number"
            min={1}
            placeholder="500"
            value={draft.capacity ?? ""}
            onChange={(e) => onChange({ capacity: parseInt(e.target.value) || undefined })}
            className={inputCls}
          />
        </FormField>
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
