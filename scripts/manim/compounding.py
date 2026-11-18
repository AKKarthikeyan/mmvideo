"""Manim trial (AK, 18 Nov 2026): a Moat & Margin explainer beat, "five points of return, 2.4x the money".

Illustrative arithmetic only (₹100 compounding for 20 years at 10% vs 15% a year), labelled on screen.
No LaTeX needed: every label is Text, so a plain `pip install manim` is enough.

usage (Mac Mini, after scripts/manim/setup_mac.sh):
  source ~/.venvs/manim/bin/activate
  manim -qh --fps 30 scripts/manim/compounding.py Compounding     # 1080p -> media/videos/compounding/1080p30/
"""
from manim import (BLACK, DOWN, LEFT, RIGHT, UL, UP, Axes, Create, Dot, FadeIn, Line, Scene, Text, ValueTracker,
                   VGroup, Write, always_redraw, config, linear, smooth)

PAPER, INK, MUTED, RED = "#c9bb9c", "#1a1a1a", "#4a4237", "#b3261e"   # Moat & Margin house look (base.css .paper)
config.background_color = PAPER
FONT = "Inter"                                                          # falls back to a system sans if not installed

P, YEARS, LO, HI = 100, 20, 0.10, 0.15


def money(v):
    return f"₹{v:,.0f}"


class Compounding(Scene):
    def construct(self):
        kick = Text("MOAT & MARGIN · HOW A MOAT COMPOUNDS", font=FONT, weight="BOLD", color="#7a1a10").scale(0.32)
        head = Text("Five points of return. Twenty years.", font=FONT, weight="BOLD", color=INK).scale(0.62)
        VGroup(kick, head).arrange(DOWN, aligned_edge=LEFT, buff=0.18).to_corner(UL, buff=0.55)
        self.play(FadeIn(kick, shift=0.1 * UP), Write(head), run_time=1.2)

        ax = Axes(x_range=[0, YEARS, 5], y_range=[0, 1800, 400], x_length=9.4, y_length=4.6, tips=False,
                  axis_config={"color": MUTED, "stroke_width": 2, "include_ticks": True}).to_edge(DOWN, buff=0.9).shift(0.4 * LEFT)
        xl = VGroup(*[Text(str(y), font=FONT, color=MUTED).scale(0.3).next_to(ax.c2p(y, 0), DOWN, buff=0.15) for y in (0, 5, 10, 15, 20)])
        yl = VGroup(*[Text(money(v), font=FONT, color=MUTED).scale(0.28).next_to(ax.c2p(0, v), LEFT, buff=0.15) for v in (400, 800, 1200, 1600)])
        xt = Text("years", font=FONT, color=MUTED).scale(0.3).next_to(ax.c2p(YEARS, 0), DOWN, buff=0.5)
        self.play(Create(ax), FadeIn(xl), FadeIn(yl), FadeIn(xt), run_time=1.0)

        yr = ValueTracker(0)
        def curve(r, color, w):
            return always_redraw(lambda: ax.plot(lambda x: P * (1 + r) ** x, x_range=[0, max(yr.get_value(), 0.01)],
                                                 color=color, stroke_width=w))
        def tip(r, color):
            return always_redraw(lambda: Dot(ax.c2p(yr.get_value(), P * (1 + r) ** yr.get_value()), color=color, radius=0.07))
        def tag(r, color, label, dy):
            # tags fade in once the curves have separated, and sit just above (15%) or below (10%) their dot
            return always_redraw(lambda: Text(f"{label}  {money(P * (1 + r) ** yr.get_value())}", font=FONT, weight="BOLD",
                                              color=color).scale(0.36).next_to(tip(r, color), RIGHT, buff=0.15)
                                 .shift(dy * UP).set_opacity(min(1, max(0, (yr.get_value() - 2.5) / 2))))
        lo, hi = curve(LO, MUTED, 4), curve(HI, RED, 6)
        start = Text("₹100 invested in year 0", font=FONT, color=INK).scale(0.34).next_to(ax.c2p(0.3, 420), RIGHT, buff=0)
        self.play(FadeIn(start), run_time=0.6)
        self.add(lo, hi, tip(LO, MUTED), tip(HI, RED), tag(LO, MUTED, "10% a year", -0.12), tag(HI, RED, "15% a year", 0.12))
        self.play(yr.animate.set_value(YEARS), run_time=6, rate_func=smooth)
        self.wait(0.4)

        a, b = P * (1 + LO) ** YEARS, P * (1 + HI) ** YEARS
        gap = Line(ax.c2p(YEARS, a), ax.c2p(YEARS, b), color=INK, stroke_width=3)
        ratio = Text(f"{b / a:.1f}× the money", font=FONT, weight="BOLD", color=RED).scale(0.7).move_to(ax.c2p(6.5, 1250))
        self.play(Create(gap), Write(ratio), run_time=1.0)
        note = Text("Illustrative example · our arithmetic: ₹100 × 1.10²⁰ vs ₹100 × 1.15²⁰", font=FONT, color=MUTED).scale(0.26)
        note.next_to(head, DOWN, aligned_edge=LEFT, buff=0.2)
        self.play(FadeIn(note), run_time=0.5)
        self.wait(2.0)
