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

GitHub Actions compiles and uploads a debug APK on every pull request and push to `main`. This verifies the JavaScript export, Capacitor sync, plugins, Android resources, and Gradle project without requiring a local Android installation.

## iOS

- Bundle ID: `com.getwiwi.app`
- Deployment target: iOS 15
- URL scheme: `wiwi://`
- Required submission toolchain: Xcode 26 with the iOS 26 SDK or later

Assign the Apple Developer team in Xcode, register the bundle ID in Apple Developer, enable automatic signing, and create an Archive on a current Mac. Upload the first build to TestFlight before configuring the production release.

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
