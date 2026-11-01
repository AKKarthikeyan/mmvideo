import type React from "react";
import * as s1 from "./scenes1";
import * as s2 from "./scenes2";
import * as s3 from "./scenes3";
import * as s4 from "./scenes4";
import * as s5 from "./scenes5";
export const SCENES: Record<string, React.FC<any>> = {
  FireSky: s1.FireSky, RainShadow: s1.RainShadow, Globe: s1.Globe, EmptyTown: s1.EmptyTown, Rewind: s1.Rewind, QuietSheds: s1.QuietSheds,
  RouteMap: s2.RouteMap, Blockade: s2.Blockade, Platform: s2.Platform, Workshop: s2.Workshop, Machines: s2.Machines, Hands: s2.Hands, Charkha: s2.Charkha, RivalLabels: s2.RivalLabels,
  BengalLight: s3.BengalLight, Chain: s3.Chain, Dominoes: s3.Dominoes, SunDrying: s3.SunDrying, PressYear: s3.PressYear, Licence: s3.Licence, Bars: s3.Bars, Money: s3.Money,
  Haze: s4.Haze, CourtGavel: s4.CourtGavel, GreenBurst: s4.GreenBurst, DeepavaliCal: s4.DeepavaliCal, Gate: s4.Gate, FloorPlan: s4.FloorPlan, Memorial: s4.Memorial, Attend: s4.Attend, ThreeFactories: s4.ThreeFactories, Ember: s4.Ember,
};
// polish pass: richer versions replace the originals
Object.assign(SCENES, {Chain: s5.Chain, Dominoes: s5.Dominoes, RainShadow: s5.RainShadow, Hands: s5.Hands, RouteMap: s5.RouteMap, BengalLight: s5.BengalLight});
