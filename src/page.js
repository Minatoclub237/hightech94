import { gsap, reveal, shell } from './shared.js';
import policies from './policies.json';

const key = new URLSearchParams(location.search).get('p');
const pol = policies[key] ?? policies['shipping-policy'];
document.title = `${pol.title} — Hightech 94`;

shell(`
<section class="legal">
  <p class="mono">[Informations]</p>
  <h1 class="h2"><span class="ln"><span>${pol.title}</span></span></h1>
  <nav class="chips">${Object.entries(policies).map(([k, p]) =>
    `<a class="chip${p === pol ? ' on' : ''}" href="/page/?p=${k}">${p.title}</a>`).join('')}</nav>
  <div class="rte" data-blur>${pol.html}</div>
</section>`);

gsap.fromTo('.legal .ln > span', { yPercent: 110 }, { yPercent: 0, duration: 1.3, ease: 'expo.out', delay: 0.55 });
reveal();
