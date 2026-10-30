// figures.json (public/datayt/long/babies/figures.json) read through fig(): the only way a scene gets a number.
// Every figure a viewer sees is printed from here, never typed in a component.
import figures from "../../../../public/datayt/long/babies/figures.json";
import nkFigures from "../../../../public/datayt/long/namakkal/figures.json";
import type {FigRef} from "./contract";

export type Fig = {value: number; text: string};
// Each film's tables sit side by side (Namakkal's are prefixed nk_); "meta" is merged key by key.
const B = figures as unknown as Record<string, any>, N = nkFigures as unknown as Record<string, any>;
const T: Record<string, any> = {...B, ...N, meta: {...(B.meta ?? {}), ...(N.meta ?? {})}};

export const fig = (r: FigRef, decimals = 1): Fig => {
  const row = T[r.t]?.[r.state];
  const v = r.s ? row?.[r.s] : row;
  if (typeof v !== "number") throw new Error(`figure missing: ${JSON.stringify(r)}`);
  return {value: v, text: v.toFixed(decimals)};
};
export const hasFig = (r: FigRef) => {
  const row = T[r.t]?.[r.state];
  return typeof (r.s ? row?.[r.s] : row) === "number";
};
export const stateNames = (t: string): string[] => Object.keys(T[t] ?? {}).filter((s) => s !== "India");
export const meta = (path: string): any => path.split(".").reduce((o: any, k) => o?.[k], T);
