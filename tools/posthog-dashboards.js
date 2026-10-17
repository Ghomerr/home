// Dashboards PostHog des projets : une vue d'ensemble (accès aux sites, visites, clics, résumé des parties)
// et un dashboard détaillé par projet.
//
// Usage : node tools/posthog-dashboards.js <fichier contenant la clé d'API personnelle> [--apply]
// Sans --apply, vérifie seulement que la clé a les droits nécessaires et liste ce qui serait créé.
// La clé (PostHog > Settings > Personal API keys) doit avoir Dashboard : Write et Insight : Write.
// Un dashboard qui existe déjà (même nom) n'est pas recréé. L'ancien « Ghomerr · Projets & Dungeon Escape »,
// dont les tuiles Dungeon Escape ne filtrent pas sur le jeu, est renommé « (ancien) … » et désépinglé.
'use strict';
const fs = require('fs');

const BASE = 'https://eu.posthog.com/api/projects/@current';
const OLD_DASHBOARD = 1005458;

// ---------- Briques ----------
const app = (name) => ({ key: 'app', type: 'event', value: name, operator: 'exact' });
const prop = (key, value) => ({ key, type: 'event', value, operator: 'exact' });
const ev = (event, custom_name, properties) => Object.assign({ kind: 'EventsNode', event, name: event, custom_name }, properties ? { properties } : {});
const trends = (series, opts) => ({ kind: 'InsightVizNode', source: Object.assign({ kind: 'TrendsQuery', series, version: 4 }, opts) });
const funnel = (series) => ({ kind: 'InsightVizNode', source: { kind: 'FunnelsQuery', version: 2, series, dateRange: { date_from: '-90d' },
  funnelsFilter: { funnelVizType: 'steps', funnelWindowInterval: 1, funnelWindowIntervalUnit: 'day' } } });
const table = (query) => ({ kind: 'DataVisualizationNode', source: { kind: 'HogQLQuery', query }, display: 'ActionsTable' });
const L = (x, y, w, h) => ({ sm: { x, y, w, h, minW: 3, minH: 2 } });
const insight = (name, description, query, layouts) => ({ name, description: description || '', query, layouts });

// Tuiles communes aux jeux en ligne
const visitors = (id, layouts) => insight('Visiteurs de la page du jeu', 'Visiteurs uniques par jour (sans cookie).',
  trends([Object.assign(ev('$pageview', 'Visiteurs', [app(id)]), { math: 'dau' })],
    { interval: 'day', dateRange: { date_from: '-30d' }, trendsFilter: { display: 'ActionsLineGraph' } }), layouts);
const weekly = (id, title, layouts, abandonNote) => insight('Parties par semaine', 'Lancées, menées au bout et abandonnées' + (abandonNote || '') + '.',
  trends([ev('partie_lancee', 'Lancées', [app(id)]), ev('partie_terminee', 'Terminées', [app(id)]), ev('partie_abandonnee', 'Abandonnées', [app(id)])],
    { interval: 'week', dateRange: { date_from: '-90d' }, trendsFilter: { display: 'ActionsBar' } }), layouts);
const completion = (id, layouts) => insight('Parties menées au bout', 'Part des parties lancées qui arrivent à leur fin.',
  funnel([ev('partie_lancee', 'Partie lancée', [app(id)]), ev('partie_terminee', 'Partie terminée', [app(id)])]), layouts);

