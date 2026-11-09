#!/usr/bin/env python3
"""Builds public/datayt/long/upsc/geo07-p2/storyboard.json from the checked script (GEO-07 Part 2).

The script is the single source of the words: research/upsc/GEO-07/script_p2.py in the main checkout
(/Volumes/DarwinSSD/DataKadai/mmvideo-dk). This file only cuts each beat into scenes and gives each scene a kind and a spec.
Every scene's vo is a run of whole sentences of its beat, so the narration stays word for word the checked script.
Kinds and spec fields: src/looks/cartoon/long/CONTRACT_UPSC.md (Part 1) and src/looks/upsc_rich_b/CONTRACT_B_P2.md (Part 2 additions).

  .venv/bin/python scripts/upsc/geo07_p2_storyboard.py      # writes the storyboard and prints a scene table
"""
import importlib.util, json, os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SCRIPT = "/Volumes/DarwinSSD/DataKadai/mmvideo-dk/research/upsc/GEO-07/script_p2.py"
OUT = os.path.join(ROOT, "public/datayt/long/upsc/geo07-p2/storyboard.json")
KID = "girl"


def load():
    spec = importlib.util.spec_from_file_location("ep", SCRIPT)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod.V


def kid(x=1450, y=960, h=560, pose="idle", **k):
    return dict(id="kid", who=KID, x=x, y=y, h=h, pose=pose, **k)


def F(t, state, s=None):
    return {k: v for k, v in dict(t=t, state=state, s=s).items() if v is not None}


def L(lab_or_text, key, at=None, **k):
    """A label item: `lab` keys (quantities) start with p2_, anything else is plain text."""
    d = dict(lab=lab_or_text) if lab_or_text.startswith("p2_") else dict(text=lab_or_text)
    d.update(key=key, **({"at": at} if at else {}), **k)
    return d


