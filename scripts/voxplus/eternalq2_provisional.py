# eternalq2: provisional EternalTiming.ts at 2.6 words a second (only for building before the voice is ready).
import json, pathlib
R = pathlib.Path("/Volumes/DarwinSSD/MMVideo"); B = json.load(open(R / "scripts/voxplus/eternalq2_beats.json"))
CH = {"p01", "q01", "a01", "b01", "e01"}; t = 0.35; st, du = {}, {}
for i, b in enumerate(B):
    if i: t += 0.9 if b["key"] in CH else 0.22
    st[b["key"]] = round(t, 3); du[b["key"]] = round(len(b["say"].split()) / 2.6, 3); t += du[b["key"]]
js = lambda o: json.dumps(o, ensure_ascii=False, separators=(",", ":"))
(R / "src/voxplus/EternalTiming.ts").write_text("// PROVISIONAL (2.6 words/s), replaced by eternalq2_audio.py\n"
  f"export const FILM_TOTAL_S = {round(t + 5, 3)};\nexport const ORDER: string[] = {js([b['key'] for b in B])};\nexport const BEAT: Record<string, number> = {js(st)};\n"
  f"export const DUR: Record<string, number> = {js(du)};\nexport const SAY: Record<string, string> = {js({b['key']: b['say'] for b in B})};\n"
  "export const WORDS: Record<string, [string, number, number][]> = {};\n")
print("provisional", round(t + 5, 1))
