// Indica Atlas — "Chronicle" format.
// Beat grid drives everything: each chapter = 16 beats, tempo rises with the centuries,
// every cut and reveal lands on a beat. Styles alternate (ink on paper / gold on black),
// each chapter has its own colour + border motif, a line drawing and one big keyword.
// HUD: vermilion chapter seal (top-left), vertical dynasty name (right), scroll timeline + year (bottom).
// Transitions: a seal stamps down with a screen shake, timed to the drum + bell in the score.
import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, random, Easing } from "remotion";
import { fonts } from "../../brand/tokens";
import { layoutFor, type Layout } from "./layout";
import { Paper, DrawPath } from "../../lib/draw";
import { buildSchedule, chronicle, fmtYear, type Scheduled } from "./schedule";
import { drawings } from "./drawings";
import { MotifBand } from "./motifs";

const VERMILION = "#B8322A";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const look = (style: string) =>
  style === "gold"
    ? { bg: "#15110C", ink: "#D4AF5A", text: "#F1E4C8", grain: 0.5 }
    : { bg: "#F3EAD6", ink: "#2A1E14", text: "#2A1E14", grain: 0.3 };

export type ChronicleProps = { withScore: boolean };
export const chronicleDefaults: ChronicleProps = { withScore: true };
export const chronicleDuration = (fps: number) => buildSchedule(fps).totalFrames;

