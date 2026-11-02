# Officer workspace setup

The workspace at `/officer` is implemented. On November 1, 2026, the separate **Texas ACM** Firebase project (`texas-acm-1bb6b`) and **Texas ACM Website** web app were created under the newly selected Google account. Local browser configuration is saved in ignored `.env.local`; `.firebaserc` selects this project. Email/password authentication and Identity Platform are enabled on the no-cost Spark plan. The default Firestore database is created in `nam5`. Authenticator TOTP and email enumeration protection are enabled, and the repository Firestore rules are deployed and read back successfully. The first administrator, `tanishchauhan@utexas.edu`, exists in Authentication and has a verified active `admin` approval record. Their email remains unverified until they complete onboarding; no password or authenticator factor was set by the agent. Production hosting and a server identity for invitations remain to be configured.

The original account reached its project quota. At the user’s request, the unused `EagleShackAuth` project was moved into Firebase’s 30-day recoverable deletion flow; `Eagle Shack` remains. The original ACM website deployment has not been changed.

## Intended services

- Firebase Authentication with email/password and verified email.
- Firebase Authentication **with Identity Platform** and TOTP multi-factor authentication (an authenticator app).
- Cloud Firestore for approved officers and managed content.
- A Node-capable Next.js deployment for the admin invitation endpoint. The current `firebase-admin` endpoint is not a Cloudflare Worker endpoint.

See [Firebase’s TOTP instructions](https://firebase.google.com/docs/auth/web/totp-mfa) and [Security Rules documentation](https://firebase.google.com/docs/rules/basics). Check current project entitlements/pricing before upgrading or enabling billed services. No billing plan was changed in this work.

## Connect the project

1. Use the created project `texas-acm-1bb6b` (selected by `.firebaserc`).
2. Register a web app and copy its browser configuration into the four `NEXT_PUBLIC_FIREBASE_*` variables from `.env.example`. Add the eventual hosting domain and local development domain to Authentication’s authorized domains.
3. Enable email/password authentication and email enumeration protection. Configure verification and password-reset email templates with the final site name and appropriate action domain.
4. Identity Platform and TOTP are already enabled. To reproduce the trusted cloud setup with Application Default Credentials, run `node scripts/configure-project.mjs texas-acm-1bb6b`. It enables TOTP and email enumeration protection, deploys the repository rules, and verifies the released rules match. Enabling only password authentication does not satisfy this workspace’s access rules.
5. The default **production-mode** Firestore database and application rules are already deployed. No composite indexes are required by `firestore.indexes.json`. For future rules/index updates, use the configuration script or `npx firebase-tools deploy --only firestore --project texas-acm-1bb6b`. Do not use open test-mode rules.
6. Use a least-privilege server identity for invitations. Store service-account JSON in the hosting provider’s secret store as `FIREBASE_SERVICE_ACCOUNT_JSON`, never a `NEXT_PUBLIC_` variable or a committed file. The invitation endpoint is unavailable without it.
7. The initial administrator is already bootstrapped. For another explicitly approved administrator, use trusted local application credentials or that same server-only environment variable:

    ```sh
    node scripts/bootstrap-admin.mjs --project YOUR_PROJECT_ID --email YOUR_EMAIL --name 'Your Name'
    ```

    This is an explicit trusted administrator operation. It does not verify email or bypass 2FA. Do not run it for unapproved people.

8. On `/officer`, enter the initial admin email and choose **Set or reset your password**. Complete the email flow yourself, sign in, send/complete email verification, and enroll an authenticator. The setup secret and QR code are displayed only during enrollment; do not put them in screenshots or logs.
9. After enrollment, sign out and sign back in with the authenticator challenge. Enrollment alone does not count as an MFA-verified session.
10. Add the other officers from **Officer team**. They start as editors; an admin can promote or deactivate another officer. Invitations require an admin to have signed in within the last 15 minutes. Existing Auth accounts are not automatically adopted by the invitation endpoint; a project owner must verify their UID before approving them manually.

## Permission model

`officers/{firebaseAuthUid}` contains exactly `name`, `email`, `role` (`editor` or `admin`), and `active` (boolean). Officers may read their own approval record before MFA so enrollment can work, but that does not permit content access.

An officer must satisfy all of these for every content write:

- Signed-in Firebase user with verified email.
- ID token reports `firebase.sign_in_second_factor == 'totp'`.
- An active officer record exists for the exact UID.

Public readers can query only `status == 'published'` content. Drafts and archives require approved officer access. Editors can create/edit/publish/archive content; admins can additionally manage other officers. Clients cannot grant themselves a role or deactivate themselves. Content creation metadata cannot be rewritten. Delete is disabled; archiving hides the item without discarding it.

Deactivation is checked against Firestore on each protected request, including requests made with an existing token. The admin invitation endpoint additionally verifies revoked tokens and checks the officer’s current admin record. No role is trusted from browser storage, a URL, or a hidden button.

## Content supported

| Kind         | Public destination                                                        |
| ------------ | ------------------------------------------------------------------------- |
| Event        | Homepage and Events page; upcoming items are ordered by their stored date |
| Announcement | Homepage                                                                  |
| Resource     | Homepage and Resources hub                                                |
| Form         | Forms page, alongside existing forms                                      |

The editor supports title, description, category, date/time, location, HTTPS details/RSVP URL, HTTPS image URL, and status. Dates entered in the officer’s device timezone are normalized to ISO UTC, then shown in America/Chicago on the public site. Image uploads and automatic Instagram synchronization are not implemented; use an existing hosted HTTPS image. Existing roster, sponsor, guide, glossary, election, and CS Week content remains source-managed.

## Recovery and operations

- Forgotten password: use Firebase’s reset-email flow.
- Lost authenticator: project owner must independently verify the officer’s identity, revoke sessions, and reset the factor using trusted Firebase administration. The public app intentionally offers no MFA bypass.
- Departing officer: deactivate their officer record promptly; revoke Auth refresh tokens if appropriate.
- Do not change the site’s production domain or original ACM deployment until the content owner accepts the redesign and production login has been verified.

## Verification performed

Content validation tests and 12 emulator-backed Firestore rule tests cover public/draft separation, unapproved accounts, missing MFA, wrong second-factor type, unverified email, valid officer editing, role escalation, deactivation, immutable authorship, unsafe URLs, unknown collections, and deletion denial. Real email delivery, live account creation, authenticator enrollment/challenge, and production publishing remain unverified until administrator onboarding is completed. Cloud setup was verified using Google Cloud Shell with the user’s approved account authorization, without creating or downloading a service-account key.
