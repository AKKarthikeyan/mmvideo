#!/usr/bin/env python3
"""kotakq2 regional audio (Hindi, Tamil). Usage (inside zsh -lic on the Mini, key from $GOOGLE_TTS_API_KEY, sent only as a header, never printed):
  kotakq2_regional.py samples          first ~60 s (c01-c04) in Google Chirp 3 HD, both languages
  kotakq2_regional.py google LANG      every beat in Google Chirp 3 HD (LANG hi|ta) -> regional/<lang>/<k>_g.mp3 + fit report
Translations: contentengine/.../_video/regional/kotakq2.<lang>.json copied to public/voxplus/kotakq2/regional/. English timing: vo/timeline.json."""
import base64, json, os, pathlib, subprocess, sys, time, urllib.request, urllib.error
R = pathlib.Path("/Volumes/DarwinSSD/MMVideo"); P = R / "public/voxplus/kotakq2"; FF = "/Volumes/DarwinSSD/vendor/bin/ffmpeg"
URL = "https://texttospeech.googleapis.com/v1/text:synthesize"
VOICE = {"hi": "hi-IN-Chirp3-HD-Charon", "ta": "ta-IN-Chirp3-HD-Charon"}
def g(lang, text, out):
    name = VOICE[lang]
    body = json.dumps({"input": {"text": text}, "voice": {"languageCode": name[:5], "name": name}, "audioConfig": {"audioEncoding": "MP3"}}).encode()
    for att in range(4):
        req = urllib.request.Request(URL, body, {"Content-Type": "application/json", "X-Goog-Api-Key": os.environ["GOOGLE_TTS_API_KEY"]})
        try:
            r = json.load(urllib.request.urlopen(req, timeout=90)); pathlib.Path(out).write_bytes(base64.b64decode(r["audioContent"])); return
        except urllib.error.HTTPError as e:
            print("HTTP", e.code, e.read().decode()[:120], flush=True); time.sleep(5 * (att + 1))
    raise SystemExit("google tts failed")
def dur(p):
    e = subprocess.run([FF, "-hide_banner", "-i", str(p), "-f", "null", "-"], capture_output=True, text=True).stderr
    import re; m = re.findall(r"time=(\d+):(\d+):([\d.]+)", e)[-1]; return int(m[0]) * 3600 + int(m[1]) * 60 + float(m[2])
if __name__ == "__main__":
    mode = sys.argv[1]
    if mode == "samples":
        for lang in ("hi", "ta"):
            T = json.load(open(P / f"regional/kotakq2.{lang}.json")); o = P / f"regional/samples/{lang}"; o.mkdir(parents=True, exist_ok=True)
            for k in ("c01", "c02", "c03", "c04"):
                g(lang, T[k]["tts"], o / f"{k}_g.mp3"); print(lang, k, round(dur(o / f"{k}_g.mp3"), 1), flush=True)
    elif mode == "google":
        lang = sys.argv[2]; T = json.load(open(P / f"regional/kotakq2.{lang}.json")); o = P / f"regional/{lang}"; o.mkdir(parents=True, exist_ok=True)
        TL = json.load(open(P / "vo/timeline.json"))
        rep = {}
        for k in TL["order"]:
            f = o / f"{k}_g.mp3"
            g(lang, T[k]["tts"], f); d = dur(f); slot = TL["dur"][k] + 0.2
            rep[k] = {"slot": round(slot, 2), "raw": round(d, 2), "need": round(d / slot, 3)}; print(lang, k, rep[k], flush=True)
        json.dump(rep, open(o / "fit_raw.json", "w"), indent=1)
