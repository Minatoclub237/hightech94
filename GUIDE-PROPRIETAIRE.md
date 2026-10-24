# Guide du propriétaire — site High Tech 94

Le site est une vitrine. **Shopify reste votre outil de gestion** : produits, prix, stock, commandes,
paiements, remboursements et codes promo se gèrent comme avant dans l'administration Shopify.
Le site lit ces informations et envoie le client vers la caisse Shopify au moment de payer.

---

## 1. Mettre le site en ligne (une seule fois, environ 30 minutes)

1. **GitHub** (gratuit) : créez un compte sur github.com, puis un dépôt **privé** nommé `hightech94`,
   et envoyez-y le dossier du site (votre webdesigner peut le faire pour vous).
2. **Vercel** (gratuit) : connectez-vous sur vercel.com avec votre compte GitHub →
   *Add New → Project* → choisissez le dépôt `hightech94`.
   - Framework : **Vite** · Commande : `npm run build` · Dossier de sortie : `dist`
   - Variable d’environnement `SITE_URL` : inutile tant que le site reste sur hightech94.vercel.app ; à créer avec votre domaine définitif (ex. `https://hightech94.fr`)
   - Cliquez sur **Deploy**.
3. **Nom de domaine** : achetez-le (OVH, Gandi… environ 10 € par an), puis dans Vercel →
   *Settings → Domains* → ajoutez-le et suivez les deux réglages DNS indiqués.
4. Dans GitHub → *Settings → Secrets and variables → Actions → Variables*, ajoutez aussi `SITE_URL`
   avec la même adresse (elle sert à la synchronisation de nuit).

## 2. Brancher Shopify sur le nouveau site

| Où, dans Shopify | Quoi faire | Pourquoi |
|---|---|---|
| Paramètres → Détails de la boutique | Nom : **High Tech 94** | C'est le nom affiché en haut de la page de paiement |
| Paramètres → Paiement → Personnaliser | Logo : `public/brand/checkout-logo.png` · Fond blanc `#FFFFFF`, secondaire `#F4F4F4`, boutons `#0D0D0D`, accent `#FF5B1F` · Police : Inter | La caisse a le même style que le site |
| Boutique en ligne → Thèmes → … → Modifier le code → `layout/theme.liquid` | Collez le contenu de `shopify/redirection-theme.liquid` juste après `<head>`, enregistrez (l’adresse hightech94.vercel.app y est déjà ; à changer seulement avec un domaine définitif) | Le nom de la boutique en haut de la caisse et tous les anciens liens mènent au nouveau site, plus jamais à l'ancien |
| Paramètres → Politiques | Remplacez les modèles « EXEMPLE » (conditions d'utilisation, confidentialité) par vos textes *Conditions de vente* et *Confidentialité* | Ces liens apparaissent en bas de la page de paiement |
| Fiche Google (business.google.com) | Site Web : votre nouveau domaine | La fiche pointe encore vers l'adresse myshopify |

## 3. Au quotidien

- **Prix, stock, rupture** : modifiez-les dans Shopify, le site les affiche **immédiatement**.
- **Nouveau produit, nouvelles photos** : ils apparaissent sur le site **chaque nuit**, automatiquement.
  Pour tout de suite : GitHub → onglet *Actions* → *Synchroniser le catalogue Shopify* → *Run workflow*.
  La première photo du produit dans Shopify devient la photo principale.
- **Nouveau type de produit** (nouvelle catégorie) : demandez à votre webdesigner de l'ajouter au site.
- **Commandes, remboursements, codes promo** : dans Shopify, comme avant. Les codes promo se saisissent
  sur la page de paiement.
- **Promotion livraison** (7,99 € en France, option gratuite dès 60 €) : si vous la changez dans Shopify,
  changez aussi le bandeau du site (fichier `src/catalog.js`, lignes `SHIPPING` et `PROMO`).

## 4. Modifier une information du site

Adresse, téléphone, e-mail et mentions légales sont regroupés dans **`src/catalog.js`**
(blocs `BIZ` et `LEGAL`). Modifiez le texte entre guillemets, enregistrez, envoyez sur GitHub :
Vercel republie le site en une minute environ.

## 5. À compléter avant la mise en ligne (obligatoire en France)

Dans `src/catalog.js`, bloc `LEGAL` (affichés en orange « à compléter » sur la page Mentions légales) :
forme juridique, **SIRET**, RCS et capital (si société), n° de TVA (si assujetti),
**médiateur de la consommation**, hébergeur du site (avec Vercel : *Vercel Inc., 440 N Barranca Ave
#4133, Covina, CA 91723, USA*).

## 6. Voir le site sur votre ordinateur (facultatif)

Installez Node.js 22 (nodejs.org), puis dans le dossier du site : `npm install` puis `npm run dev`,
et ouvrez http://localhost:5950.
