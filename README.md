# GrabMyTicket

Concert and event ticket booking platform built as a monorepo.

## Repository layout

```text
.
|-- client/                         # Next.js frontend
|-- services/
|   |-- auth-service/               # Spring Boot auth/JWT/OAuth2 service
|   |-- event-service/              # Spring Boot event and venue service
|   |-- booking-service/            # Spring Boot booking/payment/seat-lock service
|   `-- notification-service/       # Spring Boot Kafka/mail notification service
|-- gateway/                        # Nginx gateway config for local/deploy proxying
|-- infra/                          # Local Postgres, Redis, and Redpanda
|-- docs/                           # Architecture and development docs
`-- .github/workflows/              # CI checks
```

## Local development

```bash
chmod +x start.sh stop.sh clean.sh   # once, after cloning
./start.sh      # infra + all 4 services + client, backgrounded
./stop.sh       # stop everything (processes + infra containers), keeps data
./clean.sh      # stop + clean .next/target/logs/pids; add --volumes to also wipe DB data, --deep to remove node_modules
```

Each script also takes a narrower mode — see the comment header in each
file (e.g. `./start.sh services`, `./stop.sh --infra`).

## Development checks

```bash
pnpm lint
pnpm typecheck
pnpm build:services
```

Backend services remain independently deployable. Render should point each service at its own root directory under `services/<service-name>`.
