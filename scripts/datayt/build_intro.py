#!/usr/bin/env python3
"""Data Kadai channel intro (under 45 s): two findings from built Shorts, the logo, the promise, the themes.
One build feeds two cuts: DATA-intro (1080x1920) and DATA-intro-long (1920x1080).

Usage (on the Mini, from the repo root, in a login shell so MINIMAX_API_KEY and SARVAM_API_KEY are set):
  .venv/bin/python scripts/datayt/build_intro.py            voice, music and data
  .venv/bin/python scripts/datayt/build_intro.py --check    data checks and estimated timing only: no voice, no music
Then: npx remotion render src/index.ts DATA-intro out/datakadai/intro/intro.mp4 --crf=18
      npx remotion render src/index.ts DATA-intro-long out/datakadai/intro/intro-long.mp4 --crf=18

Writes public/datayt/intro/data.json, music.wav and the narration. Template: src/datayt/Intro.tsx.
The two findings are read from the built Shorts (sh01, px01) and never retyped: the build stops if either has changed.
The channel name is a Tamil word, so it is spoken by the Tamil voice (voice_dk.say_tamil, AK 13 Oct 2026); no English
line may contain it.
"""
import json, math, os, statistics, sys

sys.path.insert(0, os.path.dirname(__file__))
import music_shorts as M

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = f"{ROOT}/public/datayt/intro"
CHECK = "--check" in sys.argv
FPS, LEAD, GAP, TAIL, MAX_S = 30, 0.12, 0.2, 0.3, 45.0

# One scene per entry: (kind, the lines spoken in it). Each line is a cue the template animates to.
# A dict line is Tamil: "ta" is what the Tamil voice reads (Tamil script, voice text only, never on screen), "says" what it says.
SCENES = [
    ("tease", ["One state grows nearly half of India's sugarcane.", "Uttar Pradesh."]),
    ("second", ["Bihar: lowest income per person, yet 5G in ninety-six of a hundred villages."]),
    ("tables", ["India's official tables are full of numbers like these.", "You just have to open them."]),
    ("logo", ["We do.", {"ta": "டேட்டா கடை.", "says": "Data Kadai."}, "It means data shop.", "This one serves India's numbers, fresh."]),
    ("promise", ["A new number every day, from official sources, named on screen."]),
    ("shelf", ["Money, farms, schools, and how your state compares."]),
    ("end", ["So, where does your state rank?"]),
]
# The day themes (public/datayt/bank/themes.json), in posting order.
THEMES = ["Money", "Farm and food", "Women", "Economy", "Power and connections", "School and health", "Know your states"]
# The publishers named on the "tables" scene: every one is a source of a built Short.
TABLES = ["RBI Handbook of Statistics on Indian States", "Agriculture Ministry", "National Family Health Survey (NFHS-6)",
          "Dept of Telecommunications", "Lok Sabha answers", "Periodic Labour Force Survey", "Central Electricity Authority"]


def stop(msg):
    raise SystemExit(f"intro: {msg}")


def findings():
    """The two findings, as the built Shorts state them. Every spoken claim is checked against those figures."""
    sh = json.load(open(f"{ROOT}/public/datayt/beats/sh01/data.json"))
    px = json.load(open(f"{ROOT}/public/datayt/beats/px01/data.json"))
    up = sh["grid"]["parts"][0]
    if up["name"] != "Uttar Pradesh" or not 45 <= up["v"] < 50:
        stop(f"sh01 no longer carries 'nearly half': {up}")
    if any(p["v"] >= up["v"] for p in sh["grid"]["parts"][1:]):
        stop("sh01: Uttar Pradesh is not the largest part")
    facts = [b for b in px["beats"] if b["kind"] == "fact"]
    inc = next((b for b in facts if b["name"] == "Bihar" and "lowest" in b["text"].lower()), None)
    g5 = next((b for b in facts if b["name"] == "Bihar" and "5G" in b["text"]), None)
    if not inc or not g5:
        stop("px01: Bihar's income or 5G card not found")
    if round(float(g5["big"].rstrip("%"))) != 96:
        stop(f"px01: 5G share is {g5['big']}, the line says ninety-six of a hundred")
    return {
        "up": {"name": "Uttar Pradesh", "big": f"{up['label']}%", "text": "of India's sugarcane, 2024-25",
               "source": "Source: Ministry of Agriculture and Farmers' Welfare, sugarcane production 2024-25, as published in the "
                         "RBI Handbook of Statistics on Indian States (Table 65)."},
        "bihar": {"name": "Bihar", "big": g5["big"], "text": "of villages brought under 5G services", "income": inc["big"],
                  "source": f"Income: {inc['big']} a year, per-capita net state domestic product, current prices, 2024-25, the lowest of the "
                            "25 states and UTs with data (RBI Handbook). 5G: Dept of Telecommunications, Lok Sabha Starred Q. 470, "
                            f"{g5['sub']}, as on 28 Feb 2026."},
    }


