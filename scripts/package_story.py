#!/usr/bin/env python3
"""Generic upload kit for a Vox "story" long video (generalised from package_dmartstory.py, which stays as it is).
usage: package_story.py <video id> <output prefix> [--meta meta.json] [--force]
Writes <prefix>.srt (captions from the built beats) and <prefix>.youtube.txt (title options, description, chapters,
top 10 with links, sources, pinned comment, hand-off), and prints the length and the chapter list.
Reads: public/vx/<id>/data.json (built timings, cues, chapters) and the entry in scripts/vx_scripts.py (title, spine,
keyword, next_video). Everything the entry does not hold (links, top 10, sources, thumbnails line) comes from --meta, a JSON
file with any of these optional keys; a missing key falls back to a visible [TO FILL] placeholder, never an invented fact:
  header          first line; "{file}" and "{len}" are filled in            title_options  [str, ...]   (A, B, C ...)
  thumbs          one line naming the thumbnail files                        description    [line, ...]  (body paragraphs)
  links           [line, ...] shown after the description (article, digest)  top10_heading str; top10 [[text, url], ...]; top10_footer str
  sources         [line, ...]                                                hashtags       "#MoatMargin #Name"
  pinned          pinned-comment text (without the disclaimer)               holdings       line (default "[AK to fill]")
  next_video      overrides the entry's next_video
Refuses to overwrite an existing file unless --force. Writes only under the prefix you give; it never touches
package_dmartstory.py or any existing kit unless you point the prefix at one."""
import json, math, pathlib, sys
HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from srt_util import srt, split
from vx_scripts import VIDEOS

FPS = 30
DISC = "Educational research, not investment advice. Moat & Margin is not a SEBI-registered Research Analyst or Investment Adviser. No buy/sell recommendations, no price targets."
FILL = "[TO FILL]"


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    meta = {}
    if "--meta" in sys.argv:
        mp = sys.argv[sys.argv.index("--meta") + 1]
        args = [a for a in args if a != mp]
        meta = json.load(open(mp))
    if len(args) != 2:
        sys.exit(__doc__)
    vid, prefix = args[0], pathlib.Path(args[1])
    force = "--force" in sys.argv
    V = next((v for v in VIDEOS if v["id"] == vid), None)
    if V is None:
        sys.exit(f"no video {vid!r} in scripts/vx_scripts.py")
    dj = HERE.parent / "public/vx" / vid / "data.json"
    if not dj.exists():
        sys.exit(f"{dj} missing: run build_vx.py {vid} first")
    D = json.load(open(dj))
    outs = [prefix.with_name(prefix.name + ".srt"), prefix.with_name(prefix.name + ".youtube.txt")]
    if not force and any(o.exists() for o in outs):
        sys.exit("refusing to overwrite: " + ", ".join(str(o) for o in outs if o.exists()) + " (use --force)")
    prefix.parent.mkdir(parents=True, exist_ok=True)

    # captions and chapter starts: the same arithmetic as the engine (a beat lasts its narration plus 0.5 s, 1.1 s for a title card)
    t = 0
    ent = []
    chap = {}
    for b in D["beats"]:
        chap.setdefault(b["ch"], t)
        if b["scene"]["type"] != "title":
            ent += split(b["cap"], t, t + b["sec"], b["cues"])
        t += math.ceil((b["sec"] + (1.1 if b["scene"]["type"] == "title" else 0.5)) * FPS) / FPS
    srt(ent, outs[0])
    chapters = "\n".join(f"{int(s // 60):02}:{int(s % 60):02} {D['chapters'][c]}" for c, s in sorted(chap.items()))
    long_len = f"{int(t // 60)}:{int(t % 60):02}"

    g = meta.get
    kw = "".join(w.capitalize() for w in (V.get("keyword") or "").replace(".", "").split())
    hashtags = g("hashtags", "#MoatMargin" + (" #" + kw if kw else ""))
    letters = "ABCDEFGH"
    L = [g("header", "LONG VIDEO (Vox) · {file} · {len} · 1920x1080").format(file=prefix.name + ".mp4", len=long_len),
         "Title options (A/B test):", *[f"  {letters[i]}. {x}" for i, x in enumerate(g("title_options", [V["title"]]))],
         g("thumbs", "Thumbnails: " + FILL), "",
         "DESCRIPTION:", *g("description", [V.get("spine", FILL), FILL + " one paragraph: what the video finds, in its own words; mark our-arithmetic items"]),
         "", *g("links", ["Full article: " + FILL]), "", "CHAPTERS", chapters, ""]
    top = g("top10", [])
    if top:
        L += [g("top10_heading", "COMPANY ANNOUNCEMENTS")]
        L += [f"{i}. {x} → {u}" for i, (x, u) in enumerate(top, 1)]
        if g("top10_footer"):
            L += [g("top10_footer")]
        L += [""]
    L += ["SOURCES", *g("sources", [FILL + " one line per source: title, date, link"]), "", DISC + "\n" + hashtags, "",
          "PINNED COMMENT: " + g("pinned", FILL + " one question to the viewer") + " " + DISC,
          "Holdings disclosure line: " + g("holdings", "[AK to fill]"),
          "NEXT VIDEO (hand-off): " + g("next_video", V.get("next_video") or FILL)]
    outs[1].write_text("\n".join(L))
    print(long_len)
    print(chapters)
    print("wrote", outs[0], outs[1])


if __name__ == "__main__":
    main()
