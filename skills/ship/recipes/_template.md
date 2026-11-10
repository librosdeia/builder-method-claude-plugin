# <Provider> recipe

One recipe per hosting provider. The ship skill reads every recipe's "Fits when" section to recommend one, then follows the chosen recipe step by step. Keep the six headings exactly. Never write prices: link to the provider's pricing page.

## Fits when
- <kinds of apps and stacks this provider suits>
- <kinds it does not suit, and why>
- Pricing: <link to the pricing page>; check current pricing before deciding.

## Prerequisites
- <account to create>
- <CLI or MCP to install, with the install command>

## Prepare
- <config files the app needs, start command, port convention>
- <how environment variables are set>
- <database options>

## Deploy
**You (the user) do:** <steps in the provider's dashboard>
**Claude does:** <commands>
**Verify:** <how to check the public URL works>

## Domain
<where to add the domain, and which DNS records to add at the registrar>

## Rollback
<how to go back to the previous working deploy>
