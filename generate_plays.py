#!/usr/bin/env python3
"""Generate SVG play diagrams for the flag football playbook."""

import os

BASE = "/Users/jjustice/git/github/ffp/plays/svg"
os.makedirs(BASE, exist_ok=True)

# ── Canvas & scale ────────────────────────────────────────────────────────────
W = 560
SH = 420
LOS_Y = 258  # y-coordinate of line of scrimmage
QB_Y = 349  # LOS + 7 yds * 13 px/yd
R_Y = QB_Y

# Player x-positions (left → right: Z Y C H X)
PZ, PY, PC, PH, PX = 55, 165, 280, 395, 505
QBX, RX = 280, 195

# ── Colours ───────────────────────────────────────────────────────────────────
BLUE = "#2471a3"  # route arrows
RED = "#c0392b"  # hot-read arrows
GRAY = "#666666"
ORANGE = "#d35400"  # motion arrows
FIELD = "#ecf5e7"

# ── Player colours ──────────────────────────────────────────────────────────────
CLR_Q = "#222222"  # Quarterback  – black
CLR_C = "#c8a200"  # Center       – yellow
CLR_X = "#c0392b"  # #1 Receiver  – red
CLR_Z = "#2471a3"  # #2 Receiver  – blue
CLR_Y = "#1e8449"  # Slot         – green
CLR_H = "#d35400"  # Hybrid       – orange
CLR_R = "#7d3c98"  # Running back – purple

# ── SVG building blocks ───────────────────────────────────────────────────────
DEFS = f"""  <defs>
    <marker id="a" viewBox="0 0 10 10" refX="9" refY="5"
        markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M0,1 L10,5 L0,9 Z" fill="{BLUE}"/>
    </marker>
    <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5"
        markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M0,1 L10,5 L0,9 Z" fill="{RED}"/>
    </marker>
    <marker id="am" viewBox="0 0 10 10" refX="9" refY="5"
        markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M0,1 L10,5 L0,9 Z" fill="{ORANGE}"/>
    </marker>
    <marker id="ay" viewBox="0 0 10 10" refX="9" refY="5"
        markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M0,1 L10,5 L0,9 Z" fill="{CLR_Y}"/>
    </marker>
    <marker id="ar" viewBox="0 0 10 10" refX="9" refY="5"
        markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M0,1 L10,5 L0,9 Z" fill="{CLR_R}"/>
    </marker>
    <marker id="al" viewBox="0 0 10 10" refX="9" refY="5"
        markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M0,1 L10,5 L0,9 Z" fill="#27ae60"/>
    </marker>
  </defs>"""


def field_bg():
    return f"""  <rect width="{W}" height="{SH}" fill="{FIELD}" rx="6"/>
  <line x1="20" y1="{LOS_Y - 65}"  x2="{W-20}" y2="{LOS_Y - 65}"  stroke="#c5dfc0" stroke-width="1"/>
  <line x1="20" y1="{LOS_Y - 130}" x2="{W-20}" y2="{LOS_Y - 130}" stroke="#c5dfc0" stroke-width="1"/>
  <line x1="20" y1="{LOS_Y - 195}" x2="{W-20}" y2="{LOS_Y - 195}" stroke="#c5dfc0" stroke-width="1"/>
  <text x="{W-22}" y="{LOS_Y - 60}"  font-size="9" fill="#b0ccab" text-anchor="end" font-family="Arial"> 5 yds</text>
  <text x="{W-22}" y="{LOS_Y - 125}" font-size="9" fill="#b0ccab" text-anchor="end" font-family="Arial">10 yds</text>
  <text x="{W-22}" y="{LOS_Y - 190}" font-size="9" fill="#b0ccab" text-anchor="end" font-family="Arial">15 yds</text>
  <line x1="20" y1="{LOS_Y}" x2="{W-20}" y2="{LOS_Y}" stroke="#999" stroke-width="1.5" stroke-dasharray="8,4"/>
  <text x="24" y="{LOS_Y - 5}" font-size="9" fill="#999" font-family="Arial">— LOS —</text>
  <line x1="{PC}" y1="{LOS_Y + 15}" x2="{QBX}" y2="{QB_Y - 15}"
        stroke="#ccc" stroke-width="1" stroke-dasharray="3,3"/>"""


def title_el(text):
    return (
        f'  <text x="{W//2}" y="28" font-size="17" font-weight="bold" '
        f'fill="#1a1a1a" text-anchor="middle" font-family="Arial">{text}</text>'
    )


