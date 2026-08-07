-- WIWI launch baseline: schema, ownership policies, and stable shift calculations.
-- This migration is safe to run against the existing production project.

begin;

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  preferred_language text not null default 'en',
  plan text not null default 'free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists display_name text,
  add column if not exists preferred_language text default 'en',
  add column if not exists plan text default 'free',
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

update public.profiles
set
  preferred_language = case when preferred_language = 'es' then 'es' else 'en' end,
  plan = case when plan = 'pro' then 'pro' else 'free' end,
  created_at = coalesce(created_at, now()),
  updated_at = coalesce(updated_at, now())
where
  preferred_language is null
  or preferred_language not in ('en', 'es')
  or plan is null
  or plan not in ('free', 'pro')
  or created_at is null
  or updated_at is null;

alter table public.profiles
  alter column preferred_language set default 'en',
  alter column preferred_language set not null,
  alter column plan set default 'free',
  alter column plan set not null,
  alter column created_at set default now(),
  alter column created_at set not null,
  alter column updated_at set default now(),
  alter column updated_at set not null;

create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  tax_rate numeric not null default 0.20,
  mpg numeric not null default 27,
  gas_price numeric not null default 3.45,
  weekly_goal numeric not null default 800,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_settings
  add column if not exists tax_rate numeric default 0.20,
  add column if not exists mpg numeric default 27,
  add column if not exists gas_price numeric default 3.45,
  add column if not exists weekly_goal numeric default 800,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

update public.user_settings
set
  tax_rate = case when tax_rate between 0 and 1 then tax_rate else 0.20 end,
  mpg = case when mpg > 0 then mpg else 27 end,
  gas_price = case when gas_price >= 0 then gas_price else 3.45 end,
  weekly_goal = case when weekly_goal >= 0 then weekly_goal else 800 end,
  created_at = coalesce(created_at, now()),
  updated_at = coalesce(updated_at, now())
where
  tax_rate is null
  or tax_rate not between 0 and 1
  or mpg is null
  or mpg <= 0
  or gas_price is null
  or gas_price < 0
  or weekly_goal is null
  or weekly_goal < 0
  or created_at is null
  or updated_at is null;

alter table public.user_settings
  alter column tax_rate set default 0.20,
  alter column tax_rate set not null,
  alter column mpg set default 27,
  alter column mpg set not null,
  alter column gas_price set default 3.45,
  alter column gas_price set not null,
  alter column weekly_goal set default 800,
  alter column weekly_goal set not null,
  alter column created_at set default now(),
  alter column created_at set not null,
  alter column updated_at set default now(),
  alter column updated_at set not null;

create table if not exists public.shifts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  shift_date date not null,
  app_name text not null,
  gross_earnings numeric not null,
  hours_worked numeric not null,
  miles_driven numeric not null,
  other_expenses numeric not null default 0,
  tax_rate_snapshot numeric not null default 0.20,
  mpg_snapshot numeric not null default 27,
  gas_price_snapshot numeric not null default 3.45,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.shifts
  add column if not exists other_expenses numeric default 0,
  add column if not exists tax_rate_snapshot numeric,
  add column if not exists mpg_snapshot numeric,
  add column if not exists gas_price_snapshot numeric,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

-- Existing shifts get a one-time snapshot from their owner's current settings.
update public.shifts as shift
set
  tax_rate_snapshot = coalesce(shift.tax_rate_snapshot, settings.tax_rate, 0.20),
  mpg_snapshot = coalesce(shift.mpg_snapshot, settings.mpg, 27),
  gas_price_snapshot = coalesce(shift.gas_price_snapshot, settings.gas_price, 3.45),
  other_expenses = coalesce(shift.other_expenses, 0)
from public.user_settings as settings
where settings.user_id = shift.user_id
  and (
    shift.tax_rate_snapshot is null
    or shift.mpg_snapshot is null
    or shift.gas_price_snapshot is null
    or shift.other_expenses is null
  );

update public.shifts
set
  tax_rate_snapshot = coalesce(tax_rate_snapshot, 0.20),
  mpg_snapshot = coalesce(mpg_snapshot, 27),
  gas_price_snapshot = coalesce(gas_price_snapshot, 3.45),
  other_expenses = coalesce(other_expenses, 0)
