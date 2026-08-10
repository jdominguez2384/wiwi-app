# WIWI Release Checklist

## Database and Security

- [ ] Back up the production Supabase database.
- [x] Apply every migration in `supabase/migrations` to production.
- [x] Confirm the migration created calculation snapshot and `other_expenses` columns.
- [x] Apply and verify the WIWI Pro foundation migration dated August 7, 2026.
- [ ] Test two separate accounts and confirm neither can read, update, or delete the other's shifts.
- [x] Confirm every existing account has both a profile and default settings row.
- [x] Delete a test account and verify its auth user, profile, settings, and shifts are removed.
- [x] Record the production migration date and operator in the release notes.

## Product Verification

- [x] Add a shift with less than one hour worked.
- [x] Add a shift with tolls or parking in Other expenses.
- [x] Change MPG, gas price, and tax reserve; confirm older shift results do not change.
- [x] Verify all eight tutorial steps, language switching, mobile scrolling, and completion controls.
- [ ] Edit and delete a shift on desktop, iPhone, and Android.
- [ ] Verify month and app filters with at least 25 shifts.
- [ ] Confirm English and Spanish legal pages render fully and update the document language.
- [ ] Test confirmation and password-reset email with Gmail, Outlook, and iCloud when available.

## Operations

- [x] Run `npm run check`.
- [x] Run `npm run build` outside the sandbox if Windows blocks Next.js workers.
- [x] Confirm the GitHub Quality workflow passes.
- [x] Export the client locally and sync the bundled UI into iOS and Android without a remote `server.url`.
- [x] Add CI coverage that builds the native bundle and compiles an Android debug APK.
- [ ] Verify `support@getwiwi.com` can receive inbound mail, not only send it.
- [ ] Add production error monitoring before public store launch.
- [ ] Document database backup and restore procedures.
- [x] Verify `/robots.txt`, `/sitemap.xml`, `/support`, and `/delete-account` in production.
- [x] Verify `/api/health` returns `status: ok` and the deployed commit version.

## App Store Submission

- [x] Register the explicit Apple App ID `com.getwiwi.app` under team `VH8ST3DJ5U`.
- [ ] Complete Google Play physical Android-device and contact-phone verification.
- [ ] Create the Google Play app record for `com.getwiwi.app` and enroll it in Play App Signing.
- [x] Configure both native projects with `com.getwiwi.app` and the `wiwi://` authentication scheme.
- [x] Add `wiwi://auth/confirmed` and `wiwi://reset-password` to Supabase Redirect URLs.
- [ ] Use Xcode 26 or later and the iOS 26 SDK for Apple submissions.
- [x] Target Android API level 36 or later for submissions on or after August 31, 2026.
- [x] Create and visually verify production icons and splash assets.
- [x] Prepare validated English and Spanish descriptions, keywords, feature graphics, privacy answers, and review notes.
- [x] Capture and visually verify the localized Apple and Google screenshot sets.
- [ ] Complete store age/content ratings.
- [ ] Complete Apple App Privacy and Google Play Data safety disclosures from the actual production behavior.
- [ ] Provide `https://getwiwi.com/support` as the support URL.
- [ ] Provide `https://getwiwi.com/privacy` as the privacy URL.
- [ ] Provide `https://getwiwi.com/delete-account` as the external deletion URL.
- [x] Create a dedicated review account with representative June-August shift data and private local credentials.
- [ ] Test account creation, confirmation links, recovery links, and deletion inside native builds.
- [ ] Create signed builds and complete the real-device checks in `docs/NATIVE_RELEASE.md`.
- [x] Build, signature-verify, and retain the Android 1.0.0 (1) App Bundle in protected GitHub Actions.
- [x] Generate and separately store the encrypted Android upload key and public certificate.
- [ ] Accept the App Store Connect Terms of Service as the account owner.

## Monetization

- [x] Preserve unlimited core shift logging, history, and basic insights on WIWI Free.
- [x] Define the Pro feature boundary and launch pricing.
- [x] Implement RevenueCat purchase, restore, server sync, and webhook code.
- [x] Store entitlement state server-side and protect Pro writes in the database.
- [x] Add restore-purchases and manage-subscription flows before enabling payment.
- [ ] Create and approve Apple and Google products using `docs/MONETIZATION.md`.
- [ ] Configure the RevenueCat `pro` entitlement, `default` offering, products, and webhook.
- [ ] Complete sandbox lifecycle testing on iPhone and Android.
- [ ] Enable `NEXT_PUBLIC_PRO_BILLING_ENABLED` only after every billing test passes.
