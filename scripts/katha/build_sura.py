#!/usr/bin/env python3
"""Build the Surasamharam film's data, read by src/katha/Film.tsx:

  python3 scripts/katha/build_sura.py            # English: public/katha/sura/data.json     -> composition KT-sura
  python3 scripts/katha/build_sura.py ta hi      # Tamil, Hindi: data-ta.json, data-hi.json -> KT-sura-ta, KT-sura-hi

The script is section 5 of docs/briefs/IC_SURASAMHARAM_BRIEF_v2.md (approved by AK, 16 Nov 2026): Arun first, the Gita
film's look throughout. Tamil, Hindi and Telugu are written for each listener in docs/briefs/IC_SURASAMHARAM_NARRATION_TA_HI_TE.md.
Each language is its own cut, timed to its own voice (voice_sura.py writes public/katha/sura/voice.json), because the
scripts differ in length; without a voice a beat is timed at 2.4 words a second.
Verse cards take their text from scripts/katha/sura_verses.json (rule 2: nobody types a verse by hand)."""
import json, re, sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]
WPS = 2.4
M = lambda kind, **k: dict(type="metaphor", kind=kind, **k)
NOTE = "OUR NOTE"
VERSES = json.loads((pathlib.Path(__file__).resolve().parent / "sura_verses.json").read_text())
def VC(k, head): v = VERSES[k]; return M("suraVerse", head=head, ta=v["ta"], en=v["en"], src=v["src_line"], captions=False)
BEATS = [
  ("b01", "Who decides how you speak to your own child tonight? For Arun, it is a man who shouted at him at eleven this morning, in front of his whole team. Arun said nothing. He carried it home.", M("suraOffice")),
  ("b02", "His son runs up with a drawing. \"Appa, look.\" \"Not now. Can't you see I'm tired?\" The drawing goes down. His wife asks why he is shouting. Nobody eats together.", M("suraDoor")),
  ("b03", "He lies awake. One friend has a new house. Another, a promotion. And the man who shouted at him is asleep, kilometres away. So who is running Arun's house tonight?", M("suraArun")),
  ("b04", "There is an old Tamil answer to that, and it is a bird. Look at what Murugan rides. Look at the bird on his flag. Both were once the enemy he went to war against. He kept them.", M("suraMurugan", figure=False)),
  ("b05", "The oldest Tamil poem to Murugan already knows the battle.", VC("tmp46", "Tirumurugatruppadai · Nakkirar"), 10),
  ("b06", "Surapadman earned his power. Long austerity, and a boon from Shiva. Nothing he had was stolen. What changed was what he did with it. The devas were made servants in their own heavens.", M("suraKing")),
  ("b07", "The answer to him came as six sparks, carried to a lake of reeds and raised as one child. In the tradition kept at Thai Poosam, his mother places a spear in his hand: the vel.", M("suraBirth")),
  ("b08", "The festival remembers the war across six days. Brother after brother falls. At the end one remains. And he does something no one expects. He stops fighting, and hides.", M("suraWar")),
  ("b09", "Surapadman becomes a mango tree standing in the ocean, so large it darkens the water.", M("suraTree", phase="before"), 9),
  ("b10", "", VC("tmp59", "Tirumurugatruppadai · Nakkirar"), 11),
  ("b11", "The vel is thrown, and the tree is split in two.", M("suraTree", phase="throw"), 6),
  ("b12", "And here the Kanda Puranam of Kachiyappa tells what happened next. One half rises as a rooster. The other as a peacock. And they come at him still, in fury. Then, the text says, a single look of grace, and the enmity is gone. Murugan sets the rooster on his banner, and mounts the peacock.", M("suraTree", phase="after")),
  ("b13", "The enemy is gone. What he was made of is still here, and now it carries the one it fought.", VC("kp492", "Kanda Puranam · Kachiyappa Sivachariyar"), 13),
  ("b14", "That is the text. On the fifteenth of November it was played out again on the shore at Tiruchendur, as it is every year. What follows is our reading of it, and it is only a reading.", M("suraShore", kicker=NOTE, plate="Soorasamharam, Tiruchendur, 15 Nov 2026 · reported by DT Next and Deccan Chronicle")),
  ("b15", "The Saiva Siddhanta teachers read Surapadman as the sense of \"I\" that will not bend. On that reading he was never only out there. The anger at the door, the scrolling at midnight: we add those ourselves, as his tree, hiding in plain sight.", M("suraKing", small=True, kicker=NOTE)),
  ("b16", "And notice how the story ends. The tree is not burned to ash. The force is the same; it has been given a rider. Anger with a rider is the nerve to say a hard thing calmly. Envy with a rider is noticing what you actually want.", M("suraMurugan", figure=False, mood="gold", kicker=NOTE)),
  ("b17", "In the morning Arun goes to his son first. \"I'm sorry. You did nothing wrong. I was upset about work, and I brought it home. Show me the drawing.\"", M("suraMorning")),
  ("b18", "Nothing else is fixed. The manager is the same. The loan is the same. But for one morning, the thing that was riding him is carrying him instead.", M("suraDrawing")),
  ("b19", "The tradition could have kept only the victory. It kept the enemy too, where everyone can see him. So who is running your house tonight? And what would he be, with a rider?", M("suraMurugan", kicker=NOTE)),
  ("b20", "A note on how we work. Every verse is shown with its source, in a translation named on screen or in our own rendering, marked as ours. Where we add our own reading, it is marked as our note. The pictures are drawn in code, the voice is synthetic, and nothing here speaks for God.",
   M("suraEnd", title="Why Murugan Rides His Enemy", subtitle="The Inner Chariot", captions=True, lines=[
     "The battle: Tirumurugatruppadai (Nakkirar); Kanda Puranam (Kachiyappa Sivachariyar), Surapadman Vathai Padalam",
     "English of the Sangam lines: J. V. Chelliah, Pattupattu: Ten Tamil Idylls, 1946",
     "The reading of Surapadman as the sense of “I”: Saiva Siddhanta tradition. Arun's story is ours.",
     "Soorasamharam at Tiruchendur, 15 Nov 2026: DT Next; Deccan Chronicle",
     "Type: Cormorant Garamond and Cinzel, SIL Open Font License · Music synthesised in code · Made in code with Remotion",
     "Vetri vel! Veera vel!"])),
]
HEAD = {"ta": "## Tamil", "hi": "## Hindi", "te": "## Telugu"}
def narration(lang):
    if lang == "en": return {r[0]: r[1] for r in BEATS}
    md = (ROOT / "docs/briefs/IC_SURASAMHARAM_NARRATION_TA_HI_TE.md").read_text()
    sec = md.split(HEAD[lang], 1)[1].split("\n## ", 1)[0]
    return {f"b{int(m.group(1)):02d}": m.group(2).strip() for m in re.finditer(r"^\| (\d+) \| (.+?) \|$", sec, re.M)}
