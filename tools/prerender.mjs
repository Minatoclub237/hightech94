// Usage: node tools/prerender.mjs        (SITE_URL=https://votre-domaine.fr for absolute URLs + sitemap)
// Writes one HTML entry per page (home, every product, every category, legal pages) with its own
// title, description, Open Graph tags, schema.org JSON-LD and a plain-HTML copy of the content
// for crawlers that do not run JavaScript; also public/robots.txt, sitemap.xml and llms.txt.
import fs from 'node:fs/promises';
import path from 'node:path';
import { BIZ, CATS, POLICY_KEYS, CONTENT_KEYS, SHIPPING, eur, shortTitle, productPath, catPath, pagePath, legalHTML, faqPairs } from '../src/catalog.js';

const root = path.resolve(import.meta.dirname, '..');
const data = JSON.parse(await fs.readFile(path.join(root, 'src/data.json'), 'utf8'));
const policies = JSON.parse(await fs.readFile(path.join(root, 'src/policies.json'), 'utf8'));
const SITE = (process.env.SITE_URL || '').replace(/\/$/, '');
const abs = (p) => SITE + p;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const strip = (h) => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const clip = (s, n = 155) => (s.length > n ? `${s.slice(0, n - 1).replace(/\s+\S*$/, '')}…` : s);
const ld = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;
const priceTxt = (d) => (d.min === d.max ? eur(d.min) : `dès ${eur(d.min)}`);
const label = (t) => CATS.find((c) => c[0] === t)[1];
const STORE_ID = `${abs('/')}#store`;
const PAY = 'Visa, Mastercard, American Express, Cartes Bancaires, PayPal, Apple Pay, Shop Pay, Klarna';
const content = JSON.parse(await fs.readFile(path.join(root, 'src/pages.json'), 'utf8'));
// standard delivery in France (the free option from 60 € only applies to eligible products)
const SHIP_FR = {
  '@type': 'OfferShippingDetails',
  shippingRate: { '@type': 'MonetaryAmount', value: SHIPPING.fr.toFixed(2), currency: 'EUR' },
  shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'FR' },
};
const RETURNS = {
  '@type': 'MerchantReturnPolicy', applicableCountry: 'FR', merchantReturnDays: 30,
  returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow', returnMethod: 'https://schema.org/ReturnByMail',
};
const crumbs = (items) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(url) })),
});

const html = ({ title, desc, url, image, type = 'website', script, schema = [], body }) => `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(desc)}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:site_name" content="${BIZ.name}" />
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(desc)}" />
    ${SITE ? `<link rel="canonical" href="${abs(url)}" />
    <meta property="og:url" content="${abs(url)}" />` : ''}
    <meta property="og:image" content="${esc(image)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <style>html{background:#0b0b0b}#boot{position:fixed;inset:0;z-index:200;display:grid;place-items:center;background:#0b0b0b}#boot img{display:block;width:min(320px,56vw);height:auto;mix-blend-mode:lighten}.seo{max-width:760px;margin:0 auto;padding:120px 24px;font:17px/1.6 system-ui,sans-serif;color:#444;background:#fff}.seo a{color:inherit}</style>
    ${schema.map(ld).join('\n    ')}
  </head>
  <body>
    <div id="boot"><img src="/brand/logo-dark.webp" alt="" width="720" height="619" /></div>
    <div id="app"><main class="seo">${body}</main></div>
    <script type="module" src="/src/${script}.js"></script>
  </body>
</html>
`;
const write = async (rel, content) => {
  await fs.mkdir(path.join(root, path.dirname(rel)), { recursive: true });
  await fs.writeFile(path.join(root, rel), content);
};
const productList = (list) => `<ul>${list.map((d) => `<li><a href="${productPath(d.handle)}">${esc(shortTitle(d.title))}</a> — ${priceTxt(d)}</li>`).join('')}</ul>`;
const urls = [];

