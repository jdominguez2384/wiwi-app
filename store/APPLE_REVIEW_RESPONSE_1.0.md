# Apple Review Response - WIWI 1.0

Submission ID: `7c84d94f-4cf5-452b-95d9-06481e28ac71`

Apple requested additional information under Guideline 2.1. This is not a reported crash or functional defect.

## Reply Text

Replace the bracketed recording OS version and attach the physical-device recording before sending.

```text
Hello App Review,

Thank you for the opportunity to provide the requested information for WIWI 1.0. We have attached a physical-device screen recording that begins with app launch and demonstrates the app's typical flow and core features.

1. Recording: The attached recording shows account access, the bilingual tutorial, dashboard, adding and editing a shift, History filters, Insights, Settings/help, and account-deletion controls. The replacement 1.0.0 (3) build does not enable purchases or subscriptions, does not contain public user-generated content, and does not request sensitive device permissions.

2. Devices tested: iPhone 17 Pro Max running iOS 26.6 before submission, then retested on the same physical device after updating to iOS [RECORDING IOS VERSION] for the attached recording.

3. Functions and audience: WIWI helps delivery, rideshare, and other gig workers estimate net shift earnings after mileage, fuel, vehicle costs, work expenses, and a user-selected tax reserve. It provides earnings-per-hour and earnings-per-mile comparisons so workers can decide which shifts and apps were worthwhile. Results are informational and are not tax, legal, or financial advice.

4. Access: Sign-in credentials are provided in the private App Review Information fields. The review account contains representative shift data and requires no sample files. Tap Add to save a shift; use History to filter, edit, or delete shifts; use Insights for comparisons; and use Settings for cost assumptions, language, tutorial help, sign-out, and account deletion.

5. External services: Supabase provides authentication and synchronized data storage; Resend sends account emails through Supabase SMTP; Vercel/getwiwi.com hosts the account-deletion API and support/legal pages; Capacitor packages the native app and accesses the iOS share sheet. The RevenueCat SDK is present for a future billing release but is disabled in this build.

6. Regions: WIWI behaves consistently in every region. Users may select English or Spanish, and monetary examples use USD.

7. Authorization: WIWI is not a regulated financial/tax service and contains no protected third-party material, so no authorization documents apply.

We have also expanded the App Review Notes with these details. Please continue the review of build 1.0.0 (3).

Thank you.
```

## Physical-Device Recording Checklist

Update the iPhone 17 Pro Max from iOS 26.6 to the latest public iOS version before testing and recording. Apple released iOS 26.6.1 after the original TestFlight session. Keep notifications, personal email, and unrelated account information out of the recording.

1. Start on the iPhone Home Screen and tap WIWI so the recording includes app launch.
2. Show Create account and its required fields, then return without creating a new review account.
3. Sign in with the dedicated review account.
4. Briefly advance through the English tutorial and show the Spanish language toggle.
5. Show Dashboard totals and recent activity.
6. Add a small fictional shift, including gross earnings, minutes or decimal hours, miles, and an expense.
7. Open that shift from History, edit one value, save it, and demonstrate month/app/search filters.
8. Open Insights and show the available comparisons.
9. Open Settings, show cost assumptions, language, Help and tutorial, and Replay WIWI tutorial.
10. In Danger zone, type `DELETE` so the deletion button becomes available, but do not press the final deletion button for the persistent review account.
11. Confirm that Settings and Help contain no purchase controls or WIWI Pro links in this billing-disabled release.
12. End the recording and verify that text is readable, taps are visible, and no personal notifications appeared.

## Before Sending

- Install the latest public iOS update, rerun the WIWI smoke test, and record the exact version from Settings > General > About.
- Attach the video to the App Review Information section or the reviewer reply.
- Paste the updated text from `store/REVIEW_NOTES.md` into App Review Information > Notes.
- Replace the English and Spanish descriptions with `store/metadata.json` so 1.0 does not advertise disabled purchases.
- Select build 3 for version 1.0, reply to Apple with the completed Reply Text, then update and resubmit the review.
