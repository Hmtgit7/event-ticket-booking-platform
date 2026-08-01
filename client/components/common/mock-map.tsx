import { MapPin } from "lucide-react";
import type { EventLocation } from "@/interfaces/event.interface";
import { cn } from "@/lib/utils";

interface MockMapProps {
  location: EventLocation;
  className?: string;
}

/** Stylised, dependency-free stand-in for an embedded map — a few soft
 * "terrain" blobs plus a labelled pin, so the layout communicates a map
 * without pulling in a real maps SDK for dummy data. */
export function MockMap({ location, className }: MockMapProps) {
  return (
    <div className={cn("relative h-full min-h-[220px] overflow-hidden rounded-2xl bg-[#dce7d9]", className)}>
      <svg viewBox="0 0 400 260" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="260" fill="#dce7d9" />
        <path d="M0 40 C 80 10, 160 70, 240 30 S 400 60, 400 20 V0H0Z" fill="#cfe0cb" />
        <path d="M0 260 C 100 200, 220 260, 320 210 S 400 240, 400 260Z" fill="#c7dbe0" />
        <circle cx="120" cy="140" r="3" fill="#a9c7ae" />
        <circle cx="260" cy="180" r="2" fill="#a9c7ae" />
        <path d="M40 100 L 360 130" stroke="#b9c9b5" strokeWidth="2" />
        <path d="M60 220 L 300 60" stroke="#b9c9b5" strokeWidth="1.5" />
      </svg>

      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center">
        <div className="flex items-center gap-1 rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-on-elevated shadow-lg">
          <MapPin className="size-3.5" />
          {location.city}
        </div>
        <span className="mt-1 h-2 w-2 rounded-full bg-brand ring-4 ring-brand/25" />
      </div>
    </div>
  );
}
