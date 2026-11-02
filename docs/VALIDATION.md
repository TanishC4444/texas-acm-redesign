# Redesign validation

Reviewed November 1, 2026.

- TypeScript check: passed.
- Content validation: 9 tests passed.
- Firestore Security Rules: 12 emulator-backed tests passed using the `demo-texas-acm` project. These used a local emulator, not the user’s live projects.
- Production build: verified with `npm run build -- --no-lint`. Lint was not part of this validation; TypeScript checks were enabled. Existing silent TypeScript build-error suppression was removed.
- Production dependencies: no high or critical advisories after compatible updates/overrides. Moderate advisories remain and should be reviewed before production launch.
- Editable Figma concepts: two desktop directions, officer login, and an empty content-studio screen. Confirmed editable text/layers and original community photo fills; no complete-UI screenshot is used as the design’s underlying layer. Product typography is DM Sans and Instrument Serif. The temporary code-capture reference was removed after comparison.
- Browser preview: desktop homepage reviewed; mobile viewport checked for horizontal overflow. Mobile navigation open/Escape behavior, a CS A–Z search for “terminal” (7 matching terms), officer setup state, and refreshed About page were checked in the browser. All 16 public content/design/officer routes returned HTTP 200; unauthenticated POST to the officer invitation API returned 401.

- Live Firebase smoke check: anonymous published-content query succeeded (0 items); anonymous officer-list access returned `permission-denied`, as intended.

## Not yet verified live

The separate Firebase project `texas-acm-1bb6b` and its web app were created on the newly selected account. Email/password, Identity Platform, TOTP, and email enumeration protection are enabled. The default Firestore database is in `nam5`; repository rules were deployed and read back to verify an exact source match. The first administrator was created and their active admin approval record read back successfully. The project remains on Spark. Browser configuration is stored locally in ignored `.env.local`, and the connected officer login page was verified in-browser. Actual password-reset delivery, email verification, production TOTP enrollment/challenge, and live content publishing remain unverified pending user onboarding. Production hosting and the server identity for invitations remain unconfigured. The original Texas ACM deployment was not modified.

## Launch requirements

Complete password setup, email verification, and authenticator enrollment for `tanishchauhan@utexas.edu`, then test the complete sign-in/edit/publish path with that real account. Configure production hosting and its server identity for invitations. Review both design directions and the content with the ACM team before replacing the current site.

## Alternate Universe revision

- New centered collage homepage, six archive photos, new design comparison entry, global route-loading screen, and page entrances.
- Mobile browser reviewed at 390 × 844: document width equals viewport width; no failed loaded images.
- Motion pause verified against computed marquee animation state. Pausing reveals all content immediately, including sections not previously viewed.
- Photo dragging verified by pointer interaction and resulting translation; reset restores the wall.
- Desktop hero, mobile hero, photo wall, and intro screenshots saved under `docs/redesign/`.
- This revision does not change Firebase authentication or officer permissions. Password/2FA onboarding and production hosting remain as documented above.

## Chapter identity and Instagram revision

- Original primary and white SVG logo files are unchanged and now used in header/hero/footer/intro.
- Self-hosted Barlow Condensed, IBM Plex Mono, and Archivo fonts added with OFL licenses; Pagkaki retained as the handwritten accent.
- Four Instagram normalization tests pass: date ordering, video thumbnails, invalid records, unsafe URLs/deceptive domains, response field stripping, caption limits, and six-item limit.
- Unconfigured `/api/instagram` returns only `{"status":"unavailable","posts":[]}` and the homepage shows a direct Instagram fallback.
- Live Instagram authorization, feed rendering with actual chapter posts, and publication-to-feed timing remain unverified because another officer controls the chapter account.

- Chapter revision production build passed with lint skipped; TypeScript passed after the final intro-timer/keyboard changes. All 13 content/Instagram tests pass.
- Chapter logo reveal replay and Escape-to-skip verified in browser. Mobile document width equals the 390-pixel viewport width. Original logo files have no diff.
- Chapter screenshots: `docs/redesign/chapter-desktop.jpg`, `chapter-mobile.jpg`, and `chapter-logo-reveal.jpg`.

## Chapter Space revision

- Scene switching verified on mobile for People, Events, Toolkit, Connect, and Chapter; selected ARIA tab state updates.
- Desktop at 1280 × 900 and mobile at 390 × 844: homepage document dimensions match the viewport, without horizontal overflow or a trailing vertical homepage scroll.
- Vivid and Blueprint filter selections verified against computed image filters. Original logo images are excluded from filters.
- Light/dark switching and the transition reviewed in browser. Theme persists across navigation; About and Officer pages reviewed in dark mode.
- Shared photo/glass page heroes added across the primary informational routes; global inline italic emphasis removed.
- Embedded calendar verified live: the public Texas ACM Events agenda rendered real chapter events. Escape closes the panel. No event was added or changed.
- Dialogs include close controls, Escape support, focus containment, and focus return. Scene tabs include arrow/Home/End keyboard controls. Intro bypass and ambient-animation disabling are implemented for reduced-motion preferences.
- CSS perspective drives the 3D effect; no WebGL dependency or stock/generated depiction of chapter members was added.
- Firebase permissions, admin provisioning, and Instagram authorization requirements remain unchanged.

- Production build and TypeScript checks pass (lint skipped). All 17 public/design/officer page routes returned HTTP 200 in the production smoke check; unauthenticated officer provisioning still returns HTTP 401.
- The development status badge is disabled through the supported Next.js configuration so it cannot cover the mobile dock. Runtime error reporting remains available.
- Screenshots: `docs/redesign/space-dark.jpg`, `space-light.jpg`, `space-mobile.jpg`, `space-about-dark.jpg`, and `space-calendar.jpg`.

## Vertical computing-machinery revision

- Replaced the scene-based homepage with a vertical layout and removed the glass dock, scene controls, floating rings, and CSS 3D cards from the active UI.
- Expanded the original-logo opening to four seconds, with eight slice assemblies, circuit traces, four shutters, and a perspective-to-flat transition. Original SVG logo files remain unchanged.
- Desktop and mobile reviewed in browser; mobile document width equals the 390-pixel viewport. No glass dock or scene switcher is present, and computed inline italic text count is zero.
- Embedded live Google Calendar, approved-officer content feed, newsletter signup, Discord, email, and Instagram integration/fallback retained. No messages were sent and no calendar data was edited during verification.
- TypeScript and production build pass with lint skipped. Firebase rules/authentication and Instagram API logic are unchanged.
