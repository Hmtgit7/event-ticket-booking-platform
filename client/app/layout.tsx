import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne, Playfair_Display } from "next/font/google";
import "../styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/lib/query-client";
import { AuthHydrator } from "@/providers/auth-hydrator";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "800"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://grabmyticket.vercel.app"),
  title: {
    default: "GrabMyTicket — Book tickets for stand-up comedy & live shows",
    template: "%s | GrabMyTicket",
  },
  description:
    "Discover and book tickets for stand-up comedy shows and live events near you. Browse by city, category, and price on GrabMyTicket.",
  icons: "/logo.svg",
  openGraph: {
    siteName: "GrabMyTicket",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <QueryProvider>
            <AuthHydrator />
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
