// Usage: node tools/brand.mjs <black-background.jpg> <white-background.jpg>
// Crops the 3D logo renders into the header lockup, the footer logo and the favicons.
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const [, , dark, light] = process.argv;
const root = path.resolve(import.meta.dirname, '..');
const out = (f) => path.join(root, 'public', f);
await fs.mkdir(out('brand'), { recursive: true });

// boxes measured on both renders (same composition): monogram and wordmark, with breathing room
const MONO = { left: 351, top: 128, width: 510, height: 520 };
const WORD = { left: 234, top: 642, width: 728, height: 107 };
const FULL = { left: 214, top: 108, width: 768, height: 660 };
// the white render's backdrop (234, darker in the vignetted corners) becomes pure white:
// neutral pixels above 226 go white, 200-226 ramp towards white, the metal below is untouched
async function whiten(box, a, b) {
  const { data, info } = await sharp(light).extract(box).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 3) {
    const L = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const t = Math.min(1, Math.max(0, (L - 200) / 26));
    for (let c = 0; c < 3; c++) data[i + c] = Math.min(255, Math.max(0, (data[i + c] + (255 - data[i + c]) * t) * a + b));
  }
  return sharp(data, { raw: info });
}

// header lockup: monogram + wordmark side by side on white (the wordmark stays legible at 52 px high)
// silver on white is faint at header size: stretch the metal's contrast (a·v + b keeps 255 at 255)
const mono = await (await whiten(MONO, 1.25, -62)).resize({ height: 180 }).png().toBuffer();
const word = await (await whiten(WORD, 1.6, -150)).resize({ height: 64 }).png().toBuffer();
const mw = (await sharp(mono).metadata()).width;
const ww = (await sharp(word).metadata()).width;
await sharp({ create: { width: mw + 18 + ww + 26, height: 180, channels: 3, background: '#fff' } })
  .composite([{ input: mono, left: 0, top: 0 }, { input: word, left: mw + 18, top: 58 }])
  .webp({ quality: 90 }).toFile(out('brand/lockup-light.webp'));
await (await whiten(MONO, 1.25, -62)).resize(192, 192, { fit: 'cover' }).webp({ quality: 90 }).toFile(out('brand/mark-light.webp'));

// footer + page curtain: the full stacked logo on its black backdrop
await sharp(dark).extract(FULL).resize({ width: 720 }).webp({ quality: 90 }).toFile(out('brand/logo-dark.webp'));

// favicons: silver monogram on black reads best at 32 px
const fav = sharp(dark).extract({ left: 346, top: 128, width: 520, height: 520 }).linear(1.3, 0);
for (const [s, f] of [[32, 'favicon-32.png'], [192, 'favicon-192.png'], [180, 'apple-touch-icon.png']]) {
  await fav.clone().resize(s, s).png().toFile(out(f));
}

// seam check: the lockup edges must be pure white, or the plate shows a box on white pages
const { data, info } = await sharp(out('brand/lockup-light.webp')).raw().toBuffer({ resolveWithObject: true });
const px = (x, y) => data[(y * info.width + x) * info.channels];
console.log('lockup', `${info.width}x${info.height}`, 'edge values', [px(2, 2), px(info.width - 3, 2), px(2, info.height - 3), px(mw + 30, 10), px(mw + 30, 170)].join(','));
