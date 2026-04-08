-- 003_prompt_generator.sql
-- New tables for the PJENL prompt generator

-- Drop old tables that are no longer needed
drop table if exists public.content_prerequisites cascade;
drop table if exists public.content_items cascade;
drop table if exists public.user_progress cascade;

-- prompts_guardados
create table if not exists public.prompts_guardados (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  categoria text not null,
  tipo text not null,
  campos_completados jsonb not null default '{}',
  prompt_generado text not null,
  prompt_mejorado text,
  es_publico boolean not null default false,
  created_at timestamptz default now()
);

alter table public.prompts_guardados enable row level security;

create policy "Users can view own prompts"
  on public.prompts_guardados for select
  using (auth.uid() = user_id);

create policy "Users can view public prompts"
  on public.prompts_guardados for select
  using (es_publico = true);

create policy "Users can insert own prompts"
  on public.prompts_guardados for insert
  with check (auth.uid() = user_id);

create policy "Users can update own prompts"
  on public.prompts_guardados for update
  using (auth.uid() = user_id);

create policy "Users can delete own prompts"
  on public.prompts_guardados for delete
  using (auth.uid() = user_id);

create index idx_prompts_user on public.prompts_guardados(user_id);
create index idx_prompts_publico on public.prompts_guardados(es_publico) where es_publico = true;

-- uso_ia
create table if not exists public.uso_ia (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  fecha date not null default current_date,
  cantidad_usos integer not null default 1,
  unique(user_id, fecha)
);

alter table public.uso_ia enable row level security;

create policy "Users can view own usage"
  on public.uso_ia for select
  using (auth.uid() = user_id);

create policy "Users can insert own usage"
  on public.uso_ia for insert
  with check (auth.uid() = user_id);

create policy "Users can update own usage"
  on public.uso_ia for update
  using (auth.uid() = user_id);

create index idx_uso_ia_user_fecha on public.uso_ia(user_id, fecha);
