// Story scenes for the illustration kit (17 Oct 2026, built for Moat 60 A01 "What Is a Moat in Business?").
//   letter  a faceless writer at a desk; an envelope slides in, a letter unfolds, and the key words lift off the page
//   copier  a copy machine on a street: an original rolls in, grey copies shoot out and a counter ticks up;
//           with rounds, each new original is copied again; an optional shop across the street stays alone
//   gauge   the castle cut open: one wall, the moat beside it and a painted stick with no numbers; the water
//           eases to each mark, a day counter can fast-forward, chips can drop by the stick, leaks can drip
// Every word and number on screen comes from the scene's props. No real person is drawn: the writer has no face.
import React from "react";
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from "../../rt";
import {SP, P, IStage, IHeading, INote, IStamps, Pop, Icon, StoreIcon, TFn, fit, fmtIN, clamp01} from "./kit";
import {COND, TYPE} from "../../voxkit";

// ---------- shared helpers ----------
const WOOD = "#C89B5A", WOOD_LT = "#DDB877", WOOD_DK = "#A87C42", EARTH = "#B98E57", EARTH_DK = "#9C7445";
const arr = (x: any): any[] => (Array.isArray(x) ? x : []);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const prog = (f: number, start: number, dur: number, ease: (t: number) => number = Easing.out(Easing.cubic)) =>
  interpolate(f, [start, start + Math.max(1, dur)], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease});
const pop = (f: number, fps: number, start: number, damping = 11, stiffness = 150) =>
  f < start ? 0 : spring({frame: f - start, fps, config: {damping, stiffness, mass: 0.8}});
// No `at`, or the number 0, means "on from the start": far enough back that every spring has settled.
const ON = -1000;
const when = (T: TFn, x: any) => (x == null || x === 0 ? ON : T(x));
const tw = (text: string, size: number) => text.length * size * 0.52;   // rough width of Oswald caps
const Txt: React.FC<{x: number; y: number; text: string; size: number; color?: string; anchor?: "start" | "middle" | "end"; font?: string}> =
  ({x, y, text, size, color = P.ink, anchor = "middle", font = COND}) =>
  <text x={x} y={y} fontFamily={font} fontWeight={700} fontSize={size} textAnchor={anchor} fill={color} letterSpacing={font === COND ? 1 : 0}>{text}</text>;
const idOf = (b: any) => String(b?.key ?? "x").replace(/[^A-Za-z0-9_-]/g, "");
// A paper label with an ink border, sized to its words.
const Label: React.FC<{x: number; y: number; start: number; text: string; size?: number; fill?: string; color?: string; rot?: number}> =
  ({x, y, start, text, size = 46, fill = P.white, color = P.ink, rot = 0}) => {
  const w = tw(text, size) + size * 0.95, h = size * 1.5;
  return (
    <Pop x={x} y={y} start={start} rot={rot}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={8} fill={fill} stroke={P.ink} strokeWidth={4} style={{filter: "url(#vshadow)"}}/>
      <Txt x={0} y={size * 0.36} text={text} size={size} color={color}/>
    </Pop>
  );
};
// A round badge with a number that pops each time the number changes.
const Badge: React.FC<{x: number; y: number; v: number; fill: string; since: number; r?: number}> = ({x, y, v, fill, since, r = 50}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const k = since <= ON ? 1 : 0.75 + 0.25 * pop(f, fps, since, 8, 220);
  const t = String(v), size = fit(t, r * 1.15, r * 1.7, 0.5);
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <circle r={r} fill={fill} stroke={P.ink} strokeWidth={5} style={{filter: "url(#vshadow)"}}/>
      <Txt x={0} y={size * 0.36} text={t} size={size} color={fill === P.white || fill === P.paper || fill === P.mustard ? P.ink : P.white}/>
    </g>
  );
};

