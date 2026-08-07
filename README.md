# WIWI

WIWI stands for **Was It Worth It?** It helps gig workers record shifts and estimate what they kept after fuel, a user-selected tax reserve, and other shift expenses.

Production: [getwiwi.com](https://getwiwi.com)

Health check: [getwiwi.com/api/health](https://getwiwi.com/api/health)

## Stack

- Next.js 16 and React 19
- TypeScript and Tailwind CSS 4
- Supabase Auth and Postgres
- Vercel hosting
- Resend transactional email through Supabase SMTP

## Local Setup

1. Install dependencies with `npm ci`.
2. Duplicate `.env.example` as `.env.local` and enter the project values.
3. Apply the SQL migrations in `supabase/migrations` to the intended Supabase project.
4. Start the app with `npm run dev`.
5. Run the complete verification suite with `npm run check`.

Never expose the Supabase service-role key in a variable prefixed with `NEXT_PUBLIC_`. It is used only by the server-side account-deletion route.

## Environment Variables

| Variable | Required | Scope |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes | Browser and server |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Browser and server |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Browser and server |
| `SUPABASE_SERVICE_ROLE_KEY` | Production | Server only |

## Commands

- `npm run dev`: local development server
- `npm run lint`: ESLint and React rules
- `npm run typecheck`: TypeScript validation
- `npm test`: calculation and form tests
- `npm run check`: lint, typecheck, and tests
- `npm run build`: production Next.js build

## Data Safety

Every shift belongs to one authenticated user. Supabase Row Level Security policies restrict profiles, settings, and shifts to `auth.uid()`. The migration also snapshots tax reserve, MPG, and gas price on each shift so changing Settings does not rewrite historical results.

Apply database changes before deploying client code that depends on them. For this release, apply `202608060001_launch_hardening.sql` before deploying the corresponding app commit.

## Release Resources

- [Release checklist](docs/RELEASE_CHECKLIST.md)
- [Native app plan](docs/NATIVE_RELEASE.md)
- [Privacy Policy](https://getwiwi.com/privacy)
- [Terms](https://getwiwi.com/terms)
- [Support](https://getwiwi.com/support)
- [Account deletion](https://getwiwi.com/delete-account)
