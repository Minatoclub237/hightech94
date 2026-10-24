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

gsap.registerPlugin(ScrollTrigger);

const SHOP = 'https://hightech94-store.myshopify.com';
const EMAIL = 'sgueblaoui@gmail.com';
const img = (p, i = 0) => data[p].images[i] ?? data[p].images[0];
const url = (p) => `${SHOP}/products/${data[p].handle}`;
const typeUrl = (t) => `${SHOP}/collections/types?q=${encodeURIComponent(t)}`;
const eur = (n) => n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: n % 1 ? 2 : 0 });
const price = (p) => (data[p].min === data[p].max ? eur(data[p].min) : `dès ${eur(data[p].min)}`);
const short = (p) => data[p].title.split(/ [–-] |, /)[0];
const count = (t) => data.filter((d) => d.type === t).length;
const pad2 = (n) => String(n).padStart(2, '0');

const svg = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const I = {
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
};

// [product type, short label, [product, image]]
const CATS = [
  ['Lunettes connectées', 'Lunettes', [3, 1]],
  ['Objets connectés', 'Montres', [1, 0]],
  ['Bureau et informatique', 'Bureau', [9, 1]],
  ['Charge et alimentation', 'Recharge', [11, 2]],
  ['Accessoires auto', 'Auto', [12, 0]],
  ['Air et ambiance', 'Air pur', [19, 0]],
  ['Sécurité connectée', 'Sécurité', [26, 2]],
  ['Maison connectée', 'Maison', [23, 2]],
  ['Éclairage connecté', 'Lumière', [28, 0]],
];
const SPOT = [[0, 1], [1, 1], [2, 1], [4, 1], [5, 2], [8, 0]];
const CARDS = [[9, 1], [6, 1], [13, 1], [12, 1], [15, 0], [11, 1], [24, 1], [3, 0], [7, 0], [21, 0], [20, 0], [10, 1]];
const COLS = [
  ['Maison & sécurité', 'Caméras WiFi, prise connectée, ampoules RGB : la maison se pilote depuis le téléphone.', 'Sécurité connectée', [26, 2], [23, 2]],
  ['Route & recharge', 'Supports magnétiques et chargeurs sans fil : en voiture comme au bureau, tout tient et tout charge.', 'Charge et alimentation', [15, 0], [13, 1]],
  ['Bureau & ergonomie', 'Supports ventilés, souris verticales, tables pliantes : travailler mieux, sans mal de dos.', 'Bureau et informatique', [4, 1], [8, 0]],
  ['Air & bien-être', 'Purificateurs à ions négatifs pour la voiture, la chambre ou à porter autour du cou.', 'Air et ambiance', [19, 0], [21, 0]],
];
const WORDS = ['Objets connectés', 'Recharge sans fil', 'Maison intelligente', 'Sécurité', 'Bureau ergonomique', "Qualité de l'air", 'Accessoires auto', 'Éclairage RGB'];

// image cut into three horizontal strips (white slits between them)
const CUTS = [[0, 22], [23, 77], [78, 100]];
const sliced = (src, shape, alt) => `<div class="sliced ${shape}" data-sliced>${CUTS.map(([a, b], i) =>
  `<div class="sl" style="clip-path:inset(${a}% 0% ${100 - b}% 0%)"><img src="${src}" alt="${i ? '' : alt}" ${i ? 'aria-hidden="true"' : ''} loading="lazy" draggable="false"></div>`).join('')}</div>`;
const frame = ([p, i], cls = '', extra = '') => `<div class="frame ${cls}" ${extra}><img src="${img(p, i)}" alt="${short(p)}" loading="lazy" draggable="false"></div>`;
const marquee = (rev) => `<div class="marq" ${rev ? 'data-rev' : ''} aria-hidden="true"><div class="marq__in">${
  `<span class="mono">${WORDS.map((w) => `${w}<i>+</i>`).join('')}</span>`.repeat(4)}</div></div>`;

