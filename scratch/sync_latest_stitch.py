import json
import os
import re
import shutil
import urllib.request
import urllib.parse
from pathlib import Path

BASE_DIR = Path(r"c:\Users\Siddharth.Savant\Documents\Travel desk")
DOCS_DESIGN = BASE_DIR / "docs" / "design"
SCREENS_DIR = DOCS_DESIGN / "screens"
HTML_DIR = DOCS_DESIGN / "html"
PUBLIC_IMAGES = BASE_DIR / "public" / "images"

# 1. Clean out existing directories completely
print("Cleaning existing pulled assets...")
for folder in [SCREENS_DIR, HTML_DIR, PUBLIC_IMAGES]:
    if folder.exists():
        shutil.rmtree(folder)
    folder.mkdir(parents=True, exist_ok=True)

# 2. Load latest screens JSON (from step 72)
screens_json_path = Path(r"C:\Users\Siddharth.Savant\.gemini\antigravity-ide\brain\25a43763-af19-4441-8e1e-c3ede1cf13e2\.system_generated\steps\72\output.txt")
with open(screens_json_path, "r", encoding="utf-8") as f:
    data = json.load(f)

screens = data.get("screens", [])
print(f"Total active screens in latest Stitch design: {len(screens)}")

def safe_filename(name):
    clean = re.sub(r'[\\/*?:"<>|]', "", name)
    clean = clean.replace(" ", "_")
    return clean[:80]

all_image_urls = {}
downloaded_screens = []

for idx, s in enumerate(screens):
    screen_id = s["name"].split("/")[-1]
    title = s.get("title", f"screen_{screen_id}")
    s_name = safe_filename(f"{idx+1:02d}_{title}")
    print(f"\n[{idx+1}/{len(screens)}] Pulling: {title} (ID: {screen_id})")

    # A. Download screenshot if available
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
            downloaded_screens.append((idx+1, title, screen_id, str(screenshot_path.name)))
        except Exception as e:
            print(f"  Error downloading screenshot: {e}")

    # B. Download HTML/code if available
    html_info = s.get("htmlCode", {})
    html_url = html_info.get("downloadUrl")
    mime_type = html_info.get("mimeType", "")
    if html_url:
        ext = ".html"
        if "markdown" in mime_type or "DESIGN.md" in title:
            ext = ".md"
        html_path = HTML_DIR / f"{s_name}_{screen_id[:8]}{ext}"
        print(f"  -> Code ({mime_type}): {html_path.name}")
        try:
            req = urllib.request.Request(html_url, headers={'User-Agent': 'Mozilla/5.0'})
            content = ""
            with urllib.request.urlopen(req) as resp:
                content = resp.read().decode("utf-8", errors="replace")
            with open(html_path, "w", encoding="utf-8") as out_f:
                out_f.write(content)

            # Scan HTML for referenced image URLs
            urls_in_html = re.findall(r'(https?://[^\s"\'\)\>]+)', content)
            for u in urls_in_html:
                if any(ext in u.lower() for ext in ['.png', '.jpg', '.jpeg', '.webp', '.svg', 'googleusercontent.com']):
                    clean_u = u.rstrip(';,)"\'')
                    all_image_urls[clean_u] = all_image_urls.get(clean_u, []) + [title]

        except Exception as e:
            print(f"  Error downloading HTML: {e}")

# 3. Save standard photo and brand assets to public/images
print("\nSaving high-resolution visual assets to /public/images/...")
for s in screens:
    title = s.get("title", "")
    screenshot_info = s.get("screenshot", {})
    screenshot_url = screenshot_info.get("downloadUrl")
    if not screenshot_url:
        continue
    screen_id = s["name"].split("/")[-1]

    # Map asset screens to semantic public/images filenames
    img_name = None
    if "harbinger-logo" in title.lower():
        img_name = "harbinger-logo.webp"
    elif "pullman" in title.lower() and "room" in title.lower():
        img_name = "hotel_pullman_room.png"
    elif "pullman" in title.lower() and "exterior" in title.lower():
        img_name = "hotel_pullman_exterior.png"
    elif "sofitel" in title.lower() or "lobby" in title.lower():
        img_name = "hotel_sofitel_lobby.png"
    elif "marienplatz" in title.lower():
        img_name = "dest_munich.png"
    elif "manhattan" in title.lower() or "new york" in title.lower():
        img_name = "dest_newyork.png"
    elif "frankfurt" in title.lower():
        img_name = "dest_frankfurt.png"
    elif "paris" in title.lower() or "prague" in title.lower():
        img_name = "dest_paris.png"
    elif "aircraft" in title.lower() or "airplane" in title.lower():
        img_name = "flight_aircraft_sunset.png"

    if img_name:
        dest_path = PUBLIC_IMAGES / img_name
        print(f"  Asset -> public/images/{img_name}")
        try:
            req = urllib.request.Request(screenshot_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as resp, open(dest_path, "wb") as out_f:
                out_f.write(resp.read())
        except Exception as e:
            print(f"  Error downloading {img_name}: {e}")

# 4. Download any images directly referenced inside the HTML of active screens
img_counter = 1
for url, screen_sources in all_image_urls.items():
    parsed = urllib.parse.urlparse(url)
    base_name = os.path.basename(parsed.path)
    if not base_name or len(base_name) < 3 or not any(base_name.lower().endswith(x) for x in ['.png', '.jpg', '.jpeg', '.webp', '.svg']):
        base_name = f"stitch_ref_{img_counter}.png"
    else:
        base_name = f"stitch_ref_{img_counter}_{base_name}"
    
    img_dest = PUBLIC_IMAGES / base_name
    print(f"  HTML referenced image {img_counter} -> public/images/{base_name}")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as resp, open(img_dest, "wb") as out_f:
            out_f.write(resp.read())
        img_counter += 1
    except Exception as e:
        print(f"  Error fetching {url}: {e}")

print("\nSync completed successfully with ONLY the latest Stitch design assets!")
