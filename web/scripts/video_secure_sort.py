"""
Explainer video for the IEEE PRAI 2026 paper:
"YOLO11n and AES-128: A Dual-Layer Physical and Communication Security Framework for IIoT".

Style matches the PULSE explainer: 1080x1080, navy background, amber/cyan labels,
burned-in captions, "Illustrative, not to scale" tag. Every number on screen is
taken from the paper (mAP 0.982, 94% sorting, 180 ms, 8-10 FPS, 0.009 ms, 9,600 baud,
5.5 KB Flash / 416 B SRAM, $100-150, classes box/comb/toothbrush).

Usage:  python3 scripts/video_secure_sort.py  -> public/videos/secure-sort.mp4
Needs Pillow and ffmpeg. Narration script is written next to the video as .txt
so it can be voiced and muxed in later.
"""
from __future__ import annotations

import math
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

W = H = 1080
FPS = 30
OUT = Path(__file__).resolve().parent.parent / "public" / "videos"

NAVY, PANEL, LINE = (15, 31, 51), (22, 41, 63), (36, 64, 95)
AMBER, CYAN, TEXT, MUTED = (255, 179, 71), (94, 200, 229), (231, 238, 246), (159, 177, 198)
RED, GREEN, EARTH = (255, 107, 107), (123, 224, 166), (30, 80, 130)

FD = "/usr/share/fonts/truetype/dejavu/"
F = {
    "title": ImageFont.truetype(FD + "DejaVuSans-Bold.ttf", 46),
    "h": ImageFont.truetype(FD + "DejaVuSans-Bold.ttf", 30),
    "b": ImageFont.truetype(FD + "DejaVuSans-Bold.ttf", 22),
    "r": ImageFont.truetype(FD + "DejaVuSans.ttf", 22),
    "s": ImageFont.truetype(FD + "DejaVuSans.ttf", 17),
    "m": ImageFont.truetype(FD + "DejaVuSansMono.ttf", 19),
    "it": ImageFont.truetype(FD + "DejaVuSans.ttf", 16),
    "cap": ImageFont.truetype(FD + "DejaVuSans-Bold.ttf", 27),
    "big": ImageFont.truetype(FD + "DejaVuSans-Bold.ttf", 64),
}

# (start_s, end_s, caption). Captions double as the narration script.
SCENES = [
    (0.0, 4.0, "Secure Sort: two layers of defence for a factory line."),
    (4.0, 13.0, "A webcam watches every object on the belt."),
    (13.0, 20.0, "YOLO11n on a plain Core i3 knows three parts: box, comb, toothbrush."),
    (20.0, 27.0, "Anything else is unknown, and gets rejected."),
    (27.0, 36.0, "The sort command goes to an STM32 over a serial wire, encrypted with AES-128."),
    (36.0, 45.0, "An attacker on the wire injects a fake command."),
    (45.0, 52.0, "The HMAC check fails, so the STM32 drops it."),
    (52.0, 60.0, "94% sorting success. 180 ms per object. Security adds 0.009 ms."),
    (60.0, 64.0, "IEEE PRAI 2026."),
]
DUR = SCENES[-1][1]

ease = lambda t: t * t * (3 - 2 * t)
clamp = lambda v, a=0.0, b=1.0: max(a, min(b, v))
lerp = lambda a, b, t: a + (b - a) * t


def seg(t: float, a: float, b: float) -> float:
    """Progress 0..1 of time t through [a, b]."""
    return ease(clamp((t - a) / (b - a)))


def label(d: ImageDraw.ImageDraw, xy, lines, fill, fg=NAVY, font=F["b"], anchor="mm"):
    """Rounded label box like the PULSE video (amber/cyan tag with dark text)."""
    lines = lines if isinstance(lines, list) else [lines]
    ws = [d.textlength(s, font=font) for s in lines]
    lh = font.size + 6
    w, h = max(ws) + 24, lh * len(lines) + 12
    x, y = xy
    if anchor == "mm":
        x, y = x - w / 2, y - h / 2
    d.rounded_rectangle([x, y, x + w, y + h], 6, fill=fill)
    for i, s in enumerate(lines):
        d.text((x + w / 2, y + 6 + lh * i + lh / 2), s, font=font, fill=fg, anchor="mm")


