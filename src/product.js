import {
  gsap, data, reduce, SHOP, curl, eur, short, pad2, esc, ph, I, catOf,
  sliced, layer, swap, marquee, carouselHTML, initCarousel, reveal, shell,
} from './shared.js';

const OPT = { color: 'Couleur', colour: 'Couleur', size: 'Taille', style: 'Style', type: 'Type', model: 'Modèle', material: 'Matière', 'ships from': 'Expédition' };
let pi = data.findIndex((d) => d.handle === new URLSearchParams(location.search).get('p'));
if (pi < 0) pi = 0;
const d = data[pi];
const cat = catOf(d.type);
const sub = d.title.slice(short(pi).length).replace(/^\s*[–,-]\s*/, '');
const shown = d.options.map((o) => !(o.values.length === 1 && /default title/i.test(o.values[0])));
const n = d.images.length;
const related = [...data.keys()].filter((i) => i !== pi && data[i].type === d.type)
  .concat([...data.keys()].filter((i) => i !== pi && data[i].type !== d.type)).slice(0, 10).map((i) => [i, 0]);
document.title = `${short(pi)} — Hightech 94`;

const rows = [
  ['Livraison', 'Délai estimé : 10 à 15 jours. Les frais sont indiqués avant le paiement. Livraison dans 41 pays.', '/page/?p=shipping-policy', 'Politique de livraison'],
  ['Retours', 'Vous pouvez demander un retour dans les 30 jours suivant la livraison.', '/page/?p=refund-policy', 'Politique de retour'],
  ['Paiement sécurisé', 'Visa, Mastercard, Amex et Maestro, avec 3-D Secure. Le paiement se fait sur la caisse Shopify.', '', ''],
];

shell(`
<section class="pdp">
  <div class="pdp__gal">
    <div class="pdp__stage shape-c">${d.images.map((src, i) => layer(src, i ? '' : short(pi))).join('')}</div>
    <div class="pdp__bar">
      <p class="spot__count"><b>01</b><small>/${pad2(n)}</small></p>
      <div class="car__nav"><button class="circ sm" data-g="-1" aria-label="Photo précédente">${I.back}</button><button class="circ sm" data-g="1" aria-label="Photo suivante">${I.arrow}</button></div>
    </div>
    <div class="pdp__thumbs">${d.images.map((src, i) => `<button class="frame pdp__th" data-i="${i}" aria-label="Photo ${i + 1}"><img ${ph(src)} src="${src}" alt="" loading="lazy" draggable="false"></button>`).join('')}</div>
  </div>
  <div class="pdp__info">
    <p class="mono crumb" data-in><a href="/">Accueil</a> / <a href="${curl(d.type)}">${cat[1]}</a></p>
    <h1 class="pdp__title"><span class="ln"><span>${esc(short(pi))}</span></span></h1>
    ${sub ? `<p class="pdp__sub" data-in>${esc(sub)}</p>` : ''}
    <p class="pdp__price" data-in><b></b><s></s></p>
    ${d.tagline ? `<p class="pdp__tag" data-in>${esc(d.tagline)}</p>` : ''}
    <div data-in>${d.options.map((o, k) => (shown[k] ? `
      <div class="opt" data-k="${k}"><p class="mono lab">${OPT[o.name.toLowerCase()] ?? esc(o.name)} — <span></span></p>
      <div class="opt__vals">${o.values.map((v) => `<button class="chip" data-v="${esc(v)}">${esc(v)}</button>`).join('')}</div></div>` : '')).join('')}</div>
    <div class="buy" data-in>
      <div class="qty"><button data-dq="-1" aria-label="Moins">−</button><span>1</span><button data-dq="1" aria-label="Plus">+</button></div>
      <button class="pill pill--fill buy__add"></button>
    </div>
    <a class="pill buy__now" data-in href="#">Commander maintenant ${I.arrow}</a>
    <ul class="pdp__rows" data-in>${rows.map(([t, txt, href, l]) => `
      <li class="row"><button class="row__h" aria-expanded="false"><span class="row__t">${t}</span><span class="circ sm">${I.arrow}</span></button>
      <div class="row__b"><div><div class="row__in"><div><p>${txt}</p>${href ? `<a class="mono" href="${href}">[${l}]</a>` : ''}</div></div></div></div></li>`).join('')}</ul>
  </div>
</section>

${marquee(false)}

<section class="pdp__desc">
  <div class="pdp__dl" data-blur><p class="mono">[Description]</p><p class="h3">${esc(d.tagline || short(pi))}</p></div>
  <div class="rte" data-blur>${d.desc.replace(/<h2>.*?<\/h2>/s, '')}</div>
  ${n > 1 ? `<figure class="pdp__fig" data-blur>${sliced(d.images[1], 'shape-a', short(pi))}</figure>` : ''}
</section>

${carouselHTML('vous aimerez', 'aussi', related)}`);

