"""Hindi voicing (Gemini voice Charon, gemini-2.5-flash-preview-tts) with retries; a line that still fails is reported and skipped. usage: hindi_driver.py <film>"""
import json, os, sys, time
sys.path.insert(0, "/Volumes/DarwinSSD/DataKadai/mmvideo-dk-tp/scripts/datayt"); film = sys.argv[1]; sys.argv = sys.argv[:1]
import long_tracks as L
L.GEMINI = "gemini-2.5-flash-preview-tts"
_, tp, td = L.paths(film, "hi"); tr = json.load(open(tp, encoding="utf-8")); os.makedirs(td, exist_ok=True); failed = []
for sid, sc in tr["scenes"].items():
    text = (sc.get("text") or "").strip(); wav, side = os.path.join(td, f"{sid}.wav"), os.path.join(td, f"{sid}.json")
    if not text or (os.path.exists(wav) and os.path.exists(side) and json.load(open(side, encoding="utf-8")).get("text") == text): continue
    for i in range(6):
        try:
            L.gemini(text, wav); break
        except (KeyError, IndexError, SystemExit):
            time.sleep(4 * (i + 1))
    else:
        failed.append((sid, text)); print("FAILED", sid, text, flush=True); continue
    json.dump({"text": text, "engine": "gemini-charon", "sec": round(L.dur(wav), 3)}, open(side, "w", encoding="utf-8"), ensure_ascii=False)
    print(film, "hi", sid, f"{L.dur(wav):.2f}s", flush=True)
print("failed:", len(failed))
