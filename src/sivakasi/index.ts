// Separate Remotion entry for the Sivakasi films (so it never touches the shared Root.tsx).
// Render: npx remotion render src/sivakasi/index.ts SV-paradox out/sivakasi/paradox.mp4
import {registerRoot} from "remotion";
import {SvRoot} from "./SvRoot";
registerRoot(SvRoot);
