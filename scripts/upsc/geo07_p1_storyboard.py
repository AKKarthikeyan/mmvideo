#!/usr/bin/env python3
"""Builds public/datayt/long/upsc/geo07-p1/storyboard.json from the checked script (GEO-07 Part 1, draft 4).

The script is the single source of the words: research/upsc/GEO-07/script_p1.py in the main checkout
(/Volumes/DarwinSSD/DataKadai/mmvideo-dk). This file only cuts each beat into scenes and gives each scene a kind and a spec.
Every scene's vo is a run of whole sentences of its beat, so the narration stays word for word the checked script.
Kinds and spec fields: src/looks/cartoon/long/CONTRACT_UPSC.md.

  .venv/bin/python scripts/upsc/geo07_p1_storyboard.py      # writes the storyboard and prints a scene table
"""
import importlib.util, json, os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SCRIPT = "/Volumes/DarwinSSD/DataKadai/mmvideo-dk/research/upsc/GEO-07/script_p1.py"
OUT = os.path.join(ROOT, "public/datayt/long/upsc/geo07-p1/storyboard.json")
KID = "girl"   # placeholder look; AK picks the kid's name, look and voice


def load():
    spec = importlib.util.spec_from_file_location("ep", SCRIPT)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod.V


def kid(x=1450, y=960, h=560, pose="idle", **k):
    return dict(id="kid", who=KID, x=x, y=y, h=h, pose=pose, **k)


def F(t, state, s=None):
    return {k: v for k, v in dict(t=t, state=state, s=s).items() if v is not None}


