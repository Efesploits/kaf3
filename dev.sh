#!/usr/bin/env bash
# Restart the Vite dev server on a fixed port (handy during review).
set -e
cd "$(dirname "$0")"
for pid in $(netstat -ano 2>/dev/null | grep -E ":5183\s" | awk '{print $5}' | sort -u); do
  taskkill //F //PID "$pid" >/dev/null 2>&1 || true
done
exec npm run dev -- --port 5183 --strictPort