// =====================================================================================================
// letter
// =====================================================================================================
// The writer: faceless, a plain jacket, writing with a pen that keeps moving. Drawn around the chair's foot (0, 0).
const Writer: React.FC = () => {
  const f = useCurrentFrame();
  const px = 34 * Math.sin(f * 0.19) + 10 * Math.sin(f * 0.53), py = 4 * Math.abs(Math.sin(f * 0.61));
  const nod = 2.2 * Math.sin(f * 0.07);
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      {/* chair back */}
      <rect x={-135} y={-330} width={270} height={300} rx={36} fill={P.shade} stroke={P.ink} strokeWidth={5}/>
      {/* body and jacket */}
      <path d="M -120 0 V -150 C -120 -215 -70 -240 0 -240 C 70 -240 120 -215 120 -150 V 0 Z" fill={P.blue} stroke={P.ink} strokeWidth={5}/>
      <path d="M -34 -238 L 0 -170 L 34 -238 Z" fill={P.white} stroke={P.ink} strokeWidth={4}/>
      <path d="M -6 -200 L 6 -200 L 10 -150 L 0 -138 L -10 -150 Z" fill={P.red} stroke={P.ink} strokeWidth={3}/>
      <path d="M -34 -238 L -14 -120 M 34 -238 L 14 -120" fill="none" stroke={P.ink} strokeWidth={4} opacity={0.6}/>
      {/* head: a plain round shape, no face */}
      <g transform={`rotate(${nod} 0 -250)`}>
        <rect x={-22} y={-268} width={44} height={34} fill={P.ink}/>
        <circle cx={0} cy={-322} r={66} fill={P.ink}/>
      </g>
      {/* left arm resting, right arm writing */}
      <path d="M -112 -170 C -150 -110 -140 -50 -70 -36" fill="none" stroke={P.ink} strokeWidth={42}/>
      <path d="M -112 -170 C -150 -110 -140 -50 -70 -36" fill="none" stroke={P.blue} strokeWidth={32}/>
      <path d={`M 112 -170 C 150 -110 ${100 + px} -60 ${60 + px} ${-36 - py}`} fill="none" stroke={P.ink} strokeWidth={42}/>
      <path d={`M 112 -170 C 150 -110 ${100 + px} -60 ${60 + px} ${-36 - py}`} fill="none" stroke={P.blue} strokeWidth={32}/>
      <circle cx={60 + px} cy={-36 - py} r={17} fill={P.ink}/>
      <line x1={60 + px} y1={-36 - py} x2={46 + px} y2={-4 - py} stroke={P.mustard} strokeWidth={8}/>
    </g>
  );
};
// A desk lamp whose light breathes a little.
const Lamp: React.FC<{x: number; y: number}> = ({x, y}) => {
  const f = useCurrentFrame();
  const glow = 0.2 + 0.04 * Math.sin(f * 0.13);
  return (
    <g transform={`translate(${x} ${y})`} strokeLinejoin="round" strokeLinecap="round">
      <path d="M -40 -186 L -210 0 H 60 Z" fill={P.gold} opacity={glow}/>
      <ellipse cx={0} cy={-6} rx={56} ry={14} fill={P.ink}/>
      <path d="M 0 -10 L 30 -120 L -30 -190" fill="none" stroke={P.ink} strokeWidth={12}/>
      <circle cx={30} cy={-120} r={11} fill={P.mustard} stroke={P.ink} strokeWidth={4}/>
      <path d="M -6 -214 L -76 -168 L -42 -128 L 18 -188 Z" fill={P.green} stroke={P.ink} strokeWidth={5}/>
    </g>
  );
};

