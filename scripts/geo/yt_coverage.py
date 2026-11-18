# For each topic, search YouTube (relevance order) and record how many matching results already have 100K+ / 1M+ views.
import json, re, sys, time, urllib.parse
exec(open(__file__.rsplit("/", 1)[0] + "/ytpop.py").read().split("if __name__")[0])
STOP = set("why the a an of in to and is was has had its from for on at by with be are once still".split())
def kw(t): return [w for w in re.findall(r"[a-z]+", t.lower()) if w not in STOP and len(w) > 2]
T = json.load(open(sys.argv[1])); out = []
seen = set()
for r in T:
    if r["title"] in seen: continue
    seen.add(r["title"])
    q = " ".join(kw(r["title"]))
    try:
        d, _, _ = page("https://www.youtube.com/results?search_query=" + urllib.parse.quote(q))
        its = items(d)[:20]
    except Exception as e:
        its = []; r["err"] = repr(e)[:80]
    k = set(kw(r["title"]))
    # a result counts as "same topic" if it shares at least half of the topic's key words
    same = [x for x in its if len(k & set(kw(x["title"]))) >= max(2, len(k) // 2)]
    r["n_same"] = len(same); r["n_100k"] = sum((x["views"] or 0) >= 1e5 for x in same); r["n_1m"] = sum((x["views"] or 0) >= 1e6 for x in same)
    r["top"] = max(same, key=lambda x: x["views"] or 0, default=None)
    out.append(r)
    print(f"{r['n_100k']:2d} >=100k {r['n_1m']:2d} >=1M | {r['title']} | top: {(r['top'] or {}).get('views')} {((r['top'] or {}).get('title') or '')[:60]}", flush=True)
    time.sleep(1.2)
json.dump(out, open(sys.argv[2], "w"), ensure_ascii=False, indent=1)
