#!/usr/bin/env python3
"""Voice the Surasamharam film: one mp3 per beat per language, public/katha/sura/<lang>/<key>.mp3 (not in git), and the
measured lengths in public/katha/sura/voice.json (in git), which build_sura.py reads to time the picture.

  python3 scripts/katha/voice_sura.py en          # or ta, hi, te; several at once; --force to redo

English comes from build_sura.py; Tamil, Hindi and Telugu from docs/briefs/IC_SURASAMHARAM_NARRATION_TA_HI_TE.md
(written for each listener, not translated line by line; a native speaker must check them before upload).
The key is never read here: in the cloud session the network proxy adds it; on the Mini set MINIMAX_API_KEY."""
import json, os, re, sys, time, pathlib, subprocess
ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import build_sura
OUT = ROOT / "public/katha/sura"
VOICE = {  # MiniMax has native Hindi voices; Tamil uses the house narrator with a language boost (as audio_tracks.py does).
    # Telugu cannot be voiced here: the service rejects language_boost "Telugu" (16 Nov 2026).
    "en": dict(voice_id="English_Diligent_Man", speed=0.94, boost="English"),
    "hi": dict(voice_id="hindi_male_1_v2", speed=1.06, boost="Hindi"),
    "ta": dict(voice_id="English_Diligent_Man", speed=0.94, boost="Tamil"),
}
HEAD = {"ta": "## Tamil", "hi": "## Hindi", "te": "## Telugu"}
def lines(lang):
    return {k: v for k, v in build_sura.narration(lang).items() if v}
def tts(text, path, v):
    import requests
    key = os.environ.get("MINIMAX_API_KEY", "proxy-injected")
    body = {"model": "speech-2.6-hd", "text": text, "stream": False, "language_boost": v["boost"],
            "voice_setting": {"voice_id": v["voice_id"], "speed": v["speed"], "vol": 1, "pitch": 0},
            "audio_setting": {"sample_rate": 44100, "bitrate": 128000, "format": "mp3", "channel": 1}}
    for attempt in range(6):
        j = requests.post("https://api.minimax.io/v1/t2a_v2", headers={"Authorization": f"Bearer {key}"}, json=body, timeout=180).json()
        if (j.get("data") or {}).get("audio"):
            path.write_bytes(bytes.fromhex(j["data"]["audio"])); return j["extra_info"]["audio_length"] / 1000
        print("  retry", path.name, j.get("base_resp")); time.sleep(15 * (attempt + 1))
    raise SystemExit("TTS failed: " + path.name)
def length(p): return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)]).decode())
def main():
    force = "--force" in sys.argv; langs = [a for a in sys.argv[1:] if a in VOICE] or ["en"]
    vj = OUT / "voice.json"; V = json.loads(vj.read_text()) if vj.exists() else {}
    for lang in langs:
        d = OUT / lang; d.mkdir(parents=True, exist_ok=True); V.setdefault(lang, {})
        for key, text in lines(lang).items():
            p = d / f"{key}.mp3"
            if p.exists() and not force and V[lang].get(key, {}).get("text") == text: continue
            tts(text, p, VOICE[lang]); V[lang][key] = dict(sec=round(length(p), 2), text=text)
            print(f"  {lang} {key} {V[lang][key]['sec']:6.2f}s"); vj.write_text(json.dumps(V, ensure_ascii=False, indent=1))
        print(f"{lang}: {len(V[lang])} beats, {sum(x['sec'] for x in V[lang].values()):.0f}s of voice")
if __name__ == "__main__": main()
