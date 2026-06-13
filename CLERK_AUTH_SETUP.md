# Clerk Auth Setup

KeepDB UI uses Clerk for website login.

The intended auth experience is one flow:

- `/sign-in` handles both existing users and new users.
- Email auth uses verification codes only.
- Password auth is disabled.
- The public UI should not show separate sign-in and sign-up entry points.

## Environment Variables

```txt
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/dashboard
```

Keep these server-only values private:

```txt
CLERK_SECRET_KEY=
KEEPDB_DATABASE_URL=
KEEPDB_KEY_ENCRYPTION_SECRET=
KEEPDB_WAITLIST_API_KEY=
```

## Routes

- `/sign-in`: Clerk sign-in screen.
- `/sign-up`: internal Clerk route kept for compatibility, but public entry points should use `/sign-in`.
- `/dashboard`: protected KeepDB dashboard overview.
- `/search`, `/memories`, `/agent-setup`: protected dashboard tools.
- `/api/keepdb/*`: protected server-side dashboard routes.
- `/api/internal/client-key`: protected server-side dashboard key provisioning route.

## Flow

1. User continues through the single Clerk `/sign-in` flow.
2. Clerk middleware protects dashboard and dashboard API routes.
3. Next.js reads the Clerk user on the server.
4. The UI maps the Clerk user to a KeepDB user row by email.
5. Next.js creates or loads the hidden dashboard client key.
6. Browser requests stay cookie/session based; raw KeepDB API keys stay on the server.