def voice_all(lines):
    """Voice every line: the English ones first, then the Tamil ones set level with them. Returns [(file, seconds)]."""
    if CHECK:
        return [("", round(len((l["says"] if isinstance(l, dict) else l).split()) / 2.6 + 0.4, 3)) for l in lines]
    import voice_dk as V
    done = {n: V.say(l, f"{OUT}/vo_{n:02d}") for n, l in enumerate(lines) if not isinstance(l, dict)}
    level = statistics.median(V.voiced_rms(V.pcm(f"{OUT}/{f}")) for f, _ in done.values())
    for n, l in enumerate(lines):
        if isinstance(l, dict):
            done[n] = V.say_tamil(l["ta"], f"{OUT}/vo_{n:02d}", match=level)
            print(f"  Tamil voice ({V.TAMIL_SPEAKER}) for \"{l['says']}\": {done[n][1]} s; speech-to-text hears: {V.hear_tamil(f'{OUT}/{done[n][0]}')}")
    return [done[n] for n in range(len(lines))]


def main():
    f = findings()
    os.makedirs(OUT, exist_ok=True)
    lines = [l for _, ls in SCENES for l in ls]
    name = next(l["says"] for l in lines if isinstance(l, dict)).rstrip(".").split()[-1].lower()
    if any(name in l.lower() for l in lines if not isinstance(l, dict)):
        stop(f"an English line says '{name}': the Tamil voice must say it")
    said = voice_all(lines)
    scenes, vo, t, n = [], [], 0.0, 0
    for kind, ls in SCENES:
        at, cues = t + LEAD, []
        for l in ls:
            file, sec = said[n]
            cues.append(round(at, 3))
            vo.append({"file": file, "at": round(at, 3), "sec": sec, "text": l["says"] if isinstance(l, dict) else l})
            at += sec + GAP
            n += 1
        need = at - GAP + TAIL - t + (M.BEAT * 3 if kind == "end" else 0)      # the end card holds three beats longer
        t1 = t + math.ceil(need / M.BEAT) * M.BEAT
        scenes.append({"kind": kind, "t0": round(t, 3), "t1": round(t1, 3), "cues": cues})
        t = t1
    total = round(t, 3)
    if total > MAX_S:
        stop(f"{total:.1f} s is over the {MAX_S:.0f} s limit")
    print(f"intro: {len(scenes)} scenes · {total:.1f} s · " + ("estimated, no voice" if CHECK else "voice minimax + sarvam"))
    for s in scenes:
        print(f"  {s['kind']:8s} {s['t0']:6.2f} to {s['t1']:6.2f}")
    if CHECK:
        return
    import voice_dk as V
    out = {"id": "intro", "total": total, "fps": FPS, "beat": M.BEAT, "scenes": scenes, "vo": vo, **f, "themes": THEMES, "tables": TABLES,
           "voiceEngine": V.ENGINE, "voice": V.VOICE, "tamilVoice": f"sarvam {V.TAMIL_SPEAKER}"}
    json.dump(out, open(f"{OUT}/data.json", "w"), indent=1, ensure_ascii=False)
    t0 = {s["kind"]: s["t0"] for s in scenes}
    cue = {s["kind"]: s["cues"] for s in scenes}
    M.make(f"{OUT}/music.wav", total, seed=17, hits=[cue["tease"][1], cue["logo"][1], t0["end"]],
           ticks=[s["t0"] for s in scenes], drop=(t0["logo"] - M.BEAT * 2, t0["logo"]))


if __name__ == "__main__":
    main()