export const IndicaChronicle: React.FC<ChronicleProps> = ({ withScore }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const lay = layoutFor(width, height);
  const { chapters } = useMemo(() => buildSchedule(fps), [fps]);
  const cur = [...chapters].reverse().find((c) => frame >= c.start) ?? chapters[0];
  const lf = frame - cur.start;

  // seal-stamp impact: shake + flash in the first frames of every chapter
  const impact = lf - 4; // stamp lands 4 frames after the cut
  const shake = impact >= 0 && impact < 9 ? 16 * (1 - impact / 9) : 0;
  const sx = (random(`sx${cur.index}${impact}`) - 0.5) * 2 * shake;
  const sy = (random(`sy${cur.index}${impact}`) - 0.5) * 2 * shake;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {withScore && <Audio src={staticFile("chronicle-score.wav")} />}
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id="inkbleed">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves={2} seed={5} />
          <feDisplacementMap in="SourceGraphic" scale="5" />
        </filter>
        <filter id="sealedge">
          <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves={2} seed={8} />
          <feDisplacementMap in="SourceGraphic" scale="7" />
        </filter>
      </svg>

      <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px)` }}>
        {chapters.map((c, i) => (
          <Sequence key={c.index} from={c.start} durationInFrames={i === chapters.length - 1 ? durationInFrames - c.start : c.frames}>
            <ChapterScene ch={c} lay={lay} />
          </Sequence>
        ))}
        <ScrollTimeline chapters={chapters} cur={cur} lf={lf} lay={lay} />
      </AbsoluteFill>

      <div style={{ position: "absolute", left: lay.timeline.x - 40, top: lay.timeline.y + 96, fontFamily: fonts.classic, fontSize: 20, letterSpacing: 1, color: cur.style === "gold" ? "#BFA98A" : "#6B5A48" }}>
        {chronicle.sourceNote}
      </div>
      <StampTransition ch={cur} lf={lf} lay={lay} />
      {/* impact flash */}
      <AbsoluteFill style={{ background: "#FFF6E0", opacity: impact >= 0 ? interpolate(impact, [0, 6], [0.35, 0], clamp) : 0 }} />
      <Outro size={lay.titleSize} start={chapters[chapters.length - 1].start + chapters[chapters.length - 1].frames} />
    </AbsoluteFill>
  );
};

const ChapterScene: React.FC<{ ch: Scheduled; lay: Layout }> = ({ ch, lay }) => {
  const frame = useCurrentFrame(); // local to the Sequence
  const { width, height } = useVideoConfig();
  const beatAt = frame / ch.beat;
  const L = look(ch.style);
  const prog = (b0: number, b1: number) => interpolate(beatAt, [b0, b1], [0, 1], clamp);
  const strokes = useMemo(() => drawings[ch.drawing](), [ch.drawing]);
  const words = ch.caption.split(" ");
  const pulse = (() => {
    const intoBar = beatAt % 4;
    return beatAt >= 1 ? interpolate(intoBar, [0, 0.35], [1.07, 1], clamp) : 1;
  })();

  return (
    <AbsoluteFill style={{ color: L.text }}>
      <Paper color={L.bg} grain={L.grain} vignette={ch.style === "gold" ? 0.5 : 0.22} seed={ch.index + 2} />

      <svg width={width} height={height} style={{ position: "absolute" }}>
        <MotifBand id={`t${ch.index}`} motif={ch.motif} color={ch.color} x={lay.topBand.x} y={lay.topBand.y} width={lay.topBand.w} progress={prog(1, 3)} />
        <MotifBand id={`b${ch.index}`} motif={ch.motif} color={ch.color} x={lay.bottomBand.x} y={lay.bottomBand.y} width={lay.bottomBand.w} progress={prog(1.5, 3.5)} />
        {/* line drawing, strokes spread over beats 1 → 10 */}
        <g transform={`translate(${lay.drawing.x} ${lay.drawing.y}) scale(${lay.drawing.scale})`} filter="url(#inkbleed)">
          {strokes.map((s, i) => {
            const b = 1 + (i / strokes.length) * 9;
            return <DrawPath key={i} d={s.d} start={b * ch.beat} duration={Math.max(6, ch.beat * 0.9)} stroke={L.ink} width={(s.w ?? 1.6) * 1.4} />;
          })}
        </g>
      </svg>

      {/* chapter seal, pulses on every downbeat */}
      <div style={{ position: "absolute", left: lay.seal.x, top: lay.seal.y, transform: `scale(${pulse})`, transformOrigin: "center" }}>
        <Seal numeral={ch.numeral} size={lay.seal.size} />
      </div>

      {/* keyword: stamps in on beat 2 */}
      <div style={{ position: "absolute", left: lay.text.x, top: lay.text.y, width: lay.text.w }}>
        <div
          style={{
            fontFamily: fonts.sanskrit,
            fontSize: lay.text.keyword,
            lineHeight: 1.15,
            color: ch.style === "gold" ? L.ink : ch.color,
            filter: "url(#inkbleed)",
            opacity: prog(2, 2.15),
            transform: `scale(${interpolate(beatAt, [2, 2.3], [1.35, 1], clamp)})`,
            transformOrigin: "left center",
          }}
        >
          {ch.keyword}
        </div>
        {/* caption: one word per beat from beat 4 */}
        <div style={{ fontFamily: fonts.classic, fontStyle: "italic", fontSize: lay.text.caption, lineHeight: 1.15, marginTop: 10 }}>
          {words.map((w, k) => (
            <span key={k} style={{ display: "inline-block", marginRight: 18, opacity: prog(4 + k, 4.3 + k), transform: `translateY(${(1 - prog(4 + k, 4.3 + k)) * 18}px)` }}>
              {w}
            </span>
          ))}
        </div>
        <div style={{ fontFamily: fonts.classic, fontSize: lay.text.era, letterSpacing: 3, marginTop: 22, color: ch.color, opacity: prog(4 + words.length, 4.5 + words.length) }}>
          {ch.era}
        </div>
      </div>

      {/* vertical dynasty name, right edge */}
      <div
        style={{
          position: "absolute",
          right: lay.name.right,
          top: lay.name.top,
          height: lay.name.height,
          display: "flex",
          alignItems: "center",
          gap: 22,
          writingMode: "vertical-rl",
          opacity: prog(1, 1.5),
          transform: `translateY(${(1 - prog(1, 1.5)) * -40}px)`,
        }}
      >
        <div style={{ fontFamily: fonts.classic, fontWeight: 700, fontSize: lay.name.size, letterSpacing: lay.name.spacing, textTransform: "uppercase", textOrientation: "upright", color: L.text }}>
          {ch.dynasty}
        </div>
        <div style={{ width: 2, height: 140, background: ch.color }} />
      </div>
    </AbsoluteFill>
  );
};

const Seal: React.FC<{ numeral: string; size: number }> = ({ numeral, size }) => (
  <svg width={size} height={size} viewBox="0 0 140 140" style={{ overflow: "visible" }}>
    <g filter="url(#sealedge)">
      <rect x={4} y={4} width={132} height={132} rx={14} fill={VERMILION} />
      <rect x={14} y={14} width={112} height={112} rx={8} fill="none" stroke="#F6E7D0" strokeWidth={3} />
    </g>
    <text x={70} y={86} textAnchor="middle" fontFamily={fonts.sanskrit} fontSize={64} fill="#F6E7D0">
      {numeral}
    </text>
    <text x={70} y={114} textAnchor="middle" fontFamily={fonts.sanskrit} fontSize={18} fill="#F6E7D0">
      अध्याय
    </text>
  </svg>
);

const StampTransition: React.FC<{ ch: Scheduled; lf: number; lay: Layout }> = ({ ch, lf, lay }) => {
  const { width, height } = useVideoConfig();
  const end = ch.beat * 1.3;
  if (lf > end) return null;
  const scale = interpolate(lf, [0, 4], [2.8, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const opacity = interpolate(lf, [0, 1, ch.beat * 0.75, end], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
      <svg width={width} height={height} style={{ position: "absolute" }}>
        {lf >= 4 &&
          Array.from({ length: 28 }, (_, i) => {
            const a = random(`sa${ch.index}${i}`) * Math.PI * 2;
            const r = 210 + random(`sr${ch.index}${i}`) * 140;
            return <circle key={i} cx={width / 2 + Math.cos(a) * r} cy={height / 2 + Math.sin(a) * r} r={2 + random(`sz${ch.index}${i}`) * 9} fill={VERMILION} />;
          })}
      </svg>
      <div style={{ transform: `scale(${scale}) rotate(${-4 + ch.index * 2}deg)` }}>
        <Seal numeral={ch.numeral} size={lay.stampSize} />
      </div>
    </AbsoluteFill>
  );
};

const T0 = chronicle.timeline.from;
const T1 = chronicle.timeline.to;

const ScrollTimeline: React.FC<{ chapters: Scheduled[]; cur: Scheduled; lf: number; lay: Layout }> = ({ chapters, cur, lf, lay }) => {
  const { width, height } = useVideoConfig();
  const { x: SX, w: SW, y: ty } = lay.timeline;
  const yearX = (y: number) => SX + 60 + ((y - T0) / (T1 - T0)) * (SW - 120);
  const beatAt = lf / cur.beat;
  const prev = chapters[cur.index - 1];
  const year =
    beatAt < 1 && prev
      ? interpolate(beatAt, [0, 1], [prev.to, cur.from], { ...clamp, easing: Easing.inOut(Easing.cubic) })
      : interpolate(beatAt, [1, 15], [cur.from, cur.to], clamp);
  const mx = yearX(year);
  const ticks = [];
  for (let y = T0; y <= T1; y += 250) ticks.push(y);
  return (
    <svg width={width} height={height} style={{ position: "absolute" }}>
      {/* paper strip + rollers */}
      <rect x={SX - 40} y={ty} width={SW + 80} height={72} fill="#E6D5AE" stroke="#6B4423" strokeWidth={1.5} />
      {[SX - 62, SX + SW + 40].map((x) => (
        <g key={x}>
          <rect x={x} y={ty - 18} width={22} height={108} rx={9} fill="#6B4423" />
          <rect x={x + 5} y={ty - 26} width={12} height={124} rx={5} fill="#8A5A30" />
        </g>
      ))}
      {ticks.map((y) => {
        const major = y % 1000 === 0;
        return (
          <g key={y}>
            <line x1={yearX(y)} x2={yearX(y)} y1={ty + 8} y2={ty + (major ? 32 : 20)} stroke="#3A2A1E" strokeWidth={major ? 2 : 1} />
            {major && (
              <text x={yearX(y)} y={ty + 60} textAnchor="middle" fontFamily={fonts.classic} fontSize={22} fill="#3A2A1E">
                {y === 0 ? "1 CE" : fmtYear(y)}
              </text>
            )}
          </g>
        );
      })}
      {/* chapters visited so far */}
      {chapters
        .filter((c) => c.index <= cur.index)
        .map((c) => (
          <rect key={c.index} x={yearX(c.from)} y={ty + 36} width={Math.max(6, yearX(c.to) - yearX(c.from))} height={8} fill={c.style === "gold" ? "#9C7A2E" : c.color} />
        ))}
      {/* marker + year counter */}
      <line x1={mx} x2={mx} y1={ty - 8} y2={ty + 72} stroke={VERMILION} strokeWidth={3} />
      <path d={`M${mx - 9},${ty - 14} L${mx + 9},${ty - 14} L${mx},${ty - 2} Z`} fill={VERMILION} />
      <rect x={mx - 82} y={ty - 54} width={164} height={36} rx={6} fill={VERMILION} />
      <text x={mx} y={ty - 28} textAnchor="middle" fontFamily={fonts.classic} fontWeight={700} fontSize={26} fill="#F6E7D0">
        {fmtYear(year)}
      </text>
    </svg>
  );
};

const Outro: React.FC<{ start: number; size: number }> = ({ start, size }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [start, start + 20], [0, 1], clamp);
  if (o <= 0) return null;
  return (
    <AbsoluteFill style={{ background: `rgba(21,17,12,${0.85 * o})`, alignItems: "center", justifyContent: "center", color: "#D4AF5A", opacity: o }}>
      <div style={{ fontFamily: fonts.classic, fontSize: 30, letterSpacing: 10, textTransform: "uppercase" }}>Indica Atlas</div>
      <div style={{ fontFamily: fonts.classic, fontSize: size, fontWeight: 600, marginTop: 10, textAlign: "center" }}>{chronicle.title}</div>
    </AbsoluteFill>
  );
};
