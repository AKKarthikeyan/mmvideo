// ---------- timeline keyed to real word times (data.js: WORDS) ----------
const WD=WORDS;const Ws=(i,j)=>WD[i].words[j].s; const Se=i=>WD[i].e; const Ss=i=>WD[i].s;
const END=WD[WD.length-1].e+0.45;
function scn(t,t0,t1,o,fn){const p=clamp((t-t0)/(t1-t0)),z=o.z0+(o.z1-o.z0)*p,hw=960/z,hh=540/z;
  let x=960+(o.px||0)*(p-.5),y=540+(o.py||0)*(p-.5);x=clamp(x,hw,W-hw);y=clamp(y,hh,H-hh);
  cx.save();cx.translate(960,540);cx.scale(z,z);cx.translate(-x,-y);fn(t);cx.restore()}
const hp=(o,tx,ty)=>[o.x+(o.flip?-1:1)*tx*o.h/918,o.y+ty*o.h/918];
const COMM={shirt:PAL.shirtB,pants:PAL.navy,hair:'#3b3342',hairStyle:1,seed:1};
const SCI={shirt:'#f1efe9',pants:PAL.navy,hair:'#6b5a4a',hairStyle:0,glasses:true,seed:2};
const EIN={shirt:PAL.purple2,pants:PAL.navy,hair:'#e8e4de',hairStyle:3,seed:3};
const TEA={shirt:PAL.teal,pants:'#4b4a5d',hair:'#7a4b3a',hairStyle:2,seed:4,glasses:true};
const OFF=[{shirt:PAL.navy,pants:'#33384f',hair:'#2f2a33',hairStyle:0,seed:5},{shirt:PAL.shirtA,pants:PAL.navy,hair:'#8a5a44',hairStyle:1,seed:6},{shirt:PAL.purple,pants:'#33384f',hair:'#3b3342',hairStyle:2,seed:7}];
// satellite sprite
function sat(x,y,s,t,rot=0,face=true){cx.save();cx.translate(x,y);cx.rotate(rot+Math.sin(t*1.2)*0.04);cx.scale(s,s);
  R(-210,-40,150,80,PAL.sky2,6);R(60,-40,150,80,PAL.sky2,6);for(let i=1;i<4;i++){R(-210+i*37,-40,3,80,PAL.navy);R(60+i*37,-40,3,80,PAL.navy)}
  R(-210,-40,150,22,'rgba(255,255,255,.2)',6);R(60,-40,150,22,'rgba(255,255,255,.2)',6);
  R(-60,-8,120,16,PAL.grey2);R(-50,-60,100,120,PAL.gold,14);R(10,-60,40,120,shade(PAL.gold,-.15),14);C(0,-80,16,PAL.grey);R(-3,-100,6,26,PAL.grey);
  if(face){C(-18,0,6,INK);C(18,0,6,INK)}cx.restore()}
function clockFace(x,y,r,t,mult=1,col='#f7f5f0'){C(x,y,r,col);C(x+r*.1,y+r*.08,r*.9,shade(col,-.05));C(x,y,r*.92,col);for(let i=0;i<12;i++){const a=i*Math.PI/6;R(x+Math.sin(a)*r*.78-4,y-Math.cos(a)*r*.78-4,8,8,INK,4)}
  const a1=t*mult*2.0,a2=a1/12;TUBE(x,y,x+Math.sin(a1)*r*.72,y-Math.cos(a1)*r*.72,r*.07,INK);TUBE(x,y,x+Math.sin(a2*3)*r*.5,y-Math.cos(a2*3)*r*.5,r*.1,INK);C(x,y,r*.09,RED)}
