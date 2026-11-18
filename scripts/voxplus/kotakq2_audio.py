#!/usr/bin/env python3
"""kotakq2 audio (24 Oct 2026, copy of swiggyq2_audio.py). AK's pause fix (18 Oct) applied BEFORE any render, same logic as a01v4_tighten.py:
  1. each MiniMax beat file vo/<k>.mp3 -> loudness-normalised vo/<k>_n.wav (-16 LUFS, TP -1.5, 44.1 kHz mono);
  2. pause fix -> vo/<k>_t.wav: lead/trail silence trimmed to 0.10 s; every in-beat pause over 0.42 s (silencedetect -35 dB)
     cut to 0.36 s (0.18 s kept each side, 5 ms fades);
  3. word timings on the fixed files (mlx-whisper large-v3-turbo, prompt = the script text) -> vo/words.json;
  4. film timing: 0.22 s composition gap between beats (= 0.42 s of silence with the 0.10 s ends), 0.90 s (= about 1.1 s)
     before the chapter beats w01 v01 m01 k01 i01 b01 e01; 0.35 s lead-in; 5.0 s end card -> src/voxplus/KotakTiming.ts + vo/timeline.json.
Run with ~/jev_full/.stt-venv/bin/python (numpy + mlx_whisper). Pass --no-words to skip whisper (timing from old words)."""
import json, pathlib, re, subprocess, sys, wave
import numpy as np
R = pathlib.Path("/Volumes/DarwinSSD/MMVideo"); V = R / "public/voxplus/kotakq2/vo"; FF = "/Volumes/DarwinSSD/vendor/bin/ffmpeg"
B = json.load(open(V / "voiced.json")); ORDER = [b["key"] for b in B]; SAY = {b["key"]: b["say"] for b in B}
CHAP = {"f01", "s01", "m01", "k01", "p01", "n01", "b01", "e01"}
KEEP_END, MAXP, KEEPP, GAP, CGAP, LEAD, TAIL = 0.10, 0.42, 0.36, 0.22, 0.90, 0.35, 5.0


def sil(p, d=0.1):
    e = subprocess.run([FF, "-hide_banner", "-i", str(p), "-af", f"silencedetect=n=-35dB:d={d}", "-f", "null", "-"], capture_output=True, text=True).stderr
    return list(zip([float(x) for x in re.findall(r"silence_start: ([\d.]+)", e)], [float(x) for x in re.findall(r"silence_end: ([\d.]+)", e)]))


def read(p):
    with wave.open(str(p)) as w:
        return w.getframerate(), np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32)


