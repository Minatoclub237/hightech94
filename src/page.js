import { gsap, reveal, shell, POLICY_KEYS, pagePath } from './shared.js';
import { legalHTML } from './catalog.js';
import policies from './policies.json';

const PAGES = {
  'mentions-legales': { title: 'Mentions légales', html: legalHTML() },
  ...Object.fromEntries(POLICY_KEYS.map((k) => [k, policies[k]])),
};
const key = location.pathname.match(/\/page\/([^/]+)/)?.[1] ?? new URLSearchParams(location.search).get('p');
const pol = PAGES[key] ?? PAGES['mentions-legales'];
document.title = `${pol.title} — High Tech 94`;

shell(`
<section class="legal">
  <p class="mono">[Informations]</p>
  <h1 class="h2"><span class="ln"><span>${pol.title}</span></span></h1>
  <nav class="chips">${Object.entries(PAGES).map(([k, p]) =>
    `<a class="chip${p === pol ? ' on' : ''}" href="${pagePath(k)}">${p.title}</a>`).join('')}</nav>
  <div class="rte" data-blur>${pol.html}</div>
</section>`);

gsap.fromTo('.legal .ln > span', { yPercent: 110 }, { yPercent: 0, duration: 1.3, ease: 'expo.out', delay: 0.55 });
reveal();
