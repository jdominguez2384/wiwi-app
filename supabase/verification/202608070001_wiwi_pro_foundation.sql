-- Read-only verification for the WIWI Pro foundation migration.

select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'cost_profiles',
    'billing_entitlements',
    'billing_webhook_events'
  )
order by table_name;

select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name = 'shifts'
  and column_name in (
    'cost_profile_id',
    'cost_profile_name_snapshot',
    'notes',
    'tags'
  )
order by column_name;

select tablename, policyname, cmd, roles
from pg_policies
where schemaname = 'public'
  and tablename in ('cost_profiles', 'billing_entitlements', 'billing_webhook_events')
order by tablename, policyname;

select event_object_table, trigger_name, action_timing, event_manipulation
from information_schema.triggers
where event_object_schema = 'public'
  and trigger_name in (
    'shifts_pro_fields_guard',
    'cost_profiles_set_updated_at',
    'cost_profiles_limit_guard',
    'billing_entitlements_set_updated_at'
  )
order by event_object_table, trigger_name, event_manipulation;

select grantee, table_name, privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in ('cost_profiles', 'billing_entitlements', 'billing_webhook_events')
  and grantee in ('anon', 'authenticated')
order by table_name, grantee, privilege_type;
