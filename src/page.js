import { gsap, reveal, shell, I, POLICY_KEYS, CONTENT_KEYS, pagePath } from './shared.js';
import { legalHTML, faqPairs } from './catalog.js';
import policies from './policies.json';
import pages from './pages.json';

const PAGES = {
  ...Object.fromEntries(CONTENT_KEYS.map((k) => [k, pages[k]])),
  'mentions-legales': { title: 'Mentions légales', html: legalHTML() },
  ...Object.fromEntries(POLICY_KEYS.map((k) => [k, policies[k]])),
};
const key = location.pathname.match(/\/page\/([^/]+)/)?.[1] ?? new URLSearchParams(location.search).get('p');
const pol = PAGES[key] ?? PAGES['mentions-legales'];
document.title = `${pol.title} — High Tech 94`;

// the FAQ reads better as an accordion: one row per question
const body = key === 'faq'
  ? `<ul class="pdp__rows faq">${faqPairs(pol.html).map(({ q, a }) => `
      <li class="row"><button class="row__h" aria-expanded="false"><span class="row__t">${q}</span><span class="circ sm">${I.arrow}</span></button>
      <div class="row__b"><div><div class="rte">${a}</div></div></div></li>`).join('')}</ul>`
  : `<div class="rte">${pol.html}</div>`;

shell(`
<section class="legal">
  <p class="mono">[Informations]</p>
  <h1 class="h2"><span class="ln"><span>${pol.title}</span></span></h1>
  <nav class="chips">${Object.entries(PAGES).map(([k, p]) =>
    `<a class="chip${p === pol ? ' on' : ''}" href="${pagePath(k)}">${p.title}</a>`).join('')}</nav>
  <div class="legal__body" data-blur>${body}</div>
</section>`);

document.querySelectorAll('.faq .row').forEach((r) => r.querySelector('.row__h').addEventListener('click', () => {
  const open = !r.classList.contains('is-open');
  r.classList.toggle('is-open', open);
  r.querySelector('.row__h').setAttribute('aria-expanded', open);
}));
gsap.fromTo('.legal .ln > span', { yPercent: 110 }, { yPercent: 0, duration: 1.3, ease: 'expo.out', delay: 0.55 });
reveal();
