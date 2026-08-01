import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";
import { AuthLayout } from "@/layouts/AuthLayout";

export function SignupPage() {
  return (
    <AuthLayout>
      <div className="w-full max-w-[420px]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-muted">
            Start selling
          </p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
            Create your organizer account.
          </h1>
          <p className="mt-3 text-sm leading-6 text-ink-muted">
            Set up your workspace to publish events, manage tickets, and track every booking from one dashboard.
          </p>
        </div>

        <div className="mt-7">
          <SignupForm />
        </div>

        <p className="mt-5 text-center text-xs font-medium leading-5 text-ink-muted">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold text-brand underline-offset-4 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default SignupPage;