def caption(d, t):
    for a, b, text in SCENES:
        if a <= t < b:
            k = clamp((t - a) / 0.35) * clamp((b - t) / 0.25)
            words = text.split()
            lines, cur = [], ""
            for w in words:
                if d.textlength(cur + " " + w, font=F["cap"]) > 900:
                    lines.append(cur.strip()); cur = w
                else:
                    cur += " " + w
            lines.append(cur.strip())
            y0 = H - 70 - 40 * (len(lines) - 1)
            for i, ln in enumerate(lines):
                tw = d.textlength(ln, font=F["cap"])
                y = y0 + i * 40
                d.rounded_rectangle([W / 2 - tw / 2 - 14, y - 22, W / 2 + tw / 2 + 14, y + 20], 8,
                                    fill=NAVY, outline=tuple(int(lerp(c1, c2, k)) for c1, c2 in zip(NAVY, AMBER)), width=2)
                d.text((W / 2, y), ln, font=F["cap"], fill=TEXT, anchor="mm")
            # amber progress tick under caption, like PULSE
            p = clamp((t - a) / (b - a))
            d.line([W / 2 - 50, H - 30, W / 2 - 50 + 100 * p, H - 30], fill=AMBER, width=4)
            return


# Belt objects: (spawn_time, kind). kind in box/comb/toothbrush/unknown
OBJECTS = [(4.5, "box"), (7.0, "comb"), (9.5, "toothbrush"), (12.0, "box"), (14.5, "comb"), (17.0, "toothbrush"),
           (20.5, "unknown"), (23.0, "box"), (25.5, "unknown"), (48.0, "unknown"), (50.5, "comb"), (53.0, "toothbrush"), (55.5, "box")]
BELT_Y, BELT_X0, BELT_X1, CAM_X, GATE_X = 430, 90, 990, 420, 760
SPEED = 120  # px per second


def draw_object(d, kind, x, y, s=1.0):
    if kind == "box":
        d.rectangle([x - 26 * s, y - 26 * s, x + 26 * s, y + 26 * s], fill=(176, 132, 84), outline=(120, 86, 50), width=2)
        d.line([x - 26 * s, y - 6 * s, x + 26 * s, y - 6 * s], fill=(120, 86, 50), width=2)
    elif kind == "comb":
        d.rectangle([x - 32 * s, y - 8 * s, x + 32 * s, y], fill=(90, 150, 210))
        for i in range(9):
            xx = x - 30 * s + i * 7.5 * s
            d.line([xx, y, xx, y + 18 * s], fill=(90, 150, 210), width=3)
    elif kind == "toothbrush":
        d.rounded_rectangle([x - 36 * s, y - 4 * s, x + 20 * s, y + 4 * s], 4, fill=(240, 240, 245))
        d.rectangle([x + 18 * s, y - 12 * s, x + 36 * s, y - 2 * s], fill=CYAN)
    else:  # unknown: irregular shape
        pts = [(x + 28 * s * math.cos(a) * (0.7 + 0.3 * math.sin(3 * a)), y + 24 * s * math.sin(a)) for a in [i * math.pi / 6 for i in range(12)]]
        d.polygon(pts, fill=(140, 90, 160), outline=(200, 140, 220))


def scene_factory(d, t):
    """Conveyor, camera, CPU, wire, STM32, gate. Persistent background for most scenes."""
    # belt
    d.rounded_rectangle([BELT_X0, BELT_Y + 32, BELT_X1, BELT_Y + 58], 13, fill=PANEL, outline=LINE, width=2)
    for i in range(30):
        xx = BELT_X0 + ((i * 34 + t * SPEED) % (BELT_X1 - BELT_X0))
        d.line([xx, BELT_Y + 36, xx - 8, BELT_Y + 54], fill=LINE, width=2)
    # reject bin + accept bin
    d.rectangle([GATE_X - 30, BELT_Y + 110, GATE_X + 50, BELT_Y + 190], outline=RED, width=3)
    d.text((GATE_X + 10, BELT_Y + 205), "REJECT", font=F["s"], fill=RED, anchor="mm")
    d.rectangle([BELT_X1 - 60, BELT_Y + 70, BELT_X1 + 10, BELT_Y + 150], outline=GREEN, width=3)
    d.text((BELT_X1 - 25, BELT_Y + 165), "ACCEPT", font=F["s"], fill=GREEN, anchor="mm")
    # camera
    d.line([CAM_X, 170, CAM_X, 250], fill=MUTED, width=4)
    d.rounded_rectangle([CAM_X - 40, 240, CAM_X + 40, 290], 8, fill=PANEL, outline=CYAN, width=3)
    d.ellipse([CAM_X - 12, 270, CAM_X + 12, 294], fill=CYAN)
    cone = 0.35 + 0.15 * math.sin(t * 4)
    d.polygon([(CAM_X - 10, 294), (CAM_X + 10, 294), (CAM_X + 70, BELT_Y + 30), (CAM_X - 70, BELT_Y + 30)],
              outline=tuple(int(c * cone + n * (1 - cone)) for c, n in zip(CYAN, NAVY)))
    # CPU box
    d.rounded_rectangle([90, 120, 290, 220], 10, fill=PANEL, outline=LINE, width=2)
    d.text((190, 150), "Intel Core i3", font=F["b"], fill=TEXT, anchor="mm")
    d.text((190, 184), "YOLO11n · no GPU", font=F["s"], fill=MUTED, anchor="mm")
    d.line([290, 170, CAM_X - 40, 260], fill=LINE, width=2)
    # STM32
    d.rounded_rectangle([760, 120, 990, 220], 10, fill=PANEL, outline=LINE, width=2)
    d.text((875, 150), "STM32F407", font=F["b"], fill=TEXT, anchor="mm")
    d.text((875, 184), "drives SG90 servo", font=F["s"], fill=MUTED, anchor="mm")
    # USART wire
    d.line([290, 140, 760, 140], fill=AMBER if t > 27 else LINE, width=3)
    d.text((525, 120), "USART · 9,600 baud", font=F["s"], fill=MUTED, anchor="mm")
    d.line([875, 220, GATE_X + 10, BELT_Y + 20], fill=LINE, width=2)


