import { catalog, domains, tasks, type Entry } from './catalog.ts';

export interface Filters {
  q?: string; task?: string; domain?: string; kind?: string; readiness?: string; sort?: string;
}
export function filterCatalog(entries: Entry[], filters: Filters): Entry[] {
  const q = filters.q?.trim().toLowerCase() ?? '';
  const rank: Record<string, number> = { established: 0, usable: 1, experimental: 2, 'not-assessed': 3 };
  return entries.filter(e =>
    (!q || [e.name, ...e.aliases, e.domain, e.domain_zh, e.subsection, e.summary].join(' ').toLowerCase().includes(q)) &&
    (!filters.task || e.tasks.includes(filters.task)) &&
    (!filters.domain || e.domainId === filters.domain) &&
    (!filters.kind || e.kind === filters.kind) &&
    (!filters.readiness || (filters.readiness === 'assessed' ? !!e.assessment : e.readiness === filters.readiness))
  ).sort((a, b) =>
    (filters.sort === 'name' ? 0 : rank[a.readiness] - rank[b.readiness]) || a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })
  );
}
export function readFilters(params: URLSearchParams): Required<Filters> {
  const pick = (key: string, allowed: string[], fallback = '') => allowed.includes(params.get(key) ?? '') ? params.get(key)! : fallback;
  return {
    q: params.get('q')?.slice(0, 300) ?? '',
    task: pick('task', tasks.map(t => t.id)), domain: pick('domain', domains.map(d => d.id)),
    kind: pick('kind', ['project', 'standard', 'draft', 'model']),
    readiness: pick('readiness', ['assessed', 'established', 'usable', 'experimental', 'not-assessed']),
    sort: pick('sort', ['reviewed', 'name'], 'reviewed'),
  };
}
export function writeFilters(filters: Filters): URLSearchParams {
  const p = new URLSearchParams();
  for (const key of ['q', 'task', 'domain', 'kind', 'readiness', 'sort'] as const) {
    if (filters[key] && !(key === 'sort' && filters[key] === 'reviewed')) p.set(key, filters[key]!);
  }
  return p;
}
export function sanitizeSelection(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return [...new Set(input.filter((s): s is string => typeof s === 'string' && catalog.some(e => e.slug === s)))].slice(0, 3);
}
export function toggleSelection(current: string[], slug: string): { selected: string[]; full: boolean } {
  const selected = sanitizeSelection(current);
  if (selected.includes(slug)) return { selected: selected.filter(s => s !== slug), full: false };
  if (!catalog.some(e => e.slug === slug)) return { selected, full: false };
  if (selected.length === 3) return { selected, full: true };
  return { selected: [...selected, slug], full: false };
}
