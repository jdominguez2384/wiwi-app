-- Read-only checks for the WIWI 1.0 launch migration.
-- Every row should return passed = true after the migration completes.

select
  'shift calculation columns exist' as check_name,
  count(*) = 4 as passed,
  count(*)::text || ' of 4 columns found' as detail
from information_schema.columns
where table_schema = 'public'
  and table_name = 'shifts'
  and column_name in (
    'other_expenses',
    'tax_rate_snapshot',
    'mpg_snapshot',
    'gas_price_snapshot'
  )

union all

select
  'shift snapshots are fully backfilled',
  count(*) = 0,
  count(*)::text || ' rows contain null launch fields'
from public.shifts
where other_expenses is null
  or tax_rate_snapshot is null
  or mpg_snapshot is null
  or gas_price_snapshot is null

union all

select
  'all auth users have a profile',
  count(*) = 0,
  count(*)::text || ' users are missing profiles'
from auth.users as users
left join public.profiles as profiles on profiles.id = users.id
where profiles.id is null

union all

select
  'all auth users have settings',
  count(*) = 0,
  count(*)::text || ' users are missing settings'
from auth.users as users
left join public.user_settings as settings on settings.user_id = users.id
where settings.user_id is null

union all

select
  'authenticated users cannot update plan',
  not has_column_privilege(
    'authenticated',
    'public.profiles',
    'plan',
    'UPDATE'
  ),
  case
    when has_column_privilege(
      'authenticated',
      'public.profiles',
      'plan',
      'UPDATE'
    ) then 'plan is writable and must be fixed'
    else 'plan updates are blocked'
  end

union all

select
  'authenticated users can update language',
  has_column_privilege(
    'authenticated',
    'public.profiles',
    'preferred_language',
    'UPDATE'
  ),
  case
    when has_column_privilege(
      'authenticated',
      'public.profiles',
      'preferred_language',
      'UPDATE'
    ) then 'language updates are allowed'
    else 'language updates are unexpectedly blocked'
  end

union all

select
  'canonical RLS policies exist',
  count(*) = 8,
  count(*)::text || ' of 8 policies found'
from pg_policies
where schemaname = 'public'
  and policyname in (
    'profiles_select_own',
    'profiles_update_own',
    'settings_select_own',
    'settings_update_own',
    'shifts_select_own',
    'shifts_insert_own',
    'shifts_update_own',
    'shifts_delete_own'
  );
