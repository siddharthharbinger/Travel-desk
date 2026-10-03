import re
from pathlib import Path

html_file = Path("docs/design/_incoming/html/05_TravelDesk_-_Immersive_Window_Scroll_Zoom_Landing_(2026)_43c9079b.html")
html = html_file.read_text(encoding="utf-8")

srcs = re.findall(r'src="([^"]+)"', html)
print(f"Total src attributes: {len(srcs)}")
for s in set(srcs):
    print(" -", s)
