// Jio film, chapter 4 (beats q40, q41, q42, q43, q44, q45). PLACEHOLDER: replace each beat's shot(s) with real VoxPlus shots.
import React from "react";
import {Shot, SP, Words} from "../A01V4Parts";
import {SCue} from "../A01V4Cold";
import {useTicks} from "../tokens";
import {H0, S} from "./kit";

const ph = (k: string): React.FC<SP> => ({d}) => <Words f={useTicks()} d={d} text={k.toUpperCase()} chip="placeholder"/>;
export const SHOTS4: Shot[] = ['q40', 'q41', 'q42', 'q43', 'q44', 'q45'].map((k) => S(k, 0, H0, ph(k)));
export const CUES4: SCue[] = [];
