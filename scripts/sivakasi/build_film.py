"""Builds src/sivakasi/data/<film>.json (acts + 60 fps timeline) from the voiced script. Usage: python3 build_film.py [paradox longroad]"""
import json, sys, os, math
R = "/Volumes/DarwinSSD/MMVideo/docs/geo/research/SV01-sivakasi-fireworks"
OUT = "/Volumes/DarwinSSD/MMVideo/src/sivakasi/data"
FPS, INTRO, TAIL = 60, 90, 180
def A(id, scene, beats, p=None, text=None, tag=False, sfx=None):
    return {"id": id, "scene": scene, "beats": beats.split(), "p": p or {}, "text": text or [], "tag": tag, "sfx": sfx or []}
def T(at, text, sub=None, mono=False, **kw): return dict(at=at, text=text, sub=sub, mono=mono, **kw)
CH4 = ["match", "hand", "sun", "press"]

PARADOX = [
 A("p01", "RainShadow", "pa01", text=[T(0, "RAIN SHADOW")]),
 A("p02", "EmptyTown", "pa02", text=[T(0, "NONE", "BEFORE 1923")], tag=True),
 A("p03", "FireSky", "pa03", {"density": 1.3}, text=[T(0, "80–90%", "OF INDIA'S FIREWORKS · INDUSTRY COUNT", mono=True)]),
 A("p04", "Chain", "pa04 pa05", {"icons": CH4, "litAt": [1, 1, 1, 1], "stagger": 150}, text=[T(0, "HOW?", size=140)]),
 A("p05", "Globe", "pb01"),
 A("p06", "Chain", "pb02", {"icons": ["match", "flame", "firework"], "litAt": [0, 0, 0], "stagger": 90}),
 A("p07", "Rewind", "pc01", {"from": 2026, "to": 1922}),
 A("p08", "Platform", "pc02 pc03", tag=True),
 A("p09", "Workshop", "pc04", tag=True),
 A("p10", "RouteMap", "pc05", {"from": "Kolkata", "to": "Sivakasi (approx)", "vehicle": "train", "arriveIcon": "factory"}, text=[T(0, "1923", mono=True)], tag=True),
 A("p11", "Chain", "pc06", {"icons": CH4, "litAt": [0, -1, -1, -1]}),
 A("p12", "Machines", "pd01", tag=True, sfx=[{"beat": 0, "off": 130, "name": "thump"}]),
 A("p13", "Hands", "pd02 pd03 pd04", {"farmsAt": 1}, text=[T(1, "SPARE HANDS")], tag=True),
 A("p14", "Charkha", "pd05", tag=True),
 A("p15", "Hands", "pd06", {"mode": "kitchens"}, tag=True),
 A("p16", "Chain", "pd07", {"icons": CH4, "litAt": [0, 0, -1, -1], "stagger": 60}),
 A("p17", "RivalLabels", "pe01", tag=True, sfx=[{"beat": 0, "off": 104, "name": "thump"}]),
 A("p18", "BengalLight", "pe02 pe03 pe03b", text=[T(1, "1938", "FIRST FIREWORKS FACTORY", mono=True)]),
 A("p19", "SunDrying", "pe04", text=[T(0, "FREE DRYING")]),
 A("p20", "Chain", "pe05", {"icons": CH4, "litAt": [0, 0, 0, -1], "stagger": 50}),
 A("p21", "RouteMap", "pf01 pf02", {"from": "Mumbai", "to": "Sivakasi (approx)", "vehicle": "labels", "arriveIcon": "press"}, text=[T(1, "1938", "OWN PRESS", mono=True)], tag=True),
 A("p22", "PressYear", "pf03", {"gridAt": 0.4}),
 A("p23", "Chain", "pf04", {"icons": ["calendar", "doc", "label"], "litAt": [0, 0, 0], "stagger": 80}),
 A("p24", "Chain", "pf05", {"icons": ["match", "firework", "press"], "litAt": [0, 0, 0], "stagger": 70}),
 A("p25", "Dominoes", "pf06", {"startAt": 0}),
 A("p26", "Licence", "pg01 pg02", {"hitAt": 1}, text=[T(0, "1940", mono=True, size=120)], sfx=[{"beat": 1, "off": 30, "name": "thump"}]),
 A("p27", "Blockade", "pg03", sfx=[{"beat": 0, "off": 20, "name": "whoosh"}]),
 A("p28", "ThreeFactories", "pg04", sfx=[{"beat": 0, "off": 20, "name": "pop"}, {"beat": 0, "off": 46, "name": "pop"}, {"beat": 0, "off": 72, "name": "pop"}]),
 A("p29", "Bars", "pg05 pg06 pg07 pg08", {"bars": [{"label": "1942", "v": 3, "at": 0}, {"label": "1980", "v": 189, "at": 1}, {"label": "2001", "v": 450, "at": 2}, {"label": "TODAY", "v": 1000, "at": 3, "plus": True}], "vmax": 1100},
   sfx=[{"beat": 0, "off": 8, "name": "pop"}, {"beat": 1, "off": 8, "name": "pop"}, {"beat": 2, "off": 8, "name": "pop"}, {"beat": 3, "off": 8, "name": "pop"}]),
 A("p30", "Money", "pg09", {"target": 6000, "startAt": 0}, sfx=[{"beat": 0, "off": 60, "name": "ding"}, {"beat": 0, "off": 150, "name": "ding"}, {"beat": 0, "off": 240, "name": "ding"}]),
 A("p31", "Chain", "pk01", {"icons": CH4, "litAt": [0, 0, 0, 0], "stagger": 170}),
 A("p32", "Haze", "pk02 ph00"),
 A("p33", "CourtGavel", "ph01", {"hitAt": 0}, text=[T(0, "2018", "THE BAN", mono=True)], sfx=[{"beat": 0, "off": 36, "name": "thump"}]),
 A("p34", "GreenBurst", "ph02 ph03 ph04", text=[T(1, "~30% LESS", "NOT ZERO")]),
 A("p35", "RouteMap", "ph04b", {"from": "Sivakasi (approx)", "to": "New Delhi", "vehicle": "labels", "arriveIcon": "firework"}),
 A("p36", "DeepavaliCal", "ph05 ph06", {"qrAt": 0, "slotAt": 0}, text=[T(0, "2025", "TOO CLOSE TO THE FESTIVAL", mono=True)]),
 A("p37", "Gate", "pi01", text=[T(0, "3 LAKH", "WORKERS · INDUSTRY COUNT", mono=True, y=140)]),
 A("p38", "Hands", "pi01b", tag=True),
 A("p39", "FloorPlan", "pi01c pi02", {"capAt": 0, "overAt": 1}, text=[T(0, "12", "THE LICENCE CAP", mono=True)]),
 A("p40", "Memorial", "pi03", text=[T(0, "19 APRIL 2026", "25 WORKERS KILLED")]),
 A("p41", "Attend", "pi04"),
 A("p42", "Hands", "pi05", tag=True),
 A("p43", "Licence", "pj00", {"hitAt": 0}, text=[T(0, "GI TAG", "APPLIED MAY 2025")], sfx=[{"beat": 0, "off": 30, "name": "thump"}]),
 A("p44", "Chain", "pj01", {"icons": ["match", "flame", "press", "ship"], "litAt": [0, 0, 0, 0], "stagger": 28}),
 A("p45", "FireSky", "pj02", {"density": 1.0}),
 A("p46", "Ember", "pj03"),
]
LONGROAD = [
 A("r01", "CourtGavel", "ra01", {"hitAt": 0}, text=[T(0, "OCT 2018", "THE BAN", mono=True)], sfx=[{"beat": 0, "off": 36, "name": "thump"}]),
 A("r02", "QuietSheds", "ra02", {"offAt": 0}, text=[T(0, "~5 MONTHS", "QUIET", mono=True)]),
 A("r03", "Rewind", "ra03 ra04", {"from": 2018, "to": 1922}, text=[T(1, "TRY · BUT · SO")]),
 A("r04", "Globe", "rb01"),
 A("r05", "RainShadow", "rb02"),
 A("r06", "Hands", "rb03", {"farmsAt": 0}),
 A("r07", "Chain", "rb04", {"icons": ["match", "flame", "firework"], "litAt": [0, 0, 0], "stagger": 90}),
 A("r08", "Platform", "rc01 rc02 rc03", text=[T(0, "1922", mono=True)], tag=True),
 A("r09", "Workshop", "rc04", tag=True),
 A("r10", "RouteMap", "rc05", {"from": "Kolkata", "to": "Sivakasi (approx)", "vehicle": "train", "arriveIcon": "factory"}, text=[T(0, "1923", mono=True)], tag=True),
 A("r11", "Machines", "rc06", text=[T(0, "BUT: TOO COSTLY")], tag=True, sfx=[{"beat": 0, "off": 130, "name": "thump"}]),
 A("r12", "Hands", "rc07 rc08", {"farmsAt": 0}, text=[T(0, "SO: SPREAD THE WORK")], tag=True),
 A("r13", "Charkha", "rc09", tag=True),
 A("r14", "Hands", "rc10", {"mode": "kitchens"}, tag=True),
 A("r15", "RivalLabels", "rd01", tag=True, sfx=[{"beat": 0, "off": 104, "name": "thump"}]),
 A("r16", "BengalLight", "rd02 rd03 rd04", text=[T(1, "BUT: PLAIN MATCHES", "SO: COLOUR")]),
 A("r17", "Chain", "rd04b", {"icons": ["match", "flame", "firework"], "litAt": [0, 0, 0], "stagger": 70}),
 A("r18", "Chain", "rd05", {"icons": ["match", "hand", "flame", "press"], "litAt": [0, 0, 0, -1], "stagger": 60}),
 A("r19", "RouteMap", "re01 re02", {"from": "Mumbai", "to": "Sivakasi (approx)", "vehicle": "labels", "arriveIcon": "press"}, text=[T(1, "SO: OWN PRESS", "1938", mono=True)], tag=True),
 A("r20", "PressYear", "re03", {"gridAt": 0.4}),
 A("r21", "Chain", "re04", {"icons": ["calendar", "doc", "label"], "litAt": [0, 0, 0], "stagger": 80}),
 A("r22", "Chain", "re05", {"icons": ["match", "firework", "press"], "litAt": [0, 0, 0], "stagger": 70}),
 A("r23", "Dominoes", "re06", {"startAt": 0}),
 A("r24", "Chain", "re07", {"icons": ["match", "flame", "press", "ship"], "litAt": [0, 0, 0, 0], "stagger": 100}),
 A("r25", "Licence", "rf01 rf02", {"hitAt": 1}, text=[T(0, "1940", mono=True, size=120)], sfx=[{"beat": 1, "off": 30, "name": "thump"}]),
 A("r26", "Blockade", "rf03", sfx=[{"beat": 0, "off": 20, "name": "whoosh"}]),
 A("r27", "ThreeFactories", "rf04", sfx=[{"beat": 0, "off": 20, "name": "pop"}, {"beat": 0, "off": 46, "name": "pop"}, {"beat": 0, "off": 72, "name": "pop"}]),
 A("r28", "Bars", "rf05 rf06 rf07 rf08", {"bars": [{"label": "1942", "v": 3, "at": 0}, {"label": "1980", "v": 189, "at": 1}, {"label": "2001", "v": 450, "at": 2}, {"label": "TODAY", "v": 1000, "at": 3, "plus": True}], "vmax": 1100},
   sfx=[{"beat": 0, "off": 8, "name": "pop"}, {"beat": 1, "off": 8, "name": "pop"}, {"beat": 2, "off": 8, "name": "pop"}, {"beat": 3, "off": 8, "name": "pop"}]),
 A("r29", "Money", "rf09", {"target": 6000, "startAt": 0}, sfx=[{"beat": 0, "off": 60, "name": "ding"}, {"beat": 0, "off": 150, "name": "ding"}, {"beat": 0, "off": 240, "name": "ding"}]),
 A("r30", "Chain", "rf09b", {"icons": ["match", "hand", "flame", "press", "ship"], "litAt": [0, 0, 0, 0, 0], "stagger": 40}),
 A("r31", "Rewind", "rf10", {"from": 2026, "to": 2018}),
 A("r32", "QuietSheds", "rg01", {"offAt": 0}),
 A("r33", "GreenBurst", "rg02 rg03 rg04", text=[T(1, "~30% LESS", "NOT ZERO")]),
 A("r34", "RouteMap", "rg04b", {"from": "Sivakasi (approx)", "to": "New Delhi", "vehicle": "labels", "arriveIcon": "firework"}),
 A("r35", "DeepavaliCal", "rg05 rg06", {"qrAt": 0, "slotAt": 0}, text=[T(0, "OCT 2025", "TOO CLOSE TO THE FESTIVAL", mono=True)]),
 A("r36", "Gate", "rh01", text=[T(0, "3 LAKH", "WORKERS · INDUSTRY COUNT", mono=True, y=140)]),
 A("r37", "Hands", "rh01b", tag=True),
 A("r38", "FloorPlan", "rh01c rh02", {"capAt": 0, "overAt": 1}, text=[T(0, "12", "THE LICENCE CAP", mono=True)]),
 A("r39", "Memorial", "rh03", text=[T(0, "19 APRIL 2026", "25 WORKERS KILLED")]),
 A("r40", "Attend", "rh04"),
 A("r41", "Hands", "rh05", tag=True),
 A("r42", "Licence", "rj00", {"hitAt": 0}, text=[T(0, "GI TAG", "APPLIED MAY 2025")], sfx=[{"beat": 0, "off": 30, "name": "thump"}]),
 A("r43", "Chain", "rj01", {"icons": ["match", "hand", "flame", "press", "ship"], "litAt": [0, 0, 0, 0, 0], "stagger": 60}),
 A("r44", "FireSky", "rj02", {"density": 1.0}),
 A("r45", "Ember", "rj03"),
]
FILMS = {"paradox": ("paradox_v1", PARADOX), "longroad": ("long_road_v1", LONGROAD)}

