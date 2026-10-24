// Usage: node tools/parity.mjs — runs the same scroll script on desktop and phone and prints, side by
// side, what moves: video time, pinned sections, ticker strips, 3D carousel, letters, sliced photos.
import puppeteer from 'puppeteer-core';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const results = {};
for (const [name, vp] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844, isMobile: true, hasTouch: true }]]) {
  const p = await b.newPage();
  await p.setViewport(vp);
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  const r = (results[name] = {});
  const to = async (sel, extra = 0) => { await p.evaluate((s, e) => scrollTo(0, document.querySelector(s).getBoundingClientRect().top + scrollY + e), sel, extra); await wait(1500); };
  await p.goto('http://localhost:5950/', { waitUntil: 'networkidle0' });
  await wait(3500);
  await p.evaluate(() => scrollTo(0, innerHeight * 1.35)); await wait(1800);
  // desktop scrubs the video, phones draw the same frames on a canvas
  r['hero: exploded view at 45%'] = await p.evaluate(() => {
    const v = document.querySelector('.hero__video');
    if (v.tagName === 'VIDEO') return `video at ${v.currentTime.toFixed(1)} s`;
    const d = v.getContext('2d').getImageData(v.width / 2 | 0, v.height * 0.45 | 0, 1, 1).data;
    return d[3] ? `canvas frame drawn (${d[0]},${d[1]},${d[2]})` : 'canvas EMPTY';
  });
  r['hero: title hidden, caption shown'] = await p.evaluate(() => `${getComputedStyle(document.querySelector('.hero__l')).opacity} / ${getComputedStyle(document.querySelector('.hero__ch--2')).opacity}`);
  r['hero: labels visible'] = await p.evaluate(() => ['.hero__tag-l', '.hero__tag-r', '.hero__p', '.hero__avatars'].filter((s) => getComputedStyle(document.querySelector(s)).display !== 'none').length + '/4');
  await to('.moments', 200);
  r['moments: letters settled'] = await p.evaluate(() => { const c = [...document.querySelectorAll('.moments__h .ch')]; return c.filter((e) => +getComputedStyle(e).opacity > 0.95).length + '/' + c.length; });
  r['moments: thumb + cross shown'] = await p.evaluate(() => ['.moments__thumb', '.moments__cross'].filter((s) => getComputedStyle(document.querySelector(s)).display !== 'none').length + '/2');
  const m0 = await p.evaluate(() => document.querySelector('.marq__in').style.transform);
  await p.evaluate(() => scrollBy(0, 600)); await wait(400);
  const m1 = await p.evaluate(() => document.querySelector('.marq__in').style.transform);
  r['ticker moves with scroll'] = m0 !== m1 ? 'yes' : 'NO';
  await to('.cats', 0);
  const c0 = await p.evaluate(() => document.querySelector('.cats__lab').textContent);
  await p.evaluate(() => scrollBy(0, innerHeight * 1.6)); await wait(1500);
  r['categories: pinned + advancing'] = await p.evaluate((c0) => `top ${Math.round(document.querySelector('.cats').getBoundingClientRect().top)} · ${c0} → ${document.querySelector('.cats__lab').textContent}`, c0);
  await to('#selection', -200);
  r['carousel: 3D card angles'] = await p.evaluate(() => [...document.querySelectorAll('.card')].slice(0, 4).map((c) => (c.style.transform.match(/rotateY\((-?[\d.]+)deg/) || [, '0'])[1]).join(' '));
  await to('.cols', 0);
  r['sliced photos offset while scrolling'] = await p.evaluate(() => [...document.querySelectorAll('.cols__item:first-child .sl')].map((s) => getComputedStyle(s).transform !== 'none' ? 'moved' : 'still').join(','));
  r['buttons: text roll'] = await p.evaluate(() => (matchMedia('(hover: hover)').matches ? 'on hover' : `${document.querySelectorAll('.rolled').length} rolled in view`));
  await p.goto('http://localhost:5950/categorie/', { waitUntil: 'networkidle0' }); await wait(2500);
  await p.evaluate(() => scrollTo(0, 900)); await wait(1500);
  r['category cards: 3D tilt'] = await p.evaluate(() => (matchMedia('(hover: hover)').matches ? 'follows cursor' : [...document.querySelectorAll('.pcard__img')].slice(0, 3).map((f) => (f.style.transform.match(/rotateX\((-?[\d.]+)/) || [, '0'])[1]).join(' ')));
  r['category cards: photo swap'] = await p.evaluate(() => (matchMedia('(hover: hover)').matches ? 'on hover' : document.querySelectorAll('.pcard.is-hot').length + ' card(s) swapped'));
  await p.goto('http://localhost:5950/produit/montre-connectee-kayrox-pro-cardio-spo2-appels-bluetooth/', { waitUntil: 'networkidle0' }); await wait(3500);
  r['product gallery: 3D'] = await p.evaluate(() => (matchMedia('(hover: hover)').matches ? 'follows cursor' : 'sway ' + (document.querySelector('.pdp__stage').style.transform.match(/rotateY\((-?[\d.]+)/) || [, '0'])[1] + '°'));
  await to('.story', vp.height * 0.75 * 2.4); // into the 3rd card of the pinned story
  r['product story: pinned, card + letters'] = await p.evaluate(() => `top ${Math.round(document.querySelector('.story').getBoundingClientRect().top)} · ${document.querySelector('.story__count').textContent} · visible cards ${[...document.querySelectorAll('.scard')].filter((c) => +getComputedStyle(c).opacity > 0.5).length}`);
  r['page width'] = await p.evaluate(() => `${document.documentElement.scrollWidth}/${innerWidth}`);
  r.errors = errs.length ? errs.join(' | ') : 'none';
  await p.close();
}
await b.close();
for (const k of Object.keys(results.desktop)) console.log(k.padEnd(40), '|', String(results.desktop[k]).padEnd(34), '|', results.mobile[k]);
