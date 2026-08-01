"use client";

import { useMemo } from "react";
import type { DonutArc, DonutSegment } from "@/interfaces/chart.interface";

const CIRCUMFERENCE = 100; // we work in percentage-of-circumference units

/**
 * Turns a list of {label, value, color} segments into stroke-dasharray
 * offsets for a ring built from stacked <circle> strokes. Centralizing the
 * trig/accumulation math in a memoized hook keeps the render function of
 * `DonutChart` a pure, declarative map over pre-computed arcs.
 */
export function useDonutGeometry(segments: DonutSegment[]): {
  arcs: DonutArc[];
  total: number;
} {
  return useMemo(() => {
    const total = segments.reduce((sum, segment) => sum + segment.value, 0) || 1;

    const arcs: DonutArc[] = [];
    let cursor = 0;

    for (const segment of segments) {
      const percent = (segment.value / total) * 100;
      const pathLength = (percent / 100) * CIRCUMFERENCE;
      arcs.push({ segment, pathLength, offset: cursor, percent });
      cursor += pathLength;
    }

    return { arcs, total };
  }, [segments]);
}
