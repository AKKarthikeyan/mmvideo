#!/usr/bin/env python3
"""Data Kadai source collection: pull state-wise data from official publishers and file it for the story builders.

  rbi        RBI Handbook of Statistics on Indian States: every table (XLSX), parsed to {state: {period: value}}
  plfs       MoSPI API, Periodic Labour Force Survey: LFPR, WPR, UR by state, sex, sector and year
  cpi        MoSPI API, Consumer Price Index: state-wise general index and inflation, latest months
  loksabha   Lok Sabha answers (18th Lok Sabha): download each answer PDF, keep the ones with a state-wise table
  catalog    write docs/datakadai/SOURCES_CATALOG.md from what has been collected

Raw files (XLSX, PDF, API pages) go to ../sources/<name>/ beside the repo on DarwinSSD and stay out of git.
Parsed, state-wise tables go to public/datayt/sources/<name>/ in the repo. Nothing here is story-ready by itself:
a table is used only after its numbers are checked against the publisher's own file (dk-planner's rule).
Run from the repo root: python3 scripts/datayt/collect_sources.py <name> [options]
"""
import datetime, glob, html, json, os, re, subprocess, sys, time, urllib.parse, urllib.request

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"
RAW = os.path.abspath("../sources")
OUT = "public/datayt/sources"
STATES = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
          "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
          "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
          "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh",
          "Lakshadweep", "Puducherry"]
ALIAS = {"orissa": "Odisha", "uttaranchal": "Uttarakhand", "pondicherry": "Puducherry", "nct of delhi": "Delhi", "nct delhi": "Delhi",
         "a & n islands": "Andaman and Nicobar Islands", "andaman & nicobar islands": "Andaman and Nicobar Islands", "andaman & nicobar": "Andaman and Nicobar Islands",
         "a&n islands": "Andaman and Nicobar Islands", "andaman and nicobar": "Andaman and Nicobar Islands", "jammu & kashmir": "Jammu and Kashmir",
         "dadra & nagar haveli and daman & diu": "Dadra and Nagar Haveli and Daman and Diu", "dnh & dd": "Dadra and Nagar Haveli and Daman and Diu",
         "dadra and nagar haveli & daman and diu": "Dadra and Nagar Haveli and Daman and Diu", "dadra & nagar haveli & daman & diu": "Dadra and Nagar Haveli and Daman and Diu",
         "tamilnadu": "Tamil Nadu", "chattisgarh": "Chhattisgarh", "telengana": "Telangana", "all india": "India", "all-india": "India", "india": "India"}
KEY = {s.lower(): s for s in STATES} | ALIAS
import ssl
CTX = ssl.create_default_context()
CTX.options |= 0x4          # OP_LEGACY_SERVER_CONNECT: api.mospi.gov.in still needs legacy TLS renegotiation


def state_of(cell):
    c = re.sub(r"[*#†^@$]|\(.*?\)", "", str(cell)).strip().lower().replace("&amp;", "&")
    c = re.sub(r"^\d+[.)]?\s*", "", c).strip(" .")
    return KEY.get(c) or KEY.get(c.replace(" & ", " and "))


def get(url, tries=3, timeout=60, binary=False):
    err = None
    for i in range(tries):
        try:
            time.sleep(0.4)
            b = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=timeout, context=CTX).read()
            return b if binary else b.decode("utf-8", "replace")
        except Exception as e:
            err = e; time.sleep(3 * (i + 1))
    print(f"  ! failed {url[:100]}: {err}", file=sys.stderr)
    return b"" if binary else ""


def num(c):
    if isinstance(c, (int, float)):
        return c
    s = re.sub(r"[*#@^$†]+$", "", str(c).replace(",", "").replace("%", "").strip()).strip()      # drop footnote marks
    try:
        return float(s)
    except ValueError:
        return None


def save(path, obj):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    json.dump(obj, open(path, "w"), indent=1, ensure_ascii=False)


