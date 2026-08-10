# WIWI iOS TestFlight Setup

WIWI uses the manual **iOS TestFlight Release** GitHub Actions workflow to build, sign, retain, and optionally upload an iOS release. The build runs on a GitHub-hosted Mac with Xcode 26, so a personally owned Mac is not required.

Never commit signing certificates, private keys, provisioning profiles, or their passwords. Keep a second encrypted backup outside GitHub because Apple private keys cannot be downloaded again.

## One-Time Apple Setup

The workflow needs three Apple credentials:

1. An Apple Distribution certificate exported as a password-protected `.p12` file.
2. An App Store Connect provisioning profile for `com.getwiwi.app` and team `VH8ST3DJ5U`.
3. An App Store Connect API key with permission to upload builds.

### 1. Create the Distribution Certificate on Windows

Generate the private key and certificate request outside this repository. Git for Windows normally includes OpenSSL at `C:\Program Files\Git\usr\bin\openssl.exe`.

```powershell
$OpenSsl = "C:\Program Files\Git\usr\bin\openssl.exe"
$SigningDirectory = Join-Path $HOME "wiwi-apple-signing"
New-Item -ItemType Directory -Force -Path $SigningDirectory
Set-Location $SigningDirectory

& $OpenSsl genrsa -out wiwi-apple-distribution.key 2048
& $OpenSsl req -new `
  -key wiwi-apple-distribution.key `
  -out wiwi-apple-distribution.csr `
  -subj "/emailAddress=YOUR_APPLE_ID_EMAIL/CN=WIWI App Store Distribution/C=US"
```

In Apple Developer **Certificates, Identifiers & Profiles**:

1. Open **Certificates** and select **Add**.
2. Choose **Apple Distribution**.
3. Upload `wiwi-apple-distribution.csr`.
4. Download the generated certificate into the signing directory as `distribution.cer`.

Combine Apple's certificate with its matching private key. Choose a strong export password when OpenSSL prompts for one.

```powershell
& $OpenSsl x509 `
  -inform DER `
  -in distribution.cer `
  -out distribution.pem

& $OpenSsl pkcs12 -export `
  -out wiwi-apple-distribution.p12 `
  -inkey wiwi-apple-distribution.key `
  -in distribution.pem `
  -name "WIWI Apple Distribution"
```

### 2. Create the Provisioning Profile

In Apple Developer **Certificates, Identifiers & Profiles**:

1. Open **Profiles** and select **Add**.
2. Choose **App Store Connect** under Distribution.
3. Select the explicit App ID for `com.getwiwi.app`.
4. Select the Apple Distribution certificate created above.
5. Name the profile `WIWI App Store` and download it as `WIWI_App_Store.mobileprovision`.

Regenerate this profile whenever its certificate, capabilities, or expiration changes.

### 3. Create the App Store Connect API Key

In App Store Connect, open **Users and Access > Integrations > App Store Connect API**:

1. Generate a team API key named `WIWI GitHub Upload` with **App Manager** access.
2. Record the **Key ID** and **Issuer ID**.
3. Download the `.p8` private key. Apple allows this download only once.

The API key uploads the completed IPA. It is not embedded in WIWI.

## Configure GitHub Secrets

Open the GitHub repository, then go to **Settings > Environments > production > Environment secrets**. The Supabase secrets already used by the Android workflow should remain in this environment.

Add these iOS secrets:

| Secret | Value |
| --- | --- |
| `IOS_DISTRIBUTION_CERTIFICATE_BASE64` | Base64 contents of `wiwi-apple-distribution.p12` |
| `IOS_DISTRIBUTION_CERTIFICATE_PASSWORD` | Password selected during the `.p12` export |
| `IOS_PROVISIONING_PROFILE_BASE64` | Base64 contents of `WIWI_App_Store.mobileprovision` |
| `APP_STORE_CONNECT_API_KEY_ID` | App Store Connect API Key ID |
| `APP_STORE_CONNECT_API_ISSUER_ID` | App Store Connect API Issuer ID |
| `APP_STORE_CONNECT_API_PRIVATE_KEY_BASE64` | Base64 contents of the downloaded `.p8` key |

Create the base64 values without printing them into a terminal or storing them in the repository:

```powershell
[Convert]::ToBase64String(
  [IO.File]::ReadAllBytes("$HOME\wiwi-apple-signing\wiwi-apple-distribution.p12")
) | Set-Clipboard

[Convert]::ToBase64String(
  [IO.File]::ReadAllBytes("$HOME\wiwi-apple-signing\WIWI_App_Store.mobileprovision")
) | Set-Clipboard

[Convert]::ToBase64String(
  [IO.File]::ReadAllBytes("$HOME\wiwi-apple-signing\AuthKey_YOUR_KEY_ID.p8")
) | Set-Clipboard
```

Add `NEXT_PUBLIC_REVENUECAT_IOS_API_KEY` to the same environment after the Apple app is connected in RevenueCat. This public SDK key is required only when the workflow's **Enable RevenueCat purchases** option is selected.

Clear the clipboard after the secrets have been saved:

```powershell
Set-Clipboard -Value $null
```

## Build and Upload

1. Open **Actions > iOS TestFlight Release > Run workflow** in GitHub.
2. Use version `1.0.0` and build number `1` for the first accepted upload.
3. Leave RevenueCat purchases disabled until its products, entitlement, offering, and webhook are configured.
4. Leave TestFlight upload enabled.
5. Wait for Apple to process the build after the workflow succeeds.

Increase the build number after every build that successfully reaches App Store Connect. A failed build that never uploaded can reuse its number.

The workflow retains the signed IPA and dSYMs as a private GitHub artifact for 14 days. Signing files are removed from the temporary runner even when a build fails.

## First TestFlight Pass

Before attaching the build to version 1.0, verify on an iPhone:

- Fresh installation, first-run tutorial, English, and Spanish.
- Signup, confirmation link, login, logout, password recovery, and account deletion.
- Add, edit, filter, and delete shifts.
- Backgrounding, force-closing, relaunching, and an interrupted connection.
- Pro purchase and restore only after RevenueCat is enabled and configured.

Record every uploaded version and build number in the release notes.
