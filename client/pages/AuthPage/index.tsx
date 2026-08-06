import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthLayout } from "@/layouts/AuthLayout";

export function AuthPage() {
  return (
    <AuthLayout>
      <div className="w-full max-w-[420px]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-muted">
            Welcome back
          </p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
            Login to manage your events.
          </h1>
          <p className="mt-3 text-sm leading-6 text-ink-muted">
            Access bookings, attendees, ticket sales, and event insights from your GrabMyTicket workspace.
          </p>
        </div>

        <div className="mt-7">
          <Suspense fallback={null}>
            <AuthForm />
          </Suspense>
        </div>

        <div className="mt-5 space-y-3 text-center text-xs font-medium leading-5 text-ink-muted">
          <p>
            By continuing, you agree to GrabMyTicket&apos;s{" "}
            <Link href="/terms" className="text-ink underline-offset-4 hover:underline">Terms</Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="text-ink underline-offset-4 hover:underline">Privacy Policy</Link>.
          </p>

          <p>
            New to GrabMyTicket?{" "}
            <Link href="/auth/signup" className="font-semibold text-brand underline-offset-4 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

export default AuthPage;
