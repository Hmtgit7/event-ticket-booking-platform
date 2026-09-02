import * as React from "react";
import { SafeAreaView, type SafeAreaViewProps } from "react-native-safe-area-context";

import { cn } from "@/lib/utils";

/**
 * Standard screen wrapper: safe-area padding + canvas background. Every
 * top-level route should render this as its outermost element so status-bar
 * and notch insets are handled consistently across screens, instead of each
 * screen reinventing SafeAreaView + padding.
 */
export function Screen({ className, children, ...props }: SafeAreaViewProps) {
  return (
    <SafeAreaView className={cn("flex-1 bg-canvas", className)} {...props}>
      {children}
    </SafeAreaView>
  );
}