const LP = {DESK_X0: 210, DESK_X1: 1000, DESK_Y: 690, PANEL_Y1: 880, PX: 1390, PY: 640, PW: 540, PH: 470, ROW_Y: 300};
const Letter: React.FC<SP> = ({s, n, T, b}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const keys = arr(s.keys).filter((k) => k && k.text).slice(0, 4);
  const ka = keys.map((k) => when(T, k.at));
  const whoAt = when(T, s.whoAt);
  const who = s.who ? String(s.who) : "", tag = s.tag ? String(s.tag) : "";
  const cid = `wle-${idOf(b)}`;
  // The envelope slides in, its flap opens, the letter rises out and unfolds; then the envelope drops away.
  const slide = prog(f, 0, 16, Easing.out(Easing.back(1.2)));
  const flap = prog(f, 14, 9, Easing.inOut(Easing.quad));
  const rise = prog(f, 21, 15, Easing.out(Easing.cubic));
  const unfold = prog(f, 33, 16, Easing.out(Easing.back(1.1)));
  const away = prog(f, 36, 14, Easing.in(Easing.quad));
  const ex = lerp(2250, LP.PX, slide), ey = 800 + away * 360;
  // Paper: the folded strip (a third of the page) rises, then opens to its full height around the same middle.
  const ph = lerp(LP.PH / 3, LP.PH, unfold), py = lerp(820, LP.PY, rise), paperOn = f >= 21;
  // Lines of writing (grey bars, no real words) type on across the beat.
  const lines = [0.92, 0.84, 0.96, 0.7, 0.9, 0.62, 0.88, 0.76, 0.5];
  const typeStart = 52, perLine = Math.max(10, (n * 0.7 - typeStart) / lines.length);
  // Each key word sits on its own line of the page (2, 4, 6, ...), which is highlighted when the word is spoken.
  const keyLine = (i: number) => Math.min(lines.length - 1, 2 + i * 2);
  // The row of big words above the scene: each word keeps its own slot.
  const ksize = Math.min(150, fit(keys.map((k) => String(k.text)).join("  "), 150, 1640, 0.53));
  const kw = keys.map((k) => tw(String(k.text), ksize)), gapW = ksize * 0.55, total = kw.reduce((a, c) => a + c, 0) + gapW * Math.max(0, keys.length - 1);
  const kx = kw.map((w, i) => 960 - total / 2 + kw.slice(0, i).reduce((a, c) => a + c, 0) + gapW * i + w / 2);
  const lineY = (i: number) => -LP.PH / 2 + 108 + i * 38;
  const plateSize = who ? fit(who, 54, 560) : 54, plateW = tw(who, plateSize) + 80;
  return (
    <IStage n={n}>
      <IHeading text={s.heading}/>
      <INote text={s.note}/>
      {/* floor shadow, desk, writer behind it, lamp on it */}
      <ellipse cx={(LP.DESK_X0 + LP.DESK_X1) / 2} cy={LP.PANEL_Y1 + 8} rx={460} ry={26} fill={P.shade} opacity={0.22}/>
      <g transform={`translate(560 ${LP.DESK_Y + 6}) scale(0.92)`}><Writer/></g>
      <rect x={LP.DESK_X0} y={LP.DESK_Y} width={LP.DESK_X1 - LP.DESK_X0} height={30} rx={6} fill={WOOD_LT} stroke={P.ink} strokeWidth={5}/>
      <rect x={LP.DESK_X0 + 30} y={LP.DESK_Y + 30} width={LP.DESK_X1 - LP.DESK_X0 - 60} height={LP.PANEL_Y1 - LP.DESK_Y - 30} fill={WOOD} stroke={P.ink} strokeWidth={5}/>
      <path d={`M ${LP.DESK_X0 + 60} ${LP.DESK_Y + 52} H ${LP.DESK_X1 - 60}`} stroke={WOOD_DK} strokeWidth={4}/>
      <Lamp x={880} y={LP.DESK_Y}/>
      {/* the name plate on the desk front */}
      {who ? (
        <Pop x={(LP.DESK_X0 + LP.DESK_X1) / 2} y={LP.DESK_Y + 98} start={whoAt}>
          <rect x={-plateW / 2} y={-plateSize * 0.82} width={plateW} height={plateSize * 1.64} rx={6} fill={P.gold} stroke={P.ink} strokeWidth={5} style={{filter: "url(#vshadow)"}}/>
          <rect x={-plateW / 2 + 10} y={-plateSize * 0.82 + 10} width={plateW - 20} height={plateSize * 1.64 - 20} rx={4} fill="none" stroke={P.ink} strokeWidth={2} opacity={0.5}/>
          <Txt x={0} y={plateSize * 0.36} text={who} size={plateSize}/>
        </Pop>
      ) : null}
      {/* the envelope */}
      {ey < 1150 ? (
        <g transform={`translate(${ex} ${ey}) rotate(${lerp(8, -3, slide) + away * 14})`} strokeLinejoin="round">
          <rect x={-190} y={-110} width={380} height={220} rx={6} fill={P.paper} stroke={P.ink} strokeWidth={5} style={{filter: "url(#vshadow)"}}/>
          <path d="M -190 110 L 0 -4 L 190 110" fill="none" stroke={P.ink} strokeWidth={4}/>
          <path d={`M -190 -110 L 0 ${-110 + 130 * (1 - 2 * flap)} L 190 -110 Z`} fill={flap > 0.5 ? P.white : P.paper} stroke={P.ink} strokeWidth={5}/>
          <circle cx={0} cy={-110 + 112 * (1 - 2 * flap)} r={18} fill={P.red} stroke={P.ink} strokeWidth={3} opacity={flap < 0.45 ? 1 : 0}/>
        </g>
      ) : null}
      {/* the letter */}
      {paperOn ? (
        <g transform={`translate(${LP.PX} ${py}) rotate(-2.5)`}>
          <defs><clipPath id={cid}><rect x={-LP.PW / 2} y={-ph / 2} width={LP.PW} height={ph}/></clipPath></defs>
          <rect x={-LP.PW / 2} y={-ph / 2} width={LP.PW} height={ph} fill={P.white} stroke={P.ink} strokeWidth={5} style={{filter: "url(#vshadow)"}}/>
          <g clipPath={`url(#${cid})`}>
            <g transform={`scale(1 ${ph / LP.PH})`}>
              {/* fold creases fade as the page opens */}
              {[-1, 1].map((sd) => <line key={sd} x1={-LP.PW / 2} y1={sd * LP.PH / 6} x2={LP.PW / 2} y2={sd * LP.PH / 6} stroke={P.ink} strokeWidth={2} opacity={0.35 * (1 - unfold) + 0.12}/>)}
              {/* the small typewriter tag at the top of the page */}
              {tag && f >= whoAt ? <g>
                <rect x={-LP.PW / 2 + 34} y={-LP.PH / 2 + 30} width={tag.length * 16 + 28} height={44} fill={P.ink}/>
                <text x={-LP.PW / 2 + 48} y={-LP.PH / 2 + 61} fontFamily={TYPE} fontSize={26} fill={P.white}>{tag}</text>
              </g> : null}
              {lines.map((len, i) => {
                const p = prog(f, typeStart + i * perLine, perLine, Easing.linear);
                const ki = keys.findIndex((_, j) => keyLine(j) === i), hot = ki >= 0 && f >= ka[ki];
                const full = (LP.PW - 80) * len;
                return (
                  <g key={i}>
                    {hot ? <rect x={-LP.PW / 2 + 34} y={lineY(i) - 17} width={full * prog(f, ka[ki], 8) + 12} height={30} fill={P.mustard} opacity={0.75}/> : null}
                    <rect x={-LP.PW / 2 + 40} y={lineY(i) - 6} width={Math.max(0, full * (hot ? 1 : p))} height={11} rx={5} fill={hot ? P.ink : P.gray} opacity={hot ? 0.9 : 0.6}/>
                  </g>
                );
              })}
            </g>
          </g>
        </g>
      ) : null}
      {/* each key word lifts off its line of the page and grows into a big ink word in the row above */}
      {keys.map((k, i) => {
        const t0 = ka[i];
        if (f < t0) return null;
        const u = t0 <= ON ? 1 : prog(f, t0 + 4, 18, Easing.out(Easing.back(1.4)));
        const sx = LP.PX - LP.PW / 2 + 40 + 120, sy = LP.PY + lineY(keyLine(i));
        const x = lerp(sx, kx[i], u), y = lerp(sy, LP.ROW_Y, u) - Math.sin(u * Math.PI) * 60, size = lerp(30, ksize, u);
        const last = i === keys.length - 1 && keys.length > 1;
        const wob = Math.sin((f - t0) * 0.09 + i) * 1.2;
        return <g key={i} transform={`rotate(${wob + (i % 2 ? 1.5 : -1.5)} ${x} ${y - size * 0.3})`}>
          <text x={x + 5} y={y + 7} fontFamily={COND} fontWeight={700} fontSize={size} textAnchor="middle" fill={P.shade} opacity={0.25} letterSpacing={1}>{String(k.text)}</text>
          <Txt x={x} y={y} text={String(k.text)} size={size} color={last ? P.red : P.ink}/>
        </g>;
      })}
      <IStamps s={s} T={T}/>
    </IStage>
  );
};

