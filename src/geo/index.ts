// Separate Remotion entry for GeoTales, so it never touches the shared Root.tsx / Videos.tsx.
// Render: npx remotion render src/geo/index.ts GEO-siliguri out/geo/siliguri_short.mp4
import {registerRoot} from "remotion";
import {GeoRoot} from "./GeoRoot";
registerRoot(GeoRoot);