for film in (sys.argv[1:] or FILMS):
    name, acts = FILMS[film]
    sc = json.load(open(f"{R}/voice/{name}/storyboard.json"))["scenes"]; man = json.load(open(f"{R}/voice/{name}/vo/manifest.json"))
    order = [s["id"] for s in sc]; used = [b for a in acts for b in a["beats"]]
    assert used == order, f"{film}: act beats do not cover the script in order. missing={[b for b in order if b not in used]} extra={[b for b in used if b not in order]} first diff={next((i for i,(x,y) in enumerate(zip(used,order)) if x!=y),None)}"
    t = INTRO; beats = {}
    for s in sc:
        d = round((man[s["id"]]["sec"] + s["pause"]) * FPS); beats[s["id"]] = {"key": s["id"], "from": t, "dur": d, "sec": man[s["id"]]["sec"]}; t += d
    total = t + TAIL
    for i, a in enumerate(acts):
        start = 0 if i == 0 else beats[a["beats"][0]]["from"]
        end = total if i == len(acts) - 1 else beats[acts[i + 1]["beats"][0]]["from"]
        a["from"], a["dur"] = start, end - start
        a["spans"] = [{"key": b, "s": beats[b]["from"] - start, "e": beats[b]["from"] + beats[b]["dur"] - start} for b in a["beats"]]
        for x in a["sfx"]: x["frame"] = a["spans"][x["beat"]]["s"] + x["off"] + start
    nt = sum(len(a["text"]) for a in acts)
    os.makedirs(OUT, exist_ok=True)
    json.dump({"film": film, "fps": FPS, "total": total, "acts": acts}, open(f"{OUT}/{film}.json", "w"), ensure_ascii=False)
    json.dump({"fps": FPS, "total": total, "scenes": [{"id": b["key"], "from": b["from"], "vo": next(x["vo"] for x in sc if x["id"] == b["key"])} for b in beats.values()]}, open(f"{R}/voice/{name}/timeline.json", "w"))
    print(f"{film}: {len(acts)} acts, {len(sc)} beats, {total} frames = {total / FPS / 60:.2f} min, on-screen text on {nt} beats ({nt * 100 // len(sc)}%), longest act {max(a['dur'] for a in acts) / FPS:.1f}s")
