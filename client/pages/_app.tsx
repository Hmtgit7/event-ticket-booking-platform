import type { AppProps } from "next/app";

import "../styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/lib/query-client";
import { AuthHydrator } from "@/providers/auth-hydrator";
import { AuthSessionProvider } from "@/providers/auth-session-provider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthSessionProvider>
          <AuthHydrator />
          <Component {...pageProps} />
        </AuthSessionProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
