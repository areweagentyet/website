# Are We Agent Yet?

A developer field guide to the agent stack, built with Astro and TypeScript. Browse 239 landscape entries by developer task or stack layer, read dated evidence assessments, and compare up to three solutions.

## Run locally

Use Node.js **22.19 or newer** (the current Astro dependency tree includes a font utility requiring this Node patch level).

```sh
cd website
npm ci
npm run dev
```

Open the local URL printed by Astro, normally `http://127.0.0.1:4321`.

```sh
npm test         # catalog integrity, search, filter state and comparison limits
npm run check    # Astro and TypeScript diagnostics
npm run build    # static output in dist/
npm run preview  # preview the production build
```

Astro 7 preview runs as a background process. Use `npx astro preview status`, `npx astro preview logs`, and `npx astro preview stop` to manage it. The development server runs in the foreground.

There is no database, authentication, external font service or runtime API dependency. Deploy the generated `dist/` directory to a static host when desired. Hosting and publication are outside this initial local build.

## Pages and interactions

- `/`: developer task guides, search and catalog filters.
- `/stack/`: interactive eight-domain stack, followed by the same catalog explorer.
- `/solutions/[slug]/`: 239 static profiles. Thirteen have initial editorial desk assessments; all other entries explicitly say “not assessed.”
- `/compare/`: up to three entries, with shareable URLs such as `/compare/?with=mem0,graphiti`.
- `/methodology/`: inclusion, readiness rubric, evidence dimensions, dates and contribution guidance.

Task/category/type/readiness/search/sort state uses URL query parameters. Comparison selections use optional browser localStorage and also travel in shared URLs. Search supports names, aliases and retained Chinese category labels. Press `/` to focus search. Reduced-motion preferences are respected. Profiles and the full catalog remain readable without JavaScript; filtering and comparison require it.

## Data and provenance

- `src/data/catalog.json`: exact imported source snapshot from `../landscape/project-catalog.json`.
- `src/data/tasks.json`: developer task definitions, guides and documented constraint references.
- `src/data/assessments.json`: editorial enrichment, separate from the imported source. Every assessment has a review date, sources, scope, limitations, adoption observations, developer experience, maintenance and compatibility/access notes.
- `src/lib/catalog.ts`: domain presentation and task associations, stable slugs and typed enriched entries.
- `src/lib/explorer.ts`: shared filtering, URL-state and comparison-limit logic.

To refresh from the sibling landscape directory:

```sh
npm run import:catalog
npm test
npm run check
npm run build
```

The importer preserves the source JSON verbatim and copies JSON, CSV and original artwork into `public/downloads/`. It deliberately does not run the landscape generator, which depends on files outside this export. The original poster/PDF reflect 238 entries from September 30, while the catalog includes the October 5 OpenFab addition (239 entries). That distinction is visible in the site.

## Maintaining an assessment

Use an existing assessment as the schema example. Key it by the exact catalog name. Supply:

1. A readiness label (`experimental`, `usable`, `established`), review date and explanation of the evidence supporting it.
2. A short purpose statement and scoped editorial verdict.
3. Separate adoption, developer-experience, maintenance and compatibility/access observations. State what was not verified.
4. License boundaries, interfaces/languages, deployment requirements and limitations.
5. Primary-source evidence links with notes explaining what each supports.

Do not transfer hosted-service benchmark claims to open code, infer deployments from stars, or fabricate quantitative scores. Standards, drafts and model families remain unassessed until type-appropriate evidence is available. “Established” is a component-scoped editorial judgment, not a production certification. Review methodology changes alongside assessment changes.

Task associations come from taxonomy plus selected project capabilities. They indicate relevance, not verified interoperability. When adding an entry, update the source landscape catalog, reimport, check slug uniqueness and adjust task mappings if needed. The tests require every assessment to reference an existing entry.

## Browser validation

Solution pages show GitHub and other official links in **At a glance**. Repository paths come directly from the catalog, including SDK subdirectories and organization links. Separate project websites and documentation live in `src/data/project-links.json`, keyed by exact catalog name, with a checked date and a primary source for each URL. Verify changes against the official repository homepage field or publisher page; keep documentation labeled separately and do not guess websites. The imported catalog snapshot stays unchanged.

`scripts/browser-smoke.js` contains a Playwright CLI code snippet for real browser validation against a local preview on port 4321. It checks search, combined filters, reload/back state, shared comparisons, limits, profile evidence and mobile overflow. Run it through `playwright-cli run-code` with the file's function as the code argument. There is no Playwright runtime dependency in the shipped site. Screenshots and browser artifacts belong in ignored `output/playwright/`.

## Later phases

- Production-adoption and ecosystem-research views over the shared catalog, with audience-specific criteria.
- User submissions as proposed entries or corrections, reviewed before publication.
- Optional automatic collection of dated maintenance/adoption signals with editorial review.
- Full English/Chinese localization; the Chinese taxonomy is already retained for search.

The first version has no submission form or review backend. Maintainer edits are repository-managed and become public only after review and a site rebuild.

## Assets

Open Sans fonts and their upstream license are bundled in `public/fonts/`, copied from the source landscape. Display typography uses system Georgia. Diagrams and icons are code-native SVG/HTML. Original landscape artwork retains its original provenance; no new asset license is asserted here.
