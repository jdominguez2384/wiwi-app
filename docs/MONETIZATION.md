# WIWI Pro Launch Runbook

WIWI keeps unlimited core shift logging, history, and basic insights free. Pro is the paid decision-making layer: advanced comparisons, goal forecasts, CSV/PDF reports, custom cost profiles, and shift notes/tags.

## Launch Offer

| Product | Store product ID | Target price | Renewal |
| --- | --- | --- | --- |
| Pro Monthly | `wiwi_pro_monthly` | USD 4.99 | Monthly |
| Pro Annual | `wiwi_pro_annual` | USD 39.99 | Annual |
| Pro Lifetime | `wiwi_pro_lifetime` | USD 79.99 | One-time, limited launch offer |

Configure a 14-day introductory trial on the annual subscription if store eligibility and economics allow it. Apple and Google determine eligibility and always show the final localized price and trial terms before confirmation.

The lifetime product should be a non-consumable/one-time product. It means Pro access while WIWI continues to operate, not a guarantee that the service will exist forever. Remove the product from sale after the founding offer; existing purchasers retain their entitlement.

## RevenueCat Contract

- RevenueCat entitlement: `pro`
- Current offering: `default`
- Monthly package: `$rc_monthly` -> `wiwi_pro_monthly`
- Annual package: `$rc_annual` -> `wiwi_pro_annual`
- Lifetime package: `$rc_lifetime` -> `wiwi_pro_lifetime`
- App user ID: the authenticated Supabase user UUID
- Webhook URL: `https://getwiwi.com/api/billing/revenuecat`
- Webhook authorization: `Bearer <REVENUECAT_WEBHOOK_AUTH_KEY>`

Never use an email address as the RevenueCat app user ID. The Supabase UUID keeps purchases connected to the correct account even if the account email changes.

## Environment Variables

Configure these in Vercel for Production and Preview. Keep the enable flag false until sandbox verification is complete.

```text
NEXT_PUBLIC_PRO_BILLING_ENABLED=false
NEXT_PUBLIC_REVENUECAT_IOS_API_KEY=appl_...
NEXT_PUBLIC_REVENUECAT_ANDROID_API_KEY=goog_...
REVENUECAT_SECRET_API_KEY=sk_...
REVENUECAT_WEBHOOK_AUTH_KEY=<long-random-secret>
```

The public iOS and Android SDK keys are safe in the app bundle. The RevenueCat secret key, webhook secret, and Supabase service-role key are server-only and must never use a `NEXT_PUBLIC_` prefix.

## Safe Enablement Order

1. Apply `supabase/migrations/202608070001_wiwi_pro_foundation.sql` and run its verification query.
2. Create the bundle/app records and products in App Store Connect and Google Play Console.
3. Import those products into RevenueCat, attach all three to entitlement `pro`, and build offering `default` with the standard package identifiers above.
4. Add the SDK keys, server key, and webhook secret to Vercel while leaving billing disabled.
5. Configure the RevenueCat webhook and confirm a test event reaches WIWI successfully.
6. Run purchase, cancellation, expiration, restore, account-switching, and offline tests in Apple sandbox/TestFlight and Google Play internal testing.
7. Confirm `billing_entitlements` and `profiles.plan` update after every lifecycle event.
8. Set `NEXT_PUBLIC_PRO_BILLING_ENABLED=true`, redeploy Vercel, run `npm run native:sync`, and create fresh native release builds.

## Required Test Cases

- Monthly, annual, and lifetime purchases unlock Pro only after the store succeeds.
- User-canceled checkout produces no scary error and no charge.
- Restore Purchases works after reinstalling on the same store account.
- An active subscription survives logout/login and app restart.
- Expiration or refund removes write access to Pro-only fields without deleting shifts.
- A free user cannot create cost profiles or write notes/tags through direct database calls.
- Switching between two WIWI accounts never carries an entitlement to the wrong account.
- Account deletion warns users to cancel an active store subscription first.

## External Launch Work

Code cannot create or approve store products, banking/tax agreements, subscription groups, screenshots, review metadata, or production signing credentials. Those steps must be completed in the Apple, Google, and RevenueCat consoles by the account owner. Do not enable billing before both stores pass sandbox testing.

Official references:

- Apple subscriptions: https://developer.apple.com/app-store/subscriptions/
- Apple review guidelines: https://developer.apple.com/app-store/review/guidelines/
- Google Play Billing: https://developer.android.com/google/play/billing
- RevenueCat Capacitor setup: https://www.revenuecat.com/docs/getting-started/installation/capacitor
- RevenueCat webhooks: https://www.revenuecat.com/docs/integrations/webhooks
