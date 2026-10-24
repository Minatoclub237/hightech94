import '@fontsource/inter-tight/500.css';
import '@fontsource/inter-tight/600.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/monaspace-neon/400.css';
import 'lenis/dist/lenis.css';
import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import data from './data.json';
import payments from './payments.json'; // the store's own payment icons (Shopify storefront)

gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger, data };

import { SHOP, BIZ, LEGAL, CATS, POLICY_KEYS, eur, shortTitle, productPath, catPath, pagePath } from './catalog.js';

export { SHOP, BIZ, LEGAL, CATS, POLICY_KEYS, eur, pagePath };
export const EMAIL = BIZ.email;
export const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const img = (p, i = 0) => data[p].images[i] ?? data[p].images[0];
export const purl = (p) => productPath(data[p].handle);
export const curl = (t) => catPath(t);
const soldOut = (p) => data[p].variants.every((v) => !v.available);
export const price = (p) => (soldOut(p) ? 'Épuisé' : data[p].min === data[p].max ? eur(data[p].min) : `dès ${eur(data[p].min)}`);
export const priceTag = (p) => `<span data-price="${data[p].handle}">${price(p)}</span>`;
export const short = (p) => shortTitle(data[p].title);

// live prices and stock from the store: the catalogue snapshot only paints the first frame
export const live = fetch(`${SHOP}/products.json?limit=250`).then((r) => r.json()).then(({ products }) => {
  for (const p of products) {
    const d = data.find((x) => x.handle === p.handle);
    if (!d) continue;
    for (const v of p.variants) {
      const dv = d.variants.find((x) => x.id === v.id);
      if (dv) Object.assign(dv, { price: +v.price, compare: v.compare_at_price ? +v.compare_at_price : 0, available: v.available });
    }
    const prices = d.variants.map((v) => v.price);
    d.min = Math.min(...prices);
    d.max = Math.max(...prices);
  }
  document.querySelectorAll('[data-price]').forEach((el) => {
    const i = data.findIndex((x) => x.handle === el.dataset.price);
    if (i >= 0) el.textContent = price(i);
  });
  return true;
}).catch(() => false);
export const count = (t) => data.filter((d) => d.type === t).length;
export const pad2 = (n) => String(n).padStart(2, '0');
export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
const PAY = ['visa', 'master', 'american_express', 'cartes_bancaires', 'paypal', 'apple_pay', 'shopify_pay', 'klarna'];
export const payIcons = () => `<ul class="pay" aria-label="Moyens de paiement acceptés">${PAY
  .map((id) => payments.find((p) => p.id === id)).filter(Boolean).map((p) => `<li>${p.svg}</li>`).join('')}</ul>`;
const PHOTOS = new Set(data.flatMap((d) => d.photo.map((i) => d.images[i])));
export const ph = (src) => (PHOTOS.has(src) ? 'class="ph"' : '');

const svg = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
export const I = {
  arrow: svg('<path d="M4 12h15m-6-6 6 6-6 6"/>'),
  back: svg('<path d="M20 12H5m6-6-6 6 6 6"/>'),
  plus: svg('<path d="M12 2v20M2 12h20"/>'),
  search: svg('<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>'),
  bag: svg('<path d="M5 8h14l-1 12H6z"/><path d="M9 8a3 3 0 0 1 6 0"/>'),
  user: svg('<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>'),
  glasses: svg('<circle cx="6.5" cy="14" r="3.5"/><circle cx="17.5" cy="14" r="3.5"/><path d="M10 14h4M3 13l2-6m16 6-2-6"/>'),
  watch: svg('<rect x="6" y="6.5" width="12" height="11" rx="3"/><path d="M8.5 6.5 9.5 2h5l1 4.5m-7 11 1 4.5h5l1-4.5"/>'),
  bolt: svg('<path d="M13 2 5 14h6l-1 8 8-12h-6z"/>'),
  car: svg('<path d="M3 16v-4l2.5-5h13l2.5 5v4z"/><circle cx="7.5" cy="16.5" r="1.8"/><circle cx="16.5" cy="16.5" r="1.8"/>'),
  shield: svg('<path d="M12 2.5 4.5 5.5v6c0 4.5 3.2 8 7.5 10 4.3-2 7.5-5.5 7.5-10v-6z"/>'),
  home: svg('<path d="M3.5 11 12 4l8.5 7M6 9.5V20h12V9.5"/>'),
  truck: svg('<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.6"/><circle cx="17" cy="17.5" r="1.6"/>'),
  ret: svg('<path d="M4 9h11a5 5 0 0 1 0 10H8"/><path d="m8 5-4 4 4 4"/>'),
  lock: svg('<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>'),
  mail: svg('<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4 7 8 6 8-6"/>'),
};

