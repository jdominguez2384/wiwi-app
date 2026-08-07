# WIWI Release Checklist

## Database and Security

- [ ] Back up the production Supabase database.
- [x] Apply every migration in `supabase/migrations` to production.
- [x] Confirm the migration created calculation snapshot and `other_expenses` columns.
- [ ] Test two separate accounts and confirm neither can read, update, or delete the other's shifts.
- [x] Confirm every existing account has both a profile and default settings row.
- [ ] Delete a test account and verify its auth user, profile, settings, and shifts are removed.
- [x] Record the production migration date and operator in the release notes.

## Product Verification

- [ ] Add a shift with less than one hour worked.
- [ ] Add a shift with tolls or parking in Other expenses.
- [ ] Change MPG, gas price, and tax reserve; confirm older shift results do not change.
- [ ] Edit and delete a shift on desktop, iPhone, and Android.
- [ ] Verify month and app filters with at least 25 shifts.
- [ ] Confirm English and Spanish legal pages render fully and update the document language.
- [ ] Test confirmation and password-reset email with Gmail, Outlook, and iCloud when available.

## Operations

- [x] Run `npm run check`.
- [x] Run `npm run build` outside the sandbox if Windows blocks Next.js workers.
- [ ] Confirm the GitHub Quality workflow passes.
- [ ] Verify `support@getwiwi.com` can receive inbound mail, not only send it.
- [ ] Add production error monitoring before public store launch.
- [ ] Document database backup and restore procedures.
- [ ] Verify `/robots.txt`, `/sitemap.xml`, `/support`, and `/delete-account` in production.
- [ ] Verify `/api/health` returns `status: ok` and the deployed commit version.

## App Store Submission

- [ ] Register the final Apple bundle ID and Android application ID.
- [ ] Use Xcode 26 or later and the iOS 26 SDK for Apple submissions.
- [ ] Target Android API level 36 or later for submissions on or after August 31, 2026.
- [ ] Create production icons, splash assets, screenshots, descriptions, age ratings, and keywords.
- [ ] Complete Apple App Privacy and Google Play Data safety disclosures from the actual production behavior.
- [ ] Provide `https://getwiwi.com/support` as the support URL.
- [ ] Provide `https://getwiwi.com/privacy` as the privacy URL.
- [ ] Provide `https://getwiwi.com/delete-account` as the external deletion URL.
- [ ] Create a review account with representative shift data and include review notes.
- [ ] Test account creation, confirmation links, recovery links, and deletion inside native builds.

## Monetization

- [ ] Launch and measure the dependable free experience first.
- [ ] Define the exact Pro feature boundary and pricing.
- [ ] Implement store billing through RevenueCat or native StoreKit/Play Billing.
- [ ] Store entitlement state server-side and validate webhook events.
- [ ] Add restore-purchases and manage-subscription flows before enabling payment.
