# Seoul Design Group Website – Maintainer Guide

Welcome! This guide is for Seoul Design Group maintainers, especially if you're a designer and not a full-time developer.

You'll use this guide to:
- Publish new event posts
- Update contributors
- Keep the site content healthy over time
- Avoid common formatting mistakes that break builds

---

## 1) Quick start (non-technical version)

If you want to add an event post but don't want to read the whole guide, follow this checklist:

- [ ] Fork the repository, and then clone it.
- [ ] Add/update contributor files in `src/data/contributors/`.
- [ ] Create a new event folder in `src/data/events/YYYYMMDD/`.
- [ ] Add `index.md` with correct frontmatter fields.
- [ ] Put event photos in `images/` inside that event folder.
- [ ] Run `bun dev` to preview.
- [ ] Run `bun build` to catch errors before submitting a Pull Request.
- [ ] Push the changes to your forked repository.
- [ ] Create a Pull Request to the main repository.
- [ ] Ask one of the maintainers to review and merge.

---

## 2) Requirements: Bun

This project uses **Astro** and **Bun**.

- Package manager / scripts: [**Bun**](https://bun.com/)

### Setup commands

Run these in the project root:

- `bun install` — install dependencies
- `bun dev` — start local development server
- `bun build` — run formatting/lint checks + production build
- `bun preview` — preview production build locally
- `bun lint` — run Biome checks/fixes (makes sure that there are no unnecessary code changes)

---

## 3) Project folders you'll use most

### `src/data/events`
This is where event posts live.

Each event has its own date-based folder:

- Example: `src/data/events/20260320/`
- Main post file: `index.md`
- Event images folder: `images/`

Typical structure:

- `src/data/events/20260320/index.md`
- `src/data/events/20260320/images/...`

### `src/data/contributors`
This stores contributor profiles as JSON files.

- One person per file
- Filename becomes that person's **ID** (used in event `authors` / `photographers`)
- Example file: `src/data/contributors/ines-gruhier.json`
- Contributor ID used in event frontmatter: `ines-gruhier`

---

## 4) Content schema (must follow exactly)

This project validates content using Astro collections (`src/content.config.ts`).  
If fields are wrong, the build fails.

## Event frontmatter fields (`src/data/events/**/index.md`)

Required:
- `title`: string
- `type`: must be `meetup`
- `date`: date (recommended format: `YYYY-MM-DD`)
- `authors`: array of contributor references

Optional:
- `cover`: image path (this is used in the event's OG image)
- `photographers`: array of contributor references
- `location`: string
- `mapLink`: valid `http://` or `https://` URL

## Contributor JSON fields (`src/data/contributors/*.json`)

Required:
- `name`: string

Optional:
- `link`: valid `http://` or `https://` URL

---

## 5) Naming & structure conventions

Follow these conventions used in this repo:

1. **Event folder name = date**
   - Format: `YYYYMMDD`
   - Example: `20260320`

2. **Main event file is always `index.md`**
   - Example: `src/data/events/20260320/index.md`

3. **Event photos go inside `images/`**
   - Example: `src/data/events/20260320/images/photo-01.jpg`

4. **Auto-loaded event images pattern**
   - Event photos are auto-loaded from:
   - `/src/data/events/*/images/*.{jpeg,jpg,png,webp,avif}`

5. **Contributor ID = filename (without `.json`)**
   - `src/data/contributors/oscar-sjostrand.json` → ID is `oscar-sjostrand`

---

## 6) Step-by-step: publish a new event

## Step 1 — Add or check contributors

Before writing the event, make sure everyone listed in `authors` and `photographers` has a JSON file in `src/data/contributors/`.

Use this template:

```seoul-design-group-website/src/data/contributors/new-person-id.json#L1-4
{
  "name": "Full Name",
  "link": "https://example.com/profile"
}
```

Notes:
- `name` is required.
- `link` is optional.
- If you include `link`, it must be a valid `http`/`https` URL.
- Keep filename lowercase and hyphenated (example: `jane-doe.json`).

Checklist:
- [ ] Every person in `authors` exists as a contributor file
- [ ] Every person in `photographers` exists as a contributor file
- [ ] Contributor IDs in event file exactly match filenames

---

## Step 2 — Create a new event folder + `index.md`

Create:

- `src/data/events/YYYYMMDD/index.md`
- `src/data/events/YYYYMMDD/images/`

Example for March 20, 2026:
- `src/data/events/20260320/index.md`
- `src/data/events/20260320/images/`

---

## Step 3 — Add valid frontmatter

Copy-paste this and replace values:

```seoul-design-group-website/src/data/events/YYYYMMDD/index.md#L1-20
---
title: Your Event Title
cover: ./images/cover.jpg
type: meetup
date: 2026-03-20
authors:
  - ines-gruhier
photographers:
  - oscar-sjostrand
location: Event Venue Name
mapLink: https://maps.app.goo.gl/example
---

Write your event recap or announcement here.
```

Important:
- `type` must be exactly `meetup`
- `authors` must be an array (at least one contributor ID)
- `date` should be `YYYY-MM-DD`
- `cover` is optional (remove if not needed)
- `photographers` is optional (remove if not needed)
- `mapLink` must start with `http://` or `https://` if used

---

## Step 4 — Add body content in Markdown

After the frontmatter, write your event content in normal Markdown.

You can include:
- Paragraphs
- Headings
- Links
- Lists
- Quotes

Tip for readability:
- Start with a short summary
- Add highlights
- End with next steps / upcoming event note

---

## Step 5 — Add images (and optional cover)

Put event photos in the event's `images/` folder.

Supported extensions:
- `.jpeg`
- `.jpg`
- `.png`
- `.webp`
- `.avif`

If using `cover`, point to a file that exists, usually:
- `cover: ./images/cover.jpg`

Checklist:
- [ ] Images are inside the correct event folder
- [ ] Extension is supported
- [ ] `cover` path exactly matches filename

---

## Step 6 — Run local preview commands

From project root:

1. Install deps (first time / after updates)
   - `bun install`

2. Start local dev
   - `bun dev`

3. Run full build check before deploy
   - `bun build`

4. Optional local production preview
   - `bun preview`

5. Optional lint-only pass
   - `bun lint`

If `bun build` passes, your content is usually safe to ship. After building, make sure to `bun preview` to see the final production version locally and everything looks good.

---

## 7) Copy-paste templates

## Contributor template

```seoul-design-group-website/src/data/contributors/example-person.json#L1-4
{
  "name": "Example Person",
  "link": "https://example.com"
}
```

## Event template (minimal required)

```seoul-design-group-website/src/data/events/YYYYMMDD/index.md#L1-14
---
title: Event Title
type: meetup
date: 2026-04-01
authors:
  - example-person
---

Write your event content here.
```

## Event template (full version)

```seoul-design-group-website/src/data/events/YYYYMMDD/index.md#L1-22
---
title: Event Title
cover: ./images/cover.jpg
type: meetup
date: 2026-04-01
authors:
  - example-person
photographers:
  - example-photographer
location: Venue Name
mapLink: https://maps.google.com/example
---

## What happened

Share the story, highlights, and photos.

## Who joined

Mention participants, talks, demos, and outcomes.
```

---

## 8) Troubleshooting (common mistakes)

If build fails, check these first:

1. **Wrong contributor ID**
   - Symptom: reference/content error
   - Fix: ensure IDs in `authors` / `photographers` match JSON filenames exactly

2. **Invalid URL**
   - Symptom: schema URL validation error
   - Fix: `link` and `mapLink` must be full `http://` or `https://` URLs

3. **Wrong date format**
   - Symptom: date parsing/schema error
   - Fix: use `YYYY-MM-DD` (example `2026-03-20`)

4. **Missing required fields**
   - Event must include: `title`, `type`, `date`, `authors`
   - Contributor must include: `name`

5. **Wrong image path**
   - Symptom: cover image/content error
   - Fix: make sure `cover` points to a real local image, usually `./images/filename.ext`

6. **Unsupported image extension**
   - Use only: `jpeg`, `jpg`, `png`, `webp`, `avif`

7. **`type` is not `meetup`**
   - Must be exactly:
   - `type: meetup`

---

## 9) Ongoing maintenance checklist

Use this regularly (for example once a week, and before deploy):

- [ ] Confirm newest event post is published and formatted correctly
- [ ] Verify contributor names/links are still accurate
- [ ] Update any "upcoming events" links/text if related content changed
- [ ] Review About page copy for outdated descriptions
- [ ] Run `bun build` before deploying
- [ ] Spot-check key pages locally with `bun dev` or `bun preview`

---

## 10) Recommended content quality habits

- Keep titles short and clear
- Use one folder per event date
- Add at least one good cover image when available
- Credit photographers via `photographers`
- Keep writing human and friendly (not overly formal)
- Always run build checks before merging/deploying

---

## 11) When to edit `src/content.config.ts`

Usually: **don't edit it** for normal posting.

Only edit `src/content.config.ts` if you intentionally want to change the content model (for example, adding new frontmatter fields site-wide).  
If you do, test with `bun build` immediately.

If you follow this guide, you can confidently maintain event content without needing deep Astro knowledge.


---

You can maintain this site confidently by following this guide — no deep Astro knowledge required.
