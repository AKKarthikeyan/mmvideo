#!/usr/bin/env python3
"""Ask Jev (TypeSafe) the open decisions on the Gita film, apply the answers to scripts/katha/gita.json, record them.

AK, 22 Oct 2026: "Get own voice, remaining get the opinion of Jev and complete". So Krishna's quoted verses get a voice
of their own (not the narrator's voice at another pitch), and Jev decides the rest. Each question is one small judgment
between fixed, prepared options, so applying an answer is plain code:

  voice      which MiniMax system voice Krishna speaks with (from the live English voice list; never the narrator's)
  disclose   where the standing disclosure goes: at the end only (as now), early only, or a short line early as well
  letter_a   how Sanjaya's paraphrase of 10.33 says the letter A
  v13_34     13.34 in Purohit's words (as now) or Sivananda's, which follows the Sanskrit (the knower lights the field)
  v2_12      2.12 in Purohit's or Sivananda's words, judged on being clear when heard once
  v18_72     18.72 likewise

What Jev cannot do, and stays with a person: listen to the voice (the Sanskrit names are ear-tested once on the Mini)
and compare our quotes with the printed 1935 book. Every quote's plate already says "(EDITED TEXT)", which is what we
quote. An answer below MIN_CONF keeps the current choice. Answers are cached in public/katha/gita/jev_answers.json,
so re-running asks nothing new; the record is written to docs/katha/JEV_DECISIONS.md and to "decisions" in gita.json.

Run on the Mini (its login shell holds TYPESAFE_API_KEY and MINIMAX_API_KEY):
  python3 scripts/katha/ask_jev.py --dry      show the requests, send nothing
  python3 scripts/katha/ask_jev.py            ask, apply, record
  python3 scripts/katha/ask_jev.py --mock     test the apply step offline (writes to the scratch copy given by --out)
"""
import hashlib, json, os, pathlib, sys, time, urllib.error, urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts" / "dharma"))
from corpus import ref as corpus_ref  # noqa: E402

SCRIPT = ROOT / "scripts" / "katha" / "gita.json"
CACHE = ROOT / "public" / "katha" / "gita" / "jev_answers.json"
RECORD = ROOT / "docs" / "katha" / "JEV_DECISIONS.md"
URL = "https://api.typesafe.ai/v1/systemone"
MODEL = "jev-1.13.0"               # the model rank_jev.py used; a new version means new answers (the cache key carries it)
MIN_CONF = 0.45
NARRATOR = "English_Diligent_Man"  # Sanjaya's voice (scripts/katha/build_film.py VOICES)
FILM = ("A premium, calm animated film of the Bhagavad Gita for a worldwide English-speaking audience and for India. "
        "The narrator, Sanjaya, tells the story to the blind king Dhritarashtra. Krishna and Arjuna speak only quoted verses, "
        "each shown on screen with chapter, verse and translator. The pictures are silhouettes in lamplight.")
SHORT_NOTE = "Every verse here is shown with its source. The pictures are drawn in code, and the voice is synthetic."
SIGN_OFF = "This was the Bhagavad Gita, as Sanjaya told it to the blind king."


def beats(S):
    return [b for m in S["movements"] for b in m["beats"]]


def beat(S, key):
    return next(b for b in beats(S) if b["key"] == key)


def by_ref(S, r):
    return next(b for b in beats(S) if b.get("ref") == r and b["speaker"] != "SANJAYA")


