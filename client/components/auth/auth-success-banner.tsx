interface AuthSuccessBannerProps {
  message: string | null;
}

export function AuthSuccessBanner({ message }: AuthSuccessBannerProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      role="status"
      className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5 text-sm font-medium text-emerald-700"
    >
      {message}
    </div>
  );
}