def scene_objects(d, t, reject_time_shift=True):
    for t0, kind in OBJECTS:
        if t < t0:
            continue
        x = BELT_X0 + 20 + (t - t0) * SPEED
        y = BELT_Y + 6
        if x > BELT_X1 + 40:
            continue
        # unknowns drop into reject bin after the gate
        if kind == "unknown" and x > GATE_X:
            k = clamp((x - GATE_X) / 60)
            draw_object(d, kind, GATE_X + 10, lerp(y, BELT_Y + 150, ease(k)), 1)
            continue
        if x > BELT_X1 - 60:
            k = clamp((x - (BELT_X1 - 60)) / 40)
            draw_object(d, kind, BELT_X1 - 25, lerp(y, BELT_Y + 110, ease(k)), 0.9)
            continue
        draw_object(d, kind, x, y)
        # detection box while under camera
        if abs(x - CAM_X) < 80:
            ok = kind != "unknown"
            col = GREEN if ok else RED
            d.rectangle([x - 44, y - 40, x + 44, y + 40], outline=col, width=3)
            conf = {"box": "0.99", "comb": "1.00", "toothbrush": "0.96"}.get(kind, "")
            label(d, (x, y - 66), f"{kind} {conf}" if ok else "UNKNOWN → reject", col, font=F["s"])
        # gate arm
    gate_open = any(k == "unknown" and 0 <= (BELT_X0 + 20 + (t - t0) * SPEED) - (GATE_X - 50) <= 110 for t0, k in OBJECTS if t >= t0)
    ang = -35 if gate_open else 0
    gx, gy = GATE_X - 30, BELT_Y + 32
    d.line([gx, gy, gx + 70 * math.cos(math.radians(ang)), gy - 70 * math.sin(math.radians(ang))], fill=AMBER, width=6)


def scene_packet(d, t):
    """27-52 s: encrypted packets, then forged packet rejected by HMAC."""
    # legit packets every 3 s from 27 to 36 and 45 to 52
    for t0 in [28, 31, 34, 46.5, 49.5]:
        k = (t - t0) / 1.6
        if 0 <= k <= 1:
            x = lerp(300, 750, ease(k))
            label(d, (x, 96), ["AES-128-CTR", "+ HMAC"], CYAN, font=F["s"])
            if k > 0.95:
                label(d, (875, 255), "✓ verified", GREEN, font=F["s"])
    if 27 <= t < 36:
        label(d, (525, 300), ["cmd = SORT_BIN_2", "→ 3f a9 07 c2 … | tag 8e1d…"], PANEL, fg=TEXT, font=F["m"])
    # attacker
    if 36 <= t < 52:
        k = seg(t, 36, 38)
        ax, ay = 525, lerp(-20, 78, k)
        d.ellipse([ax - 26, ay - 26, ax + 26, ay + 26], fill=RED)
        d.text((ax, ay), "!", font=F["h"], fill=NAVY, anchor="mm")
        label(d, (ax + 120, ay + 6), "attacker on the wire", RED, font=F["s"])
        d.line([ax, ay + 26, ax, 140], fill=RED, width=3)
        if t > 39:
            k2 = clamp((t - 39) / 2.0)
            x = lerp(525, 750, ease(k2))
            label(d, (x, 96), ["FORGED", "cmd = ACCEPT_ALL"], RED, font=F["s"])
            if t > 41:
                k3 = seg(t, 41, 42)
                label(d, (875, 255), "✗ HMAC mismatch · dropped", RED, font=F["s"])
                r = 40 + 30 * k3
                d.ellipse([875 - r, 170 - r, 875 + r, 170 + r], outline=RED, width=4)
    if 45 <= t < 52:
        label(d, (525, 300), ["Replay or forgery without the key", "never reaches the servo."], PANEL, fg=TEXT, font=F["r"])


