"use client";

import { useMemo } from "react";
import type { ChartPoint } from "@/interfaces/chart.interface";
import type { BarChartVariant } from "@/types/dashboard.types";
import { cn } from "@/lib/utils";

interface BarChartProps {
  points: ChartPoint[];
  variant: BarChartVariant;
  height?: number;
  /** Index of the bar to render with the accent color instead of ink. */
  accentIndex?: number;
  className?: string;
}

interface PlottedPoint extends ChartPoint {
  heightPct: number;
  xPct: number;
}

/** Shared layout math for all three bar-chart looks: positions each point
 * on a 0-100 x/height percentage grid so bars and the optional overlaid
 * line always agree on coordinates. */
function usePlottedPoints(points: ChartPoint[]): PlottedPoint[] {
  return useMemo(() => {
    const max = Math.max(...points.map((p) => p.value), 1);
    return points.map((point, index) => ({
      ...point,
      heightPct: Math.max((point.value / max) * 100, 6),
      xPct: points.length > 1 ? (index / (points.length - 1)) * 100 : 50,
    }));
  }, [points]);
}

export function BarChart({ points, variant, height = 220, accentIndex, className }: BarChartProps) {
  const plotted = usePlottedPoints(points);
  const showLine = variant === "capsule-line" || variant === "stem-dot-line";

  const linePath = useMemo(() => {
    if (!showLine) return "";
    return plotted.map((p, i) => `${i === 0 ? "M" : "L"}${p.xPct},${100 - p.heightPct}`).join(" ");
  }, [plotted, showLine]);

  return (
    <div className={cn("w-full", className)}>
      <div className="relative flex items-end gap-2 sm:gap-3" style={{ height }}>
        {showLine && (
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
            <path
              d={linePath}
              fill="none"
              stroke="var(--color-surface)"
              strokeWidth="0.9"
              vectorEffect="non-scaling-stroke"
              opacity={variant === "capsule-line" ? 0.9 : 0.5}
            />
            {plotted.map((p) => (
              <circle
                key={p.label}
                cx={p.xPct}
                cy={100 - p.heightPct}
                r={variant === "capsule-line" ? 1.4 : 1.1}
                fill={variant === "capsule-line" ? "var(--color-surface)" : "var(--color-ink)"}
              />
            ))}
          </svg>
        )}

        {plotted.map((point, index) => (
          <Bar key={point.label} point={point} variant={variant} accent={index === accentIndex} />
        ))}
      </div>

      <div className="mt-3 flex gap-2 sm:gap-3">
        {plotted.map((point) => (
          <span key={point.label} className="flex-1 text-center text-xs text-ink-muted">
            {point.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function Bar({ point, variant, accent }: { point: PlottedPoint; variant: BarChartVariant; accent: boolean }) {
  if (variant === "stem-dot-line") {
    return (
      <div className="relative z-10 flex flex-1 items-end justify-center">
        <div className={cn("w-px rounded-full", accent ? "bg-brand" : "bg-ink/70")} style={{ height: `${point.heightPct}%` }} />
      </div>
    );
  }

  const isCapsule = variant === "capsule-line";
  const shapeClass = isCapsule ? "rounded-full" : "rounded-t-2xl rounded-b-md";
  const colorClass = accent
    ? "bg-gradient-to-b from-brand to-brand/70"
    : isCapsule
      ? "bg-gradient-to-b from-ink to-ink/70"
      : "bg-ink";

  return (
    <div
      className={cn("relative z-10 flex-1", shapeClass, colorClass)}
      style={{ height: `${point.heightPct}%` }}
      title={`${point.label}: ${point.value}`}
    />
  );
}
