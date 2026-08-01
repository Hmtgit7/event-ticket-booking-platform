"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { HERO_MEDIA } from "@/constants/marketing-content";
import { cn } from "@/lib/utils";

export function HeroMediaCarousel() {
  const [active, setActive] = useState(0);
  const slide = HERO_MEDIA[active];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % HERO_MEDIA.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, []);

  function move(direction: number) {
    setActive((current) => (current + direction + HERO_MEDIA.length) % HERO_MEDIA.length);
  }

  return (
    <div className="relative min-h-[500px] overflow-hidden rounded-[28px] border border-white/10 bg-[#15110d] p-4 shadow-[0_30px_90px_rgba(21,19,15,0.38)]">
      <div className="absolute -left-20 top-10 h-60 w-60 rounded-full bg-brand/25 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-positive/20 blur-3xl" />

      <div className="relative h-full min-h-[468px] overflow-hidden rounded-[22px] bg-black">
        {slide.kind === "video" ? (
          <video key={slide.src} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover opacity-80">
            <source src={slide.src} type="video/mp4" />
          </video>
        ) : (
          <div className="absolute inset-0 bg-cover bg-center transition duration-700" style={{ backgroundImage: `url(${slide.src})` }} />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.75)_100%)]" />

        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/12 px-3 py-2 text-xs font-bold text-white backdrop-blur">
          <Play className="size-3 fill-white" />
          {slide.eyebrow}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <div className="rounded-[20px] border border-white/10 bg-black/35 p-5 text-white backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Now featured</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">{slide.title}</h2>
            <p className="mt-2 text-sm text-white/72">{slide.meta}</p>
          </div>
        </div>

        <div className="absolute right-4 top-4 flex gap-2">
          <ArrowButton label="Previous hero media" onClick={() => move(-1)} icon={ArrowLeft} />
          <ArrowButton label="Next hero media" onClick={() => move(1)} icon={ArrowRight} />
        </div>

        <div className="absolute bottom-6 right-6 flex gap-2" aria-label="Hero media slides">
          {HERO_MEDIA.map((item, index) => (
            <button
              key={item.title}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show ${item.title}`}
              aria-current={active === index}
              className={cn(
                "h-2.5 rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70",
                active === index ? "w-8 bg-brand" : "w-2.5 bg-white/35 hover:bg-white/60",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ArrowButton({ label, onClick, icon: Icon }: { label: string; onClick: () => void; icon: typeof ArrowLeft }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="flex size-10 items-center justify-center rounded-full bg-white/12 text-white backdrop-blur transition hover:bg-white/20">
      <Icon className="size-4" />
    </button>
  );
}
