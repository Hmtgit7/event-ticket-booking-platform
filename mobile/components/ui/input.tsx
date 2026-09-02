import * as React from "react";
import { Text, TextInput, View, type TextInputProps } from "react-native";

import { cn } from "@/lib/utils";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

/** Base form field - label + input + inline error, matching the brand's card/line tokens. */
export function Input({ label, error, containerClassName, className, ...props }: InputProps) {
  return (
    <View className={cn("gap-1.5", containerClassName)}>
      {label ? <Text className="text-sm font-medium text-ink">{label}</Text> : null}
      <TextInput
        placeholderTextColor="#8a8375"
        className={cn(
          "rounded-xl border border-line bg-surface px-4 py-3.5 text-base text-ink",
          error && "border-brand",
          className,
        )}
        {...props}
      />
      {error ? <Text className="text-sm text-brand">{error}</Text> : null}
    </View>
  );
}
