// Separate entry for the brand stills (logo, banner), so a half-built episode can't break their bundle.
import {registerRoot} from "remotion";
import {BrandRoot} from "./brand";
registerRoot(BrandRoot);
