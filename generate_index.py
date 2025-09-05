import os
import json

# Folder tempat SVG
SVG_DIR = "data/svg"
OUTPUT_FILE = "data/index.json"

emojis = []

for file in os.listdir(SVG_DIR):
    if file.endswith(".svg"):
        name = os.path.splitext(file)[0]  # nama tanpa .svg
        emojis.append({
            "name": name,
            "unicode": None,               # kosong/null dulu
            "path": f"/svg/{file}"
        })

# Simpan ke index.json
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(emojis, f, indent=2, ensure_ascii=False)

print(f"✅ index.json berhasil dibuat dengan {len(emojis)} emoji.")