/* ---------------- gallery ---------------- */
const lays = [...document.querySelectorAll('.pdp__stage .lay')];
const thumbs = [...document.querySelectorAll('.pdp__th')];
const counter = document.querySelector('.pdp__bar b');
let gi = -1;
function show(i) {
  i = (i + n) % n;
  if (i === gi) return;
  swap(lays, gi, i, i > gi ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)');
  gi = i;
  thumbs.forEach((t, k) => t.classList.toggle('on', k === i));
  counter.textContent = pad2(i + 1);
}
show(0);
document.querySelectorAll('[data-g]').forEach((b) => b.addEventListener('click', () => show(gi + +b.dataset.g)));
thumbs.forEach((t) => t.addEventListener('click', () => show(+t.dataset.i)));
const stage = document.querySelector('.pdp__stage');
let sx = null;
stage.addEventListener('pointerdown', (e) => { sx = e.clientX; });
stage.addEventListener('pointerup', (e) => {
  if (sx !== null && Math.abs(e.clientX - sx) > 40) show(gi + (e.clientX < sx ? 1 : -1));
  sx = null;
});
if (matchMedia('(hover: hover)').matches && !reduce) {
  const rx = gsap.quickTo(stage, 'rotationX', { duration: 0.9, ease: 'power3' });
  const ry = gsap.quickTo(stage, 'rotationY', { duration: 0.9, ease: 'power3' });
  stage.addEventListener('pointermove', (e) => {
    const r = stage.getBoundingClientRect();
    ry(((e.clientX - r.left) / r.width - 0.5) * 12);
    rx((0.5 - (e.clientY - r.top) / r.height) * 8);
  });
  stage.addEventListener('pointerleave', () => { rx(0); ry(0); });
}

/* ---------------- variants, quantity, buy ---------------- */
let sel = [...(d.variants.find((v) => v.available) ?? d.variants[0]).opts];
let q = 1;
const add = document.querySelector('.buy__add');
const now = document.querySelector('.buy__now');
const match = (opts) => d.variants.find((v) => v.opts.every((o, k) => o === opts[k]));
function update(fromUser) {
  const v = match(sel);
  document.querySelectorAll('.opt').forEach((el) => {
    const k = +el.dataset.k;
    el.querySelector('.lab span').textContent = sel[k];
    el.querySelectorAll('.chip').forEach((c) => {
      const alt = sel.slice();
      alt[k] = c.dataset.v;
      const av = match(alt);
      c.classList.toggle('on', c.dataset.v === sel[k]);
      c.classList.toggle('off', !av || !av.available);
    });
  });
  document.querySelector('.pdp__price b').textContent = v ? eur(v.price) : '—';
  document.querySelector('.pdp__price s').textContent = v && v.compare > v.price ? eur(v.compare) : '';
  const ok = v && v.available;
  add.disabled = !ok;
  add.innerHTML = ok ? `Ajouter au panier ${I.arrow}` : 'Indisponible';
  now.href = ok ? `${SHOP}/cart/${v.id}:${q}` : '#';
  now.classList.toggle('off', !ok);
  if (fromUser && v && v.img >= 0) show(v.img);
}
document.querySelectorAll('.opt').forEach((el) => el.addEventListener('click', (e) => {
  const c = e.target.closest('.chip');
  if (!c) return;
  sel[+el.dataset.k] = c.dataset.v;
  // keep the selection on an existing variant when the other options no longer match
  if (!match(sel)) sel = [...(d.variants.find((v) => v.opts[+el.dataset.k] === c.dataset.v)?.opts ?? sel)];
  update(true);
}));
document.querySelectorAll('[data-dq]').forEach((b) => b.addEventListener('click', () => {
  q = Math.max(1, q + +b.dataset.dq);
  document.querySelector('.qty span').textContent = q;
  update(false);
}));
add.addEventListener('click', () => { const v = match(sel); if (v) window.addToCart(v.id, q); });
update(false);

document.querySelectorAll('.pdp__rows .row').forEach((r) => r.querySelector('.row__h').addEventListener('click', () => {
  const open = !r.classList.contains('is-open');
  r.classList.toggle('is-open', open);
  r.querySelector('.row__h').setAttribute('aria-expanded', open);
}));

/* ---------------- motion ---------------- */
gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.55 })
  .fromTo(stage, { scale: 1.08, opacity: 0, filter: 'blur(20px)' }, { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.6, clearProps: 'filter' })
  .fromTo('.pdp__title .ln > span', { yPercent: 110 }, { yPercent: 0, duration: 1.3 }, 0.1)
  .fromTo('.pdp [data-in], .pdp__bar, .pdp__thumbs', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, stagger: 0.05 }, 0.3);
reveal();
initCarousel(document.querySelector('.car'));
