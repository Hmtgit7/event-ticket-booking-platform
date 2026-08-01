import { Compass, ShieldCheck, Ticket, WandSparkles } from "lucide-react";

export const featureCards = [
  {
    icon: WandSparkles,
    title: "Centralized API client",
    description:
      "All service calls flow through one helper with consistent JSON handling and typed errors.",
  },
  {
    icon: Compass,
    title: "React Query cache",
    description:
      "Server state stays in a single cache with retry, refetch, and invalidation boundaries.",
  },
  {
    icon: Ticket,
    title: "Booking flow store",
    description:
      "Checkout state persists locally so refreshes do not wipe the current reservation flow.",
  },
  {
    icon: ShieldCheck,
    title: "UI state store",
    description:
      "Browser-only concerns like drawers and modals stay out of the server-data layer.",
  },
];
