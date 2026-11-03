import json,re,subprocess,numpy as np,soundfile as sf
lines=json.load(open('script.json'));meta=json.load(open('build/sent_raw.json'))
raw,sr=sf.read('build/raw.wav');TARGET=62.0
f=(len(raw)/sr)/TARGET
subprocess.run(['ffmpeg','-y','-loglevel','error','-i','build/raw.wav','-filter:a',f'atempo={f:.5f}','build/voice.wav'],check=True)
def syl(w):
    w=re.sub(r'[^a-z]','',w.lower());return max(1,len(re.findall(r'[aeiouy]+',w)))+0.25*len(w)/4
out=[];
for t,(a,b) in zip(lines,meta):
    a/=f;b/=f;ws=t.split();wt=[syl(w)+(1.2 if re.search(r'[.,:]$',w) else 0) for w in ws]
    # the sentence-final pause is outside; punctuation adds weight inside
    tot=sum(wt[:-1])+syl(ws[-1]);cum=0;words=[]
    for w,x in zip(ws,wt):
        xx=x if w is not ws[-1] else syl(w)
        s=a+(b-a)*cum/(tot);e=a+(b-a)*(cum+syl(w))/tot
        words.append({'w':re.sub(r'[^\w\'-]','',w),'s':round(s,3),'e':round(e,3)});cum+=xx
    out.append({'text':t,'s':round(a,3),'e':round(b,3),'words':words})
json.dump(out,open('build/words.json','w'),indent=1)
print(len(sf.read('build/voice.wav')[0])/sr, [round(o['s'],2) for o in out])
