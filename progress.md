# Progress

## 2026-10-14
- User approved audience, task-first navigation, stack view, evidence-based multidimensional assessment, full catalog with selected deep assessments, repository editing, English interface and technical field guide style.
- User submissions explicitly deferred to next phase.
- Read brainstorming, frontend, local Sites workflow, planning and verification guidance. Explicit local Astro target takes priority over hosting defaults.
- Inspected source schema and confirmed an empty `website/` destination.
- Saved approved design and implementation plan under `docs/plans/`.
- Added package configuration and behavior/data tests; confirmed initial test failure because the catalog modules do not yet exist.
- npm network requests are blocked by sandbox DNS; curl network access works. Host npm cache is populated, so trying a writable APFS-cloned cache for offline installation.
- Imported all 239 source entries and downloadable original files. Added 13 primary-source editorial assessments, task definitions, typed catalog/filter/URL/comparison functions. All 7 data and functional tests pass.
- Offline dependency install succeeded after refreshing two registry metadata records and fetching two missing tarballs. Node engine floor documented as 22.19 for the current dependency tree.
- Production build generated 244 static pages. Initial typecheck had no errors and one unused import hint, now removed. Audited 6,816 local link/asset references: no missing targets.
- Desktop screenshot inspected; no browser console messages. Real-browser reproduction found that opening a shared comparison then navigating away before editing lost its selection. Persisted the URL's sanitized selection during initialization and added a browser regression check.
- Playwright wrapper's npx refresh can hit sandbox DNS when complex shell quoting triggers restricted execution; moving bulk validation to a simple literal code argument.
- Final Astro check: 0 errors, 0 warnings, 0 hints. Production build: 244 pages.
- Browser smoke: all 34 checks passed, including shared-URL persistence before edits, malformed selections, comparison limit, alias/Chinese search, filter reload/back, profile evidence and six mobile routes with no horizontal page overflow. No runtime errors.
- One browser-test assertion ran before the new page's module loaded; verified storage and post-load UI were correct, then used load-state waits for navigation assertions.
- Darkened muted text and search placeholders to at least 4.5:1 contrast against the paper background.
- Independent code review found the external sort select's event listener issue and comparison removal focus loss. Reproduced both in browser, fixed delegation and explicit focus restoration, and added regressions.
- Also kept the selected task visible in the mobile horizontal rail and removed a decorative arrow that wrapped on mobile.
- Final verification after review fixes: 7 unit tests pass; 39 browser checks pass; Astro typecheck reports 0 errors/warnings/hints; production build outputs 244 pages. Existing link audit checked 6,816 local references with no missing targets. Desktop/mobile screenshots are in `output/playwright/`.
- Generated npm cache moved reversibly outside the project to `/private/tmp/are-we-agent-yet-npm-cache-20261014T0840` after a force-delete cleanup command was rejected. Application dependencies remain in ignored `node_modules/`.
- README documents Node 22.19+, run/build, original snapshot import, source/evidence boundaries and future reviewed submissions. Preview left running at http://127.0.0.1:4321 for handoff.
- Additional acceptance checks confirmed `/` focuses search and all 239 catalog entries remain readable with JavaScript disabled. Closed the owned QA browser after screenshots; production preview remains available.

## Typography revision
- User requested content text at least 2–3 points larger. Increased 267 font-size declarations, including responsive overrides and font shorthands, by 4px (3pt), with a 13px minimum for previously tiny labels.
- Added spacing/wrapping adjustments for larger controls, navigation and stack diagram labels. Production build passes; desktop/mobile layout checks in progress.
- Verified six routes at 1440, 800, 390 and 320px widths: all 24 layouts fit without horizontal page overflow, with no checked visible text below 13px. Inspected desktop, catalog and mobile screenshots; larger labels, descriptions, table text and controls remain readable. Production preview rebuilt in place.

## Color revision
- Added a separate color stylesheet with consistent category tints across the homepage diagram, full stack, catalog links/hover states and solution context. Task selections and guide panels use their own coherent accents; primary actions/shortlist use forest green, with a warm editorial section and original red branding.
- Preserved geometry and enlarged typography. Build passes and Astro check reports no errors/warnings/hints. Verified 18 route/viewport combinations at 1440, 390 and 320px, eight distinct stack colors, live task color updates and no browser runtime errors or page overflow.
- Inspected desktop/mobile screenshots. Checked new text/palette pairs against 4.5:1 contrast and darkened muted copy on tinted hover/editorial surfaces to retain readability.

## Stack page cleanup
- Removed the requested “The Original Landscape” section and its poster/PDF buttons from the stack page, along with its unused CSS. Production build passes; verified the removed heading, description and controls are absent from generated HTML.

## Headline emphasis
- Moved the homepage's red italic emphasis from “yet?” to “agent.” Rebuilt the production preview and verified the generated headline emphasizes only “agent.”

## Solution quick links
- Added prominent GitHub links with the GitHub icon at the top of At a glance. Exact repository/subdirectory URLs are preserved; organization links remain available for model families. Other code hosts, model collections and specifications receive accurate labels.
- Added 150 separately sourced website/documentation links for 141 entries in `src/data/project-links.json`, checked October 15. Used official repository/organization website fields and publisher pages; kept the original 239-entry catalog unchanged. Added editing guidance to README.
- All 13 tests pass; Astro check reports no errors/warnings/hints; build produces 244 static pages. Audited all 394 quick links across 239 generated profiles. Browser checks passed on seven representative profiles at 1440, 390 and 320px: icons and links visible, tap targets at least 44px, no page overflow or runtime errors. Inspected desktop/mobile screenshots in `output/playwright/solution-links-*.png`.

## Branding and methodology cleanup
- Extended the red italic Agent emphasis to the shared header and footer branding and the methodology introduction. Removed the former question-mark emphasis.
- Removed the Sources & dates footer link, methodology section and navigation item; renumbered Contributing to 06. Removed repeated source-snapshot/landscape references from solution pages and deleted unused section styles/imports.
- Build and Astro check pass (0 errors/warnings/hints). Audited all 244 generated pages for emphasized shared branding and absence of removed section references. Verified five routes at 1440, 390 and 320px with no horizontal overflow or browser errors; inspected header/footer/mobile screenshots.
