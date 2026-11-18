#!/usr/bin/env python3
"""eternalq2 QA on the REAL (pause-fixed) audio. Run after eternalq2_audio.py.
  hooks  : every hook in script.md's hook table, timed at the END of its phrase (whisper word times + beat starts);
           rules: first question ends within 5 s; never more than 45 s between hooks.
  pauses : narration-only track (beat files at their starts), silencedetect -35 dB 0.6 s; every silence over 0.7 s listed;
           allowed only at the chapter cards / "But..." (p01 q01 a01 b01 e01) and the end card.
  -> public/voxplus/eternalq2/vo/qa.json; exit 1 on a breach."""
import json, pathlib, re, subprocess, sys
V = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/voxplus/eternalq2/vo"); FF = "/Volumes/DarwinSSD/vendor/bin/ffmpeg"
TL = json.loads((V / "timeline.json").read_text()); WD = json.loads((V / "words.json").read_text())
S, D, ORDER = TL["start"], TL["dur"], TL["order"]
HOOKS = [("c01", "QUESTION", "Why does ninety paise matter"), ("c02", "SURPRISE", "This time it made"), ("c03", "TURN", "Now the strange part"),
 ("c04", "BIG QUESTION", "what part of Blinkit can it not skip"), ("p01", "CHAPTER QUESTION", "where does the money come from"),
 ("p03", "QUESTION", "which business made most of it"), ("p03", "SURPRISE", "Not Blinkit"), ("p05", "TWIST", "Here is a twist"),
 ("p05", "SURPRISE", "More than the profit itself"), ("p06", "QUESTION", "Why"), ("p07", "TURN", "Part of that is a change"),
 ("q01", "CHAPTER QUESTION", "why does ninety paise matter"), ("q04", "QUESTION", "Why would a bigger network earn more"),
 ("q06", "QUESTION", "how fast is it building"), ("q07", "QUESTION", "Will small towns order like big cities"), ("q08", "TURN", "There is a cost"),
 ("q09", "TEASE", "What if a computer does the shopping instead"), ("a02", "QUESTION", "is food shopping a chore"),
 ("a05", "TURN", "an agent can only skip a platform"), ("a06", "TURN", "But a meal delivered within minutes"), ("a07", "TURN", "someone has to fix it"),
 ("a09", "REVEAL", "The verdict"), ("a10", "QUESTION", "where does Eternal say its moat is"), ("b01", "BUT TURN", "But"),
 ("b03", "SURPRISE", "the letter's very first answer"), ("b04", "TURN", "the group's cash balance fell"), ("e01", "CALLBACK", "back to ninety paise"),
 ("e02", "TEASE", "The next checkpoint is March")]
norm = lambda s: re.sub(r"[^a-z0-9 ]+", " ", s.lower().replace("’", "").replace("'", "")).split()
def phrase_end(k, ph):
    ws = WD[k]; flat = []
    for i, w in enumerate(ws):
        for t in norm(w[0]): flat.append((t, i))
    toks = norm(ph)
    for i in range(len(flat) - len(toks) + 1):
        if all(flat[i + j][0] == toks[j] or (j == len(toks) - 1 and flat[i + j][0].startswith(toks[j])) for j in range(len(toks))):
            return ws[flat[i + len(toks) - 1][1]][2]
    return None
rows, bad = [], []
for k, kind, ph in HOOKS:
    e = phrase_end(k, ph)
    if e is None: bad.append(f"hook phrase not found in words: {k} {ph}"); continue
    rows.append((round(S[k] + e, 2), k, kind, ph))
rows.sort(); prev, worst = 0.0, (0, "")
print("HOOKS (real audio)")
for t, k, kind, ph in rows:
    g = t - prev
    if g > worst[0]: worst = (round(g, 1), f"before {k} {ph!r}")
    print(f"  {int(t // 60)}:{t % 60:05.2f}  +{g:5.1f}s  {k:4} {kind:<16} {ph}"); prev = t
fq = next(t for t, k, kind, p in rows if "QUESTION" in kind)
print(f"  first question ends {fq} s; longest gap {worst}; after last hook {TL['total'] - prev:.1f} s (answer + end card)")
if fq > 5: bad.append("first question after 5 s")
if worst[0] > 45: bad.append(f"hook gap over 45 s: {worst}")
# pauses
track = V / "narration_track.wav"; args, filt = [FF, "-v", "error", "-y"], []
for i, k in enumerate(ORDER):
    args += ["-i", str(V / f"{k}_t.wav")]; ms = int(round(S[k] * 1000)); filt.append(f"[{i}:a]adelay={ms}|{ms}[a{i}]")
filt.append("".join(f"[a{i}]" for i in range(len(ORDER))) + f"amix=inputs={len(ORDER)}:normalize=0:dropout_transition=0[m]")
subprocess.run(args + ["-filter_complex", ";".join(filt), "-map", "[m]", "-ar", "44100", "-ac", "1", str(track)], check=True)
e = subprocess.run([FF, "-hide_banner", "-i", str(track), "-af", "silencedetect=n=-35dB:d=0.6", "-f", "null", "-"], capture_output=True, text=True).stderr
st = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", e)]; en = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", e)]
CHAP = {"p01", "q01", "a01", "b01", "e01"}; pz = []
print("SILENCES over 0.7 s (narration only)")
for a, z in zip(st, en):
    L = z - a
    if L <= 0.7: continue
    nxt = next((k for k in ORDER if S[k] >= a - 0.05), None)
    ok = nxt in CHAP
    pz.append({"t": round(a, 2), "len": round(L, 2), "before": nxt, "allowed": ok})
    print(f"  {int(a // 60)}:{a % 60:05.2f}  {L:.2f} s  before {nxt}  {'chapter/But card (allowed)' if ok else 'NOT ALLOWED'}")
    if not ok: bad.append(f"silence {L:.2f} s at {a:.1f} before {nxt}")
inner = sum(1 for p in pz if p["allowed"])
print(f"  allowed: {inner}; narration track {track.name}")
(V / "qa.json").write_text(json.dumps({"hooks": rows, "first_question_s": fq, "longest_gap": worst, "silences": pz, "problems": bad}, indent=1))
print("PROBLEMS:", bad or "none"); sys.exit(1 if bad else 0)
