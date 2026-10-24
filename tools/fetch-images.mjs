// Usage: node tools/fetch-images.mjs <products.json> <rawDir>
// Downloads up to 3 photos per product, converts them to WebP in public/img,
// writes src/data.json and a numbered contact sheet in <rawDir>/sheet.png.
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const [, , feed, rawDir] = process.argv;
const root = path.resolve(import.meta.dirname, '..');
const outImg = path.join(root, 'public/img');
const { products } = JSON.parse(await fs.readFile(feed, 'utf8'));
await fs.mkdir(rawDir, { recursive: true });

const strip = (html) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const data = [];

for (const p of products) {
  if (!p.product_type) continue; // "Shipping Protection" add-on
  const imgs = [];
  for (const [i, im] of p.images.slice(0, 3).entries()) {
    const raw = path.join(rawDir, `${data.length}-${i}`);
    const res = await fetch(`${im.src}${im.src.includes('?') ? '&' : '?'}width=1200`);
    await fs.writeFile(raw, Buffer.from(await res.arrayBuffer()));
    const name = `${p.handle.slice(0, 40)}-${i}.webp`;
    await sharp(raw).resize(1000, 1000, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 84 }).toFile(path.join(outImg, name));
    imgs.push(`/img/${name}`);
  }
  const prices = p.variants.map((v) => +v.price);
  const h2 = p.body_html.match(/<h2[^>]*>(.*?)<\/h2>/i);
  data.push({
    title: p.title,
    handle: p.handle,
    type: p.product_type,
    min: Math.min(...prices),
    max: Math.max(...prices),
    variants: p.variants.length,
    tagline: h2 ? strip(h2[1]) : '',
    images: imgs,
  });
}
await fs.writeFile(path.join(root, 'src/data.json'), JSON.stringify(data, null, 1));

// Contact sheet: first image of each product, numbered.
const tile = 200, cols = 6;
const rows = Math.ceil(data.length / cols);
const comps = await Promise.all(data.map(async (d, i) => ({
  input: await sharp(path.join(root, 'public', d.images[0])).resize(tile, tile, { fit: 'contain', background: '#fff' })
    .composite([{ input: Buffer.from(`<svg width="${tile}" height="24"><rect width="34" height="24" fill="#000"/><text x="4" y="18" font-size="16" fill="#fff" font-family="Arial">${i}</text></svg>`), top: 0, left: 0 }])
    .png().toBuffer(),
  left: (i % cols) * tile, top: Math.floor(i / cols) * tile,
})));
await sharp({ create: { width: cols * tile, height: rows * tile, channels: 3, background: '#fff' } })
  .composite(comps).png().toFile(path.join(rawDir, 'sheet.png'));
console.log(`${data.length} products, ${data.reduce((n, d) => n + d.images.length, 0)} images`);
