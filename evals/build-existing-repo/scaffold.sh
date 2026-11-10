#!/bin/sh
set -e
FIX="$(cd "$(dirname "$0")/../_fixtures" && pwd)"
mkdir -p builder
cp "$FIX/plan-done-salon.json" builder/state.json
cp "$FIX/02-prd-salon.md" builder/02-prd.md
cp "$FIX/03-design-salon.md" builder/03-design.md
cp "$FIX/04-plan-salon.md" builder/04-plan.md
printf 'console.log("existing app");\n' > app.js
git init -q && git add -A && git -c user.email=t@t -c user.name=t commit -qm "existing work"
