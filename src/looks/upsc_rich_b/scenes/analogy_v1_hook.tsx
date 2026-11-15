// GEO-04 Part 1, builder V1: `volcano-hook`. mode "mauna" (dusk on a broad shield, a red lava river) and mode "pinatubo" (ash column, then a globe under a thin veil).
import React from "react";
import {Tree, Sun, Hills, type AP} from "./analogy_kit";
import {Leader, Puffs, curve, eio, eo, mixn, mkLabels, poly, prog, rnd, sampleY} from "./analogy_v1_kit";

// ---- Mauna Loa at dusk -------------------------------------------------------------------------------------------------------
const shieldY = (x: number) => { const d = Math.sqrt((x - 990) ** 2 + 150 ** 2) - 150, u = Math.max(0, 1 - d / 1100); return 712 - 190 * Math.pow(u, 1.3); };

const Mauna: React.FC<AP> = ({f, dur, at}) => {
  const ridge = sampleY(shieldY, -20, 1940, 10), top = poly(ridge);
  const gl = at("gl"), pulse = 0.85 + 0.15 * Math.sin(f / 9);
  const river: [number, number][] = [[992, 500], [1030, 548], [1004, 606], [1070, 668], [1030, 736], [1112, 798], [1086, 868], [1150, 940], [1130, 1010]];
  const rw = (i: number) => 9 + i * 4.2;
  const rpath = curve(river);
  return (
    <g>
      <defs>
        <linearGradient id="v1m-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#141a3e"/><stop offset="0.38" stopColor="#3a2f63"/><stop offset="0.62" stopColor="#a4496a"/><stop offset="0.8" stopColor="#ee8a52"/><stop offset="1" stopColor="#f6b872"/>
        </linearGradient>
        <linearGradient id="v1m-flank" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4a3a40"/><stop offset="0.5" stopColor="#2e2429"/><stop offset="1" stopColor="#17110f"/></linearGradient>
        <linearGradient id="v1m-far" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7b5a86"/><stop offset="1" stopColor="#c6728a"/></linearGradient>
        <radialGradient id="v1m-glow" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#ffb25a" stopOpacity="0.95"/><stop offset="0.4" stopColor="#ff6a2a" stopOpacity="0.5"/><stop offset="1" stopColor="#d03a14" stopOpacity="0"/></radialGradient>
        <filter id="v1m-b6" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>
        <filter id="v1m-b16" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="16"/></filter>
        <clipPath id="v1m-clip"><path d={`${top} L1940,1100 L-20,1100 Z`}/></clipPath>
      </defs>
      <rect width={1920} height={1080} fill="url(#v1m-sky)"/>
      {Array.from({length: 70}).map((_, i) => (
        <circle key={i} cx={rnd(i, 1) * 1920} cy={rnd(i, 2) * 380} r={0.8 + rnd(i, 3) * 1.6} fill="#fff4dc" opacity={(0.35 + 0.55 * rnd(i, 4)) * (0.7 + 0.3 * Math.sin(f / 20 + i)) * (1 - rnd(i, 2) * 0.6)}/>
      ))}
      {/* the far, hazy neighbour */}
      <path d={`${poly(sampleY((x) => 700 - 130 * Math.pow(Math.max(0, 1 - Math.abs(x - 330) / 560), 1.2), -20, 960, 12))} L960,800 L-20,800 Z`} fill="url(#v1m-far)" opacity={0.85}/>
      {/* glow behind the summit */}
      <ellipse cx={992} cy={500} rx={520 * pulse} ry={230} fill="url(#v1m-glow)" opacity={0.75}/>
      {/* the broad shield */}
      <path d={`${top} L1940,1100 L-20,1100 Z`} fill="url(#v1m-flank)"/>
      <g clipPath="url(#v1m-clip)">
        {/* thin sheets of old lava: faint broad bands that follow the slope */}
        {Array.from({length: 11}).map((_, k) => (
          <path key={k} d={poly(ridge.map(([x, y]) => [x, y + 26 + k * 30 + 5 * Math.sin(x / 90 + k)] as [number, number]))} fill="none" stroke={k % 2 ? "#5a4650" : "#241a1e"} strokeWidth={9 + k * 1.5} opacity={0.28}/>
        ))}
        {Array.from({length: 150}).map((_, i) => {
          const x = rnd(i, 7) * 1940, y = 520 + rnd(i, 8) * 600;
          if (y < shieldY(x) + 8) return null;
          return <ellipse key={i} cx={x} cy={y} rx={2 + rnd(i, 9) * 9 * (y / 800)} ry={1.4 + rnd(i, 10) * 4 * (y / 800)} fill={rnd(i, 11) > 0.5 ? "#0f0b0b" : "#6a5560"} opacity={0.45}/>;
        })}
        {/* warm underlight from the river onto the rock */}
        <ellipse cx={1060} cy={700} rx={420} ry={320} fill="url(#v1m-glow)" opacity={0.42 * eo(prog(f, 8, 40))}/>
        {/* the lava river: crust edge, hot body, bright core, travelling highlights */}
        <path d={rpath} stroke="#ff5a1c" strokeWidth={rw(8) + 26} fill="none" strokeLinecap="round" opacity={0.42} filter="url(#v1m-b16)"/>
        {river.slice(0, -1).map((a, i) => <path key={`k${i}`} d={`M${a[0]},${a[1]} L${river[i + 1][0]},${river[i + 1][1]}`} stroke="#1a0b08" strokeWidth={rw(i) + 12} strokeLinecap="round" fill="none"/>)}
        {river.slice(0, -1).map((a, i) => <path key={`r${i}`} d={`M${a[0]},${a[1]} L${river[i + 1][0]},${river[i + 1][1]}`} stroke="#d2380f" strokeWidth={rw(i) + 4} strokeLinecap="round" fill="none"/>)}
        {river.slice(0, -1).map((a, i) => <path key={`c${i}`} d={`M${a[0]},${a[1]} L${river[i + 1][0]},${river[i + 1][1]}`} stroke="#ff8f30" strokeWidth={rw(i) * 0.66} strokeLinecap="round" fill="none"/>)}
        <path d={rpath} stroke="#ffd276" strokeWidth={9} fill="none" strokeLinecap="round" strokeDasharray="26 60" strokeDashoffset={-f * 2.6} opacity={0.9}/>
        <path d={rpath} stroke="#fff2c2" strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray="10 90" strokeDashoffset={-f * 3.6 - 20} opacity={0.9}/>
        {/* cooling dark crust patches drifting on the river */}
        {Array.from({length: 7}).map((_, i) => {
          const u = ((f * 0.0016 + i / 7) % 1), seg = u * (river.length - 1), j = Math.min(river.length - 2, Math.floor(seg)), t = seg - j;
          const x = mixn(river[j][0], river[j + 1][0], t) + (rnd(i, 3) - 0.5) * 8, y = mixn(river[j][1], river[j + 1][1], t);
          return <ellipse key={i} cx={x} cy={y} rx={4 + seg * 2.6} ry={2.2 + seg * 1.2} fill="#2a100a" opacity={0.7 * Math.sin(Math.PI * u)} transform={`rotate(24 ${x} ${y})`}/>;
        })}
      </g>
      {/* summit glow and spatter */}
      <ellipse cx={992} cy={496} rx={46} ry={14} fill="#ffe6a8" opacity={0.95}/>
      <ellipse cx={992} cy={496} rx={120} ry={30} fill="#ff7a2a" opacity={0.55} filter="url(#v1m-b6)"/>
      {Array.from({length: 18}).map((_, i) => {
        const u = (f * 0.006 + i / 18) % 1, x = 992 + (rnd(i, 21) - 0.5) * 90 + Math.sin(f / 25 + i) * 10 + 60 * u, y = 500 - 230 * u * (0.6 + rnd(i, 22) * 0.6);
        return <circle key={i} cx={x} cy={y} r={1.6 + rnd(i, 23) * 2.4} fill="#ffb454" opacity={(1 - u) * 0.9}/>;
      })}
      {/* low cloud glowing from beneath */}
      <g filter="url(#v1m-b16)">
        {Array.from({length: 9}).map((_, i) => {
          const x = ((rnd(i, 31) * 2300 + f * (0.22 + rnd(i, 32) * 0.15)) % 2300) - 190;
          const lit = Math.exp(-((x - 1000) ** 2) / (2 * 340 ** 2));
          return <ellipse key={i} cx={x} cy={430 + (i % 3) * 38 + rnd(i, 33) * 40} rx={230 + rnd(i, 34) * 120} ry={34 + rnd(i, 35) * 20}
            fill={`rgb(${Math.round(mixn(120, 255, lit))},${Math.round(mixn(70, 120, lit))},${Math.round(mixn(110, 62, lit))})`} opacity={0.62}/>;
        })}
      </g>
      {/* embers drifting up from the river */}
      {Array.from({length: 26}).map((_, i) => {
        const u = (f * 0.004 + i / 26) % 1, k = rnd(i, 41), seg = k * (river.length - 1), j = Math.min(river.length - 2, Math.floor(seg));
        const x = mixn(river[j][0], river[j + 1][0], seg - j) + Math.sin(f / 20 + i * 3) * 18 + u * 40, y = mixn(river[j][1], river[j + 1][1], seg - j) - u * 140;
        return <circle key={i} cx={x} cy={y} r={1.4 + rnd(i, 42) * 2.2} fill="#ffc46a" opacity={(1 - u) * 0.85}/>;
      })}
      {/* dark foreground rock with a warm rim */}
      <path d={`M-20,1080 L-20,968 Q180,936 330,968 T640,980 T900,1000 L1000,1080 Z`} fill="#0d0908"/>
      <path d={`M1600,1080 L1620,984 Q1760,948 1940,964 L1940,1080 Z`} fill="#0d0908"/>
      <path d="M-20,968 Q180,936 330,968 T640,980" fill="none" stroke="#ff7a30" strokeWidth={2.4} opacity={0.5}/>
      {/* leader to the lava, with the card */}
      <Leader pts={[[1330, 672], [1160, 758]]} f={f} at={gl} col="#ffe1b0" w={3.4}/>
    </g>
  );
};

