# Calendar and photo refinements

The subsequent visual pass adds a campus poster direction: oversized condensed and italic type, citrus orange, lime and lavender panels, a hand-drawn hero mark, postcard photo frames, and colored program/resource cards. The interactive agenda, month view, search, and slideshow controls are preserved. Styles include light/dark, reading-mode, high-contrast, reduced-motion, and mobile adjustments. Local browser rendering remains unverified because the available browser process cannot launch in this session.

This branch starts from the complete November 9 working source, including the interactive calendar and previously uncommitted chapter features. The first commit preserves that snapshot. The November 26 makeover and its older November 2 rollback are not the starting point.

The agenda remains the default view. Click an event for details, or switch to Month and select a date. Search matches event titles, descriptions, and locations. The month grid supports arrow keys and Home/End; Today returns to the Austin date. Calendar subscriptions continue to use the chapter's Google Calendar. Empty states use the real feed rather than placeholder events.

Homepage photos now have direct selection and pause controls. Keyboard focus pauses automatic changes. Automatic playback respects reduced motion and reading mode.

The changes live in a separate working copy so the original November 9 directory stays intact.

## Open locally

```sh
cd /Users/tanishchauhan/Documents/Codex/2026-11-26/new-chat-5/texas-acm
npm run dev -- --port 3003
```

Open http://localhost:3003. Use the development command to see the current source rather than an older production build. Dependencies and local environment configuration are linked to the original checkout on this Mac. Development uses `.next-dev` and production builds use `.next`, so build checks do not overwrite a running development server’s output. After changing this setting, stop the existing development process with Control-C and restart it.

## Verification

- Production build and TypeScript checks.
- Application tests, including Austin date boundaries, DST, leap years, month/year navigation, exclusive event end dates, and events spanning months.
- Run tests in this restricted environment with `npm test -- --configLoader runner` to avoid a temporary configuration write in the linked dependency directory.
- Existing image optimization and hook dependency warnings remain in inherited components.
- Interactive browser verification is pending: this session blocks listening on local ports. No live preview or deployment is claimed.

The current agenda and month views show upcoming events from the feed's existing 180-day window; the month controls are not an archive of past chapter events.
