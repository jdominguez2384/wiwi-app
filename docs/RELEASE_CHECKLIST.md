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
- [x] Create App Store Connect app `6800010884` for `com.getwiwi.app`.
- [ ] Complete Google Play physical Android-device and contact-phone verification.
- [ ] Create the Google Play app record for `com.getwiwi.app` and enroll it in Play App Signing.
- [x] Configure both native projects with `com.getwiwi.app` and the `wiwi://` authentication scheme.
- [x] Add `wiwi://auth/confirmed` and `wiwi://reset-password` to Supabase Redirect URLs.
- [x] Add a protected Xcode 26 GitHub workflow for signed TestFlight builds without a local Mac.
- [x] Configure the Apple distribution, provisioning-profile, and App Store Connect API secrets from `docs/IOS_TESTFLIGHT.md`.
- [x] Target Android API level 36 or later for submissions on or after August 31, 2026.
- [x] Create and visually verify production icons and splash assets.
- [x] Prepare validated English and Spanish descriptions, keywords, feature graphics, privacy answers, and review notes.
- [x] Capture and visually verify the localized Apple and Google screenshot sets.
- [x] Complete the Apple age rating questionnaire with a calculated `4+` rating.
- [ ] Complete the Google Play content rating questionnaire.
- [x] Publish Apple App Privacy disclosures from the actual production behavior.
- [ ] Complete Google Play Data safety disclosures from the actual production behavior.
- [x] Provide `https://getwiwi.com/support` as the Apple support URL.
- [x] Provide `https://getwiwi.com/privacy` as the Apple privacy URL.
- [ ] Provide `https://getwiwi.com/delete-account` as the external deletion URL.
- [x] Upload the English and Spanish iPhone 6.9-inch screenshot sets to App Store Connect.
- [x] Upload the English and Spanish 13-inch iPad screenshot sets to App Store Connect.
- [x] Create a dedicated review account with representative June-August shift data and private local credentials.
- [ ] Test account creation, confirmation links, recovery links, and deletion inside native builds.
- [ ] Create signed builds and complete the real-device checks in `docs/NATIVE_RELEASE.md`.
- [x] Build, signature-verify, and retain the Android 1.0.0 (1) App Bundle in protected GitHub Actions.
- [x] Generate and separately store the encrypted Android upload key and public certificate.
- [x] Accept the App Store Connect Terms of Service as the account owner.
- [x] Enter the App Review contact phone number in international format and save the 1.0 version metadata.
- [ ] Complete Digital Services Act trader-status verification in App Store Connect.
- [x] Run the iOS release workflow and upload build 1 to TestFlight.
- [x] Add iOS version 1.0 and build 1 to the draft App Review submission.
- [x] Complete first-device TestFlight verification on an iPhone.
- [x] Submit iOS version 1.0 build 2 for App Review after the TestFlight smoke test.
- [x] Record Apple's August 29 Guideline 2.1 information request for submission `7c84d94f-4cf5-452b-95d9-06481e28ac71`.
- [x] Confirm TestFlight records pre-submission testing on iPhone 17 Pro Max running iOS 26.6 with no crashes.
- [x] Upload billing-disabled iOS build 3 from commit `56fa14d` and confirm it is Ready to Submit in TestFlight.
- [x] Deploy cross-device signup confirmation, bilingual error states, and confirmation resend (`f6dc1c0`); update Supabase's signup template to use the HTTPS return page for older builds too.
- [x] Upload iOS build 4 with the confirmation improvements from `f6dc1c0`; GitHub run `34001939412` completed the signed archive and TestFlight upload successfully.
- [ ] Confirm Apple's processing of build 4 and install it from TestFlight for the physical-device signup walkthrough.
- [ ] Update that iPhone to the latest public iOS release, retest WIWI, and capture Apple's requested walkthrough.
- [ ] Select build 4 for version 1.0, add the complete review notes, attach the recording, reply to Apple, and resubmit.
- [ ] Upload purchase-review screenshots and submit the first subscriptions and lifetime purchase with the future billing-enabled app version.

## Monetization

- [x] Preserve unlimited core shift logging, history, and basic insights on WIWI Free.
- [x] Define the Pro feature boundary and launch pricing.
- [x] Implement RevenueCat purchase, restore, server sync, and webhook code.
- [x] Store entitlement state server-side and protect Pro writes in the database.
- [x] Add restore-purchases and manage-subscription flows before enabling payment.
- [x] Create the Apple subscription group, monthly and annual subscriptions, lifetime purchase, prices, localizations, and annual trial from `docs/MONETIZATION.md`.
- [ ] Place the monthly and annual Apple subscriptions at the same service level before review.
- [ ] Create the matching Google Play products and approve products in both stores.
- [ ] Configure the RevenueCat `pro` entitlement, `default` offering, products, and webhook.
- [ ] Complete sandbox lifecycle testing on iPhone and Android.
- [ ] Enable `NEXT_PUBLIC_PRO_BILLING_ENABLED` only after every billing test passes.