function earth(t){}
function dishAt(x,y,s,t){cx.save();cx.translate(x,y);cx.scale(s,s);R(-14,-20,28,150,PAL.grey2);R(-70,110,140,22,shade(PAL.grey2,-.15),8);cx.save();cx.rotate(-0.5+Math.sin(t*.8)*.15);E(0,-30,120,50,PAL.white);E(18,-22,100,40,PAL.grey);R(-4,-30,8,-90,PAL.grey2);C(0,-125,12,RED);cx.restore();cx.restore()}
function pinIcon(x,y,s,col=RED){cx.save();cx.translate(x,y);cx.scale(s,s);C(0,-50,38,col);PG([[-32,-30],[32,-30],[0,30]],col);C(0,-50,14,'#fff');cx.restore()}
function icon(kind,x,y,s,t,t0){const u=spring(t,t0,10);if(u<=0)return;ev(t0,'pop');cx.save();cx.translate(x,y);cx.scale(s*u,s*u);
  if(kind==='clock')clockFace(0,0,60,t,3);else if(kind==='sat')sat(0,0,.28,t,0,false);else if(kind==='pin')pinIcon(0,30,1.1);else if(kind==='map'){R(-60,-45,120,90,PAL.beige2,8);PG([[-40,-20],[-10,-30],[10,0],[-20,25]],'#9fb394');PG([[10,-10],[45,-25],[40,20]],'#9fb394')}
  else if(kind==='tick'){cx.strokeStyle='#3c8d6e';cx.lineWidth=16;cx.lineCap='round';cx.lineJoin='round';cx.beginPath();cx.moveTo(-34,0);cx.lineTo(-8,28);cx.lineTo(36,-30);cx.stroke()}cx.restore()}
function walkPos(o){return o}
const SH=[];
const add=(a,b,cam,fn,name)=>SH.push({a,b,cam,fn,name,t0:Ws(a[0],a[1]),t1:b==='end'?END:Ws(b[0],b[1])});
const sS=(i)=>[i,0];
// ---- hook ----
add(sS(0),sS(1),{z0:1.03,z1:1.07,px:-60},(t)=>{const a=Ws(0,0);P.street(t);const S=SURF.street;
  signPost(S.x,S.y,S.w,S.h,'I KNOW\nWHERE YOU ARE',t,a+0.1,{size:90,pl:360});
  const o={...COMM,x:640,y:900,h:760,t,lh:[-170,-280,'open'],rh:[170,-440,'point'],mouth:0.6*(t<Ws(0,7)+.4?1:0)};person(o);
  const [px,py]=hp(o,220,-470);phone(px,py,-.2,56,true,t);
  icon('pin',1000,620,.9,t,a+.9)},'hook');
add([1,0],[1,4],{z0:1.08,z1:1.12,px:80},(t)=>{const a=Ws(1,1);P.street(t);const S=SURF.street;signPost(S.x,S.y,S.w,S.h,'I KNOW\nWHERE YOU ARE',t,-9,{size:90,pl:360});
  redX(S.x+40,S.y+16,S.w-80,S.h-40,t,a+0.08);
  const o={...COMM,x:700,y:900,h:820,t,surprise:t>a,smile:t<a,lh:[-190,-480,'open'],rh:[190,-480,'open'],look:-0.3};person(o);bang(780,430,t,a+.25,'!')},'denial');
add([1,4],sS(2),{z0:1.03,z1:1.07,py:-40},(t)=>{const a=Ws(1,4);P.tower(t);clockFace(960,470,210,t,2.0);
  icon('clock',560,330,1.5,t,a);icon('clock',1360,300,1.5,t,Ws(1,5));icon('clock',1280,640,1.4,t,Ws(1,6));icon('clock',620,640,1.2,t,Ws(1,6)+.2);
  const o={...COMM,x:300,y:960,h:640,t,mouth:.3,lh:[-120,-500,'open'],rh:[170,-560,'point'],look:.4};person(o)},'listens');
// ---- stakes ----
add(sS(2),[2,5],{z0:1.04,z1:1.08,px:60},(t)=>{const a=Ss(2);P.tower(t);const sp=1+Math.min(1,(t-a)/1.5)*8;clockFace(960,470,210,t*3*sp*.5,1.2);
  [['clock',620,260],['sat',1330,230],['pin',460,640],['map',1470,640]].forEach(([k,x,y],i)=>icon(k,x,y,1.7,t,Ws(2,i)));
  const o={...SCI,x:300,y:960,h:660,t,surprise:t>Ws(2,3),lh:[-160,-440,'open'],rh:[170,-460,'open']};person(o)},'slip');
