// Usage: node tools/smoke.mjs — clicks through cart, search, filters and links on the local site.
import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 900 });
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const go = async (u) => { await p.goto(`http://localhost:5950${u}`, { waitUntil: 'networkidle0' }); await wait(1800); };

await go('/');
const links = await p.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')));
console.log('home links to old Shopify product/collection pages:', links.filter((h) => /myshopify\.com\/(products|collections)/.test(h)).length);
await go('/produit/?p=montre-connectee-kayrox-pro-cardio-spo2-appels-bluetooth');
console.log('pdp title:', await p.$eval('.pdp__title', (e) => e.textContent.trim()), '| chips:', await p.$$eval('.opt .chip', (c) => c.length));
await p.click('.opt .chip:nth-child(3)'); await wait(300);
await p.click('[data-dq="1"]'); await p.click('.buy__add'); await wait(1200);
console.log('badge:', await p.$eval('.badge', (e) => e.textContent), '| cart rows:', await p.$$eval('.ci', (c) => c.length), '| checkout:', await p.$eval('.cart__go', (e) => e.href));
await go('/categorie/?t=Accessoires%20auto');
console.log('category cards:', await p.$$eval('.pcard', (c) => c.length), '| title:', await p.$eval('.plp__t', (e) => e.textContent));
await p.click('[data-t=""]'); await wait(1500);
console.log('after "Tout" chip:', await p.$$eval('.pcard', (c) => c.length), '| badge persisted:', await p.$eval('.badge', (e) => e.textContent));
await p.click('[data-search]'); await wait(900); await p.type('.search__bar input', 'camera');
console.log('search "camera":', await p.$$eval('.sr', (c) => c.length));
await go('/page/?p=refund-policy');
console.log('policy:', await p.$eval('.legal h1', (e) => e.textContent), '| chars:', await p.$eval('.rte', (e) => e.textContent.length));
console.log('errors:', errs.length ? errs : 'none');
await b.close();