def player_el(x, y, label, color):
    return (
        f'  <circle cx="{x}" cy="{y}" r="15" fill="{color}" stroke="white" stroke-width="2"/>\n'
        f'  <text x="{x}" y="{y+5}" font-size="13" font-weight="bold" fill="white" '
        f'text-anchor="middle" font-family="Arial">{label}</text>'
    )


def all_players():
    return "\n".join(
        [
            player_el(PZ, LOS_Y, "Z", CLR_Z),
            player_el(PH, LOS_Y, "H", CLR_H),
            player_el(PC, LOS_Y, "C", CLR_C),
            player_el(PY, LOS_Y, "Y", CLR_Y),
            player_el(PX, LOS_Y, "X", CLR_X),
            player_el(QBX, QB_Y, "Q", CLR_Q),
            player_el(RX, R_Y, "R", CLR_R),
        ]
    )


def players_no_h():
    return "\n".join(
        [
            player_el(PZ, LOS_Y, "Z", CLR_Z),
            player_el(PC, LOS_Y, "C", CLR_C),
            player_el(PY, LOS_Y, "Y", CLR_Y),
            player_el(PX, LOS_Y, "X", CLR_X),
            player_el(QBX, QB_Y, "Q", CLR_Q),
            player_el(RX, R_Y, "R", CLR_R),
        ]
    )


def route(d, color=BLUE, hot=False):
    _marker = {
        CLR_X: "ah",  # red
        CLR_Z: "a",  # blue
        CLR_Y: "ay",  # green
        CLR_H: "am",  # orange
        CLR_R: "ar",  # purple
    }
    arr = _marker.get(color, "a")
    dash = 'stroke-dasharray="6,3" ' if hot else ""
    return (
        f'  <path d="{d}" fill="none" stroke="{color}" stroke-width="2.5" '
        f'{dash}stroke-linecap="round" marker-end="url(#{arr})"/>'
    )


def blk_zone(x, y, label=""):
    """Curved blocking-zone arc on the upfield side of the blocking player."""
    r = 22
    top = y - 14
    arc = f"M {x-r},{top} Q {x},{top - int(r * 1.6)} {x+r},{top}"
    result = (
        f'  <path d="{arc}" fill="rgba(100,100,100,0.12)" stroke="{GRAY}" '
        f'stroke-width="2.5" stroke-linecap="round"/>'
    )
    if label:
        result += (
            f'\n  <text x="{x}" y="{y + 30}" font-size="9" fill="{GRAY}" '
            f'text-anchor="middle" font-family="Arial">{label}</text>'
        )
    return result


def motion(d, lx, ly, label):
    return (
        f'  <path d="{d}" fill="none" stroke="{ORANGE}" stroke-width="2" '
        f'stroke-dasharray="6,3" stroke-linecap="round" marker-end="url(#am)"/>\n'
        f'  <text x="{lx}" y="{ly}" font-size="10" fill="{ORANGE}" '
        f'text-anchor="middle" font-family="Arial">{label}</text>'
    )


def reads(hot_txt, primary_txt, secondary_txt=""):
    y = SH - 48
    lines = [
        f'  <rect x="10" y="{y-4}" width="{W-20}" height="50" fill="rgba(255,255,255,0.82)" rx="4"/>',
        f'  <text x="18" y="{y+13}" font-size="11" fill="{RED}"  font-family="Arial">🔥 Hot: {hot_txt}</text>',
        f'  <text x="18" y="{y+29}" font-size="11" fill="{BLUE}" font-family="Arial">🎯 Primary: {primary_txt}</text>',
    ]
    if secondary_txt:
        lines.append(
            f'  <text x="18" y="{y+45}" font-size="11" fill="{BLUE}" font-family="Arial">↩ Secondary: {secondary_txt}</text>'
        )
    return "\n".join(lines)


def lateral(d):
    """Dashed green arrow for a backward lateral pass."""
    return (
        f'  <path d="{d}" fill="none" stroke="#27ae60" stroke-width="2.5" '
        f'stroke-dasharray="5,3" stroke-linecap="round" marker-end="url(#al)"/>'
    )


def dest_el(x, y, label, color):
    """Open dashed circle showing where a player lands after pre-snap motion."""
    return (
        f'  <circle cx="{x}" cy="{y}" r="15" fill="rgba(255,255,255,0.55)" '
        f'stroke="{color}" stroke-width="2" stroke-dasharray="4,3"/>\n'
        f'  <text x="{x}" y="{y+5}" font-size="13" font-weight="bold" fill="{color}" '
        f'text-anchor="middle" font-family="Arial">{label}</text>'
    )