// ---- Pinatubo: the column, then the veil around a small globe ----------------------------------------------------------------
const Column: React.FC<{f: number; dur: number}> = ({f, dur}) => {
  const vx = 760, vy = 586, grow = eio(prog(f, 4, 130)), H = 480 * grow, wind = 70;
  const cap = eo(prog(f, 90, 120));
  const topY = vy - H;
  return (
    <g>
      <defs>
        <linearGradient id="v1p-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3f86c8"/><stop offset="0.55" stopColor="#8cc4e6"/><stop offset="1" stopColor="#f4dcb4"/></linearGradient>
        <linearGradient id="v1p-ash" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#d9cbb8"/><stop offset="0.5" stopColor="#968a86"/><stop offset="1" stopColor="#4c4647"/></linearGradient>
        <radialGradient id="v1p-umb" cx="40%" cy="40%" r="70%"><stop offset="0" stopColor="#d5c8b8"/><stop offset="0.6" stopColor="#8d8280"/><stop offset="1" stopColor="#4f484a"/></radialGradient>
        <linearGradient id="v1p-cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9a9d98"/><stop offset="0.4" stopColor="#7f9a84"/><stop offset="1" stopColor="#4f8a58"/></linearGradient>
        <linearGradient id="v1p-fall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6e6465" stopOpacity="0.55"/><stop offset="1" stopColor="#8d8280" stopOpacity="0"/></linearGradient>
        <filter id="v1p-b10" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="10"/></filter>
      </defs>
      <rect width={1920} height={1080} fill="url(#v1p-sky)"/>
      <Sun x={1330} y={190} r={64} f={f}/>
      <Hills id="v1p-far" base={700} amp={70} top="#9bbfd2" bottom="#c8d9d8" seed={4} wl={520}/>
      <Hills id="v1p-mid" base={760} amp={64} top="#5f9a78" bottom="#84b58a" seed={9} wl={420}/>
      {/* the volcano: green lower flanks, grey upper cone */}
      <g transform={`translate(${vx} 830) scale(1.3) translate(-1230 -830)`}>
        <path d="M840,830 Q1040,740 1170,626 Q1230,602 1290,626 Q1420,740 1620,830 Z" fill="url(#v1p-cone)"/>
        <path d="M1230,606 Q1290,626 1420,740 Q1500,790 1620,830 L1330,830 Q1300,720 1230,606Z" fill="#1f3a2c" opacity={0.32}/>
        <path d="M1110,650 Q1170,616 1230,604 Q1210,660 1160,720 Z" fill="#cfd3cf" opacity={0.28}/>
      </g>
      {/* the column: billows stacked up the height, lit on the left */}
      <g>
        {Array.from({length: 30}).map((_, i) => {
          const u = i / 29;
          if (u > grow + 0.001) return null;
          const y = vy - H * u, w = mixn(70, 150, Math.pow(u, 0.75)) * (0.88 + rnd(i, 9) * 0.24);
          const x = vx + wind * Math.pow(u, 1.6) + Math.sin(i * 1.9 + f / 46) * 10;
          return (
            <g key={i}>
              {[-1, 0, 1].map((k) => {
                const r = w * (k === 0 ? 0.85 : 0.6 + rnd(i, k + 3) * 0.2), cx = x + k * w * 0.72 + Math.sin(f / 33 + i * 1.3 + k) * 5, cy = y + Math.cos(f / 29 + i + k) * 4 + (k ? 8 : 0);
                return (
                  <g key={k}>
                    <circle cx={cx + r * 0.1} cy={cy + r * 0.12} r={r} fill="#575051"/>
                    <circle cx={cx} cy={cy} r={r * 0.94} fill="url(#v1p-ash)"/>
                    <circle cx={cx - r * 0.3} cy={cy - r * 0.34} r={r * 0.55} fill="#e9dfd0" opacity={0.5}/>
                  </g>
                );
              })}
            </g>
          );
        })}
      </g>
      <g opacity={cap} transform={`translate(${vx + wind} ${topY + 24})`}>
        <ellipse cx={0} cy={26} rx={mixn(120, 360, cap)} ry={mixn(30, 56, cap)} fill="#5a5253"/>
        {Array.from({length: 22}).map((_, i) => {
          const k = (i / 21) * 2 - 1, r = 46 + rnd(i, 5) * 30 - Math.abs(k) * 14;
          return (
            <g key={i}>
              <circle cx={k * mixn(100, 350, cap) + 6} cy={Math.abs(k) * 22 - 6 + (rnd(i, 4) - 0.5) * 24 + 6} r={r} fill="#6d6465"/>
              <circle cx={k * mixn(100, 350, cap)} cy={Math.abs(k) * 22 - 6 + (rnd(i, 4) - 0.5) * 24} r={r * 0.94} fill={i % 2 ? "#a79b92" : "#c4b8ab"}/>
              <circle cx={k * mixn(100, 350, cap) - r * 0.28} cy={Math.abs(k) * 22 - 6 + (rnd(i, 4) - 0.5) * 24 - r * 0.3} r={r * 0.5} fill="#ece2d3" opacity={0.6}/>
            </g>
          );
        })}
      </g>
      {/* ash falling out of the umbrella and drifting downwind */}
      <g opacity={0.5 * cap}>
        <path d={`M${vx + wind + 100},${topY + 70} L${vx + wind + 520},${topY + 70} L${vx + 760},${vy + 150} L${vx + 330},${vy + 150} Z`} fill="url(#v1p-fall)"/>
        {Array.from({length: 26}).map((_, i) => {
          const u = (f * 0.004 + i / 26) % 1, x0 = vx + wind + 110 + rnd(i, 8) * 400;
          return <path key={i} d={`M${x0 + u * 200},${topY + 80 + u * (vy - topY)} l22,50`} stroke="#6b6061" strokeWidth={2.4} strokeLinecap="round" opacity={0.6 * Math.sin(Math.PI * u)}/>;
        })}
      </g>
      {/* base: dark boil at the vent */}
      <Puffs f={f} n={12} x0={vx} y0={vy + 10} rise={90} drift={30} r0={40} r1={78} speed={0.01} seed={7} spread={110} cols={["#8f8581", "#5c5455", "#2f2a2c"]}/>
      {/* foreground green hills and palms */}
      <Hills id="v1p-near" base={860} amp={56} top="#3f8a4a" bottom="#2f6a3a" seed={13} wl={360}/>
      <Hills id="v1p-front" base={960} amp={40} top="#2e7a3c" bottom="#1f5a2c" seed={21} wl={300}/>
      {[[150, 900, 1.15, 1], [290, 930, 0.9, 2], [1160, 935, 0.8, 3], [1790, 940, 0.95, 4], [1650, 910, 1.1, 5]].map(([x, y, s, sd]) => (
        <Tree key={sd} x={x} y={y} s={s} f={f} seed={sd} hue={sd * 4}/>
      ))}
    </g>
  );
};