def build(lang):
    vj = ROOT / "public/katha/sura/voice.json"; V = (json.loads(vj.read_text()) if vj.exists() else {}).get(lang, {})
    N = narration(lang); beats = []
    for row in BEATS:
        key, scene = row[0], dict(row[2]); say = N.get(key, "")
        floor = row[3] if len(row) > 3 else 0                      # a verse card holds long enough to be read
        v = V.get(key) if V.get(key, {}).get("text") == say else None
        sec = (v["sec"] + 0.9) if v else round(len(say.split()) / WPS + 1.2, 2)
        b = dict(key=key, chapter=0, movement="", speaker="NARRATOR", say=say, ref=None, sec=round(max(sec, floor), 2), scene=scene)
        if v: b["audio"] = f"katha/sura/{lang}/{v.get('file', key + '.mp3')}"
        beats.append(b)
    sfx = "" if lang == "en" else "-" + lang
    score = ROOT / f"public/katha/sura/score{sfx}.wav"
    D = dict(id="sura" + sfx, title="Why Murugan Rides His Enemy", beats=beats, music=(f"katha/sura/score{sfx}.wav" if score.exists() else "dharma/tanpura.wav"), bell="", lamps=False, lang=lang, bed=(0.5 if score.exists() else 0.17))
    out = ROOT / f"public/katha/sura/data{sfx}.json"; out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(D, ensure_ascii=False, indent=1))
    tot = sum(b["sec"] + 0.6 for b in beats)
    eng = sorted({V[b["key"]].get("engine", "minimax") for b in beats if b.get("audio")}) or ["none"]
    print(f"wrote {out.relative_to(ROOT)}: {len(beats)} beats, {sum(1 for b in beats if b.get('audio'))} voiced ({', '.join(eng)}), {int(tot // 60)}:{int(tot % 60):02d}")
def main():
    for lang in ([a for a in sys.argv[1:] if a in ("en", "ta", "hi", "te")] or ["en"]): build(lang)
if __name__ == "__main__": main()
