from pathlib import Path
import re

COMPANY = "Yar Innovative Solutions FZCO"
ADDRESS = "A2 Building, IFZA Business Park, Silicon Oasis, Dubai, UAE"
EMAIL = "yar@yar.website"
SITE = "https://yaroshidi.github.io/yugc/"

REPLACEMENTS = [
    (
        '<span class="c15 c13">E</span><span class="c15 c13">LVALABS LTD (&ldquo;We&rdquo;, &ldquo;Us&rdquo;, &ldquo;Company&rdquo;)',
        f'<span class="c15 c13">{COMPANY} (&ldquo;We&rdquo;, &ldquo;Us&rdquo;, &ldquo;Company&rdquo;)',
    ),
    (
        "ELVALABS LTD, a company incorporated under the laws of Cyprus (registration number HE&nbsp;483720)",
        COMPANY,
    ),
    (
        "ELVALABS LTD, a company incorporated under the laws of Cyprus with the registered address at 13 Kypranoros Street, EVI Building, 2nd Floor, Office 201, 1061, Nicosia, Cyprus,",
        f"{COMPANY}, with the registered address at {ADDRESS},",
    ),
    (
        "or at Elvalabs LTD, registered address: 13 Kypranoros Street, EVI Building, 2nd Floor, Office 201,1061 Nicosia, Cyprus",
        f"or at {COMPANY}, registered address: {ADDRESS}",
    ),
    (
        '<span class="c13">ELVALABS</span><span class="c0">&nbsp;LTD, registered address: 13 Kypranoros Street, EVI Building, 2nd Floor, Office 201,1061 Nicosia, Cyprus.',
        f'<span class="c13">{COMPANY}</span><span class="c0">, registered address: {ADDRESS}.',
    ),
    (
        '<a class="c8" href="https://www.google.com/url?q=http://elva-labs.com&amp;sa=D&amp;source=editors&amp;ust=1771404955370732&amp;usg=AOvVaw2HkGeL2GVa3BMjK3ur7B9p">elva-labs.com</a>',
        f'<a class="c8" href="{SITE}">yaroshidi.github.io/yugc</a>',
    ),
    (
        '<a class="c27" href="https://www.google.com/url?q=https://elva-labs.com/&amp;sa=D&amp;source=editors&amp;ust=1771404461094920&amp;usg=AOvVaw12DKZwhMH5aQzpbiHXJ7YW">https://elva-labs.com/</a>',
        f'<a class="c27" href="{SITE}">https://yaroshidi.github.io/yugc/</a>',
    ),
    ("Elvalabs LTD", COMPANY),
    ("support@elva-labs.com", EMAIL),
    ("HR@elva-labs.com", EMAIL),
    ("ELVA Terms of Use", "YUGC Terms of Use"),
    ("ELVA Privacy Policy", "YUGC Privacy Policy"),
]

TELEGRAM = re.compile(
    r'\s*<div class="careers-contact__item">\s*<span class="careers-contact__label">Telegram:</span>.*?</div>',
    re.S,
)

root = Path("public")
for name in ("terms-of-use.html", "privacy-policy.html", "careers.html"):
    path = root / name
    text = path.read_text()
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    text = TELEGRAM.sub("", text, count=1)
    if "elva" in text.lower() or "lvalabs" in text.lower():
        raise SystemExit(f"Elva remains in {name}")
    path.write_text(text)
    print("rewrote", name)
