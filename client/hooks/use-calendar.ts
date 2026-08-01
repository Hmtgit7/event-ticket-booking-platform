"use client";

import { useMemo, useReducer } from "react";

interface CalendarState {
  year: number;
  month: number; // 0-11
}

type CalendarAction = { type: "next" } | { type: "prev" } | { type: "reset"; today: CalendarState };

function calendarReducer(state: CalendarState, action: CalendarAction): CalendarState {
  switch (action.type) {
    case "next":
      return state.month === 11 ? { year: state.year + 1, month: 0 } : { ...state, month: state.month + 1 };
    case "prev":
      return state.month === 0 ? { year: state.year - 1, month: 11 } : { ...state, month: state.month - 1 };
    case "reset":
      return action.today;
    default:
      return state;
  }
}

/**
 * Month-grid calendar state machine. useReducer keeps next/prev/reset as
 * discrete, testable transitions instead of ad-hoc setState math sprinkled
 * through the component.
 */
export function useCalendar(initialDate: Date = new Date()) {
  const [state, dispatch] = useReducer(calendarReducer, {
    year: initialDate.getFullYear(),
    month: initialDate.getMonth(),
  });

  const weeks = useMemo(() => buildMonthGrid(state.year, state.month), [state.year, state.month]);

  return {
    year: state.year,
    month: state.month,
    weeks,
    goToNextMonth: () => dispatch({ type: "next" }),
    goToPrevMonth: () => dispatch({ type: "prev" }),
    goToToday: () =>
      dispatch({
        type: "reset",
        today: { year: initialDate.getFullYear(), month: initialDate.getMonth() },
      }),
  };
}

export interface CalendarCell {
  day: number;
  inCurrentMonth: boolean;
}

/** Builds a 6x7 grid of day cells, padding overflow days from adjacent months. */
function buildMonthGrid(year: number, month: number): CalendarCell[][] {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: CalendarCell[] = [];
  for (let i = firstWeekday - 1; i >= 0; i -= 1) {
    cells.push({ day: daysInPrevMonth - i, inCurrentMonth: false });
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ day, inCurrentMonth: true });
  }
  let nextMonthDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ day: nextMonthDay, inCurrentMonth: false });
    nextMonthDay += 1;
  }

  const weeks: CalendarCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}
