#!/usr/bin/env python3
"""Data Kadai hot scan: find today's data-bearing official releases and prepare draft content from them.

Sources (original publishers only):
  PIB        every English release of the day from pib.gov.in (all ministries, incl. MoSPI, Finance, Commerce)
  RBI        press-release feed (rbi.org.in)
  SEBI       news feed (sebi.gov.in)
  Lok Sabha  newest questions from the sansad.in API (only when Parliament is sitting; answers are PDFs)

For each item it scores how "data-hot" it is (numbers, tables, state-wise coverage, release type), pulls the
sentences that carry the key figures, and parses every HTML table. When a release has a state-wise table it also
writes a ready-to-review Guess the State / Ranked script from it. Everything is a DRAFT for dk-planner and AK:
numbers are copied from the release, never computed from news reports, and nothing is voiced, rendered or posted.

Writes  public/datayt/hot/<date>.json   every scored item, with text, key lines and tables
        docs/datakadai/hot/<date>.md    the day's shortlist, with links and auto-drafts
        public/datayt/hot/seen.json     ids already reported, so a later run only adds what is new
Run from the repo root: python3 scripts/datayt/hot_scan.py [YYYY-MM-DD] [--days N] [--top N] [--no-seen]
Standard library only. Polite: one request at a time, a short pause between requests.
"""
import datetime, html, http.cookiejar, json, os, re, sys, time, urllib.parse, urllib.request

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"
IST = datetime.timezone(datetime.timedelta(hours=5, minutes=30))
PAUSE = 0.6
OUT_JSON, OUT_MD = "public/datayt/hot", "docs/datakadai/hot"

STATES = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
          "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
          "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
          "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh",
          "Lakshadweep", "Puducherry"]
ALIAS = {"orissa": "Odisha", "uttaranchal": "Uttarakhand", "pondicherry": "Puducherry", "nct of delhi": "Delhi", "a & n islands": "Andaman and Nicobar Islands",
         "andaman & nicobar islands": "Andaman and Nicobar Islands", "andaman & nicobar": "Andaman and Nicobar Islands", "a&n islands": "Andaman and Nicobar Islands",
         "jammu & kashmir": "Jammu and Kashmir", "j&k": "Jammu and Kashmir", "dnh & dd": "Dadra and Nagar Haveli and Daman and Diu",
         "dadra & nagar haveli and daman & diu": "Dadra and Nagar Haveli and Daman and Diu", "the dadra and nagar haveli and daman and diu": "Dadra and Nagar Haveli and Daman and Diu",
         "tamilnadu": "Tamil Nadu", "chattisgarh": "Chhattisgarh", "telengana": "Telangana"}
STATE_KEY = {s.lower(): s for s in STATES} | ALIAS
UTS = {"Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"}

# What makes a release worth a chart. Weights are small integers so the score is easy to read.
DATA_WORDS = {"state-wise": 4, "statewise": 4, "state wise": 4, "district-wise": 2, "per cent": 1, "percent": 1, "year-on-year": 3, "y-o-y": 3, "yoy": 3,
              "growth": 1, "highest": 2, "lowest": 2, "record": 2, "all-time high": 3, "index": 2, "inflation": 3, "cpi": 3, "wpi": 3, "iip": 3,
              "gdp": 3, "gva": 2, "gst": 3, "collection": 1, "exports": 2, "imports": 2, "trade deficit": 3, "production": 1, "survey": 2,
              "census": 3, "estimates": 2, "provisional": 2, "quick estimates": 3, "unemployment": 3, "plfs": 3, "labour force": 3, "payroll": 2,
              "foreign exchange reserves": 3, "forex": 2, "credit growth": 2, "deposits": 1, "fdi": 2, "enrolment": 2, "literacy": 2,
              "mortality": 2, "life expectancy": 3, "fertility": 2, "sex ratio": 3, "rainfall": 2, "sowing": 2, "procurement": 2, "installed capacity": 2,
              "ranking": 2, "ranks": 1, "report released": 2, "releases report": 2, "data released": 3, "factsheet": 2, "fact sheet": 2, "dashboard": 1}
