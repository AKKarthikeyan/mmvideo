#!/usr/bin/env python3
"""Props for ManuscriptVerse (src/katha/manuscript.tsx), filled from the corpus so no verse is typed by hand (rule 2).

  python3 scripts/katha/verse_props.py gita:6.34 --speaker ARJUNA            # prints the JSON
  python3 scripts/katha/verse_props.py gita:6.34 --speaker ARJUNA --out public/katha/dev/v634.json
  python3 scripts/katha/verse_props.py gita:2.47 --author 16                 # Sivananda instead of Purohit Swami

The translator line is the corpus's own source line after "BOOK N.N · " (e.g. "AFTER SHRI PUROHIT SWAMI, 1935"), with a
parenthesised remark moved to the small note line. Griffith and Ganguli cards (English only) come next: corpus.canto()
returns whole cantos, so their quote is chosen in the script and checked with corpus.find() before it reaches a card."""
import argparse, json, pathlib, re, sys
HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "dharma")); sys.path.insert(0, str(HERE))
from corpus import ref as corpus_ref
from build_film import clean_sa, clean_tr

SPEAKER_SA = {"KRISHNA": "श्रीभगवानुवाच", "ARJUNA": "अर्जुन उवाच", "SANJAYA": "सञ्जय उवाच", "DHRITARASHTRA": "धृतराष्ट्र उवाच"}

def props(r, author=21, speaker=None, hl=()):
    v = corpus_ref(r, author=author)
    book, _, rest = v["src"].partition(" · ")
    m = re.match(r"(.*?)\s*\((.*)\)\s*$", rest)
    translator, note = (m.group(1), m.group(2)) if m else (rest, None)
    num = r.split(":", 1)[1]
    out = {"book": re.sub(r"\s+[\d.]+$", "", book).strip(), "num": num, "sa": clean_sa(v["sa"]), "tr": clean_tr(v["tr"]),
           "en": v["en"], "translator": translator.strip()}
    if note: out["note"] = note.strip()
    if speaker: out["speaker"] = speaker.upper(); out["speakerSa"] = SPEAKER_SA.get(speaker.upper())
    if hl: out["hl"] = list(hl)
    return out

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("ref"); ap.add_argument("--author", type=int, default=21); ap.add_argument("--speaker")
    ap.add_argument("--hl", nargs="*", default=[]); ap.add_argument("--out")
    a = ap.parse_args()
    p = props(a.ref if ":" in a.ref else f"gita:{a.ref}", a.author, a.speaker, a.hl)
    s = json.dumps(p, ensure_ascii=False, indent=1)
    if a.out: pathlib.Path(a.out).parent.mkdir(parents=True, exist_ok=True); pathlib.Path(a.out).write_text(s + "\n"); print(a.out)
    else: print(s)