export const catOf = (t) => CATS.find((c) => c[0] === t);

// image cut into three horizontal strips (white slits between them)
const CUTS = [[0, 22], [23, 77], [78, 100]];
export const sliced = (src, shape, alt) => `<div class="sliced ${shape}" data-sliced>${CUTS.map(([a, b], i) =>
  `<div class="sl" style="clip-path:inset(${a}% 0% ${100 - b}% 0%)"><img ${ph(src)} src="${src}" alt="${i ? '' : esc(alt)}" ${i ? 'aria-hidden="true"' : ''} loading="lazy" draggable="false"></div>`).join('')}</div>`;
export const frame = (src, alt = '', cls = '', extra = '') => `<div class="frame ${cls}" ${extra}><img ${ph(src)} src="${src}" alt="${esc(alt)}" loading="lazy" draggable="false"></div>`;
export const layer = (src, alt = '', style = '') => `<div class="lay"><img ${ph(src)} src="${src}" alt="${esc(alt)}" style="${style}" loading="lazy" draggable="false"></div>`;

// Stacked photo layers: wipe `next` in over `prev`, hide every other layer.
export function swap(lays, prev, next, from) {
  if (prev < 0 || prev === next) { gsap.set(lays[next], { zIndex: 2, clipPath: 'inset(0% 0% 0% 0%)' }); return; }
  lays.forEach((l, i) => {
    if (i === prev || i === next) return;
    gsap.killTweensOf(l);
    gsap.set(l, { zIndex: 0, clipPath: 'inset(100% 0% 0% 0%)' });
  });
  gsap.set(lays[prev], { zIndex: 1 });
  gsap.fromTo(lays[next], { zIndex: 2, clipPath: from, scale: 1.06 }, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1, ease: 'expo.out', overwrite: true });
}

const WORDS = ['Objets connectés', 'Recharge sans fil', 'Maison intelligente', 'Sécurité', 'Bureau ergonomique', "Qualité de l'air", 'Accessoires auto', 'Éclairage RGB'];
export const marquee = (rev) => `<div class="marq" ${rev ? 'data-rev' : ''} aria-hidden="true"><div class="marq__in">${
  `<span class="mono">${WORDS.map((w) => `${w}<i>+</i>`).join('')}</span>`.repeat(4)}</div></div>`;

/* ---------------- 3D carousel ---------------- */
export const carouselHTML = (a, b, list, id = '') => `
<section class="car" ${id ? `id="${id}"` : ''}>
  <div class="car__head" data-blur>
    <h2 class="h3" data-split>${a} -<br>${b}</h2>
    <p class="mono car__yr">2026</p>
    <a class="mono car__all" href="${curl()}">[Tout voir]</a>
    <div class="car__nav"><button class="circ sm" data-cprev aria-label="Précédent">${I.back}</button><button class="circ sm" data-cnext aria-label="Suivant">${I.arrow}</button></div>
  </div>
  <div class="car__view" data-blur><div class="car__track">${list.map(([p, i], k) =>
    `<a class="card" href="${purl(p)}" style="--h:${[0.86, 0.94, 1, 0.88][k % 4]}">${frame(img(p, i), short(p), ['', 'shape-d', 'shape-e', ''][k % 4])}<p class="mono card__cap">[${short(p)}] ${priceTag(p)}</p></a>`).join('')}</div></div>
  <div class="car__bar"><span></span></div>
</section>`;

