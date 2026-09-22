# GrabMyTicket Architecture

GrabMyTicket is organized as a monorepo with one Next.js client, four independently deployable Spring Boot services, and one independently deployable NestJS service.

## Services

| Path | Responsibility |
| --- | --- |
| `services/auth-service` | Users, roles, JWT issuing, Google OAuth2, login/signup protection |
| `services/event-service` | Venues, events, seat-map definitions, pricing, Redis-backed listings |
| `services/booking-service` | Seat holds, Redis locks, booking state, and Kafka events |
| `services/payment-service` | Razorpay orders and webhooks |
| `services/notification-service` | NestJS Kafka consumer for booking events and email delivery over SMTP |

Each Spring Boot service keeps its own Maven wrapper and `pom.xml`; the notification service uses its own `package.json` and pnpm workflow. Render can deploy each service from its root directory. The repository root also has an aggregator `pom.xml` for local and CI checks across the Spring Boot services.

## Local Infrastructure

Run shared dependencies with:

```bash
docker compose -f infra/docker-compose.yml up -d
```

Local services use the `local` Spring profile. Production services should set `SPRING_PROFILES_ACTIVE=prod` and provide managed Postgres, Redis, Kafka, OAuth, SMTP, and payment credentials through environment variables.

## Build and Test

From the repository root:

```bash
pnpm lint
pnpm typecheck
pnpm build:services
```

Each backend can also build independently:

```bash
cd services/auth-service
./mvnw clean package
```