add([2,5],sS(3),{z0:1.04,z1:1.08,px:-60},(t)=>{const a=Ws(2,5);P.map(t);const S=SURF.map;
  const d=eo((t-a)/(Se(2)-a)); const x0=620,y0=430;pinIcon(x0,y0,1.1,PAL.grey2);pinIcon(x0+d*620,y0+d*70,1.3,RED);
  cx.save();cx.strokeStyle=RED;cx.lineWidth=10;cx.setLineDash([22,18]);cx.beginPath();cx.moveTo(x0,y0-20);cx.lineTo(x0+d*620,y0+d*70-20);cx.stroke();cx.restore();
  signPost(1140,740,560,200,'11 KM / DAY',t,Ws(2,7),{size:100,pl:200,bg:'#fbfaf6'});
  const o={...COMM,x:300,y:1000,h:620,t,surprise:true,lh:[-170,-460,'open'],rh:[170,-520,'point']};person(o);bang(340,520,t,Ws(2,7)+.3)},'drift');
// ---- subject ----
add(sS(3),sS(4),{z0:1.03,z1:1.06,px:-30},(t)=>{const a=Ss(3);P.stage(t);const bob=Math.sin(t*1.6)*14;
  const dr=eo((t-a)/.45);sat(960,200+(1-dr)*-400+bob+240,1.1,t,Math.sin(t)*.05);
  R(570,60,780,180,'#2a3858',14);board(580,70,760,170,'GLOBAL POSITIONING\nSYSTEM',t,Ws(3,2),{size:84,cps:24})},'subject');
// ---- origin ----
add(sS(4),[4,3],{z0:1.04,z1:1.07,px:50},(t)=>{const a=Ss(4);P.pentagon(t);const S=SURF.pent;board(S.x+30,S.y-20,S.w-60,S.h+10,'THE PENTAGON',t,a+.1,{size:120,bg:'#fbfaf6'});
  for(let i=0;i<3;i++){const ph=(t+i*.3)/0.9,sc=640/918;const dist=345*sc;const x=(i%2?1:-1)*0;const xs=[200+ (ph*dist)%1,0];
    const o={...OFF[i],x:-60-i*260+ (t-a)*330,y:1010,h:640,walk:(t/0.9+i*.37),t,lh:null,rh:null};o.flip=false;person(o)}
  dateCard('1973',t,a+.15)},'pentagon');
add([4,3],[4,6],{z0:1.05,z1:1.09,py:-30},(t)=>{const a=Ws(4,3);P.pentagon(t);const S=SURF.pent;board(S.x+30,S.y-20,S.w-60,S.h+10,'THE PENTAGON',t,-9,{size:120});
  const dx=(t-a);for(let i=0;i<3;i++){const o={...OFF[i],x:560+i*300-dx*70*(i+1)*.4,y:1010,h:620,walk:(t/.9+i*.4),t,flip:i%2==0};person(o)}
  const o2={...OFF[0],x:1500,y:1010,h:640,t,flip:true,rh:[-170,-540,'fist'],lh:[-170,-300,'open'],mouth:.5};person(o2);bang(1450,460,t,Ws(4,4)+.1,'✓',PAL.teal)
  dateCard('1973',t,-9)},'approved');
add([4,6],[4,9],{z0:1.03,z1:1.06,px:-50},(t)=>{P.space(t);const x=[(Ws(4,6)),(Ws(4,7)),(Ws(4,8))];
  [[480,300],[960,220],[1440,320]].forEach(([px,py],i)=>{const u=spring(t,x[i],8);if(u>0){ev(x[i],'pop');sat(px,py+Math.sin(t*1.4+i)*12,.65*u,t);puff(px,py,t,x[i],70)}});
  // network lines
  cx.save();cx.strokeStyle='rgba(247,245,240,.5)';cx.lineWidth=5;cx.setLineDash([16,14]);const n=clamp((t-x[2])/.6);cx.beginPath();cx.moveTo(480,300);cx.lineTo(480+(960-480)*n,300+(220-300)*n);cx.moveTo(960,220);cx.lineTo(960+(480)*n,220+100*n);cx.stroke();cx.restore();
  },'network');
