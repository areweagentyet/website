# Are We Agent Yet? Implementation Plan

> Execute task-by-task in the current session. The user already approved implementation; continue without an additional handoff gate.

**Goal:** Deliver a working Astro field guide with a 239-entry catalog, 12–16 sourced assessments, task/stack exploration and comparison.

**Architecture:** Prerender solution and editorial pages from typed local data. Enhance HTML with browser modules for filtering and comparison. Keep the imported source snapshot separate from editorial enrichment.

**Tech Stack:** Astro, TypeScript, CSS, native Node test runner; Playwright CLI for real-browser validation.

### Task 1: Scaffold and evidence
Create `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/data/catalog.json`, `src/data/tasks.json`, `src/data/assessments.json`, `scripts/import-catalog.mjs`. Install Astro/check/TypeScript; research primary sources and record dated observations and limits. Preserve aliases, kinds and scope notes.

### Task 2: Data and behavior
First create `tests/catalog.test.ts` exercising original entry preservation, unique slugs, valid mappings, required evidence, search across aliases/Chinese, combined filters, URL parsing and the three-comparison limit. Run `npm test` to confirm failure before implementing `src/lib/catalog.ts` and `src/lib/explorer.ts`. Confirm tests pass.

### Task 3: Pages and interactions
Create `src/layouts/Layout.astro`, shared components, `src/styles/global.css`, `src/pages/index.astro`, `stack/index.astro`, `solutions/[slug].astro`, `compare/index.astro`, `methodology/index.astro`, browser modules under `src/scripts/`. Maintain accessible labels, progressive enhancement, shareable filter state and robust unknown/empty states.

### Task 4: Validate
Run `npm test`, `npm run check`, `npm run build`. Start local server bound to loopback. Inspect desktop/mobile screenshots and exercise real controls using Playwright. Fix failures, re-run relevant checks and record evidence in `progress.md`.

### Task 5: Handoff
Create `README.md` with install, run, build, data import, assessment and contribution instructions. Update planning files. Return local preview URL and verified outcomes with material limitations.
