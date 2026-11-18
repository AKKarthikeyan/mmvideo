# Channel-name ranker for the everyday-science channel (22 Oct 2026): Jev (TypeSafe) judges each candidate name on what
# code can't: memorable, says what the channel does, works across India, makes you tap; plus two flags (odd meaning,
# too generic). Code holds the weights and the handle availability we checked by hand (YouTube/Instagram/X/.com/.in).
# A Jev score is a judgment of the wording, not a forecast of subscribers.
# Run on the Mini: zsh -lic 'python3 scripts/gadget/name_jev.py'
import concurrent.futures, json, os, sys, time, urllib.error, urllib.request

URL, MODEL = "https://api.typesafe.ai/v1/systemone", "jev-1.13.0"
CHANNEL = ("A YouTube Shorts channel for ordinary viewers across India. Each video takes one everyday object, such as a "
           "ceiling fan, air conditioner, fridge, TV or radio, and tells how it was invented (who, when, the original patent) "
           "and the simple science of how it works. Narration is in English for a pan-India audience.")
Q = {
    "remember": {"type": "score", "instructions": "How easy is the channel name in `name` to remember and type into YouTube search after hearing it once, for an ordinary Indian viewer who speaks everyday English?", "criteria": [
        "Hard to recall or spell: an unusual coinage, a confusing joined word, or several words that blur together.",
        "Can be recalled with effort, but people would likely misspell it or mix up its word order.",
        "Easy to recall and spell for most viewers, though it is not especially catchy.",
        "Instantly memorable and easy to spell: short, simple words a child could repeat."]},
    "meaning": {"type": "score", "instructions": "How clearly does `name` tell a new viewer what the channel in `channel` is about: how everyday things were invented and how they work?", "criteria": [
        "Gives no clue, or suggests a different kind of channel such as gaming, music, cooking or shopping.",
        "Hints at technology or science in general, but not at everyday objects or their history.",
        "Suggests either how things work or how they were invented, but not both.",
        "Clearly suggests both the origin story and the workings of everyday things."]},
    "pan_india": {"type": "score", "instructions": "How natural does `name` feel to viewers across all of India, whatever their mother tongue, as an English-language channel name?", "criteria": [
        "Uses a word from one regional language, or would sound odd or foreign to many Indian viewers.",
        "Understood by many, but some viewers would find a word unfamiliar or hard to pronounce.",
        "Plain English most Indian viewers would understand, with nothing regional in it.",
        "Simple English that every Indian viewer who knows basic English would understand and say easily."]},
    "click": {"type": "score", "instructions": "Seeing `name` next to a Short about how the fridge was invented, how likely is an ordinary Indian viewer to feel curious enough to tap the channel or follow it?", "criteria": [
        "Dull, generic or confusing: it would not draw a second look.",
        "Acceptable but forgettable.",
        "Interesting: it suggests the viewer will learn something surprising.",
        "Intriguing and inviting: it makes the viewer want to see more videos from this channel."]},
    "odd": {"type": "noul", "instructions": "Could `name` be read with an unintended, awkward, negative or silly meaning in English or Hindi, or sound like a different, unrelated word?"},
    "generic": {"type": "noul", "instructions": "Is `name` such a common English phrase that viewers searching for it would mostly find other channels, articles or memes rather than this channel?"},
}
W = {"remember": 0.3, "meaning": 0.3, "pan_india": 0.2, "click": 0.2}
# availability we checked on 22 Oct 2026: YouTube handle / Instagram / X / .com / .in ("?" = not checked)
AVAIL = {"Thingborn": "YYYYY", "How It Started": "YYNNY", "First Patent": "YYNNY", "Howborn": "YNYYY", "Invently": "YNYNY",
         "VoltTales": "YNYYY", "Wattborn": "Y??YY", "Oldpatent": "Y??YY", "Originyard": "YY?NY", "Spark101": "Y????",
         "How It Came Home": "Y????", "Bornhow": "Y????", "Thingsborn": "Y????", "Inventyard": "Y????", "Switch On Science": "Y????",
         "Invention Lane": "Y????", "Gizmo Origins": "Y????", "Things Invented": "Y????", "Patentkid": "Y????", "AmpTales": "Y????",
         "Why It Works": "YN?NY", "Origin Lab": "YNN?N", "Switch Story": "YN?NY",
         "Before the Switch": "?????", "Born of a Spark": "?????", "How Stuff Started": "?????", "Ordinary Inventions": "?????",
         "Science of Stuff": "?????", "Spark to Switch": "Y????", "Who Made This": "?????", "The Inventor's Desk": "?????",
         "Behind Every Button": "?????", "How It Came": "N????", "Origin Story India": "?????", "Plug and Story": "?????"}

def ask(name, key, tries=5):
    body = json.dumps({"model": MODEL, "state": {"name": name, "channel": CHANNEL}, "questions": Q}).encode()
    for n in range(tries):
        try:
            req = urllib.request.Request(URL, data=body, headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"})
            return json.load(urllib.request.urlopen(req, timeout=30))
        except urllib.error.HTTPError as e:
            if e.code not in (429, 500, 502, 503, 529) or n == tries - 1:
                raise SystemExit(f"TypeSafe answered {e.code}: {e.read().decode(errors='replace')[:300]}")
        except (urllib.error.URLError, TimeoutError):
            if n == tries - 1: raise
        time.sleep(1.5 * 2 ** n)

key = os.environ.get("TYPESAFE_API_KEY") or os.environ.get("VIGIL_V2_TYPESAFE_API_KEY") or sys.exit("no TypeSafe key in this shell")
with concurrent.futures.ThreadPoolExecutor(6) as ex:
    res = dict(zip(AVAIL, ex.map(lambda n: ask(n, key), AVAIL)))
rows = []
for name, r in res.items():
    a = r["answers"]; s = {k: a[k]["score"] / (len(Q[k]["criteria"]) - 1) for k in W}
    total = sum(W[k] * s[k] for k in W) - 0.15 * a["odd"]["noul"] - 0.10 * a["generic"]["noul"]
    rows.append({"name": name, "total": round(total, 3), **{k: round(v, 2) for k, v in s.items()},
                 "odd": round(a["odd"]["noul"], 2), "generic": round(a["generic"]["noul"], 2), "avail": AVAIL[name]})
rows.sort(key=lambda x: -x["total"])
json.dump(rows, open("out/gadget/name_rank.json", "w"), indent=1)
print(f"{'name':22} total remem mean india click  odd  gen  avail(YT/IG/X/com/in)")
for x in rows:
    print(f"{x['name']:22} {x['total']:.3f} {x['remember']:.2f}  {x['meaning']:.2f} {x['pan_india']:.2f}  {x['click']:.2f}  {x['odd']:.2f} {x['generic']:.2f}  {x['avail']}")
