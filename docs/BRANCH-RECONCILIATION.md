# Branch reconciliation

The calendar working tree is the functional successor of the officer runtime: a whole-tree comparison found no officer-only source files absent from it. Its differences add calendar/date handling, focus behavior, system contrast and visual refinements. A merge resolved the overlapping additions in favor of that reviewed successor, with both parents retained.

| Source | Preserved working-tree commit | Outcome |
|---|---|---|
| Calendar copy, including 25 uncommitted files | 503bf60 | Active runtime |
| Officer copy, including 99 uncommitted files | cdfd4e1 | Merged ancestry; backend, API, Firestore and Storage behavior retained |
| Professional branch after its explicit revert | 14bdf16 | History merged; reverted makeover was not reinstated |
| Default branch cleanup | Parent of this merge | Current documentation retained and updated |

Validation: 55 application tests, 25 security-rule tests, TypeScript and production build passed. No live Firebase staff data, invitations, photos or permissions were changed. Existing local settings remain local and ignored.