/* ---------------- markup ---------------- */
document.querySelector('#app').innerHTML = `
<header class="nav">
  <div class="nav__l">
    <button class="burger" aria-label="Ouvrir le menu" aria-expanded="false"><span></span><span></span></button>
    <nav class="nav__links"><a href="#univers">Univers</a><a href="#categories">Catégories</a><a href="#selection">Sélection</a><a href="#contact">Contact</a></nav>
  </div>
  <a class="logo" href="/">HIGHTECH<sup>94</sup></a>
  <div class="nav__r">
    <a href="${SHOP}/search" aria-label="Rechercher">${I.search}</a>
    <a href="${SHOP}/cart" aria-label="Panier">${I.bag}</a>
    <a href="${SHOP}/account" aria-label="Mon compte">${I.user}</a>
  </div>
</header>

<div class="menu" aria-hidden="true">
  <button class="menu__x mono">Fermer</button>
  <nav>${[['#univers', 'Univers'], ['#categories', 'Catégories'], ['#coups-de-coeur', 'Coups de cœur'], ['#selection', 'Sélection'], ['#contact', 'Contact']]
    .map(([h, t]) => `<a href="${h}"><span>${t}</span></a>`).join('')}</nav>
  <p class="mono">Fontenay-sous-Bois (94) — livraison dans 41 pays</p>
</div>

<main>
<section class="hero">
  <div class="hero__fig"><div class="hero__tilt"><img src="${img(1, 0)}" alt="Montre connectée Kayrox Pro" fetchpriority="high" draggable="false"></div></div>
  <h1 class="hero__title">
    <span class="hero__l"><span class="ln"><span>la tech</span></span><span class="ln"><span>- utile</span></span></span>
    <span class="hero__r"><span class="ln"><span>la vie</span></span><span class="ln"><span>- facile</span></span></span>
  </h1>
  <p class="mono hero__tag-r" data-in>// Pensé pour<br>le quotidien</p>
  <p class="mono hero__tag-l" data-in>// High-tech</p>
  <p class="hero__p" data-in>Montres et lunettes connectées, recharge sans fil, sécurité, maison intelligente : 30 objets utiles, choisis un par un.</p>
  <p class="hero__new" data-in><span class="mono">/ Nouveautés</span><br>Collection 2026</p>
  <div class="hero__avatars" data-in>${[[3, 0], [7, 0], [12, 0]].map(([p, i]) => `<img src="${img(p, i)}" alt="" draggable="false">`).join('')}<span class="hero__more">${I.plus}</span></div>
  <span class="cross hero__cross" data-in>${I.plus}</span>
  <p class="hero__stat" data-in><strong>41</strong><span class="mono">pays livrés</span></p>
</section>

<div class="strip">${[['glasses', 0], ['watch', 1], ['bolt', 3], ['car', 4], ['shield', 6], ['home', 7]]
  .map(([ic, c]) => `<a href="${typeUrl(CATS[c][0])}">${I[ic]}${CATS[c][1]}</a>`).join('')}</div>

<section class="moments" id="univers">
  <h2 class="h2 moments__h" data-blur>Tout - connecté<br>en un geste ©26</h2>
  <a class="moments__thumb" href="${url(2)}" data-blur aria-label="${short(2)}">${frame([2, 2])}</a>
  <span class="cross moments__cross" data-blur>${I.plus}</span>
  <div class="moments__cta" data-blur><span class="dot"></span><a class="pill" href="${url(0)}">En savoir plus ${I.arrow}</a></div>
  <figure class="moments__a" data-blur>${sliced(img(0, 0), 'shape-a', short(0))}<figcaption class="mono">©Lunettes caméra 8 MP — 2026</figcaption></figure>
  <p class="moments__p" data-blur>Filmez, appelez, traduisez : la technologie se fait discrète et tient dans vos lunettes.</p>
  <p class="moments__price" data-blur>(${price(0)})</p>
  <figure class="moments__b" data-blur><a href="${url(7)}">${frame([7, 2], 'shape-b', 'data-par')}</a><figcaption class="mono">©Souris verticale sans fil — 2026</figcaption></figure>
  <p class="moments__pct" data-blur>(${price(7)})</p>
</section>

<section class="cats" id="categories">
  <div class="cats__l" data-blur>
    <p>Chaque objet a sa place : au bureau, en voiture, à la maison. Faites défiler pour choisir un univers.</p>
    <a class="pill cats__cta" href="${typeUrl(CATS[0][0])}">Voir les produits ${I.arrow}</a>
  </div>
  <div class="cats__img shape-c" data-blur>${CATS.map(([, l, [p, i]]) => `<img src="${img(p, i)}" alt="${l}" loading="lazy" draggable="false">`).join('')}</div>
  <div class="cats__r" data-blur>
    <div class="drum"><ol class="drum__in">${CATS.map(([t, l], i) =>
      `<li><a href="${typeUrl(t)}"><span class="mono">[${pad2(i + 1)}]</span>${l} (${count(t)})</a></li>`).join('')}</ol></div>
    <p class="mono cats__lab">[Catégories]</p>
  </div>
</section>

${marquee(false)}

<section class="spot" id="coups-de-coeur">
  <div class="spot__top" data-blur>
    <p class="spot__count"><b>01</b><small>/${pad2(SPOT.length)}</small></p>
    <p class="mono">[Coup de cœur]</p>
    <span class="spot__q" aria-hidden="true">“</span>
  </div>
  <div class="spot__body" data-blur>
    <div class="spot__who">
      <div><p class="mono spot__name"></p><p class="spot__type"></p></div>
      <div class="frame spot__img"></div>
    </div>
    <div class="spot__main"><p class="spot__text"></p><p class="spot__meta"></p></div>
  </div>
  <div class="spot__bot" data-blur>
    <button class="circ" data-prev aria-label="Produit précédent">${I.back}</button>
    <p class="mono">Découvrez nos coups de cœur</p>
    <span class="spot__q" aria-hidden="true">”</span>
    <button class="circ" data-next aria-label="Produit suivant">${I.arrow}</button>
  </div>
</section>

<section class="car" id="selection">
  <div class="car__head" data-blur>
    <h2 class="h3">©hightech -<br>la sélection</h2>
    <p class="mono car__yr">2026</p>
    <a class="mono car__all" href="${SHOP}/collections/all">[Tout voir]</a>
    <div class="car__nav"><button class="circ sm" data-cprev aria-label="Précédent">${I.back}</button><button class="circ sm" data-cnext aria-label="Suivant">${I.arrow}</button></div>
  </div>
  <div class="car__view" data-blur><div class="car__track">${CARDS.map(([p, i], k) =>
    `<a class="card" href="${url(p)}" style="--h:${[0.86, 0.94, 1, 0.88][k % 4]}">${frame([p, i], ['', 'shape-d', 'shape-e', ''][k % 4])}<p class="mono card__cap">[${short(p)}] ${price(p)}</p></a>`).join('')}</div></div>
  <div class="car__bar"><span></span></div>
</section>

${marquee(true)}

<section class="cols">
  <div class="cols__l">
    <p class="cols__p" data-blur>Des essentiels du quotidien aux gadgets qui surprennent : quatre univers pensés pour vous simplifier la vie.</p>
    <div class="cols__img" data-blur>${COLS.map(([t, , , big]) => `<div class="cols__item">${sliced(img(...big), 'shape-c', t)}</div>`).join('')}</div>
    <p class="mono">Livraison dans 41 pays.</p>
  </div>
  <ul class="cols__list" data-blur>${COLS.map(([t, d, type, , th], i) => `
    <li class="row${i ? '' : ' is-open'}">
      <button class="row__h" aria-expanded="${!i}"><span class="row__t">${t} 2026</span><span class="circ sm">${I.arrow}</span></button>
      <div class="row__b"><div><div class="row__in">
        <div><p>${d}</p><a class="pill" href="${typeUrl(type)}">Découvrir ${I.arrow}</a></div>
        ${frame(th, 'row__thumb')}
      </div></div></div>
    </li>`).join('')}</ul>
</section>
</main>

<footer class="foot" id="contact">
  <div class="foot__top">
    <div class="foot__l" data-blur>
      <p class="mono lab">Contact</p>
      <h2 class="h2 foot__h">La tech connectée<br><span class="und"></span>livrée chez vous</h2>
      <form class="foot__form"><input name="m" placeholder="Écrivez-nous un message" aria-label="Votre message" autocomplete="off"><button class="circ inv" aria-label="Envoyer">${I.arrow}</button></form>
      <div class="foot__pay"><p class="mono lab">Paiement sécurisé</p><p>Visa · Mastercard · Amex · Maestro — 3-D Secure</p></div>
    </div>
    <div class="foot__info" data-blur>
      <div><p class="mono lab">Localisation</p><p>Fontenay-sous-Bois (94)<br>France</p></div>
      <div><p class="mono lab">Livraison</p><p>41 pays, dont la France,<br>la Belgique et la Suisse</p></div>
      <div><p class="mono lab">E-mail</p><p><a href="mailto:${EMAIL}">${EMAIL}</a></p></div>
      <div><p class="mono lab">Boutique en ligne</p><p>Ouverte 24 h/24, 7 j/7</p></div>
    </div>
    <div class="foot__menus" data-blur>
      <div><p class="mono lab">Menu</p><ul><li><a href="#univers">Univers</a></li><li><a href="#categories">Catégories</a></li><li><a href="#selection">Sélection</a></li><li><a href="#contact">Contact</a></li></ul></div>
      <div><p class="mono lab">Boutique</p><ul>${[0, 1, 3, 6].map((c) => `<li><a href="${typeUrl(CATS[c][0])}">${CATS[c][1]}</a></li>`).join('')}</ul></div>
      <div><p class="mono lab">Aide</p><ul><li><a href="${SHOP}/policies/shipping-policy">Livraison</a></li><li><a href="${SHOP}/policies/refund-policy">Retours</a></li><li><a href="${SHOP}/pages/contact">Nous écrire</a></li></ul></div>
    </div>
  </div>
  <div class="foot__bot mono">
    <a href="${SHOP}/policies/terms-of-service">Conditions générales</a>
    <a href="${SHOP}/policies/privacy-policy">Confidentialité</a>
    <p>© 2026 High Tech — Tous droits réservés</p>
  </div>
</footer>`;

