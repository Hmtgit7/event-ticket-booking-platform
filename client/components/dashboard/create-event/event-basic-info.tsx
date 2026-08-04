import { EventCategory } from "@/enums/event-category.enum";
import { FormField, inputCls, textareaCls, selectCls } from "./form-field";
import type { CreateEventDraft } from "@/types/create-event.types";

interface EventBasicInfoProps {
  draft: CreateEventDraft;
  onChange: (patch: Partial<CreateEventDraft>) => void;
}

/**
 * Step 1 — Basic info: title, category, description.
 */
export function EventBasicInfo({ draft, onChange }: EventBasicInfoProps) {
  return (
    <div className="flex flex-col gap-5">
      <FormField label="Event title" htmlFor="title" required hint="Keep it short and descriptive — max 80 characters.">
        <input
          id="title"
          type="text"
          maxLength={80}
          placeholder="e.g. Annual Food & Culture Festival"
          value={draft.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className={inputCls}
        />
      </FormField>

      <FormField label="Category" htmlFor="category" required>
        <select
          id="category"
          value={draft.category}
          onChange={(e) => onChange({ category: e.target.value as EventCategory })}
          className={selectCls}
        >
          <option value="">Select a category</option>
          {Object.values(EventCategory).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </FormField>

      <FormField
        label="Description"
        htmlFor="description"
        required
        hint="Describe what attendees can expect. Markdown supported."
      >
        <textarea
          id="description"
          rows={5}
          placeholder="Tell people what this event is about…"
          value={draft.description}
          onChange={(e) => onChange({ description: e.target.value })}
          className={textareaCls}
        />
      </FormField>
    </div>
  );
}
