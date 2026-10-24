import { defineConfig } from 'vite';
import { readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));

// every page written by tools/prerender.mjs (home, products, categories, legal pages)
const pages = (dir) => readdirSync(join(root, dir), { withFileTypes: true }).flatMap((e) => {
  if (e.isDirectory()) return pages(join(dir, e.name));
  return e.name === 'index.html' ? [resolve(root, dir, e.name)] : [];
});

export default defineConfig({
  build: {
    rollupOptions: {
      input: [resolve(root, 'index.html'), ...['produit', 'categorie', 'page'].flatMap(pages)],
    },
  },
});
