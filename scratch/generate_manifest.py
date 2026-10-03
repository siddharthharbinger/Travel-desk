import json
import hashlib
import os
import re
from pathlib import Path
from datetime import datetime

BASE_DIR = Path(r"c:\Users\Siddharth.Savant\Documents\Travel desk")
DOCS_DESIGN = BASE_DIR / "docs" / "design"
INCOMING = DOCS_DESIGN / "_incoming"

def file_hash(filepath):
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(8192):
            h.update(chunk)
    return h.hexdigest()

# Load incoming screens.json and project.json
with open(INCOMING / "screens.json", "r", encoding="utf-8") as f:
    incoming_screens_data = json.load(f)

with open(INCOMING / "project.json", "r", encoding="utf-8") as f:
    project_data = json.load(f)

# Build baseline manifest based on previously existing files in docs/design/screens and docs/design/html
prev_manifest = {
    "projectId": "5624038136432353661",
    "projectTitle": "TravelDesk AI Platform UI",
    "baselineDate": "2026-10-01T08:10:10Z",
    "screens": []
}

for p in sorted((DOCS_DESIGN / "screens").glob("*")):
    m = re.search(r'(\d+)_([^_].*?)_([0-9a-fA-F]{8,32})\.([a-zA-Z0-9]+)$', p.name)
    if m:
        idx, title_slug, sid8, ext = m.groups()
        # Find matching html if any
        matching_html = list((DOCS_DESIGN / "html").glob(f"*{sid8}*"))
        html_entry = None
        if matching_html:
            h_path = matching_html[0]
            html_entry = {
                "file": h_path.name,
                "sha256": file_hash(h_path),
                "sizeBytes": h_path.stat().st_size
            }
        prev_manifest["screens"].append({
            "screenIdShort": sid8,
            "title": title_slug.replace("_", " "),
            "screenshotFile": p.name,
            "screenshotSha256": file_hash(p),
            "screenshotSizeBytes": p.stat().st_size,
            "html": html_entry
        })

# Save baseline manifest (can be saved as stitch-manifest.baseline.json or current stitch-manifest.json)
with open(DOCS_DESIGN / "stitch-manifest.baseline.json", "w", encoding="utf-8") as f:
    json.dump(prev_manifest, f, indent=2)

print(f"Generated baseline manifest with {len(prev_manifest['screens'])} screens.")
