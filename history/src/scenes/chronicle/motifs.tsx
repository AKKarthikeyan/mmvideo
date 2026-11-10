// Border bands whose pattern evolves with the era:
// intersecting circles → lotus petals → creeper vine → temple steps → jaali stars.
import React from "react";

const tiles: Record<string, { w: number; el: (c: string) => React.ReactNode }> = {
  circles: {
    w: 28,
    el: (c) => (
      <g fill="none" stroke={c} strokeWidth={1.6}>
        <circle cx={14} cy={20} r={14} />
        <circle cx={0} cy={20} r={14} />
      </g>
    ),
  },
  lotus: {
    w: 40,
    el: (c) => (
      <g fill="none" stroke={c} strokeWidth={1.6}>
        <path d="M2,36 Q12,4 20,4 Q28,4 38,36" />
        <path d="M10,36 Q20,16 30,36" />
        <circle cx={20} cy={38} r={2} fill={c} />
      </g>
    ),
  },
  vine: {
    w: 80,
    el: (c) => (
      <g fill="none" stroke={c} strokeWidth={1.6}>
        <path d="M0,20 C20,2 40,38 60,20 S80,20 80,20" />
        <path d="M20,13 C18,4 30,2 30,10 C30,15 24,15 24,11" />
        <path d="M60,27 C62,36 50,38 50,30 C50,25 56,25 56,29" />
      </g>
    ),
  },
  steps: {
    w: 60,
    el: (c) => (
      <path d="M0,36 L0,28 L8,28 L8,20 L16,20 L16,12 L24,12 L24,4 L36,4 L36,12 L44,12 L44,20 L52,20 L52,28 L60,28 L60,36" fill="none" stroke={c} strokeWidth={1.6} />
    ),
  },
  jaali: {
    w: 40,
    el: (c) => (
      <g fill="none" stroke={c} strokeWidth={1.4}>
        <rect x={9} y={9} width={22} height={22} />
        <rect x={9} y={9} width={22} height={22} transform="rotate(45 20 20)" />
        <circle cx={20} cy={20} r={4} />
      </g>
    ),
  },
};

/** A motif band revealed left→right by `progress` (0..1). */
export const MotifBand: React.FC<{ motif: string; color: string; x: number; y: number; width: number; progress: number; id: string }> = ({
  motif,
  color,
  x,
  y,
  width,
  progress,
  id,
}) => {
  const t = tiles[motif] ?? tiles.circles;
  return (
    <g>
      <defs>
        <pattern id={`m-${id}`} width={t.w} height={40} patternUnits="userSpaceOnUse" x={x} y={y}>
          {t.el(color)}
        </pattern>
        <clipPath id={`mc-${id}`}>
          <rect x={x} y={y - 2} width={width * progress} height={44} />
        </clipPath>
      </defs>
      <g clipPath={`url(#mc-${id})`}>
        <line x1={x} x2={x + width} y1={y - 6} y2={y - 6} stroke={color} strokeWidth={1.2} />
        <rect x={x} y={y} width={width} height={40} fill={`url(#m-${id})`} />
        <line x1={x} x2={x + width} y1={y + 46} y2={y + 46} stroke={color} strokeWidth={1.2} />
      </g>
    </g>
  );
};