# ---- RBI Handbook of Statistics on Indian States ---------------------------------------------------------------
def html_grids(h):
    """Innermost HTML tables as rectangular grids, with colspan and rowspan cells repeated into every slot they cover."""
    clean = lambda x: re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", x))).strip()
    out = []
    for tb in re.findall(r"<table(?:(?!<table).)*?</table>", h, flags=re.S | re.I):
        grid, carry = [], {}
        for tr in re.findall(r"<tr.*?</tr>", tb, flags=re.S | re.I):
            row, c = [], 0
            cells = re.findall(r"<t[dh]([^>]*)>(.*?)</t[dh]>", tr, flags=re.S | re.I)
            for attr, body in cells:
                while carry.get(c, (0, ""))[0] > 0:
                    row.append(carry[c][1]); carry[c] = (carry[c][0] - 1, carry[c][1]); c += 1
                cs = int((re.search(r"colspan\s*=\s*[\"']?(\d+)", attr, re.I) or [0, 1])[1])
                rs = int((re.search(r"rowspan\s*=\s*[\"']?(\d+)", attr, re.I) or [0, 1])[1])
                v = clean(body)
                for _ in range(cs):
                    row.append(v)
                    if rs > 1:
                        carry[c] = (rs - 1, v)
                    c += 1
            while carry.get(c, (0, ""))[0] > 0:
                row.append(carry[c][1]); carry[c] = (carry[c][0] - 1, carry[c][1]); c += 1
            if any(row):
                grid.append(row)
        if len(grid) >= 6:
            out.append(grid)
    return out


def rbi():
    """The XLSX files sit behind a browser check on rbidocs.rbi.org.in, so each table is read from its own HTML page on
    www.rbi.org.in (PublicationsView.aspx), which carries the same numbers."""
    page = "https://www.rbi.org.in/Scripts/AnnualPublications.aspx?head=Handbook+of+Statistics+on+Indian+States"
    h = get(page)
    tabs = [(int(n), html.unescape(t).strip(), int(i)) for i, n, t in re.findall(r"PublicationsView\.aspx\?id=(\d+)>Table\s+(\d+)\s*:\s*(.*?)</a>", h)]
    raw = f"{RAW}/rbi_handbook"; os.makedirs(raw, exist_ok=True)
    for f in glob.glob(f"{raw}/*.xlsx"):
        os.remove(f)                      # earlier attempts saved the browser-check page, not the workbook
    index = []
    for no, title, vid in tabs:
        url = f"https://www.rbi.org.in/Scripts/PublicationsView.aspx?id={vid}"
        f = f"{raw}/T{no:03d}.html"
        if not os.path.exists(f) or os.path.getsize(f) < 5000:
            open(f, "w").write(get(url))
        grids = html_grids(open(f, encoding="utf-8", errors="replace").read())
        states, cols, units, notes, mism = {}, [], [], [], 0
        for g in grids:
            # transposed layout: states across the top, one row per year
            tr = next((r for r in g if sum(1 for c in r[1:] if state_of(c)) >= 5), None)
            if tr is not None:
                for r in g[g.index(tr) + 1:]:
                    if len(r) == len(tr) and re.match(r"(19|20)\d\d", r[0]):
                        for c, v in zip(tr[1:], r[1:]):
                            st = state_of(c)
                            if st and num(v) is not None:
                                states.setdefault(st, {}).setdefault(r[0], num(v))
                                if r[0] not in cols:
                                    cols.append(r[0])
                for r in g:
                    t = next(iter({c for c in r if c}), "") if len({c for c in r if c}) == 1 else ""
                    if re.match(r"\(.*\)$", t) and t not in units:
                        units.append(t)
                    elif re.search(r"Source\s*:", t) and t[:600] not in notes:
                        notes.append(t[:600])
                continue
            head = []                       # header rows since the last state row
            labels = None
            for r in g:
                s = state_of(r[0]) if r else None
                uniq = {c for c in r if c}
                if len(uniq) == 1:          # a title, unit or note spanning the table
                    t = next(iter(uniq))
                    if re.match(r"\(.*\)$", t) and t not in units:
                        units.append(t)
                    elif re.search(r"Source\s*:", t) and t[:600] not in notes:
                        notes.append(t[:600])
                    continue
                if not s and sum(1 for c in r[1:] if num(c) is not None or c in ("-", ".", "..", "")) >= 0.7 * (len(r) - 1) and not re.search(r"(19|20)\d\d", " ".join(r[1:4])):
                    continue                # a data row for a place we do not map (e.g. the pre-merger UTs)
                if not s:
                    if labels is not None:  # a new header block starts after data rows
                        head, labels = [], None
                    head.append(r); continue
                if labels is None:
                    width = len(r)
                    hr = [x for x in head if len(x) == width][-3:]
                    labels = []
                    for c in range(1, width):
                        parts = []
                        for x in hr:
                            if x[c] and x[c] not in parts and not re.fullmatch(r"\d{1,2}", x[c]):
                                parts.append(x[c])
                        labels.append(" | ".join(parts))
                    if not hr or not any(labels):
                        labels = False
                if not labels or len(r) != len(labels) + 1:
                    mism += 1; continue
                for c, v in zip(labels, r[1:]):
                    if c and re.search(r"[A-Za-z0-9]", c) and num(v) is not None:
                        states.setdefault(s, {}).setdefault(c, num(v))
                        if c not in cols:
                            cols.append(c)
        if len(states) >= 12:
            save(f"{OUT}/rbi_handbook/T{no:03d}.json", {"table": no, "title": title, "publisher": "Reserve Bank of India",
                 "publication": "Handbook of Statistics on Indian States", "url": url, "page": page, "unit": units, "columns": cols,
                 "states": states, "notes": notes, "rows_skipped_header_mismatch": mism})
        index.append({"table": no, "title": title, "url": url, "sheets": 1 if len(states) >= 12 else 0, "states": len(states), "periods": len(cols),
                      "latest": cols[-1] if cols else None, "unit": "; ".join(units)[:60], "skipped_rows": mism})
        print(f"T{no:03d} {title[:64]:64s} states {len(states):2d} cols {len(cols):3d} last {str(cols[-1] if cols else '')[:14]:14s} skipped {mism}", flush=True)
    save(f"{OUT}/rbi_handbook/index.json", {"collected": datetime.date.today().isoformat(), "page": page, "tables": index})
    print(f"rbi: {len(index)} tables, {sum(1 for t in index if t.get('sheets'))} parsed as state-wise")


