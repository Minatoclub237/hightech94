// Usage: node tools/shot.mjs <outDir> [width] [height] [cols]
// Scrolls the local site, screenshots each viewport step and tiles them into one sheet.
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import path from 'node:path';

const [, , out, w = 1440, h = 900, cols = 2, route = '/', max = 99, name = 'sheet'] = process.argv;
const W = +w, H = +h, mobile = W < 600;
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  args: ['--hide-scrollbars'],
});
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
page.on('console', (m) => m.type() === 'error' && console.log('console:', m.text()));
page.on('pageerror', (e) => console.log('pageerror:', e.message));
await page.goto(`http://localhost:5950${route}`, { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 2500));

const total = await page.evaluate(() => document.documentElement.scrollHeight);
const shots = [];
for (let y = 0; y < total && shots.length < +max; y += Math.round(H * 0.85)) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await new Promise((r) => setTimeout(r, 1400));
  shots.push(await page.screenshot());
}
await browser.close();

const tw = Math.round(W / (mobile ? 1.6 : 2)), th = Math.round(H / (mobile ? 1.6 : 2));
const C = +cols, R = Math.ceil(shots.length / C);
const comps = await Promise.all(shots.map(async (s, i) => ({
  input: await sharp(s).resize(tw, th).png().toBuffer(), left: (i % C) * (tw + 6), top: Math.floor(i / C) * (th + 6),
})));
const file = path.join(out, `${name}-${W}.png`);
await sharp({ create: { width: C * (tw + 6), height: R * (th + 6), channels: 3, background: '#ff00ff' } }).composite(comps).png().toFile(file);
console.log(`page height ${total}px, ${shots.length} shots -> ${file}`);
