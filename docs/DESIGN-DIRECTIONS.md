# Texas ACM design directions

[Editable Figma file](https://www.figma.com/design/urVxzjuJu8GHY8J37FgWBA) · [Instagram reference](https://www.instagram.com/texas_acm/)

## 01 — Campus Studio

The primary website direction at `/`: mint green, cream paper, deep green ink, and warm orange. Oversized DM Sans pairs with Instrument Serif. The community photo is treated as a retro desktop window; small editorial labels, a moving typographic ribbon, photo collage, and three distinct activity panels build on the visual language of ACM’s recent posts.

## 02 — After Hours

The alternate homepage at `/designs/night`: dark green/ink surfaces, electric mint emphasis, and warm orange. It retains the same content and functions so the palette and mood can be compared directly. The shared site header/footer remain the primary Campus Studio treatment.

The comparison page is `/designs`. Figma contains editable desktop explorations for both directions plus officer login and content-studio screens. It is an exploration file, not a claim that every migrated interior page has been independently designed in Figma.

## Source grounding

Reviewed the public `@texas_acm` grid on November 1, 2026. Visible posts included the All About ACM design, a collage/map treatment, retro-window technical workshop graphics, Personal Portfolio Creation, and the FAM interest form. The common themes were soft greens, cream, editorial type, playful windows, and collage. The website’s imagery uses existing ACM source-repository photos, not a scraped or automatically synchronized Instagram feed.

The work preserves membership, events, student resources, forms, sponsorships, officer profiles, election, and CS Week routes. The shared header/footer replaces repeated navigation, desktop Resources is keyboard/click accessible, A-to-Z gains search, and an officer-published content stream supplements source-managed pages.

## Motion and accessibility

The moving ribbon, hover treatments, and decorative graphics respect `prefers-reduced-motion`. Text content remains HTML rather than a rasterized design. New navigation has meaningful labels and expanded state, and all decorative imagery is separated from essential text. Mobile and desktop still require human acceptance before the original site is replaced.

## Working website previews

### Campus Studio

![Campus Studio desktop](redesign/campus-studio-desktop.jpg)

### After Hours

![After Hours desktop](redesign/after-hours-desktop.jpg)

### Mobile

![Campus Studio mobile](redesign/campus-studio-mobile.jpg)

### Officer entry while Firebase setup is blocked

![Officer workspace setup state](redesign/officer-workspace-entry.jpg)

## Current direction: Alternate Universe

The homepage now uses a new maximalist direction, rather than the earlier split-column Campus Studio composition. A centered, oversized TEXAS ACM wordmark sits among floating archive photos and orbital graphics. Subsequent sections shift between oversized editorial typography, asymmetrical arched photo portals, live officer content, a draggable photo wall, a circular toolkit graphic, and a violet invitation panel. Palette: paper, near-black, acid green, violet, and peach.

Motion: timed, skippable first-visit intro with replay; CSS float/rotation; scroll-linked parallax; viewport entrance reveals; marquee; hover reactions; direct-manipulation photo dragging/reset; route loading and page entrances. Ambient motion can be paused; reduced-motion preferences disable automatic motion. The intro is a brand sequence, not a measure of network loading. The photo wall is temporary browser interaction and does not modify source photos or officer content.

The Figma file still documents the two earlier concepts. This new direction is implemented in code; it has not yet been mirrored into Figma. Earlier homepages remain at `/designs/studio` and `/designs/night`.
