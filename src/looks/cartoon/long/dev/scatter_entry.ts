import {registerRoot} from "remotion";
import figures from "../../../../../public/datayt/long/babies/figures.json";
import {makeRoot} from "./devRoot";
import {Scene} from "../scenes/scatter";

// TEST SHIM ONLY (this dev entry is never part of the video): until the verifier adds `stats` to figures.json, add the correlations computed
// from the same file so the badge can be rendered through fig(). Once figures.json has a `stats` table this does nothing.
const F = figures as any;
if (!F.stats) {
  const st = Object.keys(F.tfr).filter((s) => s !== "India" && typeof F.tfr[s]?.nfhs6 === "number");
  const r = (k: string) => {
    const x = st.map((s) => F[k][s].nfhs6), y = st.map((s) => F.tfr[s].nfhs6), n = x.length, mx = x.reduce((a: number, b: number) => a + b) / n, my = y.reduce((a: number, b: number) => a + b) / n;
    let sxy = 0, sxx = 0, syy = 0;
    for (let i = 0; i < n; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) ** 2; syy += (y[i] - my) ** 2; }
    return Math.round((sxy / Math.sqrt(sxx * syy)) * 100) / 100;
  };
  F.stats = {corr_school_tfr6: r("school10"), corr_marriage_tfr6: r("marriage18"), corr_school_tfr5: -0.5, corr_marriage_tfr5: 0.45};      // the two NFHS-5 values are the script's, test only
}
registerRoot(makeRoot(Scene));
