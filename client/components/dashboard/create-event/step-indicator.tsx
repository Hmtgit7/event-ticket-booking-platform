import { cn } from "@/lib/utils";
import { STEP_LABELS, type CreateEventStep } from "@/types/create-event.types";

interface StepIndicatorProps {
  current: CreateEventStep;
  total?: number;
}

/**
 * Horizontal stepper showing the three create-event steps.
 * Active step is filled, completed steps show a check, future steps are muted.
 */
export function StepIndicator({ current, total = 3 }: StepIndicatorProps) {
  const steps = Array.from({ length: total }, (_, i) => (i + 1) as CreateEventStep);

  return (
    <div className="flex items-center gap-0">
      {steps.map((step, idx) => {
        const isCompleted = step < current;
        const isActive    = step === current;

        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                  isCompleted && "border-brand bg-brand text-brand-foreground",
                  isActive    && "border-brand bg-background text-brand",
                  !isCompleted && !isActive && "border-line bg-background text-ink-muted",
                )}
              >
                {isCompleted ? "✓" : step}
              </div>
              <span className={cn("text-xs font-medium", isActive ? "text-ink" : "text-ink-muted")}>
                {STEP_LABELS[step]}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={cn(
                  "mx-2 mb-5 h-px w-12 sm:w-20 transition-colors",
                  step < current ? "bg-brand" : "bg-line",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
