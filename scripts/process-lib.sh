#!/usr/bin/env bash
# Shared helpers for stop.sh and clean.sh. Not meant to be run directly.

# Recursively kill a process and its children.
# `spring-boot:run` forks a child JVM by default, so killing just the
# Maven launcher PID (what `$!` gives you in start.sh) can leave the
# actual Spring Boot app running as an orphan. Walking the tree via
# `pgrep -P` avoids that.
kill_tree() {
  local pid="$1"
  local sig="${2:-TERM}"

  if command -v pgrep >/dev/null 2>&1; then
    local child
    for child in $(pgrep -P "$pid" 2>/dev/null); do
      kill_tree "$child" "$sig"
    done
  fi

  kill -"$sig" "$pid" 2>/dev/null || true
}

# Stop everything tracked in .pids/*.pid (written by start.sh).
stop_pidfiles() {
  local pid_dir="$1"
  [ -d "$pid_dir" ] || { echo "    no $pid_dir directory, nothing to stop"; return 0; }

  local pidfile name pid found=false
  for pidfile in "$pid_dir"/*.pid; do
    [ -e "$pidfile" ] || continue
    found=true
    name="$(basename "$pidfile" .pid)"
    pid="$(cat "$pidfile")"

    if kill -0 "$pid" 2>/dev/null; then
      echo "    stopping $name (pid $pid + children)"
      kill_tree "$pid" TERM
      sleep 1
      kill_tree "$pid" KILL
    else
      echo "    $name not running (stale pid $pid)"
    fi
    rm -f "$pidfile"
  done

  $found || echo "    no tracked processes in $pid_dir"
}
