#!/usr/bin/env bash
# Starts backend dependencies and services only. The client is intentionally not started.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"

./start.sh infra
./start.sh services

echo ""
echo "Backend services are starting in the background."
echo "Run the frontend separately with: cd client && pnpm dev"
