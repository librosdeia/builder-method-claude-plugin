# Environment variable

## What it is
A named setting that lives outside the code, such as a password or an API key, and is given to the app when it runs.

## Why it matters
Secrets must never be written in the code, because code gets shared and copied. Each place the app runs (your computer, the host) has its own values.

## Example
`EMAIL_API_KEY` is set in the hosting dashboard; `.env.example` lists its name without the value.
