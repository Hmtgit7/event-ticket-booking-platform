import { BrandLogo } from "@/components/common/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";

export function AuthBrandRow() {
  return (
    <div className="flex items-center justify-between gap-4">
      <BrandLogo />
      <ThemeToggle />
    </div>
  );
}
