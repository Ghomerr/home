"""Génère les illustrations de la page à partir des repos voisins.

Usage : python tools/build_images.py [chemin/vers/banner.jpg] [chemin/vers/avatar.jpg]
Les images produites sont versionnées dans assets/img : ce script n'est utile
que pour les régénérer (nécessite Pillow).
"""
import os, re, random, sys
from PIL import Image, ImageOps

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


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    dungeon_escape(); skull_king(); roidesnains(); music_reader(); brick_tag()
    if len(sys.argv) > 1: magic_hatventure(sys.argv[1])
    if len(sys.argv) > 2: avatar(sys.argv[2])