export function initCarousel(root) {
  const track = root.querySelector('.car__track');
  const cards = [...track.children];
  const bar = root.querySelector('.car__bar span');
  const car = { pan: 0, user: 0 };
  let cw = 0, gap = 0, padL = 0, maxX = 0;
  const measure = () => {
    cw = cards[0].offsetWidth;
    gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    padL = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    maxX = Math.max(0, padL * 2 + cards.length * (cw + gap) - gap - innerWidth);
  };
  const draw = () => {
    car.user = gsap.utils.clamp(-maxX, maxX, car.user);
    const off = gsap.utils.clamp(0, maxX, car.pan * maxX * 0.45 + car.user);
    track.style.transform = `translate3d(${-off}px,0,0)`;
    cards.forEach((c, i) => {
      const d = (padL + i * (cw + gap) + cw / 2 - off - innerWidth / 2) / (cw + gap);
      const ad = Math.min(Math.abs(d), 3);
      c.style.transform = `translate3d(0, ${-(1 - Math.min(ad, 1)) * cw * 0.06}px, ${-ad * 70}px) rotateY(${gsap.utils.clamp(-26, 26, -d * 12)}deg)`;
      c.lastElementChild.style.opacity = Math.max(0, 1 - ad * 1.6);
    });
    bar.style.transform = `translateX(${(maxX ? off / maxX : 0) * 257}%)`;
  };
  const nudge = (dir) => gsap.to(car, { user: car.user + dir * (cw + gap), duration: 0.9, ease: 'expo.out', overwrite: true, onUpdate: draw });
  root.querySelector('[data-cprev]').addEventListener('click', () => nudge(-1));
  root.querySelector('[data-cnext]').addEventListener('click', () => nudge(1));
  ScrollTrigger.create({ trigger: root, start: 'top bottom', end: 'bottom top', onUpdate: (s) => { car.pan = s.progress; draw(); } });

  let drag = null, dragged = false;
  track.addEventListener('pointerdown', (e) => {
    gsap.killTweensOf(car);
    drag = { x: e.clientX, u: car.user, lx: e.clientX, v: 0 };
    dragged = false;
  });
  addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (Math.abs(dx) > 6) { dragged = true; track.classList.add('drag'); }
    drag.v = e.clientX - drag.lx;
    drag.lx = e.clientX;
    car.user = drag.u - dx * 1.2;
    draw();
  });
  addEventListener('pointerup', () => {
    if (!drag) return;
    gsap.to(car, { user: car.user - drag.v * 14, duration: 1, ease: 'power3.out', onUpdate: draw });
    drag = null;
    track.classList.remove('drag');
  });
  track.addEventListener('click', (e) => { if (dragged) e.preventDefault(); }, true);
  onResize(() => { measure(); draw(); });
  measure();
  draw();
}

/* ---------------- split text into words/chars (keeps <br> and nested spans) ---------------- */
export function split(el) {
  el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
  const walk = (node) => [...node.childNodes].forEach((n) => {
    if (n.nodeType === 3) {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (!part.trim()) { frag.append(' '); return; }
        const w = document.createElement('span');
        w.className = 'w';
        w.setAttribute('aria-hidden', 'true');
        for (const c of part) {
          const s = document.createElement('span');
          s.className = 'ch';
          s.textContent = c;
          w.append(s);
        }
        frag.append(w);
      });
      n.replaceWith(frag);
    } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
  });
  walk(el);
  return el.querySelectorAll('.ch');
}

