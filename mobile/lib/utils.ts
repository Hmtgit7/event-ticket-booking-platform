import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Same cn() convention as client/lib/utils.ts - merge conditional NativeWind classNames safely. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
