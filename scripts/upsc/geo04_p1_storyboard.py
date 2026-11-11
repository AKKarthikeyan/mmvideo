#!/usr/bin/env python3
"""Builds public/datayt/long/upsc/geo04-p1/storyboard.json from the audited script (GEO-04 Part 1, Volcanoes, 10 Nov 2026),
adds this film's on-screen quantities to figures.json (u7_labels / u7_claims, keys g4_*), and builds the estimated timeline.

The script is the single source of the words: research/upsc/GEO-04/script_p1.py in the main checkout (draft 2, audit fixes applied).
This file only cuts each beat into scenes and gives each scene a kind and a spec. Look: CONTRACT_B.md; the new analogy variants of this
film: CONTRACT_B_GEO04.md (builders V1, V2, V3).

  .venv/bin/python scripts/upsc/geo04_p1_storyboard.py
"""
import importlib.util, json, os, re, subprocess, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SCRIPT = "/Volumes/DarwinSSD/DataKadai/mmvideo-dk/research/upsc/GEO-04/script_p1.py"
OUT = os.path.join(ROOT, "public/datayt/long/upsc/geo04-p1/storyboard.json")
FIG = os.path.join(ROOT, "public/datayt/long/upsc/figures.json")

# on-screen quantities: key -> (text, claim id in research/upsc/GEO-04/claims.csv)
G4 = {
    "g4_pina": ("Mount Pinatubo · Philippines · 1991", "V060"),
    "g4_cool": ("world ~0.5 °C cooler over 1991–93 (USGS)", "V060"),
    "g4_water": ("older USGS fact sheet: >90% of volcanic gas is water vapour", "V005"),
    "g4_mauna": ("Mauna Loa · more than 4,000 m above the sea", "V012"),
    "g4_flow": ("can be hotter than 800 °C (USGS)", "V008"),
    "g4_crater": ("Crater Lake, Oregon · formed ~6,800 years ago", "V014"),
    "g4_ridge": ("~¾ of all lava erupts under the oceans (USGS estimate)", "V018"),
    "g4_paricutin": ("Parícutin, Mexico · 1943 · 360+ m in 9 years", "V015"),
    "g4_rim": ("more than ½ of the world's active volcanoes (USGS)", "V026"),
    "g4_hawaii": ("Hawaii · 3,200+ km from the nearest plate boundary", "V027"),
    "g4_wilson": ("HOTSPOT · J. Tuzo Wilson, 1963", "V027"),
    "g4_kauai": ("Kauai · oldest rocks ~5.5 million years", "V027"),
}


def load():
    spec = importlib.util.spec_from_file_location("ep", SCRIPT)
    mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
    return mod.V


def L(t, key, **k):
    d = dict(lab=t) if t.startswith("g4_") else dict(text=t)
    d.update(key=key, **k)
    return d


def A(which, labels=(), chip="", limit="", **k):
    return dict(which=which, chip=chip, limit=limit, labels=list(labels), **k)


def S(lines, accent=()):
    return dict(lines=lines, accent=list(accent))


