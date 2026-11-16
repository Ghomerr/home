// Liste des projets affichés sur la page.
// Pour ajouter un projet : copier un bloc, déposer 1 à 3 images 16:10 (960x600 idéalement)
// dans assets/img/ (ou assets/img/gallery/), et compléter les champs.
//
// status : 'wip' (en dev) | 'almost' (presque fini) | 'done' (terminé) | 'abandoned' (abandonné)
// images : la 1re sert de couverture ; avec 2 ou 3 images, la tuile devient un carrousel
// url    : lien vers le projet lui-même (null si pas de lien), linkLabel : texte du bouton
// render : true si hébergé sur l'offre gratuite de Render (serveur qui s'endort)
// downloads : (optionnel) boutons de téléchargement par OS ('windows' | 'macos' | 'linux')
window.PROJECTS = [
  {
    id: 'malefic-realms',
    title: 'Malefic Realms',
    kind: 'Jeu coopératif multijoueur · Web',
    status: 'done',
    images: [
      { src: 'assets/img/gallery/malefic-realms.webp', alt: 'Poster du jeu : un dragon doré, des démons, un aboleth et un cultiste au-dessus de la carte des quatre continents' },
      { src: 'assets/img/gallery/malefic-realms-board.webp', alt: 'Une partie en cours : l\'équipe, le plateau des continents reliés par des chemins lumineux, les actions et la main du héros' },
      { src: 'assets/img/gallery/malefic-realms-heroes.webp', alt: 'Cartes de héros illustrées : paladine, divinatrice et érudit' },
    ],
    accent: '#9b5de5',
    description:
      'Toutes les règles de Pandemic dans un univers Donjons & Dragons : morts-vivants, démons, aboleths et ' +
      'fanatiques de Tiamat envahissent quatre continents. De 2 à 4 héros coopèrent pour contenir la menace ' +
      'et forger les quatre reliques qui les vaincront.',
    tags: ['Node.js', 'Express', 'Socket.IO', 'De 2 à 4 héros'],
    url: 'https://malefic-realms.onrender.com/',
    linkLabel: 'Jouer',
    render: true, // dépôt privé : pas de lien GitHub
  },
  {
    id: 'dungeon-escape',
    title: 'Dungeon Escape',
    kind: 'Jeu coopératif multijoueur · Web',
    status: 'done',
    images: [
      { src: 'assets/img/dungeon-escape.webp', alt: 'Un dragon rouge sur un tas d\'or dans un donjon' },
      { src: 'assets/img/gallery/dungeon-escape-board.webp', alt: 'Un gnome, un nain et un pyromancien sur une tuile du donjon, face à un dragon rouge' },
      { src: 'assets/img/gallery/dungeon-escape-event.webp', alt: 'Carte Événement « Malédiction » : des aventuriers devant un portail runique' },
    ],
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
    id: 'fallout-companion',
    title: 'Fallout – Compagnon de jeu',
    kind: 'Aide de jeu de société · Application mobile (PWA)',
    status: 'done',
    images: [
      { src: 'assets/img/gallery/fallout.webp', alt: 'Accueil de l\'application : logo Fallout sur une armure assistée, « Survivre aux terres désolées », accès rapide à la mise en place et au tour de jeu' },
      { src: 'assets/img/gallery/fallout-mobile.webp', alt: 'Trois écrans sur mobile : la mise en place pas à pas, le tour de jeu et ses 6 actions, l\'assistant de combat qui annonce « Ennemi tué ! »' },
      { src: 'assets/img/gallery/fallout-play.webp', alt: 'Écran « En jeu » sur ordinateur : manche, tour du joueur, ses deux actions et les six actions possibles' },
    ],
    accent: '#3fae60',
    description:
      'Tout pour jouer à Fallout, le jeu de plateau, sans ouvrir le livret : mise en place pas à pas, ' +
      'déroulé du tour, assistants de combat et de test qui font les comptes, niveaux, glossaire, ' +
      'et un mode coopératif. S\'installe sur le téléphone et fonctionne hors ligne.',
    tags: ['JavaScript', 'PWA', 'Hors ligne', 'Mobile'],
    url: 'https://ghomerr.github.io/fallout-boardgame-companion/',
    linkLabel: 'Ouvrir',
    repo: 'https://github.com/Ghomerr/fallout-boardgame-companion',
  },
  {
    id: 'happy-double',
    title: 'Happy Double – Feuille de score',
    kind: 'Feuille de score de jeu de société · Application mobile (PWA)',
    status: 'done',
    images: [
      { src: 'assets/img/gallery/happy-double.webp', alt: 'Feuille de score Happy Double remplie à la main : manches, doubles, filet de sécurité, ligne nulle et totaux' },
      { src: 'assets/img/gallery/happy-double-mobile.webp', alt: 'Deux écrans sur mobile : la saisie d\'une case au clavier, puis le classement des trois joueurs' },
      { src: 'assets/img/gallery/happy-double-print.webp', alt: 'Choix de la mise en page pour imprimer des feuilles vierges : 8 ou 4 feuilles par page A4' },
    ],
    accent: '#ee3d80',
    description:
      'La feuille de score officielle de Happy Double, à remplir sur téléphone : saisie au clavier, ' +
      'doubles, filet de sécurité et quitte ou double comptés automatiquement, plusieurs joueurs, ' +
      'classement, et impression de feuilles vierges. S\'installe et fonctionne hors ligne.',
    tags: ['JavaScript', 'SVG', 'PWA', 'Hors ligne'],
    url: 'https://ghomerr.github.io/happy-double-score/',
    linkLabel: 'Ouvrir',
    repo: 'https://github.com/Ghomerr/happy-double-score',
  },
  {
    id: 'music-reader',
    title: 'Lect\'O\'Note Matic 3000',
    kind: 'Application de bureau · Windows, macOS, Linux',
    status: 'wip',
    images: [
      { src: 'assets/img/music-reader.webp', alt: 'Extrait de partition : Chanson de Fortunio d\'Offenbach' },
      { src: 'assets/img/gallery/music-reader-player.webp', alt: 'Partition reconstruite d\'Over the Rainbow en cours de lecture, mesure surlignée, réglages des lignes et du tempo' },
      { src: 'assets/img/gallery/music-reader-analyse.webp', alt: 'Bilan de l\'analyse : choix de la police de notes et résumé de la partition assemblée' },
    ],
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
      version: 'v1.3.0',
      release: 'https://github.com/Ghomerr/music-reader/releases/tag/v1.3.0',
      files: [
        { os: 'windows', label: 'Windows', note: 'Installateur', size: '185 Mo',
          url: 'https://github.com/Ghomerr/music-reader/releases/download/v1.3.0/LectONote-1.3.0-windows-installation.exe' },
        { os: 'macos', label: 'macOS', note: 'Apple Silicon', size: '216 Mo',
          url: 'https://github.com/Ghomerr/music-reader/releases/download/v1.3.0/LectONote-1.3.0-mac-arm64.dmg' },
        { os: 'linux', label: 'Linux', note: 'AppImage', size: '228 Mo',
          url: 'https://github.com/Ghomerr/music-reader/releases/download/v1.3.0/LectONote-1.3.0-linux-x86_64.AppImage' },
      ],
      // Liens secondaires, sous les boutons
      extra: [
        { os: 'macos', label: 'Mac Intel', url: 'https://github.com/Ghomerr/music-reader/releases/download/v1.3.0/LectONote-1.3.0-mac-x64.dmg' },
        { os: 'windows', label: 'Windows portable', url: 'https://github.com/Ghomerr/music-reader/releases/download/v1.3.0/LectONote-1.3.0-windows-portable.zip' },
      ],
    },
  },
  {
    id: 'skull-king',
    title: 'Skull King',
    kind: 'Jeu de cartes multijoueur · Web',
    status: 'done',
    images: [
      { src: 'assets/img/skull-king.webp', alt: 'Logo doré de Skull King sur une boîte en bois' },
      { src: 'assets/img/gallery/skull-king-table.webp', alt: 'Une manche en cours : trois cartes pirates jouées sur la table, la main du joueur en dessous' },
      { src: 'assets/img/gallery/skull-king-cards.webp', alt: 'Cartes spéciales en éventail : pirates, sirène, Skull King et Tigresse' },
    ],
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
    images: [
      { src: 'assets/img/roidesnains.webp', alt: 'Le roi des nains sur son trône, entouré d\'un chevalier et d\'un gobelin' },
      { src: 'assets/img/gallery/roidesnains-trick.webp', alt: 'Un pli en cours : deux cartes gobelins sur la table, la main du joueur en dessous' },
      { src: 'assets/img/gallery/roidesnains-quest.webp', alt: 'Choix de la quête de la donne, carte spéciale Sorcier et main de cartes illustrées' },
    ],
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
    images: [{ src: 'assets/img/magic-hatventure.webp', alt: 'Un petit mage en pixel art dans une forêt' }],
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
    images: [{ src: 'assets/img/brick-tag.webp', alt: 'Arène en pixel art remplie de briques de quatre couleurs, un personnage dans chaque coin' }],
    accent: '#22b8cf',
    description:
      'Quatre héros, une arène remplie de briques colorées. Chacun part de son coin et casse les briques ' +
      'à coups de poing pour se frayer un chemin. Un prototype resté au stade de l\'expérimentation.',
    tags: ['GameMaker Studio 2', 'GML', 'Prototype'],
    url: null,
    repo: 'https://github.com/Ghomerr/brick_tag_game',
  },
];
