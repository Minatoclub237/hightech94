// Usage: node tools/fetch-images.mjs [products.json] [rawDir]
// Without arguments it downloads the live feed from the Shopify store.
// Downloads up to 8 photos per product (WebP in public/img), orders them with tools/curation.json
// (clean product shots first), writes src/data.json and the store policies to src/policies.json.
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { SHOP, CONTENT_KEYS } from '../src/catalog.js';

const [, , feed, rawArg] = process.argv;
const rawDir = rawArg ?? path.join(os.tmpdir(), 'ht94-raw');
const root = path.resolve(import.meta.dirname, '..');
const outImg = path.join(root, 'public/img');
const { products } = feed
  ? JSON.parse(await fs.readFile(feed, 'utf8'))
  : await (await fetch(`${SHOP}/products.json?limit=250`)).json();
const curation = JSON.parse(await fs.readFile(path.join(root, 'tools/curation.json'), 'utf8'));
await fs.mkdir(rawDir, { recursive: true });
await fs.mkdir(outImg, { recursive: true });

const strip = (html) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  .replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, '’').replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ');
// keep text markup only: no scripts, styles, attributes or other tags
const TAGS = 'h2|h3|p|ul|ol|li|strong|b|em|br';
const clean = (html) => html
  .replace(/<(script|style|iframe)[\s\S]*?<\/\1>/gi, '')
  .replace(new RegExp(`<(/?)(${TAGS})\\b[^>]*>`, 'gi'), '<$1$2>')
  .replace(new RegExp(`<(?!/?(${TAGS})>)[^>]+>`, 'gi'), '')
  .replace(/<p>\s*<\/p>/g, '');

const data = [];
for (const p of products) {
  if (!p.product_type) continue; // "Shipping Protection" add-on
  const n = data.length;
  const shots = [];
  for (const [j, im] of p.images.slice(0, 8).entries()) {
    const name = `${p.handle.slice(0, 40)}-${j}.webp`;
    const out = path.join(outImg, name);
    if (!(await fs.stat(out).catch(() => null))) {
      const raw = path.join(rawDir, `${n}-${j}`);
      const res = await fetch(`${im.src}${im.src.includes('?') ? '&' : '?'}width=1200`);
      await fs.writeFile(raw, Buffer.from(await res.arrayBuffer()));
      await sharp(raw).resize(1000, 1000, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 84 }).toFile(out);
    }
    // photo with a coloured backdrop (shown full-bleed) vs cut-out on white (shown on the grey card)
    const { data: px, info } = await sharp(out).resize(40, 40, { fit: 'fill' }).raw().toBuffer({ resolveWithObject: true });
    const at = (x, y) => [...px.subarray((y * 40 + x) * info.channels, (y * 40 + x) * info.channels + 3)];
    const photo = [at(1, 1), at(38, 1), at(1, 38), at(38, 38)].filter((c) => Math.min(...c) < 225).length >= 2;
    shots.push({ id: im.id, src: `/img/${name}`, cdn: im.src, photo });
  }
  // curated order (new products not yet curated keep the store's order)
  const order = curation[p.handle]?.length === shots.length ? curation[p.handle] : shots.map((s, i) => i);
  const pics = order.map((i) => shots[i]);
  const ids = pics.map((s) => s.id);
  const prices = p.variants.map((v) => +v.price);
  const h2 = p.body_html.match(/<h2[^>]*>(.*?)<\/h2>/is);
  const p1 = p.body_html.match(/<p[^>]*>(.*?)<\/p>/is);
  data.push({
    title: p.title,
    handle: p.handle,
    type: p.product_type,
    min: Math.min(...prices),
    max: Math.max(...prices),
    tagline: h2 ? strip(h2[1]) : '',
    excerpt: p1 ? strip(p1[1]) : '',
    desc: clean(p.body_html),
    options: p.options.map((o) => ({ name: o.name, values: o.values })),
    variants: p.variants.map((v) => ({
      id: v.id,
      title: v.title,
      sku: v.sku || '',
      price: +v.price,
      compare: v.compare_at_price ? +v.compare_at_price : 0,
      available: v.available,
      opts: [v.option1, v.option2, v.option3].filter((o) => o !== null),
      img: v.featured_image ? ids.indexOf(v.featured_image.id) : -1,
    })),
    images: pics.map((s) => s.src),
    cdn: pics.map((s) => s.cdn),
    photo: pics.flatMap((s, i) => (s.photo ? [i] : [])),
    updated: p.updated_at,
  });
}
await fs.writeFile(path.join(root, 'src/data.json'), JSON.stringify(data));

const policies = {};
for (const h of ['shipping-policy', 'refund-policy', 'privacy-policy', 'terms-of-service']) {
  const html = await (await fetch(`${SHOP}/policies/${h}`)).text();
  policies[h] = {
    title: strip(html.match(/<h1[^>]*>(.*?)<\/h1>/is)?.[1] ?? h),
    html: clean(html.match(/shopify-policy__body[^>]*>([\s\S]*?)<\/div>\s*<\/div>/)?.[1] ?? ''),
  };
}
await fs.writeFile(path.join(root, 'src/policies.json'), JSON.stringify(policies));

// the owner's own content pages (Shopify → Boutique en ligne → Pages)
const pages = {};
for (const h of CONTENT_KEYS) {
  const html = await (await fetch(`${SHOP}/pages/${h}`)).text();
  const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0] ?? html;
  pages[h] = {
    title: strip(main.match(/<h1[^>]*>(.*?)<\/h1>/is)?.[1] ?? h),
    html: clean(main.match(/<div[^>]*class="[^"]*\brte\b[^"]*"[^>]*>([\s\S]*?)<\/div>/i)?.[1] ?? ''),
  };
}
await fs.writeFile(path.join(root, 'src/pages.json'), JSON.stringify(pages));
console.log(`${data.length} products, ${data.reduce((s, d) => s + d.images.length, 0)} images`);
