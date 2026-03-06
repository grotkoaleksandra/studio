# CLAUDE.md - Studio (Creative Agency Portfolio)

This file provides context for Claude (AI assistant) when working on this codebase.
See `CLAUDE.local.md` for credentials and environment-specific configuration.

> **IMPORTANT: You have direct database access!**
> Always run SQL migrations directly using `psql` or the Management API - never ask the user to run SQL manually.

> **IMPORTANT: Push changes immediately!**
> This is a GitHub Pages site - changes only go live after pushing.
> Always `git push` as soon as changes are ready.

## Project Overview

Studio is a portfolio website for a creative agency showcasing projects. It manages projects, team members, categories, and contact submissions.

**Tech Stack:**
- Frontend: Next.js 16 (React 19, TypeScript, Tailwind CSS v4)
- Static Pages: Vanilla HTML/JS with Tailwind CSS v4 CLI
- Backend: Supabase (PostgreSQL + Storage + Auth)
- Hosting: GitHub Pages (static export)
- Auth: Google OAuth via Supabase
- Email: Resend
- AI: Google Gemini
- Object Storage: Cloudflare R2

**Live URLs:**
- Public site: https://grotkoaleksandra.github.io/studio/
- Supabase: https://dcxxyawykywszehghzyb.supabase.co

## Deployment

Push to main and it's live. No build step, no PR process.
**For Claude:** Always push changes immediately.

## Database Schema

**Tables (all with RLS enabled):**
- `projects` — Portfolio projects (title, slug, description, category, client_name, cover_image_url, gallery_urls, tags, featured, sort_order, is_archived, published_at)
- `team_members` — Team (name, role, bio, photo_url, email, sort_order, is_active)
- `categories` — Project categories (name, slug, description, sort_order, is_active)
- `contact_submissions` — Contact form entries (name, email, subject, message, status: new/read/replied/archived)

**RLS Policies:**
- Public: read published projects, active team members, active categories, insert contact submissions
- Authenticated: full CRUD on all tables

**Storage Buckets:**
- `portfolio-media` — Public bucket for project images, team photos
- `documents` — Private bucket for internal files

## Shared Files

- `shared/supabase.js` — Supabase client init (URL + anon key as globals)
- `shared/auth.js` — Auth module: profile button, login modal, page guard
- `shared/admin.css` — Admin styles: layout, tables, modals, badges (themeable via `--aap-*` CSS vars)

### Auth System (`shared/auth.js`)

Provides login/profile functionality on all pages:

- **Profile button**: Auto-inserts into nav bar. Shows person icon when logged out, initials avatar when logged in.
- **Login modal**: Email/password via `supabase.auth.signInWithPassword()`. Opens on profile icon click.
- **Dropdown menu**: When logged in, clicking avatar shows dropdown with "Admin" link and "Sign Out".
- **Page guard**: Admin pages call `requireAuth(callback)` — redirects to `../index.html` if not authenticated.
- **Supabase client**: Exposed as `window.adminSupabase` for admin page data access.

**Script loading order on every page:**
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
<script src="shared/supabase.js"></script>
<script src="shared/auth.js"></script>
```

**`shared/supabase.js` must export globals** (auth.js reads these):
```javascript
var SUPABASE_URL = 'https://dcxxyawykywszehghzyb.supabase.co';
var SUPABASE_ANON_KEY = '...';
```

### Admin Pages (`admin/`)

- All admin pages are in `admin/` directory with `<meta name="robots" content="noindex, nofollow">`
- Each page loads `shared/admin.css` and calls `requireAuth()`:
```javascript
requireAuth(function(user, supabase) {
    // Page is authenticated — load data using supabase client
});
```
- Admin topbar nav links between admin sub-pages
- CRUD pattern: `admin-table` for listing, `admin-modal` for add/edit forms
- CSS classes are themeable via `--aap-*` custom properties

## Tailwind CSS v4

- Next.js uses `@tailwindcss/postcss` (in `postcss.config.mjs`)
- Static pages use `@tailwindcss/cli`: `npm run css:build` / `npm run css:watch`
- CSS-first config in `styles/tailwind.css` — no `tailwind.config.js`
- `styles/tailwind.out.css` committed to repo (GitHub Pages has no build step)
- Theme tokens mapped from `--aap-*` CSS vars

## Supabase Details

- Project ref: `dcxxyawykywszehghzyb`
- URL: `https://dcxxyawykywszehghzyb.supabase.co`
- Region: `us-east-1`
- Anon key is in `src/lib/supabase.ts` and `shared/supabase.js`

### Direct Database Access (for Claude)

```bash
/opt/homebrew/opt/libpq/bin/psql "postgres://postgres.dcxxyawykywszehghzyb:PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres" -c "SQL HERE"
```

Or via Management API:
```bash
curl -s -X POST "https://api.supabase.com/v1/projects/dcxxyawykywszehghzyb/database/query" \
  -H "Authorization: Bearer MGMT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "SQL HERE"}'
```

### Supabase CLI Access (for Claude)

```bash
supabase functions deploy <function-name>
supabase functions logs <function-name>
supabase secrets set KEY=value
```

### Webhook URLs

- Resend inbound: `https://dcxxyawykywszehghzyb.supabase.co/functions/v1/resend-inbound-webhook`

## Key Files

- `src/lib/supabase.ts` — Supabase client (Next.js app)
- `shared/supabase.js` — Supabase client (vanilla JS pages)
- `next.config.ts` — basePath must match GitHub repo name
- `src/i18n/config.ts` — supported locales
- `src/i18n/dictionaries/*.json` — translation files
- `src/contexts/auth-context.tsx` — authentication
- `styles/tailwind.css` — Tailwind v4 CSS-first config for static pages
- `styles/tailwind.out.css` — Built Tailwind CSS output

## External Services

### Email (Resend)
- API key stored as Supabase secret: `RESEND_API_KEY`

### AI (Google Gemini)
- API key stored as Supabase secret: `GEMINI_API_KEY`
- Models: gemini-2.0-flash (fast), gemini-2.5-flash (advanced)

### Object Storage (Cloudflare R2)
- Config in `r2_config` table
- Secrets: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`

## Conventions

1. Use toast notifications, not alert()
2. Filter archived items client-side
3. Don't expose personal info in public views
4. Client-side image compression for files > 500KB
