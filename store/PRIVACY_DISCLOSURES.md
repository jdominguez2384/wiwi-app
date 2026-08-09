# WIWI Store Privacy Disclosures

These answers describe the production app as of version 1.0.0. Re-audit them whenever analytics, advertising, crash reporting, location, or a new SDK is added.

## Shared Answers

- WIWI does not sell user data or use it for third-party advertising.
- WIWI does not track users across apps or websites.
- Data is encrypted in transit with HTTPS/TLS.
- Users can delete their account in Settings or at `https://getwiwi.com/delete-account`.
- WIWI does not request precise location, contacts, photos, camera, microphone, health, or advertising identifier access.

## Apple App Privacy

Declare the following data as collected, linked to the user, and used only for App Functionality:

| Apple category | WIWI data |
| --- | --- |
| Contact Info > Email Address | Supabase account email |
| Identifiers > User ID | Supabase account UUID |
| Financial Info > Purchase History | Store product and entitlement status |
| Financial Info > Other Financial Info | User-entered shift earnings, expenses, tax reserve, and cost assumptions |
| User Content > Other User Content | Shift notes, tags, app names, goals, and settings |

Select **No** for tracking. Do not declare diagnostics or location unless production behavior changes before submission.

## Google Play Data Safety

Declare these collected data types:

| Google category | Required | Purpose |
| --- | --- | --- |
| Personal info > Email address | Yes | Account management and authentication |
| Personal info > User IDs | Yes | Account management and subscription association |
| Financial info > Purchase history | Yes | In-app purchase and entitlement management |
| Financial info > Other financial info | Yes | Shift income, mileage, expenses, tax reserve, and earnings calculations |
| App activity > Other user-generated content | Yes | Shift notes, tags, goals, and saved preferences |

Mark the data as encrypted in transit and deletable by user request. The data is not shared for advertising; Supabase and RevenueCat process it as service providers for core app functionality.