/* home */
const store = {
  '@context': 'https://schema.org', '@type': 'Store', '@id': STORE_ID, name: BIZ.name, url: abs('/'),
  telephone: BIZ.tel, email: BIZ.email, currenciesAccepted: 'EUR', paymentAccepted: PAY,
  address: { '@type': 'PostalAddress', streetAddress: BIZ.street, postalCode: BIZ.zip, addressLocality: BIZ.city, addressCountry: BIZ.country },
  geo: { '@type': 'GeoCoordinates', latitude: BIZ.geo[0], longitude: BIZ.geo[1] },
  hasMap: BIZ.maps, sameAs: [BIZ.maps],
  ...(SITE && { logo: abs('/brand/logo-dark.webp'), image: abs('/video/hero-poster.webp') }),
};
await write('index.html', html({
  title: 'High Tech 94 — Objets connectés & high-tech à Fontenay-sous-Bois',
  desc: 'Montres et lunettes connectées, recharge sans fil, sécurité et maison intelligente : 30 objets high-tech livrés en 10 à 15 jours dans 41 pays. Retours sous 30 jours.',
  url: '/', image: SITE ? abs('/video/hero-poster.webp') : data[1].cdn[0], script: 'main',
  schema: [store, { '@context': 'https://schema.org', '@type': 'WebSite', name: BIZ.name, url: abs('/'), inLanguage: 'fr-FR', publisher: { '@id': STORE_ID } }],
  body: `<h1>High Tech 94 — objets connectés et high-tech</h1>
<p>Boutique en ligne basée à ${BIZ.city} (94) : ${CATS.map((c) => c[1].toLowerCase()).join(', ')}. Livraison en 10 à 15 jours dans 41 pays, retours sous 30 jours, paiement sécurisé.</p>
<h2>Catégories</h2><ul>${CATS.map((c) => `<li><a href="${catPath(c[0])}">${c[1]}</a> — ${c[3]}</li>`).join('')}</ul>
<h2>Produits</h2>${productList(data)}
<p>${BIZ.street}, ${BIZ.zip} ${BIZ.city} · <a href="tel:${BIZ.tel}">${BIZ.phone}</a> · <a href="mailto:${BIZ.email}">${BIZ.email}</a></p>`,
}));
urls.push(['/', new Date().toISOString()]);

/* products */
for (const d of data) {
  const url = productPath(d.handle);
  const name = shortTitle(d.title);
  const c = CATS.find((x) => x[0] === d.type);
  const text = strip(d.desc);
  await write(`produit/${d.handle}/index.html`, html({
    title: `${name} — ${priceTxt(d)} | ${BIZ.name}`,
    desc: clip(`${d.tagline ? `${d.tagline}. ` : ''}${d.excerpt || text}`),
    url, image: d.cdn[0], type: 'product', script: 'product',
    schema: [{
      '@context': 'https://schema.org', '@type': 'Product', name: d.title, description: clip(text, 500),
      image: d.cdn.slice(0, 6), category: d.type, brand: { '@type': 'Brand', name: BIZ.name },
      sku: d.variants[0].sku || String(d.variants[0].id),
      offers: d.variants.map((v) => ({
        '@type': 'Offer', url: abs(url), sku: v.sku || String(v.id), priceCurrency: 'EUR', price: v.price.toFixed(2),
        ...(v.title !== 'Default Title' && { name: v.title }),
        availability: v.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition', shippingDetails: SHIP_FR, hasMerchantReturnPolicy: RETURNS, seller: { '@id': STORE_ID },
      })),
    }, crumbs([['Accueil', '/'], [c[1], catPath(d.type)], [name, url]])],
    body: `<p><a href="/">Accueil</a> › <a href="${catPath(d.type)}">${c[1]}</a></p>
<h1>${esc(d.title)}</h1><p><strong>${priceTxt(d)}</strong> — livraison en 10 à 15 jours, retours sous 30 jours.</p>${d.desc}`,
  }));
  urls.push([url, d.updated]);
}

