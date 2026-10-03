import json
import os
import re
import urllib.request
import urllib.parse
from pathlib import Path

BASE_DIR = Path(r"c:\Users\Siddharth.Savant\Documents\Travel desk")
INCOMING_DIR = BASE_DIR / "docs" / "design" / "_incoming"
SCREENS_DIR = INCOMING_DIR / "screens"
HTML_DIR = INCOMING_DIR / "html"

# Ensure directories exist
INCOMING_DIR.mkdir(parents=True, exist_ok=True)
SCREENS_DIR.mkdir(parents=True, exist_ok=True)
HTML_DIR.mkdir(parents=True, exist_ok=True)

# 1. Project details (get_project output)
project_json_path = Path(r"C:\Users\Siddharth.Savant\.gemini\antigravity-ide\brain\791dbeb7-6783-4afd-ace5-cc69bf3f9a88\.system_generated\steps\21\output.txt")
with open(project_json_path, "r", encoding="utf-8") as f:
    project_data = json.load(f)

# Save project json
with open(INCOMING_DIR / "project.json", "w", encoding="utf-8") as f:
    json.dump(project_data, f, indent=2)

# Extract and save DESIGN.md from project designTheme if present
design_md = project_data.get("designTheme", {}).get("designMd", "")
if design_md:
    with open(INCOMING_DIR / "DESIGN.md", "w", encoding="utf-8") as f:
        f.write(design_md)
    print("Saved _incoming/DESIGN.md from project designTheme")

# 2. Screens details (list_screens output)
screens_json_path = Path(r"C:\Users\Siddharth.Savant\.gemini\antigravity-ide\brain\791dbeb7-6783-4afd-ace5-cc69bf3f9a88\.system_generated\steps\25\output.txt")
with open(screens_json_path, "r", encoding="utf-8") as f:
    screens_data = json.load(f)

with open(INCOMING_DIR / "screens.json", "w", encoding="utf-8") as f:
    json.dump(screens_data, f, indent=2)

screens = screens_data.get("screens", [])
print(f"Total screens to fetch: {len(screens)}")

def safe_filename(name):
    clean = re.sub(r'[\\/*?:"<>|]', "", name)
    clean = clean.replace(" ", "_")
    return clean[:80]

results = []

for idx, s in enumerate(screens):
    screen_id = s["name"].split("/")[-1]
    title = s.get("title", f"screen_{screen_id}")
    s_name = safe_filename(f"{idx+1:02d}_{title}")
    print(f"\n[{idx+1}/{len(screens)}] Processing: {title} (ID: {screen_id})")

    # A. Download screenshot
    ss_path_str = None
    screenshot_info = s.get("screenshot", {})
    screenshot_url = screenshot_info.get("downloadUrl")
    if screenshot_url:
        target_ext = ".webp" if "webp" in title.lower() else ".png"
        screenshot_path = SCREENS_DIR / f"{s_name}_{screen_id[:8]}{target_ext}"
        print(f"  -> Screenshot: {screenshot_path.name}")
        try:
            req = urllib.request.Request(screenshot_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as resp, open(screenshot_path, "wb") as out_f:
                out_f.write(resp.read())
            ss_path_str = screenshot_path.name
        except Exception as e:
            print(f"  Error downloading screenshot: {e}")

    # B. Download HTML/code
    html_path_str = None
    html_info = s.get("htmlCode", {})
    html_url = html_info.get("downloadUrl")
    mime_type = html_info.get("mimeType", "")
    if html_url:
        ext = ".html"
        if "markdown" in mime_type or "DESIGN.md" in title:
            ext = ".md"
        html_path = HTML_DIR / f"{s_name}_{screen_id[:8]}{ext}"
        print(f"  -> Code: {html_path.name}")
        try:
            req = urllib.request.Request(html_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as resp:
                content = resp.read().decode("utf-8", errors="replace")
            with open(html_path, "w", encoding="utf-8") as out_f:
                out_f.write(content)
            html_path_str = html_path.name
        except Exception as e:
            print(f"  Error downloading HTML: {e}")

    results.append({
        "index": idx + 1,
        "screen_id": screen_id,
        "title": title,
        "screenshot": ss_path_str,
        "html": html_path_str
    })

print("\n--- Summary of fetched screens ---")
for r in results:
    print(f"#{r['index']:02d}: {r['screen_id'][:8]} | SS: {bool(r['screenshot'])} | HTML: {bool(r['html'])} | {r['title']}")
