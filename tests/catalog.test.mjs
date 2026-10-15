import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { catalog, domains, tasks, assessments, slugify } from '../src/lib/catalog.ts';
import { filterCatalog, readFilters, writeFilters, sanitizeSelection, toggleSelection } from '../src/lib/explorer.ts';

test('all 239 original records survive the import without edits', () => {
  const original = JSON.parse(readFileSync(new URL('../../landscape/project-catalog.json', import.meta.url)));
  const imported = JSON.parse(readFileSync(new URL('../src/data/catalog.json', import.meta.url)));
  assert.deepEqual(imported, original);
  assert.equal(catalog.length, 239);
  assert.equal(domains.length, 8);
});

test('every entry has a unique stable slug and valid task mappings', () => {
  assert.equal(new Set(catalog.map(x => x.slug)).size, catalog.length);
  assert.equal(slugify('llama.cpp'), 'llama-cpp');
  for (const entry of catalog) {
    assert.ok(entry.slug);
    for (const id of entry.tasks) assert.ok(tasks.some(t => t.id === id));
  }
  for (const domain of domains) assert.ok(catalog.some(e => e.domain === domain.name));
});

test('13 dated assessments have sources, limitations and separate evidence dimensions', () => {
  assert.equal(Object.keys(assessments).length, 13);
  for (const [name, a] of Object.entries(assessments)) {
    assert.ok(catalog.some(e => e.name === name));
    assert.match(a.reviewed, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(a.summary && a.limitations.length && a.evidence.length);
    assert.ok(a.adoption && a.dx && a.maintenance && a.compatibility);
    for (const e of a.evidence) assert.match(e.url, /^https:\/\//);
  }
  assert.equal(catalog.find(e => e.name === 'OpenFab').readiness, 'not-assessed');
});

test('search finds aliases, Chinese category labels and project names', () => {
  assert.ok(filterCatalog(catalog, { q: 'huggingface_hub' }).some(e => e.name === 'Hugging Face Hub'));
  assert.ok(filterCatalog(catalog, { q: '智能体运行框架' }).length);
  assert.deepEqual(filterCatalog(catalog, { q: ' OPENFAB ' }).map(e => e.name), ['OpenFab']);
  assert.equal(filterCatalog(catalog, { q: 'no-such-solution-xyz' }).length, 0);
});

test('task, domain, kind and readiness filters combine instead of replacing each other', () => {
  const found = filterCatalog(catalog, { task: 'memory', domain: 'agent-harness', kind: 'project', readiness: 'usable' });
  assert.ok(found.some(e => e.name === 'Mem0'));
  assert.ok(found.every(e => e.tasks.includes('memory') && e.kind === 'project' && e.readiness === 'usable'));
  assert.equal(filterCatalog(catalog, { task: 'memory', kind: 'model' }).length, 0);
  assert.equal(filterCatalog(catalog, { readiness: 'assessed' }).length, 13);
});

test('URL state roundtrips and discards unsupported filter values', () => {
  const state = { q: 'a & b', task: 'memory', domain: 'agent-harness', kind: 'project', readiness: 'usable', sort: 'name' };
  assert.deepEqual(readFilters(writeFilters(state)), state);
  assert.equal(readFilters(new URLSearchParams('task=bad&kind=bogus&readiness=unknown')).task, '');
  assert.equal(readFilters(new URLSearchParams('sort=bad')).sort, 'reviewed');
});

test('comparison removes invalid/duplicate entries and enforces a limit of three', () => {
  assert.deepEqual(sanitizeSelection(['langgraph','langgraph','missing','mem0','graphiti','e2b']), ['langgraph','mem0','graphiti']);
  assert.deepEqual(sanitizeSelection(null), []);
  assert.deepEqual(sanitizeSelection({}), []);
  assert.deepEqual(toggleSelection(['langgraph','mem0','graphiti'], 'e2b'), { selected: ['langgraph','mem0','graphiti'], full: true });
  assert.deepEqual(toggleSelection(['langgraph','mem0'], 'langgraph'), { selected: ['mem0'], full: false });
});
