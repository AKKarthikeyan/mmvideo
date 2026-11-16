# Vendored: line-art-animation (MIT)

Source: https://github.com/JDhruv14/line-art-animation at commit `c43d698913cf0ad44f984c7ae14c5348010594d3` (10 Nov 2026),
fetched 16 Nov 2026 from GitHub. `ink.ts`, `gait.ts`, `daynight.ts` and `motion.ts` are unmodified (byte-identical to the
copy the Sundara Kandam pilot used on the Mini). `style.md` and `motion.md` are the upstream style and motion references.
Licence: `LICENSE` (MIT, Copyright (c) 2026 JDhruv14).

Why: AK chose to mix two looks (16 Nov 2026): Lamplight for the source text's world, line art on warm paper for the
retelling you know and the present day (INNER_CHARIOT_NORTH_STAR.md, section 5). `gait.ts`, `daynight.ts` and `motion.ts`
are pure and usable from Remotion as they are; `ink.ts` builds DOM nodes imperatively, so the Remotion side uses its
geometry (limb outline, joint, hang, shoe) through an adapter rather than calling it directly. Do not edit these files;
put changes in the adapter.
