import {
  gsap, ScrollTrigger, data, reduce, img, purl, curl, price, priceTag, short, gstar, count, pad2, I, CATS,
  sliced, frame, layer, swap, split, marquee, carouselHTML, initCarousel, reveal, onResize, shell,
} from './shared.js';

const SPOT = [[0, 1], [1, 1], [2, 0], [4, 0], [5, 0], [8, 0]];
const CARDS = [[9, 0], [6, 1], [13, 0], [12, 0], [15, 0], [11, 0], [24, 0], [3, 0], [7, 0], [21, 0], [20, 0], [10, 0]];
const COLS = [
  ['Maison & sécurité', 'Caméras WiFi, prise connectée, ampoules RGB : la maison se pilote depuis le téléphone.', 'Sécurité connectée', [26, 0], [23, 0]],
  ['Route & recharge', 'Supports magnétiques et chargeurs sans fil : en voiture comme au bureau, tout tient et tout charge.', 'Charge et alimentation', [15, 0], [13, 1]],
  ['Bureau & ergonomie', 'Supports ventilés, souris verticales, tables pliantes : travailler mieux, sans mal de dos.', 'Bureau et informatique', [4, 0], [8, 0]],
  ['Air & bien-être', 'Purificateurs à ions négatifs pour la voiture, la chambre ou à porter autour du cou.', 'Air et ambiance', [19, 1], [21, 0]],
];
const firstSentence = (s) => s.split(/(?<=[.!?])\s/)[0];

