#!/usr/bin/env python3
"""kotakq2 regional via AI4Bharat Indic Parler-TTS (~/.venvs/parler, MPS). Usage: kotakq2_parler.py samples | full LANG
Same male description for every beat (voice held constant). Output regional/{samples/}LANG/<k>_p.wav"""
import json, pathlib, sys, time
import soundfile as sf, torch
from parler_tts import ParlerTTSForConditionalGeneration
from transformers import AutoTokenizer
P = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/voxplus/kotakq2")
STYLE = "speaks at a moderate pace with a clear, confident and warm tone, recorded very close up with no background noise."
DESC = {"hi": "Rohit " + STYLE, "ta": "A male speaker " + STYLE}
REPO = "ai4bharat/indic-parler-tts"; dev = "mps" if torch.backends.mps.is_available() else "cpu"
model = ParlerTTSForConditionalGeneration.from_pretrained(REPO).to(dev); tok = AutoTokenizer.from_pretrained(REPO)
dtok = AutoTokenizer.from_pretrained(model.config.text_encoder._name_or_path)
def say(lang, text, out):
    d = dtok(DESC[lang], return_tensors="pt").to(dev); p = tok(text, return_tensors="pt").to(dev)
    torch.manual_seed(7)
    with torch.no_grad():
        g = model.generate(input_ids=d.input_ids, attention_mask=d.attention_mask, prompt_input_ids=p.input_ids, prompt_attention_mask=p.attention_mask)
    a = g.cpu().numpy().squeeze(); sf.write(out, a, model.config.sampling_rate); return len(a) / model.config.sampling_rate
mode = sys.argv[1]
langs = ("hi", "ta") if mode == "samples" else (sys.argv[2],)
for lang in langs:
    T = json.load(open(P / f"regional/kotakq2.{lang}.json"))
    o = P / ("regional/samples/" if mode == "samples" else "regional/") / lang; o.mkdir(parents=True, exist_ok=True)
    for k in (("c01", "c02", "c03", "c04") if mode == "samples" else T):
        t0 = time.time(); d = say(lang, T[k]["tts"], o / f"{k}_p.wav"); print(lang, k, round(d, 1), "s audio in", round(time.time() - t0), "s", flush=True)