const Globe: React.FC<{f: number; sw: number}> = ({f, sw}) => {
  const cx = 700, cy = 500, R = 250;
  const veil = eio(prog(f, sw + 30, 190)), spin = f * 0.18;
  const conts: [number, number, number, number][] = [[-0.45, -0.1, 0.5, 0.34], [0.35, 0.28, 0.4, 0.26], [0.1, -0.52, 0.34, 0.2], [-0.75, 0.42, 0.24, 0.18], [0.82, -0.2, 0.3, 0.3]];
  return (
    <g>
      <defs>
        <linearGradient id="v1g-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0c1636"/><stop offset="1" stopColor="#1d3566"/></linearGradient>
        <radialGradient id="v1g-sea" cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#5fb0e8"/><stop offset="0.6" stopColor="#2c6fb4"/><stop offset="1" stopColor="#12356e"/></radialGradient>
        <radialGradient id="v1g-atm" cx="50%" cy="50%" r="50%"><stop offset="0.8" stopColor="#9fd4ff" stopOpacity="0"/><stop offset="1" stopColor="#9fd4ff" stopOpacity="0.55"/></radialGradient>
        <linearGradient id="v1g-shade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#000" stopOpacity="0"/><stop offset="1" stopColor="#020816" stopOpacity="0.62"/></linearGradient>
        <linearGradient id="v1g-veil" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#e8c890"/><stop offset="1" stopColor="#b79a74"/></linearGradient>
        <clipPath id="v1g-clip"><circle cx={cx} cy={cy} r={R}/></clipPath>
      </defs>
      <rect width={1920} height={1080} fill="url(#v1g-bg)"/>
      {Array.from({length: 80}).map((_, i) => <circle key={i} cx={rnd(i, 51) * 1920} cy={rnd(i, 52) * 1080} r={0.8 + rnd(i, 53) * 1.6} fill="#fff" opacity={0.3 + 0.5 * rnd(i, 54)}/>)}
      {/* sunlight arriving from the left; fewer, paler rays get through as the veil thickens */}
      <circle cx={80} cy={190} r={70} fill="#ffe08a"/><circle cx={80} cy={190} r={140} fill="#ffd37a" opacity={0.22}/>
      {Array.from({length: 7}).map((_, i) => {
        const yy = 300 + i * 56, a = (1 - 0.72 * veil * (0.5 + 0.5 * rnd(i, 5))) * (0.9 - Math.abs(i - 3) * 0.1);
        const x1 = cx - R * Math.sqrt(Math.max(0, 1 - ((yy - cy) / R) ** 2)) - 6;
        return <g key={i} opacity={a}><path d={`M150,${190 + i * 14} L${x1},${yy}`} stroke="#ffe29a" strokeWidth={6} strokeLinecap="round" strokeDasharray="22 16" strokeDashoffset={-f * 2.4}/>
          <path d={`M150,${190 + i * 14} L${x1},${yy}`} stroke="#fff4cc" strokeWidth={2.4} strokeLinecap="round" strokeDasharray="22 16" strokeDashoffset={-f * 2.4} opacity={0.9}/></g>;
      })}
      <circle cx={cx} cy={cy} r={R + 18} fill="url(#v1g-atm)"/>
      <circle cx={cx} cy={cy} r={R} fill="url(#v1g-sea)"/>
      <g clipPath="url(#v1g-clip)">
        {/* graticule */}
        {[-0.66, -0.33, 0, 0.33, 0.66].map((k) => <ellipse key={k} cx={cx} cy={cy + k * R} rx={R * Math.sqrt(1 - k * k)} ry={R * 0.07} fill="none" stroke="#bfe0ff" strokeWidth={1.2} opacity={0.25}/>)}
        {[-0.7, -0.35, 0, 0.35, 0.7].map((k, i) => <ellipse key={i} cx={cx + Math.sin(spin / 60 + k * 3) * 30} cy={cy} rx={R * Math.abs(Math.cos(spin / 60 + k * 2.4)) * 0.92 + 4} ry={R} fill="none" stroke="#bfe0ff" strokeWidth={1.2} opacity={0.22}/>)}
        {conts.map(([x, y, w, h], i) => {
          const px = ((x * R + spin * 2 + R * 3) % (R * 2.6)) - R * 1.3;
          return <ellipse key={i} cx={cx + px} cy={cy + y * R} rx={w * R * 0.72} ry={h * R * 0.58} fill={i % 2 ? "#6aa564" : "#8fb673"} stroke="#3f6f44" strokeWidth={2} transform={`rotate(${i * 22 - 20} ${cx + px} ${cy + y * R})`}/>;
        })}
        <ellipse cx={cx - 70} cy={cy - 90} rx={150} ry={80} fill="#fff" opacity={0.1}/>
        {/* the veil: thin streaky bands wrapping the globe, thickening */}
        <g opacity={veil * 0.92}>
          {Array.from({length: 9}).map((_, i) => (
            <path key={i} d={`M${cx - R - 10},${cy - 150 + i * 38} Q${cx - 80},${cy - 190 + i * 38 + Math.sin(f / 40 + i) * 8} ${cx + R + 10},${cy - 150 + i * 38 + 14}`}
              stroke="url(#v1g-veil)" strokeWidth={30 + veil * 14} fill="none" opacity={0.22 + 0.1 * (i % 2)} strokeLinecap="round"/>
          ))}
          <rect x={cx - R} y={cy - R} width={R * 2} height={R * 2} fill="#caa878" opacity={0.18}/>
        </g>
        <rect x={cx - R} y={cy - R} width={R * 2} height={R * 2} fill="url(#v1g-shade)"/>
        <rect x={cx - R} y={cy - R} width={R * 2} height={R * 2} fill="#0a1226" opacity={0.5 * veil}/>
      </g>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#9fd4ff" strokeWidth={2} opacity={0.5}/>
      {/* a thermometer: the mercury slips down a little */}
      <g transform="translate(1560 300)" opacity={eo(prog(f, sw + 10, 24))}>
        <rect x={-14} y={0} width={28} height={300} rx={14} fill="#f8f3e8" stroke="#6c7a99" strokeWidth={3}/>
        <circle cx={0} cy={318} r={30} fill="#f8f3e8" stroke="#6c7a99" strokeWidth={3}/>
        <circle cx={0} cy={318} r={21} fill="#d8452e"/>
        <rect x={-6} y={mixn(70, 120, veil)} width={12} height={300 - mixn(70, 120, veil)} fill="#d8452e"/>
        {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={14} x2={i % 2 ? 26 : 34} y1={30 + i * 44} y2={30 + i * 44} stroke="#a7b4d0" strokeWidth={3}/>)}
      </g>
    </g>
  );
};