DULL_TITLE = ["condoles", "condolence", "greets", "greetings", "pays tribute", "tributes", "homage", "inaugurates", "inaugurate", "to visit", "visits",
              "addresses", "chairs", "meets", "calls on", "mou", "memorandum", "flags off", "felicitates", "result of the", "written result",
              "appointed", "appointment", "assumes charge", "takes charge", "curtain raiser", "ceremony", "subhashitam", "shares an article",
              "workshop", "conclave", "webinar", "invites bids", "auction", "tender", "awards", "award ", "monetisation", "draft guideline",
              "invites applications", "invites comments", "vrrr", "repo auction", "working paper", "sanctions", "penalty", "cancels", "lays foundation", "foundation stone", "delegation", "bilateral", "exercise", "launches portal"]
HOT_MINISTRY = {"statistics": 5, "finance": 3, "commerce": 3, "labour": 3, "agriculture": 2, "health": 2, "education": 2, "power": 2, "coal": 2,
                "new and renewable": 2, "road transport": 2, "railways": 1, "petroleum": 2, "consumer affairs": 2, "niti": 3, "rural development": 1,
                "housing": 1, "jal shakti": 1, "heavy industries": 1, "steel": 1, "mines": 1, "civil aviation": 2, "communications": 2, "tourism": 1}
NUM = r"(?:₹\s?|Rs\.?\s?)?\d[\d,]*(?:\.\d+)?\s?(?:%|per cent|percent|lakh crore|crore|lakh|million|billion|trillion|MT|MW|GW|km|tonnes?|bps)?"
UNIT_NUM = re.compile(r"(?:₹\s?|Rs\.?\s?)\d[\d,]*(?:\.\d+)?|\d[\d,]*(?:\.\d+)?\s?(?:%|per cent|percent|lakh crore|crore|lakh|million|billion|trillion|MW|GW|bps)", re.I)

_cj = http.cookiejar.CookieJar()
_op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(_cj))
_op.addheaders = [("User-Agent", UA), ("Accept-Language", "en-IN,en;q=0.9")]


def get(url, data=None, tries=3, timeout=45):
    for i in range(tries):
        try:
            time.sleep(PAUSE)
            req = urllib.request.Request(url, urllib.parse.urlencode(data).encode() if data else None)
            return _op.open(req, timeout=timeout).read().decode("utf-8", "replace")
        except Exception as e:      # network hiccup: back off and retry, never crash the whole scan
            err = e; time.sleep(3 * (i + 1))
    print(f"  ! failed {url[:90]}: {err}", file=sys.stderr)
    return ""


def text_of(h):
    h = re.sub(r"<script.*?</script>|<style.*?</style>|<!--.*?-->", " ", h, flags=re.S | re.I)
    h = re.sub(r"</(p|div|li|tr|h\d|br)\s*>|<br\s*/?>", "\n", h, flags=re.I)
    t = html.unescape(re.sub(r"<[^>]+>", " ", h))
    return re.sub(r"[ \t\xa0]+", " ", t)


def clean(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s))).strip()


def tables_of(h):
    """Every HTML table as a list of rows of cell text. Layout tables (one column or one row) are dropped."""
    out = []
    for tb in re.findall(r"<table.*?</table>", h, flags=re.S | re.I):
        if tb.lower().count("<table") > 1:
            continue                      # wrapper table; the inner ones are matched on their own
        rows = [[clean(c) for c in re.findall(r"<t[dh][^>]*>(.*?)</t[dh]>", r, flags=re.S | re.I)] for r in re.findall(r"<tr.*?</tr>", tb, flags=re.S | re.I)]
        rows = [r for r in rows if any(c for c in r)]
        if len(rows) >= 3 and max(len(r) for r in rows) >= 2:
            out.append(rows)
    return out


def to_num(c):
    c = c.replace(",", "").replace("%", "").replace("₹", "").strip()
    c = re.sub(r"^\((.*)\)$", r"-\1", c)
    try:
        return float(c)
    except ValueError:
        return None