/* ---------------- smooth scroll ---------------- */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const lenis = reduce ? null : new Lenis({ lerp: 0.1 });
if (lenis) {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ---------------- menu + anchors ---------------- */
const menu = document.querySelector('.menu');
const burger = document.querySelector('.burger');
const mtl = gsap.timeline({ paused: true, defaults: { ease: 'expo.inOut' } })
  .set(menu, { visibility: 'visible' })
  .fromTo(menu, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9 })
  .fromTo('.menu nav a span', { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.06, ease: 'expo.out' }, 0.45);
function toggleMenu(open) {
  if (open) { mtl.timeScale(1).play(); lenis?.stop(); } else { mtl.timeScale(1.6).reverse(); lenis?.start(); }
  burger.setAttribute('aria-expanded', open);
  menu.setAttribute('aria-hidden', !open);
}
burger.addEventListener('click', () => toggleMenu(true));
menu.querySelector('.menu__x').addEventListener('click', () => toggleMenu(false));
addEventListener('keydown', (e) => e.key === 'Escape' && toggleMenu(false));
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  e.preventDefault();
  if (menu.getAttribute('aria-hidden') === 'false') toggleMenu(false);
  if (lenis) lenis.scrollTo(a.hash, { duration: 1.6 });
  else document.querySelector(a.hash).scrollIntoView();
});

