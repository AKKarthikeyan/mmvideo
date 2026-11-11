"""The engine's contract with every script, in one place: where files live, how long a beat is on screen, how captions are cut.

The frame arithmetic mirrors the players (beatFrames / shortLayout in src/vx/VoxEngine.tsx and CaseEngine.tsx, and the napkin
players in src/hand/). If a player's timing changes, change it here and nowhere else; no other script holds a copy.

    REPO, PUBLIC, OUT        the checkout, its public/ and its out/ (renders and kits, not in git)
    vx(id), napkin(id)       a built video's data.json, a napkin Short's beats.json
    timeline(D, short=None)  [(beat, start_frame, frames)], total_frames    long video, or Short number `short` (from 0)
    napkin_timeline(beats)   the same for a napkin Short; framed_timeline(beats) where data.json stores each beat's frames
    chapters(names, tl)      YouTube chapter list for a timeline
    write_srt(path, tl, ..)  captions for a timeline
    long_captions / loop_captions / napkin_captions     one call per upload-kit caption file
"""
import json, math, pathlib, re

REPO = pathlib.Path(__file__).resolve().parent.parent
PUBLIC = REPO / "public"
OUT = REPO / "out"
FPS = 30
DISC = ("Educational research, not investment advice. Moat & Margin is not a SEBI-registered Research Analyst or Investment "
        "Adviser. No buy/sell recommendations, no price targets.")


def vx(vid):
    return json.load(open(PUBLIC / "vx" / vid / "data.json"))


def napkin(sid):
    return json.load(open(PUBLIC / "hand" / sid / "beats.json"))


# ---------- timelines ----------
def is_title(b):
    return b["scene"]["type"] == "title"


def beat_frames(b):
    """Frames a beat holds in a long video: its narration plus 0.5 s (1.1 s after a title card)."""
    return math.ceil((b["sec"] + (1.1 if is_title(b) else 0.5)) * FPS)


def _lay(beats, frames):
    out, f = [], 0
    for b in beats:
        n = frames(b); out.append((b, f, n)); f += n
    return out, f


def timeline(D, short=None):
    """[(beat, start_frame, frames)], total_frames for the long video, or for Short number `short` (counted from 0).
    A Short's total includes its end card: none on a loop Short, 2 s after a hook Short, 4 s otherwise."""
    if short is None:
        return _lay(D["beats"], beat_frames)
    s = D["shorts"][short]; by = {}
    for b in D["beats"]:
        by.setdefault(b["key"], b)
    gap = 0.12 if s.get("loop") else 0.35
    tl, f = _lay([by[k] for k in s["beats"]], lambda b: math.ceil((b["sec"] + gap) * FPS))
    return tl, f + (0 if s.get("loop") else 2 * FPS if s.get("hook") else 4 * FPS)


def napkin_timeline(beats, gap=0.15):
    """A napkin Short: each line holds for its narration plus 0.15 s."""
    return _lay(beats, lambda b: math.ceil((b["sec"] + gap) * FPS))


def framed_timeline(beats):
    """Fund-letter episodes and the explainer: each beat's frame count is already stored in its data.json."""
    return _lay(beats, lambda b: b["frames"])


def clock(seconds, pad=True):
    """71.4 -> '01:11' (chapter lists) or '1:11' (video lengths, pad=False)."""
    m, s = int(seconds // 60), int(seconds % 60)
    return f"{m:02}:{s:02}" if pad else f"{m}:{s:02}"


def chapters(names, tl, pad=True):
    """YouTube chapter list: one 'mm:ss Name' line for each chapter that has a beat, at its first beat."""
    start = {}
    for b, f, _ in tl:
        start.setdefault(b["ch"], f / FPS)
    return "\n".join(f"{clock(s, pad)} {names[c]}" for c, s in sorted(start.items()))


# ---------- captions ----------
def sentences(text):
    return [p.strip() for p in re.findall(r"[^.!?]+[.!?]*", text) if p.strip()]


def _stamp(s):
    ms = int(round(s * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); sec, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{sec:02},{ms:03}"


def write_srt(path, tl, parts=lambda b: b["cues"], titles=True):
    """Write captions for a timeline. A beat's parts share its narration time in proportion to their length
    (the same rule the on-screen cues follow). titles=False leaves title cards uncaptioned."""
    entries = []
    for b, f, _ in tl:
        if not titles and is_title(b):
            continue
        ps = parts(b); tot = sum(len(p) for p in ps) or 1; acc = 0; a = f / FPS
        for p in ps:
            s = a + b["sec"] * acc / tot; acc += len(p); entries.append((s, a + b["sec"] * acc / tot, p))
    pathlib.Path(path).parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w") as fh:
        for i, (s, e, t) in enumerate(entries, 1):
            fh.write(f"{i}\n{_stamp(s)} --> {_stamp(e)}\n{t}\n\n")


def long_captions(vid, name):
    """out/vx/<name>.srt for a long video. Returns (length 'm:ss', chapter list)."""
    D = vx(vid); tl, total = timeline(D)
    write_srt(OUT / "vx" / f"{name}.srt", tl, titles=False)
    return clock(total / FPS, pad=False), chapters(D["chapters"], tl)


def loop_captions(vid, name, short=0):
    """out/vx/<name>.srt for a loop Short. Returns its length in seconds."""
    tl, total = timeline(vx(vid), short)
    write_srt(OUT / "vx" / f"{name}.srt", tl)
    return total / FPS


def napkin_captions(sid, name, fix=None):
    """out/vx/<name>.srt for a napkin Short, one caption per sentence. `fix` respells the spoken text for reading
    (the voice needs 'T C S'; the caption wants 'TCS'). Returns (length in seconds, beats as captioned)."""
    beats = napkin(sid)
    if fix:
        for b in beats:
            b["text"] = fix(b["text"])
    tl, total = napkin_timeline(beats)
    write_srt(OUT / "vx" / f"{name}.srt", tl, parts=lambda b: sentences(b["text"]))
    return total / FPS, beats


def acronyms(text):
    """'T C S' -> 'TCS': letters spelled out for the voice, joined again for captions."""
    return re.sub(r"\b[A-Z](?: [A-Z])+\b", lambda m: m.group(0).replace(" ", ""), text)