def minimax_voices():
    key = os.environ.get("MINIMAX_API_KEY")
    if not key: return []
    req = urllib.request.Request("https://api.minimax.io/v1/get_voice", data=json.dumps({"voice_type": "system"}).encode(),
                                 headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"})
    j = json.load(urllib.request.urlopen(req, timeout=60))
    return [v for v in j.get("system_voice") or [] if v.get("voice_id", "").startswith("English") and v["voice_id"] != NARRATOR]


def questions(S, voices):
    """(id, state, {id: question}, options) for every open decision. options maps each choice to what applying it does."""
    out = []
    if voices:
        crit = {v["voice_id"]: f"{v.get('voice_name', v['voice_id'])}: {'; '.join(v.get('description') or []) or 'no description'}" for v in voices}
        k_lines = [b["say"] for b in beats(S) if b["speaker"] == "KRISHNA"][:3]
        out.append(("voice", {"film": FILM, "role": "Krishna, teacher and friend, speaking verses of the Gita",
                              "narrator_voice": "a warm Indian-accented male narrator (English_Diligent_Man)", "sample_lines": k_lines},
                    {"voice": {"type": "choice", "criteria": crit, "instructions":
                               "Which voice should speak Krishna's verses? It should sound like a mature man who is calm, warm, wise and steady, "
                               "gentle rather than theatrical, believable for a worldwide and an Indian audience, and clearly different from "
                               "`narrator_voice`. Judge only from each voice's name and description."}}, None))
    end = next(b for b in beats(S) if b["scene"].get("type") == "end")
    out.append(("disclose", {"film": FILM, "disclosure": end["say"], "short_version": SHORT_NOTE,
                             "opening": "The film opens cold: Arjuna's bow slips from his hand, then the blind king asks what happened on the field."},
                {"disclose": {"type": "choice", "instructions":
                              "The film must tell viewers once how it is made (`disclosure`). Where should it go for viewers to trust the film "
                              "without the opening losing its pull?", "criteria": {
                                  "end": "Once at the end, spoken over the closing card after a bell (as now).",
                                  "early": "Once, right after the prologue and before chapter one; the end card then closes with a one-line sign-off.",
                                  "both": "The one-sentence `short_version` right after the prologue, and the full note at the end."}}}, None))
    a = beat(S, "c10b02")
    out.append(("letter_a", {"film": FILM, "line": a["say"], "context":
                             "Sanjaya paraphrases Gita 10.33, where Krishna says that among letters he is the letter a (akara), "
                             "the first letter of the Sanskrit alphabet. A synthetic English voice reads the line aloud once."},
                {"letter_a": {"type": "choice", "instructions":
                              "Which wording of the letter part of `line` will a listener understand at once when it is read aloud?", "criteria": {
                                  "keep": "among letters, A;",
                                  "first_letter": "among letters, the first letter, A;",
                                  "first_sound": "among letters, A, the first sound of speech;"}}}, None))
    for qid, r, extra in (("v13_34", "gita:13.34", "The Sanskrit says: as the one sun lights this whole world, so the knower of the field "
                                                    "lights the whole field. The chapter is called The Field and Its Knower."),
                          ("v2_12", "gita:2.12", "Krishna tells Arjuna that neither of them, nor the princes before them, ever began or will ever end."),
                          ("v18_72", "gita:18.72", "At the end of the teaching Krishna asks Arjuna, gently, whether he has listened and whether his confusion is gone.")):
        p, s = corpus_ref(r, author=21)["en"], corpus_ref(r, author=16)["en"]
        out.append((qid, {"film": FILM, "verse": r.split(":")[1], "meaning": extra, "purohit": p, "sivananda": s},
                    {qid: {"type": "choice", "instructions":
                           "Krishna's voice speaks this verse once, with the source on screen. Which translation should it use? Prefer the one "
                           "that is faithful to `meaning` and clear when heard once. Purohit is the film's usual translator; choose Sivananda only "
                           "if Purohit is clearly less faithful or harder to follow.", "criteria": {
                               "purohit": "Shri Purohit Swami (1935): " + p, "sivananda": "Swami Sivananda (1949): " + s}}}, None))
    return out


def ask(state, qs, key, tries=5):
    body = json.dumps({"model": MODEL, "state": state, "questions": qs}).encode()
    for n in range(tries):
        req = urllib.request.Request(URL, data=body, headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"})
        try:
            return json.load(urllib.request.urlopen(req, timeout=60))
        except urllib.error.HTTPError as e:
            if e.code not in (429, 500, 502, 503, 529) or n == tries - 1:
                raise SystemExit(f"TypeSafe answered {e.code}: {e.read().decode(errors='replace')[:400]}")
        except (urllib.error.URLError, TimeoutError):
            if n == tries - 1: raise
        time.sleep(1.5 * 2 ** n)


def plate_src(r, author, b):
    src = corpus_ref(r, author=author)["src"]
    if r == "gita:13.34": src = src.replace("13.34 ·", "13.34 (13.33 IN 700-VERSE EDITIONS) ·")
    return src


def apply(S, qid, choice):
    """Change gita.json for one answer. Every branch is idempotent, so re-running is safe."""
    if qid == "voice":
        S.setdefault("voices", {})["KRISHNA"] = {"voice_id": choice, "speed": 0.9, "pitch": 0}
    elif qid == "disclose":
        prologue = next(m for m in S["movements"] if int(m.get("chapter", 0)) == 0)
        end = next(b for b in beats(S) if b["scene"].get("type") == "end")
        full = S.setdefault("disclosure_text", end["say"])
        prologue["beats"] = [b for b in prologue["beats"] if b["key"] != "p00b90"]
        end["say"] = full
        if choice in ("early", "both"):
            prologue["beats"].append({"key": "p00b90", "speaker": "SANJAYA", "say": full if choice == "early" else SHORT_NOTE,
                                      "scene": {"type": "sanjaya", "variant": "listen", "detail": "the hall, the lamp steady; the narrator steps out of the story for a moment"},
                                      "music": "drone", "note": "The standing disclosure (house rule 7), placed here on Jev's advice."})
            if choice == "early": end["say"] = SIGN_OFF
    elif qid == "letter_a":
        b = beat(S, "c10b02"); opts = ["among letters, A;", "among letters, the first letter, A;", "among letters, A, the first sound of speech;"]
        new = {"keep": opts[0], "first_letter": opts[1], "first_sound": opts[2]}[choice]
        for o in opts:
            if o in b["say"]: b["say"] = b["say"].replace(o, new); break
    elif qid in ("v13_34", "v2_12", "v18_72"):
        r = "gita:" + qid[1:].replace("_", "."); b = by_ref(S, r); author = 16 if choice == "sivananda" else 21
        b["say"] = corpus_ref(r, author=author)["en"]
        key = "src" if b["scene"].get("type") == "verse" else "plate"
        b["scene"][key] = plate_src(r, author, b)
        if author == 16: b["scene"].pop("hl", None); b["scene"].pop("highlight", None)   # lit words belonged to Purohit's wording


def main():
    a = sys.argv[1:]; dry, mock = "--dry" in a, "--mock" in a
    out = pathlib.Path(a[a.index("--out") + 1]) if "--out" in a else SCRIPT
    S = json.load(open(SCRIPT))
    if mock: voices = [{"voice_id": "English_MockVoice", "voice_name": "Mock", "description": ["test"]}]
    else: voices = minimax_voices()
    if not voices and not dry: print("note: MINIMAX_API_KEY is not set, so Krishna's voice is not chosen this run")
    qs = questions(S, voices)
    if dry:
        for qid, state, q, _ in qs: print(json.dumps({"id": qid, "state": state, "questions": q}, ensure_ascii=False, indent=1)[:1500], "\n")
        return
    key = os.environ.get("TYPESAFE_API_KEY")
    if not key and not mock: raise SystemExit("TYPESAFE_API_KEY is not set: run this on the Mini")
    cache = json.load(open(CACHE)) if CACHE.exists() else {}
    rec = []
    for qid, state, q, _ in qs:
        h = hashlib.sha256(json.dumps([MODEL, state, q], sort_keys=True).encode()).hexdigest()[:16]
        if mock: ans = {"choice": list(q[qid]["criteria"])[-1], "confidence": 0.8}
        elif h in cache: ans = cache[h]
        else:
            resp = ask(state, q, key); ans = resp["answers"][qid]; cache[h] = ans
            CACHE.write_text(json.dumps(cache, indent=1, ensure_ascii=False))
        choice, conf = ans.get("choice"), float(ans.get("confidence", 0))
        used = choice if conf >= MIN_CONF else None
        if used: apply(S, qid, used)
        rec.append({"question": qid, "jev": choice, "confidence": round(conf, 2), "applied": bool(used),
                    "option": q[qid]["criteria"].get(choice, "") if choice else ""})
        print(f"{qid:9} Jev: {choice} (confidence {conf:.2f}) -> {'applied' if used else 'kept the current choice'}")
    S["decisions"] = {"by": f"Jev ({MODEL}, TypeSafe), via scripts/katha/ask_jev.py; Krishna's own voice by AK", "answers": rec}
    out.write_text(json.dumps(S, indent=1, ensure_ascii=False))
    if not mock:
        lines = ["# Decisions on the Gita film, answered by Jev", "",
                 f"AK asked for Krishna to have his own voice and for Jev ({MODEL}, TypeSafe) to decide the rest. "
                 "`scripts/katha/ask_jev.py` asked, applied each answer to `scripts/katha/gita.json`, and wrote this record. "
                 f"An answer below {MIN_CONF} confidence keeps the current choice.", "",
                 "| Question | Jev's answer | Confidence | Applied |", "|---|---|---|---|"]
        lines += [f"| {r['question']} | {r['option'] or r['jev']} | {r['confidence']} | {'yes' if r['applied'] else 'no, kept the current choice'} |" for r in rec]
        lines += ["", "Left with a person: one listen to the Sanskrit names in the new voices, and a check of the quotes against the "
                  "printed 1935 book. Every plate already says \"(EDITED TEXT)\", which is what the film quotes."]
        RECORD.write_text("\n".join(lines) + "\n")
    print("wrote", out, "" if mock else f"and {RECORD}")


if __name__ == "__main__":
    main()