# beat -> list of (sentence indices, kind, spec, reveals [(key, word)], visual note)
PLAN = {
 "b00": [
  ([0, 1], "stage", dict(set="rooftop", time="july", actors=[kid(pose="present")], props=[dict(icon="bucket", x=1150, y=930, s=1.3, state="full"),
       dict(icon="postcards", x=640, y=420, s=1.0, cards=[dict(which="konkan", key="k1"), dict(which="thar", key="k2")])],
       badges=[dict(key="kb", lab="p2_konkan", caption="Konkan & Goa", x=300, y=700, size=96), dict(key="wb", lab="p2_wraj", caption="West Rajasthan", x=760, y=700, size=96)],
       pills=[dict(text="IMD NORMALS", x=96, y=72)]),
   [("k1", "Konkan"), ("kb", "three"), ("k2", "West"), ("wb", "thirty-three.")], "Rooftop from Part 1, bucket full. Postcards: Konkan in rain, Thar dunes; badges."),
  ([2, 3, 4], "stage", dict(set="rooftop", time="july", actors=[kid(pose="point")], props=[dict(icon="bucket", x=1150, y=930, s=1.3, state="full"),
       dict(icon="postcards", x=640, y=420, s=1.0, cards=[dict(which="konkan"), dict(which="thar"), dict(which="chennai", key="k3", hl=True)])],
       badges=[dict(key="tb", lab="p2_tn_half", caption="Tamil Nadu", x=700, y=700, size=80)]),
   [("k3", "Tamil"), ("tb", "half")], "The Chennai postcard under October cloud lights up; badge."),
  ([5], "title", dict(title="What does a normal monsoon really mean?", sub="Monsoon, part two", chip="GEOGRAPHY · UPSC"), [], "Title card: the question."),
 ],
 "b01": [
  ([0, 1], "stage", dict(set="void", props=[dict(icon="reportcard", x=960, y=500, s=1.4, box="NORMAL?", key="rc")]), [("rc", "word.")], "A season report card with one box: NORMAL?"),
  ([2, 3], "statement", dict(lines=[dict(text="long period average (LPA)", key="lp"), dict(text="about {const:87} cm", key="lv"), "June–September, all-India · IMD, 1971–2020"], accent=["long period average"]),
   [("lp", "long"), ("lv", "eighty-seven")], "The yardstick card."),
  ([4, 5], "stage", dict(set="field", actors=[dict(id="farmer", who="farmer", x=1200, y=960, h=600, pose="idle")], badges=[dict(key="rf", lab="p2_rainfed", caption="IMD", x=560, y=380, size=80)]),
   [("rf", "rain-fed,")], "A rain-fed field under a dry sky, a farmer looking up."),
  ([6, 7, 8], "stage", dict(set="home", actors=[kid(x=1300, pose="present")], props=[dict(icon="book", x=700, y=700, s=1.6, enter="nb")], belt=dict(key="bt"),
       pills=[dict(text="WHERE IT LANDS FIRST", x=96, y=72, key="q1"), dict(text="WHERE IT LEAVES LAST", x=96, y=150, key="q2"), dict(text="WHAT 'NORMAL' HIDES", x=96, y=228, key="q3")]),
   [("nb", "follow"), ("q1", "lands"), ("q2", "leaves"), ("q3", "hides."), ("bt", "belt")], "Notebook open on a blank India map; three question pills; the faint glowing belt from Part 1 drifts along the top (plant)."),
 ],
 "b02": [
  ([0, 1], "windmap", dict(focus="india", layers=[dict(id="pins", items=[L("Kerala?", "p1", at="kerala")])]), [("p1", "Kerala,")], "Atlas map, whole India with the islands; a tentative pin on Kerala."),
  ([2], "windmap", dict(focus="india", layers=[dict(id="pins", items=[L("p2_andaman", "p2", at="andaman", hl=True)])]), [("p2", "Andaman")], "First pin on the Andaman and Nicobar Islands."),
  ([3, 4, 5, 6], "windmap", dict(focus="india", layers=[dict(id="stream-bay", key="sb"), dict(id="stream-arabian", key="sa"),
       dict(id="pins", items=[L("p2_andaman", "p3", at="andaman"), L("p2_kerala", "p4", at="kerala")])]),
   [("sb", "Andaman"), ("p3", "Bay"), ("sa", "Then"), ("p4", "Kerala,")], "Two doors: first the Andaman Sea and Bay in May, then Kerala on the Arabian Sea side."),
 ],
 "b03": [
  ([0, 1, 2, 3, 4, 5, 6], "analogy", dict(which="checklist", chip="", title="IMD: onset over Kerala", labels=[L("p2_t1", "c1"), L("p2_t2", "c2"), L("p2_t3", "c3"), L("p2_t4", "c4"), L("p2_t5", "c5"), dict(text="ONSET DECLARED", key="c6")]),
   [("c1", "tenth"), ("c2", "six"), ("c3", "half"), ("c4", "westerly"), ("c5", "satellite"), ("c6", "declare")], "Clipboard checklist ticking box by box over a small Kerala map dotted with stations; satellite sees tall cloud."),
  ([7, 8], "windmap", dict(focus="india", layers=[dict(id="labels", items=[L("ELSEWHERE: JUDGEMENT", "jd", at="central")])]), [("jd", "judgement.")], "The rest of India with a quiet question mark: judgement, not a formula."),
 ],
 "b04": [
  ([0, 1, 2], "windmap", dict(focus="india", layers=[dict(id="branch-arabian", key="ba"), dict(id="branch-bay", key="bb")]),
   [("ba", "Arabian"), ("bb", "Bay")], "Two arms of cloud: up the west coast, and north into Bengal and the north-east."),
  ([3], "windmap", dict(focus="india", layers=[dict(id="branch-arabian", key="b2"), dict(id="branch-bay", key="b3"), dict(id="pins", items=[L("p2_mumbai", "pm", at="mumbai"), L("p2_delhi", "pd", at="delhi")])]),
   [("b2", "It"), ("b3", "It"), ("pm", "Mumbai"), ("pd", "Delhi")], "Pins: Mumbai, Delhi."),
  ([4, 5, 6, 7], "windmap", dict(focus="india", layers=[dict(id="front", dir="north", steps=[dict(key="f1"), dict(key="f2"), dict(key="f3"), dict(key="f4", lab="p2_all")]),
       dict(id="labels", items=[L("NORTHERN LIMIT OF MONSOON", "nl", at="top")])]),
   [("f1", "glide."), ("f2", "surges,"), ("f3", "edge"), ("nl", "northern"), ("f4", "eighth")], "A dashed front line steps north in jumps, clipped inside India; at the end it covers the whole country."),
 ],
 "b05": [
  ([0, 1], "statement", dict(lines=[dict(text="NCERT Class XI: “mid-July”", key="mj"), dict(text="old normal · from 1901–1940", key="ob")], accent=["mid-July"]), [("mj", "mid-July"), ("ob", "old")], "Citation card with a sticky-note 'old normal'."),
  ([2, 3], "analogy", dict(which="calendar-flip", chip="", labels=[L("p2_old_all", "o1"), L("p2_all", "n1")]), [("o1", "fifteenth"), ("n1", "eighth.")], "A calendar page flips from 15 to 8 July."),
  ([4, 5], "statement", dict(lines=[dict(text="a normal date = an average of many years", key="av"), dict(text="2025: whole country by {const:27} June", key="y5")], accent=["average"]), [("av", "average."), ("y5", "2025,")], "One year early: 2025."),
  ([6], "stage", dict(set="field", sky="clouds", actors=[dict(id="farmer", who="farmer", x=1100, y=960, h=600, pose="sow")], pills=[dict(text="KHARIF: SOWN WITH THE MONSOON", x=96, y=72, key="kh")]),
   [("kh", "kharif")], "A farmer sowing in a wet field as clouds arrive."),
 ],
 "b06": [
  ([0, 1], "windmap", dict(focus="india", layers=[dict(id="branch-arabian", key="g1"), dict(id="labels", items=[L("WESTERN GHATS", "wg", at="westcoast")])]), [("g1", "Arabian"), ("wg", "Ghats.")], "The Arabian Sea branch running into the Western Ghats."),
  ([2, 3, 4, 5], "analogy", dict(which="orographic", chip="", labels=[dict(text="OROGRAPHIC RAIN", key="or"), L("p2_windward", "ww")]), [("or", "orographic"), ("ww", "windward")], "Cross-section of the Ghats: wet wind climbing, cloud piling, rain on the west face."),
  ([6, 7, 8], "analogy", dict(which="orographic", chip="", lee=True, labels=[dict(text="OROGRAPHIC RAIN", key="or2"), L("p2_windward", "ww2"), dict(text="RAIN SHADOW", key="rs")]), [("or2", "Over"), ("ww2", "Over"), ("rs", "shadow.")], "Same section; air sliding down the east side, warm and dry: the rain shadow."),
 ],
 "b07": [
  ([0, 1, 2, 3], "analogy", dict(which="rain-types", chip="", labels=[dict(text="CONVECTIONAL", key="r1"), dict(text="OROGRAPHIC", key="r2"), dict(text="CYCLONIC", key="r3")]), [("r1", "Convectional"), ("r2", "Orographic"), ("r3", "Cyclonic")], "Three panels: rising warm bubble, mountain, swirling storm."),
  ([4, 5], "windmap", dict(focus="india", layers=[dict(id="branch-bay", key="bb2"), dict(id="pins", items=[L("p2_cherra", "ch", at="cherrapunji", hl=True)])]), [("bb2", "Bay"), ("ch", "Cherrapunji,")], "The Bay branch meeting the Meghalaya hills; pin on Cherrapunji."),
  ([6], "analogy", dict(which="column-house", chip="ILLUSTRATION", labels=[L("p2_house", "ho")]), [("ho", "tall")], "A column of water beside a three-storey house, about as tall as its roof."),
 ],
 "b08": [
  ([0, 1, 2], "windmap", dict(focus="india", layers=[dict(id="wetdry", key="wd"), dict(id="pins", items=[L("p2_wraj", "w1", at="wrajasthan"), L("p2_konkan", "w2", at="konkan"), L("p2_ninex", "w3", at="central")])]),
   [("wd", "other"), ("w1", "thirty-three"), ("w2", "Konkan"), ("w3", "nine")], "The atlas map shades wet to dry (chip ILLUSTRATION); pins West Rajasthan, Konkan; '9×'."),
  ([3, 4, 5, 6], "windmap", dict(focus="india", layers=[dict(id="wetdry", key="wd2"), dict(id="pins", items=[L("?", "tq", at="tncoast", hl=True)]), dict(id="labels", items=[L("NCERT: “remains dry”", "nd", at="south")])]),
   [("wd2", "look"), ("tq", "south-east"), ("nd", "dry")], "A question-mark pin on the Tamil Nadu coast (plant)."),
 ],
 "b09": [
  ([0, 1, 2, 3, 4], "stage", dict(set="rooftop", time="july", rain="spells", actors=[kid(pose="idle")], props=[dict(icon="bucket", x=1150, y=930, s=1.3, state="filling")],
       pills=[dict(text="ACTIVE SPELL", x=96, y=72, key="as"), dict(text="BREAK", x=96, y=150, key="bk")]),
   [("as", "active"), ("bk", "breaks.")], "Downpour, then days of sun over the bucket: spells."),
  ([5, 6, 7], "windmap", dict(focus="india", layers=[dict(id="trough", key="tr", pos="normal"), dict(id="trough-move", key="tm", to="north"), dict(id="labels", items=[L("BREAK: TROUGH AT THE FOOTHILLS", "fh", at="top")])]),
   [("tr", "trough"), ("tm", "moves"), ("fh", "foothills.")], "The trough slides north to the Himalayan foothills; rain moves with it."),
 ],
 "b10": [
  ([0, 1, 2], "statement", dict(lines=[dict(text="NCERT: rain fails for a week or more", key="nw"), dict(text="IMD: the trough and the winds", key="iw")], accent=["IMD"]), [("nw", "week"), ("iw", "IMD's")], "Two definitions, side by side."),
  ([3, 4, 5, 6, 7, 8], "analogy", dict(which="spells", chip="ILLUSTRATION", source="Rajeevan, Gadgil and Bhate (2010) · 1951–2007",
       labels=[dict(text="BREAKS LAST LONGER", key="s1"), L("p2_breakweek", "s2"), L("p2_nobreak", "s3"), dict(text="MANY BREAK DAYS → POOR SEASON", key="s4")]),
   [("s1", "longer"), ("s2", "third"), ("s3", "four,"), ("s4", "poor")], "Strip calendar of a July (wet blue, breaks sand); a tally of seasons, one in four 'no break'."),
 ],
 "b11": [
  ([0, 1, 2, 3], "windmap", dict(focus="india", layers=[dict(id="depression", key="dp"), dict(id="labels", items=[dict(text="MONSOON DEPRESSION", key="dn", at="central"), L("p2_dep", "d2", at="bay")])]),
   [("dp", "low-pressure"), ("dn", "depressions."), ("d2", "two")], "A slow swirl of cloud crossing the map inland."),
  ([4, 5], "analogy", dict(which="months", chip="", ref="u7_months", labels=[dict(text="JULY + AUGUST > ⅗", key="ja")]), [("ja", "three-fifths")], "Four month bars from IMD's shares; July and August tallest."),
 ],
 "b12": [
  ([0, 1, 2, 3], "analogy", dict(which="checklist", chip="", title="IMD: withdrawal", labels=[L("p2_wd1", "w1"), L("p2_wd2", "w2"), L("p2_wd3", "w3"), L("p2_wd4", "w4")]),
   [("w1", "September."), ("w2", "five"), ("w3", "drier"), ("w4", "change")], "The clipboard again, now for leaving."),
  ([4, 5, 6, 7], "windmap", dict(focus="india", layers=[dict(id="front", dir="south", steps=[dict(key="r1", lab="p2_nw"), dict(key="r2"), dict(key="r3", lab="p2_oct15")]),
       dict(id="labels", items=[L("p2_nw_old", "ro", at="nw")])]),
   [("r1", "seventeenth"), ("ro", "first"), ("r2", "old"), ("r3", "fifteenth")], "The dashed front line steps back south from the north-west."),
 ],
 "b13": [
  ([0, 1, 2, 3, 4], "windmap", dict(focus="india", layers=[dict(id="easterlies", key="ea"), dict(id="pins", items=[L("p2_nem", "ne", at="tncoast", hl=True)]), dict(id="labels", items=[L("p2_east", "e1", at="bay"), dict(text="NORTH-EAST MONSOON · OCT–DEC", key="e2", at="south")])]),
   [("ea", "easterly"), ("e1", "fourteenth"), ("ne", "twentieth,"), ("e2", "season")], "The question-mark pin turns into a cloud; easterly arrows onto the Tamil Nadu coast."),
  ([5, 6, 7, 8], "analogy", dict(which="jars", chip="", ref="u7_tn", labels=[dict(text="JUNE–SEPTEMBER", key="j1"), dict(text="RELATIVELY DRY, NOT DRY", key="j2"), dict(text="OCTOBER–DECEMBER", key="j3")]),
   [("j1", "June"), ("j2", "Relatively"), ("j3", "October")], "Two jars fill side by side, Oct-Dec taller. Values from IMD Chennai (mm)."),
 ],
 "b14": [
  ([0, 1, 2], "globe", dict(mode="seasons", glow=True, labels=[dict(text="SUMMER: NORTH WITH THE SUN", key="sn")]), [("sn", "summer,")], "The band from Part 1 rides north with the sun."),
  ([3, 4, 5, 6], "globe", dict(mode="belt-south", labels=[dict(text="AUTUMN: BACK SOUTH", key="bs"), dict(text="BAY STORMS", key="st"), dict(text="DECEMBER: FURTHER SOUTH", key="dc")]),
   [("bs", "autumn,"), ("st", "Storms"), ("dc", "December,")], "The band slides back south and settles over south India; Bay storms swirl in; in December it moves on south."),
  ([7, 8], "windmap", dict(focus="india", layers=[dict(id="pins", items=[L("FIRST: ANDAMAN SEA · MAY", "fa", at="andaman"), L("LAST: THE SOUTH · FADES IN DECEMBER", "la", at="tncoast")])]),
   [("fa", "first"), ("la", "last,")], "Two pins close the journey loop."),
 ],
 "b15": [
  ([0, 1, 2], "analogy", dict(which="bucket-band", chip="", labels=[L("p2_lpa", "lv2")]), [("lv2", "eighty-seven")], "The girl's bucket on a scale marked in cm, a band drawn around 87."),
  ([3, 4, 5], "analogy", dict(which="bucket-band", chip="", wobble=True, labels=[L("p2_lpa", "lv3"), L("p2_typical", "ty"), L("p2_worst", "wo")]), [("lv3", "From"), ("ty", "tenth"), ("wo", "shortfall")], "The water level wobbles inside the band."),
 ],
 "b16": [
  ([0, 1, 2, 3], "analogy", dict(which="rulers", chip="", ref="u7_norm", labels=[L("p2_band_fc", "rf"), L("p2_band_season", "rs")]), [("rf", "forecast,"), ("rs", "finished")], "Rulers with green 'normal' bands of different widths."),
  ([4, 5], "analogy", dict(which="rulers", chip="", ref="u7_norm", marker=True, labels=[L("p2_band_fc", "rf2"), L("p2_band_season", "rs2"), L("p2_m108", "mk")]), [("rf2", "So"), ("rs2", "So"), ("mk", "eight")], "A marker at 108 sits inside one band and outside the other."),
  ([6, 7, 8], "analogy", dict(which="rulers", chip="", ref="u7_norm", third=True, labels=[L("p2_band_fc", "rf3"), L("p2_band_season", "rs3"), L("p2_band_region", "rr"), dict(text="NAME THE SCALE", key="ns")]), [("rf3", "For"), ("rs3", "For"), ("rr", "state,"), ("ns", "name")], "A third, wider ruler for a region; 'name the scale'."),
 ],
 "b17": [
  ([0, 1, 2, 3, 4], "globe", dict(mode="pacific", labels=[L("p2_enso", "en"), dict(text="EL NIÑO", key="el"), dict(text="GENERALLY WEAKENS THE MONSOON", key="wk")]),
   [("en", "few"), ("el", "Niño."), ("wk", "weakens")], "The globe turns to the Pacific; warm water spreads east toward Peru."),
  ([5, 6, 7], "analogy", dict(which="cards", chip="", cards=[dict(text="1982", key="y1"), dict(text="1987", key="y2"), dict(text="2002", key="y3"), dict(text="2009", key="y4"), dict(text="2015", key="y5"), dict(text="1997: NORMAL", key="y6", good=True)]),
   [("y1", "1982,"), ("y2", "1987,"), ("y3", "2002,"), ("y4", "2009"), ("y5", "2015"), ("y6", "1997,")], "Five drought-year cards drop; a sixth, 1997, lands face up green."),
  ([8, 9], "analogy", dict(which="seesaw", chip="ANALOGY", limit="the dipole is a difference in sea temperature, not a moving plank", labels=[dict(text="INDIAN OCEAN DIPOLE", key="io"), dict(text="WARM WEST → TENDS TO HELP", key="ih")]),
   [("io", "Dipole."), ("ih", "help.")], "The Indian Ocean as a see-saw, warm on the west."),
  ([10, 11], "statement", dict(lines=[dict(text="Exam trap: two NCERT Class XI books disagree", key="tp"), dict(text="El Niño = warm water replacing the cold Peruvian current", key="rw")], accent=["warm water"]), [("tp", "trap:"), ("rw", "right")], "Citation card: the right way round."),
 ],
 "b18": [
  ([0, 1, 2], "analogy", dict(which="decades", chip="", ref="u7_lpa", labels=[dict(text="NEW NORMAL", key="nn")]), [("nn", "lowered")], "The ruler gets a new mark, a little lower: 88.1 → 86.9 cm."),
  ([3, 4, 5, 6], "analogy", dict(which="decades", chip="ILLUSTRATION", strip=True, labels=[dict(text="WETTER AND DRIER DECADES", key="wd"), L("p2_dry", "dp"), L("p2_six", "sx"), dict(text="MORE DRY SPELLS · MORE INTENSE WET SPELLS", key="ex")]),
   [("wd", "natural"), ("dp", "drier"), ("sx", "six"), ("ex", "intense")], "A long strip of decades shading wetter and drier in turns."),
  ([7, 8], "statement", dict(lines=[dict(text="Natural, ours, or both?", key="nq"), dict(text="Taken up in the climate change episode", key="cc")], accent=["Natural, ours, or both?"]), [("nq", "natural,"), ("cc", "climate")], "An open question card: said as unknown."),
 ],
 "b19": [
  ([0, 1, 2, 3, 4, 5], "stage", dict(set="rooftop", time="july", actors=[kid(pose="present")], props=[dict(icon="bucket", x=1150, y=930, s=1.3, state="full")],
       pills=[dict(text="A MAP", x=96, y=72, key="m1"), dict(text="A CALENDAR", x=96, y=150, key="m2"), dict(text="A RHYTHM", x=96, y=228, key="m3"), dict(text="A SCALE", x=96, y=306, key="m4")]),
   [("m1", "map:"), ("m2", "calendar:"), ("m3", "rhythm"), ("m4", "scale")], "Payoff: the bucket full; four things the one number hides."),
  ([6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "notebook", dict(who=KID, strike=dict(text="normal = one number?", key="x"), lines=[
        dict(text="Andaman Sea ~22 May · Kerala ~1 June", key="n1"), dict(text="Whole India ~8 July · NW withdrawal from ~17 Sept", key="n2"),
        dict(text="Windward Ghats wet · rain shadow dry", key="n3"), dict(text="Tamil Nadu: almost ½ from the NE monsoon, Oct–Dec", key="n4"),
        dict(text="All-India normal: 1971–2020 average, ~87 cm", key="n5"), dict(text="El Niño usually weakens it, not always", key="n6"), dict(text="Normal is a band, not a number", key="n7")]),
   [("x", "exam,"), ("n1", "Andaman"), ("n2", "covers"), ("n3", "windward"), ("n4", "Tamil"), ("n5", "all-India"), ("n6", "Niño"), ("n7", "band,")],
   "Exam card: 'normal = one number?' struck out; the answer fills the page, one line per sentence."),
 ],
 "b20": [
  ([0, 1], "stage", dict(set="rooftop", time="july", actors=[kid(pose="cheer")], pills=[dict(text="NEXT: JET STREAMS AND THE NORTH'S WINTER RAIN", x=96, y=72, key="nx")]), [("nx", "next")], "The girl looks up to a thin fast stream high in the sky."),
 ],
}


def main():
    V = load()
    scenes, n, problems = [], 0, []
    for b in V["beats"]:
        ss = [s for s in re.split(r"(?<=[.?!])\s+", b["say"]) if s]
        plan = PLAN.get(b["key"])
        if not plan:
            problems.append(f"{b['key']}: no plan"); continue
        used = [i for g in plan for i in g[0]]
        if sorted(used) != list(range(len(ss))):
            problems.append(f"{b['key']}: scenes cover sentences {sorted(used)} of {len(ss)}")
        for idx, kind, spec, reveals, visual in plan:
            n += 1
            vo = " ".join(ss[i] for i in idx if i < len(ss))
            words = re.findall(r"[\w'’-]+[.,?!:]?", vo)
            for key, word in reveals:
                if not any(w == word or w.rstrip(".,?!:") == word.rstrip(".,?!:") for w in words):
                    problems.append(f"s{n:03d} ({b['key']}): reveal word {word!r} not in vo")
            scenes.append(dict(id=f"s{n:03d}", act=f"Ch{b['ch']} {b['key']}", kind=kind, spec=spec, vo=vo,
                               reveals=[dict(key=k, word=w) for k, w in reveals], transition="cut", visual=visual,
                               beat=b["key"], claims=b["claims"]))
    joined = " ".join(s["vo"] for s in scenes)
    if joined.split() != " ".join(b["say"] for b in V["beats"]).split():
        problems.append("storyboard vo is not word for word the script")
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump(dict(id="geo07-p2", format="long-16x9", target_minutes=10.5, script=SCRIPT, scenes=scenes), open(OUT, "w"), indent=1, ensure_ascii=False)
    kinds = {}
    for s in scenes:
        kinds[s["kind"]] = kinds.get(s["kind"], 0) + 1
    print(f"{len(scenes)} scenes -> {OUT}\n  kinds: {kinds}")
    for p in problems:
        print("  PROBLEM", p)
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