// ---------- Dungeon Escape (tuiles d'origine, filtrées sur le jeu) ----------
const DE = `properties.app = 'dungeon-escape'`;
const dungeon = {
  key: 'dungeon', name: 'Dungeon Escape', site: 'https://dungeon-escape.onrender.com/',
  description: 'Visites et parties de Dungeon Escape (événements serveur partie_lancee / partie_terminee / partie_abandonnee).',
  tiles: [
    visitors('dungeon-escape', L(0, 0, 6, 5)),
    weekly('dungeon-escape', null, L(6, 0, 6, 5)),
    completion('dungeon-escape', L(0, 5, 4, 5)),
    insight('Victoires et défaites par difficulté', null, table(`select properties.difficulte as difficulte,
       count() as parties,
       countIf(properties.resultat = 'victoire') as victoires,
       countIf(properties.resultat = 'defaite') as defaites,
       round(100 * victoires / parties) as taux_victoire_pct,
       round(avg(toFloat(properties.duree_min)), 1) as duree_moy_min
from events
where event = 'partie_terminee' and ${DE}
group by difficulte
order by multiIf(difficulte = 'Facile', 1, difficulte = 'Normal', 2, difficulte = 'Avancé', 3, difficulte = 'Expert', 4, 5)`), L(4, 5, 5, 5)),
    insight('Rangs obtenus en cas de victoire', null,
      trends([ev('partie_terminee', 'Victoires', [app('dungeon-escape'), prop('resultat', 'victoire')])],
        { dateRange: { date_from: 'all' }, trendsFilter: { display: 'ActionsPie' }, breakdownFilter: { breakdown: 'rang', breakdown_type: 'event' } }), L(9, 5, 3, 5)),
    insight('Selon le nombre de joueurs', null, table(`select toInt(properties.joueurs) as joueurs,
       count() as parties,
       round(avg(toFloat(properties.aventuriers)), 1) as aventuriers_moy,
       round(100 * countIf(properties.resultat = 'victoire') / parties) as taux_victoire_pct,
       round(avg(toFloat(properties.tours)), 1) as tours_moy,
       round(avg(toFloat(properties.duree_min)), 1) as duree_moy_min
from events
where event = 'partie_terminee' and ${DE}
group by joueurs
order by joueurs`), L(0, 10, 6, 4)),
    insight('Aventuriers les plus joués', null, table(`select perso as aventurier,
       count() as parties,
       round(100 * countIf(resultat = 'victoire') / parties) as taux_victoire_pct
from (
    select arrayJoin(JSONExtract(ifNull(properties.personnages, '[]'), 'Array(String)')) as perso,
           properties.resultat as resultat
    from events
    where event = 'partie_terminee' and ${DE}
)
group by perso
order by parties desc`), L(6, 10, 6, 4)),
    insight('Dernières parties terminées', null, table(`select timestamp as date,
       properties.resultat as resultat,
       properties.rang as rang,
       properties.difficulte as difficulte,
       properties.joueurs as joueurs,
       properties.aventuriers as aventuriers,
       properties.potions_parchemins as potions,
       properties.danger_plus_3 as danger_plus_3,
       properties.sortis as sortis,
       properties.survivants as survivants,
       properties.tours as tours,
       properties.duree_min as duree_min
from events
where event = 'partie_terminee' and ${DE}
order by timestamp desc
limit 50`), L(0, 14, 12, 5)),
  ],
};

