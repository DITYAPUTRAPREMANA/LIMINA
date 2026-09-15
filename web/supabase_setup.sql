create table if not exists public.profiles (
  id          uuid        references auth.users(id) on delete cascade primary key,
  full_name   text        not null default '',
  alias       text        not null default '',
  phone       text        not null default '',
  company     text        not null default '',
  role        text        not null default 'Retail Analyst',
  location    text        not null default '',
  plan        text        not null default 'Free Retail Tier',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: select own"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "profiles: insert own"
  on public.profiles
  for insert
  with check (auth.uid() = id);

create policy "profiles: update own"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, alias)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'alias', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row
  execute procedure public.set_updated_at();

revoke all on public.profiles from anon;
revoke all on public.profiles from authenticated;
grant select, insert, update on public.profiles to authenticated;


create table if not exists public.sectors_cache (
  id          text        primary key,              
  data        jsonb       not null,                 
  fetched_at  timestamptz not null default now(),   
  ttl_hours   int         not null default 6        
);


create policy "sectors_cache: select all"
  on public.sectors_cache
  for select
  using (true);

create policy "sectors_cache: insert all"
  on public.sectors_cache
  for insert
  with check (true);

create policy "sectors_cache: update all"
  on public.sectors_cache
  for update
  using (true)
  with check (true);

-- Data market publik — anon & authenticated boleh baca/tulis cache
grant select, insert, update on public.sectors_cache to anon;
grant select, insert, update on public.sectors_cache to authenticated;