def state_of(cell):
    c = re.sub(r"[*#†^]|\(.*?\)", "", cell).strip().lower().replace("&amp;", "&")
    c = re.sub(r"^\d+[.)]?\s*", "", c)
    return STATE_KEY.get(c) or STATE_KEY.get(c.replace(" & ", " and "))


def state_table(rows):
    """If this is a state-wise table, return (name column, header row, {state: row}); else None."""
    width = max(len(r) for r in rows)
    for col in range(min(3, width)):
        hits = {}
        for r in rows:
            if len(r) > col and state_of(r[col]) and state_of(r[col]) not in hits:
                hits[state_of(r[col])] = r
        if len(hits) >= 12:
            first = next(i for i, r in enumerate(rows) if len(r) > col and state_of(r[col]))
            head = rows[first - 1] if first > 0 else []
            return col, head, hits
    return None


# ---- sources ---------------------------------------------------------------------------------------------------

def pib(day):
    """All English PIB (Delhi) releases posted on `day`. The list page is an ASP.NET form: load it, post the date back."""
    url = "https://www.pib.gov.in/allRel.aspx?reg=3&lang=1"
    h = get(url)
    hid = {k: html.unescape(v) for k, v in re.findall(r'<input type="hidden" name="([^"]+)" id="[^"]*" value="([^"]*)"', h)}
    if "__VIEWSTATE" not in hid:
        print("  ! PIB list page changed shape (no form state)", file=sys.stderr); return []
    hid.update({"__EVENTTARGET": "ctl00$ContentPlaceHolder1$ddlday", "ctl00$Bar1$ddlregion": "3", "ctl00$Bar1$ddlLang": "1",
                "ctl00$ContentPlaceHolder1$ddlMinistry": "0", "ctl00$ContentPlaceHolder1$ddlday": str(day.day),
                "ctl00$ContentPlaceHolder1$ddlMonth": str(day.month), "ctl00$ContentPlaceHolder1$ddlYear": str(day.year)})
    r = get(url, hid)
    items, seen = [], set()
    # the list is grouped: <h3>Ministry</h3> followed by its release links
    for block in re.split(r"<h3", r)[1:]:
        ministry = clean(block.split("</h3>")[0].split(">", 1)[-1]) if "</h3>" in block else ""
        for prid, title in re.findall(r'<a[^>]+href=["\'][^"\']*PRID=(\d+)[^"\']*["\'][^>]*>(.*?)</a>', block, flags=re.S):
            if prid not in seen and clean(title):
                seen.add(prid)
                items.append({"id": f"pib-{prid}", "source": "PIB", "publisher": ministry or "PIB", "title": clean(title),
                              "url": f"https://www.pib.gov.in/PressReleasePage.aspx?PRID={prid}", "date": day.isoformat()})
    return items


def pib_body(it):
    h = get(it["url"])
    i = h.find("innner-page-main-about-us-content-right-part")
    body = h[i:] if i >= 0 else h
    j = body.find("Release ID")
    body = body[:j] if j > 0 else body
    m = re.search(r'MinistryNameSubhead[^>]*>(.*?)</div>', body, flags=re.S)
    if m and clean(m.group(1)):
        it["publisher"] = clean(m.group(1))
    m = re.search(r"Posted On:\s*([^<]+)", body)
    it["posted"] = clean(m.group(1)).replace(" by PIB Delhi", "") if m else ""
    k = body.find("Posted On")
    it["tables"] = tables_of(body)
    it["text"] = text_of(body[k:] if k > 0 else body)[:60000]