add([4,9],sS(5),{z0:1.04,z1:1.08,py:30},(t)=>{const a=Ws(4,9);P.control(t);const S=SURF.control;
  R(S.x,S.y,S.w,S.h,'#0f1a30',12);typed('FULLY OPERATIONAL',S.x+S.w/2,S.y+S.h/2+40,fitSize('FULLY OPERATIONAL',S.w-80,110),t,Ws(4,13)-.2,{align:'center',col:'#f7f5f0',cps:26});
  typed('GPS CONSTELLATION',S.x+S.w/2,S.y+110,52,t,a+.2,{align:'center',col:'#9fc2cf',cps:28});
  const j=Math.max(0,Math.sin((t-Ws(4,13))*9))*(t>Ws(4,13)&&t<Ws(4,13)+.9?1:0);
  [[360,1010,OFF[0]],[960,1010,OFF[1]],[1560,1010,OFF[2]]].forEach(([x,y,c],i)=>person({...c,x,y:y-j*60*(i%2?1:.7),h:520,t,lh:t>Ws(4,13)?[-260,-760,'fist']:[-150,-300,'open'],rh:t>Ws(4,13)?[260,-760,'fist']:[150,-300,'open'],mouth:t>Ws(4,13)?.8:0,flip:i==2}));
  dateCard('1995',t,a+.1)},'control');
// ---- parts ----
add(sS(5),[5,4],{z0:1.03,z1:1.06,px:40},(t)=>{P.stage(t);const a=Ws(5,2);
  [[420,'1'],[960,'2'],[1500,'3']].forEach(([x,n],i)=>{const tt=a+i*.28;signPost(x-190,300,380,220,n,t,tt,{size:170,pl:280})})},'three');
add([5,4],[5,7],{z0:1.04,z1:1.08,py:-30},(t)=>{const a=Ws(5,4);P.space(t);const d=eo((t-a)/.5);sat(760,300-(1-d)*500+Math.sin(t*1.6)*10,1.1,t);if(t>a+.45)puff(760,340,t,a+.45,110);
  signPost(1220,260,560,200,'SPACE',t,a+.1,{size:130,pl:90})},'sats');
add([5,7],[5,12],{z0:1.04,z1:1.07,px:-40},(t)=>{const a=Ws(5,7);P.ground(t);dishAt(520,560,2.2,t);dishAt(300,640,1.5,t+1);
  const S={x:1040,y:470,w:540,h:200};board(S.x,S.y,S.w,S.h,'GROUND\nSTATIONS',t,a+.1,{size:90});
  const o={...TEA,x:1750,y:1000,h:560,t,flip:true,mouth:.4,lh:[-150,-300,'open'],rh:[-160,-520,'point']};person(o)},'ground');
add([5,12],sS(6),{z0:1.05,z1:1.09,px:50},(t)=>{const a=Ws(5,12);P.street(t);const S=SURF.street;signPost(S.x,S.y,S.w,S.h,'YOUR PHONE',t,Ws(5,14),{size:110,pl:360});
  const o={...COMM,x:680,y:940,h:780,t,lh:[-170,-300,'open'],rh:[210,-430,'open']};person(o);const [px,py]=hp(o,220,-450);phone(px,py,-.3,58,true,t);
  const p=eo((t-a)/.4);puff(px,py,t,a+.1,50)},'pocket');
// ---- headline ----
add(sS(6),sS(7),{z0:1.0,z1:1.0},(t)=>{const a=Ss(6);R(0,0,W,H,'#5b3fa6');
  [[200,200,160,0.3],[1650,260,200,-0.25],[900,900,230,0.2],[1500,880,130,-0.35],[300,860,120,0.4],[1000,120,100,-0.3]].forEach(([x,y,r,w])=>{cx.save();cx.translate(x,y);cx.rotate(t*w);cx.fillStyle='#6a4cb6';cx.beginPath();for(let i=0;i<16;i++){const A=i*Math.PI/8,rr=i%2?r*.78:r;cx.lineTo(Math.cos(A)*rr,Math.sin(A)*rr)}cx.fill();cx.globalCompositeOperation='destination-out';C(0,0,r*.3,'#000');cx.restore();C(x,y,r*.3,'#5b3fa6')});
  const s=spring(t,a+.05,8);cx.save();cx.translate(960,540);cx.scale(1+.02*Math.sin(t*2),1+.02*Math.sin(t*2));
  typed('SO HOW DOES',0,-20,96,t,a-960*0+0.0,{align:'center',col:'#fff',cps:30}); typed('IT WORK?',-40,100,96,t,a+.45,{align:'center',col:'#fff',cps:30});cx.restore();
  bang(1180,110,t,Ws(6,3)+.0,'?','#fff');bang(780,210,t,Ws(6,4)+.05,'?','#fff');bang(1320,200,t,Ws(6,4)+.2,'?','#fff')},'headline');
