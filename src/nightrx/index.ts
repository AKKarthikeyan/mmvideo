// Separate Remotion entry for The Night Pharmacist, so it never touches the shared Root.tsx.
// Render: npx remotion render src/nightrx/index.ts NRX-styletest out/nightrx/nightrx_styletest.mp4
import {registerRoot} from "remotion";
import {NightRoot} from "./NightRoot";
registerRoot(NightRoot);
