import json,urllib.request,urllib.parse
base="https://integration.rajyasabha.digital/rsdebate/api/question/search-questions?"
out=[]
for sf,st in ((1,174),):
    for pg in (1,2,3):
        q=urllib.parse.urlencode(dict(sessionFrom=sf,sessionTo=st,searchParam="Konkan Railway",searchOn="title",matchesOn="exactMatch",page=pg,size=50))
        try: r=json.load(urllib.request.urlopen(urllib.request.Request(base+q,headers={"User-Agent":"Mozilla/5.0"}),timeout=60))
        except Exception as e: print("ERR",e); break
        recs=r.get("records",[]); out+=recs
        if len(recs)<50: break
# modern sessions
for pg in (1,2):
    q=urllib.parse.urlencode(dict(sessionFrom=175,sessionTo=270,searchParam="Konkan Railway",searchOn="title",matchesOn="exactMatch",page=pg,size=50))
    try: r=json.load(urllib.request.urlopen(urllib.request.Request(base+q,headers={"User-Agent":"Mozilla/5.0"}),timeout=60))
    except Exception as e: print("ERR2",e); break
    recs=r.get("records",[]); out+=recs
    if len(recs)<50: break
for o in out: print(o.get("ans_date"),o.get("qtype"),o.get("qno"),o.get("min_name"),"|",o.get("qtitle","").replace("\n"," "),"|",o.get("files"))
json.dump(out,open("rs_search_results.json","w"))
