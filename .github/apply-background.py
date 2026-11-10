#!/usr/bin/env python3
import base64, hashlib
from pathlib import Path

root = Path(__file__).resolve().parents[1]
raw = base64.b64decode("".join((root / ".github" / "background-slice.b64").read_text().split()))
digest = hashlib.sha256(raw).hexdigest()
expected = "3cc9629b0d3ef0f464411f5df8b02f68fcd0a1c4540f9fc33121df4fd120a54b"
if digest != expected:
    raise SystemExit(f"slice hash mismatch: {digest}")

js_path = root / "public" / "assets" / "main-DLg1oGUN.js"
data = js_path.read_bytes()
key = b'f.outlineBlur="0%",f.outlineColor=13421772'
idx = data.find(key)
if idx < 0:
    if b"made around your product." in data and b'outlineBlur="13%"' in data:
        print("background text already applied")
        raise SystemExit(0)
    raise SystemExit("start marker missing")
region_start = idx + len(b'f.outlineBlur="')
end = data.find(b'.`],n=this.mobile?s:t', region_start)
if end < 0:
    raise SystemExit("end marker missing")
updated = data[:region_start] + raw + data[end:]
js_path.write_bytes(updated)
print(f"patched {len(data)} -> {len(updated)}")