// =====================================================================================================
// copier
// =====================================================================================================
const CP = {G: 760, ICON: 180, STEP: 170};
const ACC = [P.red, P.mustard, P.blue, P.green, P.purple, P.teal];
const BOXC = [WOOD, P.mustard, P.blue, P.green, P.purple, P.teal];
const iconTop = (size: number) => CP.G - 0.46 * size - 0.42 * size;   // the kit icons sit in a box from -46 to +42
// One icon standing on the pavement at x; `k` picks the colour of a "new" original.
const Standing: React.FC<{name: string; x: number; size: number; k?: number; gray?: string; bob?: number; rot?: number}> = ({name, x, size, k = 0, gray, bob = 0, rot = 0}) => {
  const y = CP.G - 0.42 * size - bob;
  const col = name === "box" ? {color: BOXC[k % BOXC.length]} : {accent: ACC[k % ACC.length]};
  return <g filter={gray ? `url(#${gray})` : undefined} transform={`rotate(${rot} ${x} ${CP.G})`}><Icon name={name} x={x} y={y} size={size} {...col}/></g>;
};
// The copy machine, drawn around the middle of its foot (0, 0).
const Machine: React.FC<{flash: number; shake: number; busy: boolean}> = ({flash, shake, busy}) => {
  const f = useCurrentFrame();
  const lights = [P.green, P.mustard, P.red].map((c, i) => (busy ? (Math.floor(f / 4) + i) % 3 === 0 : (Math.floor(f / 14) + i) % 3 === 0) ? c : P.gray);
  return (
    <g transform={`translate(${shake} 0)`} strokeLinejoin="round" strokeLinecap="round">
      {/* light from the glass when it copies */}
      {flash > 0 ? <path d={`M -150 -226 L -260 ${-226 - 200 * flash} H 260 L 150 -226 Z`} fill={P.gold} opacity={0.45 * flash}/> : null}
      <rect x={-160} y={-36} width={320} height={36} fill={P.ink}/>
      <rect x={-150} y={-226} width={300} height={190} rx={10} fill={P.white} stroke={P.ink} strokeWidth={5}/>
      <rect x={-130} y={-140} width={180} height={18} rx={4} fill={P.paper} stroke={P.ink} strokeWidth={3}/>
      <rect x={-130} y={-100} width={180} height={18} rx={4} fill={P.paper} stroke={P.ink} strokeWidth={3}/>
      {/* control panel */}
      <rect x={72} y={-200} width={62} height={92} rx={6} fill={P.shade} stroke={P.ink} strokeWidth={4}/>
      {lights.map((c, i) => <circle key={i} cx={103} cy={-180 + i * 26} r={8} fill={c} stroke={P.ink} strokeWidth={2.5}/>)}
      {/* glass and lid: the lid lifts when the light flashes */}
      <rect x={-150} y={-240} width={300} height={16} fill={flash > 0 ? P.gold : P.blue} stroke={P.ink} strokeWidth={4}/>
      <g transform={`rotate(${-14 * flash} 150 -240)`}><rect x={-156} y={-262} width={312} height={24} rx={6} fill={P.gray} stroke={P.ink} strokeWidth={5}/></g>
      {/* feed tray on the left, out slot on the right */}
      <path d="M -150 -150 L -240 -176 L -240 -166 L -150 -134 Z" fill={P.paper} stroke={P.ink} strokeWidth={4}/>
      <rect x={146} y={-74} width={20} height={34} fill={P.ink}/>
      <path d="M 166 -60 L 250 -40 L 250 -30 L 166 -46 Z" fill={P.paper} stroke={P.ink} strokeWidth={4}/>
    </g>
  );
};

