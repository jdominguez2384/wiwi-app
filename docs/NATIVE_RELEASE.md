# WIWI Native Release Guide

WIWI's iOS and Android projects package a local static build of the user interface. The app connects directly to Supabase with the public client key and calls `https://getwiwi.com/api` only for privileged server operations such as account deletion and billing synchronization. No service-role or RevenueCat secret is included in the native bundle.

## Build and Sync

Run the complete native build whenever web code or native dependencies change:

```bash
npm run native:sync
```

This command:

1. Exports every user-facing Next.js route into `.next-native`.
2. Excludes Vercel-only API and legacy dynamic routes from the device bundle.
3. Copies the result and Capacitor plugins into both native projects.

The normal `npm run build` command remains the Vercel build and still includes all API routes.

## Supabase Redirect URLs

Add both exact URLs under Authentication > URL Configuration > Redirect URLs:

```text
wiwi://auth/confirmed
wiwi://reset-password
```

Keep the existing HTTPS and localhost redirect URLs. Test both confirmation and password recovery from a fully closed app and an already-open app before submission.

## Android

- Package ID: `com.getwiwi.app`
- Minimum SDK: 24
- Target SDK: 36
- URL scheme: `wiwi://`
- Release artifact: signed Android App Bundle (`.aab`)

Create an upload keystore outside the repository, enroll in Play App Signing, and build the release bundle from Android Studio or Gradle. Never commit `.jks`, `.keystore`, or signing passwords.

WIWI reads signing credentials from the ignored `android/keystore.properties` file or these environment variables:

```text
WIWI_ANDROID_KEYSTORE_PATH
WIWI_ANDROID_KEYSTORE_TYPE
WIWI_ANDROID_STORE_PASSWORD
WIWI_ANDROID_KEY_ALIAS
WIWI_ANDROID_KEY_PASSWORD
WIWI_ANDROID_VERSION_NAME
WIWI_ANDROID_VERSION_CODE
```

Copy `android/keystore.properties.example` for a local build, then run:

```bash
npm run native:bundle:android
```

The command refuses to create a release when signing credentials are incomplete. The output is `android/app/build/outputs/bundle/release/app-release.aab`.

The manual **Android Release Bundle** GitHub workflow creates the same signed artifact. Configure its protected `production` environment with:

```text
ANDROID_UPLOAD_KEYSTORE_BASE64
ANDROID_UPLOAD_STORE_PASSWORD
ANDROID_UPLOAD_KEY_ALIAS
ANDROID_UPLOAD_KEY_PASSWORD
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Increase the workflow's version code for every Play Console upload. Keep the encrypted upload key and its password in a separate recoverable backup even after the GitHub secrets are configured.

The first protected release run completed successfully on August 9, 2026. GitHub Actions built and verified `wiwi-android-1.0.0-1` as a signed 7.2 MB App Bundle. The artifact is retained for 14 days; rerun the workflow with the same version values if a fresh download is needed before the first Play Console upload.

GitHub Actions compiles and uploads a debug APK on every pull request and push to `main`. This verifies the JavaScript export, Capacitor sync, plugins, Android resources, and Gradle project without requiring a local Android installation.

## iOS

- Bundle ID: `com.getwiwi.app`
- Apple team: `VH8ST3DJ5U`
- Deployment target: iOS 15
- URL scheme: `wiwi://`
- Required submission toolchain: Xcode 26 with the iOS 26 SDK or later

The explicit App ID is registered in Apple Developer and the Xcode project uses automatic signing with the assigned team. Create an Archive on a current Mac and upload the first build to TestFlight before configuring the production release.

Store listing copy, privacy answers, review notes, and asset instructions live under `store/`. Run `npm run store:validate`, `npm run store:assets`, and `npm run store:screenshots` before submitting a new store version.

## Required Device Tests

- Fresh install, upgrade, background, force-close, and relaunch.
- Account signup and confirmation from Gmail, Outlook, and iCloud when available.
- Password recovery from a closed app and an already-open app.
- Sign in, sign out, session restoration, and account deletion.
- Add, edit, and delete shifts, including a shift shorter than one hour.
- English and Spanish tutorial, settings, legal pages, and error states.
- Offline launch, interrupted network requests, and recovery after reconnecting.
- Purchase, restore, cancellation, expiration, and refund after store products are configured.

## Public Native Environment

`NEXT_PUBLIC_NATIVE_API_ORIGIN` is optional and defaults to `https://getwiwi.com`. Set it only when intentionally building a native client against another trusted WIWI environment.