# ---- MoSPI API ----------------------------------------------------------------------------------------------
def mospi_pages(path, params):
    out, page = [], 1
    while True:
        q = urllib.parse.urlencode({**params, "Format": "JSON", "limit": 200, "page": page})
        try:
            j = json.loads(get(f"https://api.mospi.gov.in{path}?{q}") or "{}")
        except ValueError:
            break
        data = j.get("data") or []
        if not isinstance(data, list) or not data:
            break
        out += data
        if page >= (j.get("meta_data") or {}).get("totalPages", 1):
            break
        page += 1
    return out


def plfs():
    f = json.loads(get("https://api.mospi.gov.in/api/plfs/getFilterByIndicatorId?indicator_code=3&frequency_code=1"))["data"]
    years = [y["year"] for y in f["year"]]
    inds = {1: "LFPR", 2: "WPR", 3: "UR"}
    allrows = []
    for code, short in inds.items():
        for y in years:
            yt = 1 if "-" in y else 2
            rows = mospi_pages("/api/plfs/getData", {"indicator_code": code, "frequency_code": 1, "year_type_code": yt, "year": y, "age_code": 1,
                                                     "weekly_status_code": 1, "religion_code": 1, "social_category_code": 1, "education_code": 0})
            for r in rows:
                r["short"] = short
            allrows += rows
            print(f"plfs {short} {y}: {len(rows)} rows")
    os.makedirs(f"{RAW}/mospi", exist_ok=True)
    json.dump(allrows, open(f"{RAW}/mospi/plfs_annual.json", "w"))
    # {indicator: {year: {sector: {gender: {state: value}}}}}
    tree = {}
    for r in allrows:
        s = state_of(r["state"]) or r["state"]
        v = num(r["value"])
        if v is None:
            continue
        tree.setdefault(r["short"], {}).setdefault(r["year"], {}).setdefault(r["sector"], {}).setdefault(r["gender"], {})[s] = v
    save(f"{OUT}/mospi/plfs_annual.json", {"publisher": "MoSPI (NSO), Periodic Labour Force Survey", "via": "https://api.mospi.gov.in/api/plfs/getData",
         "collected": datetime.date.today().isoformat(), "basis": "age 15 years and above, usual status (PS+SS), all religions, all social groups, all education levels",
         "unit": "per cent", "indicators": {"LFPR": "Labour Force Participation Rate", "WPR": "Worker Population Ratio", "UR": "Unemployment Rate"}, "data": tree})
    print(f"plfs: {len(allrows)} rows, years {sorted(tree.get('UR', {}))}")