def make_svg(title_txt, player_els, *parts):
    body = "\n".join(
        [DEFS, field_bg(), title_el(title_txt), player_els] + list(parts)
    )
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" '
        f'width="{W}" height="{SH}" viewBox="0 0 {W} {SH}">\n{body}\n</svg>'
    )


def save(name, content):
    path = f"{BASE}/{name}.svg"
    with open(path, "w") as f:
        f.write(content)
    print(f"  ✓  {name}.svg")


# ── QUICK GAME ────────────────────────────────────────────────────────────────
print("Quick Game")

# Slant / Hitch — Z+Y slant inside; H hitch right (hot 3-step); X hitch right (primary); R blocks.
save(
    "slant-flat",
    make_svg(
        "Slant / Hitch",
        all_players(),
        route(f"M {PZ},{LOS_Y} L {PZ},235 L 185,175", CLR_Z),  # Z slant inside
        route(f"M {PY},{LOS_Y} L {PY},235 L 295,178", CLR_Y),  # Y slant inside
        route(
            f"M {PH},{LOS_Y} L {PH},193 C {PH},178 418,180 420,196",
            CLR_H,
            hot=True,
        ),  # H hitch (HOT)
        route(
            f"M {PX},{LOS_Y} L {PX},193 C {PX},178 528,180 530,196", CLR_X
        ),  # X hitch (primary)
        blk_zone(RX, QB_Y),
        reads(
            "H → Hitch (right, 5 yds)", "X → Hitch (right)", "Z or Y → Slant"
        ),
    ),
)

# Mesh — Z and X drag-cross at 3 yds to create natural rub. Y flat left (hot). H out right.
save(
    "mesh",
    make_svg(
        "Mesh",
        all_players(),
        route(
            f"M {PZ},{LOS_Y} L {PZ},236 C {PZ},222 220,218 430,218", CLR_Z
        ),  # Z drag cross right
        route(
            f"M {PX},{LOS_Y} L {PX},232 C {PX},218 320,214 90,214", CLR_X
        ),  # X drag cross left
        route(
            f"M {PY},{LOS_Y} L 15,250", CLR_Y, hot=True
        ),  # Y flat left (HOT)
        route(f"M {PH},{LOS_Y} L {PH},193 L 543,185", CLR_H),  # H out right
        blk_zone(RX, QB_Y),
        reads(
            "Y → Flat left",
            "Z or X Mesh — take the open crosser (rub creates separation)",
            "H → Out right",
        ),
    ),
)

# Speed Out — Z/X speed outs to both boundaries; Y slant inside; H quick flat (hot); R blocks.
save(
    "speed-out",
    make_svg(
        "Speed Out / Hitch",
        all_players(),
        route(
            f"M {PZ},{LOS_Y} L {PZ},193 L 15,182", CLR_Z
        ),  # Z speed out left
        route(f"M {PY},{LOS_Y} L {PY},219 L 282,178", CLR_Y),  # Y slant inside
        route(
            f"M {PH},{LOS_Y} L 543,250", CLR_H, hot=True
        ),  # H flat right (HOT)
        route(
            f"M {PX},{LOS_Y} L {PX},193 L 543,182", CLR_X
        ),  # X speed out right
        blk_zone(RX, QB_Y),
        reads(
            "H → Flat right",
            "X → Speed Out (right, 3-step)",
            "Z → Speed Out or Y → Slant",
        ),
    ),
)

# ── INTERMEDIATE ──────────────────────────────────────────────────────────────
print("Intermediate")

# Curl / Flat — Z/X curl at 8 yds; Y flat left (hot); H flat right; high-low on each side vs. Cover 2.
save(
    "curl-flat",
    make_svg(
        "Curl / Flat",
        all_players(),
        route(
            f"M {PZ},{LOS_Y} L {PZ},154 C {PZ},132 30,134 28,152", CLR_Z
        ),  # Z curl left
        route(
            f"M {PX},{LOS_Y} L {PX},154 C {PX},132 530,134 532,152", CLR_X
        ),  # X curl right
        route(
            f"M {PY},{LOS_Y} L 15,252", CLR_Y, hot=True
        ),  # Y flat left (HOT)
        route(f"M {PH},{LOS_Y} L 543,252", CLR_H),  # H flat right
        blk_zone(RX, QB_Y),
        reads(
            "Y → Flat left (or H flat right) — away from blitz",
            "X Curl / H Flat — high-low right",
            "Z Curl / Y Flat — high-low left",
        ),
    ),
)

