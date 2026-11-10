#!/bin/sh
set -e
FIX="$(cd "$(dirname "$0")/../_fixtures" && pwd)"
mkdir -p builder
sed 's/"language": "en"/"language": "es"/; s/"demo-app"/"reservas-peluqueria"/' "$FIX/fresh.json" > builder/state.json