/* ---------------- scroll reveals (scrubbed, reversible) ---------------- */
export function reveal(root = document) {
  if (reduce) return [];
  const made = [];
  // inside a pinned section the positions must ignore the pin's extra scroll length
  const pin = (el) => el.closest('[data-pin]') ?? undefined;
  root.querySelectorAll('[data-split]').forEach((el) => {
    made.push(gsap.fromTo(split(el), { yPercent: 110, rotationX: -90, opacity: 0 }, {
      yPercent: 0, rotationX: 0, opacity: 1, ease: 'power3.out', stagger: 0.015,
      scrollTrigger: { trigger: el, pinnedContainer: pin(el), start: 'top 92%', end: 'clamp(top 55%)', scrub: 0.6 },
    }));
  });
  root.querySelectorAll('[data-blur]').forEach((el) => {
    made.push(gsap.fromTo(el, { filter: 'blur(16px)', opacity: 0.15, y: 60 }, {
      filter: 'blur(0px)', opacity: 1, y: 0, ease: 'none',
      scrollTrigger: { trigger: el, pinnedContainer: pin(el), start: 'top bottom', end: 'clamp(top 80%)', scrub: 0.5 },
    }));
  });
  root.querySelectorAll('[data-sliced]').forEach((el) => {
    made.push(gsap.fromTo(el.querySelectorAll('.sl'), { xPercent: (i) => [-9, 7, -5][i] }, {
      xPercent: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'clamp(center 50%)', scrub: true },
    }));
    made.push(gsap.fromTo(el.querySelectorAll('img'), { scale: 1.14 }, {
      scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    }));
  });
  root.querySelectorAll('[data-par] img').forEach((el) => {
    made.push(gsap.fromTo(el, { scale: 1.12, yPercent: -5 }, {
      yPercent: 5, ease: 'none', scrollTrigger: { trigger: el.parentNode, start: 'top bottom', end: 'bottom top', scrub: true },
    }));
  });
  return made;
}

const resizers = [];
let rt;
export const onResize = (fn) => resizers.push(fn);
addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => resizers.forEach((f) => f()), 150); });

/* ---------------- page shell ---------------- */
const NAV = [['/#univers', 'Univers'], [curl(), 'Boutique'], ['/#coups-de-coeur', 'Coups de cœur'], ['/#contact', 'Contact']];
const header = `
<header class="nav">
  <div class="nav__l">
    <button class="burger" aria-label="Ouvrir le menu" aria-expanded="false"><span></span><span></span></button>
    <nav class="nav__links">${NAV.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}</nav>
  </div>
  <a class="logo" href="/" aria-label="Hightech 94 — retour au début"><picture><source media="(max-width: 820px)" srcset="/brand/mark-light.webp"><img src="/brand/lockup-light.webp" alt="Hightech 94" width="190" height="52"></picture></a>
  <div class="nav__r">
    <button data-search aria-label="Rechercher">${I.search}</button>
    <button data-cart aria-label="Panier">${I.bag}<span class="badge" hidden></span></button>
    <a href="${SHOP}/account" aria-label="Mon compte">${I.user}</a>
  </div>
</header>
<div class="menu" aria-hidden="true">
  <button class="menu__x mono" data-close>Fermer</button>
  <nav>${[...NAV, ...CATS.slice(0, 3).map((c) => [curl(c[0]), c[1]])].map(([h, t]) => `<a href="${h}"><span>${t}</span></a>`).join('')}</nav>
  <p class="mono">Fontenay-sous-Bois (94) — livraison dans 41 pays</p>
</div>
<div class="search" aria-hidden="true">
  <button class="menu__x mono" data-close>Fermer</button>
  <div class="search__bar"><input type="search" placeholder="Rechercher un produit…" aria-label="Rechercher un produit" autocomplete="off">${I.search}</div>
  <ul class="search__res" data-lenis-prevent></ul>
</div>
<aside class="cart" aria-hidden="true">
  <div class="cart__bg" data-close></div>
  <div class="cart__panel">
    <div class="cart__head"><p class="h3">Panier<sup class="cart__n">0</sup></p><button class="menu__x mono" data-close>Fermer</button></div>
    <ul class="cart__list" data-lenis-prevent></ul>
    <div class="cart__foot">
      <div class="cart__sum"><span class="mono">Sous-total</span><b>0 €</b></div>
      <p class="cart__note">Livraison estimée : 10 à 15 jours. Frais calculés à l’étape suivante, paiement sécurisé par Shopify.</p>
      ${payIcons()}
      <a class="pill pill--fill cart__go" href="#">Passer commande ${I.arrow}</a>
    </div>
  </div>
</aside>`;

