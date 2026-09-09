#!/usr/bin/env python3
"""
Generates the real app icon assets from the brand mark.

Source mark: src/components/assets/dog_sit.png
Brand colors: src/theme/colors.ts (green #2C5666 background, the logo stroke color)

Outputs:
  assets/icon.png                                         1024x1024, opaque (iOS/Expo)
  assets/adaptive-icon.png                                1024x1024, transparent (Android foreground)
  assets/favicon.png                                      64x64 (web)
  ios/HuppyPet/Images.xcassets/AppIcon.appiconset/...     the icon Xcode actually compiles

Requires Pillow:  python3 -m pip install Pillow
Run from the repo root:  python3 assets/generate-icons.py
"""

import os
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MARK = os.path.join(ROOT, "src/components/assets/dog_sit.png")

# src/theme/colors.ts -> green, the brand's primary (same teal as the logo stroke)
TOP = (53, 105, 125)      # #35697D  slightly lifted teal
BOTTOM = (35, 70, 86)     # #234656  slightly deepened teal

SIZE = 1024


def load_mark():
    """The dog mark, cropped to its content and stripped of its white matte.

    The source art was authored over white, so its soft edges are blended toward
    white. Dropped straight onto the teal that reads as a pale halo, so undo the
    blend: composited = true*a + 255*(1-a)  =>  true = (composited - 255*(1-a))/a
    """
    im = Image.open(MARK).convert("RGBA")
    im = im.crop(im.split()[3].getbbox())

    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0 or a == 255:
                continue
            f = a / 255
            px[x, y] = (
                *(min(255, max(0, round((c - 255 * (1 - f)) / f))) for c in (r, g, b)),
                a,
            )
    return im


def gradient(size, top, bottom):
    """Vertical top->bottom gradient, fully opaque."""
    g = Image.new("RGB", (1, size))
    px = g.load()
    for y in range(size):
        t = y / (size - 1)
        px[0, y] = tuple(round(top[i] + (bottom[i] - top[i]) * t) for i in range(3))
    return g.resize((size, size), Image.BICUBIC)


def place(canvas, mark, height_ratio, center_y_ratio):
    """Scale the mark to a share of the canvas height and center it."""
    w, h = mark.size
    target_h = round(canvas.size[1] * height_ratio)
    target_w = round(w * target_h / h)
    scaled = mark.resize((target_w, target_h), Image.LANCZOS)

    x = (canvas.size[0] - target_w) // 2
    y = round(canvas.size[1] * center_y_ratio) - target_h // 2

    # Soft contact shadow so the mark sits on the background instead of floating.
    shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    ImageDraw.Draw(shadow).ellipse(
        [
            x + target_w * 0.16,
            y + target_h * 0.96,
            x + target_w * 0.84,
            y + target_h * 1.04,
        ],
        fill=(0, 0, 0, 48),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(canvas.size[0] * 0.014))

    canvas.alpha_composite(shadow)
    canvas.alpha_composite(scaled, (x, y))
    return canvas


def main():
    mark = load_mark()

    # iOS / Expo icon: opaque, no alpha channel (the App Store rejects alpha,
    # and a transparent icon renders black on the home screen).
    icon = gradient(SIZE, TOP, BOTTOM).convert("RGBA")
    icon = place(icon, mark, height_ratio=0.70, center_y_ratio=0.49)
    icon = icon.convert("RGB")

    out = os.path.join(ROOT, "assets/icon.png")
    icon.save(out)
    print("wrote", out)

    # Xcode asset catalog: the icon the iOS build actually compiles in.
    appicon = os.path.join(
        ROOT, "ios/HuppyPet/Images.xcassets/AppIcon.appiconset/App-Icon-1024x1024@1x.png"
    )
    icon.save(appicon)
    print("wrote", appicon)

    # Android adaptive foreground: the launcher crops to the inner ~66%,
    # so the mark has to stay well inside the safe zone.
    fg = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    fg = place(fg, mark, height_ratio=0.45, center_y_ratio=0.50)
    out = os.path.join(ROOT, "assets/adaptive-icon.png")
    fg.save(out)
    print("wrote", out)

    # Web favicon.
    out = os.path.join(ROOT, "assets/favicon.png")
    icon.resize((64, 64), Image.LANCZOS).save(out)
    print("wrote", out)


if __name__ == "__main__":
    main()
