import { Suspense } from "react";

import { LinkPasswordForm } from "@/components/auth/link-password-form";
import { AuthLayout } from "@/layouts/AuthLayout";

export function LinkPasswordPage() {
  return (
    <AuthLayout>
      <div className="w-full max-w-[420px]">
        {/* useSearchParams (inside LinkPasswordForm) requires a Suspense boundary in the app router. */}
        <Suspense fallback={null}>
          <LinkPasswordForm />
        </Suspense>
      </div>
    </AuthLayout>
  );
}

export default LinkPasswordPage;