where
  tax_rate_snapshot is null
  or mpg_snapshot is null
  or gas_price_snapshot is null
  or other_expenses is null;

alter table public.shifts
  alter column other_expenses set default 0,
  alter column other_expenses set not null,
  alter column tax_rate_snapshot set default 0.20,
  alter column tax_rate_snapshot set not null,
  alter column mpg_snapshot set default 27,
  alter column mpg_snapshot set not null,
  alter column gas_price_snapshot set default 3.45,
  alter column gas_price_snapshot set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'shifts_non_negative_values'
      and conrelid = 'public.shifts'::regclass
  ) then
    alter table public.shifts
      add constraint shifts_non_negative_values check (
        gross_earnings >= 0
        and hours_worked > 0
        and miles_driven >= 0
        and other_expenses >= 0
        and tax_rate_snapshot between 0 and 1
        and mpg_snapshot > 0
        and gas_price_snapshot >= 0
      ) not valid;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'user_settings_valid_values'
      and conrelid = 'public.user_settings'::regclass
  ) then
    alter table public.user_settings
      add constraint user_settings_valid_values check (
        tax_rate between 0 and 1
        and mpg > 0
        and gas_price >= 0
        and weekly_goal >= 0
      ) not valid;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_supported_language'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_supported_language
      check (preferred_language in ('en', 'es')) not valid;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_supported_plan'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_supported_plan
      check (plan in ('free', 'pro')) not valid;
  end if;
end
$$;

create index if not exists shifts_user_date_idx
  on public.shifts (user_id, shift_date desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists user_settings_set_updated_at on public.user_settings;
create trigger user_settings_set_updated_at
before update on public.user_settings
for each row execute function public.set_updated_at();

drop trigger if exists shifts_set_updated_at on public.shifts;
create trigger shifts_set_updated_at
before update on public.shifts
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, preferred_language)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'display_name', ''),
    case
      when new.raw_user_meta_data ->> 'preferred_language' = 'es' then 'es'
      else 'en'
    end
  )
  on conflict (id) do nothing;

  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Repair accounts created before the signup trigger existed.
insert into public.profiles (id, display_name, preferred_language)
select
  users.id,
  nullif(users.raw_user_meta_data ->> 'display_name', ''),
  case
    when users.raw_user_meta_data ->> 'preferred_language' = 'es' then 'es'
    else 'en'
  end
from auth.users as users
on conflict (id) do nothing;

insert into public.user_settings (user_id)
select users.id
from auth.users as users
on conflict (user_id) do nothing;

alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.shifts enable row level security;

-- Client roles get only the table/column privileges required by the app.
-- In particular, authenticated users cannot promote their own plan to Pro.
revoke all privileges on table public.profiles from anon, authenticated;
revoke all privileges on table public.user_settings from anon, authenticated;
revoke all privileges on table public.shifts from anon, authenticated;

grant select on table public.profiles to authenticated;
grant update (display_name, preferred_language) on table public.profiles
  to authenticated;

grant select on table public.user_settings to authenticated;
grant update (tax_rate, mpg, gas_price, weekly_goal) on table public.user_settings
  to authenticated;

grant select, insert, update, delete on table public.shifts to authenticated;

-- Replace unknown dashboard-created policies with one auditable policy set.
do $$
declare
  policy_record record;
begin
  for policy_record in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('profiles', 'user_settings', 'shifts')
  loop
    execute format(
      'drop policy %I on %I.%I',
      policy_record.policyname,
      policy_record.schemaname,
      policy_record.tablename
    );
  end loop;
end
$$;

create policy "profiles_select_own"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "settings_select_own"
on public.user_settings for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "settings_update_own"
on public.user_settings for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "shifts_select_own"
on public.shifts for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "shifts_insert_own"
on public.shifts for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "shifts_update_own"
on public.shifts for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "shifts_delete_own"
on public.shifts for delete
to authenticated
using ((select auth.uid()) = user_id);

comment on column public.shifts.other_expenses is
  'User-entered tolls, parking, and other costs attributable to this shift.';
comment on column public.shifts.tax_rate_snapshot is
  'Tax reserve assumption captured when the shift was saved.';
comment on column public.shifts.mpg_snapshot is
  'Vehicle efficiency assumption captured when the shift was saved.';
comment on column public.shifts.gas_price_snapshot is
  'Fuel price assumption captured when the shift was saved.';

commit;
