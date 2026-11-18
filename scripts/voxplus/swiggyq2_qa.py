#!/usr/bin/env python3
"""swiggyq2 QA on the REAL (pause-fixed) audio. Run after swiggyq2_audio.py.
  hooks  : every hook in script.md's hook table, timed at the END of its phrase (whisper word times + beat starts);
           rules: first question ends within 5 s; never more than 45 s between hooks.
  pauses : narration-only track (beat files at their starts), silencedetect -35 dB 0.6 s; every silence over 0.7 s listed;
           allowed only at the chapter cards / "But..." (f01 q01 k01 b01 e01) and the end card.
  -> public/voxplus/swiggyq2/vo/qa.json; exit 1 on a breach."""
import json, pathlib, re, subprocess, sys
V = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/voxplus/swiggyq2/vo"); FF = "/Volumes/DarwinSSD/vendor/bin/ffmpeg"
TL = json.loads((V / "timeline.json").read_text()); WD = json.loads((V / "words.json").read_text())
S, D, ORDER = TL["start"], TL["dur"], TL["order"]
HOOKS = [("c01", "QUESTION", "What does a nine rupee store cost"), ("c02", "TURN", "The letter gives no price for it"), ("c03", "TURN", "Now the other half"),
 ("c04", "BIG QUESTION", "what does Swiggy say it needs before the losses stop"), ("f01", "CHAPTER", "First the part"),
 ("f03", "QUESTION", "Why did it rise"), ("f05", "QUESTION", "So is the whole company in profit"), ("f05", "SURPRISE", "No"),
 ("q01", "CHAPTER QUESTION", "what did the loss buy"), ("q02", "TURN", "So it sped up"), ("q03", "QUESTION", "Did users stay"),
 ("q05", "QUESTION", "So what did it cost"), ("q06", "CALLBACK", "nine rupee store"), ("q08", "QUESTION", "And the loss"), ("q08", "TWIST", "Here is the twist"),
 ("k01", "CHAPTER QUESTION", "So when do the losses stop"), ("k02", "REVEAL", "And it spells out what break even"), ("k04", "SURPRISE", "Today by our arithmetic"),
 ("k05", "QUESTION", "Where would that money come from"), ("k06", "TURN", "And a rule change"), ("b01", "BUT TURN", "But"),
 ("b02b", "TURN", "The letter also expects contribution"), ("b03", "SURPRISE", "A rival is much larger"), ("b04", "TURN", "Meanwhile"),
 ("b06", "TURN", "a choice can be reversed"), ("e01", "CALLBACK", "back to the nine rupee store"), ("e02", "TEASE", "The first checkpoint is the December quarter")]
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
CHAP = {"f01", "q01", "k01", "b01", "e01"}; pz = []
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
