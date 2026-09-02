import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/** Mirrors client/lib/query-client.tsx exactly - same staleTime/retry defaults. */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
