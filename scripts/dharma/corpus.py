#!/usr/bin/env python3
"""Scripture corpus for the dharma channel: fetch public-domain texts into sources/ (not in git) and look verses up.

  python3 scripts/dharma/corpus.py fetch              # download the Gita dataset into sources/scripture/, write the manifest
  python3 scripts/dharma/corpus.py verify             # sha256 of every file against scripts/dharma/corpus_manifest.json
  python3 scripts/dharma/corpus.py verse 2.47         # Sanskrit, transliteration, the quotable English translations
  python3 scripts/dharma/corpus.py verse 2.47 --all   # plus the reference-only translations (never quoted on screen)
  python3 scripts/dharma/corpus.py chapter 2          # chapter name and summary

From a build script:  from corpus import ref;  ref("gita:2.47")  ->  {"sa", "tr", "en", "src", "author"}

Source: the Bhagavad Gita JSON dataset at github.com/gita/gita (Unlicense). The compilation is public domain; each
translation keeps its own status, so only the two below go on screen. CAUTION (21 Oct 2026): the dataset's English is an
edited, modernised copy of the old translations (some verses even start "Revised:"; "thy" has become "your"), so the source
line reads "AFTER <translator> (EDITED TEXT)" until the original 1935 and 1949 wordings are obtained and checked. The Sanskrit
and the transliteration are the verbatim part. Word meanings are in the data too (`verse 2.47`).
Project Gutenberg, sacred-texts and archive.org are not reachable from the cloud session's proxy: drop Arnold's
"The Song Celestial" (Gutenberg #2388), Ganguli's Mahabharata and Max Muller's Upanishads into sources/scripture/
by hand and add them to SOURCES when needed."""
import argparse, datetime, hashlib, json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
SRC = ROOT / "sources" / "scripture"
MANIFEST = pathlib.Path(__file__).resolve().parent / "corpus_manifest.json"

SOURCES = {
    "gita-json": {
        "base": "https://raw.githubusercontent.com/gita/gita/main/",
        "files": ["LICENSE", "data/verse.json", "data/translation.json", "data/chapters.json", "data/authors.json"],
        "licence": "Unlicense (public domain dedication) for the dataset; translations keep their own copyright status",
    },
}
# author_id -> (name, year, why it may be quoted on screen)
QUOTABLE = {
    21: ("Shri Purohit Swami", 1935, "public domain: author died 1941 (India life+60), first published 1935"),
    16: ("Swami Sivananda", 1949, "public domain in India since 1 Jan 2024 (author died 1963); may still be protected elsewhere, so quote briefly with attribution"),
}
REFERENCE_ONLY = {1: "Swami Ramsukhdas (Gita Press, Hindi; copyrighted)", 17: "Swami Tejomayananda (Chinmaya, Hindi; copyrighted)",
                  18: "Swami Adidevananda (Ramakrishna Math; copyrighted)", 19: "Swami Gambirananda (Advaita Ashrama; copyrighted)",
                  20: "Dr. S. Sankaranarayan (copyrighted)"}
DEFAULT_AUTHOR = 21
_cache: dict = {}


def sha256(p: pathlib.Path) -> str:
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""): h.update(chunk)
    return h.hexdigest()


