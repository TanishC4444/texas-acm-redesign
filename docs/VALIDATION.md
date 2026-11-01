# Redesign validation

Reviewed November 1, 2026.

- TypeScript check: passed.
- Content validation: 9 tests passed.
- Firestore Security Rules: 12 emulator-backed tests passed using the `demo-texas-acm` project. These used a local emulator, not the user’s live projects.
- Production build: verified with `npm run build -- --no-lint`. Lint was not part of this validation; TypeScript checks were enabled. Existing silent TypeScript build-error suppression was removed.
- Production dependencies: no high or critical advisories after compatible updates/overrides. Moderate advisories remain and should be reviewed before production launch.
- Editable Figma concepts: two desktop directions, officer login, and an empty content-studio screen. Confirmed editable text/layers and original community photo fills; no complete-UI screenshot is used as the design’s underlying layer. Product typography is DM Sans and Instrument Serif. The temporary code-capture reference was removed after comparison.
- Browser preview: desktop homepage reviewed; mobile viewport checked for horizontal overflow. Mobile navigation open/Escape behavior, a CS A–Z search for “terminal” (7 matching terms), officer setup state, and refreshed About page were checked in the browser. All 16 public content/design/officer routes returned HTTP 200; unauthenticated POST to the officer invitation API returned 401.

## Not yet verified live

Firebase project creation was blocked by the account’s project quota. Therefore actual email delivery, new-officer provisioning, production TOTP enrollment/challenge, and live content publishing could not be exercised. No existing Firebase project, billing plan, or original Texas ACM deployment was modified. The workspace fails closed when unconfigured.

## Launch requirements

Resolve the Firebase project quota, configure the separate ACM project and TOTP provider, deploy the rules, bootstrap an approved admin, and test the complete sign-in/edit/publish path with that real account. Review both design directions and the content with the ACM team before replacing the current site.