/* categories */
const catPage = async (t) => {
  const c = CATS.find((x) => x[0] === t);
  const list = data.filter((d) => !t || d.type === t);
  const url = catPath(t);
  const title = c ? `${c[1]} — ${list.length} produits | ${BIZ.name}` : `Boutique — ${list.length} objets high-tech | ${BIZ.name}`;
  await write(`${url.slice(1)}index.html`, html({
    title, desc: c ? clip(`${c[3]} ${list.length} produits, livrés en 10 à 15 jours.`) : 'Tous les objets connectés et high-tech de la boutique High Tech 94, livrés en 10 à 15 jours dans 41 pays.',
    url, image: list[0].cdn[0], script: 'category',
    schema: [{
      '@context': 'https://schema.org', '@type': 'CollectionPage', name: c ? c[1] : 'Boutique', url: abs(url),
      mainEntity: { '@type': 'ItemList', itemListElement: list.map((d, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(productPath(d.handle)), name: shortTitle(d.title) })) },
    }, crumbs([['Accueil', '/'], [c ? c[1] : 'Boutique', url]])],
    body: `<h1>${c ? c[1] : 'Boutique'}</h1><p>${c ? c[3] : 'Tous nos objets connectés et high-tech.'}</p>${productList(list)}
<p>${CATS.map((x) => `<a href="${catPath(x[0])}">${x[1]}</a>`).join(' · ')}</p>`,
  }));
  urls.push([url, new Date().toISOString()]);
};
await catPage('');
for (const c of CATS) await catPage(c[0]);

/* information pages: the owner's own pages, legal notice, Shopify policies */
const pages = {
  ...Object.fromEntries(CONTENT_KEYS.map((k) => [k, content[k]])),
  'mentions-legales': { title: 'Mentions légales', html: legalHTML() },
  ...Object.fromEntries(POLICY_KEYS.map((k) => [k, policies[k]])),
};
for (const [k, p] of Object.entries(pages)) {
  const schema = k === 'faq' ? [{
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqPairs(p.html).map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: strip(a) } })),
  }] : [];
  await write(`page/${k}/index.html`, html({
    title: `${p.title} | ${BIZ.name}`, desc: clip(strip(p.html)) || p.title, url: pagePath(k), image: data[1].cdn[0], script: 'page', schema, body: `<h1>${p.title}</h1>${p.html}`,
  }));
  urls.push([pagePath(k), new Date().toISOString()]);
}

/* old ?p= / ?t= links keep working */
const redirect = (js) => `<!doctype html><html lang="fr"><head><meta charset="UTF-8" /><meta name="robots" content="noindex" /><title>${BIZ.name}</title></head><body><script>${js}</script></body></html>\n`;
await write('produit/index.html', redirect("const p=new URLSearchParams(location.search).get('p');location.replace(p?'/produit/'+encodeURIComponent(p)+'/':'/categorie/');"));
await write('page/index.html', redirect("const p=new URLSearchParams(location.search).get('p');location.replace('/page/'+(p||'mentions-legales')+'/');"));

/* robots, sitemap, llms.txt */
await fs.writeFile(path.join(root, 'public/robots.txt'), `User-agent: *\nAllow: /\n${SITE ? `\nSitemap: ${SITE}/sitemap.xml\n` : ''}`);
if (SITE) {
  await fs.writeFile(path.join(root, 'public/sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, d]) => `  <url><loc>${abs(u)}</loc><lastmod>${d.slice(0, 10)}</lastmod></url>`).join('\n')}
</urlset>
`);
}
await fs.writeFile(path.join(root, 'public/llms.txt'), `# ${BIZ.name}

> Boutique en ligne d'objets connectés et high-tech basée à ${BIZ.city} (94, France) : montres et lunettes connectées, recharge sans fil, sécurité, maison intelligente, accessoires auto et bureau. Livraison en 10 à 15 jours dans 41 pays, retours sous 30 jours, paiement sécurisé (${PAY}).

- Adresse : ${BIZ.street}, ${BIZ.zip} ${BIZ.city}, France
- Téléphone : ${BIZ.phone} — E-mail : ${BIZ.email}
- Note Google : ${BIZ.rating}/5 (${BIZ.maps})

## Catégories
${CATS.map((c) => `- [${c[1]}](${abs(catPath(c[0]))}) : ${c[3]}`).join('\n')}

## Produits
${data.map((d) => `- [${shortTitle(d.title)}](${abs(productPath(d.handle))}) — ${priceTxt(d)} (${label(d.type)})${d.tagline ? ` : ${d.tagline}` : ''}`).join('\n')}

## Informations
${Object.entries(pages).map(([k, p]) => `- [${p.title}](${abs(pagePath(k))})`).join('\n')}
`);
console.log(`${urls.length} pages${SITE ? ` + sitemap for ${SITE}` : ' (no SITE_URL yet: canonical tags and sitemap are added once the domain is set)'}`);
