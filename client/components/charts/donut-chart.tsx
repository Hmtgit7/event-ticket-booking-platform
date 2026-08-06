"use client";

import { useDonutGeometry } from "@/hooks/use-donut-geometry";
import type { DonutArc, DonutSegment } from "@/interfaces/chart.interface";
import { cn } from "@/lib/utils";

interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
  /** Show a % callout near each segment's midpoint. */
  showPercentLabels?: boolean;
  className?: string;
}

/**
 * Generic multi-segment ring chart built from stacked SVG `<circle>`
 * strokes. Works for a 2-segment gender split, a 3-segment ticket-type
 * donut, or a single-value gauge (pass one segment; the remainder
 * renders as the neutral track automatically). The viewBox matches
 * `size` 1:1 (pixels), so `strokeWidth` behaves intuitively at any size
 * instead of relying on a fixed percentage-trick viewBox.
 */
export function DonutChart({
  segments,
  size = 200,
  strokeWidth = 14,
  centerLabel,
  centerValue,
  showPercentLabels = false,
  className,
}: DonutChartProps) {
  const { arcs } = useDonutGeometry(segments);
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const toLength = (percent: number) => (percent / 100) * circumference;

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        width={size}
        height={size}
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth={strokeWidth}
          strokeOpacity={0.4}
        />
        {arcs.map((arc) => (
          <circle
            key={arc.segment.label}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={arc.segment.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${toLength(arc.pathLength)} ${circumference - toLength(arc.pathLength)}`}
            strokeDashoffset={-toLength(arc.offset)}
            strokeLinecap={arcs.length > 1 ? "butt" : "round"}
          />
        ))}
      </svg>

      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          {centerValue && (
            <span className="text-3xl font-bold text-ink">{centerValue}</span>
          )}
          {centerLabel && (
            <span className="mt-1 text-xs text-ink-muted">{centerLabel}</span>
          )}
        </div>
      )}

      {showPercentLabels && (
        <div className="pointer-events-none absolute inset-0">
          {arcs.map((arc) => (
            <PercentCallout key={arc.segment.label} arc={arc} size={size} />
          ))}
        </div>
      )}
    </div>
  );
}

function PercentCallout({ arc, size }: { arc: DonutArc; size: number }) {
  const midPercent = arc.offset + arc.pathLength / 2;
  const angle = (midPercent / 100) * 2 * Math.PI - Math.PI / 2;
  const r = size * 0.42;
  const x = size / 2 + r * Math.cos(angle);
  const y = size / 2 + r * Math.sin(angle);

  return (
    <span
      className="absolute -translate-x-1/2 -translate-y-1/2 text-xs font-medium text-ink"
      style={{ left: x, top: y }}
    >
      {Math.round(arc.percent)}%
    </span>
  );
}