const lenis = shell(`
<section class="hero" data-pin>
  <div class="hero__media"><video class="hero__video" muted playsinline preload="auto" poster="/video/hero-poster.webp" aria-label="Vue éclatée de la montre connectée Kayrox Pro"></video></div>
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
  <div class="hero__ch hero__ch--2"><p class="mono">[Kayrox Pro] — vue éclatée</p><p class="hero__chT">Cardio · SpO2 · Appels Bluetooth</p></div>
  <div class="hero__ch hero__ch--3l"><p class="mono">[Nouveauté 2026]</p><p class="hero__name">Montre connectée Kayrox Pro</p></div>
  <div class="hero__ch hero__ch--3r"><p class="hero__price">${priceTag(1)}</p><a class="pill pill--fill" href="${purl(1)}">Découvrir la montre ${I.arrow}</a></div>
  <button class="hero__scroll mono" aria-label="Faire défiler la vidéo"><b class="hero__scrollW">Faites </b>défiler<i></i></button>
</section>

<div class="strip">${[['glasses', 0], ['watch', 1], ['bolt', 3], ['car', 4], ['shield', 6], ['home', 7]]
  .map(([ic, c]) => `<a href="${curl(CATS[c][0])}">${I[ic]}${CATS[c][1]}</a>`).join('')}</div>

<section class="moments" id="univers">
  <h2 class="h2 moments__h" data-split>Tout - connecté<br>en un geste ©26</h2>
  <a class="moments__thumb" href="${purl(2)}" data-blur aria-label="${short(2)}">${frame(img(2, 4), short(2))}</a>
  <span class="cross moments__cross" data-blur>${I.plus}</span>
  <div class="moments__cta" data-blur><span class="dot"></span><a class="pill" href="${purl(0)}">En savoir plus ${I.arrow}</a></div>
  <figure class="moments__a" data-blur><a href="${purl(0)}">${sliced(img(0, 0), 'shape-a', short(0))}</a><figcaption class="mono">©Lunettes caméra 8 MP — 2026</figcaption></figure>
  <p class="moments__p" data-blur>Filmez, appelez, traduisez : la technologie se fait discrète et tient dans vos lunettes.</p>
  <p class="moments__price" data-blur>(${priceTag(0)})</p>
  <figure class="moments__b" data-blur><a href="${purl(7)}">${frame(img(7, 1), short(7), 'shape-b', 'data-par')}</a><figcaption class="mono">©Souris verticale sans fil — 2026</figcaption></figure>
  <p class="moments__pct" data-blur>(${priceTag(7)})</p>
</section>

<section class="cats" id="categories" data-pin>
  <div class="cats__l" data-blur>
    <p>Chaque objet a sa place : au bureau, en voiture, à la maison. Faites défiler pour choisir un univers.</p>
    <a class="pill cats__cta" href="${curl(CATS[0][0])}">Voir les produits ${I.arrow}</a>
  </div>
  <a class="cats__img shape-c" href="${curl(CATS[0][0])}" data-blur aria-label="Voir la catégorie">${CATS.map(([, l, [p, i]]) => layer(img(p, i), l)).join('')}</a>
  <div class="cats__r" data-blur>
    <div class="drum"><ol class="drum__in">${CATS.map(([t, l], i) =>
      `<li><a href="${curl(t)}"><span class="mono">[${pad2(i + 1)}]</span>${l} (${count(t)})</a></li>`).join('')}</ol></div>
    <p class="mono cats__lab">[Catégories]</p>
  </div>
</section>

${marquee(false)}

<section class="spot" id="coups-de-coeur">
  <div class="spot__top" data-blur>
    <p class="spot__count"><b>01</b><small>/${pad2(SPOT.length)}</small></p>
    <p class="mono">[Coup de cœur]</p>${gstar('spot__g')}
    <span class="spot__q" aria-hidden="true">“</span>
  </div>
  <div class="spot__body" data-blur>
    <div class="spot__who">
      <div><p class="mono spot__name"></p><p class="spot__type"></p></div>
      <a class="frame spot__img" href="#" aria-label="Voir le produit"></a>
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

${carouselHTML('©hightech', 'la sélection', CARDS, 'selection')}

${marquee(true)}

<section class="cols">
  <div class="cols__l">
    <p class="cols__p" data-blur>Des essentiels du quotidien aux gadgets qui surprennent : quatre univers pensés pour vous simplifier la vie.</p>
    <div class="cols__img" data-blur>${COLS.map(([t, , , big]) => `<div class="cols__item">${sliced(img(...big), 'shape-c', t)}</div>`).join('')}</div>
    <p class="mono">Livraison dans 41 pays.</p>
  </div>
  <ul class="cols__list" data-blur>${COLS.map(([t, d, type, , [p, i]], k) => `
    <li class="row${k ? '' : ' is-open'}">
      <button class="row__h" aria-expanded="${!k}"><span class="row__t">${t} 2026</span><span class="circ sm">${I.arrow}</span></button>
      <div class="row__b"><div><div class="row__in">
        <div><p>${d}</p><a class="pill" href="${curl(type)}">Découvrir ${I.arrow}</a></div>
        ${frame(img(p, i), short(p), 'row__thumb')}
      </div></div></div>
    </li>`).join('')}</ul>
</section>`);

