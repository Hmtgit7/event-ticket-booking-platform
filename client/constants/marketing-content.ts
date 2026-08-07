import { CalendarCheck, ChartNoAxesColumn, ShieldCheck, Ticket } from "lucide-react";

export const MARKETING_NAV = [
  { label: "Browse", href: "/events" },
  { label: "For organizers", href: "/#organizers" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Trust", href: "/#trust" },
];

export const HERO_STATS = [
  { label: "tickets issued", value: "120K+" },
  { label: "live events", value: "340+" },
  { label: "avg. check-in", value: "42 sec" },
];

export const HERO_MEDIA = [
  {
    title: "Festival Pass",
    eyebrow: "Live ticket drop",
    meta: "3 day access · City Park Grounds",
    kind: "image",
    src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Concert Crowd Live",
    eyebrow: "Feel the energy",
    meta: "General admission · Riverside Arena",
    kind: "video",
    src: "https://assets.mixkit.co/videos/preview/mixkit-concert-crowd-jumping-and-cheering-14108-large.mp4",
  },
  {
    title: "Arena Nights",
    eyebrow: "Tonight at 8 PM",
    meta: "Reserved seating · Downtown Stadium",
    kind: "image",
    src: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Open Air Concert",
    eyebrow: "Selling fast",
    meta: "General admission · Riverside Grounds",
    kind: "image",
    src: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Music Festival",
    eyebrow: "Weekend lineup",
    meta: "Multi-stage · Main Square Arena",
    kind: "image",
    src: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Standup Showcase",
    eyebrow: "Limited seats",
    meta: "Comedy Night · Grand Theatre",
    kind: "image",
    src: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Comedy Night Out",
    eyebrow: "Special event",
    meta: "Live performance · The Laugh Club",
    kind: "video",
    src: "https://assets.mixkit.co/videos/preview/mixkit-microphone-on-stage-20833-large.mp4",
  },
] as const;

export const FEATURE_CARDS = [
  { title: "Launch faster", body: "Publish events, ticket tiers, capacity rules, and checkout links in one calm workflow.", icon: CalendarCheck },
  { title: "Sell with confidence", body: "Public discovery pages, clear event details, and secure ticketing help guests decide quickly.", icon: Ticket },
  { title: "Track demand", body: "Organizers see bookings, attendance, and sales momentum without leaving the dashboard.", icon: ChartNoAxesColumn },
  { title: "Keep entry smooth", body: "Simple attendee lists and check-in ready data keep event-day operations steady.", icon: ShieldCheck },
];

export const HOW_IT_WORKS = [
  "Create an event workspace with date, venue, images, and ticket inventory.",
  "Share the public event page or let guests discover it through Browse Events.",
  "Manage bookings, attendee insights, and entry operations from the dashboard.",
];

export const TRUST_SIGNALS = [
  "Transparent pricing and availability",
  "Mobile-first guest discovery",
  "Organizer dashboard built for repeat workflows",
  "Public routes separated from private management",
];
