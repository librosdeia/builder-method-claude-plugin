#!/bin/sh
set -e
FIX="$(cd "$(dirname "$0")/../_fixtures" && pwd)"
mkdir -p builder
cp "$FIX/idea-done-salon.json" builder/state.json
cp "$FIX/01-idea-salon.md" builder/01-idea.md
