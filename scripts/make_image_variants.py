"""產生網站照片的縮小版本（靜態網站用，讓手機只下載需要的尺寸）。

用法：python3 scripts/make_image_variants.py
- 讀取 public/media/**/*.jpg（不含 _w 資料夾）
- 產生 public/media/_w/640/... 與 public/media/_w/1080/...
- 更新 src/lib/image-manifest.json（網站依此決定哪些照片有縮小版）
新增照片到 public/media 後執行一次，再推送即可。
"""
import json, os, glob
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MEDIA = os.path.join(ROOT, "public", "media")
WIDTHS = [640, 1080]
manifest = {}
for path in sorted(glob.glob(os.path.join(MEDIA, "**", "*.jpg"), recursive=True)):
    rel = os.path.relpath(path, MEDIA).replace(os.sep, "/")
    if rel.startswith("_w/"):
        continue
    im = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
    made = []
    for w in WIDTHS:
        if im.width <= w * 1.1:
            continue
        out = os.path.join(MEDIA, "_w", str(w), rel)
        os.makedirs(os.path.dirname(out), exist_ok=True)
        if not os.path.exists(out) or os.path.getmtime(out) < os.path.getmtime(path):
            v = im.copy()
            v.thumbnail((w, w * 3))
            v.save(out, quality=76, optimize=True, progressive=True)
        made.append(w)
    if made:
        manifest["/media/" + rel] = made
with open(os.path.join(ROOT, "src", "lib", "image-manifest.json"), "w", encoding="utf-8") as f:
    json.dump(manifest, f, ensure_ascii=False, indent=0, sort_keys=True)
print(f"{len(manifest)} 張照片已有縮小版")
