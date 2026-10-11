#!/usr/bin/env python3
"""Turn the harvested Lok Sabha answers into state-wise tables.

collect_sources.py saved, for every answer of the 18th Lok Sabha that has a state-wise table, the PDF and its text in
../sources/loksabha/s<session>/. This reads each text file and writes the tables as data:

  public/datayt/sources/loksabha/tables/s<session>.json   one entry per table: the answer's ministry, subject, date and
      link; the title lines printed above the table; the header lines as printed; one row of numbers per state or UT;
      the printed total row when there is one; and, where the header names a run of years, the year for each column.

A table is kept when it names at least 20 states or UTs and its rows agree on the number of columns. Column names are
only known for year columns; for the rest the header text is kept as printed for a person to read. Nothing is guessed:
`sum_matches_total` says, per column, whether the state rows add up to the printed total.
Run from the repo root: python3 scripts/datayt/parse_loksabha.py
"""
import collections, glob, json, os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
from collect_sources import state_of, num

RAW = "../sources/loksabha"
OUT = "public/datayt/sources/loksabha/tables"
ROW = re.compile(r"\s*(?:\d+[.)]?\s+)?([A-Za-z&][A-Za-z&.\-' ]+?)\s{2,}(.*\d.*)$")
NUMS = re.compile(r"(?<![A-Za-z])-?\d[\d,]*\.?\d*%?")
YEAR = re.compile(r"(?:19|20)\d\d(?:\s*-\s*\d{2,4})?")
TOTAL = re.compile(r"\s*(?:\d+[.)]?\s+)?(grand total|total|all india|india)\b[ :]*(.*\d.*)$", re.I)


def values(tail):
    return [num(x) for x in NUMS.findall(tail)]


def tables_in(text):
    lines = text.split("\n"); out = []; i = 0
    while i < len(lines):
        m = ROW.match(lines[i]); s = state_of(m.group(1)) if m else None
        if not (s and s != "India"):
            i += 1; continue
        start = i; rows = []; last = i
        while i < len(lines):
            ln = lines[i]; m = ROW.match(ln); s = state_of(m.group(1)) if m else None
            if s and s != "India":
                rows.append((s, values(m.group(2)))); last = i
            elif ln.strip() and not TOTAL.match(ln):
                if i - last > 2:      # a table may wrap a long state name onto the next line; more than that ends it
                    break
            elif TOTAL.match(ln):
                break
            i += 1
        if len({r[0] for r in rows}) < 20:
            continue
        k = collections.Counter(len(v) for _, v in rows).most_common(1)[0][0]
        good = [(s, v) for s, v in rows if len(v) == k and all(x is not None for x in v)]
        if k == 0 or len(good) < 20 or len({s for s, _ in good}) != len(good):
            continue
        total = None
        for ln in lines[last + 1:last + 5]:
            t = TOTAL.match(ln)
            if t and len(values(t.group(2))) == k:
                total = values(t.group(2)); break
        head = [l.rstrip() for l in lines[max(0, start - 12):start] if l.strip()]
        hdr = [h for h in head[-4:] if not re.match(r"\s*\d+[.)]?\s+[A-Z]", h)]
        cols = None
        for take in (hdr[-1:], hdr[-2:], hdr):      # the years are usually on the last header line; a title above may repeat them
            years = [re.sub(r"\s+", "", y) for y in YEAR.findall(" ".join(take))]
            if len(years) == k and len(set(years)) == k:
                cols = years; break
        sums = [None] * k
        if total:
            for j in range(k):
                tot = sum(v[j] for _, v in good)
                sums[j] = bool(total[j]) and abs(tot / total[j] - 1) < 0.01 if total[j] else tot == 0
        out.append({"title_lines": [re.sub(r"\s+", " ", h).strip() for h in head[:-len(hdr)][-4:]] if hdr else [re.sub(r"\s+", " ", h).strip() for h in head[-4:]],
                    "header_lines": [re.sub(r"\s{2,}", " | ", h.strip()) for h in hdr], "n_cols": k, "year_columns": cols,
                    "rows": {s: v for s, v in good}, "rows_dropped": len(rows) - len(good), "total": total, "sum_matches_total": sums})
    return out


def main():
    idx = {q["id"]: q for q in json.load(open("public/datayt/sources/loksabha/index.json"))["answers"]}
    os.makedirs(OUT, exist_ok=True)
    by_ses = collections.defaultdict(list); n_ans = n_tab = n_year = n_total = 0
    for f in sorted(glob.glob(f"{RAW}/s*/*.txt")):
        qid = os.path.basename(f)[:-4]; q = idx.get(qid)
        if not q:
            continue
        tabs = tables_in(open(f, errors="replace").read())
        if not tabs:
            continue
        n_ans += 1
        for b, t in enumerate(tabs, 1):
            n_tab += 1; n_year += bool(t["year_columns"]); n_total += bool(t["total"])
            by_ses[qid.split("-")[1]].append({"id": f"{qid}#{b}", "answer": qid, "ministry": q["ministry"].strip(), "subject": q["subject"], "date": q["date"],
                                             "type": q["type"], "no": q["no"], "url": q["url"], **t})
    for ses, rows in sorted(by_ses.items()):
        json.dump({"source": "sansad.in, 18th Lok Sabha questions and answers", "made_by": "scripts/datayt/parse_loksabha.py",
                   "note": "numbers as printed in the answer's annexure; column names are known only where the header is a run of years; read the answer before use",
                   "tables": rows}, open(f"{OUT}/{ses}.json", "w"), ensure_ascii=False, separators=(",", ":"))
    print(f"{n_tab} tables from {n_ans} answers; {n_year} with year columns; {n_total} with a printed total row")
    print("by ministry:", collections.Counter(r["ministry"] for rows in by_ses.values() for r in rows).most_common(14))


if __name__ == "__main__":
    main()
