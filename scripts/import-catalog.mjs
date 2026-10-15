import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const source = new URL('../../landscape/', import.meta.url);
const catalog = await readFile(new URL('project-catalog.json', source), 'utf8');
const parsed = JSON.parse(catalog);
if (!Array.isArray(parsed.entries) || !parsed.entries.length) throw new Error('Source catalog is empty or invalid.');
await mkdir(new URL('src/data/', root), { recursive: true });
await mkdir(new URL('public/downloads/', root), { recursive: true });
await writeFile(new URL('src/data/catalog.json', root), catalog);
for (const file of ['project-catalog.json', 'project-catalog.csv', 'ai-oss-landscape-en-outlined.svg', 'ai-oss-landscape-en-print.pdf']) {
  await copyFile(new URL(file, source), new URL(`public/downloads/${file}`, root));
}
console.log(`Imported ${parsed.entries.length} entries. Original artwork remains the September 30 edition.`);
