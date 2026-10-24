// Separate Remotion entry for the Gita channel, so it never touches the shared Root.tsx / Videos.tsx.
// Render: npx remotion render src/gita/index.ts GITA-styletest out/gita/gita_styletest.mp4
import {registerRoot} from "remotion";
import {GitaRoot} from "./GitaRoot";
registerRoot(GitaRoot);