/* ---------------- hero: exploded-view video scrubbed by the scroll (pinned) ---------------- */
const hero = document.querySelector('.hero');
const video = hero.querySelector('.hero__video');
const vt = { target: 0, cur: -1 };
if (matchMedia('(max-width: 820px)').matches) {
  // phones: the same 8 s as 120 WebP frames (15 fps, pre-cropped to the phone framing) on a canvas.
  // iOS Safari never paints a paused video that has not played, and refuses to play it in Low Power Mode.
  const N = 120;
  const canvas = document.createElement('canvas');
  canvas.className = 'hero__video';
  canvas.setAttribute('aria-hidden', 'true');
  video.replaceWith(canvas);
  const ctx = canvas.getContext('2d');
  const frames = [];
  let drawn = -1;
  const load = (i) => new Promise((done) => {
    const im = new Image();
    im.onload = () => { frames[i] = im; done(); };
    im.onerror = done;
    im.src = `/video/m/${String(i + 1).padStart(3, '0')}.webp`;
  });
  // cover-fit the nearest frame already loaded at or before i
  const draw = (i) => {
    let k = i;
    while (k > 0 && !frames[k]) k--;
    const im = frames[k];
    if (!im || k === drawn) return;
    const s = Math.max(canvas.width / im.width, canvas.height / im.height);
    ctx.drawImage(im, (canvas.width - im.width * s) / 2, (canvas.height - im.height * s) / 2, im.width * s, im.height * s);
    drawn = k;
  };
  const size = () => {
    const d = Math.min(devicePixelRatio || 1, 2); // layout size: the intro zoom must not count
    canvas.width = Math.round(canvas.clientWidth * d);
    canvas.height = Math.round(canvas.clientHeight * d);
    drawn = -1;
    draw(vt.cur < 0 ? 0 : vt.cur);
  };
  size();
  onResize(size);
  // first frame at once, then the rest in order, six at a time
  load(0).then(async () => {
    draw(0);
    for (let i = 1; i < N; i += 6) await Promise.all(Array.from({ length: Math.min(6, N - i) }, (_, k) => load(i + k)));
  });
  gsap.ticker.add(() => {
    vt.cur = Math.round(vt.target * (N - 1));
    draw(vt.cur);
  });
} else {
  // whole file in memory so every seek is instant (no range requests while scrubbing)
  fetch('/video/hero-1080.mp4').then((r) => r.blob()).then((b) => { video.src = URL.createObjectURL(b); });
  // iPad Safari also paints seeked frames only after one play()
  video.addEventListener('loadeddata', () => video.play().then(() => video.pause()).catch(() => {}), { once: true });
  gsap.ticker.add(() => {
    if (video.readyState < 1 || video.seeking) return;
    const t = Math.min(vt.target * video.duration, video.duration - 0.08); // the very last frame decodes black
    if (Math.abs(t - vt.cur) > 0.01) { video.currentTime = t; vt.cur = t; }
  });
}

gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.5 })
  .fromTo('.hero__media', { scale: 1.08, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.8 })
  .fromTo('.hero .ln > span', { yPercent: 110 }, { yPercent: 0, duration: 1.4, stagger: 0.08 }, 0.1)
  .fromTo('.hero [data-in], .hero__scroll', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, stagger: 0.06 }, 0.5);

// one timeline, same length as the video: title → exploded view caption → product + price
const htl = gsap.timeline({
  defaults: { ease: 'none' },
  scrollTrigger: {
    trigger: hero, start: 'top top', end: () => `+=${innerHeight * 3}`, pin: true, scrub: true, invalidateOnRefresh: true,
    onUpdate: (s) => { vt.target = s.progress; },
  },
});
const flip = (el) => (reduce ? [] : split(el));
htl.to('.hero__scroll', { opacity: 0, duration: 0.04 }, 0.01)
  .to('.hero [data-in]', { opacity: 0, y: -20, duration: 0.1, stagger: 0.008 }, 0.12)
  .to('.hero__l', { xPercent: -60, opacity: 0, duration: 0.14 }, 0.16)
  .to('.hero__r', { xPercent: 60, opacity: 0, duration: 0.14 }, 0.16)
  .fromTo('.hero__ch--2', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.07 }, 0.34)
  .fromTo(flip(document.querySelector('.hero__chT')), { yPercent: 110, rotationX: -90, opacity: 0 }, { yPercent: 0, rotationX: 0, opacity: 1, duration: 0.08, stagger: 0.002 }, 0.35)
  .to('.hero__ch--2', { opacity: 0, y: -30, duration: 0.06 }, 0.68)
  .fromTo('.hero__ch--3l, .hero__ch--3r', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.08, stagger: 0.02 }, 0.76)
  // letters done by 0.9 so the product name is fully readable before the page moves on
  .fromTo(flip(document.querySelector('.hero__name')), { yPercent: 110, rotationX: -90, opacity: 0 }, { yPercent: 0, rotationX: 0, opacity: 1, duration: 0.08, stagger: 0.002 }, 0.77)
  .to({}, { duration: 0.02 }, 0.98);
hero.querySelector('.hero__scroll').addEventListener('click', () => {
  const end = htl.scrollTrigger.end;
  if (lenis) lenis.scrollTo(end, { duration: 4 }); else scrollTo(0, end);
});

