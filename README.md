# STUDIO

Portfolio website for a digital product / creative technology studio.

> **Naming note:** "STUDIO" is a placeholder brand name used throughout the codebase.
> It lives in one place — `data/site.ts` — so renaming the brand is a one-file change.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/) for motion design
- [Lucide](https://lucide.dev) icons
- [Supabase](https://supabase.com) — prepared, optional (see below)
- Deploys on [Vercel](https://vercel.com)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content

All content ships from typed local data files — no database required to run the site:

- `data/site.ts` — brand name, tagline, contact links, stats
- `data/projects.ts` — the six case studies (source of truth for `/work/[slug]`)
- `data/services.ts` — services, process steps, technology list
- `data/team.ts` — founders and testimonials (testimonials section auto-hides when empty)

Project screenshots go in `public/projects/` — see the README there for filenames.

## Supabase (optional CMS path)

The site does **not** require Supabase to run. `supabase/schema.sql` defines the tables
(`projects`, `project_images`, `services`, `testimonials`, `team_members`, `site_settings`)
for a future migration off the local data files. `lib/supabase.ts` exposes a client that
activates once the env vars below are set — swap the reads in `data/*.ts` for Supabase
queries when you're ready to add a CMS/admin.

## Environment variables

Copy `.env.example` to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Both are optional in v1.

## Project structure

```
app/                  routes (home, /work/[slug], sitemap, robots)
components/ui/        design-system primitives (Container, RevealText, MagneticLink…)
components/sections/  page sections (Hero, SelectedWork, Services, Process, About…)
components/work/      case-study/work-grid components
data/                 typed local content
lib/                  Supabase client
types/                shared TypeScript types
supabase/schema.sql   future CMS schema
```

## Scripts

```bash
npm run dev     # local dev server
npm run build   # production build
npm run start   # run the production build
npm run lint    # eslint
```

## Deploy

Push to GitHub and import into Vercel — no configuration required for v1 (Supabase env
vars are optional). Framework preset: Next.js.