# Dagger — X seam clears deep safety; Z digs inside at 10 yds (90°); Y shallow drag hot; H+R block.
save(
    "dagger",
    make_svg(
        "Dagger",
        all_players(),
        route(f"M {PX},{LOS_Y} L {PX},50", CLR_X),  # X go/seam (clears safety)
        route(
            f"M {PZ},{LOS_Y} L {PZ},128 L 285,128", CLR_Z
        ),  # Z dig 10 yds, 90° inside
        route(
            f"M {PY},{LOS_Y} C {PY},232 265,225 375,222", CLR_Y, hot=True
        ),  # Y shallow drag (HOT)
        blk_zone(PH, LOS_Y),
        blk_zone(RX, QB_Y),
        reads(
            "Y → Shallow Drag",
            "Z → Dig (X clears the safety)",
            "X → Go (safety over-rotates)",
        ),
    ),
)

# Smash — Z hitch (5 yds) + Y corner (12 yds) on left side = Cover 2 killer. X hitch backside. H flat right.
save(
    "drive",
    make_svg(
        "Smash",
        all_players(),
        route(
            f"M {PZ},{LOS_Y} L {PZ},193 C {PZ},178 33,180 31,196",
            CLR_Z,
            hot=True,
        ),  # Z hitch left (HOT)
        route(
            f"M {PY},{LOS_Y} L {PY},154 C {PY},128 90,88 48,63", CLR_Y
        ),  # Y corner left (primary)
        route(
            f"M {PX},{LOS_Y} L {PX},193 C {PX},178 528,180 530,196", CLR_X
        ),  # X hitch right
        route(f"M {PH},{LOS_Y} L 543,252", CLR_H),  # H flat right
        blk_zone(RX, QB_Y),
        reads(
            "Z or X → Hitch (vs. blitz)",
            "Y → Corner — CB bites on Z hitch, corner opens behind",
            "Z → Hitch (if CB ignores Y and jumps the corner)",
        ),
    ),
)

# ── DEEP SHOTS ────────────────────────────────────────────────────────────────
print("Deep Shots")

# Four Verticals — True 4 verts (Z Y H X all go vertical). R flat angle is the blitz hot check.
save(
    "four-verts",
    make_svg(
        "Four Verticals",
        all_players(),
        route(f"M {PZ},{LOS_Y} L {PZ},50", CLR_Z),  # Z go left seam
        route(f"M {PY},{LOS_Y} L {PY},50", CLR_Y),  # Y inside seam
        route(f"M {PH},{LOS_Y} L {PH},50", CLR_H),  # H inside seam
        route(f"M {PX},{LOS_Y} L {PX},50", CLR_X),  # X go right seam
        route(f"M {RX},{R_Y} L 30,314", CLR_R, hot=True),  # R flat angle (HOT)
        reads(
            "R → Flat angle (blitz check)",
            "Y or H → Seam (split the safeties in 2-high)",
            "Z or X → Go (vs. man / safety over-commits)",
        ),
    ),
)

# Post / Corner — Z post draws safety inside; X corner attacks void behind CB; Y drag hot; H+R block.
save(
    "post-corner",
    make_svg(
        "Post / Corner",
        all_players(),
        route(
            f"M {PZ},{LOS_Y} L {PZ},128 C {PZ},108 140,82 225,60", CLR_Z
        ),  # Z post
        route(
            f"M {PX},{LOS_Y} L {PX},128 C {PX},108 543,85 549,62", CLR_X
        ),  # X corner
        route(
            f"M {PY},{LOS_Y} C {PY},232 285,225 395,222", CLR_Y, hot=True
        ),  # Y drag (HOT)
        blk_zone(PH, LOS_Y),
        blk_zone(RX, QB_Y),
        reads(
            "Y → Drag",
            "Z → Post (draws safety inside, opens X corner)",
            "X → Corner",
        ),
    ),
)

# Wheel Route — R wheels flat right then turns upfield seam; X clears; Z post; Y out left (hot); H blocks.
save(
    "go-route-shot",
    make_svg(
        "Wheel Route",
        all_players(),
        route(f"M {PX},{LOS_Y} L {PX},50", CLR_X),  # X go (clears CB)
        route(
            f"M {PZ},{LOS_Y} L {PZ},128 C {PZ},108 140,82 225,60", CLR_Z
        ),  # Z post
        route(
            f"M {PY},{LOS_Y} L {PY},193 L 15,183", CLR_Y, hot=True
        ),  # Y out left (HOT)
        route(
            f"M {RX},{R_Y} L 385,322 L 418,235 L 435,80", CLR_R
        ),  # R wheel right
        blk_zone(PH, LOS_Y),
        reads(
            "Y → Out left (hot)",
            "R → Wheel right (LB bites flat, R turns up seam)",
            "Z → Post (safety rotates off wheel)",
        ),
    ),
)

