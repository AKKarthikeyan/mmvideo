// Data Kadai brand for the looks: maroon #7A2340, amber #C9822F, cream #F7F4EE, ink #1F1A17 and the tea-glass Mark
// (src/datayt/Brand.tsx, the channel's own logo, drawn in code). Tokens: datakadai.tokens.json.
import React from "react";
import {Mark as TeaGlass} from "../../datayt/Brand";
import tokens from "./datakadai.tokens.json";
import type {Brand, BrandTokens, MarkProps, WordmarkProps} from "./types";

const T = tokens as unknown as BrandTokens;
const fam = (role: keyof BrandTokens["fonts"]) => `'${T.faces[T.fonts[role].face].family}', ${T.fonts[role].fallback}`;

// On paper: amber glass and bars, maroon tallest bar and steam (the logo). On dark grounds: the reversed logo of the brand
// sheet (light amber glass, cream steam).
const Mark: React.FC<MarkProps> = ({size, on = "light"}) => on === "dark"
  ? <TeaGlass size={size} c={T.derived.accent2Light} h={T.palette.paper}/>
  : <TeaGlass size={size} c={T.palette.accent2} h={T.palette.accent}/>;

const Wordmark: React.FC<WordmarkProps> = ({size, on = "light"}) => (
  <div style={{fontFamily: fam("wordmark"), fontWeight: T.fonts.wordmark.weight, fontSize: size, lineHeight: 1, letterSpacing: size * 0.02, whiteSpace: "nowrap",
    color: on === "dark" ? T.palette.paper : T.palette.ink}}>
    {T.wordmark.parts[0]} <span style={{color: on === "dark" ? T.derived.accent2Light : T.palette.accent}}>{T.wordmark.parts[1]}</span>
  </div>
);

export const DATAKADAI: Brand = {...T, Mark, Wordmark};
