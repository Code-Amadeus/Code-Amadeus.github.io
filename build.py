"""Build the static resource website with Python's standard library only.

Run from any directory: python build.py
Only the explicit website files and two public demo images are copied.
No application build, runtime asset pack, model, or network access is involved.
"""

import json
from pathlib import Path
import shutil
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parent
SOURCE = ROOT
OUTPUT = ROOT / "build" / "site"
MIRRORS = {"baidu", "quark", "mega", "google"}


def build():
    resources = json.loads((SOURCE / "resources.json").read_text(encoding="utf-8"))
    seen = set()
    for resource in resources:
        resource_id = resource["id"]
        if not resource_id or resource_id in seen:
            raise ValueError(f"Missing or duplicate resource id: {resource_id}")
        seen.add(resource_id)
        if resource["category"] not in {"voice", "art"}:
            raise ValueError(f"Unknown category for {resource_id}")
        if resource["visual"] not in {"asr", "voice", "character", "scene", "portrait", "experimental"}:
            raise ValueError(f"Unknown visual for {resource_id}")
        for field in ("title", "description", "detail"):
            for language in ("zh", "en"):
                if not isinstance(resource[field][language], str) or not resource[field][language].strip():
                    raise ValueError(f"Missing {field}/{language} for {resource_id}")
        if set(resource["mirrors"]) != MIRRORS:
            raise ValueError(f"Expected four cloud storage entries for {resource_id}")
        for provider, mirror in resource["mirrors"].items():
            if mirror is None:
                continue
            url = urlparse(mirror["url"])
            if url.scheme != "https" or not url.netloc or url.username or url.password:
                raise ValueError(f"Expected an HTTPS share URL: {resource_id}/{provider}")
            for field in ("code", "archive_password"):
                if field in mirror and not isinstance(mirror[field], str):
                    raise ValueError(f"{field} must be text: {resource_id}/{provider}")

    version = json.loads((SOURCE / "site.json").read_text(encoding="utf-8"))["version"]
    template = (SOURCE / "index.html").read_text(encoding="utf-8")
    # Escape '<' so authored JSON cannot close its script element.
    data = json.dumps(resources, ensure_ascii=False).replace("<", "\\u003c")
    html = template.replace("__AMADEUS_VERSION__", version).replace("__RESOURCE_DATA__", data)
    OUTPUT.mkdir(parents=True, exist_ok=True)
    (OUTPUT / "index.html").write_text(html, encoding="utf-8")
    for name in ("styles.css", "app.js", "favicon.svg"):
        shutil.copyfile(SOURCE / name, OUTPUT / name)
    (OUTPUT / ".nojekyll").touch()
    image_dir = OUTPUT / "assets"
    image_dir.mkdir(exist_ok=True)
    for name in ("character.png", "workspace.jpg"):
        shutil.copyfile(SOURCE / "assets" / name, image_dir / name)
    print(f"Built {len(resources)} resources -> {OUTPUT}")


if __name__ == "__main__":
    build()