# beat -> [(sentence indices, kind, spec, reveals [(key, word)], visual note)]
PLAN = {
 "b00": [
  ([0, 1], "analogy", A("volcano-hook", [L("Mauna Loa · Hawaii", "ml"), L("lava pours out gently", "gl")], mode="mauna"),
   [("ml", "Mauna"), ("gl", "gently.")], "Dusk on Mauna Loa: a red lava river sliding down a broad, gentle grey slope."),
  ([2, 3, 4, 5], "analogy", A("volcano-hook", [L("g4_pina", "pt"), L("g4_cool", "cl")], mode="pinatubo"),
   [("pt", "Pinatubo"), ("cl", "degree")], "A towering ash column over green Philippine hills; then a small globe dimming under a thin veil."),
  ([6], "title", dict(title="Why do some volcanoes ooze and others explode?", sub="Volcanoes, part one", chip="GEOGRAPHY · UPSC"), [], "Title card: the question."),
 ],
 "b01": [
  ([0, 1], "statement", S([dict(text="UPSC Prelims {const:2024} · GS Paper I · Q{const:3}", key="pq"), "How many of these come out of a volcano?",
                           "pyroclastic debris · ash and dust · nitrogen compounds · sulphur compounds"], ["How many"]),
   [("pq", "Prelims")], "Citation card: the 2024 Prelims question, text only."),
  ([2, 3, 4, 5, 6, 7], "notebook", dict(who="girl", lines=[dict(text="First: what comes out", key="n1"), dict(text="Then: the switch, ooze or explode", key="n2"),
                                                         dict(text="Then: where volcanoes sit on the map", key="n3"), dict(text="Keep an eye on Hawaii", key="n4")]),
   [("n1", "First,"), ("n2", "switch"), ("n3", "map."), ("n4", "Hawaii.")], "The girl's notebook: the three steps, and a note to watch Hawaii (plant)."),
 ],
 "b02": [
  ([0, 1, 2, 3], "analogy", A("cutaway", [L("NCERT: where gases, ash or melted rock escape", "df"), L("VOLCANO = the vent, and usually its cone", "vt")], mode="vent"),
   [("df", "NCERT"), ("vt", "vent")], "An atlas-relief mountain cut open: the vent and the cone it built light up."),
  ([4, 5, 6, 7], "analogy", A("cutaway", [L("MAGMA · melted rock underground", "mg"), L("LAVA · once it erupts", "lv"), L("NCERT Class XI calls it lava a little earlier, as it rises", "nc"),
                                          L("FOR THE EXAM: MAGMA BELOW, LAVA ABOVE", "ex")], mode="magma"),
   [("mg", "magma."), ("lv", "lava."), ("nc", "earlier,"), ("ex", "clean")], "The same cut-away: a glowing chamber labelled magma deep below, a red flow labelled lava on the slope."),
 ],
 "b03": [
  ([0, 1, 2], "analogy", A("eruption-products", [L("LAVA FLOWS", "p1"), L("PYROCLASTIC DEBRIS · broken rock", "p2"), L("VOLCANIC BOMBS", "p3"), L("ASH AND DUST", "p4"),
                                                 L("GASES · nitrogen and sulphur compounds; a little chlorine, hydrogen, argon", "p5")], mode="list"),
   [("p1", "lava"), ("p2", "pyroclastic"), ("p3", "bombs,"), ("p4", "ash"), ("p5", "gases")], "An eruption sorts itself into labelled layers: lava flows, bombs, ash, a pale gas plume."),
  ([3, 4, 5], "statement", S([dict(text="The {const:2024} question: by NCERT's list, all four come out", key="q4"), dict(text="We have not read UPSC's answer key: this answer is ours", key="ak")], ["all four"]),
   [("q4", "question"), ("ak", "answer")], "Card: the answer by NCERT's list, and the honest note that it is ours."),
  ([6, 7, 8, 9], "analogy", A("eruption-products", [L("BOMBS · usually land near the vent", "bn"), L("FINEST ASH · travels farthest", "af"), L("g4_water", "wv")], mode="spread"),
   [("bn", "bombs,"), ("af", "finest"), ("wv", "nine-tenths")], "Heavy bombs fall close to the cone, ash drifts far downwind, a tall white steam plume rises."),
 ],
 "b04": [
  ([0, 1, 2, 3, 4, 5], "analogy", A("pot-lid", [L("PRESSURE BUILDS", "pb"), L("slip out, or blow the lid off?", "q")], chip="ANALOGY", limit="our picture, not a geologist's"),
   [("pb", "Pressure"), ("q", "decides")], "The girl's kitchen: a steel pot on a gas flame, the lid rattling, puffs escaping at its rim."),
 ],
 "b05": [
  ([0, 1, 2, 3], "analogy", A("fizzy", [L("RUNNY LAVA · gas escapes quietly", "rn"), L("THICK LAVA · gas trapped, then bursts", "th"), L("VISCOUS = thick, pasty", "vs")],
                              mode="jugs", chip="ANALOGY"),
   [("rn", "runny"), ("th", "Thick,"), ("vs", "viscous.")], "Two jugs: water poured runs and its bubbles pop; thick porridge holds big bubbles that burst."),
  ([4, 5, 6], "analogy", A("fizzy", [L("USGS: like a fizzy drink", "fz")], mode="bottle", chip="ANALOGY"),
   [("fz", "fizzy")], "The girl shakes a bottle with her thumb on top, lifts the thumb, and foam bursts out."),
  ([7, 8, 9], "analogy", A("fizzy", [L("IN MAGMA: GAS LEAVES THE MELT AS PRESSURE FALLS", "gp")], mode="limit", chip="ANALOGY",
                           limit="magma is not shaken: gas comes out of the melt as the pressure falls while it rises"),
   [("gp", "pressure")], "A rising column of magma: bubbles appear and grow as it climbs; a depth gauge falls."),
 ],
 "b06": [
  ([0, 1, 2, 3, 4], "analogy", A("shield", [L("SHIELD VOLCANO · runny basalt · broad, gentle", "sh"), L("g4_mauna", "ml")], mode="dome"),
   [("sh", "shield"), ("ml", "four")], "A wide, low dome in atlas relief, thin lava sheets layered like pages; the girl at its foot for scale."),
  ([5, 6], "analogy", A("shield", [L("NCERT: explosive if water gets into the vent", "wt")], mode="steam"),
   [("wt", "water")], "Sea water meets the vent: a sudden white jet of steam."),
 ],
 "b07": [
  ([0, 1, 2, 3, 4, 5], "analogy", A("composite", [L("layers of lava and ash", "ly"), L("COMPOSITE VOLCANO · STRATOVOLCANO", "cv"), L("Fuji · St Helens · Pinatubo", "ex")], mode="cone"),
   [("ly", "layers."), ("cv", "composite"), ("ex", "Fuji")], "A steep cone cut open to show stripes of lava and ash."),
  ([6, 7], "analogy", A("composite", [L("PYROCLASTIC FLOW · hot ash, rock and gas", "pf"), L("g4_flow", "t8")], mode="flow"),
   [("pf", "pyroclastic"), ("t8", "eight")], "A grey avalanche of hot cloud racing down the cone's flank."),
 ],
 "b08": [
  ([0, 1], "analogy", A("five-types", [L("NCERT'S FIVE TYPES", "f5")], mode="all"),
   [("f5", "five")], "Five cards on the girl's desk: dome, steep cone, hollow with a lake, stacked lava sheets, a glowing sea-floor crack; the first two tick."),
  ([2, 3, 4], "analogy", A("five-types", [L("CALDERA · the top falls in", "cd"), L("g4_crater", "cl")], mode="caldera"),
   [("cd", "caldera."), ("cl", "Crater")], "The caldera card grows: a cone empties and its top falls in; a blue lake fills the hollow."),
  ([5, 6], "analogy", A("five-types", [L("FLOOD BASALT PROVINCE", "fb")], mode="flood"),
   [("fb", "flood")], "The flood basalt card grows: very runny lava spreads in sheet after sheet across a plain."),
  ([7, 8, 9], "analogy", A("five-types", [L("MID-OCEAN RIDGE VOLCANO", "mr"), L("g4_ridge", "q3")], mode="ridge"),
   [("mr", "mid-ocean"), ("q3", "three-quarters")], "The ridge card grows: a glowing crack on the dark sea floor, pillows of lava."),
 ],
 "b09": [
  ([0, 1, 2], "analogy", A("cinder-cone", [L("CINDER CONE", "cc"), L("g4_paricutin", "pr")]),
   [("cc", "cinder"), ("pr", "Paricutin.")], "A ploughed field with a farmer's oxen; a small smoking mound becomes a tall black cone over a time-lapse of seasons."),
  ([3], "statement", S(["What about magma that never reaches the surface?"], ["never"]), [], "Card: the question that leads underground."),
 ],
 "b10": [
  ([0, 1, 2], "analogy", A("intrusive", [L("VOLCANIC ROCK · cooled on the surface", "vr"), L("PLUTONIC ROCK · cooled underground: bigger crystals", "pr")], mode="rocks"),
   [("vr", "volcanic"), ("pr", "plutonic")], "Two rock samples under a lens: fine-grained on the left, coarse crystals on the right."),
  ([3, 4, 5], "analogy", A("intrusive", [L("INTRUSIVE FORMS (NCERT)", "if"), L("BATHOLITH · a large granite body", "bt"), L("seen only after erosion", "er")], mode="batholith"),
   [("if", "intrusive"), ("bt", "batholith"), ("er", "erosion")], "A crust cut-away: a huge granite body far below; the layers above wear away until its dome shows as grey hills."),
 ],
 "b11": [
  ([0, 1, 2, 3, 4], "analogy", A("intrusive", [L("LACCOLITH", "la"), L("LAPOLITH", "lp"), L("PHACOLITH", "ph"), L("SILL · SHEET", "si"), L("DYKE", "dk")], mode="all"),
   [("la", "laccolith"), ("lp", "lapolith"), ("ph", "phacolith"), ("si", "sill"), ("dk", "dyke")], "One labelled cut-away with all the shapes; each lights up as it is named."),
  ([5, 6], "analogy", A("intrusive", [L("NCERT: dykes, commonest in western Maharashtra", "wm"), L("feeders of the Deccan Traps", "dt")], mode="deccan"),
   [("wm", "Maharashtra."), ("dt", "feeders")], "The dyke glows as a vertical wall feeding stacked lava sheets above."),
 ],
 "b12": [
  ([0, 1, 2, 3, 4], "analogy", A("subduction", [L("PLATE EDGES", "pe"), L("AN OCEAN PLATE SINKS", "sk"), L("PLATES PART · new crust", "pt")], mode="both"),
   [("pe", "edges"), ("sk", "sinks"), ("pt", "apart,")], "A slice of the Earth: an ocean plate sliding under a continent with a volcano above; across the ocean a ridge pulling apart."),
  ([5, 6, 7, 8], "analogy", A("plates-map", [L("g4_rim", "mh"), L("NCERT: the 'rim of fire'", "nc"), L("RING OF FIRE", "rf")], mode="ring", chip="ILLUSTRATION"),
   [("mh", "half"), ("nc", "rim"), ("rf", "Ring")], "A world map centred on the Pacific; a red band lights up around its rim."),
 ],
 "b13": [
  ([0, 1, 2, 3], "analogy", A("subduction", [L("SINKING PLATE → STICKY LAVA · composite cones", "sc"), L("RIDGES → RUNNY BASALT", "rb")], mode="join"),
   [("sc", "composite"), ("rb", "runny")], "The slice again: a steep sticky cone over the sinking plate; a ridge welling runny lava across the ocean."),
 ],
 "b14": [
  ([0, 1, 2], "analogy", A("plates-map", [L("g4_hawaii", "hw")], mode="hawaii", chip="ILLUSTRATION"),
   [("hw", "thousand")], "The Pacific map again: the question mark from the start lands on Hawaii, far from the rim."),
  ([3, 4, 5, 6, 7], "analogy", A("hotspot", [L("g4_wilson", "jw"), L("PLATE MOVES", "pm"), L("g4_kauai", "ka")]),
   [("jw", "hotspot."), ("pm", "drifts"), ("ka", "Kauai,")], "A cut-away: a plume of heat under a moving plate builds islands one by one; they slide away like a conveyor, the oldest worn low."),
  ([8, 9], "statement", S(["A hotspot track has been linked to India's Deccan Traps", dict(text="That story: part two", key="p2")], ["Deccan Traps"]),
   [("p2", "part")], "Card: the Deccan link, and the promise of part two."),
 ],
 "b15": [
  ([0, 1, 2], "statement", S(["It comes down to the lava", "and the lava is linked to where the volcano sits"], ["lava"]), [], "Card: the answer in one line."),
  ([3, 4, 5, 6], "analogy", A("subduction", [L("RUNNY BASALT · hotspots and ridges · gas slips out", "rb"), L("STICKY LAVA · over sinking plates · bursts", "st")], mode="summary"),
   [("rb", "basalt"), ("st", "Sticky")], "The slice view one last time, with the bottle and the map beside it."),
  ([7, 8, 9, 10, 11, 12, 13, 14, 15, 16], "notebook", dict(who="girl", strike=dict(text="What comes out?", key="x"), lines=[
      dict(text="Magma: melted rock underground · lava: once erupted", key="n1"), dict(text="Thin lava: gentle · thick, viscous lava: explosive", key="n2"),
      dict(text="NCERT's five: shield, composite, caldera, flood basalt, mid-ocean ridge", key="n3"),
      dict(text="Intrusive forms: batholith, laccolith, lapolith, phacolith, sill, dyke", key="n4"),
      dict(text="Most active volcanoes: near plate boundaries; more than half ring the Pacific", key="n5"),
      dict(text="Hotspots build volcanoes far from any boundary", key="n6")]),
   [("x", "write"), ("n1", "Magma"), ("n2", "Thin"), ("n3", "NCERT's"), ("n4", "intrusive"), ("n5", "boundaries."), ("n6", "Hotspots,")],
   "The girl's notebook: the old question struck out; the exam lines fill in one per sentence."),
 ],
 "b16": [
  ([0, 1, 2], "analogy", A("ferry-island", [L("NEXT · Barren Island · the Deccan Traps · eruptions and the world's weather", "nx")]),
   [("nx", "Barren")], "The girl looks out from a ferry at a lone smoking island in a blue sea."),
 ],
}