def write(p, sr, x):
    with wave.open(str(p), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(np.clip(x, -32768, 32767).astype(np.int16).tobytes())


dur, rep = {}, {}
for k in ORDER:
    n = V / f"{k}_n.wav"
    if not n.exists() or n.stat().st_mtime < (V / f"{k}.mp3").stat().st_mtime:
        subprocess.run([FF, "-v", "error", "-y", "-i", str(V / f"{k}.mp3"), "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "44100", "-ac", "1", str(n)], check=True)
    sr, x = read(n); d = len(x) / sr; s = sil(n)
    first = s[0][1] if s and s[0][0] < 0.02 else 0.0
    last = s[-1][0] if s and s[-1][1] > d - 0.05 else d
    a0, a1 = max(0.0, first - KEEP_END), min(d, last + KEEP_END)
    cuts = [(a + KEEPP / 2, z - KEEPP / 2) for a, z in s if a > a0 + 0.01 and z < a1 - 0.01 and z - a > MAXP]
    keep, t = [], a0
    for c0, c1 in cuts:
        keep.append((t, c0)); t = c1
    keep.append((t, a1)); parts = []; fade = int(0.005 * sr)
    for k0, k1 in keep:
        y = x[int(round(k0 * sr)): int(round(k1 * sr))].copy()
        if len(y) > 2 * fade:
            y[:fade] *= np.linspace(0, 1, fade); y[-fade:] *= np.linspace(1, 0, fade)
        parts.append(y)
    y = np.concatenate(parts); write(V / f"{k}_t.wav", sr, y); dur[k] = round(len(y) / sr, 3)
    rep[k] = {"raw": round(d, 2), "fixed": dur[k], "lead_cut": round(a0, 2), "tail_cut": round(d - a1, 2),
              "pauses_cut": [[round(c0 - KEEPP / 2, 2), round(c1 + KEEPP / 2, 2)] for c0, c1 in cuts]}
(V / "pausefix_report.json").write_text(json.dumps(rep, indent=1))

wp = V / "words.json"; WD = json.loads(wp.read_text()) if wp.exists() else {}
if "--no-words" not in sys.argv:
    import mlx_whisper
    for k in ORDER:
        if WD.get(k) and WD.get("_src_" + k) == SAY[k] + str(dur[k]):
            continue
        sr, x = read(V / f"{k}_t.wav")
        a = x / 32768.0
        if sr != 16000:
            n16 = int(len(a) * 16000 / sr); a = np.interp(np.linspace(0, len(a) - 1, n16), np.arange(len(a)), a)
        want = len(SAY[k].split())
        for opts in ({"initial_prompt": SAY[k]}, {"condition_on_previous_text": False}, {"initial_prompt": SAY[k], "condition_on_previous_text": False, "temperature": 0.2}):
            r = mlx_whisper.transcribe(a.astype(np.float32), path_or_hf_repo="mlx-community/whisper-large-v3-turbo", word_timestamps=True, language="en", **opts)
            WD[k] = [[w["word"].strip(), round(w["start"], 3), round(w["end"], 3)] for sg in r["segments"] for w in sg.get("words", [])]
            if abs(len(WD[k]) - want) <= 2: break   # whisper sometimes drops a sentence; retry with other decoding options
        if abs(len(WD[k]) - want) > 2:   # still short: split at the in-beat pause nearest the middle and transcribe each half
            mid = len(a) / 16000 / 2; ps = [(x + y) / 2 for x, y in sil(V / f"{k}_t.wav", 0.2)] or [mid]
            cut = min(ps, key=lambda t: abs(t - mid)); n = int(cut * 16000); WD[k] = []
            for off, seg in ((0.0, a[:n]), (cut, a[n:])):
                r = mlx_whisper.transcribe(seg.astype(np.float32), path_or_hf_repo="mlx-community/whisper-large-v3-turbo", word_timestamps=True, language="en", initial_prompt=SAY[k])
                WD[k] += [[w["word"].strip(), round(w["start"] + off, 3), round(w["end"] + off, 3)] for sg in r["segments"] for w in sg.get("words", [])]
        WD["_src_" + k] = SAY[k] + str(dur[k]); print("words", k, len(WD[k]), flush=True)
        wp.write_text(json.dumps(WD))
start, t = {}, LEAD
for i, k in enumerate(ORDER):
    if i:
        t += CGAP if k in CHAP else GAP
    start[k] = round(t, 3); t = start[k] + dur[k]
total = round(t + TAIL, 3)
(V / "timeline.json").write_text(json.dumps({"start": start, "dur": dur, "order": ORDER, "total": total}, indent=1))
js = lambda o: json.dumps(o, ensure_ascii=False, separators=(",", ":"))
(R / "src/voxplus/KotakTiming.ts").write_text(
    "// generated by scripts/voxplus/kotakq2_audio.py (pause fix + word timings, 24 Oct 2026): do not edit by hand.\n"
    f"export const FILM_TOTAL_S = {total};\nexport const ORDER: string[] = {js(ORDER)};\nexport const BEAT: Record<string, number> = {js(start)};\n"
    f"export const DUR: Record<string, number> = {js(dur)};\nexport const SAY: Record<string, string> = {js(SAY)};\n"
    f"export const WORDS: Record<string, [string, number, number][]> = {js({k: WD.get(k, []) for k in ORDER})};\n")
print("film", f"{int(total // 60)}:{total % 60:04.1f}", "raw voice", round(sum(r["raw"] for r in rep.values()), 1), "fixed", round(sum(dur.values()), 1))
