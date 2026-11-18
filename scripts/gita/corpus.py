#!/usr/bin/env python3
"""Parse the Bhagavad Gita (sanskritdocuments.org, bhagvadnew.html) into sources/gita/gita.json.
Every verse keyed "ch.v" with its Devanagari lines and an IAST transliteration made by deva2iast() below,
plus the 18 chapter names from the chapter headings. Numbering follows this edition: chapter 13 opens with
Arjuna's question (prakṛtiṃ puruṣaṃ caiva), so its verses run one ahead of Gita Press from 13.2 on.

  python3 -I scripts/gita/corpus.py <path to bhagvadnew.html>
  python3 -I scripts/gita/corpus.py show 2.47 18.66 ...
"""
import html, json, re, sys
from pathlib import Path

OUT = Path(__file__).resolve().parents[2] / "sources" / "gita" / "gita.json"
DIG = str.maketrans("०१२३४५६७८९", "0123456789")

V = {"अ": "a", "आ": "ā", "इ": "i", "ई": "ī", "उ": "u", "ऊ": "ū", "ऋ": "ṛ", "ॠ": "ṝ", "ऌ": "ḷ", "ए": "e", "ऐ": "ai", "ओ": "o", "औ": "au"}
M = {"ा": "ā", "ि": "i", "ी": "ī", "ु": "u", "ू": "ū", "ृ": "ṛ", "ॄ": "ṝ", "ॢ": "ḷ", "े": "e", "ै": "ai", "ो": "o", "ौ": "au"}
C = {"क": "k", "ख": "kh", "ग": "g", "घ": "gh", "ङ": "ṅ", "च": "c", "छ": "ch", "ज": "j", "झ": "jh", "ञ": "ñ",
     "ट": "ṭ", "ठ": "ṭh", "ड": "ḍ", "ढ": "ḍh", "ण": "ṇ", "त": "t", "थ": "th", "द": "d", "ध": "dh", "न": "n",
     "प": "p", "फ": "ph", "ब": "b", "भ": "bh", "म": "m", "य": "y", "र": "r", "ल": "l", "व": "v",
     "श": "ś", "ष": "ṣ", "स": "s", "ह": "h", "ळ": "ḷ"}
OTHER = {"ं": "ṃ", "ः": "ḥ", "ँ": "m̐", "ऽ": "’", "।": "|", "॥": "||", "ॐ": "oṃ"}
VIRAMA = "्"


SPEAKERS = {"धृतराष्ट्र": "Dhritarashtra", "सञ्जय": "Sanjaya", "अर्जुन": "Arjuna", "श्रीभगवान": "Krishna"}


def deva2iast(s: str) -> str:
    s = s.replace("ंऽ", "ऽं")    # source writes तेजोंऽश; IAST is tejo’ṃśa
    s = s.replace("\u200d", "").replace("\u200c", "")    # zero-width joiners (17.7 writes श‍ृणु)
    out = []; i = 0
    while i < len(s):
        ch = s[i]
        if ch in C:
            out.append(C[ch]); nxt = s[i + 1] if i + 1 < len(s) else ""
            if nxt == VIRAMA: i += 2; continue
            if nxt in M: out.append(M[nxt]); i += 2; continue
            out.append("a"); i += 1; continue
        if ch in V: out.append(V[ch])
        elif ch in OTHER: out.append(OTHER[ch])
        elif ch in "०१२३४५६७८९": out.append(ch.translate(DIG))
        else: out.append(ch)
        i += 1
    return "".join(out)


def parse(path):
    t = html.unescape(re.sub(r"<[^>]+>", "\n", open(path, encoding="utf-8").read()))
    verses, names = {}, {}
    # chapter names from the headings ("अथ ...ऽध्यायः । <name>"), else from the colophon ("<name> नाम ...ऽध्यायः ॥ n॥")
    ords = ["प्रथमो", "द्वितीयो", "तृतीयो", "चतुर्थो", "पञ्चमो", "षष्ठो", "सप्तमो", "अष्टमो", "नवमो", "दशमो",
            "एकादशो", "द्वादशो", "त्रयोदशो", "चतुर्दशो", "पञ्चदशो", "षोडशो", "सप्तदशो", "अष्टादशो"]
    for n, o in enumerate(ords, 1):
        m = re.search(r"अथ\s+" + o + r"ऽध्यायः\s*।\s*(\S+)", t) or (
            n == 11 and re.search(r"अथैकादशोऽध्यायः\s*।\s*(\S+)", t))   # sandhi: atha + ekādaśo
        if m: names[n] = m.group(1)
    for m in re.finditer(r"(\S+)\s+नाम\s+\S+ऽध्यायः\s*॥\s*([०-९]+)\s*॥", t):
        n = int(m.group(2).translate(DIG)); names.setdefault(n, re.sub("ो$", "ः", m.group(1)))
    blocks = re.split(r"\n\s*\n", t); speaker = None
    for b in blocks:
        for ln in b.split("\n"):
            if ("उवाच" in ln or "भगवानुवाच" in ln) and "॥" not in ln:    # "सञ्जय उवाच ।"; "श्रीभगवानुवाच ।" has the vowel sign ु, not उ
                speaker = next((v for k, v in SPEAKERS.items() if k in ln), ln.strip())
        m = re.search(r"॥\s*([०-९]+)-([०-९]+)\s*॥\s*(?:\(([^)]*)\))?\s*$", b.strip())   # (…) = a variant reading
        if not m: continue
        key = f"{int(m.group(1).translate(DIG))}.{int(m.group(2).translate(DIG))}"
        body = b.strip()[: m.start(3) - 1].rstrip() if m.group(3) else b.strip()
        lines = [ln.strip() for ln in body.split("\n") if ln.strip() and not (("उवाच" in ln or "भगवानुवाच" in ln) and "॥" not in ln)]
        verses[key] = {"deva": lines, "iast": [deva2iast(ln) for ln in lines], "speaker": speaker}
        if m.group(3): verses[key]["variant"] = {"deva": m.group(3), "iast": deva2iast(m.group(3))}
    return verses, names


if __name__ == "__main__":
    if sys.argv[1] == "show":
        d = json.load(open(OUT))
        for k in sys.argv[2:]:
            v = d["verses"][k]; print(f"--- {k}  ({v['speaker']})"); print("\n".join(v["deva"])); print("\n".join(v["iast"]))
        sys.exit()
    verses, names = parse(sys.argv[1])
    OUT.parent.mkdir(parents=True, exist_ok=True)
    json.dump({"source": "https://sanskritdocuments.org/doc_giitaa/bhagvadnew.html", "verses": verses,
               "chapter_names": {k: {"deva": v, "iast": deva2iast(v)} for k, v in sorted(names.items())}},
              open(OUT, "w"), ensure_ascii=False, indent=1)
    per = {}
    for k in verses: per[int(k.split(".")[0])] = per.get(int(k.split(".")[0]), 0) + 1
    print(len(verses), "verses;", "per chapter", [per.get(c, 0) for c in range(1, 19)]); print(len(names), "chapter names")
