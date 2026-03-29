# Contributing Guide (Developers)

Thanks for contributing to the Seoul Design Group website.

This document is for developers working on the Astro codebase, content system, and UI behavior. If you're looking for TODOs to work on, check out the Issues page or ask maintainers for guidance.

## Tech stack

- Astro (`astro@^6`)
- TypeScript (strict config via `astro/tsconfigs/strict`)
- Tailwind CSS v4 (via Vite plugin)
- Biome (formatter + linter)
- Bun (package manager / script runner)

## Prerequisites

Before you start, install:

- Bun

Then from project root:

- `bun install`

## Development commands

- `bun dev` — run local dev server
- `bun build` — run Biome check/write + Astro production build
- `bun preview` — preview built site
- `bun lint` — run Biome check/write only
- `bun astro ...` — run Astro CLI directly

## Project structure (high level)

- `src/pages/` — route entry points
- `src/layouts/` — page/layout wrappers
- `src/components/` — reusable UI components
- `src/utils/` — utilities (`getPath`, OG generation, sorting, slug helpers, etc.)
- `src/styles/` — global styles
- `src/content.config.ts` — Astro content collections and schema rules
- `src/data/events/` — event markdown content + event images
- `src/data/contributors/` — contributor JSON records
- `public/` — static public assets

## Path aliases

Use aliases from `tsconfig.json` instead of long relative imports when possible:

- `@/components/*`
- `@/layouts/*`
- `@/utils/*`
- `@/assets/*`
- `@/config`
- `@/content.config`
- etc.

## Formatting and linting

Biome is the source of truth.

Current style highlights from `biome.json`:

- indentation: tabs
- JavaScript/TypeScript quotes: double quotes
- organize imports: enabled (except overridden for `.astro`)
- recommended lint rules enabled

Run before opening a PR:

- `bun lint`
- `bun build`

If `bun build` fails, fix all schema/type/lint errors before requesting review.

## Content model rules (important)

The website depends on Astro Content Collections in `src/content.config.ts`.

### Collections

- `contributors` from `src/data/contributors/**/*.json`
- `events` from `src/data/events/**/[^_]*.md` (files starting with `_` are excluded)

### `contributors` schema

Required:
- `name: string`

Optional:
- `link: http(s) URL`

### `events` schema

Required:
- `title: string`
- `type: "meetup"`
- `date: coerce.date()`
- `authors: reference("contributors")[]`

Optional:
- `cover: image`
- `photographers: reference("contributors")[]`
- `location: string`
- `mapLink: http(s) URL`

### Event folder conventions in this repo

Current implementation expects date-based folders and image convention:

- `src/data/events/YYYYMMDD/index.md`
- `src/data/events/YYYYMMDD/images/*.{jpeg,jpg,png,webp,avif}`

The image gallery component uses a glob that assumes this folder shape.  
If you change folder patterns, update both content/docs and relevant component logic.

## Routing and path behavior

Event URLs are generated with `src/utils/getPath.ts` and used by:

- event listing cards
- event detail route static paths
- OG image route static paths

If you modify slug/path logic, verify:

- event page routes
- links in cards and breadcrumbs
- generated OG endpoints (`/events/.../index.png`)

## OG image generation

Event OG images are generated at build time via:

- `src/pages/events/[...slug]/index.png.ts`
- `src/utils/generateOgImages.ts`
- `src/utils/og-templates/event.ts`

When changing metadata structure or event data fields, confirm OG generation still works in `bun build`.

## Working with Astro components

- Keep component responsibilities focused and small.
- Prefer typed `Props` in `.astro` frontmatter.
- Avoid introducing unnecessary client-side JS; keep pages mostly static unless interaction is needed.
- For client scripts inside `.astro`, ensure behavior is resilient across Astro page transitions (`astro:page-load`).

## Performance and accessibility

Please preserve or improve:

- semantic HTML structure
- keyboard accessibility (especially modal/lightbox interactions)
- alt text and image handling where applicable
- reasonable bundle behavior (avoid heavy dependencies unless justified)

## Recommended contribution workflow

1. Sync with latest default branch.
2. Create a feature/fix branch.
3. Make focused, minimal changes.
4. Run:
   - `bun lint`
   - `bun build`
5. Validate affected pages in `bun dev`.
6. Open PR with clear summary and screenshots for UI changes.

## Pull request checklist

Before requesting review, confirm:

- [ ] Change is scoped and intentional
- [ ] No unrelated refactors mixed in
- [ ] Lint/format passes (`bun lint`)
- [ ] Production build passes (`bun build`)
- [ ] Content schema compatibility preserved (if touching content code)
- [ ] Routes/links still work (if touching path logic)
- [ ] Screenshots/GIF added for visual changes
- [ ] Docs updated (`README.md` and/or this file) when behavior changes

## Commit message guidance

Use clear, action-oriented messages.  
Examples:

- `feat(events): improve event gallery layout logic`
- `fix(content): validate contributor references in event posts`
- `docs: update maintainer instructions for event publishing`

## What to document when changing behavior

If your change affects maintainers (non-developers), update:

- `README.md` (content publishing workflow)
- any templates/examples for event frontmatter
- this `CONTRIBUTING.md` if developer workflow changes

## Security and secrets

- Never commit API keys or secrets.
- `.env` files are ignored; keep sensitive values local.
- If adding integrations that require secrets, document required env vars in docs and provide a safe `.env.example` pattern.

## Need help?

If a change impacts schema, routing, or content conventions, include notes in your PR explaining migration steps so maintainers can update content safely.
