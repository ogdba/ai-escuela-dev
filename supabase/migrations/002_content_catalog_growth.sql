-- Escuela IA para Desarrolladores – Content catalog extensions
-- Adds fields to support a growing, version-controlled content catalog

-- -------------------------------------------------------
-- 1. Extend content_items for richer metadata
-- -------------------------------------------------------
alter table public.content_items
  add column if not exists difficulty text check (difficulty in ('fácil', 'medio', 'difícil', 'experto')),
  add column if not exists duration text,
  add column if not exists module_ref text,
  add column if not exists tags text[] default '{}',
  add column if not exists icon text,
  add column if not exists version integer default 1;

-- -------------------------------------------------------
-- 2. Content prerequisites (DAG for module ordering)
-- -------------------------------------------------------
create table if not exists public.content_prerequisites (
  content_id text not null references public.content_items(id) on delete cascade,
  prerequisite_id text not null references public.content_items(id) on delete cascade,
  primary key (content_id, prerequisite_id),
  check (content_id <> prerequisite_id)
);

alter table public.content_prerequisites enable row level security;

create policy "Anyone can view prerequisites" on public.content_prerequisites
  for select using (true);
create policy "Admins can manage prerequisites" on public.content_prerequisites
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- -------------------------------------------------------
-- 3. Index for prerequisite lookups
-- -------------------------------------------------------
create index if not exists idx_prerequisites_content on public.content_prerequisites(content_id);
create index if not exists idx_prerequisites_prereq on public.content_prerequisites(prerequisite_id);

-- -------------------------------------------------------
-- 4. Full-text search on content_items
-- -------------------------------------------------------
create index if not exists idx_content_items_search
  on public.content_items
  using gin (to_tsvector('spanish', coalesce(title, '') || ' ' || coalesce(description, '')));
