import { defineConfig } from 'vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        produit: resolve(root, 'produit/index.html'),
        categorie: resolve(root, 'categorie/index.html'),
        page: resolve(root, 'page/index.html'),
      },
    },
  },
});
