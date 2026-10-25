# Read public YouTube pages: a channel's most popular videos/Shorts, and view-sorted search results.
#   python3 ytpop.py channels out.json @RealLifeLore @AtlasPro ...
#   python3 ytpop.py search out.json "query one" "query two" ...
import json, re, sys, time, urllib.parse, requests

UA = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9"}
S = requests.Session(); S.headers.update(UA); S.cookies.set("CONSENT", "YES+1", domain=".youtube.com")

def page(url):
    h = S.get(url, timeout=30).text
    d = json.loads(re.search(r"var ytInitialData = (\{.*?\});</script>", h, re.S).group(1))
    key = re.search(r'"INNERTUBE_API_KEY":"([^"]+)"', h).group(1)
    ver = re.search(r'"INNERTUBE_CLIENT_VERSION":"([^"]+)"', h).group(1)
    return d, key, ver

def walk(o):
    if isinstance(o, dict):
        yield o
        for v in o.values(): yield from walk(v)
    elif isinstance(o, list):
        for v in o: yield from walk(v)

def txt(x):
    if not x: return ""
    if isinstance(x, str): return x
    if "simpleText" in x: return x["simpleText"]
    if "runs" in x: return "".join(r.get("text", "") for r in x["runs"])
    if "content" in x: return x["content"]
    return ""

def views(s):
    s = s.replace(",", "").lower()
    m = re.search(r"([\d.]+)\s*([kmb]?)\s*views", s)
    if not m: return None
    return int(float(m.group(1)) * {"": 1, "k": 1e3, "m": 1e6, "b": 1e9}[m.group(2)])

def items(d):
    out = []
    for o in walk(d):
        if "videoRenderer" in o:
            v = o["videoRenderer"]
            out.append({"id": v.get("videoId"), "title": txt(v.get("title")), "views": views(txt(v.get("viewCountText"))),
                        "age": txt(v.get("publishedTimeText")), "len": txt(v.get("lengthText")), "channel": txt(v.get("ownerText")), "kind": "video"})
        elif "reelItemRenderer" in o:
            v = o["reelItemRenderer"]
            out.append({"id": v.get("videoId"), "title": txt(v.get("headline")), "views": views(txt(v.get("viewCountText"))), "kind": "short"})
        elif "shortsLockupViewModel" in o:
            v = o["shortsLockupViewModel"]; om = v.get("overlayMetadata", {})
            vid = (v.get("onTap", {}).get("innertubeCommand", {}).get("reelWatchEndpoint", {}) or {}).get("videoId")
            out.append({"id": vid, "title": txt(om.get("primaryText")), "views": views(txt(om.get("secondaryText"))), "kind": "short"})
        elif "lockupViewModel" in o and o["lockupViewModel"].get("contentType") == "LOCKUP_CONTENT_TYPE_VIDEO":
            v = o["lockupViewModel"]; md = v.get("metadata", {}).get("lockupMetadataViewModel", {})
            rows = [p.get("text", {}).get("content", "") for r in md.get("metadata", {}).get("contentMetadataViewModel", {}).get("metadataRows", [])
                    for p in r.get("metadataParts", [])]
            vw = next((views(r) for r in rows if "view" in r.lower()), None)
            out.append({"id": v.get("contentId"), "title": txt(md.get("title")), "views": vw, "age": next((r for r in rows if "ago" in r), ""), "kind": "video"})
    seen, res = set(), []
    for x in out:
        if x["id"] and x["id"] not in seen: seen.add(x["id"]); res.append(x)
    return res

def browse(key, ver, token):
    r = S.post(f"https://www.youtube.com/youtubei/v1/browse?key={key}", timeout=30,
               json={"context": {"client": {"clientName": "WEB", "clientVersion": ver, "hl": "en", "gl": "US"}}, "continuation": token})
    return r.json()

def channel(handle):
    res = {"handle": handle}
    for tab in ("videos", "shorts"):
        try:
            d, key, ver = page(f"https://www.youtube.com/{handle}/{tab}")
            if tab == "videos":
                for o in walk(d):
                    for k in ("subscriberCountText",):
                        if k in o: res["subs"] = txt(o[k])
                    if "metadataParts" in o:
                        for p in o["metadataParts"]:
                            t = p.get("text", {}).get("content", "")
                            if "subscriber" in t: res["subs"] = t
                            if t.endswith("videos"): res["n_videos"] = t
            tok = None
            for o in walk(d):
                if "chipViewModel" in o and o["chipViewModel"].get("text") == "Popular":
                    tok = o["chipViewModel"]["tapCommand"]["innertubeCommand"]["continuationCommand"]["token"]
            res[tab] = items(browse(key, ver, tok)) if tok else []
            if not tok: res[tab + "_note"] = "no Popular chip"
        except Exception as e:
            res[tab + "_err"] = repr(e)[:200]
        time.sleep(1.5)
    return res

def search(q, shorts=False):
    sp = "CAM%253D"  # sort by view count
    d, _, _ = page(f"https://www.youtube.com/results?search_query={urllib.parse.quote(q + (' #shorts' if shorts else ''))}&sp={sp}")
    return {"query": q, "items": items(d)}

if __name__ == "__main__":
    mode, out, args = sys.argv[1], sys.argv[2], sys.argv[3:]
    R = []
    for a in args:
        r = channel(a) if mode == "channels" else search(a)
        R.append(r)
        if mode == "channels":
            print(a, r.get("subs"), "| videos", len(r.get("videos", [])), "shorts", len(r.get("shorts", [])), r.get("videos_err", ""), r.get("shorts_err", ""), r.get("videos_note", ""))
        else:
            print(a, len(r["items"]))
        time.sleep(1.5)
    json.dump(R, open(out, "w"), ensure_ascii=False, indent=1)
