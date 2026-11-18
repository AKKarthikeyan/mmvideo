# Week-topic ranker for The Inventor's Desk (25 Oct 2026). AK: views stuck under 200, wants viral topics for a world
# audience. Jev (TypeSafe) judges each candidate's title + hook on what code can't: scroll-stopping curiosity, global
# everyday relevance, instant clarity, urge to share/comment, and fit for our invention-backstory format. Two flags:
# already-saturated (done to death) and risky (health advice, disputed, gory, political). Code owns the weights.
# A Jev score judges the wording, not a forecast of views; facts are checked separately before any script.
# Run on the Mini: zsh -lic 'TYPESAFE_API_KEY=$VIGIL_V2_TYPESAFE_API_KEY python3 scripts/gadget/topic_jev.py'
import concurrent.futures, json, os, sys, time, urllib.error, urllib.request

URL, MODEL = "https://api.typesafe.ai/v1/systemone", "jev-1.13.0"
CHANNEL = ("A YouTube Shorts channel for a worldwide audience of curious 12-year-olds and their parents. Each Short "
           "explains one everyday object or one current science story: the hidden reason it works the way it does, the "
           "people who invented it, and the simple science, with real patents and sources on screen.")
Q = {
    "curiosity": {"type": "score", "instructions": "Scrolling YouTube Shorts and seeing the title in `title` with the opening line in `hook`, how strongly would an ordinary viewer anywhere in the world feel they must watch to find out the answer?", "criteria": [
        "Not at all: the answer is obvious, or the question feels like a school lesson.",
        "Mild interest: a reasonable question, but easy to scroll past.",
        "Strong pull: a real 'wait, why?' that most people have never thought about.",
        "Irresistible: a surprising question about something they see or use every day, or a jaw-dropping true claim, that they need answered now."]},
    "everyday": {"type": "score", "instructions": "How familiar is the subject in `title` to ordinary people in every country, from India to Brazil to the USA?", "criteria": [
        "Niche or local: most viewers have never seen or used it.",
        "Known from news or school, but not part of daily life.",
        "Common in many countries' daily life.",
        "Almost everyone on earth sees, uses or experiences it, often daily."]},
    "clear": {"type": "score", "instructions": "How quickly would a viewer understand what the Short in `title` is about, with no context, in under two seconds?", "criteria": [
        "Confusing: needs explanation before the question even makes sense.",
        "Understandable after a second read.",
        "Clear on first read.",
        "Instantly clear and visual: the viewer can picture the object or event immediately."]},
    "share": {"type": "score", "instructions": "After watching a Short that answers `title`, how likely is a viewer to send it to someone, comment, or rewatch?", "criteria": [
        "Unlikely: interesting but forgettable.",
        "Some chance: a nice fact.",
        "Likely: a fact people repeat at dinner or argue about in comments.",
        "Very likely: a mind-blowing reveal people tag friends on or test themselves at home."]},
    "fit": {"type": "score", "instructions": "How well does `title` fit `channel`: a real invention story or hidden engineering/science reason that can be explained simply and drawn as animation?", "criteria": [
        "Poor fit: no invention or science behind it, or impossible to show.",
        "Weak fit: some science but no story.",
        "Good fit: a clear hidden reason or invention story.",
        "Perfect fit: a vivid invention story plus a simple, drawable mechanism."]},
    "saturated": {"type": "noul", "instructions": "Is the question in `title` one of the very common 'did you know' facts that most science Shorts channels have already covered many times?"},
    "risky": {"type": "noul", "instructions": "Does the subject of `title` involve medical or diet advice, gore, a disputed or political claim, or a danger that viewers might copy?"},
}
W = {"curiosity": 0.32, "everyday": 0.2, "clear": 0.16, "share": 0.2, "fit": 0.12}

def ask(c, key, tries=5):
    body = json.dumps({"model": MODEL, "state": {"title": c["title"], "hook": c["hook"], "channel": CHANNEL}, "questions": Q}).encode()
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

key = os.environ.get("TYPESAFE_API_KEY") or sys.exit("no TypeSafe key in this shell")
C = json.load(open(sys.argv[1] if len(sys.argv) > 1 else "scripts/gadget/topic_candidates_w45.json"))
with concurrent.futures.ThreadPoolExecutor(6) as ex:
    res = list(ex.map(lambda c: ask(c, key), C))
rows = []
for c, r in zip(C, res):
    a = r["answers"]; s = {k: a[k]["score"] / (len(Q[k]["criteria"]) - 1) for k in W}
    total = sum(W[k] * s[k] for k in W) - 0.12 * a["saturated"]["noul"] - 0.2 * a["risky"]["noul"]
    rows.append({**c, "total": round(total, 3), **{k: round(v, 2) for k, v in s.items()}, "saturated": round(a["saturated"]["noul"], 2), "risky": round(a["risky"]["noul"], 2)})
rows.sort(key=lambda x: -x["total"])
os.makedirs("out/gadget", exist_ok=True); json.dump(rows, open("out/gadget/topic_rank_w45.json", "w"), indent=1)
print(f"{'id':5} total curio every clear share fit  sat  risk  title")
for x in rows:
    print(f"{x['id']:5} {x['total']:.3f} {x['curiosity']:.2f}  {x['everyday']:.2f}  {x['clear']:.2f}  {x['share']:.2f}  {x['fit']:.2f} {x['saturated']:.2f} {x['risky']:.2f}  {x['title']}")