const PinaArt: React.FC<AP> = ({f, dur, at}) => {
  const sw = Math.min(dur * 0.7, Math.max(dur * 0.3, at("cl") - 26)), x = eio(prog(f, sw, 26));
  return (
    <g>
      {x < 0.999 && <g opacity={1 - x}><Column f={f} dur={dur}/></g>}
      {x > 0.001 && <g opacity={x}><Globe f={f} sw={sw}/></g>}
    </g>
  );
};

export const HookArt: React.FC<AP> = (p) => ((p.spec as any).mode === "pinatubo" ? <PinaArt {...p}/> : <Mauna {...p}/>);

const MaunaLabels = mkLabels({ml: {cx: 540, y: 150, size: 44, maxW: 760, tone: "dark"}, gl: {cx: 1540, y: 640, size: 38, maxW: 560, tone: "dark"}});
const PinaLabels: React.FC<AP> = (p) => {
  const sw = Math.min(p.dur * 0.7, Math.max(p.dur * 0.3, p.at("cl") - 26));
  const Pt = mkLabels({pt: {cx: 1480, y: 250, size: 40, maxW: 640}}), Cl = mkLabels({cl: {cx: 1300, y: 700, size: 40, maxW: 740, tone: "dark"}});
  return <><div style={{position: "absolute", inset: 0, opacity: 1 - eio(prog(p.f, sw, 26))}}><Pt {...p}/></div><Cl {...p}/></>;
};
export const HookLabels: React.FC<AP> = (p) => ((p.spec as any).mode === "pinatubo" ? <PinaLabels {...p}/> : <MaunaLabels {...p}/>);