const li = (h, t) => `<li><a href="${h}">${t}</a></li>`;
// the real Google rating (no review count or texts: Google only shows a limited view of the listing)
export const gstar = (cls = '') => `<a class="gstar ${cls}" href="${BIZ.maps}" target="_blank" rel="noopener" aria-label="Noté ${BIZ.rating} sur 5 sur Google — voir et laisser un avis"><span class="gstar__s" aria-hidden="true">★★★★★</span><b>${BIZ.rating}</b><span>sur Google — voir ou laisser un avis ↗</span></a>`;
const footer = `
<footer class="foot" id="contact">
  <ul class="foot__usp" data-blur>
    <li>${I.truck}<div><b>Livraison 10 à 15 jours</b><span>Dans 41 pays</span></div></li>
    <li>${I.ret}<div><b>Retours 30 jours</b><span>Après la livraison</span></div></li>
    <li>${I.lock}<div><b>Paiement sécurisé</b><span>Caisse Shopify, 3-D Secure</span></div></li>
    <li>${I.mail}<div><b>Une question ?</b><span><a href="tel:${BIZ.tel}">${BIZ.phone}</a> ou par e-mail</span></div></li>
  </ul>
  <div class="foot__main">
    <div class="foot__brand" data-blur>
      <a class="foot__logo" href="/" aria-label="Hightech 94 — retour au début"><img src="/brand/logo-dark.webp" alt="Hightech 94" width="720" height="619" loading="lazy"></a>
      <p class="foot__lead">Objets connectés et high-tech, choisis un par un et livrés depuis Fontenay-sous-Bois (94).</p>
      <form class="foot__form"><input name="m" placeholder="Écrivez-nous un message" aria-label="Votre message" autocomplete="off"><button class="circ inv" aria-label="Envoyer">${I.arrow}</button></form>
      <a class="foot__mail" href="mailto:${EMAIL}">${EMAIL}</a>
      ${gstar('foot__g')}
    </div>
    <nav class="foot__cols" data-blur aria-label="Liens du site">
      <div><p class="mono lab">Boutique</p><ul>${li(curl(), 'Tout voir')}${[0, 1, 3, 4, 6, 7].map((c) => li(curl(CATS[c][0]), CATS[c][1])).join('')}</ul></div>
      <div><p class="mono lab">Univers</p><ul>${li('/#univers', 'Tout connecté')}${li('/#categories', 'Catégories')}${li('/#coups-de-coeur', 'Coups de cœur')}${li('/#selection', 'La sélection')}</ul></div>
      <div><p class="mono lab">Aide</p><ul>${li(pagePath('shipping-policy'), 'Livraison')}${li(pagePath('refund-policy'), 'Retours')}${li(pagePath('terms-of-service'), 'Conditions générales')}${li(pagePath('privacy-policy'), 'Confidentialité')}${li(pagePath('mentions-legales'), 'Mentions légales')}</ul></div>
      <div><p class="mono lab">Nous trouver</p><p>${BIZ.street}<br>${BIZ.zip} ${BIZ.city}</p><ul class="foot__find"><li><a href="${BIZ.maps}" target="_blank" rel="noopener">Itinéraire ↗</a></li><li><a href="tel:${BIZ.tel}">${BIZ.phone}</a></li></ul><p class="foot__open"><i></i>Boutique en ligne 24 h/24</p></div>
    </nav>
  </div>
  <p class="foot__giant" data-split aria-hidden="true">HIGHTECH94</p>
  <div class="foot__bot">
    <p class="mono">© 2026 ${BIZ.name} — <a href="${pagePath('mentions-legales')}">Mentions légales</a></p>
    ${payIcons()}
    <button class="foot__up mono" data-top>Retour en haut ${I.arrow}</button>
  </div>
</footer>
<div class="curtain"><img src="/brand/logo-dark.webp" alt="" width="720" height="619"></div>`;

