export const LEGAL_PAGES = {
  terms: {
    eyebrow: "Terms of service",
    title: "Simple rules for selling and booking with GrabMyTicket.",
    updated: "Last updated August 1, 2026",
    sections: [
      { title: "Using the platform", body: "GrabMyTicket provides event discovery, ticket listing, booking, and organizer management tools. Demo content in this build is placeholder data for product review." },
      { title: "Organizer responsibilities", body: "Organizers are responsible for accurate event details, venue rules, refund terms, ticket inventory, and attendee communications." },
      { title: "Guest bookings", body: "Guests should review event date, location, price, and entry requirements before completing a booking. Final checkout behavior will connect to the production payment flow later." },
      { title: "Availability", body: "We aim to keep the service reliable, but public pages, dashboards, and integrations may change as the product evolves." },
    ],
  },
  privacy: {
    eyebrow: "Privacy policy",
    title: "How GrabMyTicket will handle account, event, and booking data.",
    updated: "Last updated August 1, 2026",
    sections: [
      { title: "Information we collect", body: "Account details, organizer profile data, event listings, booking records, and support messages may be collected when users interact with the platform." },
      { title: "How data is used", body: "Data helps power authentication, public event discovery, ticket delivery, attendee management, analytics, and customer support." },
      { title: "Sharing and processors", body: "Production integrations may include payment, email, analytics, and hosting providers. This demo does not submit real customer data." },
      { title: "Your choices", body: "Users will be able to update account details, request deletion, and manage communication preferences from account settings." },
    ],
  },
} as const;

export type LegalPageKey = keyof typeof LEGAL_PAGES;