def feed(url, source, publisher, days, today):
    x = get(url); items = []
    for raw in re.findall(r"<item>(.*?)</item>", x, flags=re.S):
        g = lambda tag: clean(re.sub(r"<!\[CDATA\[|\]\]>", "", (re.search(rf"<{tag}>(.*?)</{tag}>", raw, flags=re.S) or [None, ""])[1]))
        desc_html = html.unescape(re.sub(r"<!\[CDATA\[|\]\]>", "", (re.search(r"<description>(.*?)</description>", raw, flags=re.S) or [None, ""])[1]))
        d = None
        for fmt in ("%a, %d %b %Y %H:%M:%S", "%d %b, %Y", "%d %b %Y"):
            try:
                d = datetime.datetime.strptime(re.sub(r"\s*(GMT|IST|\+\d{4})$", "", g("pubDate")).strip(), fmt).date(); break
            except ValueError:
                pass
        if d and (today - d).days > days:
            continue
        link = g("link")
        items.append({"id": f"{source.lower()}-{re.sub(r'[^0-9a-zA-Z]+', '', link)[-24:]}", "source": source, "publisher": publisher, "title": g("title"),
                      "url": link, "date": (d or today).isoformat(), "posted": g("pubDate"), "text": text_of(desc_html)[:60000], "tables": tables_of(desc_html)})
    return items


def lok_sabha(days, today):
    """Newest Lok Sabha questions. Only the subject line is scored here; the answer (a PDF) is linked for the planner."""
    u = "https://sansad.in/api_ls/question/qetFilteredQuestionsAns?loksabhaNo=18&sessionNumber=&pageNo=1&locale=en&pageSize=100"
    try:
        j = json.loads(get(u) or "[]")
    except ValueError:
        return []
    rows = (j[0] if isinstance(j, list) and j else j or {}).get("listOfQuestions") or []
    items = []
    for q in rows:
        try:
            d = datetime.datetime.strptime(q.get("date", ""), "%d.%m.%Y").date()
        except ValueError:
            continue
        if (today - d).days > days:
            continue
        items.append({"id": f"ls-{q.get('lokNo')}-{q.get('sessionNo')}-{q.get('type', '')[:1]}{q.get('quesNo')}", "source": "Lok Sabha",
                      "publisher": (q.get("ministry") or "").title(), "title": q.get("subjects") or "", "url": q.get("questionsFilePath") or "",
                      "date": d.isoformat(), "posted": q.get("date", ""), "text": q.get("subjects") or "", "tables": []})
    return items


# ---- scoring and drafting --------------------------------------------------------------------------------------

def key_lines(text, n=5):
    """The sentences that carry the figures: most unit-numbers first, headline-ish lines preferred."""
    sents = [s.strip() for s in re.split(r"(?<=[.!?])\s+|\n+", text) if 40 <= len(s.strip()) <= 320]
    scored = []
    for i, s in enumerate(sents):
        u = len(UNIT_NUM.findall(s))
        if u:
            w = u * 2 + sum(v for k, v in DATA_WORDS.items() if k in s.lower()) * 0.5 - i * 0.03
            scored.append((w, i, s))
    top = sorted(scored, reverse=True)[:n]
    return [s for _, _, s in sorted(top, key=lambda x: x[1])]


def score(it):
    t = (it["title"] + " " + it.get("text", "")).lower(); title = it["title"].lower()
    why = []; sc = 0.0
    units = len(UNIT_NUM.findall(it.get("text", "")))
    sc += min(8, units * 0.4)
    if units >= 5:
        why.append(f"{units} figures with units")
    kw = sorted(((v, k) for k, v in DATA_WORDS.items() if k in t), reverse=True)
    sc += min(10, sum(v for v, _ in kw) * 0.6)
    if kw:
        why.append("mentions " + ", ".join(k for _, k in kw[:4]))
    states = {s for s in STATES if s.lower() in t}
    if len(states) >= 8:
        sc += 4; why.append(f"names {len(states)} states")
    st_tabs = [x for x in (state_table(r) for r in it.get("tables", [])) if x]
    data_tabs = [r for r in it.get("tables", []) if sum(1 for row in r for c in row[1:] if to_num(c) is not None) >= 6]
    if st_tabs:
        sc += 10; why.append(f"state-wise table ({max(len(x[2]) for x in st_tabs)} states): map-ready")
    elif data_tabs:
        sc += 4; why.append(f"{len(data_tabs)} data table(s)")
    for k, v in HOT_MINISTRY.items():
        if k in it.get("publisher", "").lower():
            sc += v; why.append(f"{it['publisher']}"); break
    if any(d in title for d in DULL_TITLE):
        sc -= 6
    if it["source"] == "Lok Sabha":
        sc += 3 if re.search(r"state[- ]?wise|number of|status of|data", title) else 0
    it["score"] = round(sc, 1); it["why"] = why
    it["state_tables"] = len(st_tabs); it["key_lines"] = key_lines(it.get("text", ""))
    return it


