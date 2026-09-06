# WIWI 1.0 App Review Notes

Paste the text below into App Store Connect after replacing the bracketed device details. Keep review credentials only in Apple's private User name and Password fields.

```text
WIWI (Was It Worth It?) helps delivery, rideshare, and other gig workers estimate what a shift paid after mileage, fuel, work expenses, vehicle costs, and a user-selected tax reserve. It shows net earnings plus earnings per hour and mile so workers can compare shifts, apps, weeks, and months. Estimates are informational only and are not tax, legal, or financial advice.

PHYSICAL-DEVICE TESTING AND RECORDING
- Tested before submission on iPhone 17 Pro Max running iOS 26.6.
- Retested and recorded on the same physical device after updating to iOS [RECORDING IOS VERSION].
- The attached recording begins at app launch and shows account access, the tutorial, dashboard, adding and editing a shift, History filters, Insights, Settings, language/help, and the account-deletion controls.

REVIEW ACCESS AND MAIN FLOW
- Sign-in is required. Current credentials are in the private Sign-In Information fields. The account contains representative June-August shifts; no sample files are required.
- To create an account: tap Create account, enter name/email/password, then confirm the email. To sign in: enter the supplied credentials.
- Dashboard summarizes recent net earnings and real hourly pay.
- Tap Add, enter date/app/gross earnings/hours/miles/expenses, then save.
- History supports month, app, and text filters. Open a shift to edit or delete it.
- Insights compares performance over time. Settings changes tax reserve, MPG, gas price, weekly goal, and English/Spanish.
- Replay the first-run guide at Settings > Help and tutorial.
- Delete an account at Settings > Danger zone: type DELETE, then tap Delete my account. The public deletion instructions are at https://getwiwi.com/delete-account.

PAID FEATURES
This replacement 1.0.0 (4) build does not enable purchases or subscriptions and contains no paid content. WIWI Pro and purchase surfaces are hidden in this release. RevenueCat billing will only be enabled in a later build after its products pass store review and sandbox testing. There is no external purchase link or alternative payment method.

Signup confirmation emails open https://getwiwi.com/auth/confirmed, including when opened on a different device. After confirming, return to WIWI and sign in with the same email and password. The signup and login screens offer a resend-confirmation option.

EXTERNAL SERVICES
- Supabase: authentication, account data, and synchronized shift/settings storage.
- Resend, through Supabase SMTP: account confirmation and password-recovery email.
- Vercel/getwiwi.com: account-deletion API plus support, privacy, and legal pages.
- Capacitor: native iOS packaging and the iOS system share sheet.
- RevenueCat SDK: present for future store billing but inactive in this build.

PRIVACY, CONTENT, AND REGIONS
WIWI does not request location, contacts, camera, microphone, photos, advertising tracking, or other sensitive device capabilities. It has no social feed, public user-generated content, reporting/blocking feature, ads, AI service, or third-party protected material. The app is not a regulated financial or tax service. Functionality is consistent in all regions; users can select English or Spanish, and monetary examples use USD.
```
