---
type: llm
focus: { source: file, path: builder/06-ship.md }
---

PASS if the audit lists the secret hard-coded in server.js (an API key and/or the agenda password written directly in the code) as a critical or high-priority finding.
FAIL if hard-coded secrets aren't mentioned, or are listed only as low priority.
