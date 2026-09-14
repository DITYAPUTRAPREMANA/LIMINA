-- ============================================================
-- LIMINA — Supabase Database Setup
-- ============================================================
-- Jalankan skrip ini di: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── 1. Tabel profiles (data tambahan user) ──────────────────
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

-- ── 2. Row Level Security (RLS) ─────────────────────────────
-- Semua akses ke tabel profiles harus melewati RLS

alter table public.profiles enable row level security;

-- Policy: User hanya bisa SELECT profil miliknya sendiri
create policy "profiles: select own"
  on public.profiles
  for select
  using (auth.uid() = id);

-- Policy: User bisa INSERT profil miliknya sendiri (untuk upsert)
create policy "profiles: insert own"
  on public.profiles
  for insert
  with check (auth.uid() = id);

-- Policy: User hanya bisa UPDATE profil miliknya sendiri
create policy "profiles: update own"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ── 3. Trigger: auto-create profile saat user baru register ─
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer  -- runs as owner, not as calling user
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, alias)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'alias', '')
  )
  on conflict (id) do nothing;  -- idempotent: safe to re-run
  return new;
end;
$$;

-- Drop existing trigger if exists (idempotent)
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();

-- ── 4. Trigger: auto-update updated_at ─────────────────────
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

-- ── 5. Revoke public access ─────────────────────────────────
-- Cabut semua privilege default dari role anon dan authenticated
-- Hanya policy RLS yang mengatur akses

revoke all on public.profiles from anon;
revoke all on public.profiles from authenticated;

-- Grant minimal privileges yang diperlukan (RLS akan filter lebih lanjut)
grant select, update on public.profiles to authenticated;

-- ── 6. Verifikasi setup ─────────────────────────────────────
-- Jalankan ini untuk memastikan setup benar:
-- select * from pg_policies where tablename = 'profiles';
-- select * from information_schema.triggers where trigger_name like '%profile%' or trigger_name like '%user%';

-- ============================================================
-- CATATAN KEAMANAN TAMBAHAN (Supabase Dashboard):
-- ============================================================
-- 1. Authentication → Settings:
--    ✓ Enable email confirmations (wajib untuk OTP)
--    ✓ Secure email change: ON
--    ✓ OTP expiry: 300 seconds (5 menit)
--
-- 2. Authentication → Rate Limits:
--    ✓ Email rate limit: aktifkan (default)
--    ✓ SMS rate limit: aktifkan
--
-- 3. API Settings:
--    ✓ Jangan expose service_role key ke frontend
--    ✓ Gunakan hanya anon key untuk web app
--
-- 4. Database → Extensions:
--    ✓ Aktifkan pgcrypto jika perlu enkripsi data tambahan
-- ============================================================
