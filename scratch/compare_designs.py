import json
import hashlib
import os
import re
from pathlib import Path

BASE_DIR = Path(r"c:\Users\Siddharth.Savant\Documents\Travel desk")
DOCS_DESIGN = BASE_DIR / "docs" / "design"
INCOMING = DOCS_DESIGN / "_incoming"

def file_hash(filepath):
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(8192):
            h.update(chunk)
    return h.hexdigest()

# 1. Inspect existing files in docs/design/screens and docs/design/html
prev_screens = {}
for p in (DOCS_DESIGN / "screens").glob("*"):
    # filename format: {index}_{title}_{id8}.ext
    prev_screens[p.name] = {
        "path": str(p),
        "hash": file_hash(p),
        "size": p.stat().st_size
    }

prev_html = {}
for p in (DOCS_DESIGN / "html").glob("*"):
    prev_html[p.name] = {
        "path": str(p),
        "hash": file_hash(p),
        "size": p.stat().st_size
    }

# 2. Inspect incoming files
inc_screens = {}
for p in (INCOMING / "screens").glob("*"):
    inc_screens[p.name] = {
        "path": str(p),
        "hash": file_hash(p),
        "size": p.stat().st_size
    }

inc_html = {}
for p in (INCOMING / "html").glob("*"):
    inc_html[p.name] = {
        "path": str(p),
        "hash": file_hash(p),
        "size": p.stat().st_size
    }

# Load project & screens info from incoming
with open(INCOMING / "project.json", "r", encoding="utf-8") as f:
    project_data = json.load(f)

with open(INCOMING / "screens.json", "r", encoding="utf-8") as f:
    screens_data = json.load(f)

# Match screens by Screen ID (extract 8-char or 32-char hex ID from filename or screens.json)
def extract_id(filename):
    m = re.search(r'_([0-9a-fA-F]{8,32})\.[a-zA-Z0-9]+$', filename)
    if m:
        return m.group(1).lower()
    return None

prev_by_id = {}
for fn, meta in prev_screens.items():
    sid = extract_id(fn)
    if sid:
        prev_by_id[sid] = {"filename": fn, "meta": meta, "type": "screenshot"}

for fn, meta in prev_html.items():
    sid = extract_id(fn)
    if sid:
        if sid not in prev_by_id:
            prev_by_id[sid] = {}
        prev_by_id[sid]["html_filename"] = fn
        prev_by_id[sid]["html_meta"] = meta

inc_by_id = {}
for fn, meta in inc_screens.items():
    sid = extract_id(fn)
    if sid:
        inc_by_id[sid] = {"filename": fn, "meta": meta, "type": "screenshot"}

for fn, meta in inc_html.items():
    sid = extract_id(fn)
    if sid:
        if sid not in inc_by_id:
            inc_by_id[sid] = {}
        inc_by_id[sid]["html_filename"] = fn
        inc_by_id[sid]["html_meta"] = meta

print("PREVIOUS SCREEN IDs:", len(prev_by_id), list(prev_by_id.keys()))
print("INCOMING SCREEN IDs:", len(inc_by_id), list(inc_by_id.keys()))

added_ids = set(inc_by_id.keys()) - set(prev_by_id.keys())
removed_ids = set(prev_by_id.keys()) - set(inc_by_id.keys())
common_ids = set(inc_by_id.keys()) & set(prev_by_id.keys())

print(f"\nAdded: {added_ids}")
print(f"Removed: {removed_ids}")
print(f"Common: {len(common_ids)}")

changed = []
unchanged = []
for sid in common_ids:
    p_info = prev_by_id[sid]
    i_info = inc_by_id[sid]
    diffs = []
    # Check screenshot hash
    if "meta" in p_info and "meta" in i_info:
        if p_info["meta"]["hash"] != i_info["meta"]["hash"]:
            diffs.append("screenshot_changed")
    elif ("meta" in p_info) != ("meta" in i_info):
        diffs.append("screenshot_presence_changed")
    
    # Check html hash
    if "html_meta" in p_info and "html_meta" in i_info:
        if p_info["html_meta"]["hash"] != i_info["html_meta"]["hash"]:
            diffs.append("html_changed")
    elif ("html_meta" in p_info) != ("html_meta" in i_info):
        diffs.append("html_presence_changed")

    if diffs:
        changed.append((sid, diffs, p_info.get("filename") or p_info.get("html_filename"), i_info.get("filename") or i_info.get("html_filename")))
    else:
        unchanged.append((sid, p_info.get("filename") or p_info.get("html_filename")))

print("\nCHANGED:", changed)
print("\nUNCHANGED:", [u[1] for u in unchanged])

# Check DESIGN.md
existing_design_md = DOCS_DESIGN / "DESIGN.md"
incoming_design_md = INCOMING / "DESIGN.md"

if existing_design_md.exists() and incoming_design_md.exists():
    h_exist = file_hash(existing_design_md)
    h_inc = file_hash(incoming_design_md)
    print(f"\nDESIGN.md existing hash: {h_exist}, incoming hash: {h_inc}, equal: {h_exist == h_inc}")

# Compare traveldesk_design.md_specification (1).md with incoming 13_TravelDesk_DESIGN.md_Specification_31f70c66.md
spec_file = DOCS_DESIGN / "traveldesk_design.md_specification (1).md"
inc_spec_file = INCOMING / "html" / "13_TravelDesk_DESIGN.md_Specification_31f70c66.md"
if spec_file.exists() and inc_spec_file.exists():
    print(f"Spec file hash: {file_hash(spec_file)}, Incoming spec hash: {file_hash(inc_spec_file)}, equal: {file_hash(spec_file) == file_hash(inc_spec_file)}")
