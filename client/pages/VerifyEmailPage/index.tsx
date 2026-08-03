import { Suspense } from "react";

import { VerifyEmailStatus } from "@/components/auth/verify-email-status";
import { AuthLayout } from "@/layouts/AuthLayout";

export function VerifyEmailPage() {
  return (
    <AuthLayout>
      <div className="w-full max-w-[420px]">
        {/* useSearchParams (inside VerifyEmailStatus) requires a Suspense boundary in the app router. */}
        <Suspense fallback={null}>
          <VerifyEmailStatus />
        </Suspense>
      </div>
    </AuthLayout>
  );
}

export default VerifyEmailPage;
