-- WIWI Pro foundation: entitlements, cost profiles, and richer shift records.

begin;

create table if not exists public.cost_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  tax_rate numeric not null,
  mpg numeric not null,
  gas_price numeric not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cost_profiles_valid_values check (
    char_length(trim(name)) between 1 and 60
    and tax_rate between 0 and 1
    and mpg > 0
    and gas_price >= 0
  )
);

create index if not exists cost_profiles_user_created_idx
  on public.cost_profiles (user_id, created_at);

alter table public.shifts
  add column if not exists cost_profile_id uuid
    references public.cost_profiles(id) on delete set null,
  add column if not exists cost_profile_name_snapshot text,
  add column if not exists notes text default '',
  add column if not exists tags text[] default '{}'::text[];

update public.shifts
set
  notes = coalesce(notes, ''),
  tags = coalesce(tags, '{}'::text[])
where notes is null or tags is null;

alter table public.shifts
  alter column notes set default '',
  alter column notes set not null,
  alter column tags set default '{}'::text[],
  alter column tags set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'shifts_pro_content_limits'
      and conrelid = 'public.shifts'::regclass
  ) then
    alter table public.shifts
      add constraint shifts_pro_content_limits check (
        char_length(notes) <= 1000
        and cardinality(tags) <= 10
        and char_length(array_to_string(tags, ',')) <= 500
      ) not valid;
  end if;
end
$$;

create table if not exists public.billing_entitlements (
  user_id uuid not null references auth.users(id) on delete cascade,
  entitlement_id text not null,
  is_active boolean not null default false,
  product_id text,
  store text,
  environment text,
  expires_at timestamptz,
  last_event_id text,
  last_event_type text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, entitlement_id),
  constraint billing_entitlements_supported_id check (entitlement_id = 'pro')
);

create table if not exists public.billing_webhook_events (
  event_id text primary key,
  event_type text not null,
  app_user_id text,
  processed_at timestamptz not null default now()
);

create or replace function public.user_has_pro_plan(target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = target_user_id
      and plan = 'pro'
      and target_user_id = (select auth.uid())
  );
$$;

revoke all on function public.user_has_pro_plan(uuid) from public;
grant execute on function public.user_has_pro_plan(uuid) to authenticated;

create or replace function public.protect_cost_profile_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (
    select count(*)
    from public.cost_profiles
    where user_id = new.user_id
  ) >= 8 then
    raise exception 'WIWI Pro supports up to eight cost profiles.';
  end if;

  return new;
end;
$$;

create or replace function public.protect_shift_pro_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  selected_profile public.cost_profiles%rowtype;
  pro_content_changed boolean;
begin
  new.notes := coalesce(new.notes, '');
  new.tags := coalesce(new.tags, '{}'::text[]);

  if tg_op = 'INSERT' then
    pro_content_changed :=
      new.cost_profile_id is not null
      or new.notes <> ''
      or cardinality(new.tags) > 0;
  else
    pro_content_changed :=
      new.cost_profile_id is distinct from old.cost_profile_id
      or new.notes is distinct from old.notes
      or new.tags is distinct from old.tags;
  end if;

  if pro_content_changed and not public.user_has_pro_plan(new.user_id) then
    raise exception 'WIWI Pro is required for cost profiles, notes, and tags.';
  end if;

  if new.cost_profile_id is not null
     and (tg_op = 'INSERT' or new.cost_profile_id is distinct from old.cost_profile_id) then
    select * into selected_profile
    from public.cost_profiles
    where id = new.cost_profile_id and user_id = new.user_id;

    if not found then
      raise exception 'The selected cost profile does not belong to this account.';
    end if;

    new.cost_profile_name_snapshot := selected_profile.name;
    new.tax_rate_snapshot := selected_profile.tax_rate;
    new.mpg_snapshot := selected_profile.mpg;
    new.gas_price_snapshot := selected_profile.gas_price;
  end if;

  return new;
end;
$$;

drop trigger if exists shifts_pro_fields_guard on public.shifts;
create trigger shifts_pro_fields_guard
before insert or update on public.shifts
for each row execute function public.protect_shift_pro_fields();

drop trigger if exists cost_profiles_set_updated_at on public.cost_profiles;
create trigger cost_profiles_set_updated_at
before update on public.cost_profiles
for each row execute function public.set_updated_at();

drop trigger if exists cost_profiles_limit_guard on public.cost_profiles;
create trigger cost_profiles_limit_guard
before insert on public.cost_profiles
for each row execute function public.protect_cost_profile_limit();

drop trigger if exists billing_entitlements_set_updated_at on public.billing_entitlements;
create trigger billing_entitlements_set_updated_at
before update on public.billing_entitlements
for each row execute function public.set_updated_at();

alter table public.cost_profiles enable row level security;
alter table public.billing_entitlements enable row level security;
alter table public.billing_webhook_events enable row level security;

revoke all privileges on table public.cost_profiles from anon, authenticated;
revoke all privileges on table public.billing_entitlements from anon, authenticated;
revoke all privileges on table public.billing_webhook_events from anon, authenticated;

grant select, insert, update, delete on table public.cost_profiles to authenticated;
grant select on table public.billing_entitlements to authenticated;

drop policy if exists "cost_profiles_select_own" on public.cost_profiles;
create policy "cost_profiles_select_own"
on public.cost_profiles for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "cost_profiles_insert_pro" on public.cost_profiles;
create policy "cost_profiles_insert_pro"
on public.cost_profiles for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and public.user_has_pro_plan((select auth.uid()))
);

drop policy if exists "cost_profiles_update_pro" on public.cost_profiles;
create policy "cost_profiles_update_pro"
on public.cost_profiles for update
to authenticated
using (
  (select auth.uid()) = user_id
  and public.user_has_pro_plan((select auth.uid()))
)
with check (
  (select auth.uid()) = user_id
  and public.user_has_pro_plan((select auth.uid()))
);

drop policy if exists "cost_profiles_delete_own" on public.cost_profiles;
create policy "cost_profiles_delete_own"
on public.cost_profiles for delete
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "billing_entitlements_select_own" on public.billing_entitlements;
create policy "billing_entitlements_select_own"
on public.billing_entitlements for select
to authenticated
using ((select auth.uid()) = user_id);

comment on table public.billing_entitlements is
  'Server-owned RevenueCat entitlement mirror. Client roles have read-only access.';
comment on column public.shifts.notes is
  'Optional Pro note attached to a shift; limited to 1,000 characters.';
comment on column public.shifts.tags is
  'Optional Pro labels attached to a shift; limited to ten labels.';

commit;
