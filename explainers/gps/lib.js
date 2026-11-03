// ---------- core helpers: every function is pure in t ----------
const W=1920,H=1080,INK='#2b2d42',RED='#d62828',ORANGE='#f4a261';
const PAL={sky:'#9fb2c4',sky2:'#8196ab',teal:'#4f7f87',teal2:'#41696f',beige:'#e3d3b8',beige2:'#cdbb9c',navy:'#26334d',navy2:'#1c2740',purple:'#8a79b0',purple2:'#74639a',skin:'#e8998a',skin2:'#d6827a',white:'#f7f5f0',grey:'#b9c2cc',grey2:'#9aa6b3',shirtA:'#5b78a0',shirtB:'#c86d5b',gold:'#e9b872'};
let cx; let REC=false, EVL=[]; const ev=(t,k,x)=>{if(REC)EVL.push({t:+t.toFixed(3),k,...(x||{})})};
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const eo=x=>1-Math.pow(1-clamp(x),3);
const spring=(t,t0,k=9)=>{const u=t-t0;if(u<0)return 0;return 1-Math.exp(-k*u)*Math.cos(14*u)};
const sstep=(t,a,b)=>{const x=clamp((t-a)/(b-a));return x*x*(3-2*x)};
function shade(h,a){const n=parseInt(h.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const f=a<0?0:255,p=Math.abs(a);r=Math.round(r+(f-r)*p);g=Math.round(g+(f-g)*p);b=Math.round(b+(f-b)*p);return'#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1)}
const R=(x,y,w,h,c,r=0)=>{cx.fillStyle=c;cx.beginPath();if(r){cx.roundRect(x,y,w,h,r)}else cx.rect(x,y,w,h);cx.fill()};
const C=(x,y,r,c)=>{cx.fillStyle=c;cx.beginPath();cx.arc(x,y,r,0,7);cx.fill()};
const E=(x,y,rx,ry,c,rot=0)=>{cx.fillStyle=c;cx.beginPath();cx.ellipse(x,y,rx,ry,rot,0,7);cx.fill()};
const PG=(pts,c)=>{cx.fillStyle=c;cx.beginPath();pts.forEach((p,i)=>i?cx.lineTo(p[0],p[1]):cx.moveTo(p[0],p[1]));cx.closePath();cx.fill()};
function TUBE(x1,y1,x2,y2,w,c){cx.strokeStyle=c;cx.lineWidth=w;cx.lineCap='round';cx.beginPath();cx.moveTo(x1,y1);cx.lineTo(x2,y2);cx.stroke()}
const FONT=s=>`800 ${s}px Montserrat, sans-serif`;
// ---------- typed text: each letter 1.45x big & 0.7em right -> settles 0.18s ----------
function typed(str,x,y,size,t,t0,o={}){
  const cps=o.cps||28, col=o.col||INK; cx.save();cx.font=FONT(size);cx.textBaseline='alphabetic';
  cx.textAlign='left'; const wTot=cx.measureText(str).width;
  let sx=o.align==='center'?x-wTot/2:o.align==='right'?x-wTot:x;
  for(let i=0;i<str.length;i++){const ts=t0+i/cps; if(i%2==0||str[i]!==' ')ev(ts,'tick');
    if(t<ts)continue; const u=clamp((t-ts)/0.18),e=eo(u);
    const px=sx+cx.measureText(str.slice(0,i)).width, adv=cx.measureText(str[i]).width;
    const sc=1.45-0.45*e, off=0.7*size*(1-e);
    cx.save();cx.translate(px+off+adv/2,y-size*0.35);cx.scale(sc,sc);cx.fillStyle=col;cx.fillText(str[i],-adv/2,size*0.35);cx.restore();}
  cx.restore(); return t0+str.length/cps;
}
function fitSize(str,maxW,maxS){cx.save();let s=maxS;cx.font=FONT(s);const w=cx.measureText(str).width;cx.restore();return w>maxW?Math.floor(s*maxW/w):s}
// board: rect with typed text fitted & centered; pops in with spring
function board(x,y,w,h,txt,t,t0,o={}){
  const bg=o.bg||'#fbfaf6', col=o.col||INK, s=spring(t,t0); if(s<=0)return;
  ev(t0,'pop'); cx.save(); cx.translate(x+w/2,y+h/2);cx.scale(s,s);cx.translate(-w/2,-h/2);
  R(6,10,w,h,'rgba(30,40,60,.18)',14); R(0,0,w,h,bg,14); R(0,h-14,w,14,shade(bg,-0.08),14);
  if(txt){const lines=txt.split('\n');const fs=Math.min(o.size||120,fitSize(lines.reduce((a,b)=>a.length>b.length?a:b),w-50,o.size||120),(h-30)/lines.length*0.78);
    lines.forEach((l,i)=>typed(l,w/2,h/2+ (i-(lines.length-1)/2)*fs*1.15+fs*0.35,fs,t,t0+0.15+i*l.length/(o.cps||30)*1.0,{align:'center',col,cps:o.cps||30}));}
  cx.restore();
}
function post(x,y1,y2,c=PAL.grey2){R(x-9,y1,18,y2-y1,c);R(x,y1,9,y2-y1,shade(c,-0.12))}
function signPost(x,y,w,h,txt,t,t0,o={}){post(x+w/2,y+h,y+h+(o.pl||380));R(x+w/2-70,y+h+(o.pl||380)-14,140,26,shade(PAL.grey2,-0.15),10);board(x,y,w,h,txt,t,t0,o)}
// red X
function redX(x,y,w,h,t,t0){if(t<t0)return;ev(t0,'hit');cx.save();cx.strokeStyle=RED;cx.lineWidth=30;cx.lineCap='round';
  const a=clamp((t-t0)/0.11),b=clamp((t-t0-0.11)/0.11);
  cx.beginPath();cx.moveTo(x,y);cx.lineTo(x+w*a,y+h*a);cx.stroke();
  if(b>0){cx.beginPath();cx.moveTo(x+w,y);cx.lineTo(x+w-w*b,y+h*b);cx.stroke()}cx.restore()}
// tick (green-less: navy check) with ding
function tick(x,y,s,t,t0){const u=spring(t,t0);if(u<=0)return;ev(t0,'ding');cx.save();cx.translate(x,y);cx.scale(s*u,s*u);cx.strokeStyle='#3c8d6e';cx.lineWidth=18;cx.lineCap='round';cx.lineJoin='round';cx.beginPath();cx.moveTo(-30,0);cx.lineTo(-8,26);cx.lineTo(34,-28);cx.stroke();cx.restore()}
// pops: bang "!" and "?"
function bang(x,y,t,t0,ch='!',col=RED){const s=spring(t,t0,11);if(s<=0)return;ev(t0,'pop');cx.save();cx.translate(x,y);cx.scale(s,s);cx.font=FONT(110);cx.fillStyle=col;cx.textAlign='center';cx.fillText(ch,0,0);cx.restore()}
// splat wipe, centred on cut time tc: 0.2 in, 0.2 out
function wipe(t,tc){const d=t-tc;if(d<-0.2||d>0.2)return;ev(tc-0.2,'whoosh');const p=d<0?1-(-d/0.2):1-(d/0.2);const e=eo(p);const r=1500*e;
  cx.save();cx.fillStyle='#fff';cx.translate(W/2,H/2);
  const blobs=[[0,0,1],[-420,-220,.55],[500,-200,.5],[-520,260,.5],[420,300,.6],[0,-420,.4],[0,430,.4],[-800,0,.45],[820,40,.45]];
  blobs.forEach(([bx,by,k],i)=>{cx.beginPath();cx.arc(bx*e,by*e,r*k*(0.8+0.2*Math.sin(i*2.3)),0,7);cx.fill()});cx.restore()}
// date card top-left (screen space)
function dateCard(txt,t,t0){const s=spring(t,t0,10);if(s<=0)return;ev(t0,'pop');cx.save();cx.setTransform(1,0,0,1,0,0);cx.translate(40+165,40+60);cx.scale(s,s);cx.translate(-165,-60);
  R(5,8,330,120,'rgba(30,40,60,.2)',16);R(0,0,330,120,'#fff',16);
  // calendar icon
  R(24,26,66,70,ORANGE,8);R(24,46,66,50,'#fff7ee',6);R(24,26,66,20,shade(ORANGE,-0.15),8);R(38,16,8,22,INK,4);R(68,16,8,22,INK,4);
  [0,1,2].forEach(i=>[0,1].forEach(j=>R(34+i*18,54+j*18,11,11,ORANGE,2)));
  typed(txt,112,82,56,t,t0+0.2,{cps:22});cx.restore()}
// counter
function counterText(v,x,y,size,col){cx.save();cx.font=FONT(size);cx.fillStyle=col||INK;cx.textAlign='center';cx.fillText(v,x,y);cx.restore()}
// ---------- characters ----------
// sprite units: 918 tall. shoulders (±100,-540). head centre (0,-650) r150.
const UP=118*2.2,LO=112*2.2; // arm lengths scaled so mitten reaches in 918 sprite
function ik(sx,sy,tx,ty,bend=1){let dx=tx-sx,dy=ty-sy,d=Math.hypot(dx,dy);const m=UP+LO-1;if(d>m){dx*=m/d;dy*=m/d;d=m}
  const a=Math.acos(clamp((UP*UP+d*d-LO*LO)/(2*UP*d),-1,1));const base=Math.atan2(dy,dx);const ang=base+bend*a;
  const ex=sx+Math.cos(ang)*UP,ey=sy+Math.sin(ang)*UP;return[ex,ey,sx+dx,sy+dy]}
function mitten(x,y,state,col,ang){cx.save();cx.translate(x,y);cx.rotate(ang||0);
  if(state==='fist'){C(0,0,30,col)}else if(state==='point'){C(0,0,30,col);TUBE(0,0,48,0,17,col);C(48,0,9,col);C(-8,-24,12,shade(col,-0.1))}
  else{E(8,0,38,30,col);E(-4,-28,12,18,shade(col,-0.1),-0.5)}cx.restore()}
function hand(x,y,ang,state){mitten(x,y,state,PAL.skin,ang)}
// person: o={x,y,h(pixel height),flip,shirt,pants,hair,hairStyle,lh:[tx,ty,state],rh:[..],walk:phase-or-null,face:0..,look,mouth,t,seed,hold}
function person(o){const t=o.t,sc=o.h/918,seed=o.seed||0;cx.save();cx.translate(o.x,o.y);cx.scale(sc*(o.flip?-1:1),sc);
  const sk=PAL.skin,sk2=PAL.skin2,sh=o.shirt||PAL.shirtA,pn=o.pants||PAL.navy,hr=o.hair||'#3b3342';
  const idle=Math.sin(t*2.1+seed)*6; let hip=-230+idle*0.3, bodyDx=0;
  // legs
  const leg=(side,ph)=>{const th=o.walk!=null?0.42*Math.sin(ph):0.03*Math.sin(t*1.3+side);const kn=o.walk!=null?0.75*Math.pow(Math.cos(ph),2)*(Math.cos(ph-0.0)<0||true?1:0):0;
    const hx=side*52,hy=hip;const kx=hx+Math.sin(th)*115,ky=hy+Math.cos(th)*115;const sa=th-(o.walk!=null?kn*(Math.sin(ph+Math.PI/2)>0?1:0.35):0);
    const fx=kx+Math.sin(sa)*115,fy=ky+Math.cos(sa)*115;
    TUBE(hx,hy,kx,ky,76,pn);TUBE(kx,ky,fx,fy,66,shade(pn,-0.12));E(fx+14,fy+6,52,24,shade(PAL.navy2,0));return fy};
  let ph=o.walk!=null?o.walk*Math.PI*2:0; let fyA,fyB;
  if(o.walk!=null){hip=-230+Math.abs(Math.sin(ph))*-0+Math.cos(2*ph)*-14+14;}
  fyA=leg(-1,ph);fyB=leg(1,ph+Math.PI);
  // torso
  const bob=o.walk!=null?Math.sin(ph*2)*8:idle;
  cx.save();cx.translate(0,bob*0.5);
  R(-120,-570,240,350,sh,70);R(-120,-420,240,200,shade(sh,-0.12),60);R(30,-570,90,350,shade(sh,-0.08),50);
  // neck
  R(-34,-610,68,60,sk2,20);
  const nod=Math.sin(t*2.3+seed)*0.035+(o.nod||0);
  cx.save();cx.translate(0,-660);cx.rotate(nod);
  if(o.noHead!==true){ // head
    C(0,0,170,sk);E(40,26,128,140,sk2,0);C(0,0,170,sk);cx.globalCompositeOperation='source-atop';cx.globalCompositeOperation='source-over';
    // darker form shade on right side
    cx.save();cx.beginPath();cx.arc(0,0,170,0,7);cx.clip();C(110,40,150,sk2);C(-10,0,170,sk);cx.restore();
    C(0,0,170,'rgba(0,0,0,0)');
    // ears
    C(-168,10,30,sk2);C(168,10,30,sk2);
    // hair
    const hs=o.hairStyle||0;cx.save();cx.beginPath();cx.arc(0,0,172,0,7);cx.clip();
    if(hs===0){E(0,-120,190,100,hr);PG([[-190,-90],[-120,-40],[130,-70],[190,-90],[190,-200],[-190,-200]],hr)}
    if(hs===1){E(0,-110,185,115,hr);R(-185,-110,70,200,hr,30);R(115,-110,70,200,hr,30)}
    if(hs===2){E(0,-135,190,90,hr);}
    if(hs===3){E(0,-90,192,140,hr);}
    cx.restore();
    if(o.glasses){cx.strokeStyle=INK;cx.lineWidth=0;}
    // face
    const lk=o.look||0; const bl=((t+seed*1.7)%(3.4+0.8*Math.sin(seed)))<0.14;
    const ey=bl?4:20; E(-62+lk*18,8,16,ey,INK);E(62+lk*18,8,16,ey,INK);
    if(o.glasses){for(const s of[-1,1]){cx.strokeStyle=INK;cx.lineWidth=10;cx.beginPath();cx.arc(s*62+lk*18,8,44,0,7);cx.stroke()}}
    const mo=o.mouth||0;if(o.speakAmp)0;
    if(mo>0){E(10+lk*18,86,26,12+34*mo*(0.5+0.5*Math.sin(t*14+seed)),'#7a2e3a')}else if(o.smile!==false){cx.strokeStyle=INK;cx.lineWidth=11;cx.lineCap='round';cx.beginPath();cx.arc(lk*18,70,38,0.25,Math.PI-0.25);cx.stroke()}
    if(o.surprise){E(0,92,24,30,'#7a2e3a')}
  }
  cx.restore();cx.restore();
  // arms (two-bone IK) from shoulder sockets
  const arm=(side,tg)=>{const sx=side*108,sy=-520+bob*0.5;
    let tx,ty,st='open';
    if(tg){tx=tg[0];ty=tg[1];st=tg[2]||'open'}else{tx=side*150+Math.sin(t*1.7+side+seed)*18;ty=-190+Math.cos(t*1.9+seed)*14}
    if(o.walk!=null&&!tg){tx=side*120+Math.sin(ph+(side>0?0:Math.PI))*80;ty=-230}
    const[ex,ey,hx,hy]=ik(sx,sy,tx,ty,side>0?-1:1);
    C(sx,sy,44,sh);TUBE(sx,sy,ex,ey,36,sh);TUBE(ex,ey,hx,hy,36,shade(sh,-0.1));
    const ang=Math.atan2(hy-ey,hx-ex)*(1);mitten(hx,hy,st,sk,ang)};
  // far arm first
  arm(-1,o.lh);arm(1,o.rh);
  cx.restore();
  // ground shadow in screen space skipped; hands list returned
}
// held phone
function phone(x,y,ang,sz,on,t,pinCol){cx.save();cx.translate(x,y);cx.rotate(ang);R(-sz*.55,-sz,sz*1.1,sz*2,PAL.navy,sz*.18);R(-sz*.45,-sz*.88,sz*.9,sz*1.76,on?'#dfe9ef':'#0d1526',sz*.1);
  if(on){C(0,-sz*.15+Math.sin(t*3)*sz*.04,sz*.22,pinCol||RED);PG([[-sz*.14,sz*.0],[sz*.14,sz*.0],[0,sz*.4]],pinCol||RED);C(0,-sz*.15,sz*.09,'#fff')}cx.restore()}
// dust puff
function puff(x,y,t,t0,r=60){const u=clamp((t-t0)/0.5);if(u<=0||u>=1)return;cx.save();cx.globalAlpha=1-u;for(let i=0;i<5;i++){const a=i*1.256;C(x+Math.cos(a)*r*u*1.4,y+Math.sin(a)*r*u,r*(0.35+0.4*u),'#fff')}cx.restore()}
