# Texas ACM makeover — November 26, 2026

## What changed

A shared paper/forest/orange design system now connects the public pages, replacing the homepage’s icon-only floating navigation with a labeled sticky header. The homepage has a clear text introduction, chapter photography, linked industry/academics/community cards, a static partner grid, a calendar with explicit loading/empty/failure states, direct student-resource links, and a shared chapter footer. Search and display settings remain available in the header. Event sign-in and officer login are in the footer.

Real chapter photography is retained. Effects use brief entrances, small image zooms, and responsive Motion hover behavior; no blocking introduction or continuous logo ticker. Site controls and OS reduced-motion preferences are respected. Light, dark, high-contrast, enlarged text, keyboard focus, and mobile layouts have explicit styling. Existing officer permissions, Firebase content/photo editing, and analytics are preserved.

## Functional corrections

- Calendar DATE and floating ICS values are interpreted in America/Chicago, rather than in the server timezone.
- Week grouping compares Austin date keys directly and handles Sunday near UTC midnight.
- A failed calendar fetch can be retried without reloading the page.
- Server-rendered calendar data is not presented against an uninitialized 1970 clock.
- Shared runtime time updates run every 30 seconds instead of rerendering all consumers every second.
- Page introductions display their supplied descriptions again.

## References and implementation choices

Impeccable’s critique/polish workflow, Taste Skill’s emphasis on client photography and a coherent system, Siteinspire’s editorial hierarchy, and Awwwards/Recent/Hoverstat.es visual references informed the design. React Bits informed restrained reveal patterns. Motion is already a dependency and handles the hero interaction; CSS handles progressive enhancement and image effects, following reduced-motion guidance. GSAP, Spline, and Unicorn Studio are alternative tools, not additional runtimes this interface needs. No paid services, generated people, stock event photographs, or third-party scene embeds were added. All chapter photographs come from the existing project.

## Run

```sh
npm ci
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Use Node 22 or later. Use the existing ignored `.env.local` configuration, or copy `.env.example` and configure the required integrations. Never commit secrets.

```sh
npm test
npm run typecheck
npm run build
npm start -- --hostname 127.0.0.1 --port 3000
```

## Verification and limits

The production build and TypeScript check passed. The application test suite passes 47 assertions, including new all-day/floating time and Sunday-boundary regression cases. Build warnings include existing image-optimization and hook-dependency warnings; the build is successful, not warning-free. No Firebase rules or authorization policies were changed by this makeover.

Live local server ports are denied in this execution environment. The in-app browser also rejected file-protocol navigation, so visual browser checks, keyboard interaction checks, mobile screenshots, and an end-to-end authenticated publishing test have not been completed. The optional `review/prepare-preview.py` script derives read-only offline visual snapshots from the actual Next build, with scripts removed; those snapshots are not integration tests.

Before launch, review desktop/mobile layouts in a running browser, confirm Google Calendar and Instagram configuration, and complete verified-email/TOTP administrator onboarding and an authorized publishing check. Existing production hosting and invitation-server identity still require configuration; see OFFICER-SETUP.md and INSTAGRAM-SETUP.md. Do not claim that a local build changes texasacm.org or proves live integration health.
