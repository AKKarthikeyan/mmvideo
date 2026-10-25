// Entry point for Result Engine videos only (render with: npx remotion render src/results/index.ts RESULT-short ...).
// Kept apart from src/index.ts so a result render bundles the Vox engine alone, and so adding results never
// touches the shared Root.tsx registry.
import {registerRoot} from "remotion";
import {ResultRoot} from "./ResultVideos";

registerRoot(ResultRoot);
