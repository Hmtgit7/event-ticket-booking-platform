"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { ComponentType } from "react";
import {
  Bell,
  CalendarDays,
  CircleHelp,
  CreditCard,
  Download,
  Heart,
  LogOut,
  MapPin,
  Search,
  Settings,
  ShieldCheck,
  Ticket,
  User,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { PUBLIC_EVENTS } from "@/constants/public-events";
import { useLogout } from "@/modules/auth/hooks/use-logout";
import { cn } from "@/lib/utils";

type DashboardTab = "overview" | "events" | "orders" | "saved" | "wallet" | "profile" | "support";

const tabs: { id: DashboardTab; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { id: "overview", label: "Overview", icon: CalendarDays },
  { id: "events", label: "Events", icon: Search },
  { id: "orders", label: "Orders", icon: Ticket },
  { id: "saved", label: "Saved", icon: Heart },
  { id: "wallet", label: "Wallet", icon: CreditCard },
  { id: "profile", label: "Profile", icon: User },
  { id: "support", label: "Support", icon: CircleHelp },
];

const orders = [
  {
    id: "GMT-24018",
    event: "AI Make us Better",
    date: "Nov 6, 2025",
    tickets: "2 VIP",
    amount: "$40",
    status: "Confirmed",
  },
  {
    id: "GMT-23992",
    event: "Food Exhibition",
    date: "Nov 2, 2025",
    tickets: "3 General",
    amount: "$30",
    status: "Confirmed",
  },
  {
    id: "GMT-23845",
    event: "How to Camp",
    date: "Dec 10, 2025",
    tickets: "1 Workshop",
    amount: "$60",
    status: "Pending",
  },
];

const savedEvents = ["fashion-empire", "hip-hop-thugs", "adventure-hiking"];

const walletActivity = [
  { label: "Refund from Fashion Empire", date: "Oct 21", amount: "+$5", status: "Completed" },
  { label: "Card payment for AI Make us Better", date: "Oct 18", amount: "-$40", status: "Settled" },
  { label: "Promo credit", date: "Oct 12", amount: "+$12", status: "Available" },
];

const notifications = [
  "Food Exhibition moved check-in to Gate B.",
  "Your AI Make us Better ticket is ready for download.",
  "Adventure Hiking has 28 seats left.",
];

function formatPrice(price: string | number) {
  return price === "free" ? "Free" : `$${price}`;
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-brand">{eyebrow}</p>
      <h2 className="mt-1 font-heading text-2xl font-extrabold text-ink">{title}</h2>
    </div>
  );
}

