#!/usr/bin/env bash
# Stops everything start.sh started. Does NOT delete build output or data
# (that's clean.sh). Safe to run any time.
#
# Run with: ./stop.sh                (stop app processes + infra containers)
#           ./stop.sh --processes    (stop only client/services, leave infra running)
#           ./stop.sh --infra        (stop only infra containers, leave app processes)
set -uo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"
source scripts/process-lib.sh

PID_DIR=".pids"
MODE="${1:-all}"

stop_processes() {
  echo "==> Stopping background processes (client + services)"
  stop_pidfiles "$PID_DIR"
}

stop_infra() {
  echo "==> Stopping infra containers (postgres, redis, redpanda)"
  if [ -f infra/docker-compose.yml ]; then
    docker compose -f infra/docker-compose.yml down
  else
    echo "    infra/docker-compose.yml not found, skipping"
  fi
}

case "$MODE" in
  --processes) stop_processes ;;
  --infra)     stop_infra ;;
  all)
    stop_processes
    stop_infra
    ;;
  *)
    echo "Unknown mode: $MODE (expected: (none)|--processes|--infra)" >&2
    exit 1
    ;;
esac

echo "Done."
