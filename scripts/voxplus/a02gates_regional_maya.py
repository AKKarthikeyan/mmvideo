#!/usr/bin/env python3
"""a02gates regional audio, Tamil + Telugu with Maya-2-Native (community MLX 8-bit port aruntemme/maya2-native-mlx-8bit, voice Siddhant,
AK's 29 Oct blind-test pick), run locally with mlx-audio. Run with the voices-research venv's python (read only, nothing written there):
  /Volumes/DarwinSSD/DataKadai/research/2026-10-28-voices/work/mayavenv/bin/python scripts/voxplus/a02gates_regional_maya.py LANG [KEY ...]
Writes public/voxplus/a02gates/regional/<lang>/<k>_g.wav (24 kHz mono) + fit_raw.json; the mix is a02gates_regional_mix.py.
Same call as the blind test (named voice, default sampling); text = the beat's tts field (figures already in words)."""
import json, os, pathlib, sys, time, wave
import numpy as np
P = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/voxplus/a02gates"); SR = 24000
MODEL, VOICE = "aruntemme/maya2-native-mlx-8bit", "Siddhant"


def write(p, a):
    a = np.clip(np.asarray(a, dtype=np.float64).reshape(-1), -1, 1)
    with wave.open(str(p), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((a * 32767).astype(np.int16).tobytes())


if __name__ == "__main__":
    lang = sys.argv[1]; only = sys.argv[2:]
    from mlx_audio.tts.utils import load
    t0 = time.time(); model = load(MODEL); print("model loaded", round(time.time() - t0, 1), "s", flush=True)
    T = json.load(open(P / f"regional/a02gates.{lang}.json")); TL = json.load(open(P / "vo/timeline.json"))
    o = P / f"regional/{lang}"; o.mkdir(parents=True, exist_ok=True)
    fp = o / "fit_raw.json"; rep = json.loads(fp.read_text()) if fp.exists() else {}
    for k in (only or TL["order"]):
        f = o / f"{k}_g.wav"; src = T[k]["tts"]
        if not only and f.exists() and rep.get(k, {}).get("tts") == src and rep[k].get("engine") == MODEL:
            continue
        # A02_TAKES=n: n takes, keep the shortest whose seconds-per-character is at least 0.85x this language's median (guards against a take that skipped words)
        rates = sorted(v["raw"] / len(v["tts"]) for v in rep.values() if v.get("tts")); med = rates[len(rates) // 2] if rates else 0
        t1 = time.time(); takes = []
        for _ in range(int(os.environ.get("A02_TAKES", 1))):
            takes.append(np.concatenate([np.array(r.audio).reshape(-1) for r in model.generate(src, voice=VOICE, lang_code=lang)]))
        ok = [a for a in takes if len(a) / SR / len(src) >= 0.85 * med] or takes
        best = min(ok, key=len); write(f, best); d = len(best) / SR; slot = TL["dur"][k] + 0.2
        print(lang, k, "takes", [round(len(a) / SR, 1) for a in takes], "kept", round(d, 1), flush=True)
        rep[k] = {"slot": round(slot, 2), "raw": round(d, 2), "need": round(d / slot, 3), "gen_s": round(time.time() - t1, 1), "engine": MODEL, "voice": VOICE, "tts": src}
        print(lang, k, {x: rep[k][x] for x in ("slot", "raw", "need", "gen_s")}, flush=True)
        fp.write_text(json.dumps(rep, indent=1, ensure_ascii=False))