// ---- mechanism ----
add(sS(7),[7,10],{z0:1.04,z1:1.08,px:60},(t)=>{const a=Ws(7,2);P.space(t);sat(700,360,1.3,t,.1);
  for(let k=0;k<4;k++){const u=((t-a)*.9+k*.25)%1;if(t>a){cx.strokeStyle=`rgba(247,245,240,${1-u})`;cx.lineWidth=8;cx.beginPath();cx.arc(700,400,100+u*700,0.2,1.2);cx.stroke()}}
  board(1140,160,620,200,'SENT 12:00:00.000000',t,Ws(7,4),{size:50,bg:'#fbfaf6',cps:22});typed('ILLUSTRATIVE',1450,400,34,t,Ws(7,5),{align:'center',col:'#cdd6e6',cps:20})},'broadcast');
add([7,10],[7,18],{z0:1.04,z1:1.07,px:-50},(t)=>{const a=Ws(7,10);P.lab(t);const S=SURF.lab;
  typed('SENT   12:00:00.000000',S.x+90,S.y+130,66,t,a,{col:'#9fc2cf',cps:24});typed('GOT    12:00:00.067000',S.x+90,S.y+250,66,t,Ws(7,12),{col:'#f7f5f0',cps:24});
  typed('DELAY  = 0.067 s',S.x+90,S.y+370,66,t,Ws(7,14)+.3,{col:'#f4a261',cps:24});typed('ILLUSTRATIVE VALUES',S.x+S.w-30,S.y+S.h-30,30,t,a+.5,{align:'right',col:'#7f8ea8',cps:30});
  const o={...COMM,x:300,y:1040,h:520,t,lh:[-150,-450,'open'],rh:[170,-300,'point']};person(o);icon('clock',1500,820,1.8,t,Ws(7,16))},'compare');
add([7,18],[7,26],{z0:1.04,z1:1.08,px:60},(t)=>{const a=Ws(7,18);P.class(t);const S=SURF.class;
  typed('LIGHT:  c = 300,000 km/s',S.x+80,S.y+150,80,t,Ws(7,19),{col:'#f7f5f0',cps:26});typed('SOURCE: SPEED OF LIGHT, SI',S.x+80,S.y+S.h-30,32,t,Ws(7,23),{col:'#a9c9d0',cps:30});
  const w=Math.sin(t*3)*20;const o={...TEA,x:1560,y:1040,h:640,t,flip:true,lh:[-160,-300,'open'],rh:[-190+w,-520,'point']};person(o)},'light');
add([7,26],[7,32],{z0:1.05,z1:1.09,px:-50},(t)=>{const a=Ws(7,26);P.class(t);const S=SURF.class;
  typed('DISTANCE  =  c  ×  DELAY',S.x+80,S.y+210,84,t,a,{col:'#f7f5f0',cps:26});typed('= 300,000 × 0.067',S.x+80,S.y+330,84,t,Ws(7,29),{col:'#f4a261',cps:26});typed('= 20,100 km',S.x+80,S.y+440,84,t,Ws(7,30)+.4,{col:'#f7f5f0',cps:26});
  const o={...TEA,x:1560,y:1040,h:640,t,flip:true,lh:[-160,-300,'open'],rh:[-190+Math.sin(t*3)*30,-500,'point']};person(o);tick(1450,840,1.4,t,Ws(7,31)+.4)},'distance');
