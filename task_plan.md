# Are We Agent Yet? — task plan

## Objective
Build the approved Astro technical field guide inside `website/`, preserving the 239-entry landscape. Developer tasks lead; stack browsing, evidence-backed solution pages, comparison and methodology complete the first release. English interface; retain Chinese search labels. No deployment or accounts requested.

## Phases
1. [complete] Record design, establish Astro, research 12–16 assessed tools using primary sources.
2. [complete] Import catalog, model tasks and assessments, verify data invariants and filtering/comparison behavior.
3. [complete] Build responsive task explorer, stack map, detail pages, comparison, methodology and source downloads.
4. [complete] Build/typecheck/test, verify desktop/mobile browser interactions and accessibility, correct observed issues. All 39 browser smoke checks pass; final desktop/mobile screenshots inspected.
5. [complete] Document editing/rebuild workflow and hand off a running local preview. README complete; production preview serves on http://127.0.0.1:4321.
6. [complete] Increase typography by 4px (3pt), set a 13px minimum for small labels, and verify desktop/mobile layouts.
7. [complete] Add a restrained color palette to stack layers, task areas, catalog cues and supporting surfaces; preserve geometry and typography, then verify contrast and responsive rendering.

## Decisions
- Repository-managed structured data; user submissions come in a later phase.
- All existing entries remain unchanged in the source snapshot. Editorial enrichment is separate.
- Readiness, adoption, developer experience, maintenance and compatibility/access are distinct. Unknown evidence stays unassessed; no numerical ranking or fabricated usage figures.
- Task/category coverage is distinguished from documented ecosystem limitations.
- Astro static rendering and TypeScript browser interactions; avoid a framework dependency when native HTML/JS suffices.
- Not a Git checkout, so no worktree or commits; build directly in the explicitly requested directory.

## Errors / constraints
- Initial catalog read used former directory name; source has been renamed to `landscape/`.
- `git status` confirms workspace is not a Git repository. No Git operations needed.
- Online npm metadata: sandbox DNS blocked. Offline direct host cache: full/compact metadata mismatch and read-only location; trying writable cloned cache.
- Refreshed registry metadata through allowed curl access; now resolving offline dependencies. Two missing tarballs identified for explicit download.
- Cache cleanup via force-delete command was rejected by command review; used a safer, reversible move to `/private/tmp/are-we-agent-yet-npm-cache-20261014T0840` instead. Cache is outside the finished project.
