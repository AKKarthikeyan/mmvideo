# Word timings for the Jio moat Shorts, aligned to the SCRIPT (20 Oct 2026): unprompted mlx-whisper gives the times
# (the prompted pass dropped/invented words), difflib maps them onto the script tokens, so captions show exactly what is said.
import json, re, subprocess, wave, difflib, numpy as np, mlx_whisper
VO = "/Volumes/DarwinSSD/MMVideo/public/voxplus/scale/shorts/vo/"; FF = "/tmp/ffbin/ffmpeg"
B = {b["key"]: b for b in json.load(open(VO + "beats.json"))}
n = lambda s: re.sub(r"[^a-z0-9]+", "", s.lower().replace("’", "").replace("\x27", ""))
out = {}
for k, b in B.items():
    wav = "/tmp/al_" + k + ".wav"; subprocess.run([FF, "-v", "error", "-y", "-i", VO + k + ".mp3", "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", wav], check=True)
    w = wave.open(wav); a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    r = mlx_whisper.transcribe(a, path_or_hf_repo="mlx-community/whisper-large-v3-turbo", language="en", word_timestamps=True)
    ws = [(x["word"].strip(), x["start"], x["end"]) for s in r["segments"] for x in s.get("words", [])]
    say = b["say"].split()
    res = [None] * len(say)
    sm = difflib.SequenceMatcher(a=[n(x[0]) for x in ws], b=[n(x) for x in say], autojunk=False)
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        if j2 == j1: continue
        if op == "equal":
            for d in range(j2 - j1): res[j1 + d] = (say[j1 + d], ws[i1 + d][1], ws[i1 + d][2])
        elif i2 > i1:   # replace: spread the script words over the heard span by character length
            t0, t1 = ws[i1][1], ws[i2 - 1][2]; L = [max(1, len(x)) for x in say[j1:j2]]; c = 0
            for d, l in enumerate(L):
                res[j1 + d] = (say[j1 + d], t0 + (t1 - t0) * c / sum(L), t0 + (t1 - t0) * (c + l) / sum(L)); c += l
    for j in range(len(say)):   # pure inserts: interpolate between neighbours
        if res[j] is None:
            p = next((res[i][2] for i in range(j - 1, -1, -1) if res[i]), 0.0); q = next((res[i][1] for i in range(j + 1, len(say)) if res[i]), b["sec"])
            res[j] = (say[j], p, max(p + 0.05, (p + q) / 2))
    out[k] = [[t, round(s, 3), round(e, 3)] for t, s, e in res]
    print(k, len(say), "script words; last:", out[k][-3:])
json.dump(out, open(VO + "words.json", "w"), indent=0)