add([7,32],sS(8),{z0:1.03,z1:1.07,px:50},(t)=>{const a=Ws(7,32);P.map(t);
  const T=[[560,330],[860,260],[1260,300],[1400,420]];const pin=[960,560];
  T.forEach(([x,y],i)=>{const tt=a+i*.5;const u=spring(t,tt,9);if(u>0){ev(tt,'pop');sat(x,y,.38*u,t,0,false);cx.save();cx.strokeStyle='rgba(214,40,40,.8)';cx.lineWidth=7;cx.setLineDash([14,12]);cx.beginPath();cx.moveTo(x,y+30);cx.lineTo(pin[0],pin[1]-20);cx.stroke();cx.restore();tick(x+70,y+60,.7,t,tt+.25)}});
  if(t>Ws(7,36)-.3){pinIcon(pin[0],pin[1]+20,1.8);puff(pin[0],pin[1],t,Ws(7,36)-.3,100)}
  const o={...COMM,x:300,y:1040,h:520,t,lh:[-150,-300,'open'],rh:[170,-420,'point']};person(o)},'fourSats');
// ---- consequences ----
add(sS(8),sS(9),{z0:1.04,z1:1.08,py:-30},(t)=>{const a=Ss(8);P.lab(t);const S=SURF.lab;
  const v=Math.round(300*sstep(t,Ws(8,9)-.8,Ws(8,11)+.3));typed('ERROR:  1 µs',S.x+120,S.y+150,100,t,Ws(8,1),{col:'#f7f5f0',cps:22});counterText(`${v} m`,S.x+S.w/2,S.y+S.h-80,180,'#f4a261');
  const o={...SCI,x:300,y:1040,h:560,t,surprise:t>Ws(8,11),lh:[-150,-460,'open'],rh:[170,-470,'open']};person(o);if(t>Ws(8,11))bang(380,520,t,Ws(8,11)+.1)},'micro');
add(sS(9),[9,9],{z0:1.04,z1:1.08,px:-100},(t)=>{const a=Ss(9);P.space(t);const x=((t-a)*220)%2600-320;sat(x,420,.9,t);
  for(let i=0;i<5;i++)R(x-560-i*60,320+i*45,260,8,'rgba(247,245,240,.6)',4);
  signPost(1180,640,620,200,'14,000 km/h',t,Ws(9,6),{size:100,pl:0})},'zip');
add([9,9],[9,18],{z0:1.04,z1:1.07,px:50},(t)=>{const a=Ws(9,9);P.stage(t);const S={x:1100,y:170,w:600,h:250};
  board(S.x,S.y,S.w,S.h,'SPEED:\n−7 µs / DAY',t,Ws(9,13),{size:90});clockFace(1400,640,150,t*.4,.5);
  const sw=Math.sin(t*5)*50;const o={...EIN,x:560,y:1000,h:760,t,mouth:.6,lh:[-160,-300,'open'],rh:[240,-600,'point']};person(o);bang(700,260,t,Ws(9,12)+.2,'!')},'einstein');
add([9,18],sS(10),{z0:1.04,z1:1.07,py:-40},(t)=>{const a=Ws(9,18);P.space(t);const s=1+0.3*sstep(t,a,Se(9));
  sat(1000,360,1.0,t);cx.save();cx.strokeStyle='rgba(247,245,240,.7)';cx.lineWidth=8;cx.lineCap='round';for(let i=0;i<5;i++){const x=300+i*260;const u=((t*1.2+i*.2)%1);cx.beginPath();cx.moveTo(x,900-u*200);cx.lineTo(x,780-u*200);cx.moveTo(x-20,810-u*200);cx.lineTo(x,780-u*200);cx.lineTo(x+20,810-u*200);cx.stroke()}cx.restore();
  board(180,120,600,230,'GRAVITY:\n+45 µs / DAY',t,Ws(9,20),{size:90});clockFace(1000,640,120,t,3)},'gravity');
add(sS(10),sS(11),{z0:1.04,z1:1.08,px:-40},(t)=>{const a=Ss(10);P.lab(t);const S=SURF.lab;
  typed('+45  −  7',S.x+120,S.y+130,100,t,a,{col:'#f7f5f0',cps:22});
  const v=Math.round(38*sstep(t,Ws(10,2)-.1,Ws(10,3)+.5));counterText(`+${v} µs / DAY`,S.x+S.w/2,S.y+S.h-70,150,'#f4a261');
  const o={...SCI,x:300,y:1040,h:540,t,flip:false,surprise:t>Ws(10,3),lh:[-140,-450,'open'],rh:[170,-440,'open']};person(o);
  tick(1500,260,1.5,t,Ws(10,3)+.6)},'net');
