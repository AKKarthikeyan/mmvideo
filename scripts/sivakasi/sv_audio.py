"""Sivakasi films: narration at its timeline positions, a CC0 music bed ducked under speech, and a few CC0 sound effects.
  python3 scripts/sivakasi/sv_audio.py paradox longroad
Output: public/sivakasi/<film>/final.wav (stereo 44.1 kHz). Beds and effects are CC0 (see src/voxplus/LICENSES.md)."""
import json, os, subprocess, sys, wave
import numpy as np
sys.path.insert(0, "/Volumes/DarwinSSD/DataKadai/mmvideo-dk-tp/scripts/datayt")
import tiruppur_music as TM
R = "/Volumes/DarwinSSD/MMVideo/docs/geo/research/SV01-sivakasi-fireworks"; LIB = TM.LIB; FF = TM.FF
TP = "/Volumes/DarwinSSD/DataKadai/mmvideo-dk-tp"
FILMS = {"paradox": ("paradox_v1", "music_06_curious_ambience_reg1n0ld.wav"), "longroad": ("long_road_v1", "music_07_strings_with_percussion_buythefield.wav")}
SFX = {"thump": ("sfx_thump_stamp_mpuffenbarger.wav", 0.55), "whoosh": ("sfx_whoosh_deep_kinoton.wav", 0.35), "pop": ("sfx_pop_conarb13.wav", 0.30), "ding": ("sfx_coin_ding_greenvwbeetle.wav", 0.22)}
def dec(path, sr):
    tmp = "/tmp/sv_dec.wav"; subprocess.run([FF, "-v", "error", "-y", "-i", path, "-ar", str(sr), "-ac", "2", "-c:a", "pcm_s16le", tmp], check=True); return TM.read(tmp)[1]
for film in (sys.argv[1:] or FILMS):
    name, bed = FILMS[film]; d = json.load(open(f"/Volumes/DarwinSSD/MMVideo/src/sivakasi/data/{film}.json")); fps = d["fps"]
    LD = f"{R}/voice/{name}"
    subprocess.run(["zsh", "-lic", f"cd {TP} && LONG_DIR={LD} .venv/bin/python scripts/datayt/long_voice.py mix"], check=True)
    nar, mus = f"{LD}/vo/narration.wav", f"{LD}/vo/narration_music.wav"
    TM.mix(nar, f"{LIB}/{bed}", mus)
    sr, x = TM.read(mus); x = x.copy(); cues = []
    for a in d["acts"]:
        cues += [(s["frame"], s["name"]) for s in a["sfx"]]
        if a["scene"] == "Chain":
            p = a["p"]
            for i, b in enumerate(p.get("litAt", [])):
                if b >= 0: cues.append((a["from"] + a["spans"][min(b, len(a["spans"]) - 1)]["s"] + 6 + i * p.get("stagger", 0), "pop"))
    for fr, nm in cues:
        f, g = SFX[nm]; fx = dec(f"{LIB}/{f}", sr)[: sr * 2] * g; i = int(fr / fps * sr); j = min(len(x), i + len(fx))
        if i < len(x): x[i:j] += fx[: j - i]
    pk = np.max(np.abs(x)); x = x * (0.97 / pk) if pk > 0.97 else x
    os.makedirs(f"/Volumes/DarwinSSD/MMVideo/public/sivakasi/{film}", exist_ok=True); out = f"/Volumes/DarwinSSD/MMVideo/public/sivakasi/{film}/final.wav"
    w = wave.open(out, "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes((x * 32767).astype(np.int16).tobytes()); w.close()
    print(film, "final", round(len(x) / sr, 1), "s,", len(cues), "sfx cues")
