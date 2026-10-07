// Liste des projets affichés sur la page.
// Pour ajouter un projet : copier un bloc, déposer une image 16:10 (960x600 idéalement)
// dans assets/img/, et compléter les champs.
//
// status : 'wip' (en dev) | 'almost' (presque fini) | 'done' (terminé) | 'abandoned' (abandonné)
// url    : lien vers le projet lui-même (null si pas de lien), linkLabel : texte du bouton
// render : true si hébergé sur l'offre gratuite de Render (serveur qui s'endort)
// downloads : (optionnel) boutons de téléchargement par OS ('windows' | 'macos' | 'linux')
window.PROJECTS = [
  {
    id: 'dungeon-escape',
    title: 'Dungeon Escape',
    kind: 'Jeu coopératif multijoueur · Web',
    status: 'done',
    featured: true,
    image: 'assets/img/dungeon-escape.webp',
    imageAlt: 'Un dragon rouge sur un tas d\'or dans un donjon',
    accent: '#e0603a',
    description:
      'Jeu de survie coopératif jusqu\'à 6 joueurs, inspiré de Sub Terra à la sauce Donjons & Dragons. ' +
      'Explorez le donjon tuile par tuile, survivez aux pièges de plus en plus mortels, évitez les dragons… ' +
      'et trouvez la sortie avant que la malédiction ne vous engloutisse.',
    tags: ['Node.js', 'Express', 'Socket.IO', 'Jusqu\'à 6 joueurs'],
    url: 'https://dungeon-escape.onrender.com/',
    linkLabel: 'Jouer',
    render: true,
    repo: 'https://github.com/Ghomerr/dungeon-escape',
  },
  {
    id: 'music-reader',
    title: 'Lect\'O\'Note Matic 3000',
    kind: 'Application de bureau · Windows, macOS, Linux',
    status: 'wip',
    image: 'assets/img/music-reader.webp',
    imageAlt: 'Extrait de partition : Chanson de Fortunio d\'Offenbach',
    accent: '#6366f1',
    description:
      'Lecture de partitions à partir d\'images : reconnaissance des notes, relecture et correction, ' +
      'écoute avec réglage du tempo et transposition, export audio, puis réimpression d\'une partition propre.',
    tags: ['React', 'TypeScript', 'Vite', 'Audiveris', 'Web Audio'],
    url: null, // à venir : https://music-reader-6z2c.onrender.com/
    linkLabel: 'Ouvrir',
    render: true,
    repo: 'https://github.com/Ghomerr/music-reader',
    downloads: {
      version: 'v1.0.0',
      release: 'https://github.com/Ghomerr/music-reader/releases/tag/v1.0.0',
      files: [
        { os: 'windows', label: 'Windows', note: 'Installateur', size: '184 Mo',
          url: 'https://github.com/Ghomerr/music-reader/releases/download/v1.0.0/LectONote-1.0.0-windows-installation.exe' },
        { os: 'macos', label: 'macOS', note: 'Apple Silicon', size: '216 Mo',
          url: 'https://github.com/Ghomerr/music-reader/releases/download/v1.0.0/LectONote-1.0.0-mac-arm64.dmg' },
        { os: 'linux', label: 'Linux', note: 'AppImage', size: '227 Mo',
          url: 'https://github.com/Ghomerr/music-reader/releases/download/v1.0.0/LectONote-1.0.0-linux-x86_64.AppImage' },
      ],
      // Liens secondaires, sous les boutons
      extra: [
        { os: 'macos', label: 'Mac Intel', url: 'https://github.com/Ghomerr/music-reader/releases/download/v1.0.0/LectONote-1.0.0-mac-x64.dmg' },
        { os: 'windows', label: 'Windows portable', url: 'https://github.com/Ghomerr/music-reader/releases/download/v1.0.0/LectONote-1.0.0-windows-portable.zip' },
      ],
    },
  },
  {
    id: 'skull-king',
    title: 'Skull King',
    kind: 'Jeu de cartes multijoueur · Web',
    status: 'done',
    image: 'assets/img/skull-king.webp',
    imageAlt: 'Logo doré de Skull King sur une boîte en bois',
    accent: '#d9a43a',
    description:
      'Le jeu de plis des pirates, version en ligne : annoncez combien de plis vous allez remporter, ' +
      'jouez vos cartes, piégez vos adversaires avec sirènes et Skull King, et finissez la partie avec le plus gros butin.',
    tags: ['Node.js', 'Express', 'Socket.IO'],
    url: 'https://skull-king-d1kx.onrender.com/',
    linkLabel: 'Jouer',
    render: true,
    repo: 'https://github.com/Ghomerr/skull-king',
  },
  {
    id: 'roidesnains',
    title: 'Le Roi des Nains',
    kind: 'Jeu de cartes multijoueur · Web',
    status: 'done',
    image: 'assets/img/roidesnains.webp',
    imageAlt: 'Le roi des nains sur son trône, entouré d\'un chevalier et d\'un gobelin',
    accent: '#c2412d',
    description:
      'Adaptation web du jeu de cartes de Bruno Faidutti : nains, chevaliers et gobelins s\'affrontent ' +
      'sur des manches aux règles toujours différentes. Mon premier jeu de société en ligne, qui a servi de base à Skull King.',
    tags: ['Node.js', 'Express', 'Socket.IO'],
    url: 'https://roi-des-nains.onrender.com',
    linkLabel: 'Jouer',
    render: true,
    repo: 'https://github.com/Ghomerr/roidesnains',
  },
  {
    id: 'magic-hatventure',
    title: 'Magic Hat\'venture',
    kind: 'Jeu de plateforme 2D · PC',
    status: 'abandoned',
    image: 'assets/img/magic-hatventure.webp',
    imageAlt: 'Un petit mage en pixel art dans une forêt',
    accent: '#3fa34d',
    description:
      'Plateformer en pixel art : un petit mage change de chapeau pour lancer ses sorts (feu, glace, électricité, ' +
      'gravité, nature…) et se frayer un chemin dans la forêt. Né de la série de tutos de Shaun Spalding.',
    tags: ['GameMaker Studio 2', 'GML', 'Pixel art'],
    url: 'https://ghomerr.itch.io/magic-hatventure',
    linkLabel: 'Jouer sur itch.io',
    repo: 'https://github.com/Ghomerr/little_mage',
  },
  {
    id: 'brick-tag',
    title: 'Brick Tag Game',
    kind: 'Prototype de jeu multijoueur local',
    status: 'abandoned',
    image: 'assets/img/brick-tag.webp',
    imageAlt: 'Arène en pixel art remplie de briques de quatre couleurs, un personnage dans chaque coin',
    accent: '#22b8cf',
    description:
      'Quatre héros, une arène remplie de briques colorées. Chacun part de son coin et casse les briques ' +
      'à coups de poing pour se frayer un chemin. Un prototype resté au stade de l\'expérimentation.',
    tags: ['GameMaker Studio 2', 'GML', 'Prototype'],
    url: null,
    repo: 'https://github.com/Ghomerr/brick_tag_game',
  },
];
