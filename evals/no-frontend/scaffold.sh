#!/bin/sh
set -e
FIX="$(cd "$(dirname "$0")/../_fixtures" && pwd)"
mkdir -p builder
cp "$FIX/prd-done-cli.json" builder/state.json
cp "$FIX/02-prd-cli.md" builder/02-prd.md
