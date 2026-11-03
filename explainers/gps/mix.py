import json,numpy as np,soundfile as sf,subprocess,scipy.signal as ss
SR=48000
v,sr=sf.read('build/voice.wav');v=ss.resample_poly(v,SR,sr).astype(np.float32);N=int(62.4*SR);vo=np.zeros(N,np.float32);vo[:min(N,len(v))]=v[:N]
rng=np.random.default_rng(3);ev=json.load(open('build/ev.json'))
def env(n,a,d):x=np.arange(n)/SR;return np.minimum(x/a,1)*np.exp(-x/d)
def tick():n=int(.03*SR);x=rng.normal(0,1,n)*env(n,.0005,.006);return ss.lfilter(*ss.butter(2,2500/(SR/2),'high'),x)*.5
def pop():n=int(.14*SR);x=np.arange(n)/SR;f=500+900*np.exp(-x*30);return np.sin(2*np.pi*np.cumsum(f)/SR)*env(n,.002,.04)*.7
def hit():n=int(.4*SR);x=np.arange(n)/SR;return (np.sin(2*np.pi*np.cumsum(120*np.exp(-x*9)+40)/SR)*.9+rng.normal(0,.3,n)*np.exp(-x*40))*env(n,.001,.12)
def ding():n=int(.9*SR);x=np.arange(n)/SR;return (np.sin(2*np.pi*1318*x)+.4*np.sin(2*np.pi*2636*x))*env(n,.002,.25)*.35
def whoosh():
    n=int(.45*SR);x=rng.normal(0,1,n);c=800+2500*np.sin(np.linspace(0,np.pi,n));out=np.zeros(n)
    for i in range(0,n,512):
        f=min(c[i],10000)/(SR/2);bb,aa=ss.butter(2,[max(.01,f*.4),min(.95,f)],'band');out[i:i+512]=ss.lfilter(bb,aa,x[i:i+512])
    return out*np.sin(np.linspace(0,np.pi,n))**1.5*1.6
S={'tick':tick,'pop':pop,'hit':hit,'ding':ding,'whoosh':whoosh};G={'tick':.35,'pop':.5,'hit':.9,'ding':.45,'whoosh':.55}
sfx=np.zeros(N+SR,np.float32)
for e in ev:
    s=S[e['k']]();pk=int(np.argmax(np.abs(s)));i=int(e['t']*SR)-pk
    if i<0:i=0
    sfx[i:i+len(s)]+=(s*G[e['k']])[:len(sfx)-i].astype(np.float32)
sfx=sfx[:N]
# music: light curious bed, C major pentatonic plucks + soft pad, 100 bpm
bpm=100;beat=60/bpm;m=np.zeros(N,np.float32);chords=[[48,55,64],[45,52,60],[53,60,69],[55,62,67]]
def note(f,dur,kind):
    n=int(dur*SR);x=np.arange(n)/SR
    if kind=='pad':return (np.sin(2*np.pi*f*x)+.3*np.sin(2*np.pi*f*2*x))*np.minimum(x/.4,1)*np.clip(np.minimum((dur-x)/.5,1),0,1)*.12
    return (np.sin(2*np.pi*f*x)+.25*np.sin(2*np.pi*f*3*x))*env(n,.004,.22)*.22
mf=lambda p:440*2**((p-69)/12)
for bar in range(int(62.4/(beat*4))+1):
    t=bar*beat*4;ch=chords[bar%4]
    for p in ch:
        s=note(mf(p),beat*4,'pad');i=int(t*SR);m[i:i+len(s)]+=s[:N-i] if i<N else 0
    pent=[72,74,76,79,81,79,76,74]
    for k in range(8):
        tt=t+k*beat/2;p=pent[(k+bar*3)%8]+(0 if bar%2 else -12)*0;s=note(mf(p),.6,'pluck');i=int(tt*SR)
        if i<N:m[i:i+len(s)]+=s[:N-i]
# duck: music RMS 10.5 dB under voice RMS inside phrases
fr=int(.02*SR);ve=np.array([np.sqrt(np.mean(vo[i:i+fr]**2)) for i in range(0,N-fr,fr)])
sp=ve>0.02;vr=np.sqrt(np.mean(vo[:len(ve)*fr].reshape(-1,fr)[sp]**2))
mr=np.sqrt(np.mean(m**2));base=vr*10**(-10.5/20)/mr
g=np.where(sp,1.0,1.8).astype(float);g=ss.lfilter([1-np.exp(-.02/.15)],[1,-np.exp(-.02/.15)],g)
gi=np.interp(np.arange(N)/SR,np.arange(len(g))*.02,g)
mus=m*base*gi
mix=vo+mus+sfx*vr*.9
sf.write('build/mix_raw.wav',mix,SR)
# -14 LUFS two-pass
r=subprocess.run(['ffmpeg','-hide_banner','-i','build/mix_raw.wav','-af','loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json','-f','null','-'],capture_output=True,text=True).stderr
j=json.loads(r[r.rindex('{'):r.rindex('}')+1])
af=f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true"
subprocess.run(['ffmpeg','-y','-loglevel','error','-i','build/mix_raw.wav','-af',af,'build/mix.wav'],check=True)
print('music dB under voice phrases: -10.5; input_i',j['input_i'])
