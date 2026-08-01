import {
  Utensils,
  Cpu,
  Shirt,
  Music2,
  Salad,
  Mountain,
  type LucideIcon,
} from "lucide-react";

export const EventCategory = {
  FoodCulinary: "Food & Culinary",
  Technology: "Technology",
  Fashion: "Fashion",
  OutdoorAdventure: "Outdoor & Adventure",
  Music: "Music",
  HealthFitness: "Health & Fitness",
} as const;

export type EventCategory = (typeof EventCategory)[keyof typeof EventCategory];

/** Icon + accent gradient used on category tiles when no photo is supplied. */
export const CATEGORY_VISUAL: Record<
  EventCategory,
  { icon: LucideIcon; from: string; to: string }
> = {
  [EventCategory.FoodCulinary]: { icon: Utensils, from: "#3f3a2e", to: "#171410" },
  [EventCategory.Technology]: { icon: Cpu, from: "#1a2230", to: "#0a0d12" },
  [EventCategory.Fashion]: { icon: Shirt, from: "#3a2430", to: "#161014" },
  [EventCategory.OutdoorAdventure]: { icon: Mountain, from: "#33301f", to: "#12110a" },
  [EventCategory.Music]: { icon: Music2, from: "#2a1f38", to: "#0f0b16" },
  [EventCategory.HealthFitness]: { icon: Salad, from: "#233223", to: "#0d130d" },
};
