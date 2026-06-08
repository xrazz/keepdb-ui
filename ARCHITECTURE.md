# KeepDB UI Architecture

KeepDB UI is only the dashboard. The KeepDB API stays API-key-first.

## Request Flow

1. User signs in with Supabase email OTP.
2. Dashboard pages call Next.js server routes under `/api/keepdb/*`.
3. Next.js verifies the logged-in Supabase user from the server session.
4. Next.js creates or finds the KeepDB user row by email and Supabase user id.
5. Next.js creates or decrypts that user's hidden `client` API key.
6. Next.js calls the KeepDB backend with `Authorization: Bearer keep_sk_...`.
7. The browser receives only the safe dashboard response.

## Keys

- Supabase anon key: public browser key for login only.
- Dashboard client key: hidden per-user KeepDB API key used only by Next.js server code.
- Agent key: user-facing KeepDB API key for Codex, Claude, MCP, or external apps.
- Encryption secret: server-only secret used to encrypt stored dashboard client keys.

## Environment Variables

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
KEEPDB_DATABASE_URL=
KEEPDB_KEY_ENCRYPTION_SECRET=
KEEPDB_API_BASE=
```

`KEEPDB_API_BASE` is optional and defaults to production.

## Code Map

- `src/lib/auth/current-user.ts`: requires a signed-in Supabase user.
- `src/lib/keepdb/config.ts`: reads KeepDB environment variables.
- `src/lib/keepdb/database.ts`: creates the Postgres client.
- `src/lib/keepdb/key-crypto.ts`: creates, hashes, encrypts, and decrypts API keys.
- `src/lib/keepdb/keep-user.ts`: maps the Supabase user to a KeepDB user row.
- `src/lib/keepdb/dashboard-client-key.ts`: creates or loads the hidden dashboard key.
- `src/lib/keepdb/agent-keys.ts`: creates, lists, and revokes user-facing agent keys.
- `src/lib/keepdb/client.ts`: calls the KeepDB backend data API.
- `src/app/api/keepdb/*`: dashboard API routes used by the UI.
