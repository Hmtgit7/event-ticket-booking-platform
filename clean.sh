#!/usr/bin/env bash
# Stops everything start.sh started, and cleans build artifacts.
# Run with: ./clean.sh              (stop processes + mvn/pnpm clean, keep DB data)
#           ./clean.sh --volumes    (also wipe docker volumes, i.e. Postgres data)
#           ./clean.sh --stop-only  (just kill processes + docker compose down, no build clean)
set -uo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"

PID_DIR=".pids"
LOG_DIR="logs"
WIPE_VOLUMES=false
STOP_ONLY=false
SERVICES=(auth-service event-service booking-service notification-service)

for arg in "$@"; do
  case "$arg" in
    --volumes) WIPE_VOLUMES=true ;;
    --stop-only) STOP_ONLY=true ;;
  esac
done

echo "==> Stopping background processes"
if [ -d "$PID_DIR" ]; then
  for pidfile in "$PID_DIR"/*.pid; do
    [ -e "$pidfile" ] || continue
    name="$(basename "$pidfile" .pid)"
    pid="$(cat "$pidfile")"
    if kill -0 "$pid" 2>/dev/null; then
      echo "    stopping $name (pid $pid)"
      kill "$pid" 2>/dev/null || true
      sleep 1
      kill -9 "$pid" 2>/dev/null || true
    fi
    rm -f "$pidfile"
  done
fi

echo "==> Stopping infra containers"
if $WIPE_VOLUMES; then
  docker compose -f infra/docker-compose.yml down -v
  echo "    postgres/redis/redpanda data volumes wiped"
else
  docker compose -f infra/docker-compose.yml down
fi

if $STOP_ONLY; then
  echo "Done (stop-only)."
  exit 0
fi

echo "==> Cleaning Maven build output for each service"
for svc in "${SERVICES[@]}"; do
  if [ -d "services/$svc" ]; then
    echo "    cleaning $svc"
    (cd "services/$svc" && ./mvnw -q clean)
  fi
done

echo "==> Cleaning client build output"
if [ -d client ]; then
  rm -rf client/.next
fi

echo "==> Removing logs"
rm -rf "$LOG_DIR"

echo "Done. (Use --volumes to also wipe DB data, --stop-only to skip build cleanup.)"
