import { AdminLoginForm } from "@/components/auth/admin-login-form";
import { AuthLayout } from "@/layouts/AuthLayout";

export function AdminLoginPage() {
  return (
    <AuthLayout>
      <div className="w-full max-w-[420px]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-muted">
            Admin access
          </p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
            Sign in to the admin panel.
          </h1>
          <p className="mt-3 text-sm leading-6 text-ink-muted">
            This login is separate from organizer and attendee accounts.
          </p>
        </div>

        <div className="mt-7">
          <AdminLoginForm />
        </div>
      </div>
    </AuthLayout>
  );
}

export default AdminLoginPage;
