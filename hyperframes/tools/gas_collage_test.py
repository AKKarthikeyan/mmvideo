import sys; sys.path.insert(0, "/tmp")
from collage_lib import *
D = "/Volumes/DarwinSSD/MMVideo/hyperframes/media_src/gas/"
F = paper().convert("RGBA")
ph = torn_photo(D + "47871913_ISS_46_Gulf_of_Oman_with_Strait_of_Hormu.jpg", 900, -3)
F.alpha_composite(ph, (930, 120)); tape(F, 1280, 100, -4)
d = ImageDraw.Draw(F)
d.text((90, 70), "THE STORM", font=SERIF, fill=(30, 30, 35))
d.text((96, 190), "Qatar's ships, July to September", font=MARK, fill=(176, 130, 30))
# 28 ship icons, 6 arrive
for i in range(28):
    col, row = i % 7, i // 7
    x, y = 100 + col * 112, 330 + row * 92
    ok = i < 6
    fill = (40, 70, 110) if ok else (200, 196, 186)
    d.polygon([(x, y + 30), (x + 90, y + 30), (x + 76, y + 52), (x + 12, y + 52)], fill=fill)
    for k in range(3): d.ellipse((x + 14 + k * 24, y + 10, x + 34 + k * 24, y + 30), fill=fill)
    if not ok: d.line((x, y + 56, x + 90, y + 4), fill=(200, 40, 40), width=5)
d.text((100, 712), "28 due  ·  6 arrived (equivalent)", font=MARK, fill=(200, 40, 40))
d.text((100, 795), "MANAGEMENT SAYS (Petronet, Q2 call)", font=SMALL, fill=(90, 85, 75))
ship = Image.open(D + "cut/lng_ship.png").convert("RGBA"); ship.thumbnail((900, 400))
F.alpha_composite(sticker(halftone_bw(ship)), (930, 760))
d = ImageDraw.Draw(F)
d.text((1180, 640), "Strait of Hormuz, from space", font=MARK_S, fill=(245, 240, 230))
source(d, "Photos: NASA / Tim Kopra, ISS (public domain) · LNG tanker Minerva Amorgos by Rhetos (CC0), via Wikimedia Commons")
F.convert("RGB").save("/tmp/gas_frame05.jpg", quality=90); print("ok")
