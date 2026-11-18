import json,urllib.request,urllib.parse
out=[]
for ln in range(13,19):
    for pg in (1,2,3):
        u="https://sansad.in/api_ls/question/qetFilteredQuestionsAns?"+urllib.parse.urlencode(dict(loksabhaNo=ln,pageNo=pg,locale="en",pageSize=50,keyWord="Konkan Railway"))
        try:
            r=json.load(urllib.request.urlopen(urllib.request.Request(u,headers={"User-Agent":"Mozilla/5.0"}),timeout=40))
            qs=r[0]["listOfQuestions"]
        except Exception as e:
            print(ln,pg,"ERR",e); break
        for q in qs: out.append((ln,q["date"],q["type"],q["quesNo"],q["ministry"],q["subjects"],q["questionsFilePath"]))
        if len(qs)<50: break
for o in out: print(o)
json.dump(out,open("ls_search_results.json","w"),indent=0)