def draft_from_state_table(it):
    """A Guess the State / Ranked draft straight from a state-wise table in the release. Wording needs a human pass:
    the label is the column heading as published."""
    drafts = []
    for rows in it.get("tables", []):
        st = state_table(rows)
        if not st:
            continue
        col, head, hits = st
        width = max(len(r) for r in hits.values())
        best = None
        for c in range(width - 1, col, -1):            # prefer the right-most numeric column (usually the latest period)
            vals = {s: to_num(r[c]) for s, r in hits.items() if len(r) > c and to_num(r[c]) is not None}
            if len(vals) >= 12 and len(set(vals.values())) > 5:
                best = (c, vals); break
        if not best:
            continue
        c, vals = best
        label = (head[c] if len(head) > c and head[c] else "value").strip()
        rk = sorted(vals.items(), key=lambda x: -x[1])
        (a, va), (b, vb) = rk[0], rk[1]
        clear = va > 0 and (va - vb) / abs(va) >= 0.03
        f = lambda v: f"{v:,.1f}".rstrip("0").rstrip(".")
        decoys = [s for s, _ in rk[3:] if s not in UTS][:8]
        decoys = (decoys[len(decoys) // 2:] + decoys)[:2]
        vo = {"hook": f"One state leads India on this: {label}.",
              "quiz": f"Which one? {decoys[0]}, {a}, or {decoys[1]}?" if len(decoys) == 2 else "Which one?",
              "reveal": f"It's {a}!", "fill": f"{f(va)}.", "top": f"Next is {b}, at {f(vb)}.",
              "context": f"Lowest on the list: {rk[-1][0]}, at {f(rk[-1][1])}.", "end": "Where does your state rank? Tell us in the comments."}
        drafts.append({"series": "GUESS THE STATE (hot)", "label_as_published": label, "column": c, "states": len(vals),
                       "top5": [[s, v] for s, v in rk[:5]], "last": list(rk[-1]), "values": vals, "lead_clear": clear, "vo": vo,
                       "checks": ["Rewrite the hook with a plain-English label and unit", "Confirm the column is the latest period and what it measures",
                                  "Absolute totals favour big states: prefer a rate or per-person figure if the release has one"]
                                 + ([] if clear else ["Lead over #2 is under 3%: do not make a #1 claim"])})
    return drafts


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    opt = lambda name, d: next((int(sys.argv[i + 1]) for i, a in enumerate(sys.argv) if a == name and i + 1 < len(sys.argv)), d)
    today = datetime.date.fromisoformat(args[0]) if args else datetime.datetime.now(IST).date()
    days, top_n, use_seen = opt("--days", 1), opt("--top", 15), "--no-seen" not in sys.argv
    os.makedirs(OUT_JSON, exist_ok=True); os.makedirs(OUT_MD, exist_ok=True)
    seen_path = f"{OUT_JSON}/seen.json"
    seen = json.load(open(seen_path)) if use_seen and os.path.exists(seen_path) else {}

    items, counts = [], {}
    for d in range(days, -1, -1):
        day = today - datetime.timedelta(days=d)
        got = pib(day); counts[f"PIB {day.isoformat()}"] = len(got); items += got
    for it in items:
        if it["id"] in seen:
            it["text"], it["tables"] = "", []      # already reported on an earlier run: don't refetch
        else:
            pib_body(it)
    for name, url, pub in (("RBI", "https://www.rbi.org.in/pressreleases_rss.xml", "Reserve Bank of India"),
                           ("SEBI", "https://www.sebi.gov.in/sebirss.xml", "Securities and Exchange Board of India")):
        got = feed(url, name, pub, days, today); counts[name] = len(got); items += got
    got = lok_sabha(days, today); counts["Lok Sabha"] = len(got); items += got

    fresh = [score(it) for it in items if it["id"] not in seen]
    fresh.sort(key=lambda x: -x["score"])
    for it in fresh:
        it["drafts"] = draft_from_state_table(it) if it["state_tables"] else []
    shortlist = [it for it in fresh if it["score"] >= 8][:top_n]

    stamp = datetime.datetime.now(IST).strftime("%Y-%m-%d %H:%M IST")
    path_json = f"{OUT_JSON}/{today.isoformat()}.json"
    old = json.load(open(path_json))["items"] if os.path.exists(path_json) and use_seen else []
    keep = {it["id"]: it for it in old}
    # keep the text and tables only for items worth a second look, so the daily file stays small
    keep.update({it["id"]: {k: v for k, v in it.items() if k not in ("text", "tables")} |
                 ({"text": it.get("text", "")[:6000], "tables": it.get("tables", [])} if it["score"] >= 6 else {}) for it in fresh})
    allit = sorted(keep.values(), key=lambda x: -x.get("score", 0))
    json.dump({"date": today.isoformat(), "scanned": stamp, "counts": counts, "items": allit}, open(path_json, "w"), indent=1, ensure_ascii=False)

    hot = [it for it in allit if it.get("score", 0) >= 8][:top_n]
    md = [f"# Data Kadai hot list: {today.isoformat()}", "", f"Scanned {stamp}. " + " · ".join(f"{k}: {v}" for k, v in counts.items()) + ".",
          f"{len(allit)} items scored, {len(hot)} on the shortlist (score 8+). **Drafts only: check every number against the linked release.**", ""]
    if not hot:
        md.append("Nothing data-heavy enough today. Use the next story in `ops/QUEUE.md`.")
    for i, it in enumerate(hot, 1):
        md += [f"## {i}. {it['title']}", f"- Score {it['score']} · {it['source']} · {it.get('publisher', '')} · {it.get('posted') or it['date']}",
               f"- Link: {it['url']}", f"- Why: {'; '.join(it.get('why', [])) or 'numbers in the text'}"]
        if it.get("key_lines"):
            md += ["- Key figures (verbatim from the release):"] + [f"  - {s}" for s in it["key_lines"]]
        for dr in it.get("drafts", []):
            md += ["", f"**Auto-draft · {dr['series']}** · column \"{dr['label_as_published']}\" · {dr['states']} states/UTs",
                   "", "| Beat | Narration |", "| --- | --- |"] + [f"| {k} | {t} |" for k, t in dr["vo"].items()]
            md += ["", "Top 5: " + " · ".join(f"{s} {v:g}" for s, v in dr["top5"]) + f" · last: {dr['last'][0]} {dr['last'][1]:g}",
                   "Before use: " + "; ".join(dr["checks"]) + "."]
        md.append("")
    md += ["## Next step", "dk-planner picks at most one hot story a day, writes its script from the release itself (not from this summary),",
           "records edition, period and unit, and sends it through the normal review. A hot story jumps the queue only when",
           "its numbers are confirmed against the original release.", ""]
    open(f"{OUT_MD}/{today.isoformat()}.md", "w").write("\n".join(md))
    if use_seen:
        seen.update({it["id"]: today.isoformat() for it in fresh})
        cutoff = (today - datetime.timedelta(days=45)).isoformat()
        json.dump({k: v for k, v in seen.items() if v >= cutoff}, open(seen_path, "w"), indent=0)
    print(f"hot scan {today}: " + ", ".join(f"{k} {v}" for k, v in counts.items()) + f" · new {len(fresh)} · shortlist {len(shortlist)} new / {len(hot)} today"
          + f" · state-wise tables in {sum(1 for it in fresh if it['state_tables'])} releases")
    for it in shortlist[:8]:
        print(f"  {it['score']:5.1f}  {it['source']:9s} {it['title'][:95]}")


if __name__ == "__main__":
    main()
