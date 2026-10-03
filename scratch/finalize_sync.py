import json
import hashlib
import os
import shutil
from pathlib import Path
from datetime import datetime, timezone

BASE_DIR = Path(r"c:\Users\Siddharth.Savant\Documents\Travel desk")
DOCS_DESIGN = BASE_DIR / "docs" / "design"
INCOMING = DOCS_DESIGN / "_incoming"
SCREENS_DIR = DOCS_DESIGN / "screens"
HTML_DIR = DOCS_DESIGN / "html"

def file_hash(filepath):
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(8192):
            h.update(chunk)
    return h.hexdigest()

# Load incoming screens.json
with open(INCOMING / "screens.json", "r", encoding="utf-8") as f:
    screens_data = json.load(f)

# Load incoming project.json
with open(INCOMING / "project.json", "r", encoding="utf-8") as f:
    project_data = json.load(f)

# 1. Clear old screens and html directories
print("Replacing docs/design/screens with new active set...")
shutil.rmtree(SCREENS_DIR, ignore_errors=True)
SCREENS_DIR.mkdir(parents=True, exist_ok=True)
for item in (INCOMING / "screens").glob("*"):
    shutil.copy2(item, SCREENS_DIR / item.name)

print("Replacing docs/design/html with new active set...")
shutil.rmtree(HTML_DIR, ignore_errors=True)
HTML_DIR.mkdir(parents=True, exist_ok=True)
for item in (INCOMING / "html").glob("*"):
    shutil.copy2(item, HTML_DIR / item.name)

# 2. Build final stitch-manifest.json
manifest = {
    "projectId": "5624038136432353661",
    "projectTitle": project_data.get("title", "TravelDesk AI Platform UI"),
    "lastSyncDate": datetime.now(timezone.utc).isoformat(),
    "branch": "design-sync-2026-10-03",
    "activeScreensCount": len(screens_data.get("screens", [])),
    "screens": []
}

for idx, s in enumerate(screens_data.get("screens", [])):
    screen_id = s["name"].split("/")[-1]
    title = s.get("title", "")
    
    # Find matching screenshot
    ss_matches = list(SCREENS_DIR.glob(f"*{screen_id[:8]}*"))
    ss_entry = None
    if ss_matches:
        ss_path = ss_matches[0]
        ss_entry = {
            "fileName": ss_path.name,
            "sha256": file_hash(ss_path),
            "sizeBytes": ss_path.stat().st_size
        }

    # Find matching html/code
    html_matches = list(HTML_DIR.glob(f"*{screen_id[:8]}*"))
    html_entry = None
    if html_matches:
        h_path = html_matches[0]
        html_entry = {
            "fileName": h_path.name,
            "sha256": file_hash(h_path),
            "sizeBytes": h_path.stat().st_size
        }

    manifest["screens"].append({
        "order": idx + 1,
        "screenId": screen_id,
        "screenIdShort": screen_id[:8],
        "title": title,
        "width": s.get("width"),
        "height": s.get("height"),
        "screenshot": ss_entry,
        "code": html_entry
    })

manifest_path = DOCS_DESIGN / "stitch-manifest.json"
with open(manifest_path, "w", encoding="utf-8") as f:
    json.dump(manifest, f, indent=2)
print("Updated /docs/design/stitch-manifest.json")

# 3. Clean up _incoming directory
shutil.rmtree(INCOMING, ignore_errors=True)
print("Cleaned up _incoming directory.")

# Also remove baseline scratch manifest
if (DOCS_DESIGN / "stitch-manifest.baseline.json").exists():
    os.remove(DOCS_DESIGN / "stitch-manifest.baseline.json")

print("Final sync completed successfully.")