const Copier: React.FC<SP> = ({s, n, T, b}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const o = s.original || {}, cp = s.copies || {}, rd = s.rounds && s.rounds.count ? s.rounds : null, kp = s.keep || null;
  const icon = String(o.icon || "store"), cIcon = String(cp.icon || icon);
  const R = rd ? Math.max(1, Math.round(rd.count)) : 1, count = Math.max(0, Math.round(cp.count ?? 0));
  const per = rd ? Math.max(1, Math.round(count / R)) : count;
  const oAt = when(T, o.at), cAt = when(T, cp.at);
  const mx = kp ? 640 : 820;
  const feedX = mx - 420, outX0 = mx + 340;
  // Times: copy j leaves the machine at shot[j]; original r arrives at arrive[r].
  const shots: number[] = [], arrive: number[] = [oAt];
  if (!rd) { for (let j = 0; j < count; j++) shots.push(cAt + 8 + j * 11); }
  else {
    const r2 = Math.max(cAt + 8 + per * 11 + 34, rd.at != null ? T(rd.at) : 0), last = Math.max(r2, n - 40);
    const g = R > 1 ? clamp((last - r2) / (R - 1), 34, 75) : 0;
    const roundAt = Array.from({length: R}, (_, r) => (r === 0 ? cAt : r2 + (r - 1) * g));
    roundAt.forEach((t, r) => { if (r > 0) arrive.push(t - 18); for (let j = 0; j < per && shots.length < count; j++) shots.push(t + 8 + j * 11); });
  }
  const done = shots.filter((t) => f >= t + 14).length, lastLand = done ? shots[done - 1] + 14 : ON;
  const round = arrive.filter((t) => f >= t).length;   // originals so far
  const flashAt = shots.map((t) => t - 8);
  const flash = Math.max(0, ...flashAt.map((t) => (f >= t && f < t + 14 ? Math.sin(((f - t) / 14) * Math.PI) : 0)));
  const busy = shots.some((t) => f >= t - 10 && f < t + 6);
  const shake = busy ? 3 * Math.sin(f * 2.1) : 0;
  const gray = `wcp-g-${idOf(b)}`;
  // Copies sit in a row to the right of the machine; with many, the row squeezes.
  const rowEnd = kp ? 1330 : 1760, step = count > 1 ? Math.min(CP.STEP, (rowEnd - outX0) / (count - 1)) : 0, csize = Math.min(CP.ICON, step ? step * 0.98 : CP.ICON);
  const keepX = 1590, keepIn = kp ? when(T, kp.inAt ?? kp.at) : ON, keepAt = kp ? when(T, kp.at) : ON;
  const labelY = 470;
  return (
    <IStage n={n}>
      <defs><filter id={gray}><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope="0.8" intercept="0.18"/><feFuncG type="linear" slope="0.8" intercept="0.18"/><feFuncB type="linear" slope="0.8" intercept="0.18"/></feComponentTransfer></filter></defs>
      <IHeading text={s.heading}/>
      <INote text={s.note}/>
      {/* clouds drift across the sky */}
      {[[260, 250, 1.0, 0.18], [900, 190, 0.8, 0.12], [1420, 330, 1.2, 0.15]].map((c, i) => {
        const x = ((c[0] + f * c[3]) % 2100) - 90;
        return <g key={i} transform={`translate(${x} ${c[1]}) scale(${c[2]})`}>
          <path d="M -90 20 a 34 34 0 0 1 30 -48 a 46 46 0 0 1 84 -6 a 32 32 0 0 1 56 22 a 30 30 0 0 1 2 32 Z" fill={P.white} stroke={P.ink} strokeWidth={4} strokeLinejoin="round" opacity={0.9}/>
        </g>;
      })}
      {/* the street */}
      <rect x={96} y={CP.G} width={1728} height={40} fill={P.paper} stroke={P.ink} strokeWidth={4}/>
      {Array.from({length: 13}, (_, i) => <line key={i} x1={200 + i * 128} y1={CP.G + 4} x2={186 + i * 128} y2={CP.G + 36} stroke={P.ink} strokeWidth={3} opacity={0.35}/>)}
      <rect x={96} y={CP.G + 40} width={1728} height={34} fill={P.gray} opacity={0.5}/>
      {Array.from({length: 10}, (_, i) => { const x = 150 + i * 196 - ((f * 3) % 196); return x < 110 || x > 1720 ? null : <rect key={i} x={x} y={CP.G + 54} width={90} height={8} fill={P.white} opacity={0.8}/>; })}
      <g transform={`translate(${mx} ${CP.G}) scale(1.25)`}><Machine flash={flash} shake={shake} busy={busy}/></g>
      {/* originals: each rolls in from the left; an old one is pushed off as the next arrives */}
      {arrive.map((t, r) => {
        if (f < t) return null;
        const next = arrive[r + 1], gone = next != null ? prog(f, next, 10, Easing.in(Easing.back(1.6))) : 0;
        if (gone >= 1) return null;
        const u = t <= ON ? 1 : prog(f, t, 18, Easing.out(Easing.back(1.3)));
        const x = lerp(-140, feedX, u), hop = (u < 1 ? Math.abs(Math.sin(u * Math.PI * 3)) * 26 : 0) + Math.abs(Math.sin(f * 0.15)) * 3;
        // an old machine shrinks away on the spot as the next one rolls in
        return <g key={r} transform={`translate(${x} ${CP.G}) scale(${1 - gone}) translate(${-x} ${-CP.G})`}><Standing name={icon} x={x} size={CP.ICON} k={r} bob={hop} rot={u < 1 ? -6 * (1 - u) : 0}/></g>;
      })}
      {o.label ? <Label x={feedX} y={labelY} start={oAt} text={String(o.label)}/> : null}
      {rd && f >= oAt ? <Badge x={feedX - tw(String(o.label || ""), 46) / 2 - 76} y={labelY} v={Math.max(1, round)} fill={P.green} since={arrive[Math.max(0, round - 1)]} r={42}/> : null}
      {/* copies shoot out of the slot and land in the row, one by one */}
      {shots.map((t, j) => {
        if (f < t) return null;
        const u = t <= ON ? 1 : prog(f, t, 14, Easing.out(Easing.quad));
        const x1 = outX0 + j * step, x = lerp(mx + 250, x1, u), arc = Math.sin(u * Math.PI) * 150;
        const land = f - t - 14, squash = land >= 0 && land < 12 ? 0.1 * Math.sin(land * 0.8) * Math.exp(-land / 4) : 0;
        const size = lerp(csize * 0.35, csize, u), bob = arc + Math.abs(Math.sin(f * 0.17 + j * 1.7)) * 3;
        const r = rd ? Math.floor(j / per) : 0;
        return <g key={j} transform={`translate(${x} ${CP.G}) scale(${1 + squash} ${1 - squash}) translate(${-x} ${-CP.G})`}>
          <Standing name={cIcon} x={x} size={size} k={r} gray={gray} bob={bob} rot={(1 - u) * 20}/>
        </g>;
      })}
      {count > 0 && f >= (shots[0] ?? ON) ? (() => {
        const cx = outX0 + (count - 1) * step / 2, lab = cp.label ? String(cp.label) : "";
        const lw = lab ? tw(lab, 46) + 44 : 0;
        return <g>
          {lab ? <Label x={cx - 52} y={labelY} start={shots[0]} text={lab}/> : null}
          <Badge x={cx + (lab ? lw / 2 + 4 : 0)} y={labelY} v={done} fill={P.red} since={lastLand} r={46}/>
        </g>;
      })() : null}
      {/* the shop across the street that nobody copies */}
      {kp && f >= keepIn ? (() => {
        const u = keepIn <= ON ? 1 : pop(f, fps, keepIn, 12, 120), ks = 250;
        return <g>
          <g transform={`translate(${keepX} ${CP.G}) scale(${0.6 + 0.4 * u}) translate(${-keepX} ${-CP.G})`}>
            <ellipse cx={keepX} cy={CP.G + 4} rx={140} ry={14} fill={P.shade} opacity={0.2}/>
            <Standing name={String(kp.icon || "store")} x={keepX} size={ks} k={1}/>
          </g>
          {kp.label ? <Label x={keepX} y={labelY} start={keepIn} text={String(kp.label)}/> : null}
          {f >= keepAt ? <Badge x={keepX + tw(String(kp.label || ""), 46) / 2 + 86} y={labelY} v={Math.round(kp.count ?? 0)} fill={P.white} since={keepAt} r={44}/> : null}
        </g>;
      })() : null}
      <IStamps s={s} T={T}/>
    </IStage>
  );
};

