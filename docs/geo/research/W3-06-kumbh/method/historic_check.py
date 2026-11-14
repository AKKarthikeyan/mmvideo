"""Check period records against sidereal (Lahiri) positions: Hardwicke 1796 (Haridwar), Nasik gazetteer 1872/1873, Allahabad 1906.
Reuses functions from jupiter_signs.py (same Horizons source, same ayanamsa). Run: python3 -I historic_check.py"""
import os, sys, datetime as dt, importlib.util
HERE=os.path.dirname(os.path.abspath(__file__))
spec=importlib.util.spec_from_file_location("js",os.path.join(HERE,"jupiter_signs.py"))
# jupiter_signs runs at import (prints); silence it
import io, contextlib
with contextlib.redirect_stdout(io.StringIO()):
    js=importlib.util.module_from_spec(spec); spec.loader.exec_module(js)
SIGNS=js.SIGNS
H={}
S={}
for a,b in [("1796-01-01","1797-01-01"),("1871-01-01","1875-01-01"),("1905-01-01","1907-01-01"),("1884-01-01","1886-01-01")]:
    H.update(js.horizons(599,a,b)); S.update(js.horizons(10,a,b))
def sid(d,L): return (L[d]-js.ayan(d))%360
def sg(d,L): return SIGNS[int(sid(d,L)//30)]
out=[]
out.append("Lahiri ayanamsa (deg): 1796-04-08 %.3f ; 1873-01-01 %.3f ; 1906-01-15 %.3f"%(js.ayan(dt.date(1796,4,8)),js.ayan(dt.date(1873,1,1)),js.ayan(dt.date(1906,1,15))))
out.append("")
out.append("A. Hardwicke 1796 (Asiatick Researches vol 6): 'Jupiter in Aquarius at the time of the Sun's entering Aries'; 'evening of the 8th of April'")
for d in [dt.date(1796,4,1),dt.date(1796,4,8),dt.date(1796,4,10),dt.date(1796,4,12)]:
    out.append(f"  {d}: Jupiter {sg(d,H)} ({sid(d,H):.1f}), Sun {sg(d,S)} ({sid(d,S):.1f})")
prev=None
days=sorted(S)
for d in days:
    if d.year!=1796: continue
    s=sg(d,S)
    if prev and s!=prev and s=="Aries": out.append(f"  Sun enters sidereal Aries (Lahiri) on {d}")
    prev=s
prev=None
for d in days:
    if d.year!=1796: continue
    s=sg(d,H)
    if prev and s!=prev: out.append(f"  Jupiter enters {s} on {d}")
    prev=s
out.append("")
out.append("B. Nasik gazetteer 1883: 'last simhasth' 1872 / 'last Sinhasth year' 1873 ; 'next Sinhasth falls in 1884-85'")
prev=None
for d in sorted(H):
    if not (1871<=d.year<=1875 or d.year in (1884,1885)): continue
    s=sg(d,H)
    if prev and s!=prev: out.append(f"  Jupiter enters {s} on {d}")
    prev=s
out.append("")
out.append("C. Allahabad gazetteer 1911: 'The last Kumbh was in 1906' (Magh, Jan-Feb)")
for d in [dt.date(1906,1,15),dt.date(1906,1,23),dt.date(1906,2,1)]:
    out.append(f"  {d}: Jupiter {sg(d,H)} ({sid(d,H):.1f}), Sun {sg(d,S)} ({sid(d,S):.1f})")
open(os.path.join(HERE,"historic_check_output.txt"),"w").write("\n".join(out)+"\n")
print("\n".join(out))
