// Pure data and formatting shared by the site (browser) and tools/prerender.mjs (Node).

export const SHOP = 'https://hightech94-store.myshopify.com';

// Verified on the Google Maps listing (2026-10-24) and the store's pages
export const BIZ = {
  name: 'High Tech 94',
  street: '3 Rue Jean Zay',
  zip: '94120',
  city: 'Fontenay-sous-Bois',
  country: 'FR',
  phone: '06 66 69 81 16',
  tel: '+33666698116',
  email: 'sgueblaoui@gmail.com',
  geo: [48.856722, 2.4831704],
  maps: 'https://www.google.com/maps?cid=5817617384683969146',
  rating: '5,0',
};

// Registry details the owner must fill in before going live (empty = shown as "à compléter")
export const LEGAL = {
  company: '', // raison sociale (ou nom et prénom pour une entreprise individuelle)
  form: '', // forme juridique : EI, micro-entreprise, SASU, SARL…
  siret: '',
  rcs: '', // ex. « RCS Créteil 123 456 789 » (sociétés uniquement)
  capital: '', // sociétés uniquement
  vat: '', // n° de TVA intracommunautaire, si assujetti
  director: '', // directeur ou directrice de la publication
  siteHost: '', // hébergeur du site une fois mis en ligne (ex. Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA)
  mediator: '', // médiateur de la consommation (obligatoire pour la vente aux particuliers)
};

// [product type, label, cover [product, image], description, slug]
export const CATS = [
  ['Lunettes connectées', 'Lunettes', [3, 0], 'Appels, musique, photo et traduction : des lunettes qui en font plus.', 'lunettes'],
  ['Objets connectés', 'Montres', [1, 0], 'Une montre connectée complète et un chargeur sans fil à emporter.', 'montres'],
  ['Bureau et informatique', 'Bureau', [9, 0], 'Supports, souris verticales et tables pour travailler sans mal de dos.', 'bureau'],
  ['Charge et alimentation', 'Recharge', [11, 0], 'Chargeurs sans fil et stations 3-en-1 pour garder tout l’équipement chargé.', 'recharge'],
  ['Accessoires auto', 'Auto', [12, 0], 'Supports magnétiques et chargeurs pour garder le téléphone à portée de vue.', 'auto'],
  ['Air et ambiance', 'Air pur', [19, 0], 'Purificateurs à ions négatifs pour la maison, la voiture ou à porter autour du cou.', 'air-pur'],
  ['Sécurité connectée', 'Sécurité', [26, 0], 'Caméras WiFi sans perçage, sur batterie ou cachées dans une ampoule.', 'securite'],
  ['Maison connectée', 'Maison', [23, 0], 'Prise connectée et routeur de poche : la maison pilotée depuis le téléphone.', 'maison'],
  ['Éclairage connecté', 'Lumière', [27, 0], 'Ampoules RGB pilotables à la voix ou depuis l’application.', 'lumiere'],
];

export const POLICY_KEYS = ['shipping-policy', 'refund-policy', 'terms-of-service', 'privacy-policy'];

// Mentions légales (LCEN art. 6 III, Code de la consommation L.111-1 et L.612-1)
const todo = (v, hint = '') => v || `<mark class="todo">à compléter${hint ? ` — ${hint}` : ''}</mark>`;
export const legalHTML = () => `
<h2>Éditeur du site</h2>
<p>Nom commercial : <strong>${BIZ.name}</strong><br>
Raison sociale : ${todo(LEGAL.company, 'nom de la société, ou nom et prénom de l’entrepreneur')}<br>
Forme juridique : ${todo(LEGAL.form, 'EI, micro-entreprise, SASU, SARL…')}<br>
Adresse : ${BIZ.street}, ${BIZ.zip} ${BIZ.city}, France<br>
Téléphone : <a href="tel:${BIZ.tel}">${BIZ.phone}</a><br>
E-mail : <a href="mailto:${BIZ.email}">${BIZ.email}</a><br>
SIRET : ${todo(LEGAL.siret)}<br>
RCS : ${todo(LEGAL.rcs, 'sociétés uniquement')}<br>
Capital social : ${todo(LEGAL.capital, 'sociétés uniquement')}<br>
N° de TVA intracommunautaire : ${todo(LEGAL.vat, 'si assujetti à la TVA')}<br>
Directeur ou directrice de la publication : ${todo(LEGAL.director)}</p>
<h2>Hébergement</h2>
<p>Boutique, commandes et paiement : Shopify International Limited, Victoria Buildings, 2nd Floor, 1-2 Haddington Road, Dublin 4, D04 XN32, Irlande.<br>
Site vitrine : ${todo(LEGAL.siteHost, 'hébergeur choisi lors de la mise en ligne')}</p>
<h2>Médiation de la consommation</h2>
<p>Conformément aux articles L.612-1 et suivants du Code de la consommation, vous pouvez recourir gratuitement à un médiateur de la consommation en cas de litige non résolu avec nous : ${todo(LEGAL.mediator, 'nom et coordonnées du médiateur')}.</p>
<h2>Propriété intellectuelle</h2>
<p>Les textes, logos, visuels et vidéos de ce site appartiennent à ${BIZ.name} ou à leurs auteurs respectifs. Toute reproduction sans autorisation écrite est interdite.</p>
<h2>Données personnelles et cookies</h2>
<p>Les données d’une commande sont traitées par Shopify pour le compte de ${BIZ.name} ; consultez notre <a href="${pagePath('privacy-policy')}">politique de confidentialité</a> pour exercer vos droits. Ce site ne dépose aucun cookie publicitaire : votre panier est simplement enregistré dans votre navigateur.</p>`;

export const eur = (n) => n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: n % 1 ? 2 : 0 });
export const shortTitle = (title) => title.split(/ [–-] |, /)[0];
export const productPath = (handle) => `/produit/${handle}/`;
export const catPath = (type) => {
  const c = CATS.find((x) => x[0] === type);
  return c ? `/categorie/${c[4]}/` : '/categorie/';
};
export const pagePath = (key) => `/page/${key}/`;
