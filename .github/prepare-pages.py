from pathlib import Path
import base64
import re

Y = """    <svg width=\"38\" height=\"40\" viewBox=\"0 0 1416 1490\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\">
      <g transform=\"translate(0 1490) scale(1 -1)\">
        <path fill=\"white\" d=\"M8 1490H361L701 848H715L1055 1490H1408L865 526V0H552V526Z\"/>
      </g>
    </svg>"""
OLD = re.compile(r'<svg width="96" height="48"[\s\S]*?</svg>')

for page in Path("public").glob("*.html"):
    text = page.read_text()
    if OLD.search(text):
        page.write_text(OLD.sub(Y, text, count=1))
        print("mark", page)

ready = Path("public/mainflow/film.b64.ready")
parts = sorted(Path("public/mainflow").glob("film.b64.part*"))
if ready.exists() and len(parts) == 8:
    encoded = "".join(part.read_text() for part in parts)
    target = Path("public/mainflow/1_41_m.webm")
    target.write_bytes(base64.b64decode(encoded))
    for part in parts:
        part.unlink()
    ready.unlink()
    print("film", target.stat().st_size)
