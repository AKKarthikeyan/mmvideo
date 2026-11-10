// One locked palette + font pair + signature device per brand.
// Change values here; every scene reads from this file.
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadPlexMono } from "@remotion/google-fonts/IBMPlexMono";
import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadCormorant } from "@remotion/google-fonts/CormorantGaramond";
import { loadFont as loadTiro } from "@remotion/google-fonts/TiroDevanagariSanskrit";

export const fonts = {
  hand: loadCaveat().fontFamily,
  sans: loadInter().fontFamily,
  mono: loadPlexMono().fontFamily,
  serif: loadFraunces().fontFamily,
  classic: loadCormorant().fontFamily,
  sanskrit: loadTiro().fontFamily,
};

export const brands = {
  // Signature: the answer frame (Intro → Body → Way Forward), redrawable by hand.
  upsc: {
    paper: "#FBF8F1",
    rule: "#D9E3F0",
    ink: "#1B2440",
    red: "#C8312B",
    pencil: "#6B7280",
    heading: fonts.sans,
    body: fonts.hand,
  },
  // Signature: one-idea margin chart with the takeaway as the title.
  moatMargin: {
    bg: "#16181B",
    panel: "#1F2226",
    grid: "#2E3238",
    text: "#ECE9E2",
    muted: "#8C9096",
    margin: "#3FB27F",
    revenue: "#C9CCD1",
    warn: "#E0A33A",
    heading: fonts.serif,
    body: fonts.sans,
    numbers: fonts.mono,
  },
  // Signature: flow map (money / goods moving between nodes).
  moatAtlas: {
    sea: "#E9E5DC",
    land: "#D3CEC2",
    border: "#BDB7A9",
    ink: "#2B2B2B",
    flow: ["#D2492A", "#1F6FB2", "#2E9C6A", "#8A4FBF"],
    heading: fonts.sans,
    label: fonts.mono,
  },
  // Signature: animated empire map on parchment + sketched monuments.
  indica: {
    parchment: "#F1E6CF",
    parchmentDark: "#E3D3B1",
    ink: "#3A2A1E",
    indigo: "#2D3A6B",
    terracotta: "#B5552F",
    ochre: "#C99A3B",
    river: "#5C7FA6",
    heading: fonts.classic,
    label: fonts.classic,
  },
  // Signature: the chariot motif (5 horses = senses, reins = mind, charioteer = intellect).
  chariot: {
    night: "#0B1230",
    deepBlue: "#16245A",
    gold: "#E8B04A",
    saffron: "#E9772E",
    cream: "#F6EBD3",
    heading: fonts.classic,
    verse: fonts.sanskrit,
  },
} as const;

export const FPS = 30;
export const W = 1920;
export const H = 1080;