// =====================================================================================================
// gauge
// =====================================================================================================
// Cross-section: island ground on the left, the castle wall, the moat (trench), the far bank on the right.
const G = {TOP: 470, FLOOR: 836, WALL_X0: 330, WALL_X1: 620, WALL_TOP: 300, TR_X1: 1290, TR_X1B: 1236, STICK_X: 588, STICK_W: 32, BOT: 925};
const levelY = (L: number) => G.FLOOR - (clamp(L, 0, 100) / 100) * (G.FLOOR - G.TOP - 22);
const Gauge: React.FC<SP> = ({s, n, T, b}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const moves = arr(s.moves).filter((m) => m && m.to != null).map((m) => ({to: Number(m.to), t: when(T, m.at)})).sort((a, c) => a.t - c.t);
  let L = Number(s.start ?? 60);
  for (const m of moves) L = lerp(L, m.to, m.t <= ON ? 1 : prog(f, m.t, 26, Easing.inOut(Easing.cubic)));
  const wy = levelY(L);
  const id = idOf(b);
  // Water surface: a gentle wave that keeps moving.
  const wave = (x: number) => wy + 6 * Math.sin(x / 46 - f * 0.16) + 3 * Math.sin(x / 19 + f * 0.23);
  const trench = `M ${G.WALL_X1} ${G.TOP} L ${G.WALL_X1} ${G.FLOOR} L ${G.TR_X1B} ${G.FLOOR} L ${G.TR_X1} ${G.TOP} Z`;
  const surf = Array.from({length: 35}, (_, i) => { const x = G.WALL_X1 + (i / 34) * (G.TR_X1 - G.WALL_X1); return `${x.toFixed(1)} ${wave(x).toFixed(1)}`; });
  // Day counter on a flip calendar.
  const days = s.days && s.days.to != null ? s.days : null, dAt = days ? when(T, days.at) : ON;
  const dDur = days ? clamp(n - dAt - 24, 40, 150) : 1;
  const dp = days ? (dAt <= ON ? 1 : prog(f, dAt, dDur, Easing.inOut(Easing.quad))) : 0;
  const day = days ? Math.max(1, Math.round(1 + (Number(days.to) - 1) * dp)) : 0;
  const flipping = days && f >= dAt && dp < 1;
  // Rival: a grey shop on the far bank creeps to the edge as the water falls.
  const near = clamp01((Number(s.start ?? 60) - L) / 22);
  const rx = lerp(1480, 1360, near) + Math.sin(f * 0.21) * 4, rhop = Math.abs(Math.sin(f / 7)) * 6;
  const drips = arr(s.drips).map((d, i) => ({t: when(T, d && d.at), x: [820, 1000, 1150, 910, 1080][i % 5]}));
  const ticks = arr(s.ticks).filter((t) => t && t.text);
  const flagW = Math.sin(f * 0.2);
  return (
    <IStage n={n}>
      <defs><clipPath id={`wga-${id}`}><path d={trench}/></clipPath></defs>
      <IHeading text={s.heading}/>
      <INote text={s.note}/>
      {/* earth in cross-section, with grass on top */}
      <rect x={90} y={G.TOP} width={1740} height={G.BOT - G.TOP} fill={EARTH} stroke={P.ink} strokeWidth={5}/>
      {[560, 660, 760, 880].map((y, i) => <path key={i} d={`M 100 ${y} C 500 ${y - 20 + i * 6}, 1200 ${y + 24}, 1820 ${y - 8}`} fill="none" stroke={EARTH_DK} strokeWidth={4} opacity={0.55}/>)}
      {[[160, 600], [260, 780], [1420, 640], [1700, 760], [1560, 860], [880, 890], [420, 880]].map((p, i) => <ellipse key={i} cx={p[0]} cy={p[1]} rx={18} ry={11} fill={EARTH_DK} stroke={P.ink} strokeWidth={3}/>)}
      <rect x={90} y={G.TOP - 14} width={1740} height={22} fill={P.green} stroke={P.ink} strokeWidth={5}/>
      {/* the trench, then the water in it */}
      <path d={trench} fill={P.cream} stroke={P.ink} strokeWidth={5}/>
      <path d={trench} fill={P.shade} opacity={0.1}/>
      <g clipPath={`url(#wga-${id})`}>
        <path d={`M ${G.WALL_X1 - 10} ${G.FLOOR + 20} L ${surf.join(" L ")} L ${G.TR_X1 + 10} ${G.FLOOR + 20} Z`} fill={P.blue}/>
        {[0, 1, 2].map((i) => <path key={i} d={`M ${G.WALL_X1 + 40 + i * 190 - ((f * 1.5 + i * 50) % 120)} ${wy + 30 + i * 28} h 90`} stroke={P.white} strokeWidth={5} strokeLinecap="round" opacity={wy + 30 + i * 28 < G.FLOOR - 10 ? 0.7 : 0}/>)}
        <path d={`M ${surf.join(" L ")}`} fill="none" stroke={P.ink} strokeWidth={5}/>
      </g>
      <path d={trench} fill="none" stroke={P.ink} strokeWidth={5}/>
      {/* leaks: a crack opens in the floor and drops keep falling into the earth below */}
      {drips.map((d, i) => {
        if (f < d.t) return null;
        const u = d.t <= ON ? 1 : prog(f, d.t, 8);
        return <g key={i}>
          <path d={`M ${d.x - 22 * u} ${G.FLOOR} l ${10 * u} ${12 * u} l ${12 * u} ${-6 * u} l ${14 * u} ${16 * u}`} fill="none" stroke={P.ink} strokeWidth={5} strokeLinejoin="round"/>
          {[0, 1, 2].map((q) => {
            const t = (f - d.t + q * 9) % 27, yy = G.FLOOR + 14 + t * 2.6;
            return f - d.t >= q * 9 ? <path key={q} d={`M ${d.x} ${yy - 12} C ${d.x + 9} ${yy}, ${d.x + 9} ${yy + 10}, ${d.x} ${yy + 10} C ${d.x - 9} ${yy + 10}, ${d.x - 9} ${yy}, ${d.x} ${yy - 12} Z`} fill={P.blue} stroke={P.ink} strokeWidth={2.5} opacity={1 - t / 27}/> : null;
          })}
        </g>;
      })}
      {/* the castle wall, standing on the island and going down to the moat floor */}
      <rect x={G.WALL_X0} y={G.WALL_TOP} width={G.WALL_X1 - G.WALL_X0} height={G.FLOOR - G.WALL_TOP} fill={P.white} stroke={P.ink} strokeWidth={5}/>
      {Array.from({length: 4}, (_, i) => <rect key={i} x={G.WALL_X0 - 8 + i * 84} y={G.WALL_TOP - 38} width={54} height={40} fill={P.white} stroke={P.ink} strokeWidth={5}/>)}
      <rect x={G.WALL_X0 - 10} y={G.WALL_TOP - 4} width={G.WALL_X1 - G.WALL_X0 + 20} height={22} fill={P.paper} stroke={P.ink} strokeWidth={5}/>
      {[[370, 380], [450, 430], [400, 520], [500, 610], [380, 690], [470, 770], [520, 360]].map((p, i) => <path key={i} d={`M ${p[0]} ${p[1]} h 40`} stroke={P.ink} strokeWidth={4} strokeLinecap="round" opacity={0.3}/>)}
      <path d="M 458 452 v -44 a 12 12 0 0 1 24 0 v 44 Z" fill={P.ink}/>
      <line x1={470} y1={G.WALL_TOP - 38} x2={470} y2={G.WALL_TOP - 150} stroke={P.ink} strokeWidth={7} strokeLinecap="round"/>
      <path d={`M 472 ${G.WALL_TOP - 150} C 520 ${G.WALL_TOP - 160 + 8 * flagW}, 540 ${G.WALL_TOP - 130 - 8 * flagW}, 580 ${G.WALL_TOP - 140 + 6 * flagW} L 580 ${G.WALL_TOP - 92 + 6 * flagW} C 540 ${G.WALL_TOP - 82 - 8 * flagW}, 520 ${G.WALL_TOP - 112 + 8 * flagW}, 472 ${G.WALL_TOP - 102} Z`} fill={P.red} stroke={P.ink} strokeWidth={5} strokeLinejoin="round"/>
      {/* the measuring stick painted on the wall: bands only, no numbers */}
      {Array.from({length: 12}, (_, i) => {
        const y0 = G.TOP + 8 + i * ((G.FLOOR - G.TOP - 8) / 12);
        return <rect key={i} x={G.STICK_X} y={y0} width={G.STICK_W} height={(G.FLOOR - G.TOP - 8) / 12} fill={i % 2 ? P.white : P.red} stroke={P.ink} strokeWidth={3}/>;
      })}
      {/* the water mark: a pointer that rides the level */}
      <path d={`M ${G.STICK_X - 4} ${wy} l -34 -20 v 40 Z`} fill={P.mustard} stroke={P.ink} strokeWidth={4} strokeLinejoin="round"/>
      {/* the rival on the far bank */}
      <g transform={`translate(${rx} ${G.TOP - 14 - 52 - rhop}) rotate(${-near * 8 + Math.sin(f / 9) * 2})`}><StoreIcon size={118} accent={P.gray}/></g>
      {/* one reading chip by the stick: it drops in on the first tick and rolls to each later value as it is spoken */}
      {ticks.length && f >= when(T, ticks[0].at) ? (() => {
        const ta = ticks.map((t) => when(T, t.at)), cur = ta.filter((t) => f >= t).length - 1;
        const u = ta[0] <= ON ? 1 : prog(f, ta[0], 16, Easing.out(Easing.bounce));
        const size = 50, texts = ticks.map((t) => String(t.text)), subs = ticks.map((t) => (t.sub ? String(t.sub) : ""));
        const w = Math.max(...texts.map((t) => tw(t, size))) + 60, hasSub = subs.some((x) => x), h = size * (hasSub ? 2.25 : 1.5);
        const x = G.WALL_X1 + 60 + w / 2, y = lerp(G.TOP - 200, G.TOP + 12 + h / 2, u);
        const roll = cur > 0 ? prog(f, ta[cur], 10, Easing.inOut(Easing.quad)) : 1;
        const cid2 = `wgt-${id}`;
        const face = (k: number, dy: number) => <g key={k} transform={`translate(0 ${dy})`}>
          {hasSub ? <text x={0} y={-h / 2 + size * 0.62} fontFamily={TYPE} fontSize={size * 0.45} textAnchor="middle" fill={P.ink}>{subs[k]}</text> : null}
          <Txt x={0} y={(hasSub ? size * 0.36 + size * 0.34 : size * 0.36)} text={texts[k]} size={size} color={k > 0 ? P.ink : P.ink}/>
        </g>;
        return <g transform={`translate(${x} ${y})`}>
          <defs><clipPath id={cid2}><rect x={-w / 2} y={-h / 2} width={w} height={h} rx={8}/></clipPath></defs>
          <line x1={G.STICK_X + G.STICK_W - x} y1={0} x2={-w / 2} y2={0} stroke={P.ink} strokeWidth={4} strokeDasharray="8 8" opacity={u}/>
          <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={8} fill={P.white} stroke={P.ink} strokeWidth={4} style={{filter: "url(#vshadow)"}}/>
          <g clipPath={`url(#${cid2})`}>
            {cur > 0 && roll < 1 ? face(cur - 1, -roll * h) : null}
            {face(Math.max(0, cur), cur > 0 ? (1 - roll) * h : 0)}
          </g>
        </g>;
      })() : null}
      {/* the flip calendar and its day counter */}
      {days && f >= dAt ? (() => {
        const u = dAt <= ON ? 1 : pop(f, fps, dAt, 12, 160), cx = 1700, cy = 360;
        const t = `${fmtIN(day)}`, size = fit(t, 92, 200, 0.5);
        const flipP = flipping ? (f % 4) / 4 : 0;
        return <g transform={`translate(${cx} ${cy}) scale(${0.6 + 0.4 * u})`}>
          <rect x={-120} y={-80} width={240} height={190} rx={10} fill={P.white} stroke={P.ink} strokeWidth={5} style={{filter: "url(#vshadow)"}}/>
          <rect x={-120} y={-80} width={240} height={50} rx={10} fill={P.red} stroke={P.ink} strokeWidth={5}/>
          <Txt x={0} y={-43} text="DAY" size={34} color={P.white}/>
          {[-70, 70].map((x) => <rect key={x} x={x - 7} y={-98} width={14} height={34} rx={6} fill={P.ink}/>)}
          <Txt x={0} y={70} text={t} size={size}/>
          {flipping ? <path d={`M -116 -30 H 116 L ${116 - 30 * flipP} ${-30 + 140 * (1 - flipP)} H ${-116 + 30 * flipP} Z`} fill={P.paper} stroke={P.ink} strokeWidth={3} opacity={0.85}/> : null}
        </g>;
      })() : null}
      <IStamps s={s} T={T} x={980} y={380}/>
    </IStage>
  );
};

export const SCENES_STORY: Record<string, React.FC<SP>> = {letter: Letter, copier: Copier, gauge: Gauge};
