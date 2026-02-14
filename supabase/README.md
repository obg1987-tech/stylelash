# Supabase Setup

Use this project with a Supabase backend for the community board.

## 1) Environment Variables

Set the following values in `.env.local` (local) and Vercel Project Settings (production):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

Notes:
- `SUPABASE_SERVICE_ROLE_KEY` is server-only. Never expose it to client-side code.
- If service key is missing, API falls back to anon key.

## 2) Create Table + Policies

Run:

`supabase/community_posts.sql`

in Supabase SQL Editor.

## 3) Route

Community board page:

`/community`

API:

`/api/community/posts` (`GET`, `POST`)

