// Local font files (npm @fontsource, licences in LICENSES.md). Imported once; every composition calls useVoxFonts()
// so the first frame waits until the faces are ready (no fallback-font frames in a render).
import "@fontsource/dm-serif-display/latin-400.css";
import "@fontsource/dm-serif-display/latin-ext-400.css";
import "@fontsource/dm-serif-display/latin-400-italic.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-800.css";
import "@fontsource/inter/latin-900.css";
import "@fontsource/inter/latin-ext-800.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import "@fontsource/permanent-marker/latin-400.css";
import {useEffect, useState} from "react";
import {continueRender, delayRender} from "remotion";

const FACES = [
  "400 64px 'DM Serif Display'", "italic 400 64px 'DM Serif Display'", "400 32px 'Inter'", "600 32px 'Inter'",
  "800 32px 'Inter'", "900 32px 'Inter'", "500 24px 'IBM Plex Mono'", "400 40px 'Permanent Marker'",
];
let loaded: Promise<unknown> | null = null;

export const useVoxFonts = () => {
  const [handle] = useState(() => delayRender("voxplus fonts"));
  useEffect(() => {
    if (!loaded) loaded = Promise.all(FACES.map((f) => document.fonts.load(f, "AaQ$₹0123")));
    loaded.then(() => continueRender(handle)).catch(() => continueRender(handle));
  }, [handle]);
};
