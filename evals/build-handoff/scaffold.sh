#!/bin/sh
set -e
FIX="$(cd "$(dirname "$0")/../_fixtures" && pwd)"
mkdir -p builder
cp "$FIX/design-done-salon.json" builder/state.json
cp "$FIX/02-prd-salon.md" builder/02-prd.md
cp "$FIX/03-design-salon.md" builder/03-design.md
