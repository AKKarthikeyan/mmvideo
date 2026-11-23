#!/usr/bin/env python3
"""story.js for the key-frame board of mm-asianpaints-dealers, WITHOUT voice (MiniMax window closed, 22 Nov 2026).

Beat times are the director's estimates in TREATMENT.md section 6 (3.1 spoken words a second plus script.json pauses);
the real voice resets them. When the narration is locked, the builder adds this Short to tools/shorts_build.py (S[...])
and lets `shorts_build.py story mm-asianpaints-dealers` overwrite this file with voiced timings.

usage: /usr/bin/python3 hyperframes/shorts/mm-asianpaints-dealers/make_story.py
"""
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
SCRIPT = json.loads((ROOT / "productions" / "mm-asianpaints-dealers" / "script.json").read_text())
GAP = 0.12

# beat windows (s) from TREATMENT.md section 6, and the caption with its accent word (*word*)
TIMES = {"b1": (0.0, 3.7), "b2": (3.7, 7.4), "b3": (7.4, 14.0), "b4": (14.0, 17.3), "b5": (17.3, 22.3),
         "b6": (22.3, 26.2), "b7": (26.2, 31.0), "b8": (31.0, 36.0), "b9": (36.0, 40.7), "b10": (40.7, 44.2)}
CAPS = {"b1": "'One of our *strongest*'", "b2": "Rival: '*invest aggressively*'", "b3": "The *ten biggest*",
        "b4": "*Shop by shop*", "b5": "*50,000+* dealers · Grasim says", "b6": "In a *court judgment*",
        "b7": "*Allegation* only", "b8": "'Merely a *prima facie* opinion'", "b9": "Brand · capacity · *distribution depth*",
        "b10": "The *counter*"}


def em(s):
    out, on = "", False
    for part in s.split("*"):
        out += (f"<em>{part}</em>" if on else part)
        on = not on
    return out


def main():
    beats, caps = [], []
    for b in SCRIPT["beats"]:
        t0, t1 = TIMES[b["key"]]
        sec = round(t1 - t0 - b["pause"] - GAP, 3)
        beats.append(dict(id=b["key"], t0=t0, sec=sec, say=b["say"], claims=b["claims"], source=b["source"],
                          label=b.get("label", "")))
        caps.append(dict(t0=t0, t1=t1, html=em(CAPS[b["key"]])))
    story = dict(id=SCRIPT["id"], channel="Moat & Margin", lang="en-IN", title=SCRIPT["title"], dur=44.2, voiced=False,
                 note="ESTIMATED timings (no voice): TREATMENT.md section 6", beats=beats, caps=caps)
    (HERE / "story.js").write_text("window.STORY = " + json.dumps(story, indent=1, ensure_ascii=False) + ";\n")
    print("story.js:", len(beats), "beats,", story["dur"], "s (estimated)")


if __name__ == "__main__":
    main()
