// Usage: node tools/fetch-images.mjs <products.json> <rawDir>
// Downloads up to 8 photos per product (WebP in public/img), writes src/data.json
// (prices, options, variants, cleaned description) and the store policies to src/policies.json.
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SHOP = 'https://hightech94-store.myshopify.com';
const [, , feed, rawDir] = process.argv;
const root = path.resolve(import.meta.dirname, '..');
const outImg = path.join(root, 'public/img');
const { products } = JSON.parse(await fs.readFile(feed, 'utf8'));
await fs.mkdir(rawDir, { recursive: true });

const strip = (html) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
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
  const pics = p.images.slice(0, 8);
  const imgs = [];
  const photo = []; // indices of photos with a coloured backdrop (shown full-bleed, not on the grey card)
  for (const [i, im] of pics.entries()) {
    const name = `${p.handle.slice(0, 40)}-${i}.webp`;
    const out = path.join(outImg, name);
    if (!(await fs.stat(out).catch(() => null))) {
      const raw = path.join(rawDir, `${n}-${i}`);
      const res = await fetch(`${im.src}${im.src.includes('?') ? '&' : '?'}width=1200`);
      await fs.writeFile(raw, Buffer.from(await res.arrayBuffer()));
      await sharp(raw).resize(1000, 1000, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 84 }).toFile(out);
    }
    imgs.push(`/img/${name}`);
    const { data: px, info } = await sharp(out).resize(40, 40, { fit: 'fill' }).raw().toBuffer({ resolveWithObject: true });
    const at = (x, y) => [...px.subarray((y * 40 + x) * info.channels, (y * 40 + x) * info.channels + 3)];
    if ([at(1, 1), at(38, 1), at(1, 38), at(38, 38)].filter((c) => Math.min(...c) < 225).length >= 2) photo.push(i);
  }
  const ids = pics.map((im) => im.id);
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
      price: +v.price,
      compare: v.compare_at_price ? +v.compare_at_price : 0,
      available: v.available,
      opts: [v.option1, v.option2, v.option3].filter((o) => o !== null),
      img: v.featured_image ? ids.indexOf(v.featured_image.id) : -1,
    })),
    images: imgs,
    photo,
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
console.log(`${data.length} products, ${data.reduce((s, d) => s + d.images.length, 0)} images`);