export function shell(main) {
  document.querySelector('#app').innerHTML = `${header}<main>${main}</main>${footer}`;
  // hover text roll: the label slides up and a copy follows from below
  document.querySelectorAll('.pill, .nav__links a, .foot__cols a').forEach((el) => {
    const n = [...el.childNodes].find((c) => c.nodeType === 3 && c.textContent.trim());
    if (!n) return;
    const s = document.createElement('span');
    s.className = 'roll';
    s.dataset.t = n.textContent.trim();
    s.innerHTML = `<span>${esc(s.dataset.t)}</span>`;
    n.replaceWith(s);
  });
  const lenis = reduce ? null : new Lenis({ lerp: 0.1 });
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const lock = (on) => (on ? lenis?.stop() : lenis?.start());

  // overlays: menu, search, cart — one open at a time
  const panel = (el, tl) => ({ el, tl, open: false });
  const menu = document.querySelector('.menu');
  const search = document.querySelector('.search');
  const cartEl = document.querySelector('.cart');
  const wipe = (el, extra) => {
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.inOut' } })
      .set(el, { visibility: 'visible' })
      .fromTo(el, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9 });
    extra?.(tl);
    return tl;
  };
  const P = {
    menu: panel(menu, wipe(menu, (tl) => tl.fromTo('.menu nav a span', { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.05, ease: 'expo.out' }, 0.45))),
    search: panel(search, wipe(search, (tl) => tl.fromTo('.search__bar, .search__res', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'expo.out' }, 0.45))),
    cart: panel(cartEl, gsap.timeline({ paused: true, defaults: { ease: 'expo.inOut', duration: 0.8 } })
      .set(cartEl, { visibility: 'visible' })
      .fromTo('.cart__bg', { opacity: 0 }, { opacity: 1 }, 0)
      .fromTo('.cart__panel', { xPercent: 100 }, { xPercent: 0 }, 0)),
  };
  const toggle = (k, open) => {
    const p = P[k];
    if (p.open === open) return;
    if (open) Object.keys(P).forEach((o) => o !== k && toggle(o, false));
    p.open = open;
    open ? p.tl.timeScale(1).play() : p.tl.timeScale(1.6).reverse();
    p.el.setAttribute('aria-hidden', !open);
    if (k === 'menu') document.querySelector('.burger').setAttribute('aria-expanded', open);
    if (k === 'search' && open) setTimeout(() => search.querySelector('input').focus(), 500);
    lock(Object.values(P).some((x) => x.open));
  };
  document.querySelector('.burger').addEventListener('click', () => toggle('menu', true));
  document.querySelector('[data-search]').addEventListener('click', () => toggle('search', true));
  document.querySelector('[data-cart]').addEventListener('click', () => toggle('cart', true));
  document.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => Object.keys(P).forEach((k) => toggle(k, false))));
  addEventListener('keydown', (e) => e.key === 'Escape' && Object.keys(P).forEach((k) => toggle(k, false)));

  // search: live filter over the catalogue
  const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const res = search.querySelector('.search__res');
  const renderSearch = (q) => {
    const n = norm(q.trim());
    const hits = data.map((d, i) => i).filter((i) => !n || norm(`${data[i].title} ${data[i].type} ${data[i].tagline}`).includes(n)).slice(0, n ? 12 : 6);
    res.innerHTML = hits.map((i) => `<li><a class="sr" href="${purl(i)}">${frame(img(i), short(i))}<span>${short(i)}<small>${catOf(data[i].type)[1]}</small></span><b>${price(i)}</b></a></li>`).join('')
      || `<li class="search__none">Aucun produit pour « ${esc(q)} ».</li>`;
  };
  search.querySelector('input').addEventListener('input', (e) => renderSearch(e.target.value));
  renderSearch('');

  // cart (saved in this browser), checkout goes to Shopify through a cart permalink
  const list = cartEl.querySelector('.cart__list');
  const badge = document.querySelector('.badge');
  const find = (id) => {
    for (const [pi, d] of data.entries()) {
      const v = d.variants.find((x) => x.id === id);
      if (v) return { pi, v };
    }
    return null;
  };
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('ht94-cart')) || []; } catch { cart = []; }
  const renderCart = () => {
    cart = cart.filter((i) => i.q > 0 && find(i.id));
    try { localStorage.setItem('ht94-cart', JSON.stringify(cart)); } catch { /* private mode */ }
    const n = cart.reduce((s, i) => s + i.q, 0);
    badge.textContent = n;
    badge.hidden = !n;
    cartEl.querySelector('.cart__n').textContent = n;
    list.innerHTML = cart.map((i) => {
      const { pi, v } = find(i.id);
      return `<li class="ci">${frame(img(pi, v.img >= 0 ? v.img : 0), short(pi))}<div>
        <a class="ci__t" href="${purl(pi)}">${short(pi)}</a>${v.title !== 'Default Title' ? `<p class="ci__v">${esc(v.title)}</p>` : ''}
        <div class="ci__row"><div class="qty sm"><button data-q="-1" data-id="${i.id}" aria-label="Moins">−</button><span>${i.q}</span><button data-q="1" data-id="${i.id}" aria-label="Plus">+</button></div><b>${eur(v.price * i.q)}</b></div>
        <button class="ci__x mono" data-rm="${i.id}">Retirer</button></div></li>`;
    }).join('') || `<li class="cart__empty"><p>Votre panier est vide.</p><a class="pill" href="${curl()}">Voir la boutique ${I.arrow}</a></li>`;
    cartEl.querySelector('.cart__sum b').textContent = eur(cart.reduce((s, i) => s + find(i.id).v.price * i.q, 0));
    const go = cartEl.querySelector('.cart__go');
    go.href = n ? `${SHOP}/cart/${cart.map((i) => `${i.id}:${i.q}`).join(',')}` : '#';
    go.classList.toggle('off', !n);
  };
  list.addEventListener('click', (e) => {
    const b = e.target.closest('[data-q], [data-rm]');
    if (!b) return;
    const it = cart.find((i) => i.id === +(b.dataset.id || b.dataset.rm));
    if (b.dataset.rm) it.q = 0; else it.q += +b.dataset.q;
    renderCart();
  });
  renderCart();
  live.then(() => { renderCart(); renderSearch(search.querySelector('input').value); });
  window.addToCart = (id, q = 1) => {
    const it = cart.find((i) => i.id === id);
    if (it) it.q += q; else cart.push({ id, q });
    renderCart();
    toggle('cart', true);
  };

  // page transitions: black curtain on internal navigation, smooth scroll for same-page anchors
  const curtain = document.querySelector('.curtain');
  gsap.fromTo(curtain, { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'expo.inOut', delay: 0.1 });
  addEventListener('pageshow', (e) => e.persisted && gsap.set(curtain, { clipPath: 'inset(0% 0% 100% 0%)' }));
  const scrollTo = (hash) => (lenis ? lenis.scrollTo(hash, { duration: 1.6 }) : document.querySelector(hash)?.scrollIntoView());
  const toTop = () => (lenis ? lenis.scrollTo(0, { duration: 2 }) : window.scrollTo(0, 0));
  document.querySelector('[data-top]').addEventListener('click', toTop);
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || a.target || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin || a.getAttribute('href') === '#') return;
    e.preventDefault();
    Object.keys(P).forEach((k) => toggle(k, false));
    // same page: anchors glide to their section, the logo glides back to the hero
    if (u.pathname === location.pathname && u.search === location.search) { if (u.hash) scrollTo(u.hash); else toTop(); return; }
    gsap.fromTo(curtain, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'expo.inOut', onComplete: () => { location.href = u.href; } });
  });

  document.querySelector('.foot__form').addEventListener('submit', (e) => {
    e.preventDefault();
    location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Message depuis le site Hightech 94')}&body=${encodeURIComponent(e.target.m.value.trim())}`;
  });

  // marquees: speed and direction follow the scroll
  const marqs = [...document.querySelectorAll('.marq')].map((m) => ({ el: m.firstElementChild, dir: m.hasAttribute('data-rev') ? 1 : -1, x: 0, w: 1 }));
  const measureMarq = () => marqs.forEach((m) => { m.w = m.el.scrollWidth / 2; });
  gsap.ticker.add((t, dt) => {
    const v = lenis ? lenis.velocity : 0;
    const flip = lenis && lenis.direction < 0 ? -1 : 1;
    for (const m of marqs) {
      m.x += m.dir * flip * (0.045 + Math.min(Math.abs(v), 60) * 0.012) * dt;
      if (m.x <= -m.w) m.x += m.w;
      if (m.x > 0) m.x -= m.w;
      m.el.style.transform = `translate3d(${m.x}px,0,0)`;
    }
  });
  measureMarq();
  onResize(measureMarq);
  document.fonts.ready.then(() => {
    measureMarq();
    ScrollTrigger.refresh();
    // jump to #anchor only once every pin of the page exists and has been measured
    if (location.hash && document.querySelector(location.hash)) scrollTo(location.hash);
  });
  return lenis;
}
