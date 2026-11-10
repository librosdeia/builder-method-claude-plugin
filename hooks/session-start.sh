#!/bin/sh
# Builder Method · SessionStart hook.
# If the project has builder/state.json, print a factual header plus the state
# so Claude keeps guiding the user. Never fails the session: always exits 0.
dir="${CLAUDE_PROJECT_DIR:-$PWD}"
state="$dir/builder/state.json"
[ -f "$state" ] || exit 0
max=2000
printf '%s\n\n' "This project follows the Builder Method plugin; its progress state (builder/state.json) is below. The guide skills are /builder:next and /builder:status, and the project files live in builder/."
head -n "$max" "$state" 2>/dev/null
printf '\n'
lines=$(wc -l < "$state" 2>/dev/null || echo 0)
if [ "${lines:-0}" -ge "$max" ]; then
  printf '%s\n' "(truncated — read builder/state.json for the rest)"
fi
exit 0
