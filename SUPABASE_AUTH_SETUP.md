# Supabase Auth Setup

KeepDB UI uses Supabase Auth for website login.

Enabled login method in the UI:

- Email OTP code and magic link

## Environment Variables

Add these to local `.env.local` and to the hosted deployment:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
KEEPDB_DATABASE_URL=
KEEPDB_KEY_ENCRYPTION_SECRET=
KEEPDB_API_BASE=
```

The Supabase values come from Supabase project settings. `KEEPDB_API_BASE` is optional and defaults to the production KeepDB API.

## Supabase Dashboard

In Supabase Auth settings:

1. Enable Email provider.
2. Add redirect URLs:

```txt
http://localhost:3000/auth/callback
https://keepdb.dev/auth/callback
```

If the hosted domain is different, add that domain too.

## Routes

- `/login`: email OTP code and magic link login.
- `/auth/callback`: exchanges Supabase OAuth/OTP code for a session.
- `/account`: shows the current signed-in Supabase user.
- `/auth/sign-out`: signs out and returns home.
- `/api/keepdb/*`: server-side dashboard routes that fetch KeepDB data.
- `/api/internal/client-key`: server-side route that provisions the hidden dashboard client key.

## KeepDB Connection

After login, the Next.js server connects the Supabase user to KeepDB:

1. User signs in with Supabase.
2. Next.js reads the signed-in Supabase user on the server.
3. Next.js creates or finds the matching KeepDB user in Postgres.
4. Next.js creates or decrypts a hidden `client` API key for that user.
5. Next.js calls the normal KeepDB backend with that API key.

The browser never receives the hidden dashboard key. User-facing agent keys are separate.