// ---------- Malefic Realms (mêmes indicateurs, adaptés au jeu) ----------
const MR = `properties.app = 'malefic-realms'`;
const DIFF_ORDER = `multiIf(difficulte = 'Initiation', 1, difficulte = 'Standard', 2, difficulte = 'Héroïque', 3, 4)`;
const malefic = {
  key: 'malefic', name: 'Malefic Realms', site: 'https://malefic-realms.onrender.com/',
  description: 'Visites et parties de Malefic Realms (événements serveur partie_lancee / partie_terminee / partie_abandonnee).',
  tiles: [
    visitors('malefic-realms', L(0, 0, 6, 5)),
    weekly('malefic-realms', null, L(6, 0, 6, 5), ' (hôte qui arrête, ou joueurs jamais revenus)'),
    completion('malefic-realms', L(0, 5, 4, 5)),
    insight('Victoires et défaites par difficulté', 'Reliques forgées, Déferlements et tours : moyennes par partie.', table(`select properties.difficulte as difficulte,
       count() as parties,
       countIf(properties.resultat = 'victoire') as victoires,
       countIf(properties.resultat = 'defaite') as defaites,
       round(100 * victoires / parties) as taux_victoire_pct,
       round(avg(toFloat(properties.reliques)), 1) as reliques_moy,
       round(avg(toFloat(properties.deferlements)), 1) as deferlements_moy,
       round(avg(toFloat(properties.tours)), 1) as tours_moy,
       round(avg(toFloat(properties.duree_min)), 1) as duree_moy_min
from events
where event = 'partie_terminee' and ${MR}
group by difficulte
order by ${DIFF_ORDER}`), L(4, 5, 5, 5)),
    insight('Causes de défaite', '8e Déferlement, réserve d\'une faction épuisée, ou pioche des Héros épuisée.',
      trends([ev('partie_terminee', 'Défaites', [app('malefic-realms'), prop('resultat', 'defaite')])],
        { dateRange: { date_from: 'all' }, trendsFilter: { display: 'ActionsPie' }, breakdownFilter: { breakdown: 'cause_defaite', breakdown_type: 'event' } }), L(9, 5, 3, 5)),
    insight('Selon le nombre de héros', 'Joueurs : humains autour de la table (un joueur peut incarner plusieurs héros).', table(`select toInt(properties.heros) as heros,
       count() as parties,
       round(avg(toFloat(properties.joueurs)), 1) as joueurs_moy,
       round(100 * countIf(properties.resultat = 'victoire') / parties) as taux_victoire_pct,
       round(avg(toFloat(properties.tours)), 1) as tours_moy,
       round(avg(toFloat(properties.duree_min)), 1) as duree_moy_min
from events
where event = 'partie_terminee' and ${MR}
group by heros
order by heros`), L(0, 10, 6, 4)),
    insight('Héros les plus joués', null, table(`select multiIf(h = 'paladin', 'Paladin', h = 'diviner', 'Divinateur', h = 'scholar', 'Érudit', h = 'sorcerer', 'Ensorceleur',
               h = 'cleric', 'Clerc', h = 'druid', 'Druide', h = 'bard', 'Barde', h = 'ranger', 'Rôdeur', h) as heros,
       count() as parties,
       round(100 * countIf(resultat = 'victoire') / parties) as taux_victoire_pct
from (
    select arrayJoin(JSONExtract(ifNull(properties.personnages, '[]'), 'Array(String)')) as h,
           properties.resultat as resultat
    from events
    where event = 'partie_terminee' and ${MR}
)
group by heros
order by parties desc`), L(6, 10, 6, 4)),
    insight('Parties abandonnées', 'À quel moment les parties s\'arrêtent avant la fin.', table(`select properties.raison as raison,
       count() as parties,
       round(avg(toFloat(properties.tours)), 1) as tours_moy,
       round(avg(toFloat(properties.reliques)), 1) as reliques_moy,
       round(avg(toFloat(properties.duree_min)), 1) as duree_moy_min
from events
where event = 'partie_abandonnee' and ${MR}
group by raison
order by parties desc`), L(0, 14, 6, 3)),
    insight('Options choisies', 'Héros tirés au hasard plutôt que choisis, mains ouvertes (cartes visibles).', table(`select properties.difficulte as difficulte,
       count() as parties_lancees,
       round(100 * countIf(properties.heros_au_hasard = 'true') / count()) as pct_heros_au_hasard,
       round(100 * countIf(properties.mains_ouvertes = 'true') / count()) as pct_mains_ouvertes
from events
where event = 'partie_lancee' and ${MR}
group by difficulte
order by ${DIFF_ORDER}`), L(6, 14, 6, 3)),
    insight('Dernières parties terminées', null, table(`select timestamp as date,
       properties.resultat as resultat,
       properties.cause_defaite as cause_defaite,
       properties.difficulte as difficulte,
       properties.joueurs as joueurs,
       properties.heros as heros,
       properties.reliques as reliques,
       properties.deferlements as deferlements,
       properties.explosions as explosions,
       properties.sanctuaires as sanctuaires,
       properties.tours as tours,
       properties.duree_min as duree_min
from events
where event = 'partie_terminee' and ${MR}
order by timestamp desc
limit 50`), L(0, 17, 12, 5)),
  ],
};

