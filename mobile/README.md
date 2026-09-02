# GrabMyTicket - Mobile (Expo / React Native)

Cross-platform (iOS + Android, web as a bonus) customer app for GrabMyTicket,
built with Expo SDK 57 + React Native 0.86 + React 19. This mirrors the
architecture and conventions of `client/` (the Next.js web app) wherever a
mobile equivalent exists, so the two frontends stay easy to reason about
together.

## Stack

- **Expo Router** (file-based routing, `app/` directory - same mental model
  as Next.js App Router)
- **NativeWind v4** (Tailwind CSS utility classes for React Native)
- **Zustand** for client state (auth store), **TanStack Query** for server
  state - identical libraries to `client/`
- **expo-secure-store** for token persistence (Keychain/Keystore-backed;
  the RN equivalent of `client/lib/token-storage.ts`'s cookies)
- **lucide-react-native** for icons (RN port of `lucide-react`, used on web)

## Getting started

```bash
cd mobile
cp .env.example .env          # fill in your local service URLs
npx expo install --fix        # aligns dependency versions to SDK 57
pnpm start                    # or: pnpm android / pnpm ios / pnpm web
```

On a physical device (Expo Go) or emulator, `localhost` in `.env` won't
resolve to your laptop:
- **Android emulator**: use `10.0.2.2` instead of `localhost`
- **Physical device**: use your machine's LAN IP (e.g. `192.168.x.x`)
- **iOS simulator**: `localhost` works as-is

## Architecture - how this maps to `client/`

| Concern | client/ (Next.js) | mobile/ (Expo) |
|---|---|---|
| Routing | `app/` (App Router) | `app/` (Expo Router) |
| Token storage | `lib/token-storage.ts` (cookies via js-cookie) | `lib/token-storage.ts` (expo-secure-store + in-memory cache) |
| API client | `lib/api-client.ts` (per-service fetch factory) | Same, byte-for-byte logic |
| Auth state | `store/auth-store.ts` (zustand) | Same, `setSession`/`clearSession` are async here |
| Styling | Tailwind v4 + shadcn/ui, CSS vars in `styles/globals.css` | NativeWind v4 (Tailwind v3 line) + flat color tokens in `tailwind.config.js` (RN can't resolve CSS custom properties at runtime) |
| Icons | `lucide-react` | `lucide-react-native` |

No API gateway in this architecture (see `docs/architecture.md` at the repo
root) - the app calls `auth-service`, `event-service`, `booking-service`,
`payment-service`, and `notification-service` directly, same as the web
client. Base URLs live in `lib/env.ts`, read from `EXPO_PUBLIC_*` env vars
(Expo's equivalent of Next's `NEXT_PUBLIC_*` - anything without that prefix
never reaches the JS bundle).

## What's scaffolded

- **Auth**: signup, login, JWT decode/expiry check, silent refresh with
  request de-duplication, SecureStore-backed persistence, hydration-aware
  root redirect (`app/index.tsx`) with a held-open splash screen so there's
  no logged-out flash on cold start.
- **Navigation**: `(auth)` stack (login/signup) and `(tabs)` tab bar
  (Explore, Saved, Tickets, Wallet, Profile) - mirrors the customer-facing
  routes under `client/app/user/dashboard/*`.
- **Explore**: live-fetches `GET /events/public` and renders a scrollable
  event list; tapping a card opens `app/event/[slug].tsx`, which fetches
  `GET /events/public/:slug` and shows the full detail + a "Book now" CTA.
- **Theming**: brand tokens ported from `client/styles/globals.css` into
  `tailwind.config.js` (light mode only for now).
- **Base UI**: `Screen` (safe-area wrapper), `Button` (4 variants), `Input`
  - small, composable primitives rather than a full design system, same
    spirit as `client/components/ui`.

## Explicitly deferred (backlog)

These exist on the web client but were intentionally left out of this pass
to keep the initial foundation reviewable. Each is a natural next PR:

- **Booking & checkout flow** - ticket type selection, Razorpay payment
  (payment-service is the only service that talks to Razorpay - see root
  memory/CLAUDE notes), booking confirmation
- **Wallet** - real balance + transaction history (`wallet.service.ts`
  port); remember the customer wallet is closed-loop/spend-only, never add
  a withdraw action
- **Saved events** - needs a persisted store + sync endpoint
- **Google OAuth** - `expo-auth-session` + Google provider, bridging to
  `POST /auth/oauth2/google` the same way `client/app/auth/oauth-bridge`
  does for web
- **Push notifications** - `expo-notifications` + a device-token
  registration endpoint on `notification-service`
- **Dark mode** - `tailwind.config.js` only has light-mode tokens right now
- **Organizer-mode mobile screens** - the organizer dashboard
  (`client/app/dashboard/*`) stays web-only for the foreseeable future;
  mobile is customer-first
- **Category/city/search filters** on Explore
- **`app/(tabs)/index.tsx.tmp`** - stray artifact from a bad edit during
  scaffolding, inert (Expo Router ignores non-`.ts(x)` files) but should be
  deleted by hand
- Old `App.tsx` / `index.ts` at the project root are dead now that
  `expo-router/entry` is the entry point - also safe to delete by hand

## Conventions carried over from `client/`

- Path alias `@/*` maps to the `mobile/` root (see `tsconfig.json`), same
  pattern as web
- One concern per file: `lib/`, `services/`, `store/`, `interfaces/`,
  `enums/`, `hooks/`, `providers/`, `components/ui/`
- Services are thin fetch wrappers with zero business logic; that lives in
  hooks/screens
- Commit scope for this package is `mobile` (already added to the root
  `.commitlintrc.json`)
