"""India Ledger Episode 2: fit every video clip to its beat and write index.html from videos/_src/il-gold-ep2.html.

usage: il_v3_page.py            (re-run after the voice or the clip table changes)
Clips longer than their slot are trimmed; shorter ones are played forward then backward (a boomerang) until they fill it.
Character clips are flagged so the page shows the ILLUSTRATION label while they are on screen."""
import json, subprocess
from pathlib import Path

P = Path("/Volumes/DarwinSSD/MMVideo/hyperframes/videos/il-gold-ep2")
A = P / "assets"
FF = "/opt/homebrew/bin/ffmpeg"
FP = "/opt/homebrew/bin/ffprobe"
s = (P / "act.js").read_text()
ACT = json.loads(s[s.index("{"): s.rindex("}") + 1])
BEATS = ACT["beats"]
IDS = [b["id"] for b in BEATS]
T0 = {b["id"]: b["t0"] for b in BEATS}
TAIL = 3.5   # seconds the end card holds after the voice ends (the mux pads the audio)


def nxt(i):
    k = IDS.index(i)
    return BEATS[k + 1]["t0"] if k + 1 < len(BEATS) else ACT["dur"]


CUT = "position:absolute;width:{w}px;height:{h}px;left:{x}px;top:{y}px;object-fit:contain"
PR = "position:absolute;width:{w}px;height:{h}px;left:{x}px;top:{y}px;object-fit:cover;transform:rotate({r}deg)"
# id, source, kind (cut = see-through character, print = framed clip, full = full-bleed footage), from beat, to beat,
# style, character?, media start
CLIPS = [
    ("k_gold1", "vid/gold_liquid.mp4", "full", "s1_cheap", "s1_up", {}, False, 0.0),
    ("k_gold2", "vid/gold_liquid.mp4", "full", "s9_idea", "s9_harder", {}, False, 8.0),
]


def dur_of(f):
    return float(subprocess.run([FP, "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(f)],
                                capture_output=True, text=True).stdout.strip())


def fit(src, dst, need, alpha, ms):
    """trim or boomerang src to `need` seconds, from media start ms; rewrite only when missing or stale."""
    if dst.exists() and dst.stat().st_mtime > src.stat().st_mtime and abs(dur_of(dst) - need) < 0.1:
        return
    dec = ["-c:v", "libvpx-vp9"] if alpha else []
    enc = (["-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "2500k", "-auto-alt-ref", "0"] if alpha
           else ["-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "-preset", "medium"])
    have = dur_of(src) - ms
    if have >= need:
        subprocess.run([FF, "-v", "error", "-y", *dec, "-ss", str(ms), "-i", str(src), "-t", f"{need:.3f}", "-an", "-r", "30", *enc, str(dst)], check=True)
        return
    pp = dst.with_name(dst.stem + "_pp" + dst.suffix)
    subprocess.run([FF, "-v", "error", "-y", *dec, "-i", str(src), "-filter_complex",
                    "[0:v]fps=30,split[a][b];[b]reverse,trim=start_frame=1[r];[a][r]concat=n=2:v=1[o]", "-map", "[o]", "-an", *enc, str(pp)], check=True)
    subprocess.run([FF, "-v", "error", "-y", "-stream_loop", "-1", *dec, "-i", str(pp), "-t", f"{need:.3f}", "-an", "-r", "30", *enc, str(dst)], check=True)
    pp.unlink()


tags, meta = [], []
(A / "fit").mkdir(exist_ok=True)
for k, (cid, src, kind, b0, b1, st, ch, ms) in enumerate(CLIPS, 1):
    t0 = max(0.0, T0[b0] - (0.6 if b0 == "s1_cheap" else 0.15))
    if b0 == "s1_cheap":
        t0 = 0.0
    t1 = T0[b1] + 0.1
    need = round(t1 - t0, 3)
    srcp = A / src
    dst = A / "fit" / (cid + srcp.suffix)
    fit(srcp, dst, need, srcp.suffix == ".webm", ms)
    if kind == "full":
        style = "position:absolute;left:0;top:0;width:1920px;height:1080px;object-fit:cover"
        cls = "clip vfull"
    elif kind == "cut":
        style = CUT.format(**st)
        cls = "clip vcut"
    else:
        style = PR.format(**st)
        cls = "clip vprint"
    tags.append(f'      <video id="{cid}" class="{cls}" src="assets/fit/{dst.name}" data-start="{t0:.3f}" data-duration="{need:.3f}" '
                f'data-track-index="{k}" muted playsinline style="{style}"></video>')
    meta.append({"id": cid, "s": round(t0, 3), "d": need, "ch": ch, "kind": kind})
    print(f"{cid:9s} {t0:7.2f} +{need:5.2f}  {dst.name}")

html = (P.parent / "_src" / "il-gold-ep2.html").read_text()
html = html.replace("<!--MEDIA-->", "\n".join(tags)).replace("/*CLIPS*/", "window.CLIPS = " + json.dumps(meta) + ";")
html = html.replace("__DUR__", f"{ACT['dur'] + TAIL:.2f}")
(P / "index.html").write_text(html)
print("index.html written,", len(tags), "clips, duration", round(ACT["dur"] + TAIL, 2))
