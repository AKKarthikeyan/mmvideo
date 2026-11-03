import json,sys,subprocess,numpy as np,soundfile as sf,re
from kokoro_onnx import Kokoro
M='/tmp/claude-0/-home-user-mmvideo/e37d3e15-e086-5208-be47-c9a788b8efb2/scratchpad/models/'
k=Kokoro(M+'kokoro-v1.0.onnx',M+'voices-v1.0.bin')
voice=sys.argv[1] if len(sys.argv)>1 else 'am_michael'
lines=json.load(open('script.json'))
SR=24000;parts=[];meta=[]
def tighten(y):
    # cap internal pauses >0.24s at 0.16s
    fr=480;n=len(y)//fr;e=np.array([np.abs(y[i*fr:(i+1)*fr]).max() for i in range(n)])
    sil=e<0.01;out=[];i=0
    while i<n:
        if sil[i]:
            j=i
            while j<n and sil[j]:j+=1
            L=(j-i)*0.02
            keep=int(min(L,0.16 if L>0.24 else L)/0.02)
            out.append(y[i*fr:(i+keep)*fr]);i=j
        else:
            j=i
            while j<n and not sil[j]:j+=1
            out.append(y[i*fr:j*fr]);i=j
    return np.concatenate(out)
for t in lines:
    y,_=k.create(t,voice=voice,speed=1.0,lang='en-us')
    y=tighten(y.astype(np.float32))
    # trim edges
    nz=np.where(np.abs(y)>0.01)[0];y=y[nz[0]:nz[-1]+1]
    parts.append(y)
np.save('build/parts.npy',np.array(parts,dtype=object),allow_pickle=True)
gap=int(0.16*SR);full=[];t0=0;words=[]
for t,y in zip(lines,parts):
    full.append(y);full.append(np.zeros(gap,np.float32))
    meta.append((t0,t0+len(y)/SR));t0+=(len(y)+gap)/SR
y=np.concatenate(full);sf.write('build/raw.wav',y,SR)
json.dump(meta,open('build/sent_raw.json','w'))
print('raw dur',len(y)/SR)