def fetch():
    import requests
    man = {"fetched": datetime.date.today().isoformat(), "sources": {}}
    for key, s in SOURCES.items():
        d = SRC / key; d.mkdir(parents=True, exist_ok=True); entries = []
        for rel in s["files"]:
            out = d / pathlib.Path(rel).name
            r = requests.get(s["base"] + rel, timeout=120); r.raise_for_status()
            out.write_bytes(r.content)
            entries.append({"file": rel, "local": str(out.relative_to(ROOT)), "bytes": len(r.content), "sha256": sha256(out)})
            print(f"  {rel:28s} {len(r.content):>10,d} bytes")
        man["sources"][key] = {"base": s["base"], "licence": s["licence"], "files": entries,
                               "quotable": {str(k): {"name": v[0], "year": v[1], "status": v[2]} for k, v in QUOTABLE.items()},
                               "reference_only": {str(k): v for k, v in REFERENCE_ONLY.items()}}
    MANIFEST.write_text(json.dumps(man, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    print("manifest", MANIFEST.relative_to(ROOT))


def verify() -> bool:
    man = json.loads(MANIFEST.read_text(encoding="utf-8")); ok = True
    for key, s in man["sources"].items():
        for e in s["files"]:
            p = ROOT / e["local"]
            if not p.exists(): print("MISSING", e["local"]); ok = False; continue
            good = sha256(p) == e["sha256"]; ok &= good
            print("ok     " if good else "CHANGED", e["local"])
    return ok


def _load():
    if _cache: return _cache
    d = SRC / "gita-json"
    if not (d / "verse.json").exists():
        sys.exit("corpus not fetched: run  python3 scripts/dharma/corpus.py fetch")
    verses = json.loads((d / "verse.json").read_text(encoding="utf-8"))
    trans = json.loads((d / "translation.json").read_text(encoding="utf-8"))
    chapters = json.loads((d / "chapters.json").read_text(encoding="utf-8"))
    _cache["verse"] = {(v["chapter_number"], v["verse_number"]): v for v in verses}
    by_id = {v["id"]: (v["chapter_number"], v["verse_number"]) for v in verses}
    t: dict = {}
    for x in trans: t.setdefault(by_id[x["verse_id"]], {})[x["author_id"]] = x
    _cache["trans"] = t
    _cache["chapters"] = {c["chapter_number"]: c for c in chapters}
    return _cache


def clean(text: str) -> str:
    """Strip the dataset's verse markers ("।।2.47।।", "2.47") and collapse whitespace."""
    text = re.sub(r"।।\s*\d+\.\d+\s*।।", " ", text)
    text = re.sub(r"^\s*\d+\.\d+\s*", "", text)
    text = re.sub(r"^\s*Revised:\s*", "", text)   # the dataset marks some edited verses this way
    return re.sub(r"\s+", " ", text).strip()


def parse(refstr: str):
    m = re.fullmatch(r"(?:gita:)?\s*(\d+)[.:](\d+)", refstr.strip())
    if not m: raise ValueError(f"bad verse reference: {refstr!r} (want e.g. 2.47 or gita:2.47)")
    return int(m.group(1)), int(m.group(2))


def verse(ch: int, v: int) -> dict:
    return _load()["verse"][(ch, v)]


def translation(ch: int, v: int, author: int = DEFAULT_AUTHOR) -> str:
    return clean(_load()["trans"][(ch, v)][author]["description"])


def ref(refstr: str, author: int = DEFAULT_AUTHOR) -> dict:
    """Everything a `verse` scene needs, from the source files: nothing typed by hand."""
    if author not in QUOTABLE: raise ValueError(f"author {author} is reference-only; quotable: {list(QUOTABLE)}")
    ch, v = parse(refstr); x = verse(ch, v); name, year, _ = QUOTABLE[author]
    sa = re.sub(r"।।\s*\d+\.\d+\s*।।", "", x["text"]).strip()
    sa_lines = [l.strip() for l in sa.split("\n") if l.strip()]
    tr_lines = [l.strip() for l in x["transliteration"].split("\n") if l.strip()]
    return {"sa": sa_lines, "tr": tr_lines, "en": translation(ch, v, author), "author": name,
            "src": f"BHAGAVAD GITA {ch}.{v} · AFTER {name.upper()}, {year} (EDITED TEXT)"}


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("fetch"); sub.add_parser("verify")
    pv = sub.add_parser("verse"); pv.add_argument("ref"); pv.add_argument("--all", action="store_true")
    pc = sub.add_parser("chapter"); pc.add_argument("n", type=int)
    a = ap.parse_args()
    if a.cmd == "fetch": fetch()
    elif a.cmd == "verify": sys.exit(0 if verify() else 1)
    elif a.cmd == "verse":
        ch, v = parse(a.ref); x = verse(ch, v)
        print(f"Bhagavad Gita {ch}.{v}\n"); print(x["text"].strip()); print(); print(x["transliteration"].strip()); print()
        print("word meanings:", x["word_meanings"].strip()); print()
        for aid, (name, year, status) in QUOTABLE.items():
            print(f"[{name}, {year}] ({status})\n  {translation(ch, v, aid)}\n")
        if a.all:
            for aid, name in REFERENCE_ONLY.items():
                t = _load()["trans"][(ch, v)].get(aid)
                if t: print(f"[reference only: {name}]\n  {clean(t['description'])}\n")
    elif a.cmd == "chapter":
        c = _load()["chapters"][a.n]
        print(c.get("name"), "|", c.get("name_meaning") or c.get("name_translated"), "|", c.get("verses_count"), "verses\n")
        print(c.get("chapter_summary") or c.get("summary") or "")


if __name__ == "__main__":
    main()
