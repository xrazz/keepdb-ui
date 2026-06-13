# KeepDB API Key Scoping Plan

KeepDB dashboard auth and KeepDB API keys are separate.

The dashboard uses the signed-in Clerk user and can show all data owned by that user. API keys are for external access: REST API, MCP, agents, webhooks, shipped apps, cron jobs, and integrations.

## Mental Model

Every API key has two controls:

1. Access: what the key can do.
2. Folder scope: where the key can do it.

```txt
api_keys.scopes
  -> memory:read
  -> memory:write
  -> memory:delete later if needed

api_keys.collection_id
  -> null means all folders
  -> folder id means only that one folder
```

## Access Modes

### Read Only

```txt
scopes = ['memory:read']
```

Can:
- Search memories.
- List memories.
- List folders it is allowed to see.

Cannot:
- Create memories.
- Delete memories.

If this key tries to write:

```json
{
  "success": false,
  "status": 403,
  "message": "API key cannot write memory"
}
```

### Write Only

```txt
scopes = ['memory:write']
```

Can:
- Create memories.

Cannot:
- Search memories.
- List memories.
- Read folder contents.
- Delete memories.

If this key tries to read:

```json
{
  "success": false,
  "status": 403,
  "message": "API key cannot read memory"
}
```

This is the safest key for shipped apps and public-ish ingestion flows.

### Read + Write

```txt
scopes = ['memory:read', 'memory:write']
```

Can:
- Create memories.
- Search memories.
- List memories.

Cannot:
- Delete memories unless `memory:delete` is added later.

## Folder Scope

### Global Key

```txt
collection_id = null
```

The key can operate across all folders owned by the user, limited by its access mode.

Examples:
- Global read-only key can search all folders.
- Global write-only key can write to any folder name sent in the request.
- Global read + write key can read and write across all folders.

### Folder-Scoped Key

```txt
collection_id = selected_folder_id
```

The key can operate only inside that folder, limited by its access mode.

Examples:
- Folder read-only key for `app-feedback` can read only `app-feedback`.
- Folder write-only key for `app-feedback` can write only to `app-feedback`.
- Folder read + write key for `app-feedback` can read and write only `app-feedback`.

## What Happens On Wrong Access

### Write-only feedback key tries to read feedback

Key:

```txt
scope = app-feedback
access = write only
```

Request:

```txt
GET /memory?query=camera
```

Result:

```json
{
  "success": false,
  "status": 403,
  "message": "API key cannot read memory"
}
```

It is blocked even though the key belongs to the correct folder, because it does not have `memory:read`.

### Write-only feedback key writes to feedback

Key:

```txt
scope = app-feedback
access = write only
```

Request:

```txt
POST /memory
collection: app-feedback
```

Result:

```json
{
  "success": true,
  "memoryId": "...",
  "collection": "app-feedback"
}
```

It works because the key has `memory:write` and the requested folder matches the key folder.

### Write-only feedback key writes to another folder

Key:

```txt
scope = app-feedback
access = write only
```

Request:

```txt
POST /memory
collection: support-tickets
```

Result:

```json
{
  "success": false,
  "status": 403,
  "message": "API key is restricted to another collection"
}
```

It is blocked because the key is restricted to `app-feedback`.

### Folder-scoped read key searches globally

Key:

```txt
scope = app-feedback
access = read only
```

Request:

```txt
GET /memory?query=camera
```

Result:

The backend still restricts results to `app-feedback`. The key cannot escape its folder by omitting the collection filter.

### Folder-scoped read key explicitly searches another folder

Key:

```txt
scope = app-feedback
access = read only
```

Request:

```txt
GET /memory?query=refund&collection=support-tickets
```

Result:

No data from `support-tickets` is returned. The backend applies the key's `collection_id` restriction first.

## Dashboard Access

The dashboard is not limited by user-facing API keys.

The dashboard uses Clerk auth to identify the signed-in owner, then uses an internal dashboard client key on the server. That key is not shown in the browser and is not the same as agent/API keys.

So:

- User dashboard can access all of that user's folders.
- User-facing API keys can be narrowed to read/write and global/folder scope.
- MCP/agents/apps should use scoped keys.
- Shipped apps should usually use write-only folder-scoped keys.

## Recommended Defaults

### iOS or Web App Feedback

```txt
access = write only
scope = one folder
folder = app-feedback
```

Why:
- The app can submit feedback.
- If the key leaks, nobody can read user feedback.
- The key cannot write into other folders.

### Agent Memory

```txt
access = read + write
scope = all folders or one project folder
```

Why:
- The agent can save context.
- The agent can search context.
- For project-specific agents, one-folder scope is safer.

### Public Webhook

```txt
access = write only
scope = one folder
```

Why:
- Webhooks usually only need ingestion.
- They should not read memory.

### Read-only Research Agent

```txt
access = read only
scope = one folder or all folders
```

Why:
- The agent can search and summarize.
- It cannot mutate memory.
