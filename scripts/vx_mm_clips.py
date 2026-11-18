"""Collects CLIPS_EXTRA from the Moat & Margin Nov 2026 modules for build_vx.py."""
import vx_mm_itc, vx_mm_bse
CLIPS_EXTRA = {}
CLIPS_EXTRA.update(vx_mm_itc.CLIPS_EXTRA); CLIPS_EXTRA.update(vx_mm_bse.CLIPS_EXTRA)
