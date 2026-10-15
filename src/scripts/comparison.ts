import { findEntry } from '../lib/catalog';
import { sanitizeSelection, toggleSelection } from '../lib/explorer';

const key = 'away-comparison-v1';
let selected: string[] = [];
try { selected = sanitizeSelection(JSON.parse(localStorage.getItem(key) ?? '[]')); } catch { /* Storage is optional. */ }
const initialParams = new URLSearchParams(location.search);
if (location.pathname.startsWith('/compare') && initialParams.has('with')) selected = sanitizeSelection(initialParams.get('with')!.split(','));

export function getSelection(): string[] { return [...selected]; }
export function announce(message: string): void {
  const toast = document.getElementById('announcement');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('visible');
  window.clearTimeout(Number(toast.dataset.timer));
  toast.dataset.timer = String(window.setTimeout(() => toast.classList.remove('visible'), 3500));
}
export function setSelection(input: unknown): void {
  selected = sanitizeSelection(input);
  try { localStorage.setItem(key, JSON.stringify(selected)); } catch { /* Retain in-memory selection. */ }
  refreshComparison();
  document.dispatchEvent(new CustomEvent('comparison:change'));
}
export function addOrRemove(slug: string): void {
  const result = toggleSelection(selected, slug);
  if (result.full) { announce('Your shortlist holds three solutions. Remove one to add another.'); return; }
  setSelection(result.selected);
}
export function refreshComparison(): void {
  document.querySelectorAll<HTMLElement>('[data-compare-count]').forEach(e => { e.textContent = String(selected.length); });
  document.querySelectorAll<HTMLButtonElement>('[data-compare]').forEach(button => {
    const active = selected.includes(button.dataset.compare!);
    const name = findEntry(button.dataset.compare!)?.name ?? 'solution';
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute('aria-label', `${active ? 'Remove' : 'Add'} ${name} ${active ? 'from' : 'to'} comparison`);
    button.classList.toggle('selected', active);
    const label = button.querySelector('[data-compare-label]');
    if (label) label.textContent = active ? 'Added to comparison' : 'Add to comparison';
  });
  const tray = document.getElementById('compare-tray');
  if (tray) tray.hidden = selected.length === 0 || location.pathname.startsWith('/compare');
  const holder = document.getElementById('compare-selection');
  if (holder) holder.replaceChildren(...selected.map(slug => {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = `${findEntry(slug)?.name} ×`;
    button.setAttribute('aria-label', `Remove ${findEntry(slug)?.name} from comparison`);
    button.addEventListener('click', () => {
      const index = selected.indexOf(slug);
      addOrRemove(slug);
      const remaining = holder.querySelectorAll<HTMLButtonElement>('button');
      const next = remaining[Math.min(index, remaining.length - 1)] ?? document.querySelector<HTMLAnchorElement>('.nav-compare');
      next?.focus();
    });
    return button;
  }));
  const href = '/compare/' + (selected.length ? `?with=${selected.join(',')}` : '');
  document.querySelectorAll<HTMLAnchorElement>('.nav-compare, #compare-tray-link').forEach(a => { a.href = href; });
}
document.addEventListener('click', event => {
  const target = (event.target as Element).closest<HTMLButtonElement>('[data-compare]');
  if (target) addOrRemove(target.dataset.compare!);
});
document.getElementById('compare-clear')?.addEventListener('click', () => {
  setSelection([]);
  document.querySelector<HTMLAnchorElement>('.nav-compare')?.focus();
});
window.addEventListener('storage', event => {
  if (event.key !== key) return;
  try { selected = sanitizeSelection(JSON.parse(event.newValue ?? '[]')); } catch { selected = []; }
  refreshComparison(); document.dispatchEvent(new CustomEvent('comparison:change'));
});
// An explicit shared URL becomes the current shortlist, including on later pages.
setSelection(selected);
