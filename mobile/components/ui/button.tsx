import * as React from "react";
import { ActivityIndicator, Pressable, Text, type PressableProps } from "react-native";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

interface ButtonProps extends Omit<PressableProps, "children"> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  loading?: boolean;
  className?: string;
}

const VARIANT_CONTAINER: Record<ButtonVariant, string> = {
  primary: "bg-brand active:opacity-90",
  secondary: "bg-ink active:opacity-90",
  outline: "border border-line bg-transparent active:bg-surface-hover",
  ghost: "bg-transparent active:bg-surface-hover",
};

const VARIANT_TEXT: Record<ButtonVariant, string> = {
  primary: "text-brand-foreground",
  secondary: "text-canvas",
  outline: "text-ink",
  ghost: "text-ink",
};

/**
 * Base pressable button - four variants covering every CTA style used
 * across the web client's dashboard (primary/secondary/outline/ghost).
 * Extend rather than duplicate when a screen needs a one-off style.
 */
export function Button({ children, variant = "primary", loading, disabled, className, ...props }: ButtonProps) {
  return (
    <Pressable
      disabled={disabled || loading}
      className={cn(
        "flex-row items-center justify-center rounded-2xl px-5 py-3.5",
        VARIANT_CONTAINER[variant],
        (disabled || loading) && "opacity-50",
        className,
      )}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#f6f1e7" : "#17140f"} />
      ) : (
        <Text className={cn("text-base font-semibold", VARIANT_TEXT[variant])}>{children}</Text>
      )}
    </Pressable>
  );
}