/* ---------------- categories: 3D drum + one opaque photo layer per category ---------------- */
const drum = document.querySelector('.drum');
const items = [...drum.querySelectorAll('li')];
const catLays = [...document.querySelectorAll('.cats__img .lay')];
const catLinks = [document.querySelector('.cats__cta'), document.querySelector('.cats__img')];
const catLab = document.querySelector('.cats__lab');
const STEP = 15 * Math.PI / 180;
const ds = { pos: 0 };
let lh = 70;
let active = -1;
function setCat(n) {
  const prev = active;
  active = n;
  items.forEach((li, i) => li.classList.toggle('on', i === n));
  catLinks.forEach((a) => { a.href = curl(CATS[n][0]); });
  catLab.textContent = `[${pad2(n + 1)}/${pad2(CATS.length)}] Catégories`;
  swap(catLays, prev, n, n > prev ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)');
}
function drawDrum() {
  const r = lh / Math.sin(STEP);
  items.forEach((li, i) => {
    const d = i - ds.pos;
    const a = gsap.utils.clamp(-3.4, 3.4, d) * STEP;
    const ad = Math.abs(d);
    li.style.transform = `translate3d(0, ${Math.sin(a) * r}px, ${(Math.cos(a) - 1) * r}px) rotateX(${-a}rad) scale(${1 - Math.min(ad, 3) * 0.05})`;
    li.style.opacity = Math.max(0, 1 - ad * 0.36);
  });
  const n = gsap.utils.clamp(0, items.length - 1, Math.round(ds.pos));
  if (n !== active) setCat(n);
}
const spinTo = (pos) => gsap.to(ds, { pos, duration: 0.7, ease: 'power3.out', overwrite: true, onUpdate: drawDrum });
// pinned while the visitor scrolls: each category gets half a screen of scroll
ScrollTrigger.create({
  trigger: '.cats', start: 'top top', end: () => `+=${innerHeight * 0.5 * (items.length - 1)}`,
  pin: true, anticipatePin: 1, invalidateOnRefresh: true,
  onUpdate: (s) => spinTo(s.progress * (items.length - 1)),
});
items.forEach((li, i) => li.addEventListener('pointerenter', () => spinTo(i)));
const measureDrum = () => {
  lh = items[0].offsetHeight;
  drum.style.setProperty('--lh', `${lh}px`);
  drawDrum();
};
measureDrum();
document.fonts.ready.then(measureDrum);
onResize(measureDrum);

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
  const n = d.variants.length;
  spot.count.textContent = pad2(si + 1);
  spot.name.textContent = `[${short(p)}]`;
  spot.type.textContent = CATS.find((c) => c[0] === d.type)[1];
  spot.text.textContent = `${d.tagline}. ${firstSentence(d.excerpt)}`;
  spot.meta.innerHTML = `<span class="acc">${priceTag(p)}</span><span>${n} déclinaison${n > 1 ? 's' : ''}</span><a href="${purl(p)}">Voir le produit</a>`;
  spot.img.href = purl(p);
  spot.img.insertAdjacentHTML('beforeend', layer(img(p, k), short(p)));
  const lays = [...spot.img.children];
  swap(lays, lays.length - 2, lays.length - 1, 'inset(0% 100% 0% 0%)');
  gsap.delayedCall(1.1, () => { while (spot.img.children.length > 1) spot.img.firstElementChild.remove(); });
}
const spotTxt = [spot.name, spot.type, spot.text, spot.meta];
function showSpot(step) {
  si = (si + step + SPOT.length) % SPOT.length;
  gsap.timeline()
    .to(spotTxt, { filter: 'blur(10px)', opacity: 0, y: -14 * step, duration: 0.35, ease: 'power2.in', stagger: 0.03 })
    .add(fillSpot)
    .fromTo(spotTxt, { filter: 'blur(10px)', opacity: 0, y: 14 * step }, { filter: 'blur(0px)', opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.05, clearProps: 'filter' });
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

/* ---------------- carousel ---------------- */
initCarousel(document.querySelector('#selection'));

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
  swap(colItems, ci, i, 'inset(0% 0% 100% 0%)');
  gsap.fromTo(colItems[i].querySelectorAll('.sl'), { xPercent: (k) => [-12, 9, -7][k] }, { xPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.05 });
  ci = i;
}));

// after the pin, so triggers below it account for the pin spacing
reveal();
