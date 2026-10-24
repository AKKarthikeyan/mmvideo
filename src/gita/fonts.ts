// Local font files (npm @fontsource) plus the macOS Devanagari faces. The first frame waits until they are ready.
import "@fontsource/dm-serif-display/latin-400.css";
import "@fontsource/dm-serif-display/latin-ext-400.css";
import "@fontsource/dm-serif-display/latin-400-italic.css";
import "@fontsource/dm-serif-display/latin-ext-400-italic.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-ext-400.css";
import "@fontsource/inter/latin-400-italic.css";
import "@fontsource/inter/latin-ext-400-italic.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-ext-600.css";
import "@fontsource/inter/latin-800.css";
import "@fontsource/inter/latin-ext-800.css";
import {useEffect, useState} from "react";
import {continueRender, delayRender} from "remotion";

export const SERIF = "'DM Serif Display', Georgia, serif";
export const SANS = "Inter, Helvetica, sans-serif";
export const DEVA = "'Shobhika', 'Kohinoor Devanagari', 'Devanagari Sangam MN', serif";

const FACES = [
  "400 64px 'DM Serif Display'", "italic 400 64px 'DM Serif Display'", "400 32px 'Inter'", "italic 400 32px 'Inter'",
  "600 32px 'Inter'", "800 32px 'Inter'",
];
let loaded: Promise<unknown> | null = null;

export const useGitaFonts = () => {
  const [handle] = useState(() => delayRender("gita fonts"));
  useEffect(() => {
    if (!loaded) loaded = Promise.all(FACES.map((f) => document.fonts.load(f, "Aaāṛṣḥṃś")));
    loaded.then(() => continueRender(handle)).catch(() => continueRender(handle));
  }, [handle]);
};
