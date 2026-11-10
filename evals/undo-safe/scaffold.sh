#!/bin/sh
set -e
FIX="$(cd "$(dirname "$0")/../_fixtures" && pwd)"
mkdir -p builder
cp "$FIX/mid-build.json" builder/state.json
git init -q
G="git -c user.email=t@t -c user.name=t"
for n in 1 2 3 4 5; do
  echo "task $n" >> app.txt
  git add -A && $G commit -qm "builder: T$n step $n"
done
