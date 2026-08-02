#!/usr/bin/env python3
"""Create reduced-resolution, watermarked JPEG copies for the portfolio.

Put originals inside originals-private/<category>/ and run:
    python tools/prepare_images.py

Originals remain untouched and are excluded from Git by .gitignore.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "originals-private"
OUTPUT = ROOT / "images"
MAX_LONG_EDGE = 2000
JPEG_QUALITY = 84
WATERMARK = "© Omar Sharif Photography"
CATEGORIES = {"landscape", "astrophotography", "wildlife", "wedding", "events", "portraits", "featured"}


def font_for(size: int):
    candidates = [Path("C:/Windows/Fonts/arial.ttf"), Path("/System/Library/Fonts/Supplemental/Arial.ttf"), Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default()


def process(path: Path, destination: Path):
    with Image.open(path) as source:
        image = source.convert("RGB")
        image.thumbnail((MAX_LONG_EDGE, MAX_LONG_EDGE), Image.Resampling.LANCZOS)
        draw = ImageDraw.Draw(image, "RGBA")
        font = font_for(max(16, image.width // 65))
        box = draw.textbbox((0, 0), WATERMARK, font=font)
        width, height = box[2] - box[0], box[3] - box[1]
        padding = max(14, image.width // 70)
        x, y = image.width - width - padding, image.height - height - padding
        draw.rounded_rectangle((x-padding//2, y-padding//2, x+width+padding//2, y+height+padding//2), radius=6, fill=(0, 0, 0, 75))
        draw.text((x, y), WATERMARK, font=font, fill=(255, 255, 255, 170))
        destination.parent.mkdir(parents=True, exist_ok=True)
        exif = Image.Exif()
        exif[0x8298] = WATERMARK  # Copyright
        exif[0x013B] = "Omar Sharif"  # Artist
        image.save(destination, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True, exif=exif)
        print(f"Created {destination.relative_to(ROOT)}")


def main():
    count = 0
    for category in CATEGORIES:
        folder = SOURCE / category
        if not folder.exists():
            continue
        for path in folder.iterdir():
            if path.suffix.lower() not in {".jpg", ".jpeg", ".png", ".tif", ".tiff", ".webp"}:
                continue
            process(path, OUTPUT / category / f"{path.stem}.jpg")
            count += 1
    print(f"Finished: {count} image(s). Originals were not changed.")


if __name__ == "__main__":
    main()
