#!/bin/sh
set -e
FIX="$(cd "$(dirname "$0")/../_fixtures" && pwd)"
mkdir -p builder
cp "$FIX/validated-salon.json" builder/state.json
cp "$FIX/02-prd-salon.md" builder/02-prd.md
cp "$FIX/04-plan-salon.md" builder/04-plan.md
cp "$FIX/05-validation-salon.md" builder/05-validation.md
cat > package.json <<'JSON'
{ "name": "booking-app", "version": "1.0.0", "scripts": { "start": "node server.js", "dev": "node server.js", "test": "node --test" }, "dependencies": { "express": "^4.19.0" } }
JSON
cat > server.js <<'JS'
const express = require('express');
const app = express();
const API_KEY = "sk-test-123";
const AGENDA_PASSWORD = "salon2026";
app.use(express.urlencoded({ extended: true }));
app.get('/agenda', (req, res) => {
  if (req.query.password !== AGENDA_PASSWORD) return res.status(401).send('no');
  res.send('<h1>Agenda</h1>' + req.query.note);
});
app.post('/book', (req, res) => { res.send('Booked ' + req.body.name + ' key ' + API_KEY.length); });
app.listen(3000);
JS
git init -q && git add -A && git -c user.email=t@t -c user.name=t commit -qm "builder: T4 Agenda"
