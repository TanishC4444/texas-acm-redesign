# Texas ACM Redesign

**Work in progress.** A working fork of [texasacm/website](https://github.com/texasacm/website) with a chapter website, interactive calendar, resource directory, officer tools, and Firebase-backed content. This fork is under development and is not the official Texas ACM deployment.

## Run locally

Requires Git, Node.js 22+, and npm.

```sh
git clone https://github.com/TanishC4444/texas-acm-redesign.git
cd texas-acm-redesign
npm ci
npm run dev
```

Open <http://localhost:3000>, or the URL Next.js prints if that port is busy. Stop with Ctrl+C. Development uses `.next-dev` so it does not overwrite the production build.

## Configure connected features

Copy `.env.example` to `.env.local` for Firebase and other integrations. Public pages can be explored before enabling officer tools; those tools need a configured Firebase project, authorized staff identity, and matching database/storage rules. The calendar can use its public feed without a private Calendar API key.

Use the variable names and comments in `.env.example`. Keep service-account JSON, Instagram tokens, and other privileged settings server-side. Do not commit `.env.local` or production records.

## Check your setup

```sh
npm run typecheck
npm test
npm run build
```

For Firestore and Storage rule checks, also install Java 21+:

```sh
npm run test:rules
```

The reconciled code passed TypeScript, 55 application tests, 25 emulator rule tests, and a production build. Emulator tests use synthetic identities. Image and hook lint warnings remain; these results do not establish production staff access or a finished launch.

If officer tools report missing configuration, check `.env.local` and restart the development server. For a production-style local preview, run `npm run build` followed by `npm start`.

## Development references

[Branch reconciliation](docs/BRANCH-RECONCILIATION.md) preserves the officer/backend work and newer calendar improvements. The reverted makeover stays reverted. [Earlier design notes](docs/project-guide.md) and [an earlier branch capture](docs/acm-branch-preview.jpg) are historical references, not screenshots of the current reconciled interface.
