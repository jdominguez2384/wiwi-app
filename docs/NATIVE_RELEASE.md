# Native Release Plan

WIWI is currently a responsive web app and PWA with generated Capacitor iOS and Android projects. App-store distribution still requires device testing, signing, deep-link configuration, and store-specific account and billing behavior.

## Recommended Architecture

The current Capacitor container points internal-test builds at `https://getwiwi.com` while keeping Supabase as the shared backend. Before App Store review, bundle the web experience or add meaningful native capabilities. A wrapper that only displays a website carries review risk under Apple's minimum-functionality rules.

Meaningful native additions can include secure deep-link handling, native share/export, biometric re-entry, offline draft capture, haptics, and platform-standard subscription management. These should support the core shift workflow rather than exist only for review.

## Proposed Identifiers

- App name: `WIWI`
- Apple bundle ID: `com.getwiwi.app`
- Android application ID: `com.getwiwi.app`
- Production domain: `getwiwi.com`
- Authentication callback host: `getwiwi.com`

Identifiers become difficult to change after store records and signed builds exist. Confirm them before creating the production listings.

## Implementation Order

1. Stabilize and deploy the web/database hardening release.
2. Confirm the proposed bundle and application identifiers before creating store records.
3. Configure universal links and Android App Links for authentication callbacks.
4. Test the generated icon and splash sets on real devices.
5. Test safe areas, keyboard behavior, date inputs, bottom navigation, external links, and offline/error states on physical devices.
6. Add monitoring and a version/build-number strategy.
7. Distribute through TestFlight and Google Play internal testing.
8. Resolve tester feedback before completing store privacy and data-safety disclosures.

The Capacitor projects, identifiers, launch assets, and sync scripts are already in the repository. Run `npm run native:assets` after artwork changes and `npm run native:sync` after web or Capacitor configuration changes.

## Native Build Requirements

- Apple builds require macOS, Xcode, an Apple Developer membership, signing certificates, and provisioning profiles.
- Google Play builds require Android Studio, a protected release keystore, Play App Signing, and the required target API level.
- Never place `SUPABASE_SERVICE_ROLE_KEY` or other server secrets inside an iOS or Android bundle.
- Account deletion must continue through the authenticated server endpoint, not a privileged key in the app.

Official references:

- Apple review guidelines: https://developer.apple.com/app-store/review/guidelines/
- Apple submission requirements: https://developer.apple.com/news/upcoming-requirements/
- Android target API requirements: https://developer.android.com/google/play/requirements/target-sdk
- Google account deletion requirements: https://support.google.com/googleplay/android-developer/answer/13327111
