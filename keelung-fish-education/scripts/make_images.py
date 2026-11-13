"""把原始照片轉成網站用 WebP（寬 1600 與 800 兩種）。
用法：python3 scripts/make_images.py <原始照片資料夾>
輸出到 public/media/<檔名>-1600.webp / -800.webp
"""
import sys, os, glob
from PIL import Image, ImageOps
src = sys.argv[1]
out = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "media")
os.makedirs(out, exist_ok=True)
for p in sorted(glob.glob(os.path.join(src, "*.jpg"))):
    name = os.path.splitext(os.path.basename(p))[0]
    im = ImageOps.exif_transpose(Image.open(p)).convert("RGB")
    for w in (1600, 800):
        v = im.copy(); v.thumbnail((w, w))
        v.save(os.path.join(out, f"{name}-{w}.webp"), "WEBP", quality=74, method=6)
    print(name, im.size)