/* ---------------- hero ---------------- */
const tilt = document.querySelector('.hero__tilt');
gsap.timeline({ defaults: { ease: 'expo.out' } })
  .fromTo('.hero .ln > span', { yPercent: 110 }, { yPercent: 0, duration: 1.4, stagger: 0.08 })
  .fromTo(tilt, { scale: 1.12, opacity: 0, filter: 'blur(24px)' }, { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.8, clearProps: 'filter' }, 0.1)
  .fromTo('.hero [data-in]', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, stagger: 0.06 }, 0.5);

const rx = gsap.quickTo(tilt, 'rotationX', { duration: 0.9, ease: 'power3' });
const ry = gsap.quickTo(tilt, 'rotationY', { duration: 0.9, ease: 'power3' });
const hero = document.querySelector('.hero');
if (matchMedia('(hover: hover)').matches) {
  hero.addEventListener('pointermove', (e) => {
    ry((e.clientX / innerWidth - 0.5) * 18);
    rx((0.5 - e.clientY / innerHeight) * 10);
  });
  hero.addEventListener('pointerleave', () => { rx(0); ry(0); });
} else if (!reduce) {
  gsap.to(tilt, { rotationY: 10, duration: 3.5, ease: 'sine.inOut', yoyo: true, repeat: -1 });
}

