import { findEntry, readinessLabels, kindLabels, tasks, formatDate, type Entry } from '../lib/catalog';
import { sanitizeSelection } from '../lib/explorer';
import { getSelection, setSelection, announce } from './comparison';

const root = document.querySelector('[data-comparison-page]');
if (root) {
  const table = document.getElementById('comparison-table') as HTMLTableElement;
  const select = document.getElementById('compare-add') as HTMLSelectElement;
  const rows: [string, (e: Entry) => string][] = [
    ['Purpose', e => e.summary], ['Space / entry type', e => `${e.domain} · ${kindLabels[e.kind]}`],
    ['Readiness', e => readinessLabels[e.readiness]], ['Editorial verdict', e => e.assessment?.verdict ?? 'Not assessed'],
    ['Adoption signals', e => e.assessment?.adoption ?? 'Not assessed'],
    ['Developer experience', e => e.assessment?.dx ?? 'Not assessed'],
    ['Maintenance', e => e.assessment?.maintenance ?? 'Not assessed'],
    ['Compatibility & access', e => e.assessment?.compatibility ?? 'Not assessed'],
    ['License / access', e => e.assessment?.license ?? 'Not assessed'],
    ['Deployment', e => e.assessment?.deployment ?? 'Not assessed'],
    ['Related tasks', e => e.tasks.map(id => tasks.find(t => t.id === id)?.title).join(' · ')],
    ['Constraints', e => e.assessment?.limitations.join(' ') ?? e.scope_note ?? 'Not assessed'],
    ['Evidence reviewed', e => e.assessment ? formatDate(e.assessment.reviewed) : 'Assessment pending'],
  ];
  function render() {
    const selected = getSelection();
    const entries = selected.map(s => findEntry(s)!);
    document.getElementById('comparison-empty')!.hidden = !!selected.length;
    document.getElementById('comparison-content')!.hidden = !selected.length;
    select.disabled = selected.length === 3;
    for (const option of select.options) option.disabled = selected.includes(option.value);
    select.value = '';
    (document.getElementById('share-comparison') as HTMLButtonElement).disabled = !selected.length;
    (document.getElementById('clear-comparison-page') as HTMLButtonElement).disabled = !selected.length;
    const caption = document.createElement('caption'); caption.className = 'sr-only'; caption.textContent = 'Solution evidence comparison';
    const head = document.createElement('thead'); const headRow = document.createElement('tr');
    const corner = document.createElement('th'); corner.scope = 'col'; corner.textContent = 'THE BUILDING BLOCKS'; headRow.append(corner);
    entries.forEach(e => {
      const th = document.createElement('th'); th.scope = 'col';
      const a = document.createElement('a'); a.href = `/solutions/${e.slug}/`; a.textContent = e.name;
      const remove = document.createElement('button'); remove.className = 'text-button'; remove.type = 'button'; remove.textContent = 'Remove ×';
      remove.setAttribute('aria-label', `Remove ${e.name} from comparison`);
      remove.addEventListener('click', () => {
        setSelection(getSelection().filter(s => s !== e.slug));
        // render() replaces the table, including the activated removal button.
        (table.querySelector<HTMLButtonElement>('thead button') ?? select).focus();
      });
      th.append(a, remove); headRow.append(th);
    });
    head.append(headRow); const body = document.createElement('tbody');
    rows.forEach(([label, value]) => {
      const row = document.createElement('tr'); const th = document.createElement('th'); th.scope = 'row'; th.textContent = label; row.append(th);
      entries.forEach(e => {
        const cell = document.createElement('td'); cell.textContent = value(e);
        if (label === 'Readiness') cell.className = `readiness-cell ${e.readiness}`;
        if (cell.textContent === 'Not assessed') cell.classList.add('muted');
        row.append(cell);
      }); body.append(row);
    });
    const evidenceRow = document.createElement('tr'); const evidenceLabel = document.createElement('th'); evidenceLabel.scope = 'row'; evidenceLabel.textContent = 'Primary sources'; evidenceRow.append(evidenceLabel);
    entries.forEach(e => {
      const td = document.createElement('td');
      const links = e.assessment?.evidence ?? e.urls.map(url => ({ url, title: 'Catalog source (not assessed)' }));
      links.forEach(source => {
        const a = document.createElement('a'); a.href = source.url; a.target = '_blank'; a.rel = 'noopener'; a.textContent = source.title + ' ↗'; td.append(a);
      }); evidenceRow.append(td);
    }); body.append(evidenceRow); table.replaceChildren(caption, head, body);
    const url = new URL(location.href); if (selected.length) url.searchParams.set('with', selected.join(',')); else url.searchParams.delete('with');
    history.replaceState(null, '', url);
  }
  select.addEventListener('change', () => { if (select.value) setSelection([...getSelection(), select.value]); });
  document.getElementById('clear-comparison-page')!.addEventListener('click', () => { setSelection([]); select.focus(); });
  document.getElementById('share-comparison')!.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(location.href); announce('Comparison link copied.'); }
    catch {
      document.getElementById('share-fallback')!.hidden = false;
      const input = document.getElementById('share-url') as HTMLInputElement; input.value = location.href; input.focus(); input.select();
      announce('Select and copy the comparison URL.');
    }
  });
  document.addEventListener('comparison:change', render);
  window.addEventListener('popstate', () => setSelection(sanitizeSelection(new URLSearchParams(location.search).get('with')?.split(',') ?? [])));
  const raw = new URLSearchParams(location.search).get('with');
  if (raw && raw.split(',').length !== getSelection().length) {
    const notice = document.getElementById('comparison-notice')!; notice.hidden = false; notice.textContent = 'Unknown or duplicate entries were removed. A comparison holds up to three solutions.';
  }
  render();
}
