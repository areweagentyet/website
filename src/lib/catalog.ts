import original from '../data/catalog.json' with { type: 'json' };
import taskData from '../data/tasks.json' with { type: 'json' };
import assessmentData from '../data/assessments.json' with { type: 'json' };

export type Kind = 'project' | 'standard' | 'draft' | 'model';
export type Readiness = 'established' | 'usable' | 'experimental' | 'not-assessed';
export interface Evidence { title: string; url: string; note: string }
export interface Assessment {
  readiness: Exclude<Readiness, 'not-assessed'>;
  reviewed: string; summary: string; verdict: string; adoption: string; dx: string;
  maintenance: string; compatibility: string; license: string; languages: string[];
  deployment: string; limitations: string[]; evidence: Evidence[];
}
export interface Entry {
  name: string; aliases: string[]; kind: Kind; source: string; domain: string;
  domain_zh: string; subsection: string; urls: string[]; scope_note?: string;
  conference_source?: string; slug: string; domainId: string; tasks: string[];
  readiness: Readiness; summary: string; assessment?: Assessment;
}
export const tasks = taskData;
export const assessments = assessmentData as Record<string, Assessment>;
export const reviewedDate = '2026-10-14';
export const kindLabels: Record<Kind, string> = { project: 'Project', standard: 'Standard / spec', draft: 'Draft / workstream', model: 'Model family' };
export const readinessLabels: Record<Readiness, string> = { established: 'Established', usable: 'Usable', experimental: 'Experimental', 'not-assessed': 'Not assessed' };

export function slugify(value: string): string {
  return value.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export const domains = [
  { name: 'Intent Contract', short: 'Intent & instructions', description: 'Turn human intent into explicit, machine-readable constraints.', number: '01' },
  { name: 'Identity & Access', short: 'Identity & access', description: 'Give workloads identities and define what they may do.', number: '02' },
  { name: 'Trace & Evidence', short: 'Trace & evidence', description: 'Observe runs, evaluate outcomes and establish provenance.', number: '03' },
  { name: 'Agent Harness', short: 'Agent harness', description: 'Assemble the agent loop, tools, memory and learning systems.', number: '04' },
  { name: 'Agent Execution Environment', short: 'Execution environment', description: 'Run workloads, isolate code and recover long-running work.', number: '05' },
  { name: 'Agent Connectivity & State', short: 'Connectivity & state', description: 'Connect agents, applications and communication protocols.', number: '06' },
  { name: 'Inference Infrastructure', short: 'Inference infrastructure', description: 'Serve models and operate compute, storage and networking.', number: '07' },
  { name: 'Open Models', short: 'Open models', description: 'Explore model families, training tools, formats and distribution.', number: '08' },
].map(d => ({ ...d, id: slugify(d.name) }));

function entryTasks(entry: { name: string; domain: string; subsection: string }): string[] {
  const overrides: Record<string, string[]> = {
    LangGraph: ['workflows', 'memory'], Temporal: ['workflows'], 'Pydantic AI': ['tools', 'workflows'],
    LangChain: ['tools', 'workflows'], Playwright: ['tools', 'evaluate'], 'Playwright MCP': ['tools'],
    E2B: ['safety'], Firecracker: ['safety', 'deploy'], vLLM: ['models', 'deploy'], 'llama.cpp': ['models', 'deploy'],
    OpenFab: ['evaluate'], Graphiti: ['memory'], Mem0: ['memory'],
  };
  if (overrides[entry.name]) return overrides[entry.name];
  if (entry.subsection === 'MEMORY & CONTEXT') return ['memory'];
  if (entry.subsection === 'AGENT RL & SELF-IMPROVEMENT') return ['workflows', 'evaluate'];
  if (entry.subsection === 'ACTIONS & EVALUATION') return ['tools', 'evaluate'];
  if (entry.subsection === 'DURABLE & DATAFLOW EXECUTION') return ['workflows'];
  if (entry.subsection === 'OPERATING SYSTEMS & ENDPOINTS') return ['safety', 'deploy'];
  if (entry.subsection === 'EXECUTION SPECS') return ['safety', 'deploy'];
  const byDomain: Record<string, string[]> = {
    'Intent Contract': ['tools', 'workflows'], 'Identity & Access': ['safety'], 'Trace & Evidence': ['evaluate'],
    'Agent Harness': ['tools', 'workflows'], 'Agent Execution Environment': ['safety'],
    'Agent Connectivity & State': ['tools'], 'Inference Infrastructure': ['deploy'], 'Open Models': ['models'],
  };
  if (entry.subsection === 'INFERENCE ENGINES & SERVING') return ['models', 'deploy'];
  return byDomain[entry.domain] ?? [];
}

export const catalog: Entry[] = original.entries.map(raw => {
  const assessment = assessments[raw.name];
  return {
    ...raw, kind: raw.kind as Kind, aliases: raw.aliases ?? [], urls: raw.urls ?? [],
    slug: slugify(raw.name), domainId: slugify(raw.domain), tasks: entryTasks(raw),
    readiness: assessment?.readiness ?? 'not-assessed', assessment,
    summary: assessment?.summary ?? ('scope_note' in raw ? String(raw.scope_note) : `Listed in ${raw.domain} · ${raw.subsection.toLowerCase().replaceAll('&', '&')}.`),
  };
});

export function findEntry(slug: string): Entry | undefined { return catalog.find(e => e.slug === slug); }
export function domainEntries(domainId: string): Entry[] { return catalog.filter(e => e.domainId === domainId); }
export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(value + 'T00:00:00Z'));
}
