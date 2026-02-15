-- Run this in Supabase SQL Editor.

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  nickname text not null check (char_length(trim(nickname)) between 2 and 24),
  content text not null check (char_length(trim(content)) >= 8),
  rating int not null check (rating between 1 and 5),
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists community_posts_created_at_idx
  on public.community_posts (created_at desc);

alter table public.community_posts enable row level security;
alter table public.community_posts force row level security;

-- Minimize table permissions for anon/authenticated roles.
revoke all on table public.community_posts from public;
revoke all on table public.community_posts from anon;
revoke all on table public.community_posts from authenticated;
grant select, insert on table public.community_posts to anon;
grant select, insert on table public.community_posts to authenticated;

-- Read policy for public listing (visible posts only).
drop policy if exists public_read_visible_posts on public.community_posts;
create policy public_read_visible_posts
  on public.community_posts
  for select
  to anon, authenticated
  using (is_visible = true);

-- Insert policy with constraints (no hidden post injection).
drop policy if exists public_insert_posts on public.community_posts;
create policy public_insert_posts
  on public.community_posts
  for insert
  to anon, authenticated
  with check (
    is_visible = true
    and char_length(trim(nickname)) between 2 and 24
    and char_length(trim(content)) >= 8
    and rating between 1 and 5
  );
