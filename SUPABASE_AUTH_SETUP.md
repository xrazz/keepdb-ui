# Supabase Auth Setup

KeepDB UI uses Supabase Auth for website login.

Enabled login method in the UI:

- Email OTP / magic link

## Environment Variables

Add these to local `.env.local` and to the hosted deployment:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

The values come from Supabase project settings.

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

- `/login`: email OTP login.
- `/auth/callback`: exchanges Supabase OAuth/OTP code for a session.
- `/account`: shows the current signed-in Supabase user.
- `/auth/sign-out`: signs out and returns home.

## Next Step

After login works, connect the Supabase user to the KeepDB backend:

1. User signs in with Supabase.
2. UI calls a KeepDB backend endpoint with the Supabase JWT.
3. Backend verifies the JWT.
4. Backend creates or returns the KeepDB user and API keys.

KeepDB backend should still own KeepDB API keys. Supabase only owns website login.
