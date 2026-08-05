import { FormField, inputCls } from "./form-field";
import type { CreateEventDraft } from "@/types/create-event.types";

interface EventDateLocationProps {
  draft: CreateEventDraft;
  onChange: (patch: Partial<CreateEventDraft>) => void;
}

/**
 * Step 2 — Date, time, and venue location.
 */
export function EventDateLocation({ draft, onChange }: EventDateLocationProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField label="Event date" htmlFor="date" required>
          <input
            id="date"
            type="date"
            value={draft.date}
            onChange={(e) => onChange({ date: e.target.value })}
            className={inputCls}
          />
        </FormField>

        <FormField label="Start time" htmlFor="time" required>
          <input
            id="time"
            type="time"
            value={draft.time}
            onChange={(e) => onChange({ time: e.target.value })}
            className={inputCls}
          />
        </FormField>

        <FormField label="End time" htmlFor="endTime" required hint="Next day if earlier than start.">
          <input
            id="endTime"
            type="time"
            value={draft.endTime}
            onChange={(e) => onChange({ endTime: e.target.value })}
            className={inputCls}
          />
        </FormField>
      </div>

      <FormField label="Venue name" htmlFor="venue" required hint="Hall, stadium, or landmark.">
        <input
          id="venue"
          type="text"
          placeholder="e.g. Colombo City Hall"
          value={draft.venue}
          onChange={(e) => onChange({ venue: e.target.value })}
          className={inputCls}
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Address" htmlFor="address" required hint="Street address for directions.">
          <input
            id="address"
            type="text"
            placeholder="e.g. 123 Galle Road"
            value={draft.address}
            onChange={(e) => onChange({ address: e.target.value })}
            className={inputCls}
          />
        </FormField>

        <FormField label="City" htmlFor="city" required>
          <input
            id="city"
            type="text"
            placeholder="e.g. Colombo"
            value={draft.city}
            onChange={(e) => onChange({ city: e.target.value })}
            className={inputCls}
          />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Latitude" htmlFor="lat" hint="Used for the event map pin.">
          <input
            id="lat"
            type="number"
            step="0.0001"
            placeholder="6.9271"
            value={draft.lat ?? ""}
            onChange={(e) => onChange({ lat: parseFloat(e.target.value) || undefined })}
            className={inputCls}
          />
        </FormField>

        <FormField label="Longitude" htmlFor="lng">
          <input
            id="lng"
            type="number"
            step="0.0001"
            placeholder="79.8612"
            value={draft.lng ?? ""}
            onChange={(e) => onChange({ lng: parseFloat(e.target.value) || undefined })}
            className={inputCls}
          />
        </FormField>
      </div>
    </div>
  );
}
