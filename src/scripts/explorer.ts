import { catalog, tasks } from '../lib/catalog';
import { filterCatalog, readFilters, writeFilters, type Filters } from '../lib/explorer';
import { refreshComparison } from './comparison';

const explorer = document.querySelector<HTMLElement>('[data-explorer]');
if (explorer) {
  const form = document.getElementById('filters') as HTMLFormElement;
  const tbody = document.getElementById('catalog-rows')!;
  const rows = new Map([...tbody.querySelectorAll<HTMLTableRowElement>('[data-entry]')].map(e => [e.dataset.entry!, e]));
  let filters = readFilters(new URLSearchParams(location.search));
  let limit = 18;

  function syncControls() {
    for (const name of ['q', 'domain', 'kind', 'readiness', 'sort'] as const) {
      (form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement).value = filters[name];
    }
    document.querySelectorAll<HTMLElement>('[data-task]').forEach(a => {
      const active = a.dataset.task === filters.task;
      a.classList.toggle('active', active);
      if (active) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    // Reveal the active task horizontally without moving the page vertically.
    const rail = explorer!.querySelector<HTMLElement>('.task-links')!;
    const active = rail.querySelector<HTMLElement>('.task-link.active');
    if (active && rail.scrollWidth > rail.clientWidth) {
      const linkRect = active.getBoundingClientRect();
      const railRect = rail.getBoundingClientRect();
      if (linkRect.left < railRect.left || linkRect.right > railRect.right) {
        rail.scrollLeft += linkRect.left - railRect.left;
      }
    }
    document.querySelectorAll<HTMLElement>('[data-stack-domain]').forEach(a => { a.classList.toggle('active', a.dataset.stackDomain === filters.domain); });
  }
  function render() {
    const found = filterCatalog(catalog, filters);
    const visible = new Set(found.slice(0, limit).map(e => e.slug));
    for (const [slug, row] of rows) row.hidden = !visible.has(slug);
    // Keep original rows for fast filtering and reorder only the matched rows.
    for (const entry of found) tbody.append(rows.get(entry.slug)!);
    document.getElementById('result-count')!.textContent = `${found.length} building block${found.length === 1 ? '' : 's'} · ${found.filter(e => e.assessment).length} assessed`;
    document.getElementById('empty-results')!.hidden = found.length > 0;
    document.querySelector<HTMLElement>('.table-scroll')!.hidden = found.length === 0;
    document.getElementById('shown-count')!.textContent = found.length ? `Showing ${Math.min(limit, found.length)} of ${found.length}` : '';
    document.getElementById('load-more')!.hidden = limit >= found.length;
    const task = tasks.find(t => t.id === filters.task);
    document.getElementById('task-context')!.hidden = !task;
    document.getElementById('task-context')!.dataset.task = filters.task;
    if (task) {
      document.getElementById('task-question')!.textContent = task.question;
      document.getElementById('task-title')!.textContent = task.title;
      document.getElementById('task-guide')!.textContent = task.guide;
      document.getElementById('task-caveat')!.textContent = task.caveat;
      (document.getElementById('task-caveat-source') as HTMLAnchorElement).href = `/solutions/${task.caveatSource}/#evidence`;
    }
    const reset = document.getElementById('clear-filters') as HTMLButtonElement;
    reset.disabled = !Object.entries(filters).some(([k,v]) => k !== 'sort' && !!v);
    syncControls(); refreshComparison();
  }
  function update(next: Filters, replace = false) {
    filters = readFilters(writeFilters(next)); limit = 18;
    const params = writeFilters(filters).toString();
    const url = `${location.pathname}${params ? `?${params}` : ''}${location.hash}`;
    if (replace) history.replaceState(null, '', url); else history.pushState(null, '', url);
    render();
  }
  form.addEventListener('submit', event => event.preventDefault());
  // The sort control is form-associated but lives outside the form's DOM tree.
  explorer.addEventListener('input', event => {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    update({ ...filters, [target.name]: target.value }, target.name === 'q');
  });
  document.querySelectorAll<HTMLAnchorElement>('[data-task]').forEach(a => a.addEventListener('click', event => {
    event.preventDefault(); update({ ...filters, task: a.dataset.task! });
  }));
  document.querySelectorAll<HTMLAnchorElement>('[data-stack-domain]').forEach(a => a.addEventListener('click', event => {
    event.preventDefault(); update({ ...filters, domain: a.dataset.stackDomain! });
    document.getElementById('catalog')!.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }));
  for (const id of ['clear-filters', 'empty-reset']) document.getElementById(id)?.addEventListener('click', () => update({}));
  document.getElementById('load-more')!.addEventListener('click', () => {
    const previousLimit = limit; limit += 30; render();
    const found = filterCatalog(catalog, filters);
    rows.get(found[previousLimit]?.slug)?.querySelector<HTMLAnchorElement>('.solution-name')?.focus({ preventScroll: true });
  });
  window.addEventListener('popstate', () => { filters = readFilters(new URLSearchParams(location.search)); limit = 18; render(); });
  document.addEventListener('keydown', event => {
    if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey && !['INPUT','TEXTAREA','SELECT'].includes((event.target as Element).tagName)) {
      event.preventDefault(); (form.elements.namedItem('q') as HTMLInputElement).focus();
    }
  });
  render();
}
