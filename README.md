# Crystal Stones website rebuild

A Next.js App Router rebuild for the Crystal Stones website, including:
- Premium, responsive visual system
- Material catalogue with search and family/colour filters
- Dedicated Neolith journey and a multi-brand architectural-surface hub
- Brand reference pages for Dekton, Laminam and Stonelam
- Imported-marble origin collections and variety detail routes with search, filters and shortlist comparison
- Material detail templates
- Preserved known route examples: `/`, `/about/`, `/all-materials/`, `/granite/`
- Three-step Stone Requirement Builder
- Area conversion between square feet and square metres
- Adjustable cutting/wastage allowance (shown separately from measured area)
- Material, colour, finish, thickness, format, dimensions, known piece quantity, destination and contact details
- Enquiry API using Zod validation and optional Resend email delivery
- Metadata, canonical URLs, `robots.txt` and generated XML sitemap

## Important status

This is a **local rebuild, not a production migration or live deployment**. It has not been connected to the current WordPress database, hosting account, email provider, CRM, analytics, or a verified current material inventory. Demo material cards and images are illustrative; brand pages are manufacturer references and do not claim Crystal Stones authorization, current stock or supply terms.

The only old URL examples included so far are those already identified: `/`, `/about/`, `/all-materials/`, and `/granite/`. A full crawl and Search Console export are required before creating the final redirect map. No production changes have been made.

## Run locally

Requirements: Node.js 20.9+.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Enquiry delivery

Set these environment variables before accepting real leads:
- `RESEND_API_KEY`
- `ENQUIRY_TO_EMAIL`
- `ENQUIRY_FROM_EMAIL` (must be a sender/domain verified in Resend)
- `NEXT_PUBLIC_SITE_URL`

The example uses `http://localhost:3000` so local canonical URLs, sitemap entries and structured data stay local. Set a site URL explicitly for any approved staging or production environment.

Without these settings, the endpoint deliberately returns a clear 503 message rather than falsely claiming an enquiry was received. Before production, add appropriate rate limiting, bot protection, privacy notice/consent, monitoring, and ideally persistent CRM/database storage. The current endpoint sends email only and does not persist a CRM record.

## Before launch — required work

1. Export all WordPress content and media; download a complete database + files backup.
2. Crawl the production website and record all status codes, canonical URLs, title tags, meta descriptions, image URLs, internal links and indexable pages.
3. Export Search Console landing pages and query performance; add high-value URLs to the migration register.
4. Map every old URL to the same path or a relevant replacement. Do not use the sample redirects as a complete migration map.
5. Replace illustrative content with verified current materials, approved photography, accurate specs and truthful availability.
6. Confirm whether WordPress remains the CMS/headless source or whether a new content admin is needed.
7. Connect production email/CRM, spam controls, consent/privacy, analytics events and enquiry ownership.
8. Run typecheck, lint, production build, accessibility checks, responsive checks and URL/redirect crawl.
9. Deploy to staging, review with the business, then launch with a rollback plan.

## Main routes

- `/`
- `/neolith/`
- `/shop/sintered-stone/` — multi-brand architectural-surface discovery hub
- `/architectural-surfaces/brands/dekton/`
- `/architectural-surfaces/brands/laminam/`
- `/architectural-surfaces/brands/stonelam/`
- `/marble/` — searchable imported marble catalogue with origin, colour, pattern, finish and application filters
- `/marble/origin/[origin]/` — Italy, Turkey, Spain, Greece, Portugal and other/pending origins
- `/marble/variety/[slug]/` — variety details and enquiry handoff
- `/all-materials/`
- `/granite/`
- `/about/`
- `/requirement-builder/`
- `/material/[slug]/`
- `/api/enquiries` (POST)

## Architecture notes

- `lib/materials.ts`: demo material data; replace with the audited catalogue.
- `lib/architectural-brands.ts`: manufacturer names, material categories and manufacturer references. The list does not assert a Crystal Stones authorization or current supply relationship.
- `lib/imported-marble.ts`: local source of truth for imported-marble varieties and origin pages. Add varieties here; set origin/family verification and evidence per variety before treating a trade name as a verified fact. There is no CMS/admin backend connected yet.
- Imported-marble image assets are illustrative development visuals, not product or slab photography. Replace them with approved, attributed material images before publishing.
- `components/RequirementBuilder.tsx`: multi-step guided requirement form.
- `app/api/enquiries/route.ts`: validated email submission endpoint.
- `app/sitemap.ts`: sitemap generated from the routes/material data.
- `next.config.ts`: only a small example redirect set; extend after audit.

## Private media workspace

The invitation-only team workspace is available at `/admin`. Without Supabase configuration it displays setup guidance and does not connect to another project.

### Local setup

1. Create a **dedicated Crystal Stones Supabase project** only after the project owner approves provisioning. Do not reuse credentials or projects from another business.
2. Copy `.env.example` to an ignored local environment file and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from that dedicated project. These are the only Supabase values used by the browser; never add a service-role or secret key to a `NEXT_PUBLIC_` variable.
3. Review `supabase/migrations/20261104181501_media_library.sql`. It creates media roles, records, audit log, RLS policies and private/published buckets. This migration is **not automatically applied** and has not been run against any project.
4. Enable the `public` schema in that project's Data API if it is not exposed by default. Enable the Supabase Auth email/password sign-in provider and disable public sign-up. Invite team members through the dedicated project. Add the initial administrator's Auth user UUID to `media_team_members` with role `administrator` using a separately reviewed, private setup step. Assign subsequent users `uploader`, `content_editor` or `administrator` through the project admin console until in-app team management is implemented.
5. Start with `npm run dev` and open `/admin/sign-in`.

### Media workflow and limitations

- Upload accepts JPEG, PNG, WebP and AVIF up to 15 MB each. The server checks decoded format and pixel limits, retains the original in private storage, and creates thumbnail/card/detail WebP derivatives with orientation applied and derivative metadata stripped.
- Metadata and catalogue association are captured at upload and can be corrected later by an editor. Failed derivatives can be retried from the original when it remains in private storage. Uploaded items remain private in `review_needed`; an editor or administrator must approve and publish them. Published image derivatives are copied to a separate public bucket and appear on associated imported-marble variety and material detail pages. Brand associations are stored but are not yet rendered on brand pages.
- There is no AI provider configured. SEO fields are manual and require editorial verification. No existing approved content is overwritten.
- This feature does not provision Supabase, apply migrations, send invitations, or deploy. Database-backed operation cannot be verified until a dedicated project is configured.
- A local test command is available as `npm test`; no live Supabase integration tests are included. If the original private upload itself failed, a team member needs to choose the source file again through a separate re-upload workflow (currently not implemented).

Do not copy production secrets into Git or share hosting passwords in chat.
