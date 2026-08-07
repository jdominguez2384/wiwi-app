# WIWI 1.0.0 Release Notes

Release preparation date: August 7, 2026 (America/New_York)

## Production Database

- Project: `yqlqvuustgiodtbnagpb`
- Operator: Codex, acting with the project owner's authorization
- The inactive Free Plan project was resumed before any schema changes.
- `202608060001_launch_hardening.sql` was applied through the Supabase SQL Editor as one explicit transaction.
- Supabase reported `Success. No rows returned` for the migration.
- The read-only verification query returned seven of seven passing checks.
- All historical shifts have non-null calculation snapshots and expense values.
- Every existing auth user has a profile and settings row.
- Authenticated users cannot update the protected `profiles.plan` column.
- Eight canonical ownership policies are active across profiles, settings, and shifts.

## Application Verification

- `npm run check`: passed
- Automated tests: 15 passed, 0 failed
- `npm audit`: 0 production or development vulnerabilities
- `npm run build`: passed with all 22 routes generated
- `npm run native:sync`: passed for Android and iOS

## Release Contents

- Stable historical earnings snapshots and user-entered shift expenses
- Centralized auth, loading, retry, and data-error handling
- Clear bilingual authentication errors and accessible form labels
- Account-aware English/Spanish first-run tutorial with seven guided steps
- Replayable Settings tutorial and bilingual answers to common questions
- Bilingual privacy, terms, support, and account-deletion pages
- SEO metadata, sitemap, robots, operational health endpoint, and error pages
- GitHub quality workflow and automated domain tests
- Capacitor Android/iOS projects with WIWI identifiers and launch assets
