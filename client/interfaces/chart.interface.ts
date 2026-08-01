export interface ChartPoint {
  label: string;
  value: number;
}

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

/** A pre-computed SVG arc for one donut segment, in a 0-100 viewBox. */
export interface DonutArc {
  segment: DonutSegment;
  pathLength: number;
  offset: number;
  percent: number;
}
