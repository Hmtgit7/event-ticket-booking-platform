"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, MapPin, Play } from "lucide-react";

import { AuthBrandRow } from "@/components/auth/auth-brand-row";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Slide =
  | { kind: "image"; title: string; meta: string; location: string; image: string }
  | { kind: "video"; title: string; meta: string; location: string; video: string; poster: string };

const slides: Slide[] = [
  {
    kind: "image",
    title: "Arena Nights",
    meta: "Sat, 8:00 PM",
    location: "Downtown Stadium",
    image:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=85",
  },
  {
    kind: "image",
    title: "Festival Pass",
    meta: "3 day access",
    location: "City Park Grounds",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85",
  },
  {
    kind: "video",
    title: "Concert Crowd Live",
    meta: "General admission",
    location: "Riverside Arena",
    video:
      "https://assets.mixkit.co/videos/preview/mixkit-concert-crowd-jumping-and-cheering-14108-large.mp4",
    poster:
      "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1200&q=85",
  },
  {
    kind: "image",
    title: "Open Air Concert",
    meta: "General admission",
    location: "Riverside Grounds",
    image:
      "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1200&q=85",
  },
  {
    kind: "image",
    title: "Music Festival",
    meta: "Weekend lineup",
    location: "Main Square Arena",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=85",
  },
  {
    kind: "image",
    title: "Comedy Showcase",
    meta: "Limited seats",
    location: "Grand Theatre",
    image:
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1200&q=85",
  },
  {
    kind: "video",
    title: "Standup Night",
    meta: "Special performance",
    location: "The Laugh Club",
    video:
      "https://assets.mixkit.co/videos/preview/mixkit-microphone-on-stage-20833-large.mp4",
    poster:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=85",
  },
];

export function EventImageCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 4800);

    return () => window.clearInterval(timer);
  }, []);

  // Restart video when its slide becomes active
  useEffect(() => {
    if (activeSlide.kind === "video" && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [activeIndex, activeSlide.kind]);

  return (
    <div className="relative h-full min-h-[420px] overflow-hidden rounded-[28px] border border-line bg-surface-elevated p-5 text-on-elevated shadow-[0_28px_80px_rgba(21,19,15,0.26)]">
      <div className="absolute inset-0 opacity-35">
        <div className="absolute -left-20 top-12 h-64 w-64 rounded-full bg-brand blur-3xl" />
        <div className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-positive blur-3xl" />
      </div>

      <div className="relative flex h-full flex-col justify-between gap-5">
        <div className="text-on-elevated [&_button]:border-white/10 [&_button]:bg-white/10 [&_button]:text-on-elevated [&_button:hover]:border-brand/70 [&_button:hover]:bg-white/15">
          <AuthBrandRow />
        </div>

        <div className="relative mx-auto flex w-full max-w-[620px] flex-1 items-center justify-center py-2">
          <div className="absolute left-3 top-8 hidden h-28 w-40 rotate-[-8deg] rounded-2xl border border-white/10 bg-white/8 backdrop-blur md:block" />
          <div className="absolute bottom-8 right-2 hidden h-32 w-44 rotate-[7deg] rounded-2xl border border-white/10 bg-white/8 backdrop-blur md:block" />

          <article className="relative w-full max-w-[500px] overflow-hidden rounded-[24px] border border-white/10 bg-[#17140f] shadow-2xl">
            <div className="aspect-[1.12/1] overflow-hidden">
              {activeSlide.kind === "video" ? (
                <video
                  ref={videoRef}
                  key={activeSlide.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={activeSlide.poster}
                  className="h-full w-full object-cover"
                >
                  <source src={activeSlide.video} type="video/mp4" />
                </video>
              ) : (
                <Image
                  src={activeSlide.image}
                  alt={`${activeSlide.title} event preview`}
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover transition duration-700"
                />
              )}
            </div>

            {/* Video badge */}
            {activeSlide.kind === "video" && (
              <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                <Play className="size-3 fill-white" />
                Live Preview
              </div>
            )}

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_34%,rgba(0,0,0,0.72)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-md">
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                  {activeSlide.title}
                </h2>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-white/82">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-4" aria-hidden="true" />
                    {activeSlide.meta}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-4" aria-hidden="true" />
                    {activeSlide.location}
                  </span>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div className="relative flex items-end justify-between gap-6">
          <div>
            <h2 className="max-w-md text-3xl font-semibold leading-tight tracking-tight text-on-elevated">
              Book every event from one clean dashboard.
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-on-elevated/68">
              Discover events, reserve seats, and keep customer bookings in
              sync.
            </p>
          </div>

          <div
            className="flex shrink-0 gap-2"
            aria-label="Event preview slides"
          >
            {slides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show ${slide.title}`}
                aria-current={activeIndex === index}
                suppressHydrationWarning
                className={cn(
                  "h-2.5 rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70",
                  activeIndex === index
                    ? "w-8 bg-brand"
                    : "w-2.5 bg-white/25 hover:bg-white/45",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