// ---------- Skull King ----------
const SK = `properties.app = 'skull-king'`;
const skull = {
  key: 'skull', name: 'Skull King', site: 'https://skull-king-d1kx.onrender.com/',
  description: 'Visites et parties de Skull King : joueurs humains et robots, durée, abandons.',
  tiles: [
    visitors('skull-king', L(0, 0, 6, 5)),
    weekly('skull-king', null, L(6, 0, 6, 5), ' (joueurs jamais revenus)'),
    completion('skull-king', L(0, 5, 4, 5)),
    insight('Selon les joueurs et les robots', 'Humains et robots autour de la table ; « robot gagnant » : la partie a été remportée par un robot.', table(`select toInt(properties.joueurs) as humains,
       toInt(properties.robots) as robots,
       count() as parties,
       round(avg(toFloat(properties.duree_min)), 1) as duree_moy_min,
       round(avg(toFloat(properties.score_gagnant))) as score_gagnant_moy,
       round(100 * countIf(properties.gagnant_robot = 'true') / parties) as pct_robot_gagnant
from events
where event = 'partie_terminee' and ${SK}
group by humains, robots
order by humains, robots`), L(4, 5, 8, 5)),
    insight('Parties abandonnées : à quelle manche', null, table(`select toInt(properties.manche) as manche,
       count() as parties,
       round(avg(toFloat(properties.duree_min)), 1) as duree_moy_min
from events
where event = 'partie_abandonnee' and ${SK}
group by manche
order by manche`), L(0, 10, 4, 5)),
    insight('Dernières parties terminées', null, table(`select timestamp as date,
       properties.joueurs as humains,
       properties.robots as robots,
       properties.robots_intelligents as robots_intelligents,
       properties.score_gagnant as score_gagnant,
       properties.gagnant_robot as gagnant_robot,
       properties.duree_min as duree_min
from events
where event = 'partie_terminee' and ${SK}
order by timestamp desc
limit 50`), L(4, 10, 8, 5)),
  ],
};

// ---------- Le Roi des Nains ----------
const RDN = `properties.app = 'roidesnains'`;
const nains = {
  key: 'nains', name: 'Le Roi des Nains', site: 'https://roi-des-nains.onrender.com',
  description: 'Visites et parties du Roi des Nains (7 donnes par partie).',
  tiles: [
    visitors('roidesnains', L(0, 0, 6, 5)),
    weekly('roidesnains', null, L(6, 0, 6, 5), ' (un joueur qui part arrête la partie)'),
    completion('roidesnains', L(0, 5, 4, 5)),
    insight('Selon le nombre de joueurs', null, table(`select toInt(properties.joueurs) as joueurs,
       countIf(event = 'partie_lancee') as lancees,
       countIf(event = 'partie_terminee') as terminees,
       round(avgIf(toFloat(properties.duree_min), event = 'partie_terminee'), 1) as duree_moy_min,
       round(avgIf(toFloat(properties.score_gagnant), event = 'partie_terminee')) as score_gagnant_moy
from events
where event in ('partie_lancee', 'partie_terminee') and ${RDN}
group by joueurs
order by joueurs`), L(4, 5, 8, 5)),
    insight('Parties abandonnées : à quelle donne', null, table(`select toInt(properties.donne) as donne,
       count() as parties,
       round(avg(toFloat(properties.duree_min)), 1) as duree_moy_min
from events
where event = 'partie_abandonnee' and ${RDN}
group by donne
order by donne`), L(0, 10, 4, 5)),
    insight('Dernières parties terminées', null, table(`select timestamp as date,
       properties.joueurs as joueurs,
       properties.score_gagnant as score_gagnant,
       properties.duree_min as duree_min
from events
where event = 'partie_terminee' and ${RDN}
order by timestamp desc
limit 50`), L(4, 10, 8, 5)),
  ],
};