def cpi():
    rows = []
    for y in (datetime.date.today().year, datetime.date.today().year - 1):
        rows += mospi_pages("/api/cpi/getCPIIndex", {"base_year": 2012, "series": "Current", "year": y, "group_code": 0})
    if not rows:      # filter names differ between releases of the API: fall back to the unfiltered feed and keep the general index
        rows = [r for y in (datetime.date.today().year, datetime.date.today().year - 1)
                for r in mospi_pages("/api/cpi/getCPIIndex", {"base_year": 2012, "series": "Current", "year": y})]
    os.makedirs(f"{RAW}/mospi", exist_ok=True)
    json.dump(rows, open(f"{RAW}/mospi/cpi.json", "w"))
    tree = {}
    for r in rows:
        if "general" not in str(r.get("group", "")).lower():
            continue
        s = state_of(r["state"]) or r["state"]
        tree.setdefault(f"{r['year']}-{r['month']}", {}).setdefault(r["sector"], {})[s] = {"index": num(r.get("index")), "inflation": num(r.get("inflation")), "status": r.get("status")}
    save(f"{OUT}/mospi/cpi_general.json", {"publisher": "MoSPI (NSO), Consumer Price Index, base 2012", "via": "https://api.mospi.gov.in/api/cpi/getCPIIndex",
         "collected": datetime.date.today().isoformat(), "unit": "index; inflation in per cent year on year", "data": tree})
    print(f"cpi: {len(rows)} rows, months {sorted(tree)[-4:]}")


# ---- Lok Sabha answers -----------------------------------------------------------------------------------------
def state_tables(text):
    """Blocks of consecutive lines that start with a state name and carry at least one number."""
    blocks, cur = [], []
    for ln in text.split("\n"):
        m = re.match(r"\s*(?:\d+[.)]?\s+)?([A-Za-z&][A-Za-z&. ]+?)\s{2,}(.*\d.*)$", ln)
        s = state_of(m.group(1)) if m else None
        if s and s != "India":
            cur.append((s, re.findall(r"-?\d[\d,]*\.?\d*", m.group(2))))
        elif cur and not ln.strip():
            continue
        else:
            if len({c[0] for c in cur}) >= 12:
                blocks.append(cur)
            cur = []
    if len({c[0] for c in cur}) >= 12:
        blocks.append(cur)
    return blocks


def loksabha():
    sessions = [a for a in sys.argv[2:] if a.isdigit()] or ["8", "7"]
    raw = f"{RAW}/loksabha"; os.makedirs(raw, exist_ok=True)
    idx_path = f"{OUT}/loksabha/index.json"
    index = {q["id"]: q for q in (json.load(open(idx_path))["answers"] if os.path.exists(idx_path) else [])}
    done_path = f"{raw}/done.json"
    done = set(json.load(open(done_path))) if os.path.exists(done_path) else set()
    for ses in sessions:
        page = 1
        while True:
            u = f"https://sansad.in/api_ls/question/qetFilteredQuestionsAns?loksabhaNo=18&sessionNumber={ses}&pageNo={page}&locale=en&pageSize=100"
            try:
                j = json.loads(get(u) or "[]")
            except ValueError:
                j = []
            qs = ((j[0] if isinstance(j, list) and j else j) or {}).get("listOfQuestions") or []
            if not qs:
                break
            for q in qs:
                qid = f"ls18-s{q.get('sessionNo')}-{(q.get('type') or 'U')[0]}{q.get('quesNo')}"
                if qid in done or not q.get("questionsFilePath"):
                    continue
                pdf = f"{raw}/s{ses}/{qid}.pdf"; os.makedirs(os.path.dirname(pdf), exist_ok=True)
                if not os.path.exists(pdf):
                    b = get(q["questionsFilePath"], binary=True, tries=2)
                    if b[:4] != b"%PDF":
                        continue
                    open(pdf, "wb").write(b)
                txt = subprocess.run(["pdftotext", "-layout", pdf, "-"], capture_output=True, text=True).stdout
                blocks = state_tables(txt)
                done.add(qid)
                if blocks:
                    open(pdf[:-4] + ".txt", "w").write(txt)
                    asof = re.findall(r"as on\s+([0-9]{1,2}[./-][0-9]{1,2}[./-][0-9]{2,4}|[0-9]{1,2}(?:st|nd|rd|th)?\s+\w+,?\s+\d{4})", txt, flags=re.I)[:3]
                    index[qid] = {"id": qid, "date": q.get("date"), "ministry": (q.get("ministry") or "").title(), "subject": (q.get("subjects") or "").strip(),
                                  "type": q.get("type"), "no": q.get("quesNo"), "url": q["questionsFilePath"], "tables": len(blocks),
                                  "states": max(len({c[0] for c in b}) for b in blocks), "as_on": asof}
                else:
                    os.remove(pdf)      # no state-wise table: keep the disk for the ones that matter
            print(f"session {ses} page {page}: {len(done)} answers read, {len(index)} with state-wise tables", flush=True)
            json.dump(sorted(done), open(done_path, "w"))
            save(idx_path, {"collected": datetime.date.today().isoformat(), "source": "sansad.in, 18th Lok Sabha questions and answers",
                            "note": "answers whose text has a table naming 12 or more states/UTs; the PDF and its text are in ../sources/loksabha/",
                            "answers": sorted(index.values(), key=lambda x: x["id"])})
            page += 1


