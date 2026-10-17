"""Génère les illustrations de la page à partir des repos voisins.

Usage : python tools/build_images.py [chemin/vers/banner.jpg] [chemin/vers/avatar.jpg]
        python tools/build_images.py --gallery chemin/vers/captures
Les images produites sont versionnées dans assets/img : ce script n'est utile
que pour les régénérer (nécessite Pillow).

--gallery produit les images des carrousels (assets/img/gallery/) à partir de captures
d'écran des jeux en cours de partie (Chrome headless, 1600x900 ; 1440x900 pour
Lect'O'Note), rangées par projet dans le dossier donné :
  de/              tools/devcheck.js --gallery de dungeon-escape
  malefic-realms/  tools/.devcheck de malefic-realms
  skull-king/, roidesnains/, music-reader/   parties jouées par des bots
"""
import os, re, random, sys
from PIL import Image, ImageFilter, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'assets', 'img')
DEV = os.path.normpath(os.path.join(HERE, '..', '..'))
GMS = os.path.expanduser('~/Documents/GameMakerStudio2')
W, H = 960, 600  # ratio 16:10 des tuiles


def save(im, name, size=(W, H)):
    im = im.convert('RGB')
    if size:
        im = ImageOps.fit(im, size, Image.LANCZOS)
    path = os.path.join(OUT, name)
    im.save(path, 'WEBP', quality=82, method=6)
    print(name, im.size, os.path.getsize(path) // 1024, 'Ko')


def crop_ratio(im, cx=0.5, cy=0.5, ratio=W / H):
    w, h = im.size
    if w / h > ratio:
        nw = int(h * ratio); x = int((w - nw) * cx)
        return im.crop((x, 0, x + nw, h))
    nh = int(w / ratio); y = int((h - nh) * cy)
    return im.crop((0, y, w, y + nh))


def dungeon_escape():
    im = Image.open(os.path.join(DEV, 'dungeon-escape/static/assets/adventurers/dragon.png'))
    # Carré : la tuile vedette occupe un bloc 2x2 sur grand écran
    save(im, 'dungeon-escape.webp', size=(900, 900))


def skull_king():
    im = Image.open(os.path.join(DEV, 'skull-king/static/assets/sk-box.jpg'))
    save(crop_ratio(im, cy=0.08), 'skull-king.webp')


def roidesnains():
    im = Image.open(os.path.join(DEV, 'roidesnains/assets/dessin.png'))
    save(crop_ratio(im, cy=0.45), 'roidesnains.webp')


def music_reader():
    im = Image.open(os.path.join(DEV, 'music-reader/v0/samples/fortunio-p1.jpg')).convert('L')
    im = ImageOps.autocontrast(im.crop((540, 290, 1440, 852)), cutoff=1)
    # Duotone aux couleurs de l'icône de l'app (indigo)
    im = ImageOps.colorize(im, black='#1e1b4b', white='#eef2ff', mid='#6366f1')
    save(im, 'music-reader.webp')


def magic_hatventure(banner):
    # Bannière du profil X : on retire les bandes noires et on cadre sur le mage
    im = Image.open(banner).crop((250, 100, 250 + 640, 500))
    save(im, 'magic-hatventure.webp')


def gms_frames(project, sprite):
    """Frames d'un sprite GameMaker, dans l'ordre déclaré par le .yy."""
    folder = os.path.join(GMS, project, 'sprites', sprite)
    yy = open(os.path.join(folder, sprite + '.yy'), encoding='utf-8').read()
    uids = []
    for uid in re.findall(r'[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}', yy):
        if uid not in uids and os.path.exists(os.path.join(folder, uid + '.png')):
            uids.append(uid)
    return [Image.open(os.path.join(folder, u + '.png')).convert('RGBA') for u in uids]


def brick_tag():
    """Recompose l'arène du jeu : murs, briques colorées par coin, 4 joueurs."""
    random.seed(7)
    T, cols, rows = 16, 20, 13
    bricks = gms_frames('brick_tag_game', 'sp_brick')
    wall = gms_frames('brick_tag_game', 'sp_wall')[0]
    safe = gms_frames('brick_tag_game', 'sp_safeBlock')[0]
    heroes = [gms_frames('brick_tag_game', f'sp_{n}_idle_face')[0]
              for n in ('aquaman', 'cyclope', 'zombie', 'demon')]
    scene = Image.new('RGBA', (cols * T, rows * T), (24, 22, 38, 255))
    spawns = [(2, 2), (cols - 3, 2), (2, rows - 3), (cols - 3, rows - 3)]
    corner_frame = {(0, 0): 0, (1, 0): 1, (0, 1): 2, (1, 1): 3}
    for x in range(cols):
        for y in range(rows):
            pos = (x * T, y * T)
            if x in (0, cols - 1) or y in (0, rows - 1):
                scene.alpha_composite(wall, pos)
            elif any(abs(x - sx) <= 1 and abs(y - sy) <= 1 for sx, sy in spawns):
                scene.alpha_composite(safe, pos)
            elif random.random() > 0.2:  # quelques briques déjà cassées
                home = corner_frame[(int(x >= cols / 2), int(y >= rows / 2))]
                frame = home if random.random() < 0.6 else random.randrange(len(bricks))
                scene.alpha_composite(bricks[frame % len(bricks)], pos)
    for hero, (sx, sy) in zip(heroes, spawns):
        scene.alpha_composite(hero, (sx * T, sy * T))
    scene = scene.resize((scene.width * 3, scene.height * 3), Image.NEAREST)
    save(scene, 'brick-tag.webp')


def avatar(path):
    save(Image.open(path), 'avatar.webp', size=(256, 256))


def card_fan(names, folder, background):
    """Cartes du jeu en éventail sur un fond flouté."""
    bg = ImageOps.fit(background.convert('RGB'), (W, H), Image.LANCZOS)
    bg = bg.filter(ImageFilter.GaussianBlur(6)).point(lambda v: int(v * .55)).convert('RGBA')
    n = len(names)
    for i, name in enumerate(names):
        card = Image.open(os.path.join(folder, name)).convert('RGBA')
        center = i == n // 2
        card = card.resize((250 if center else 220, 351 if center else 309), Image.LANCZOS)
        mask = Image.new('L', card.size, 0)
        from PIL import ImageDraw
        ImageDraw.Draw(mask).rounded_rectangle((0, 0, card.width - 1, card.height - 1), radius=14, fill=255)
        card.putalpha(mask)
        angle = (n // 2 - i) * 11
        card = card.rotate(angle, expand=True, resample=Image.BICUBIC)
        shadow = Image.new('RGBA', card.size, (0, 0, 0, 0))
        shadow.putalpha(card.getchannel('A').point(lambda a: a * 0.6))
        shadow = shadow.filter(ImageFilter.GaussianBlur(10))
        x = W // 2 + (i - n // 2) * 150 - card.width // 2
        y = H // 2 - card.height // 2 + abs(i - n // 2) * 28 + 10
        bg.alpha_composite(shadow, (x + 8, y + 12))
        bg.alpha_composite(card, (x, y))
    return bg


def gallery(shots):
    """Images des carrousels (2e et 3e images de chaque projet)."""
    out = os.path.join(OUT, 'gallery')
    os.makedirs(out, exist_ok=True)
    shot = lambda *p: Image.open(os.path.join(shots, *p))
    g = lambda im, name: save(im, os.path.join('gallery', name))

    # Dungeon Escape : les aventuriers face au dragon, puis une carte Événement
    g(shot('de', '27-sprites-idle.png').crop((110, 20, 830, 470)), 'dungeon-escape-board.webp')
    g(shot('de', '43-event-card-desktop.png').crop((470, 244, 1130, 656)), 'dungeon-escape-event.webp')
    # Malefic Realms : les quatre factions, le plateau, le choix des héros
    g(crop_ratio(Image.open(os.path.join(DEV, 'malefic-realms/static/assets/cards/factions.jpg'))), 'malefic-realms.webp')
    g(shot('malefic-realms', '10-game-desktop.png').crop((250, 60, 1330, 735)), 'malefic-realms-board.webp')
    g(shot('malefic-realms', '02-heroes-selected.png').crop((586, 198, 1354, 678)), 'malefic-realms-heroes.webp')
    # Lect'O'Note : lecture en cours (mesure surlignée), puis le bilan de l'analyse
    g(shot('music-reader', '4-playing.png'), 'music-reader-player.webp')
    g(shot('music-reader', '2-analyse.png'), 'music-reader-analyse.webp')
    # Skull King : la table en pleine manche, puis les cartes spéciales
    g(shot('skull-king', 'table-6-6.png').crop((360, 160, 1240, 710)), 'skull-king-table.webp')
    sk = os.path.join(DEV, 'skull-king/static/assets')
    g(card_fan(['pirate_juanita-jade.jpg', 'mermaid_alyra.jpg', 'skull-king.jpg', 'tigresse_choice.jpg', 'pirate_will-le-bandit.jpg'],
               sk, Image.open(os.path.join(sk, 'cards-background.jpg'))), 'skull-king-cards.webp')
    # Roi des Nains : un pli en cours, puis le choix de la quête
    g(shot('roidesnains', 'trick-1-h8.png').crop((200, 10, 1400, 760)), 'roidesnains-trick.webp')
    g(shot('roidesnains', 'quest-3.png').crop((250, 80, 1490, 855)), 'roidesnains-quest.webp')


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    if len(sys.argv) > 2 and sys.argv[1] == '--gallery':
        gallery(sys.argv[2])
        sys.exit()
    dungeon_escape(); skull_king(); roidesnains(); music_reader(); brick_tag()
    if len(sys.argv) > 1: magic_hatventure(sys.argv[1])
    if len(sys.argv) > 2: avatar(sys.argv[2])
