import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BookingStep =
  | "select-tickets"
  | "attendee-info"
  | "payment"
  | "confirmation";

interface BookingFlowState {
  eventId: string | null;
  step: BookingStep;
  ticketSelections: Record<string, number>; // ticketTypeId -> quantity

  startBooking: (eventId: string) => void;
  setStep: (step: BookingStep) => void;
  setTicketQuantity: (ticketTypeId: string, quantity: number) => void;
  reset: () => void;
}

const initialState = {
  eventId: null,
  step: "select-tickets" as BookingStep,
  ticketSelections: {},
};

/**
 * Multi-step booking wizard state. Kept in Zustand (not TanStack Query)
 * because it's pure UI/flow state that only matters until the booking is
 * submitted — at which point it becomes a POST to booking-service and the
 * result belongs in a query cache, not here.
 *
 * `persist` keeps it in localStorage so a refresh mid-checkout doesn't
 * lose the user's ticket selections.
 */
export const useBookingFlowStore = create<BookingFlowState>()(
  persist(
    (set) => ({
      ...initialState,
      startBooking: (eventId: string) => set({ ...initialState, eventId }),
      setStep: (step: BookingStep) => set({ step }),
      setTicketQuantity: (ticketTypeId: string, quantity: number) =>
        set((state) => {
          const nextSelections = { ...state.ticketSelections };

          if (quantity <= 0) {
            delete nextSelections[ticketTypeId];
          } else {
            nextSelections[ticketTypeId] = quantity;
          }

          return { ticketSelections: nextSelections };
        }),
      reset: () => set(initialState),
    }),
    {
      name: "grabmyticket-booking-flow",
      partialize: (state) => ({
        eventId: state.eventId,
        step: state.step,
        ticketSelections: state.ticketSelections,
      }),
    },
  ),
);
