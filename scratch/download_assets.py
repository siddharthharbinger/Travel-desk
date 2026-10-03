import json
import os
import re
import urllib.request
import urllib.parse
from pathlib import Path

BASE_DIR = Path(r"c:\Users\Siddharth.Savant\Documents\Travel desk")
DOCS_DESIGN = BASE_DIR / "docs" / "design"
SCREENS_DIR = DOCS_DESIGN / "screens"
HTML_DIR = DOCS_DESIGN / "html"
PUBLIC_IMAGES = BASE_DIR / "public" / "images"

SCREENS_DIR.mkdir(parents=True, exist_ok=True)
HTML_DIR.mkdir(parents=True, exist_ok=True)
PUBLIC_IMAGES.mkdir(parents=True, exist_ok=True)

# Load screens JSON
screens_json_path = Path(r"C:\Users\Siddharth.Savant\.gemini\antigravity-ide\brain\25a43763-af19-4441-8e1e-c3ede1cf13e2\.system_generated\steps\15\output.txt")
with open(screens_json_path, "r", encoding="utf-8") as f:
    data = json.load(f)

screens = data.get("screens", [])
print(f"Total items in project: {len(screens)}")

def safe_filename(name):
    clean = re.sub(r'[\\/*?:"<>|]', "", name)
    clean = clean.replace(" ", "_")
    return clean[:80]

all_image_urls = {}
downloaded_files = []

for idx, s in enumerate(screens):
    screen_id = s["name"].split("/")[-1]
    title = s.get("title", f"screen_{screen_id}")
    s_name = safe_filename(f"{idx+1:02d}_{title}")
    print(f"\n[{idx+1}/{len(screens)}] Processing: {title} (ID: {screen_id})")

    # 1. Download screenshot if available
    screenshot_info = s.get("screenshot", {})
    screenshot_url = screenshot_info.get("downloadUrl")
    if screenshot_url:
        target_ext = ".webp"
        if "logo" in title.lower() and ".png" in title.lower():
            target_ext = ".png"
        elif "harbinger-logo" in title.lower():
            target_ext = ".webp"
        else:
            target_ext = ".png"
            
        screenshot_path = SCREENS_DIR / f"{s_name}_{screen_id}{target_ext}"
        print(f"  Downloading screenshot -> {screenshot_path.name}")
        try:
            req = urllib.request.Request(screenshot_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as resp, open(screenshot_path, "wb") as out_f:
                out_f.write(resp.read())
            downloaded_files.append((title, str(screenshot_path.relative_to(BASE_DIR))))
        except Exception as e:
            print(f"  Error downloading screenshot: {e}")

    # 2. Download HTML/code if available
    html_info = s.get("htmlCode", {})
    html_url = html_info.get("downloadUrl")
    mime_type = html_info.get("mimeType", "")
    if html_url:
        ext = ".html"
        if "svg" in mime_type or "svg" in title.lower():
            ext = ".svg"
        elif "markdown" in mime_type:
            ext = ".md"
            
        html_path = HTML_DIR / f"{s_name}_{screen_id}{ext}"
        print(f"  Downloading code ({mime_type}) -> {html_path.name}")
        try:
            req = urllib.request.Request(html_url, headers={'User-Agent': 'Mozilla/5.0'})
            content = ""
            with urllib.request.urlopen(req) as resp:
                content = resp.read().decode("utf-8", errors="replace")
            with open(html_path, "w", encoding="utf-8") as out_f:
                out_f.write(content)
                
            # If this is DESIGN.md specification
            if "DESIGN.md" in title or ext == ".md":
                design_md_dest = DOCS_DESIGN / "DESIGN.md"
                with open(design_md_dest, "w", encoding="utf-8") as out_f:
                    out_f.write(content)
                print(f"  Saved to docs/design/DESIGN.md")

            # Scan HTML for image URLs
            # 1) src="..."
            # 2) url(...)
            # 3) https://lh3.googleusercontent.com/... or similar
            urls_in_html = re.findall(r'(https?://[^\s"\'\)\>]+)', content)
            for u in urls_in_html:
                if any(ext in u.lower() for ext in ['.png', '.jpg', '.jpeg', '.webp', '.svg', 'googleusercontent.com']):
                    clean_u = u.rstrip(';,)"\'')
                    all_image_urls[clean_u] = all_image_urls.get(clean_u, []) + [title]

        except Exception as e:
            print(f"  Error downloading HTML: {e}")

print(f"\nFound {len(all_image_urls)} external image/media URLs across all screens.")

# Also download standalone photo assets from Stitch directly to public/images
for idx, s in enumerate(screens):
    title = s.get("title", "")
    screenshot_info = s.get("screenshot", {})
    screenshot_url = screenshot_info.get("downloadUrl")
    if not screenshot_url:
        continue
        
    screen_id = s["name"].split("/")[-1]
    # Check if this screen is an image asset rather than a page mockup
    html_info = s.get("htmlCode", {})
    is_asset = not html_info or not html_info.get("downloadUrl") or "logo" in title.lower() or "webp" in title.lower() or "photography" in title.lower() or "photo" in title.lower() or "view" in title.lower()
    
    if is_asset:
        # Determine image file name
        img_name = "asset_" + screen_id
        if "logo" in title.lower() and "harbinger" in title.lower():
            img_name = "harbinger-logo.webp"
        elif "avatar" in title.lower() or "headshot" in title.lower():
            img_name = "avatar_executive.png"
        elif "pullman" in title.lower() and "room" in title.lower():
            img_name = "hotel_pullman_room.png"
        elif "pullman" in title.lower() and "exterior" in title.lower():
            img_name = "hotel_pullman_exterior.png"
        elif "sofitel" in title.lower() or "lobby" in title.lower():
            img_name = "hotel_sofitel_lobby.png"
        elif "munich" in title.lower() or "marienplatz" in title.lower():
            img_name = "dest_munich.png"
        elif "manhattan" in title.lower() or "new york" in title.lower():
            img_name = "dest_newyork.png"
        elif "frankfurt" in title.lower():
            img_name = "dest_frankfurt.png"
        elif "paris" in title.lower() or "prague" in title.lower():
            img_name = "dest_paris.png"
        elif "aircraft" in title.lower() or "airplane" in title.lower():
            img_name = "flight_aircraft_sunset.png"
        else:
            img_name = f"{safe_filename(title[:40])}_{screen_id[:8]}.png"

        dest_path = PUBLIC_IMAGES / img_name
        print(f"Downloading asset to public/images/{img_name} ({title[:50]}...)")
        try:
            req = urllib.request.Request(screenshot_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as resp, open(dest_path, "wb") as out_f:
                out_f.write(resp.read())
        except Exception as e:
            print(f"  Error downloading asset to public/images: {e}")

# Download referenced images from HTML
img_counter = 1
for url, screen_sources in all_image_urls.items():
    print(f"Downloading referenced image {img_counter}: {url[:60]}...")
    # Derive name
    parsed = urllib.parse.urlparse(url)
    base_name = os.path.basename(parsed.path)
    if not base_name or len(base_name) < 3 or not any(base_name.lower().endswith(x) for x in ['.png', '.jpg', '.jpeg', '.webp', '.svg']):
        base_name = f"stitch_ref_{img_counter}.png"
    else:
        base_name = f"stitch_ref_{img_counter}_{base_name}"
    
    img_dest = PUBLIC_IMAGES / base_name
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as resp, open(img_dest, "wb") as out_f:
            out_f.write(resp.read())
        img_counter += 1
    except Exception as e:
        print(f"  Error fetching {url}: {e}")

print("\nAsset extraction completed successfully!")
