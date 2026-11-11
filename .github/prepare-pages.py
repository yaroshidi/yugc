from pathlib import Path
import base64
import re

Y = """    <svg width=\"38\" height=\"40\" viewBox=\"0 0 469 492\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\">
      <g transform=\"translate(0 492) scale(0.1 -0.1)\">
        <path fill=\"white\" d=\"M176 4890 c-51 -16 -105 -61 -128 -109 -30 -60 -32 -169 -4 -221 44 -82 870 -1262 902 -1288 60 -49 84 -52 460 -52 394 0 401 2 462 76 39 47 52 89 52 170 0 50 -5 69 -33 115 -41 67 -820 1192 -856 1235 -14 18 -44 42 -66 55 -40 24 -41 24 -400 26 -198 1 -373 -2 -389 -7z M3754 4887 c-16 -7 -44 -22 -61 -35 -29 -20 -1760 -2512 -1809 -2602 -18 -34 -19 -74 -19 -1045 l0 -1010 22 -40 c25 -47 64 -85 113 -111 32 -17 62 -19 345 -19 301 0 311 1 351 22 47 25 91 73 111 120 10 26 13 194 13 893 l0 860 891 1291 c490 709 904 1312 921 1340 26 41 31 60 31 109 0 85 -41 163 -107 205 l-49 30 -361 2 c-261 1 -369 -1 -392 -10z\"/>
      </g>
    </svg>"""
PILL = re.compile(r'<svg width="96" height="48"[\s\S]*?</svg>')
FAKE = re.compile(r'<svg width="38" height="40" viewBox="0 0 1416 1490"[\s\S]*?</svg>')

for page in Path("public").glob("*.html"):
    text = page.read_text()
    updated = PILL.sub(Y, text, count=1)
    updated = FAKE.sub(Y, updated, count=1)
    if updated != text:
        page.write_text(updated)
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
