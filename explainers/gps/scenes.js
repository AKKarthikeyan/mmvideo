// ---------- empty plates (flat, no outlines). Each draws a full 1920x1080 world. ----------
const P={};
function sky(c1,c2){R(0,0,W,H,c1);R(0,H*.55,W,H*.45,c2)}
function windows(x,y,cols,rows,w,h,gx,gy,c){for(let i=0;i<cols;i++)for(let j=0;j<rows;j++)R(x+i*gx,y+j*gy,w,h,c,6)}
function cloud(x,y,s,t,c='#e9eef2'){const dx=((x+t*14)%2400)-240;E(dx,y,110*s,42*s,c);E(dx+70*s,y-26*s,80*s,40*s,c);E(dx-70*s,y-14*s,70*s,34*s,c)}
function ground(y,c,c2){R(0,y,W,H-y,c);R(0,y,W,16,c2)}
P.street=(t)=>{sky(PAL.sky,PAL.sky2);R(0,0,W,500,PAL.sky);cloud(300,150,1.2,t);cloud(1300,230,1,t*.8);
  R(40,160,430,700,PAL.beige);R(40,160,430,700,PAL.beige);R(330,160,140,700,PAL.beige2);windows(80,210,3,5,80,90,120,125,PAL.teal);
  R(500,330,360,530,PAL.teal);R(740,330,120,530,PAL.teal2);windows(540,380,2,4,90,80,150,115,PAL.beige);
  R(1500,200,380,660,PAL.purple);R(1760,200,120,660,PAL.purple2);windows(1540,250,3,5,70,85,100,125,PAL.beige);
  ground(820,'#b8b2a5','#c9c3b5');R(0,880,W,200,'#8f8a80');for(let i=0;i<9;i++)R(i*260+((0)),960,150,16,'#d6cfc0');
  R(0,822,W,26,'#cdc7b9')};
P.tower=(t)=>{sky(PAL.sky,PAL.sky2);cloud(500,160,1.3,t);cloud(1500,280,1,t*.7);
  R(660,190,600,700,PAL.beige);R(1100,190,160,700,PAL.beige2);PG([[620,200],[1300,200],[960,60]],PAL.teal);PG([[960,60],[1300,200],[1120,200]],PAL.teal2);
  C(960,470,230,'#f7f5f0');C(960,470,230,'#f7f5f0');C(1030,500,190,'#e7e2d6');C(960,470,210,'#f7f5f0');
  ground(860,'#7d8f78','#8ea08a');R(0,900,W,180,'#6c7d68')};
P.space=(t)=>{R(0,0,W,H,PAL.navy);for(let i=0;i<70;i++){const x=(i*397)%W,y=(i*211)%700;const s=2+((i*7)%3);if(Math.sin(t*2+i)>-0.6)C(x,y,s,'#cdd6e6')}
  C(960,1900,1180,PAL.teal);C(1060,1960,1130,PAL.teal2);cx.save();cx.beginPath();cx.arc(960,1900,1180,0,7);cx.clip();E(700,900+0,260,70,'#8fb1a2');E(1300,860,300,60,'#8fb1a2');E(1000,800,180,40,'#8fb1a2');cx.restore()};
P.stage=(t)=>{R(0,0,W,H,PAL.navy2);R(0,760,W,320,PAL.navy);R(0,760,W,14,'#34456b');
  PG([[860,0],[1060,0],[1500,800],[420,800]],'rgba(247,245,240,.16)');E(960,800,540,60,'rgba(247,245,240,.22)')};
P.pentagon=(t)=>{sky(PAL.sky,PAL.sky2);cloud(400,180,1.2,t);cloud(1400,150,1,t*.9);
  R(120,420,1680,400,PAL.beige);R(120,420,1680,50,PAL.beige2);R(120,770,1680,50,PAL.beige2);windows(170,520,17,2,60,70,95,95,PAL.teal);
  R(1700,160,10,400,PAL.grey2);PG([[1710,170],[1840,200],[1710,250]],RED);
  ground(820,'#9aa58f','#a8b39d');R(780,820,360,260,'#c9c3b5');PG([[780,820],[1140,820],[1300,1080],[620,1080]],'#c9c3b5')};
P.control=(t)=>{R(0,0,W,H,PAL.teal2);R(0,0,W,760,PAL.teal);R(0,760,W,320,'#2f4d52');
  R(300,130,1320,560,PAL.navy2,24);R(320,150,1280,520,'#0f1a30',16);
  for(let i=0;i<3;i++){R(120+i*600,760,520,60,PAL.beige2,10);R(150+i*600,720,200,50,PAL.navy,8)}};
P.ground=(t)=>{sky(PAL.sky,PAL.sky2);cloud(1300,170,1.2,t);R(0,700,W,380,'#7d8f78');E(300,760,700,220,'#8ea08a');E(1700,800,600,180,'#8ea08a');
  R(1000,420,620,360,PAL.beige);R(1400,420,220,360,PAL.beige2);R(1060,720,120,100,PAL.teal);windows(1080,470,3,1,100,100,150,0,PAL.teal);
  R(1280,150,330,200,PAL.beige);R(1450,150,160,200,PAL.beige2)};
P.class=(t)=>{R(0,0,W,H,PAL.beige);R(0,0,W,760,'#d9c9aa');R(0,760,W,320,'#a68a63');R(0,760,W,18,'#8b7149');
  R(260,120,1400,560,'#a68a63',20);R(285,145,1350,510,PAL.teal2,10);R(285,145,1350,60,'rgba(0,0,0,.08)');R(285,640,1350,15,'#cdbb9c')};
P.map=(t)=>{R(0,0,W,H,PAL.purple2);R(0,0,W,760,PAL.purple);R(0,760,W,320,'#52457a');
  R(280,110,1360,620,PAL.beige2,18);R(300,130,1320,580,PAL.sky2,12);
  // continents
  PG([[440,330],[620,260],[760,330],[700,470],[560,560],[470,470]],'#9fb394');PG([[900,240],[1120,220],[1340,300],[1440,420],[1260,500],[1120,430],[960,380]],'#9fb394');PG([[1100,520],[1260,560],[1220,660],[1080,640]],'#9fb394')};
P.lab=(t)=>{R(0,0,W,H,PAL.sky2);R(0,0,W,760,PAL.sky);R(0,760,W,320,'#6d7c8a');
  R(240,110,1440,540,PAL.navy2,22);R(262,132,1396,496,'#101b33',14);
  R(0,720,W,70,PAL.beige2);R(0,790,W,290,'#7d8c99')};
P.factory=(t)=>{R(0,0,W,H,PAL.beige2);R(0,0,W,780,PAL.beige);for(let i=0;i<6;i++)R(60+i*320,70,220,150,PAL.sky,10);
  R(0,780,W,300,'#5e6770');R(0,780,W,18,'#7b858f');R(1000,300,520,480,PAL.teal,24);R(1400,300,120,480,PAL.teal2,24);R(1080,370,360,220,PAL.navy2,14)};
// blank-surface rectangles (measured from the code above)
const SURF={street:{x:1130,y:215,w:560,h:250},tower:{x:790,y:300,w:340,h:150},pent:{x:380,y:545,w:1160,h:170},
  control:{x:340,y:170,w:1240,h:480},class:{x:300,y:160,w:1320,h:470},lab:{x:280,y:150,w:1360,h:460},map:{x:300,y:130,w:1320,h:580},factory:{x:1080,y:370,w:360,h:220}};
