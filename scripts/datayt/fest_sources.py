#!/usr/bin/env python3
"""Data Kadai festival Shorts (16 Oct 2026): state tables for three CPI divisions, and a fresh check of the all-India item table.

Input: raw reads of MoSPI's eSankhyiki data service (api.mospi.gov.in/api/cpi/getCPIData, base 2024, series Current, sector
Combined), saved page by page in research/2026-10-16/festival/raw/:
  div3_m9_p*.json, div3_m8_p*.json     division 03, Clothing and footwear (the service's division_code 3), September and August 2026
  div7_m9_p*.json, div7_m8_p*.json     division 07, Transport (division_code 7)
  div12_m9_p*.json                     division 13, Personal care, social protection and miscellaneous goods and services (the
                                       service numbers divisions by position, so division 13 is division_code 12)
  items_m9_p1..7.json                  every all-India row for September 2026, read again on 16 Oct
  read_at.txt                          when the reads were made (UTC)
Output: public/datayt/sources/mospi/cpi2024_states_divisions_2026_09.json in the Handbook's shape (the all-India row "India"),
read with {"tbl": ["mospi/cpi2024_states_divisions_2026_09", column]}. Every division and group row of the three divisions is a
column ("<code> <name> Sep 2026"); a class row only where asked (CLASSES). MoSPI cautions that state-level item indices can rest
on thin samples, so no item row is saved by state.
It also compares the fresh all-India read with public/datayt/sources/mospi/cpi2024_allindia_items_2026_09.json (read 15 Oct) and
stops if any row differs.
Usage (repo root): python3 scripts/datayt/fest_sources.py <raw folder>
"""
import glob, json, os, sys
RAW = sys.argv[1]; OUT = "public/datayt/sources/mospi"
NAME = {"Andaman And Nicobar Islands": "Andaman and Nicobar Islands", "Jammu And Kashmir": "Jammu and Kashmir", "NCT of Delhi": "Delhi", "Chandigarh*": "Chandigarh",
        "The Dadra And Nagar Haveli And Daman And Diu": "Dadra and Nagar Haveli and Daman and Diu", "All India": "India"}
nm = lambda s: NAME.get(s, s)
num = lambda x: None if x in (None, "", "-") else float(x)
CLASSES = {"13.2.1"}      # jewellery and watches: one class shown by state, with MoSPI's caution in the note
read_at = open(os.path.join(RAW, "read_at.txt")).read().strip()


def rows(pattern):
    out = []
    for f in sorted(glob.glob(os.path.join(RAW, pattern)), key=lambda f: int(f.rsplit("_p", 1)[1][:-5])):
        d = json.load(open(f)); assert "data" in d, f"{f}: {d}"
        out += d["data"]
    return out


states, columns = {}, []
for div, code, months in (("div3", "03", ("Sep", "Aug")), ("div7", "07", ("Sep", "Aug")), ("div12", "13", ("Sep",))):
    for mon in months:
        rs = rows(f"{div}_m{9 if mon == 'Sep' else 8}_p*.json")
        assert rs and all(r["month"] == ("September" if mon == "Sep" else "August") and r["year"] == "2026" and r["sector"] == "Combined" for r in rs), f"{div} {mon}: wrong month or sector"
        assert all((r["code"] or "").startswith(code) for r in rs), f"{div}: a row from another division"
        assert len({r["state"] for r in rs}) == 37, f"{div} {mon}: {len({r['state'] for r in rs})} states, not 37 (36 and All India)"
        for r in rs:
            level = "item" if r["item"] else "sub_class" if r["sub_class"] else "class" if r["class"] else "group" if r["group"] else "division"
            if level in ("item", "sub_class") or (level == "class" and r["code"] not in CLASSES):
                continue
            name = r["class"] or r["group"] or r["division"]
            col = f"{r['code']} {name} {mon} 2026"
            if col not in columns:
                columns.append(col)
            states.setdefault(nm(r["state"]), {})[col] = num(r["inflation"])
assert len(states) == 37 and "India" in states
os.makedirs(OUT, exist_ok=True)
json.dump({"title": "Consumer Price Index (base 2024=100): year-on-year inflation by state for three divisions and their groups (clothing and footwear, transport, personal care and miscellaneous), September 2026 (provisional) and August 2026",
           "publisher": "Ministry of Statistics and Programme Implementation (National Statistics Office)", "url": "https://esankhyiki.mospi.gov.in/macroindicators?product=cpi",
           "unit": ["(inflation in per cent, year on year)"], "columns": columns,
           "notes": [f"MoSPI eSankhyiki data service (api.mospi.gov.in/api/cpi/getCPIData, base_year 2024, series Current, sector Combined, level Division), read {read_at}. The service numbers divisions by position: division 13 is division_code 12.",
                     "September 2026 is provisional and is revised with October's release on 12 Nov 2026. August 2026 is final.",
                     "MoSPI: state-level item indices should be interpreted and used with caution, as the indices for some items may have been compiled using thin samples of price quotations. Only division and group rows are saved by state, and one class (13.2.1 jewellery and watches)."],
           "states": states}, open(f"{OUT}/cpi2024_states_divisions_2026_09.json", "w"), ensure_ascii=False, indent=1)
print(f"wrote {OUT}/cpi2024_states_divisions_2026_09.json: {len(columns)} columns, {len(states)} rows")

# ---------------------------------------------------------------- the all-India items, read again: every row must match yesterday's table
saved = json.load(open(f"{OUT}/cpi2024_allindia_items_2026_09.json"))["items"]
fresh = {(r["code"] or "00"): r for r in rows("items_m9_p*.json") if r["state"] == "All India"}
diff = []
for code, row in saved.items():
    f = fresh.get(code)
    if f is None:
        diff.append(f"{code} {row['name']}: not in the fresh read"); continue
    if num(f["inflation"]) != row["Sep 2026"] or num(f["index"]) != row["index Sep 2026"]:
        diff.append(f"{code} {row['name']}: saved {row['Sep 2026']} / {row['index Sep 2026']}, fresh {f['inflation']} / {f['index']}")
assert not diff, "the fresh read differs:\n" + "\n".join(diff)
print(f"all {len(saved)} saved all-India rows match the fresh read of {read_at}")
