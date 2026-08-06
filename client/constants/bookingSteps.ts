import { BookingStep } from "@/store/booking-flow-store";

export const bookingSteps: Array<{
  id: BookingStep;
  label: string;
  description: string;
}> = [
  {
    id: "select-tickets",
    label: "Select tickets",
    description: "Pick seats, passes, and the right quantity.",
  },
  {
    id: "attendee-info",
    label: "Attendee info",
    description: "Capture contact details and preferences.",
  },
  {
    id: "payment",
    label: "Payment",
    description: "Confirm pricing and finalize payment.",
  },
  {
    id: "confirmation",
    label: "Confirmation",
    description: "Deliver the ticket and receipt.",
  },
];