# ---- catalog ---------------------------------------------------------------------------------------------------
def catalog():
    md = ["# Data Kadai: source catalog", "", f"Written {datetime.date.today().isoformat()} by `scripts/datayt/collect_sources.py catalog`.",
          "Parsed tables are in `public/datayt/sources/`; the publishers' own files are in `../sources/` on DarwinSSD.",
          "**A table is story-ready only after its numbers are checked against the publisher's file.**", ""]
    p = f"{OUT}/rbi_handbook/index.json"
    if os.path.exists(p):
        t = json.load(open(p))["tables"]; ok = [x for x in t if x.get("sheets")]
        md += [f"## RBI Handbook of Statistics on Indian States ({len(ok)} of {len(t)} tables parsed)", "", "| Table | Title | States | Columns | Last column |", "| --- | --- | --- | --- | --- |"]
        md += [f"| {x['table']} | [{x['title']}]({x['url']}) | {x.get('states', 0)} | {x.get('periods', 0)} | {str(x.get('latest') or '')[:40]} |" for x in t]
        md.append("")
    p = f"{OUT}/mospi/plfs_annual.json"
    if os.path.exists(p):
        d = json.load(open(p))["data"]
        md += ["## MoSPI: Periodic Labour Force Survey (API)", "", f"Indicators: {', '.join(d)}. Years: {', '.join(sorted(d.get('UR', {})))}. By state, sector and sex; age 15+, usual status.", ""]
    p = f"{OUT}/mospi/cpi_general.json"
    if os.path.exists(p):
        d = json.load(open(p))["data"]
        md += ["## MoSPI: Consumer Price Index (API)", "", f"General index and inflation by state. Months collected: {len(d)}; latest {sorted(d)[-1] if d else 'none'}.", ""]
    p = f"{OUT}/loksabha/index.json"
    if os.path.exists(p):
        a = json.load(open(p))["answers"]
        md += [f"## Lok Sabha answers with a state-wise table ({len(a)})", "", "| Date | Ministry | Subject | States | Link |", "| --- | --- | --- | --- | --- |"]
        md += [f"| {x['date']} | {x['ministry'][:30]} | {x['subject'][:80]} | {x['states']} | [{x['type'][0]}{x['no']}]({x['url']}) |"
               for x in sorted(a, key=lambda x: (x['ministry'], x['date']))]
        md.append("")
    for f in sorted(glob.glob("public/datayt/coverage/*.json")) + ["public/datayt/nfhs6/nfhs6_states.json"]:
        if os.path.exists(f):
            md.append(f"- Also collected earlier: `{f}`")
    md += ["", "## Not collected (and why)", "",
           "| Source | Status |", "| --- | --- |",
           "| GST state-wise collections (gst.gov.in) | Site blocks automated downloads; needs a manual download each month |",
           "| NSE Market Pulse | Site blocks automated requests (403) |",
           "| AMFI state-wise AUM | Download page not located yet |",
           "| Vahan vehicle registrations | Dashboard is an interactive app with no file to download |",
           "| NCRB Crime in India | Tables are PDFs behind per-year pages; not parsed yet |",
           "| SRS, HCES, UDISE+, NITI indices, NFHS-6 district sheets | Report PDFs; several are already summarised in the RBI handbook tables above |",
           "| data.gov.in API | Needs AK's own API key |",
           "| Rajya Sabha answers | No working API found; only Lok Sabha is harvested |", ""]
    open("docs/datakadai/SOURCES_CATALOG.md", "w").write("\n".join(md))
    print("catalog written")


if __name__ == "__main__":
    {"rbi": rbi, "plfs": plfs, "cpi": cpi, "loksabha": loksabha, "catalog": catalog}[sys.argv[1]]()
