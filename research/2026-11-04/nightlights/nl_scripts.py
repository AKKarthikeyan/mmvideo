"""Write the narration for every DATA-nl-<id> Short from public/datayt/nightlights/data.json.

Out: SCRIPTS.md (review sheet with flags) and public/datayt/nightlights/vo/<ID>.txt (text to voice, numbers in words).
  python3 nl_scripts.py
"""
import json, pathlib

HERE = pathlib.Path(__file__).resolve().parent
PUB = HERE.parents[2] / "public" / "datayt" / "nightlights"
ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split()
TENS = "_ _ twenty thirty forty fifty sixty seventy eighty ninety".split()
ORD = {1: "first", 2: "second", 3: "third", 5: "fifth", 8: "eighth", 9: "ninth", 12: "twelfth"}


def words(n):
    n = int(n)
    if n < 20: return ONES[n]
    if n < 100: return TENS[n // 10] + ("" if n % 10 == 0 else " " + ONES[n % 10])
    return "one hundred"


def dec(x):  # 6.2 -> "six point two"
    a, b = f"{x:.1f}".split(".")
    return words(a) + ("" if b == "0" else " point " + ONES[int(b)])


def ordinal(n):
    if n in ORD: return ORD[n]
    w = words(n)
    if n > 20 and n % 10 in ORD: return w.rsplit(" ", 1)[0] + " " + ORD[n % 10]
    return (w[:-1] + "ieth") if w.endswith("y") else w + "th"


def flags(s):
    out = []
    if s["lit"][0] >= 90: out.append("already fully lit in 2012: the story is brightness only")
    if s["nodata_pct"] >= 2: out.append(f"{s['nodata_pct']}% of pixels missing in a year (cloud/snow)")
    if s["area_km2"] < 2000: out.append(f"small ({s['area_km2']} km2): the frame is upscaled")
    if s["ratio"] < 1: out.append("light fell: check before publishing")
    if s["lit"][0] < 2 and s["ratio"] > 5: out.append("tiny 2012 base: a big multiple from little light")
    if s["area_km2"] < 100: out.append("DO NOT POST: islands too small to see in the frame")
    return out


def vo(s):
    n, (l0, l1), r = s["name"], s["lit"], s["ratio"]
    lines = [f"This is {n} at night in twenty twelve, seen from a NASA satellite.",
             f"And this is {n} in twenty twenty-five.",
             f"Add up all the light across the state, and it is {dec(r)} times what it was." if r >= 1.05 else
             f"Add up all the light across the state, and it is about the same as before." if r >= 0.95 else
             f"Add up all the light across the state, and there is less of it than before."]
    if l0 >= 90:
        lines.append(f"{n} was already lit end to end. What changed is how bright it shines.")
    else:
        lines.append(f"In twenty twelve, {words(round(l0))} percent of its land glowed at night. Now, {words(round(l1))} percent.")
    lines += ["Light is not income. But when RBI economists matched night lights with Maharashtra's output, the two moved almost together.",
              f"On this measure, {n} is {ordinal(s['rank'])} of thirty six. What lit it up?"]
    return lines  # six lines: hook, wipe, multiple, lit area, RBI, rank + question


def main():
    d = json.load(open(PUB / "data.json"))
    (PUB / "vo").mkdir(exist_ok=True)
    md = ["# Night lights Shorts: narration and flags", "",
          f"Years {d['years'][0]} vs {d['years'][1]}. Numbers from nl_states.py (NASA VNP46A4, RBI Bulletin Oct 2026 method).",
          "Compositions: `DATA-nl-<ID>` (src/datayt/NightLights.tsx). Word counts aim at 85-100 for about 35 s.", ""]
    for sid, s in sorted(d["states"].items(), key=lambda kv: kv[1]["rank"]):
        lines = vo(s); t = " ".join(lines); (PUB / "vo" / f"{sid}.txt").write_text(t + "\n")
        json.dump(lines, open(PUB / "vo" / f"{sid}.json", "w"), indent=0)
        f = flags(s)
        md += [f"## {s['rank']}. {s['name']} (`{sid}`): {s['ratio']}x light, lit {s['lit'][0]}% -> {s['lit'][1]}%",
               "", f"> {t}", "", f"Words: {len(t.split())}." + (" **Flags:** " + "; ".join(f) + "." if f else ""), ""]
    (HERE / "SCRIPTS.md").write_text("\n".join(md))
    print("wrote", len(d["states"]), "scripts")


if __name__ == "__main__":
    main()
