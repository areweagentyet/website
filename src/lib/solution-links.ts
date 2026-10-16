import projectLinks from '../data/project-links.json' with { type: 'json' };
import type { Kind } from './catalog';

type LinkKind = 'github' | 'website' | 'documentation' | 'specification' | 'models' | 'source';
export interface SolutionLink {
  kind: LinkKind;
  url: string;
  label: string;
  detail: string;
  icon: string;
}
const labels: Record<LinkKind, [string, string]> = {
  github: ['GitHub', 'github'], website: ['Website', 'globe'],
  documentation: ['Documentation', 'book'], specification: ['Specification', 'book'],
  models: ['Models', 'layers'], source: ['Source code', 'code'],
};
const metadata = projectLinks.entries as Record<string, { kind: string; url: string; source: string }[]>;

function parseUrl(value: string): URL | undefined {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url : undefined;
  } catch { return undefined; }
}

export function getSolutionLinks(entry: { name: string; kind: Kind; urls: string[] }): SolutionLink[] {
  const links: SolutionLink[] = [];
  const add = (kind: LinkKind, value: string) => {
    const url = parseUrl(value);
    if (!url || links.some(link => link.url.replace(/\/$/, '') === value.replace(/\/$/, ''))) return;
    const [label, icon] = labels[kind];
    const detail = kind === 'github' ? url.pathname.slice(1).replace(/\/$/, '') : url.hostname.replace(/^www\./, '');
    links.push({ kind, url: value, label, detail, icon });
  };
  const github = entry.urls.filter(value => parseUrl(value)?.hostname === 'github.com');
  const repositories = github.filter(value => new URL(value).pathname.split('/').filter(Boolean).length >= 2);
  for (const url of repositories.length ? repositories : github) add('github', url);
  for (const link of metadata[entry.name] ?? []) {
    if (link.kind === 'website' || link.kind === 'documentation') add(link.kind, link.url);
  }
  for (const value of entry.urls) {
    const url = parseUrl(value);
    if (!url || url.hostname === 'github.com') continue;
    const kind: LinkKind = ['gitee.com', 'gitcode.com', 'gitlab.com'].includes(url.hostname) ? 'source'
      : url.hostname === 'huggingface.co' ? 'models'
      : entry.kind === 'standard' || entry.kind === 'draft' ? 'specification'
      : /(^docs\.|^help\.|readthedocs\.|\/docs\/)/.test(url.href.replace('https://', '')) ? 'documentation' : 'website';
    add(kind, value);
  }
  const order: LinkKind[] = ['github', 'website', 'documentation', 'specification', 'models', 'source'];
  return links.sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind));
}