def scene_results(d, t):
    k = seg(t, 52, 53.2)
    cards = [("0.982", "mAP@0.5"), ("94%", "sorting success"), ("180 ms", "per object, CPU only"), ("0.009 ms", "added by security")]
    for i, (v, l) in enumerate(cards):
        kk = seg(t, 52 + i * 0.4, 53 + i * 0.4)
        x = 140 + (i % 2) * 420
        y = 250 + (i // 2) * 250 + (1 - kk) * 40
        d.rounded_rectangle([x, y, x + 380, y + 200], 14, fill=PANEL, outline=AMBER if i == 3 else LINE, width=3)
        d.text((x + 190, y + 85), v, font=F["big"], fill=AMBER if i == 3 else TEXT, anchor="mm")
        d.text((x + 190, y + 150), l, font=F["r"], fill=MUTED, anchor="mm")
    d.text((W / 2, 180), "Results from the paper", font=F["h"], fill=CYAN, anchor="mm")
    if k > 0.9:
        d.text((W / 2, 790), "5.5 KB Flash · 416 B SRAM · $100 to $150 total hardware", font=F["r"], fill=MUTED, anchor="mm")


def scene_title(d, t, a, b, end=False):
    k = seg(t, a, a + 0.8)
    box_w = 760
    d.rounded_rectangle([W / 2 - box_w / 2, 400 - 30 * (1 - k), W / 2 + box_w / 2, 600], 18, fill=AMBER)
    if end:
        d.text((W / 2, 455), "YOLO11n and AES-128", font=F["title"], fill=NAVY, anchor="mm")
        d.text((W / 2, 510), "IEEE PRAI 2026 · Beijing", font=F["h"], fill=NAVY, anchor="mm")
        d.text((W / 2, 560), "A. M. Jamil, J. Saleem, T. Jan, N. Ahmad", font=F["r"], fill=NAVY, anchor="mm")
    else:
        d.text((W / 2, 470), "Secure Sort", font=F["big"], fill=NAVY, anchor="mm")
        d.text((W / 2, 545), "Vision + encryption for a factory line", font=F["h"], fill=NAVY, anchor="mm")


def frame(t: float) -> Image.Image:
    im = Image.new("RGB", (W, H), NAVY)
    d = ImageDraw.Draw(im)
    d.text((W - 30, 28), "Illustrative, not to scale", font=F["it"], fill=MUTED, anchor="rm")
    # faint stars/grid for texture
    for i in range(40):
        d.point(((i * 137) % W, (i * 263) % 700), fill=LINE)
    if t < 52:
        # draw the factory on its own layer, then scale it up to fill the frame
        layer = Image.new("RGB", (W, H), NAVY)
        ld = ImageDraw.Draw(layer)
        scene_factory(ld, t); scene_objects(ld, t)
        if t >= 27:
            scene_packet(ld, t)
        im.paste(layer.crop((50, 40, 1030, 700)).resize((1080, 727), Image.LANCZOS), (0, 110))
        d = ImageDraw.Draw(im)
        d.text((W - 30, 28), "Illustrative, not to scale", font=F["it"], fill=MUTED, anchor="rm")
        if t < 4:
            scene_title(d, t, 0, 4)
    elif t < 60:
        scene_results(d, t)
    else:
        scene_title(d, t, 60, 64, end=True)
    caption(d, t)
    return im


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    out = OUT / "secure-sort.mp4"
    n = int(DUR * FPS)
    ff = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
                           "-i", "-", "-c:v", "libx264", "-crf", "26", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(out)],
                          stdin=subprocess.PIPE)
    for i in range(n):
        ff.stdin.write(frame(i / FPS).tobytes())
    ff.stdin.close(); ff.wait()
    frame(30.0).save(OUT / "secure-sort.jpg", quality=80)
    (OUT / "secure-sort.narration.txt").write_text("\n".join(f"[{a:05.1f}-{b:05.1f}s] {c}" for a, b, c in SCENES) + "\n")
    print("wrote", out)


if __name__ == "__main__":
    main()
