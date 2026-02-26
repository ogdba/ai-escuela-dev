-- Escuela IA para Desarrolladores – Initial database schema
-- Run against a Supabase project: supabase db push

-- -------------------------------------------------------
-- 1. Profiles (extends Supabase auth.users)
-- -------------------------------------------------------
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  display_name text,
  avatar_url text,
  role text default 'student' check (role in ('student', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- -------------------------------------------------------
-- 2. User progress tracking
-- -------------------------------------------------------
create table if not exists public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  content_type text not null check (content_type in ('module', 'lab')),
  content_id text not null,
  started_at timestamptz default now(),
  completed_at timestamptz,
  percent integer default 0 check (percent >= 0 and percent <= 100),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, content_type, content_id)
);

-- -------------------------------------------------------
-- 3. Content catalog (admin-managed metadata)
-- -------------------------------------------------------
create table if not exists public.content_items (
  id text primary key,
  content_type text not null check (content_type in ('module', 'lab')),
  title text not null,
  description text,
  metadata jsonb default '{}',
  sort_order integer default 0,
  is_published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- -------------------------------------------------------
-- RLS policies
-- -------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;
alter table public.content_items enable row level security;

-- Profiles
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Progress
create policy "Users can view own progress" on public.user_progress
  for select using (auth.uid() = user_id);
create policy "Users can insert own progress" on public.user_progress
  for insert with check (auth.uid() = user_id);
create policy "Users can update own progress" on public.user_progress
  for update using (auth.uid() = user_id);

-- Content catalog
create policy "Anyone can view published content" on public.content_items
  for select using (is_published = true);
create policy "Admins can manage content" on public.content_items
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- -------------------------------------------------------
-- Indexes
-- -------------------------------------------------------
create index if not exists idx_user_progress_user on public.user_progress(user_id);
create index if not exists idx_user_progress_content on public.user_progress(content_type, content_id);
create index if not exists idx_content_items_type on public.content_items(content_type);

-- -------------------------------------------------------
-- updated_at trigger
-- -------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger user_progress_updated_at before update on public.user_progress
  for each row execute function public.set_updated_at();
create trigger content_items_updated_at before update on public.content_items
  for each row execute function public.set_updated_at();
