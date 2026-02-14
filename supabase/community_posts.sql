-- Run this in Supabase SQL Editor.
create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  nickname text not null check (char_length(nickname) between 2 and 24),
  content text not null check (char_length(content) between 8 and 1000),
  rating int not null check (rating between 1 and 5),
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists community_posts_created_at_idx
  on public.community_posts (created_at desc);

alter table public.community_posts enable row level security;

-- Read policy for public listing (visible posts only).
drop policy if exists "public_read_visible_posts" on public.community_posts;
create policy "public_read_visible_posts"
  on public.community_posts
  for select
  using (is_visible = true);

-- Insert policy for public write.
drop policy if exists "public_insert_posts" on public.community_posts;
create policy "public_insert_posts"
  on public.community_posts
  for insert
  with check (true);

