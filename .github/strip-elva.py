from pathlib import Path
import os

REPLACEMENTS = [
    ("elvaOrbOpacity", "orbOpacity"),
    ("elvaOrb", "orbMesh"),
    ("whatelvais", "pitch"),
    ("elva__pulse", "orb__pulse"),
    ("elva.png", "orb.png"),
    ("elva", "orb"),
]

README = """# YUGC

The YUGC site. Scroll, the phone scenes, and the linked pages (Press Center, careers, terms, privacy) are served from this repository.

## Run

```bash
node server.mjs
```

Then open http://localhost:4731

The film is built for a wide desktop window. Set `PORT` if 4731 is taken.
"""

root = Path(".")
png = root / "public" / "elva.png"
if png.exists():
    png.rename(root / "public" / "orb.png")
(root / "README.md").write_text(README)
pkg = root / "package.json"
pkg.write_text(pkg.read_text().replace('"name": "elva"', '"name": "yugc"'))
server = root / "server.mjs"
server.write_text(server.read_text().replace("Elva is running at", "YUGC is running at"))
for dirpath, dirs, files in os.walk(root):
    if ".git" in dirs:
        dirs.remove(".git")
    for name in files:
        path = Path(dirpath) / name
        if path.suffix not in {".html", ".css", ".js"}:
            continue
        text = path.read_text()
        new = text
        for old, repl in REPLACEMENTS:
            new = new.replace(old, repl)
        if new != text:
            path.write_text(new)
print("stripped")
