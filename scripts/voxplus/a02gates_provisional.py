# provisional timing (before the voice window): 2.75 words/s, same gaps as a02gates_audio.py. Writes src/voxplus/A02Timing.ts with empty WORDS.
import json
R="/Volumes/DarwinSSD/MMVideo"; B=json.load(open(R+"/scripts/voxplus/a02gates_beats.json"))
CHAP={"b04","b09","b11","b15","b19","b23","b28"}; t=0.35; st={}; du={}; order=[]
for i,b in enumerate(B):
    if i: t+=0.9 if b["key"] in CHAP else 0.22
    d=round(len(b["say"].split())/2.75+0.3,3); st[b["key"]]=round(t,3); du[b["key"]]=d; order.append(b["key"]); t+=d
tot=round(t+5.0,3); js=lambda o: json.dumps(o,ensure_ascii=False,separators=(",",":"))
open(R+"/src/voxplus/A02Timing.ts","w").write("// PROVISIONAL\nexport const FILM_TOTAL_S = %s;\nexport const ORDER: string[] = %s;\nexport const BEAT: Record<string, number> = %s;\nexport const DUR: Record<string, number> = %s;\nexport const SAY: Record<string, string> = %s;\nexport const WORDS: Record<string, [string, number, number][]> = {};\n"%(tot,js(order),js(st),js(du),js({b["key"]:b["say"] for b in B})))
print(tot)
