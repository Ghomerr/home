# home

Page d'accueil statique qui présente mes projets de dev, en cours ou non.
En ligne sur GitHub Pages : https://ghomerr.github.io/home/

## Structure

- `index.html` : la page
- `assets/js/projects.js` : **la liste des projets** (titre, statut, description, image, liens)
- `assets/js/main.js` : rendu des tuiles, filtres par statut, thème clair/sombre
- `assets/css/style.css` : styles
- `assets/img/` : illustrations (WebP 960x600, ratio 16:10) et avatar
- `tools/build_images.py` : script qui a généré les illustrations à partir des repos voisins (Pillow)
- `.github/workflows/static.yml` : déploiement sur GitHub Pages à chaque push sur `main`

## Ajouter ou modifier un projet

1. Déposer une image 16:10 dans `assets/img/` (960x600 conseillé, WebP ou JPG).
2. Ajouter / modifier l'entrée correspondante dans `assets/js/projects.js`.
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