// ---------- Lect'O'Note Matic 3000 ----------
const LO = `properties.app = 'lectonote'`;
const lectonote = {
  key: 'lectonote', name: 'Lect\'O\'Note Matic 3000', site: 'https://github.com/Ghomerr/music-reader/releases',
  description: 'Utilisation de l\'application de bureau (envoyé à partir de la version qui suit la 1.0.0) et téléchargements depuis la page d\'accueil.',
  tiles: [
    insight('Utilisation par semaine', 'Lancements, partitions analysées (un clic sur « Analyser »), projets chargés et exportés.',
      trends([
        ev('app_lancee', 'Lancements', [app('lectonote')]),
        ev('partition_analysee', 'Partitions analysées', [app('lectonote')]),
        ev('projet_charge', 'Projets chargés', [app('lectonote')]),
        ev('projet_exporte', 'Exports', [app('lectonote')]),
      ], { interval: 'week', dateRange: { date_from: '-90d' }, trendsFilter: { display: 'ActionsBar' } }), L(0, 0, 8, 5)),
    insight('Téléchargements', 'Clics sur les boutons de téléchargement de la page d\'accueil, par système.',
      trends([ev('telechargement', 'Téléchargements', [prop('projet', 'music-reader')])],
        { dateRange: { date_from: '-90d' }, trendsFilter: { display: 'ActionsBarValue' }, breakdownFilter: { breakdown: 'os', breakdown_type: 'event' } }), L(8, 0, 4, 5)),
    insight('Bilan des analyses', 'Par mois : pages analysées et en échec, durée moyenne d\'une analyse, choix automatique de la police.', table(`select toStartOfMonth(timestamp) as mois,
       count() as analyses,
       sum(toInt(properties.pages)) as pages,
       sum(toInt(properties.pages_echec)) as pages_en_echec,
       round(avg(toFloat(properties.duree_s))) as duree_moy_s,
       round(avg(toFloat(properties.mesures))) as mesures_moy,
       round(100 * countIf(properties.police_auto = 'true') / count()) as pct_police_auto
from events
where event = 'partition_analysee' and ${LO}
group by mois
order by mois desc`), L(0, 5, 8, 4)),
    insight('Exports par format', 'json = projet, wav = audio, musicxml = partition, impression = impression ou PDF.',
      trends([ev('projet_exporte', 'Exports', [app('lectonote')])],
        { dateRange: { date_from: '-90d' }, trendsFilter: { display: 'ActionsPie' }, breakdownFilter: { breakdown: 'format', breakdown_type: 'event' } }), L(8, 5, 4, 4)),
    insight('Versions et systèmes', 'Lancements par version, système et fuseau horaire.', table(`select properties.version as version,
       properties.os as systeme,
       properties.fuseau as fuseau,
       count() as lancements,
       max(timestamp) as dernier
from events
where event = 'app_lancee' and ${LO}
group by version, systeme, fuseau
order by lancements desc
limit 50`), L(0, 9, 12, 4)),
  ],
};

const PROJECTS = [dungeon, malefic, skull, nains, lectonote];

