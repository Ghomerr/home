# home

Page d'accueil statique qui présente mes projets de dev, en cours ou non.
En ligne sur GitHub Pages : https://ghomerr.github.io/home/

## Structure

- `index.html` : la page
- `assets/js/projects.js` : **la liste des projets** (titre, statut, description, images, liens)
- `assets/js/main.js` : rendu des tuiles, carrousels d'images, filtres par statut, thème clair/sombre, suivi des clics
- `assets/css/style.css` : styles
- `assets/img/` : illustrations (WebP 960x600, ratio 16:10) et avatar ; `assets/img/gallery/` : images des carrousels
- `tools/build_images.py` : script qui a généré les illustrations à partir des repos voisins et de captures d'écran des jeux (Pillow)
- `tools/posthog-dashboards.js` : définition des dashboards PostHog (visites, clics, parties par jeu, Lect'O'Note) et script qui les crée
- `.github/workflows/static.yml` : déploiement sur GitHub Pages à chaque push sur `main`

## Ajouter ou modifier un projet

1. Déposer 1 à 3 images 16:10 dans `assets/img/` (960x600 conseillé, WebP ou JPG).
2. Ajouter / modifier l'entrée correspondante dans `assets/js/projects.js` : la 1re image de `images` sert de
   couverture ; à partir de 2 images, la tuile devient un carrousel (défilement automatique, en pause au survol
   et hors de l'écran, coupé si le système demande de limiter les animations).
   Statuts possibles : `wip` (en dev), `almost` (presque fini), `done` (terminé), `abandoned` (abandonné).

## Voir la page en local

N'importe quel serveur statique fait l'affaire, par exemple :

```sh
npx serve .
# ou
python -m http.server 8000
```

## Déploiement

Le workflow publie le contenu du repo sur GitHub Pages à chaque push sur `main`.
Prérequis (une seule fois) : dans *Settings > Pages* du repo, choisir **Source : GitHub Actions**.