export function UserDashboardPage() {
  const logout = useLogout();
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [query, setQuery] = useState("");

  const featuredEvents = useMemo(() => PUBLIC_EVENTS.slice(0, 5), []);
  const filteredEvents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return PUBLIC_EVENTS;

    return PUBLIC_EVENTS.filter((event) =>
      [event.title, event.category, event.location.city, event.host]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query]);

  const savedEventCards = PUBLIC_EVENTS.filter((event) => savedEvents.includes(event.id));
  const nextOrder = orders[0];

  return (
    <main className="min-h-dvh bg-background text-ink">
      <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-lg bg-ink text-lg font-black text-background">
              HG
            </div>
            <div>
              <p className="text-sm text-ink-muted">Welcome back, Hemant</p>
              <h1 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl">Your ticket dashboard</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="lg">
              <Bell className="size-4" />
              Alerts
            </Button>
            <Button variant="destructive" size="lg" onClick={logout}>
              <LogOut className="size-4" />
              Log out
            </Button>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="rounded-lg border border-line bg-surface p-3 lg:sticky lg:top-4 lg:h-[calc(100dvh-2rem)]">
            <nav className="grid gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex h-11 items-center gap-3 rounded-md px-3 text-left text-sm font-semibold text-ink-muted transition hover:bg-surface-hover hover:text-ink",
                      activeTab === tab.id && "bg-ink text-background hover:bg-ink hover:text-background",
                    )}
                  >
                    <Icon className="size-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
            <div className="mt-4 rounded-lg border border-line bg-background p-4">
              <p className="text-xs font-semibold uppercase text-ink-muted">Member pass</p>
              <p className="mt-2 text-2xl font-black text-ink">Gold</p>
              <p className="mt-1 text-sm text-ink-muted">2,450 reward points ready for your next booking.</p>
            </div>
          </aside>

          <section className="min-w-0">
            {activeTab === "overview" && (
              <div className="grid gap-5">
                <div className="grid gap-4 md:grid-cols-4">
                  {[
                    ["Upcoming tickets", "3", "Next check-in in 12 days"],
                    ["Saved events", "8", "Music and outdoor picks"],
                    ["Wallet credit", "$17", "Promo + refund balance"],
                    ["Open support", "1", "Reply expected today"],
                  ].map(([label, value, meta]) => (
                    <article key={label} className="rounded-lg border border-line bg-surface p-4">
                      <p className="text-sm text-ink-muted">{label}</p>
                      <p className="mt-2 text-3xl font-black text-ink">{value}</p>
                      <p className="mt-1 text-xs font-medium text-positive">{meta}</p>
                    </article>
                  ))}
                </div>

                <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
                  <article className="overflow-hidden rounded-lg border border-line bg-surface">
                    <div className="relative h-72">
                      <Image
                        src={featuredEvents[1].image}
                        alt={featuredEvents[1].title}
                        fill
                        sizes="(min-width: 1280px) 760px, 100vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                        <p className="text-sm font-semibold">Next ticket</p>
                        <h2 className="mt-1 font-heading text-3xl font-extrabold">{nextOrder.event}</h2>
                        <p className="mt-2 flex flex-wrap gap-3 text-sm text-white/85">
                          <span>{nextOrder.date}</span>
                          <span>{nextOrder.tickets}</span>
                          <span>Order {nextOrder.id}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-ink">Gate opens at 8:15 AM</p>
                        <p className="text-sm text-ink-muted">Keep your QR code and ID ready at entry.</p>
                      </div>
                      <Button size="lg">
                        <Download className="size-4" />
                        Download ticket
                      </Button>
                    </div>
                  </article>

                  <article className="rounded-lg border border-line bg-surface p-4">
                    <SectionTitle eyebrow="Updates" title="What needs attention" />
                    <div className="mt-4 grid gap-3">
                      {notifications.map((item) => (
                        <div key={item} className="rounded-md border border-line bg-background p-3 text-sm text-ink">
                          {item}
                        </div>
                      ))}
                    </div>
                  </article>
                </div>
              </div>
            )}

            {activeTab === "events" && (
              <div className="grid gap-5">
                <div className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-4 md:flex-row md:items-center md:justify-between">
                  <SectionTitle eyebrow="Explore" title="Find your next event" />
                  <label className="relative block w-full md:max-w-sm">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search events, city, category"
                      className="h-11 w-full rounded-lg border border-line bg-background pl-10 pr-3 text-sm outline-none transition focus:border-brand"
                    />
                  </label>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredEvents.map((event) => (
                    <article key={event.id} className="overflow-hidden rounded-lg border border-line bg-surface">
                      <div className="relative h-44">
                        <Image src={event.image} alt={event.title} fill sizes="360px" className="object-cover" />
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-bold text-ink">{event.title}</h3>
                            <p className="mt-1 text-sm text-ink-muted">{event.tagline}</p>
                          </div>
                          <span className="rounded-md bg-brand px-2 py-1 text-xs font-bold text-brand-foreground">
                            {formatPrice(event.price)}
                          </span>
                        </div>
                        <p className="mt-3 flex items-center gap-2 text-sm text-ink-muted">
                          <MapPin className="size-4" />
                          {event.location.city}
                        </p>
                        <div className="mt-4 flex gap-2">
                          <Button size="lg" className="flex-1">Book now</Button>
                          <Button variant="outline" size="icon-lg" aria-label={`Save ${event.title}`}>
                            <Heart className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="rounded-lg border border-line bg-surface p-4">
                <SectionTitle eyebrow="Orders" title="Tickets and booking history" />
                <div className="mt-4 grid gap-3">
                  {orders.map((order) => (
                    <article key={order.id} className="grid gap-3 rounded-lg border border-line bg-background p-4 md:grid-cols-[1fr_auto] md:items-center">
                      <div>
                        <p className="text-xs font-bold uppercase text-ink-muted">{order.id}</p>
                        <h3 className="mt-1 text-lg font-bold text-ink">{order.event}</h3>
                        <p className="mt-1 text-sm text-ink-muted">{order.date} - {order.tickets} - {order.amount}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md border border-line px-3 py-2 text-sm font-bold">{order.status}</span>
                        <Button variant="outline">
                          <Download className="size-4" />
                          Ticket
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "saved" && (
              <div className="grid gap-5">
                <SectionTitle eyebrow="Wishlist" title="Saved events" />
                <div className="grid gap-4 md:grid-cols-3">
                  {savedEventCards.map((event) => (
                    <article key={event.id} className="rounded-lg border border-line bg-surface p-4">
                      <p className="text-sm font-bold text-brand">{event.category}</p>
                      <h3 className="mt-2 text-xl font-black text-ink">{event.title}</h3>
                      <p className="mt-2 text-sm text-ink-muted">{event.date} at {event.location.city}</p>
                      <Button className="mt-4 w-full" size="lg">View event</Button>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "wallet" && (
              <div className="grid gap-5 xl:grid-cols-[0.75fr_1fr]">
                <article className="rounded-lg border border-line bg-ink p-5 text-background">
                  <p className="text-sm text-background/70">Available balance</p>
                  <p className="mt-2 text-4xl font-black">$17.00</p>
                  <p className="mt-5 text-sm text-background/75">Default card ending in 4821</p>
                </article>
                <article className="rounded-lg border border-line bg-surface p-4">
                  <SectionTitle eyebrow="Payments" title="Recent wallet activity" />
                  <div className="mt-4 grid gap-3">
                    {walletActivity.map((item) => (
                      <div key={item.label} className="flex items-center justify-between gap-3 rounded-md border border-line bg-background p-3">
                        <div>
                          <p className="font-semibold text-ink">{item.label}</p>
                          <p className="text-sm text-ink-muted">{item.date} - {item.status}</p>
                        </div>
                        <p className="font-black text-ink">{item.amount}</p>
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="grid gap-5 md:grid-cols-2">
                <article className="rounded-lg border border-line bg-surface p-5">
                  <SectionTitle eyebrow="Account" title="Profile readiness" />
                  <div className="mt-5 h-3 rounded-full bg-background">
                    <div className="h-3 w-[82%] rounded-full bg-positive" />
                  </div>
                  <p className="mt-3 text-sm text-ink-muted">Add a phone number and emergency contact to finish setup.</p>
                </article>
                <article className="rounded-lg border border-line bg-surface p-5">
                  <SectionTitle eyebrow="Security" title="Protected checkout" />
                  <div className="mt-4 flex items-center gap-3 rounded-md border border-line bg-background p-4">
                    <ShieldCheck className="size-8 text-positive" />
                    <p className="text-sm text-ink-muted">Email verified, password active, and checkout alerts enabled.</p>
                  </div>
                  <Button variant="outline" className="mt-4">
                    <Settings className="size-4" />
                    Manage settings
                  </Button>
                </article>
              </div>
            )}

            {activeTab === "support" && (
              <div className="rounded-lg border border-line bg-surface p-5">
                <SectionTitle eyebrow="Help" title="Support center" />
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  {["Request a refund", "Transfer a ticket", "Contact organizer"].map((item) => (
                    <button key={item} type="button" className="rounded-lg border border-line bg-background p-4 text-left font-bold text-ink transition hover:border-brand">
                      {item}
                      <p className="mt-2 text-sm font-normal text-ink-muted">Start a guided support request.</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default UserDashboardPage;