// ---------- Vue d'ensemble ----------
function overview(links) {
  const row = (label, site, key) => '| ' + label + ' | ' + (site ? '[' + site.replace(/^https:\/\//, '').replace(/\/$/, '') + '](' + site + ')' : 'pas encore en ligne') +
    ' | ' + (links[key] ? '[statistiques](' + links[key] + ')' : '—') + ' |';
  const access = ['## Accès aux projets', '', '| Projet | Site | Dashboard |', '|---|---|---|',
    row('Portfolio', 'https://ghomerr.github.io/home/', null),
    ...PROJECTS.map(p => row(p.name, p.site, p.key))].join('\n');
  return {
    name: 'Ghomerr · Vue d\'ensemble',
    description: 'Accès aux sites et aux dashboards de chaque projet, visites, clics sur la page d\'accueil, résumé des parties.',
    text: { body: access, layouts: L(0, 0, 5, 6) },
    tiles: [
      insight('Visiteurs uniques par jour', 'Portfolio (home) et pages d\'accueil des jeux (dungeon-escape, malefic-realms, skull-king, roidesnains).',
        trends([Object.assign(ev('$pageview', 'Visiteurs'), { math: 'dau' })],
          { interval: 'day', dateRange: { date_from: '-30d' }, trendsFilter: { display: 'ActionsLineGraph' }, breakdownFilter: { breakdown: 'app', breakdown_type: 'event' } }),
        L(5, 0, 7, 6)),
      insight('Parties par jeu (90 derniers jours)', 'Parties lancées, menées au bout et abandonnées pour chaque jeu en ligne.', table(`select properties.app as jeu,
       countIf(event = 'partie_lancee') as lancees,
       countIf(event = 'partie_terminee') as terminees,
       countIf(event = 'partie_abandonnee') as abandonnees,
       round(100 * terminees / nullIf(lancees, 0)) as pct_menees_au_bout,
       round(avgIf(toFloat(properties.duree_min), event = 'partie_terminee'), 1) as duree_moy_min,
       max(timestamp) as derniere
from events
where event in ('partie_lancee', 'partie_terminee', 'partie_abandonnee') and timestamp > now() - interval 90 day
group by jeu
order by lancees desc`), L(0, 6, 7, 5)),
      insight('Lect\'O\'Note : lancements par semaine', null,
        trends([ev('app_lancee', 'Lancements', [app('lectonote')])], { interval: 'week', dateRange: { date_from: '-90d' }, trendsFilter: { display: 'ActionsBar' } }),
        L(7, 6, 5, 5)),
      insight('Clics sur la page d\'accueil, par projet', 'jouer : bouton principal · github : code source · carrousel : a fait défiler les images (1 fois par visite) · tuile : clic sur une tuile sans lien (projet pas encore en ligne).', table(`select properties.projet as projet,
       countIf(properties.type = 'jouer') as jouer,
       countIf(properties.type = 'carrousel') as carrousel,
       countIf(properties.type = 'tuile') as tuile,
       countIf(properties.type = 'github') as github,
       count() as total
from events
where event = 'clic_projet' and timestamp > now() - interval 90 day
group by projet
order by total desc`), L(0, 11, 7, 5)),
      insight('D\'où viennent les visiteurs (fuseau horaire)', 'Le mode sans cookie ne géolocalise pas l\'IP : le fuseau du navigateur donne le pays / la région.',
        trends([Object.assign(ev('$pageview', 'Visiteurs'), { math: 'dau' })],
          { dateRange: { date_from: '-90d' }, trendsFilter: { display: 'ActionsBarValue' }, breakdownFilter: { breakdown: '$timezone', breakdown_type: 'event', breakdown_limit: 15 } }),
        L(7, 11, 5, 5)),
    ],
  };
}

// ---------- Création ----------
async function main() {
  const [keyFile, flag] = process.argv.slice(2);
  if (!keyFile) { console.error('Usage : node tools/posthog-dashboards.js <fichier de clé> [--apply]'); process.exit(1); }
  const key = fs.readFileSync(keyFile, 'utf8').trim();
  const api = async (method, path, body) => {
    const res = await fetch(BASE + path, {
      method, headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    if (!res.ok) throw new Error(method + ' ' + path + ' : ' + res.status + ' ' + text.slice(0, 300));
    return text ? JSON.parse(text) : null;
  };

  // Vérifie les droits avant de créer quoi que ce soit (Insight : Write donne aussi la lecture)
  await api('GET', '/insights/?limit=1');
  const existing = (await api('GET', '/dashboards/?limit=200')).results.filter(d => !d.deleted);
  const plan = [...PROJECTS, overview({})];
  for (const d of plan) {
    console.log((existing.some(e => e.name === d.name) ? '(existe déjà) ' : '') + d.name + ' : ' + d.tiles.length + ' graphiques' + (d.text ? ' + accès' : ''));
  }
  if (flag !== '--apply') { console.log('Clé OK. Relancer avec --apply pour créer les dashboards.'); return; }

  const create = async (d) => {
    const found = existing.find(e => e.name === d.name);
    if (found) return found;
    const dash = await api('POST', '/dashboards/', { name: d.name, description: d.description, pinned: true });
    for (const t of d.tiles) {
      t.id = (await api('POST', '/insights/', { name: t.name, description: t.description, query: t.query, dashboards: [dash.id] })).id;
    }
    const created = await api('GET', '/dashboards/' + dash.id + '/');
    const tiles = created.tiles.map(tile => {
      const def = d.tiles.find(t => tile.insight && t.id === tile.insight.id);
      return def ? { id: tile.id, layouts: def.layouts } : null;
    }).filter(Boolean);
    if (d.text) tiles.push({ text: { body: d.text.body }, layouts: d.text.layouts });
    await api('PATCH', '/dashboards/' + dash.id + '/', { tiles });
    console.log('créé : ' + d.name);
    return created;
  };

  const links = {};
  for (const p of PROJECTS) {
    const dash = await create(p);
    links[p.key] = 'https://eu.posthog.com/project/' + dash.team_id + '/dashboard/' + dash.id;
  }
  const home = await create(overview(links));
  console.log('vue d\'ensemble : https://eu.posthog.com/project/' + home.team_id + '/dashboard/' + home.id);

  const old = await api('GET', '/dashboards/' + OLD_DASHBOARD + '/').catch(() => null);
  if (old && !old.deleted && !old.name.startsWith('(ancien)')) {
    await api('PATCH', '/dashboards/' + OLD_DASHBOARD + '/', { name: '(ancien) ' + old.name, pinned: false });
    console.log('ancien dashboard renommé et désépinglé : ' + old.name);
  }
}

main().catch(e => { console.error(e.message); process.exit(1); });