/* ---------------- scroll-driven reveals (scrubbed, reversible) ---------------- */
if (!reduce) {
  gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } })
    .to('.hero__fig', { yPercent: 18, ease: 'none' }, 0)
    .to('.hero__l', { xPercent: -16, ease: 'none' }, 0)
    .to('.hero__r', { xPercent: 16, ease: 'none' }, 0);

  gsap.utils.toArray('[data-blur]').forEach((el) => {
    gsap.fromTo(el, { filter: 'blur(16px)', opacity: 0.15, y: 60 }, {
      filter: 'blur(0px)', opacity: 1, y: 0, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'clamp(top 62%)', scrub: 0.6 },
    });
  });

  gsap.utils.toArray('[data-sliced]').forEach((el) => {
    gsap.fromTo(el.querySelectorAll('.sl'), { xPercent: (i) => [-9, 7, -5][i] }, {
      xPercent: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'clamp(center 45%)', scrub: true },
    });
    gsap.fromTo(el.querySelectorAll('img'), { scale: 1.18 }, {
      scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  gsap.utils.toArray('[data-par] img').forEach((el) => {
    gsap.fromTo(el, { scale: 1.15, yPercent: -6 }, {
      yPercent: 6, ease: 'none', scrollTrigger: { trigger: el.parentNode, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

/* ---------------- categories: 3D drum ---------------- */
const drum = document.querySelector('.drum');
const items = [...drum.querySelectorAll('li')];
const catImgs = [...document.querySelectorAll('.cats__img img')];
const catCta = document.querySelector('.cats__cta');
const STEP = 26 * Math.PI / 180;
const ds = { pos: 0 };
let lh = 70;
let active = -1;
function setCat(n) {
  const prev = active;
  active = n;
  items.forEach((li, i) => li.classList.toggle('on', i === n));
  catCta.href = typeUrl(CATS[n][0]);
  if (prev < 0) { gsap.set(catImgs[n], { clipPath: 'inset(0% 0% 0% 0%)' }); return; }
  gsap.set(catImgs, { zIndex: 0 });
  gsap.set(catImgs[prev], { zIndex: 1 });
  gsap.fromTo(catImgs[n], { zIndex: 2, scale: 1.25, clipPath: n > prev ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)' },
    { scale: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'expo.out', overwrite: true });
}
function drawDrum() {
  const r = lh / Math.sin(STEP);
  items.forEach((li, i) => {
    const d = i - ds.pos;
    const a = gsap.utils.clamp(-3.3, 3.3, d) * STEP;
    li.style.transform = `translate3d(0, ${Math.sin(a) * r}px, ${(Math.cos(a) - 1) * r}px) rotateX(${-a}rad)`;
    li.style.opacity = Math.max(0, 1 - Math.abs(d) * 0.3);
  });
  const n = gsap.utils.clamp(0, items.length - 1, Math.round(ds.pos));
  if (n !== active) setCat(n);
}
const spinTo = (pos) => gsap.to(ds, { pos, duration: 0.7, ease: 'power3.out', overwrite: true, onUpdate: drawDrum });
ScrollTrigger.create({ trigger: '.cats', start: 'top 65%', end: 'bottom 35%', onUpdate: (s) => spinTo(s.progress * (items.length - 1)) });
items.forEach((li, i) => li.addEventListener('pointerenter', () => spinTo(i)));

/* ---------------- marquees (scroll velocity + direction) ---------------- */
const marqs = [...document.querySelectorAll('.marq')].map((m) => ({ el: m.firstElementChild, dir: m.hasAttribute('data-rev') ? 1 : -1, x: 0, w: 1 }));
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

/* ---------------- spotlight slider ---------------- */
const spot = {
  count: document.querySelector('.spot__count b'),
  name: document.querySelector('.spot__name'),
  type: document.querySelector('.spot__type'),
  img: document.querySelector('.spot__img'),
  text: document.querySelector('.spot__text'),
  meta: document.querySelector('.spot__meta'),
};
let si = 0;
function fillSpot() {
  const [p, k] = SPOT[si];
  const d = data[p];
  spot.count.textContent = pad2(si + 1);
  spot.name.textContent = `[${short(p)}]`;
  spot.type.textContent = d.type;
  spot.text.textContent = d.tagline || short(p);
  spot.meta.innerHTML = `<span class="acc">${price(p)}</span><span>${d.variants} déclinaison${d.variants > 1 ? 's' : ''}</span><a href="${url(p)}">Voir le produit</a>`;
  const im = new Image();
  im.src = img(p, k);
  im.alt = short(p);
  im.draggable = false;
  spot.img.append(im);
  gsap.fromTo(im, { clipPath: 'inset(0% 100% 0% 0%)', scale: 1.2 }, {
    clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.1, ease: 'expo.out',
    onComplete: () => { while (spot.img.children.length > 1) spot.img.firstElementChild.remove(); },
  });
}
const spotTxt = [spot.name, spot.type, spot.text, spot.meta];
function showSpot(step) {
  si = (si + step + SPOT.length) % SPOT.length;
  gsap.timeline()
    .to(spotTxt, { filter: 'blur(10px)', opacity: 0, y: -14 * step, duration: 0.35, ease: 'power2.in', stagger: 0.03 })
    .add(fillSpot)
    .fromTo(spotTxt, { filter: 'blur(10px)', opacity: 0, y: 14 * step }, { filter: 'blur(0px)', opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.05 });
}
fillSpot();
document.querySelector('[data-prev]').addEventListener('click', () => showSpot(-1));
document.querySelector('[data-next]').addEventListener('click', () => showSpot(1));
let sx = null;
const spotBody = document.querySelector('.spot__body');
spotBody.addEventListener('pointerdown', (e) => { sx = e.clientX; });
spotBody.addEventListener('pointerup', (e) => {
  if (sx !== null && Math.abs(e.clientX - sx) > 50) showSpot(e.clientX < sx ? 1 : -1);
  sx = null;
});

/* ---------------- carousel: scroll pan + drag + 3D coverflow ---------------- */
const track = document.querySelector('.car__track');
const cards = [...track.children];
const bar = document.querySelector('.car__bar span');
const car = { pan: 0, user: 0 };
let cw = 0, gap = 0, padL = 0, maxX = 0;
function measureCar() {
  cw = cards[0].offsetWidth;
  gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  padL = parseFloat(getComputedStyle(track).paddingLeft) || 0;
  maxX = Math.max(0, padL * 2 + cards.length * (cw + gap) - gap - innerWidth);
}
function drawCar() {
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
}
const nudge = (dir) => gsap.to(car, { user: car.user + dir * (cw + gap), duration: 0.9, ease: 'expo.out', overwrite: true, onUpdate: drawCar });
document.querySelector('[data-cprev]').addEventListener('click', () => nudge(-1));
document.querySelector('[data-cnext]').addEventListener('click', () => nudge(1));
ScrollTrigger.create({ trigger: '.car', start: 'top bottom', end: 'bottom top', onUpdate: (s) => { car.pan = s.progress; drawCar(); } });

let drag = null;
let dragged = false;
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
  drawCar();
});
addEventListener('pointerup', () => {
  if (!drag) return;
  gsap.to(car, { user: car.user - drag.v * 14, duration: 1, ease: 'power3.out', onUpdate: drawCar });
  drag = null;
  track.classList.remove('drag');
});
track.addEventListener('click', (e) => { if (dragged) e.preventDefault(); }, true);

/* ---------------- collections accordion ---------------- */
const rows = [...document.querySelectorAll('.row')];
const colItems = [...document.querySelectorAll('.cols__item')];
let ci = 0;
rows.forEach((r, i) => r.querySelector('.row__h').addEventListener('click', () => {
  if (i === ci) return;
  rows[ci].classList.remove('is-open');
  rows[ci].querySelector('.row__h').setAttribute('aria-expanded', false);
  r.classList.add('is-open');
  r.querySelector('.row__h').setAttribute('aria-expanded', true);
  gsap.set(colItems, { zIndex: 0 });
  gsap.set(colItems[ci], { zIndex: 1 });
  gsap.fromTo(colItems[i], { zIndex: 2, clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'expo.out' });
  gsap.fromTo(colItems[i].querySelectorAll('.sl'), { xPercent: (k) => [-12, 9, -7][k] }, { xPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.05 });
  ci = i;
}));

/* ---------------- contact form → mail client ---------------- */
document.querySelector('.foot__form').addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = e.target.m.value.trim();
  location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Message depuis le site Hightech 94')}&body=${encodeURIComponent(msg)}`;
});

/* ---------------- layout measurements ---------------- */
function measure() {
  lh = items[0].offsetHeight;
  drum.style.setProperty('--lh', `${lh}px`);
  for (const m of marqs) m.w = m.el.scrollWidth / 2;
  measureCar();
  drawDrum();
  drawCar();
}
measure();
document.fonts.ready.then(() => { measure(); ScrollTrigger.refresh(); });
let rt;
addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(measure, 150); });