def sentences(t):
    return [s for s in re.split(r"(?<=[.?!])\s+", t.strip()) if s]


def main():
    V = load()
    fig = json.load(open(FIG, encoding="utf-8"))
    for k, (txt, cid) in G4.items():
        fig["u7_labels"][k] = txt
        fig["u7_claims"][k] = f"GEO-04 {cid}"
    fig["meta"]["g4_source"] = "research/upsc/GEO-04/claims.csv in the main checkout; u7_claims names the claim id of every g4_ value"
    json.dump(fig, open(FIG, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    scenes, problems, n = [], [], 0
    for b in V["beats"]:
        ss, plan = sentences(b["say"]), PLAN.get(b["key"])
        if not plan:
            problems.append(f"{b['key']}: no plan"); continue
        used = sorted(i for p in plan for i in p[0])
        if used != list(range(len(ss))):
            problems.append(f"{b['key']}: scenes cover sentences {used} of {len(ss)}")
        for idx, kind, spec, reveals, visual in plan:
            n += 1
            vo = " ".join(ss[i] for i in idx if i < len(ss))
            words = re.findall(r"[\w'’-]+[.,?!:]?", vo)
            for key, word in reveals:
                if not any(w == word or w.rstrip(".,?!:") == word.rstrip(".,?!:") for w in words):
                    problems.append(f"s{n:03d} ({b['key']}): reveal word {word!r} not in vo")
            for lab in spec.get("labels", []):
                if "text" in lab and re.search(r"\d", lab["text"]):
                    problems.append(f"s{n:03d}: typed digit in label {lab['text']!r} (use a g4_ key)")
            scenes.append(dict(id=f"s{n:03d}", act=f"Ch{b['ch']} {b['key']}", kind=kind, spec=spec, vo=vo, reveals=[dict(key=k, word=w) for k, w in reveals],
                               transition="cut", visual=visual, beat=b["key"], claims=b["claims"]))
    if " ".join(s["vo"] for s in scenes).split() != " ".join(b["say"] for b in V["beats"]).split():
        problems.append("storyboard vo is not word for word the script")
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump(dict(id="geo04-p1", format="long-16x9", target_minutes=9.0, script=SCRIPT, scenes=scenes), open(OUT, "w"), indent=1, ensure_ascii=False)
    kinds = {}
    for s in scenes:
        kk = s["kind"] + (":" + s["spec"]["which"] if s["kind"] == "analogy" else "")
        kinds[kk] = kinds.get(kk, 0) + 1
    print(f"{len(scenes)} scenes -> {OUT}\n  " + ", ".join(f"{k} {v}" for k, v in sorted(kinds.items())))
    for p in problems:
        print("  PROBLEM", p)
    if problems:
        return 1
    r = subprocess.run([sys.executable, os.path.join(ROOT, "scripts/datayt/long_timeline.py"), OUT, "--out", OUT.replace("storyboard.json", "timeline.json")], capture_output=True, text=True)
    print(r.stdout.strip()[-300:], r.stderr.strip()[-300:])
    return r.returncode


if __name__ == "__main__":
    sys.exit(main())