# ── MOTION PLAYS ──────────────────────────────────────────────────────────────
print("Motion Plays")

# H Bubble Screen — H motions from right slot backward-left to outside Y; Y bubbles left with H leading.
save(
    "h-bubble-screen",
    make_svg(
        "H Bubble Screen",
        all_players(),
        motion(
            f"M {PH},{LOS_Y} L {PH},{LOS_Y+20} L 90,{LOS_Y+20}",
            240,
            LOS_Y + 32,
            "← H motion (pre-snap)",
        ),
        dest_el(90, LOS_Y + 20, "H", CLR_H),
        route(
            f"M 90,{LOS_Y+20} L 90,{LOS_Y-26}", CLR_H
        ),  # H drives 2 yds upfield to block
        blk_zone(90, LOS_Y - 26),  # H's block point
        route(
            f"M {PY},{LOS_Y} L 75,{LOS_Y+20}", CLR_Y, hot=True
        ),  # Y bubble to catch behind H (HOT)
        route(
            f"M 75,{LOS_Y+20} L 40,{LOS_Y-26}", CLR_Y
        ),  # Y carries upfield behind H's block
        route(f"M {PX},{LOS_Y} L {PX},50", CLR_X),  # X go (clear)
        route(f"M {PZ},{LOS_Y} L {PZ},50", CLR_Z),  # Z go (clear)
        blk_zone(RX, QB_Y),
        reads(
            "Y → Bubble left (catch behind H, run upfield)",
            "Y Bubble + H drives 2 yds upfield as lead blocker",
            "Z → Go (corner cheats up)",
        ),
    ),
)

# H Deep Crosser — H motions outside right then releases on deep cross left at 10 yds. Y dig at 8 yds (hot).
save(
    "h-deep-crosser",
    make_svg(
        "H Deep Crosser",
        all_players(),
        motion(
            f"M {PH},{LOS_Y} L {PH},{LOS_Y+20} L 530,{LOS_Y+20}",
            462,
            LOS_Y + 32,
            "H motion → (pre-snap)",
        ),
        dest_el(530, LOS_Y + 20, "H", CLR_H),
        route(
            f"M 530,{LOS_Y+20} L 530,128 L 60,128", CLR_H
        ),  # H deep cross left at 10 yds (post-snap)
        route(f"M {PX},{LOS_Y} L {PX},50", CLR_X),  # X go (clear)
        route(f"M {PZ},{LOS_Y} L {PZ},50", CLR_Z),  # Z go
        route(
            f"M {PY},{LOS_Y} L {PY},154 L 360,150", CLR_Y, hot=True
        ),  # Y dig 8 yds right (HOT)
        blk_zone(RX, QB_Y),
        reads(
            "Y → Dig (8 yds, early break)",
            "H → Deep Cross (motion clears coverage)",
            "X → Go or Z → Seam",
        ),
    ),
)

# Hook & Ladder — H motions right-to-left as lead blocker; Y hooks at 5 yds; R angles to receive ladder pass.
save(
    "h-flood",
    make_svg(
        "Hook &amp; Ladder",
        all_players(),
        motion(
            f"M {PH},{LOS_Y} L {PH},{LOS_Y+20} L 105,{LOS_Y+20}",
            250,
            LOS_Y + 32,
            "← H motion (pre-snap)",
        ),
        dest_el(105, LOS_Y + 20, "H", CLR_H),
        route(
            f"M 105,{LOS_Y+20} L 105,{LOS_Y-26}", CLR_H
        ),  # H drives upfield to block
        blk_zone(105, LOS_Y - 26),  # H block zone above LOS
        route(f"M {PZ},{LOS_Y} L {PZ},50", CLR_Z),  # Z go deep (clear)
        route(f"M {PX},{LOS_Y} L {PX},50", CLR_X),  # X go deep (clear)
        route(
            f"M {PY},{LOS_Y} L {PY},193 C {PY},178 148,180 146,196", CLR_Y
        ),  # Y hook at 5 yds
        route(f"M {RX},{R_Y} L 82,285 L 70,258", CLR_R),  # R angles behind Y
        lateral("M 146,196 L 70,258"),  # lateral Y → R
        reads(
            "Y → Hook (vs. heavy blitz — skip ladder, gain yardage)",
            "Y → Hook → lateral to R (H leads block — Ladder!)",
            "Z → Go (corner vacates to stop Y)",
        ),
    ),
)

print(f"\n✅  12 SVGs written to {BASE}")