# beat -> list of (sentence indices, kind, spec, reveals [(key, word)], visual note)
PLAN = {
 "b00": [
  ([0, 1], "stage", dict(set="rooftop", time="may", actors=[kid(pose="idle")], props=[dict(icon="bucket", x=1150, y=930, s=1.3, state="empty"), dict(icon="thermometer", x=250, y=560, s=2.0, level="high")],
       badges=[dict(key="t5", ref=F("u7_nagpur", "May", "tmax"), suffix="°C", caption="May afternoons, Nagpur", x=820, y=300, size=170, decimals=1),
               dict(key="r5", ref=F("u7_nagpur", "May", "raindays"), suffix=" days", caption="with rain in May", x=820, y=640, size=120, decimals=1)],
       pills=[dict(text="IMD NORMALS 1991–2020", x=96, y=72)], intro="globe-band"),
   [("t5", "forty-three"), ("r5", "four")],
   "First second, unlabelled: Earth from space with a thin white cloud band near the equator (intro='globe-band', the plant). Cut to a Nagpur rooftop in May: shimmer, empty bucket, thermometer high."),
  ([2, 3], "stage", dict(set="rooftop", time="july", actors=[kid(pose="present")], props=[dict(icon="bucket", x=1150, y=930, s=1.3, state="filling"), dict(icon="thermometer", x=250, y=560, s=2.0, level="mid")],
       badges=[dict(key="t7", ref=F("u7_nagpur", "July", "tmax"), suffix="°C", caption="July afternoons, Nagpur", x=820, y=300, size=170, decimals=1),
               dict(key="r7", ref=F("u7_nagpur", "July", "raindays"), suffix=" days", caption="with rain in July", x=820, y=640, size=120, decimals=1)], rain=True),
   [("t7", "thirty-two"), ("r7", "twenty-one")], "July: grey sky, rain, the bucket filling."),
  ([4], "title", dict(title="If heat brings the monsoon, why does the rain wait?", sub="Monsoon, part one", chip="GEOGRAPHY · UPSC"), [], "Title card: the question."),
 ],
 "b01": [
  ([0, 1], "stage", dict(set="void", props=[dict(icon="calendar", x=960, y=520, s=3.0, enter="cal", hl=True)],
       badges=[dict(key="sw", ref=F("u7_rain", "India", "sw_share"), suffix="%", caption="of the year's rain, June–September (IMD normals 1971–2020)", x=1420, y=420, size=170, decimals=1)]),
   [("cal", "matters"), ("sw", "three-quarters")], "A calendar with June to September glowing; the share badge."),
  ([2, 3, 4, 5], "stage", dict(set="home", actors=[kid(x=1300, pose="present")], props=[dict(icon="book", x=700, y=700, s=1.6, enter="nb")],
       pills=[dict(text="STEP ONE: MAKE IT STRONG", x=96, y=72), dict(text="STEP TWO: TEST IT", x=96, y=150, key="p2")]),
   [("nb", "textbooks"), ("p2", "test")], "The kid opens a notebook. Two step pills."),
 ],
 "b02": [
  ([0, 1, 2, 3], "windmap", dict(focus="india", layers=[dict(id="seabreeze-giant", key="g1"), dict(id="labels", items=[dict(text="HOT LAND", at="india", key="l1"), dict(text="COOLER SEA", at="arabian", key="l2")])]),
   [("l1", "land"), ("l2", "sea."), ("g1", "flows")], "The classic picture: hot land, cooler sea, one big arrow onto India."),
  ([4], "statement", dict(lines=["“unequal heating of land and the sea”", dict(text="NCERT, Class {const:9}, page {const:49}", key="c9")], accent=["unequal heating"]), [("c9", "Class")], "The NCERT words, quoted exactly, as a citation card (never the page)."),
  ([5, 6], "notebook", dict(lines=[dict(text="Easy. Land hot, sea cool, wind comes.", key="e1")], who=KID), [("e1", "right.")], "The kid writes 'Easy.' (plant)."),
 ],
 "b03": [
  ([0, 1, 2], "stage", dict(set="beach", time="noon", actors=[kid(x=900, pose="cheer", talk=True)], bubble=dict(text="Ow, ow, ow!", x=900, y=380, key="ow")), [("ow", "burns")], "The kid hops on burning sand, then steps into cool water."),
  ([3, 4], "analogy", dict(which="heat-rates", chip="", labels=[dict(text="LAND: FAST", key="a1"), dict(text="WATER: SLOW", key="a2")]), [("a1", "Land"), ("a2", "Water")], "Two thermometers, land rising fast, water slowly."),
 ],
 "b04": [
  ([0, 1, 2], "analogy", dict(which="column", chip="", labels=[dict(text="AIR PRESSURE = WEIGHT OF AIR", key="c1")]), [("c1", "pressure.")], "A column of air pressing on the kid's head."),
  ([3, 4, 5], "analogy", dict(which="rooms", chip="ANALOGY", limit="air is pushed; it does not choose", labels=[dict(text="LOW: AIR RISES", key="lo"), dict(text="HIGH: AIR SINKS", key="hi"), dict(text="HIGH → LOW", key="hl")]),
   [("lo", "rise."), ("hi", "sink."), ("hl", "towards")], "Crowded room and empty room, people drift into the empty one."),
  ([6, 7], "analogy", dict(which="gradient", chip="", labels=[dict(text="PRESSURE GRADIENT", key="pg")]), [("pg", "gradient.")], "Isobars close together (strong wind) and far apart (gentle wind)."),
 ],
 "b05": [
  ([0, 1, 2], "analogy", dict(which="breeze", time="day", chip="", labels=[dict(text="SEA BREEZE · BY DAY", key="sb")]), [("sb", "breeze.")], "Beach by day: air rises over the sand, sea air slides in."),
  ([3], "analogy", dict(which="breeze", time="night", chip="", labels=[dict(text="LAND BREEZE · BY NIGHT", key="lb")]), [("lb", "round.")], "Same beach at night, arrow flipped."),
 ],
 "b06": [
  ([0], "windmap", dict(focus="india", zoomFromBeach=True, layers=[dict(id="seabreeze-giant", key="g2")]), [("g2", "country.")], "The beach zooms out until it becomes India."),
  ([1, 2], "statement", dict(lines=[dict(text="Halley, {const:1686}", key="hy"), "“a gigantic land-sea breeze”"], accent=["gigantic land-sea breeze"]), [("hy", "Halley")], "Citation card: Halley's model."),
  ([3], "statement", dict(lines=["Gadgil, 2018:", "“many papers and most textbooks”"], accent=["most textbooks"]), [], "Citation card: Gadgil 2018."),
 ],
 "b07": [
  ([0, 1, 2, 3], "windmap", dict(focus="ocean", layers=[dict(id="monsoon-sw", key="sw1"), dict(id="labels", items=[dict(text="FROM THE SOUTH-WEST", at="arabian", key="l3")])]), [("sw1", "map"), ("l3", "south-west.")], "Monsoon winds arriving from the south-west, not straight north."),
  ([4, 5], "analogy", dict(which="roundabout", chip="ANALOGY", limit="on Earth: zero at the equator, strongest at the poles", labels=[]), [], "A roundabout from above; a rolled ball traces a curve."),
  ([6, 7, 8, 9], "globe", dict(mode="coriolis", labels=[dict(text="CORIOLIS FORCE", key="co"), dict(text="RIGHT (NORTH)", key="r"), dict(text="LEFT (SOUTH)", key="l"), dict(text="ZERO AT THE EQUATOR", key="z")]),
   [("co", "Coriolis"), ("r", "right."), ("l", "left."), ("z", "absent")], "Globe: moving-air arrows bending right in the north, left in the south; none at the equator."),
  ([10, 11, 12, 13], "windmap", dict(focus="ocean", layers=[dict(id="equator", key="eq"), dict(id="trades-se", key="tr"), dict(id="cross", key="cx", badge=dict(lab="cross", key="cx")), dict(id="bend", key="bd"), dict(id="labels", items=[dict(text="SE TRADES → SW MONSOON", at="arabian", key="ex")])]),
   [("eq", "equator"), ("tr", "trade"), ("cx", "forty"), ("bd", "bend"), ("ex", "become")], "SE trades cross the equator between 40 and 60°E and swing to the south-west. Exam line on screen."),
 ],
 "b08": [
  ([0, 1, 2], "stage", dict(set="void", actors=[kid(x=960, pose="idle")], pills=[dict(text="THE TEST: MORE HEAT = MORE RAIN?", x=96, y=72, key="ts")]), [("ts", "test?")], "The kid holds the notebook: the test question."),
  ([3, 4], "stage", dict(set="rooftop", time="may", actors=[kid(pose="present", talk=True)], props=[dict(icon="bucket", x=1150, y=930, s=1.3, state="empty")],
       bubble=dict(text="If heat brings rain, this bucket should be full by now.", x=1300, y=360, key="bk"), pills=[dict(text="SIMPSON, 1921", x=96, y=72)]), [("bk", "hotter")], "Rooftop in May again: the empty bucket."),
  ([5, 6], "windmap", dict(focus="india", layers=[dict(id="hot-nw", key="nw"), dict(id="labels", items=[dict(text="HOTTEST · HARDLY ANY RAIN (GADGIL 2018)", at="nw", key="l4")])]), [("nw", "north-west,"), ("l4", "hardly")], "North-west India glowing hot, a near-empty rain gauge."),
  ([7], "stage", dict(set="void", pills=[dict(text="POOR-RAIN YEARS: HOTTER", x=96, y=72, key="pr")], props=[dict(icon="thermometer", x=960, y=560, s=2.4, level="high")]), [("pr", "poor")], "A thermometer over a dry field."),
 ],
 "b09": [
  ([0, 1], "statement", dict(lines=["Sulochana Gadgil", "Indian Institute of Science", "the record, 1950–2014"]), [], "Citation card."),
  ([2, 3, 4], "sketch", dict(chip="ILLUSTRATION", lines=[dict(label="land temperature", dir="up", key="s1"), dict(label="monsoon rain", dir="down", key="s2")], caption="shape only, not the data · Gadgil 2018"), [("s1", "temperature"), ("s2", "lower.")], "Slow beat: two hand-drawn lines, one rising as the other falls. Hold."),
 ],
 "b10": [
  ([0, 1, 2, 3], "stage", dict(set="home", actors=[kid(pose="present")], props=[dict(icon="book", x=760, y=640, s=2.0, glow=True, enter="gl")], pills=[dict(text="“no single theory” · NCERT Class XI", x=96, y=72, key="ns")]), [("gl", "warned"), ("ns", "theory")], "The kid flips the textbook; a small note glows. Citation label only."),
  ([4, 5, 6], "globe", dict(mode="zoomout", labels=[]), [], "The camera pulls back from India to the whole Earth."),
 ],
 "b11": [
  ([0, 1, 2], "globe", dict(mode="band", glow=True, labels=[dict(text="WHERE WINDS MEET, RAIN FALLS", key="bn")]), [("bn", "band")], "The first frame again, now glowing."),
  ([3, 4, 5, 6, 7], "globe", dict(mode="hadley", labels=[dict(lab="rising", key="ri"), dict(lab="sinking", key="sk"), dict(text="TRADE WINDS", key="tw")]), [("ri", "rise,"), ("sk", "thirty"), ("tw", "trade")], "Arrows rise at the band, flow out high, sink near 30°, return low."),
  ([8, 9, 10], "analogy", dict(which="pot", chip="ANALOGY", limit="the planet's spin bends the returning winds", labels=[dict(text="HADLEY CELL", key="hc")]), [("hc", "Hadley")], "A pot on a stove: rising in the middle, sinking at the sides."),
 ],
 "b12": [
  ([0, 1, 2, 3], "globe", dict(mode="itcz", labels=[dict(text="ITCZ = THE RAIN BELT", key="it")]), [("it", "ITCZ.")], "Trade winds from north and south meet; cloud towers grow along the line."),
 ],
 "b13": [
  ([0, 1, 2, 3], "globe", dict(mode="seasons", labels=[dict(text="THE BELTS FOLLOW THE SUN", key="fs")]), [("fs", "sun.")], "The year runs fast: the sun's overhead spot slides north and south; the belt follows like a shadow."),
  ([4], "statement", dict(lines=["“the most pronounced effect”", "is seen in the monsoons", dict(text="NCERT, Class {const:11}", key="c11")], accent=["most pronounced"]), [("c11", "Class")], "Citation card."),
  ([5, 6, 7, 8], "windmap", dict(focus="asia", layers=[dict(id="itcz-july", key="ij", badge=dict(lab="itcz_july", key="ij")), dict(id="labels", items=[dict(text="MONSOON TROUGH", at="ganges", key="mt")])]), [("ij", "twenty"), ("mt", "trough.")], "The belt settles over the Gangetic plain in July."),
 ],
 "b14": [
  ([0, 1, 2, 3], "globe", dict(mode="split", labels=[dict(text="NEWER VIEW: THE RAIN BELT MOVING NORTH", key="nv")]), [("nv", "belt")], "Peak. The sea-breeze arrow fades; the glowing belt slides over India pulling the trades. Music rises."),
  ([4, 5], "statement", dict(lines=["Geen and colleagues, 2020:", "“a shift in the understanding”"], accent=["a shift in the understanding"]), [], "Citation card."),
  ([6, 7], "statement", dict(lines=["Gadgil: abandon the sea-breeze view", "Not everyone agrees"], accent=["Not everyone agrees"]), [], "Two views, side by side."),
 ],
 "b15": [
  ([0, 1, 2, 3, 4], "windmap", dict(focus="india", layers=[dict(id="heatlow", key="hl"), dict(id="labels", items=[dict(lab="heatlow", at="nw", key="h1"), dict(text="IMD: linked, to some extent, to a good monsoon", at="south", key="h2")])]), [("hl", "heat"), ("h1", "deep."), ("h2", "links")], "A shimmering dome over the north-west, a thin swirl near the ground."),
  ([5, 6, 7, 8], "windmap", dict(focus="india", layers=[dict(id="lat20", key="l20", badge=dict(lab="lat20", key="l20")), dict(id="labels", items=[dict(text="WU ET AL. 2012", at="south", key="wu"), dict(text="GADGIL: READS IT DIFFERENTLY", at="nw", key="gd"), dict(text="OPEN QUESTION", at="top", key="oq")])]), [("l20", "twenty"), ("wu", "Wu"), ("gd", "differently."), ("oq", "argue")], "The 20°N line; two labelled views; 'open question'."),
 ],
 "b16": [
  ([0, 1, 2, 3], "windmap", dict(focus="india", layers=[dict(id="trough", key="tg", pos="south"), dict(id="trough-move", key="tn", to="north"), dict(id="labels", items=[dict(text="ACTIVE", at="central", key="ac"), dict(text="BREAK", at="central", key="br")])]), [("tg", "trough"), ("ac", "active"), ("tn", "north,"), ("br", "break")], "The trough line from the heat low to the Bay, sliding south (active) then north (break, rain on the foothills)."),
 ],
 "b17": [
  ([0, 1, 2], "windmap", dict(focus="ocean", layers=[dict(id="mascarene", key="mh", badge=dict(lab="mascarene", key="mh")), dict(id="labels", items=[dict(text="MASCARENE HIGH", at="mascarene", key="ml")])]), [("mh", "high-pressure"), ("ml", "Mascarene")], "An H near Madagascar."),
  ([3, 4, 5, 6], "windmap", dict(focus="ocean", layers=[dict(id="mascarene", key="mh2"), dict(id="somali", key="sj"), dict(id="labels", items=[dict(lab="somali", at="somali", key="sl"), dict(text="JUNE → JULY", at="westcoast", key="jj")])]), [("mh2", "That"), ("sj", "Somali"), ("sl", "half"), ("jj", "June,")], "A low ribbon of wind up the Somali coast, bending east to India."),
 ],
 "b18": [
  ([0, 1, 2, 3], "stage", dict(set="himalaya", actors=[], pills=[dict(text="HIMALAYA: SHIELD + TRAP", x=96, y=72, key="ht")]), [("ht", "divide.")], "The Himalaya rises like a wall; cold air bumps it from the north; clouds pile up on the Indian side."),
  ([4, 5, 6], "windmap", dict(focus="asia", layers=[dict(id="tibet", key="tb", badge=dict(lab="tibet", key="tb")), dict(id="labels", items=[dict(text="IMD 2025: BARRIER + HEAT SOURCE", at="tibet", key="ib")])]), [("tb", "Tibetan"), ("ib", "barrier")], "The plateau shaded; IMD's two roles."),
  ([7, 8, 9, 10], "statement", dict(lines=["Boos and Kuang: a wall", "Wu et al.: plateau heating", "Still open"], accent=["Still open"]), [], "Two views, and the unknown shown on screen."),
 ],
 "b19": [
  ([0, 1, 2], "windmap", dict(focus="asia", layers=[dict(id="tej", key="tj"), dict(id="labels", items=[dict(text="TROPICAL EASTERLY JET", at="chennai-lat", key="tl")])]), [("tj", "fast"), ("tl", "Tropical")], "A thin fast stream high over India near Chennai's latitude."),
  ([3, 4], "stage", dict(set="street", time="burst", actors=[kid(pose="worried")], rain=True, thunder=True, pills=[dict(text="THE BURST", x=96, y=72, key="bu")]), [("bu", "burst.")], "The sky splits open in thunder."),
  ([5, 6, 7, 8], "statement", dict(lines=["NCERT: jets “held responsible”", "2007 review: not stated as the cause", "Not settled in what we read"], accent=["Not settled"]), [], "Two sources side by side, and the unknown."),
 ],
 "b20": [
  ([0, 1, 2], "globe", dict(mode="overhead", labels=[dict(text="THE RAIN FOLLOWS THE BELT", key="rf")]), [("rf", "belt")], "The belt arrives over India; rising air, towering cloud."),
  ([3, 4, 5], "stage", dict(set="rooftop", time="july", actors=[kid(pose="present")], props=[dict(icon="bucket", x=1150, y=930, s=1.3, state="full")], rain=True,
       pills=[dict(lab="burst_cool", x=96, y=72, key="cl")]), [("cl", "fall")], "The rooftop bucket is full."),
  ([6, 7, 8, 9, 10, 11, 12, 13], "notebook", dict(who=KID, strike=dict(text="Easy.", key="x"), lines=[
        dict(text="SE trades cross the equator → SW monsoon", key="n1"), dict(text="Classic view: unequal heating of land and sea", key="n2"),
        dict(text="2020 review: the convergence zone shifts north", key="n3"), dict(text="Over India in July: the monsoon trough (NCERT)", key="n4"),
        dict(text="Heat low, Mascarene High, Somali jet: linked to strength", key="n5"), dict(text="Himalaya: shield and trap · jets, Tibet: debated", key="n6")]),
   [("x", "exam,"), ("n1", "trades"), ("n2", "classic"), ("n3", "review"), ("n4", "NCERT"), ("n5", "linked"), ("n6", "Himalaya")], "Payoff: 'Easy.' crossed out; the answer fills the page, one line per sentence."),
 ],
 "b21": [
  ([0, 1], "stage", dict(set="rooftop", time="july", actors=[kid(pose="cheer")], pills=[dict(text="NEXT: THE MONSOON'S JOURNEY", x=96, y=72, key="nx")]), [("nx", "part")], "The kid closes the notebook and looks up, imagining the belt overhead."),
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
            vo = " ".join(ss[i] for i in idx)
            words = re.findall(r"[\w'’-]+[.,?!]?", vo)
            for key, word in reveals:
                if not any(w == word or w.rstrip(".,?!") == word.rstrip(".,?!") for w in words):
                    problems.append(f"s{n:03d} ({b['key']}): reveal word {word!r} not in vo")
            scenes.append(dict(id=f"s{n:03d}", act=f"Ch{b['ch']} {b['key']}", kind=kind, spec=spec, vo=vo,
                               reveals=[dict(key=k, word=w) for k, w in reveals], transition="cut", visual=visual,
                               beat=b["key"], claims=b["claims"]))
    joined = " ".join(s["vo"] for s in scenes)
    if joined.split() != " ".join(b["say"] for b in V["beats"]).split():
        problems.append("storyboard vo is not word for word the script")
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump(dict(id="geo07-p1", format="long-16x9", target_minutes=10.5, script=SCRIPT, scenes=scenes), open(OUT, "w"), indent=1, ensure_ascii=False)
    kinds = {}
    for s in scenes:
        kinds[s["kind"]] = kinds.get(s["kind"], 0) + 1
    print(f"{len(scenes)} scenes -> {OUT}\n  kinds: {kinds}")
    for p in problems:
        print("  PROBLEM", p)
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
