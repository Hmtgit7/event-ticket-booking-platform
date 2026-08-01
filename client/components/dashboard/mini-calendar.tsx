"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { MONTH_LABELS, WEEKDAY_LABELS } from "@/constants/calendar";
import { useCalendar } from "@/hooks/use-calendar";
import { cn } from "@/lib/utils";

interface MiniCalendarProps {
  /** The "today" day-of-month to highlight, purely for the mock. */
  todayDay?: number;
}

export function MiniCalendar({ todayDay = 29 }: MiniCalendarProps) {
  const { year, month, weeks, goToNextMonth, goToPrevMonth } = useCalendar();

  return (
    <div className="rounded-3xl bg-surface p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-ink-muted">
            {MONTH_LABELS[month]} {year}
          </p>
          <p className="text-lg font-bold text-ink">Today</p>
        </div>
        <div className="flex gap-2">
          <NavButton onClick={goToPrevMonth} icon={ChevronLeft} label="Previous month" />
          <NavButton onClick={goToNextMonth} icon={ChevronRight} label="Next month" />
        </div>
      </div>

      <table className="mt-4 w-full border-collapse text-center text-sm">
        <thead>
          <tr>
            {WEEKDAY_LABELS.map((day) => (
              <th key={day} className="pb-2 font-medium text-ink-muted">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map((cell, cellIndex) => (
                <td key={cellIndex} className="py-1.5">
                  <span
                    className={cn(
                      "mx-auto flex size-7 items-center justify-center rounded-full",
                      !cell.inCurrentMonth && "text-ink-muted/40",
                      cell.inCurrentMonth && cell.day === todayDay && "bg-ink font-bold text-on-elevated",
                      cell.inCurrentMonth && cell.day !== todayDay && "text-ink",
                    )}
                  >
                    {cell.day}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NavButton({ onClick, icon: Icon, label }: { onClick: () => void; icon: typeof ChevronLeft; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-8 items-center justify-center rounded-full bg-ink text-on-elevated transition-opacity hover:opacity-85"
    >
      <Icon className="size-4" />
    </button>
  );
}
