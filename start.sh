#!/usr/bin/env bash
# Starts infra (Postgres/Redis/Redpanda), all Spring Boot services, and the client.
# Run with: ./start.sh          (start everything)
#           ./start.sh infra    (infra only)
#           ./start.sh services (services only, assumes infra already up)
#           ./start.sh client   (client only)
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"

MODE="${1:-all}"
LOG_DIR="logs"
PID_DIR=".pids"
mkdir -p "$LOG_DIR" "$PID_DIR"

SERVICES=(auth-service event-service booking-service notification-service)

start_infra() {
  echo "==> Starting infra (postgres, redis, redpanda)"
  docker compose -f infra/docker-compose.yml up -d

  echo "==> Waiting for postgres to be healthy..."
  for i in $(seq 1 30); do
    if docker exec "$(docker compose -f infra/docker-compose.yml ps -q postgres)" pg_isready -U grabmyticket >/dev/null 2>&1; then
      echo "    postgres is ready"
      return 0
    fi
    sleep 1
  done
  echo "    postgres did not become ready in time" >&2
  exit 1
}

start_services() {
  for svc in "${SERVICES[@]}"; do
    echo "==> Starting $svc (port varies, see services/$svc/src/main/resources/application.yaml)"
    (
      cd "services/$svc"
      nohup ./mvnw -q spring-boot:run > "../../$LOG_DIR/$svc.log" 2>&1 &
      echo $! > "../../$PID_DIR/$svc.pid"
    )
  done
  echo "    services launching in background, tailing logs at ./$LOG_DIR/<service>.log"
}

start_client() {
  echo "==> Starting client (pnpm dev, http://localhost:3000)"
  (
    cd client
    nohup pnpm dev > "../$LOG_DIR/client.log" 2>&1 &
    echo $! > "../$PID_DIR/client.pid"
  )
}

case "$MODE" in
  infra)    start_infra ;;
  services) start_services ;;
  client)   start_client ;;
  all)
    start_infra
    start_services
    start_client
    ;;
  *)
    echo "Unknown mode: $MODE (expected: all|infra|services|client)" >&2
    exit 1
    ;;
esac

cat <<EOF

Done. Useful URLs once everything is up:
  Client:               http://localhost:3000
  Gateway (nginx):       http://localhost:8080  (needs gateway container/run separately, see gateway/nginx.conf)
  auth-service:          http://localhost:8081
  event-service:         http://localhost:8082
  booking-service:       http://localhost:8083
  notification-service:  http://localhost:8084 (no HTTP routes, Kafka consumer)

Logs:  ./$LOG_DIR/<service>.log
PIDs:  ./$PID_DIR/<service>.pid   (used by clean.sh to stop things)
EOF
