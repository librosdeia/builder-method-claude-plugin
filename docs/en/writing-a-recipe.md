# Writing a hosting recipe

The Ship phase never hard-codes a provider. It reads the recipes in `skills/ship/recipes/`, recommends one from their "Fits when" sections, and follows the chosen recipe step by step.

## Add a provider

1. Copy `skills/ship/recipes/_template.md` to `skills/ship/recipes/<provider>.md` (lowercase, hyphens).
2. Fill in the six sections, keeping the headings exactly: **Fits when**, **Prerequisites**, **Prepare**, **Deploy**, **Domain**, **Rollback**.
3. Rules:
   - No prices. Link the provider's pricing page.
   - Split the Deploy steps into **You (the user) do** and **Claude does**, and say how to verify.
   - Environment variables are referred to by name only.
   - Say clearly when the provider is *not* a fit (for example, no persistent disk for SQLite).
4. Update the list in `test/recipes.test.mjs` and run `npm test`.
5. Open a pull request.
