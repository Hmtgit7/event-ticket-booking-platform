import { Suspense } from "react";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { AuthLayout } from "@/layouts/AuthLayout";

export function ResetPasswordPage() {
  return (
    <AuthLayout>
      <div className="w-full max-w-[420px]">
        {/* useSearchParams (inside ResetPasswordForm) requires a Suspense boundary in the app router. */}
        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </AuthLayout>
  );
}

export default ResetPasswordPage;
