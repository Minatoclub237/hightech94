import {
  gsap, ScrollTrigger, data, reduce, img, purl, curl, price, short, count, ph, CATS, catOf,
  frame, marquee, reveal, shell,
} from './shared.js';

let type = new URLSearchParams(location.search).get('t') ?? '';
if (!catOf(type)) type = '';
let sort = 'rel';
const SHAPES = ['', 'shape-d', 'shape-e', 'shape-b'];

shell(`
<section class="plp">
  <div class="plp__head">
    <p class="mono plp__lab">[Boutique] — <span class="plp__n"></span> produits</p>
    <h1 class="plp__title"><span class="ln"><span class="plp__t"></span></span></h1>
    <p class="plp__p"></p>
    <div class="plp__bar">
      <nav class="chips" aria-label="Catégories">${[['', 'Tout', data.length], ...CATS.map((c) => [c[0], c[1], count(c[0])])]
        .map(([t, l, k]) => `<a class="chip" href="${curl(t)}" data-t="${t}">${l} <small>(${k})</small></a>`).join('')}</nav>
      <div class="sort"><span class="mono">Trier</span>${[['rel', 'Pertinence'], ['asc', 'Prix ↑'], ['desc', 'Prix ↓']]
        .map(([k, l]) => `<button class="chip" data-s="${k}">${l}</button>`).join('')}</div>
    </div>
  </div>
  <div class="plp__grid"></div>
</section>
${marquee(false)}`);

const grid = document.querySelector('.plp__grid');
let triggers = [];
function card(i, k) {
  const d = data[i];
  const v = d.variants.length;
  return `<a class="pcard" href="${purl(i)}" data-blur><div class="pcard__in">
    <div class="frame pcard__img ${SHAPES[k % 4]}"><img ${ph(img(i))} src="${img(i)}" alt="${short(i)}" loading="lazy" draggable="false">${d.images[1] ? `<span class="pcard__alt"><img ${ph(img(i, 1))} src="${img(i, 1)}" alt="" loading="lazy" draggable="false"></span>` : ''}</div>
    <p class="mono pcard__type">[${catOf(d.type)[1]}]</p>
    <p class="pcard__t">${short(i)}</p>
    <p class="pcard__p">${price(i)}${v > 1 ? ` <span>· ${v} déclinaisons</span>` : ''}</p>
  </div></a>`;
}
function render(first) {
  const c = catOf(type);
  document.querySelector('.plp__t').textContent = c ? c[1].toLowerCase() : 'boutique';
  document.querySelector('.plp__p').textContent = c ? c[3] : 'Les 30 objets high-tech de la boutique, livrés en 10 à 15 jours dans 41 pays.';
  document.title = `${c ? c[1] : 'Boutique'} — Hightech 94`;
  const list = [...data.keys()].filter((i) => !type || data[i].type === type);
  if (sort !== 'rel') list.sort((a, b) => (data[a].min - data[b].min) * (sort === 'asc' ? 1 : -1));
  document.querySelector('.plp__n').textContent = list.length;
  document.querySelectorAll('[data-t]').forEach((a) => a.classList.toggle('on', a.dataset.t === type));
  document.querySelectorAll('[data-s]').forEach((b) => b.classList.toggle('on', b.dataset.s === sort));

  triggers.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
  grid.innerHTML = list.map(card).join('');
  triggers = reveal(grid);
  ScrollTrigger.refresh();
  if (!first) gsap.fromTo('.pcard__in', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, stagger: 0.05, ease: 'expo.out' });
  if (!reduce && matchMedia('(hover: hover)').matches) {
    grid.querySelectorAll('.pcard').forEach((el) => {
      const f = el.querySelector('.pcard__img');
      const rx = gsap.quickTo(f, 'rotationX', { duration: 0.8, ease: 'power3' });
      const ry = gsap.quickTo(f, 'rotationY', { duration: 0.8, ease: 'power3' });
      el.addEventListener('pointermove', (e) => {
        const r = f.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 16);
        rx((0.5 - (e.clientY - r.top) / r.height) * 12);
      });
      el.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
  }
}

document.querySelector('.chips').addEventListener('click', (e) => {
  const a = e.target.closest('[data-t]');
  if (!a) return;
  e.preventDefault();
  if (a.dataset.t === type) return;
  type = a.dataset.t;
  history.replaceState(null, '', curl(type));
  gsap.to('.plp__t', { yPercent: 110, duration: 0.4, ease: 'power3.in', onComplete: () => {
    render(false);
    gsap.fromTo('.plp__t', { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out' });
  } });
});
document.querySelector('.sort').addEventListener('click', (e) => {
  const b = e.target.closest('[data-s]');
  if (!b || b.dataset.s === sort) return;
  sort = b.dataset.s;
  render(false);
});

render(true);
gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.55 })
  .fromTo('.plp__t', { yPercent: 110 }, { yPercent: 0, duration: 1.4 })
  .fromTo('.plp__lab, .plp__p, .plp__bar', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, stagger: 0.06 }, 0.2)
  .fromTo('.pcard__in', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.06 }, 0.3);
