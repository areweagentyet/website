# Findings

## Solution quick links (2026-10-15)
- Catalog contains 147 distinct GitHub repositories and 84 entries with non-GitHub source URLs. Many sources are specs, drafts, model listings or other code hosts, so these must not all be called marketing pages.
- Preserve specific repository subpaths (such as Codex SDK); GitHub organization links remain appropriate for organization/model-family entries.
- Use official repository About/homepage metadata as primary evidence for separate project websites, with verification date and provenance stored separately from the original catalog.
- Retrieved official GitHub homepage metadata for all 147 repositories and 11 owner profiles. Some homepage fields point to documentation, papers, packages or other code hosts; classify these honestly instead of labeling every link “Website.”
- Confirmed separate product/marketing pages for Graphiti (`https://www.getzep.com/platform/graphiti/`), Letta (`https://www.letta.com/`), Ragas (`https://www.ragas.io/`), Phoenix (`https://arize.com/phoenix/`) and Vault (`https://www.hashicorp.com/en/products/vault`) from primary publishers. Add these alongside existing documentation links.
- Workspace now has a Git repository inside `website/`, and the existing findings file has been renamed `fidnings.md`; preserve these user changes.

## Existing material
- `../landscape/project-catalog.json`: 239 entries; 136 projects, 78 standards, 11 drafts, 14 model families.
- Eight domains: Intent Contract (4), Identity & Access (15), Trace & Evidence (17), Agent Harness (47), Agent Execution Environment (29), Agent Connectivity & State (30), Inference Infrastructure (65), Open Models (32).
- Fields: name, aliases, kind, source, domain, domain_zh, subsection, URLs, optional scope_note and conference_source.
- Poster assets and verification report still describe the earlier 238-entry catalog; do not present poster as an updated readiness visualization.
- Existing catalog has no readiness/adoption/license scores. Evidence must be collected separately.

## Technical references
- Astro install prerequisites: Node >=22.12.0; local Node 22.16.0 is suitable. https://docs.astro.build/en/install-and-setup/
- Astro prerenders pages by default; static output needs no server adapter. https://docs.astro.build/en/guides/on-demand-rendering/
- Interactive widgets can be isolated within static HTML. https://docs.astro.build/en/concepts/islands/

## Visual direction
- Thesis: an editorial engineering field guide, warm paper, dark ink, vermilion accent, crisp grids and a stack diagram as the central visual.
- Content: distinctive brand/title, task-oriented entry points, explorer with switchable list/stack views, evidence-based detail, methodology.
- Interaction: brief entrance reveal, clear task/filter selection transitions, responsive stack highlights; reduced-motion support.
- Use typography and code-native diagrams rather than decorative photography for this technical information product.
- Color revision: user approved existing layout/shapes and larger text, requested more color. Use muted clay, gold, plum, teal, blue and sage as consistent category/task accents; retain paper background, dark ink and red brand. Colors indicate categories separately from readiness labels, with text labels retained everywhere.

## Initial primary-source research
- LangGraph overview documents durable execution, persistence and human review, and names Klarna/Uber/J.P. Morgan as users (publisher-reported, not independently audited). Low-level orchestration requires application design. https://docs.langchain.com/oss/python/langgraph/overview
- Pydantic AI repository documents typed Python agents, validated outputs, tool APIs and optional durable engine integrations; MIT license. https://github.com/pydantic/pydantic-ai ; https://pydantic.dev/docs/ai/capabilities/durable_execution/overview/
- vLLM official docs available at https://docs.vllm.ai/en/latest/ ; examine serving requirements before assessment.
- Ollama and LiteLLM are not in the supplied catalog; do not silently add them to the agreed 239 entries.
- Mem0 repository: persistent user/session/agent memory, SDKs and managed service; Apache 2.0. Published benchmark results explicitly describe managed proprietary optimizations, so do not transfer them to OSS. https://github.com/mem0ai/mem0
- Graphiti: temporal knowledge graphs; Python plus graph database and model/embedding providers; structured-output support affects ingestion reliability. https://github.com/getzep/graphiti
- Firecracker: KVM microVMs originally developed for AWS Lambda/Fargate; Apache 2.0. Infrastructure primitive, not a ready-made agent sandbox. https://github.com/firecracker-microvm/firecracker
- Temporal: durable workflow platform, SDKs and self-host/Cloud paths. https://docs.temporal.io/
- E2B: isolated cloud sandboxes via Python/JS SDKs; hosted quickstart requires API key. Apache 2.0 code does not mean free hosted compute. https://github.com/e2b-dev/E2B
- Langfuse: traces/evaluations/prompt management, Python/JS/OpenTelemetry, self-hosting. https://langfuse.com/docs
- promptfoo: CLI/library for evals, red teaming and CI; configurable providers/assertions. Tests do not establish universal agent reliability. https://www.promptfoo.dev/docs/intro/
- Playwright: documented browser testing/install flow. Browser automation is not an isolation boundary. https://playwright.dev/docs/intro
- llama.cpp: MIT C/C++ inference with local/server tooling and varied hardware backends; model licenses remain separate. https://github.com/ggml-org/llama.cpp
- LangChain: agent framework and integrations built on LangGraph. https://docs.langchain.com/oss/python/langchain/overview
- Reviewed release pages for LangGraph, Temporal, Firecracker, Pydantic AI, Mem0, Graphiti and E2B using browser research. LangGraph 1.2.15: October 12; Pydantic AI 2.56.0: October 13. No issue response times or quantitative maintenance scores inferred.
- Checked public repositories for Playwright, vLLM, LangChain, Langfuse and promptfoo to substantiate licensing and source accessibility. Individual entries cite these primary sources directly.