// ---- fix ----
add(sS(11),[11,7],{z0:1.04,z1:1.08,px:60},(t)=>{const a=Ss(11);P.factory(t);const S=SURF.factory;R(S.x,S.y,S.w,S.h,'#0f1a30',10);
  typed('CLOCK  −38 µs',S.x+S.w/2,S.y+110,40,t,Ws(11,4)-.2,{align:'center',col:'#f4a261',cps:22});typed('BEFORE LAUNCH',S.x+S.w/2,S.y+185,30,t,Ws(11,5),{align:'center',col:'#cdd6e6',cps:22});
  cx.save();cx.translate(1260,690);cx.rotate(-1.2+sstep(t,Ws(11,2),Ws(11,6))*2.4);C(0,0,55,PAL.grey);R(-6,-55,12,60,INK,4);cx.restore();
  const o={...SCI,x:700,y:1040,h:700,t,mouth:.4,lh:[-170,-440,'open'],rh:[250,-340+Math.sin(t*3)*30,'fist']};person(o);R(0,780,W,0,'#000');},'detune');
add([11,7],sS(12),{z0:1.04,z1:1.07,py:-30},(t)=>{const a=Ws(11,7);P.space(t);sat(960,330,1.3,t);
  board(1240,560,560,190,'ON TIME',t,Ws(11,12)-.1,{size:100});icon('tick',700,610,3,t,Ws(11,13)+.3);
  typed('SLOW ON THE GROUND',420,900,60,t,Ws(11,7),{col:'#f7f5f0',cps:26});},'space');
// ---- twist ----
add(sS(12),sS(13),{z0:1.05,z1:1.09,px:-70},(t)=>{const a=Ss(12);P.street(t);const S=SURF.street;
  const drop=sstep(t,Ws(12,5)-.15,Ws(12,5)+.15);
  cx.save();cx.translate(0,drop*900);signPost(S.x,S.y,S.w,S.h,'I KNOW\nWHERE YOU ARE',t,-9,{size:90,pl:360});redX(S.x+40,S.y+16,S.w-80,S.h-40,t,-9);cx.restore();
  signPost(S.x,S.y,S.w,S.h,'EINSTEIN\nDOES.',t,Ws(12,5),{size:110,pl:360});
  const o={...COMM,x:660,y:920,h:800,t,smile:t<Ws(12,5),surprise:t>=Ws(12,5),lh:[-190,-400,'open'],rh:[190,-470,t>Ws(12,5)?'point':'open']};person(o);if(t>Ws(12,5)){bang(820,430,t,Ws(12,5)+.3,'!')}},'twist');
add(sS(13),'end',{z0:1.03,z1:1.06,px:50},(t)=>{const a=Ss(13);P.street(t);const S=SURF.street;
  signPost(S.x-140,S.y-10,720,280,'TRUST A MAP THAT\nIGNORES RELATIVITY?',t,a+.05,{size:84,pl:350,cps:26});
  const o={...COMM,x:660,y:920,h:800,t,look:.5,lh:[-170,-300,'open'],rh:[240,-400+Math.sin(t*2)*14,'open'],mouth:0};o.nod=0.04*Math.sin(t*3);person(o);
  bang(790,400,t,Ws(13,1)+.2,'?',INK)},'final');
const WIPES=[Ss(3),Ss(4),Ss(5),Ss(6),Ss(7),Ss(9),Ss(11),Ss(12)];
function drawFrame(t,rec){cx.setTransform(1,0,0,1,0,0);cx.fillStyle='#000';cx.fillRect(0,0,W,H);
  let s=SH.find(s=>t>=s.t0&&t<s.t1)||SH[SH.length-1];if(t<SH[0].t0)s=SH[0];
  const camo=s.cam;scn(t,s.t0,s.t1,camo,tt=>s.fn(tt));
  // screen-space overlays inside shot: date cards are drawn within scene fn but should be on screen: handled by dc flag
  WIPES.forEach(w=>wipe(t,w))}
