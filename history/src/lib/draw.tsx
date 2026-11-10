// Hand-drawing toolkit: paper grain, draw-on strokes, rough.js shapes, handwriting.
import React from "react";
import { interpolate, useCurrentFrame, Easing, random } from "remotion";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";

const gen = rough.generator();

/** 0→1 progress between two frames, eased like a pen stroke. */
export const useProgress = (start: number, duration: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.45, 0, 0.25, 1),
  });
};

/** Full-frame paper: base colour + fractal grain + soft vignette (the riso/print feel). */
export const Paper: React.FC<{ color: string; grain?: number; vignette?: number; seed?: number }> = ({
  color,
  grain = 0.22,
  vignette = 0.18,
  seed = 7,
}) => (
  <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
    <defs>
      <filter id={`grain-${seed}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} seed={seed} />
        <feColorMatrix values="0 0 0 0 0.2  0 0 0 0 0.15  0 0 0 0 0.1  0 0 0 1.2 -0.35" />
      </filter>
      <radialGradient id={`vig-${seed}`} cx="50%" cy="50%" r="75%">
        <stop offset="60%" stopColor="#000" stopOpacity={0} />
        <stop offset="100%" stopColor="#3a2a10" stopOpacity={vignette} />
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill={color} />
    <rect width="100%" height="100%" filter={`url(#grain-${seed})`} opacity={grain} />
    <rect width="100%" height="100%" fill={`url(#vig-${seed})`} />
  </svg>
);

/** Any SVG path that draws itself on. Uses pathLength=1 so no measuring is needed. */
export const DrawPath: React.FC<
  { d: string; start: number; duration: number; stroke: string; width?: number; fill?: string; fillDelay?: number } & Omit<
    React.SVGProps<SVGPathElement>,
    "d" | "stroke" | "fill"
  >
> = ({ d, start, duration, stroke, width = 3, fill = "none", fillDelay = 0, ...rest }) => {
  const p = useProgress(start, duration);
  const f = useProgress(start + duration + fillDelay, Math.max(8, duration * 0.6));
  return (
    <>
      {fill !== "none" && <path d={d} fill={fill} opacity={f} stroke="none" />}
      <path
        d={d}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
        stroke={stroke}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={p > 0 ? 1 : 0}
        {...rest}
      />
    </>
  );
};

type RoughShape =
  | { kind: "rect"; x: number; y: number; w: number; h: number }
  | { kind: "ellipse"; x: number; y: number; w: number; h: number }
  | { kind: "line"; x1: number; y1: number; x2: number; y2: number }
  | { kind: "path"; d: string }
  | { kind: "polygon"; points: [number, number][] };

/** rough.js shape (seeded, so every frame is identical) rendered as draw-on paths. */
export const Rough: React.FC<{
  shape: RoughShape;
  start: number;
  duration: number;
  options?: Options;
}> = ({ shape, start, duration, options = {} }) => {
  const opts: Options = { seed: 3, roughness: 1.4, bowing: 1.2, stroke: "#1B2440", strokeWidth: 2.6, ...options };
  const drawable = React.useMemo(() => {
    switch (shape.kind) {
      case "rect":
        return gen.rectangle(shape.x, shape.y, shape.w, shape.h, opts);
      case "ellipse":
        return gen.ellipse(shape.x, shape.y, shape.w, shape.h, opts);
      case "line":
        return gen.line(shape.x1, shape.y1, shape.x2, shape.y2, opts);
      case "polygon":
        return gen.polygon(shape.points, opts);
      default:
        return gen.path(shape.d, opts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(shape), JSON.stringify(opts)]);
  const paths = gen.toPaths(drawable);
  // Fill hachures first, outline last, split over the duration.
  return (
    <g>
      {paths.map((p, i) => (
        <DrawPath
          key={i}
          d={p.d}
          stroke={p.stroke === "none" ? (p.fill ?? opts.stroke!) : p.stroke}
          width={p.strokeWidth}
          start={start + (i * duration) / (paths.length + 1)}
          duration={duration / Math.max(1, paths.length) + 6}
        />
      ))}
    </g>
  );
};

/** Hand-drawn arrow: a slightly bowed line plus an arrowhead. */
export const RoughArrow: React.FC<{
  from: [number, number];
  to: [number, number];
  start: number;
  duration?: number;
  color?: string;
  seed?: number;
}> = ({ from, to, start, duration = 14, color = "#1B2440", seed = 11 }) => {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h = 18;
  const head = `M ${x2 - h * Math.cos(a - 0.45)} ${y2 - h * Math.sin(a - 0.45)} L ${x2} ${y2} L ${
    x2 - h * Math.cos(a + 0.45)
  } ${y2 - h * Math.sin(a + 0.45)}`;
  return (
    <>
      <Rough shape={{ kind: "line", x1, y1, x2, y2 }} start={start} duration={duration} options={{ stroke: color, seed }} />
      <DrawPath d={head} start={start + duration} duration={6} stroke={color} width={2.6} />
    </>
  );
};

/** Handwriting: characters appear one by one with a tiny wobble (seeded). */
export const HandText: React.FC<{
  text: string;
  start: number;
  cps?: number; // characters per second
  style?: React.CSSProperties;
  fps?: number;
}> = ({ text, start, cps = 22, style, fps = 30 }) => {
  const frame = useCurrentFrame();
  const shown = Math.max(0, Math.floor(((frame - start) / fps) * cps));
  return (
    <span style={{ whiteSpace: "pre-wrap", ...style }}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          style={{
            opacity: i < shown ? 1 : 0,
            display: "inline-block",
            transform: `translateY(${(random(`y${i}${text}`) - 0.5) * 2}px) rotate(${(random(`r${i}${text}`) - 0.5) * 3}deg)`,
          }}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
};

/** Seeded stipple dots inside a rectangle — for shading like a print illustration. */
export const Stipple: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  count: number;
  color: string;
  seed: string;
  r?: number;
  opacity?: number;
}> = ({ x, y, w, h, count, color, seed, r = 1.4, opacity = 0.55 }) => (
  <g fill={color} opacity={opacity}>
    {Array.from({ length: count }, (_, i) => (
      <circle
        key={i}
        cx={x + random(`${seed}x${i}`) * w}
        cy={y + random(`${seed}y${i}`) * h}
        r={r * (0.5 + random(`${seed}r${i}`))}
      />
    ))}
  </g>
);
