import test from 'node:test';
import assert from 'node:assert/strict';
import { catalog } from '../src/lib/catalog.ts';
import { getSolutionLinks } from '../src/lib/solution-links.ts';
import metadata from '../src/data/project-links.json' with { type: 'json' };

test('website enrichment has dated provenance and references existing catalog entries', () => {
  assert.match(metadata.checked, /^\d{4}-\d{2}-\d{2}$/);
  for (const [name, links] of Object.entries(metadata.entries)) {
    assert.ok(catalog.some(entry => entry.name === name), name);
    for (const link of links) {
      assert.ok(['website', 'documentation'].includes(link.kind), name);
      assert.equal(new URL(link.url).protocol, 'https:');
      assert.equal(new URL(link.source).protocol, 'https:');
      assert.ok(!['github.com', 'arxiv.org', 'www.npmjs.com'].includes(new URL(link.url).hostname), name);
    }
  }
});

test('quick links include the exact GitHub project path and a separate verified website', () => {
  const entry = catalog.find(e => e.name === 'Mem0');
  const links = getSolutionLinks(entry);
  assert.ok(links.some(l => l.kind === 'github' && l.url === 'https://github.com/mem0ai/mem0'));
  assert.ok(links.some(l => l.kind === 'website' && new URL(l.url).hostname === 'mem0.ai'));
});

test('SDK subdirectories remain specific instead of linking to the parent project', () => {
  const entry = catalog.find(e => e.name === 'Codex SDK');
  const links = getSolutionLinks(entry);
  assert.ok(links.some(l => l.kind === 'github' && l.url.endsWith('/sdk/typescript')));
});

test('specifications and other code hosts are not mislabeled as marketing websites', () => {
  const spec = getSolutionLinks(catalog.find(e => e.name === 'OAuth 2.0'));
  assert.equal(spec.some(l => l.kind === 'github'), false);
  assert.ok(spec.some(l => l.kind === 'specification'));
  const gitcode = getSolutionLinks(catalog.find(e => e.name === 'OpenHarmony'));
  assert.ok(gitcode.some(l => l.kind === 'source' && new URL(l.url).hostname === 'gitcode.com'));
});

test('GitHub organizations are available for model families without inventing a repository', () => {
  const links = getSolutionLinks(catalog.find(e => e.name === 'DeepSeek'));
  assert.ok(links.some(l => l.kind === 'github' && new URL(l.url).pathname.replace(/\/$/, '') === '/deepseek-ai'));
});

test('GitHub-only records do not get guessed external sites; links use safe HTTPS URLs', () => {
  const links = getSolutionLinks({ name: 'Unknown tool', kind: 'project', urls: ['https://github.com/example/tool'] });
  assert.deepEqual(links.map(l => l.kind), ['github']);
  assert.equal(getSolutionLinks({ name: 'Unknown tool', kind: 'project', urls: ['javascript:alert(1)'] }).length, 0);
  for (const entry of catalog) {
    const links = getSolutionLinks(entry);
    assert.equal(new Set(links.map(l => l.url.replace(/\/$/, ''))).size, links.length, entry.name);
    for (const l of links) assert.equal(new URL(l.url).protocol, 'https:');
    for (const url of entry.urls.filter(u => new URL(u).hostname === 'github.com')) {
      if (new URL(url).pathname.split('/').filter(Boolean).length >= 2 || !entry.urls.some(u => new URL(u).hostname === 'github.com' && new URL(u).pathname.split('/').filter(Boolean).length >= 2)) {
        assert.ok(links.some(l => l.kind === 'github' && l.url === url), entry.name);
      }
    }
  }
});
