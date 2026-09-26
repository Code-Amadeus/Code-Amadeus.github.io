# Code Amadeus Website & Resource Library

Standalone website: **https://code-amadeus.github.io/**

Maintained independently of the [Amadeus desktop application](https://github.com/Code-Amadeus/Amadeus).
The site provides a bilingual project introduction, demo links, source setup guidance,
and a catalog of voice, character, and scene resources. It does not build or distribute desktop installers.

## Adding resource links

Edit **`resources.json`** in the repository root. Each resource has four cloud storage entries:

| Key | Service |
| --- | --- |
| `baidu` | Baidu Pan |
| `quark` | Quark Pan |
| `mega` | MEGA |
| `google` | Google Drive |

A `null` value means no link is available; the site displays a non-clickable "Coming soon" placeholder.
Once you have a real share link, replace the corresponding entry with:

```json
"baidu": {
  "url": "https://pan.baidu.com/s/YOUR_SHARE_LINK",
  "code": "YOUR_ACCESS_CODE"
}
```

Omit `code` if no access code is required. For MEGA, preserve the full link, including
the decryption key after `#`. Use HTTPS URLs and keep unavailable entries as `null`.
Resource cards update their availability status automatically when links are added.

Each `title`, `description`, and `detail` contains Chinese (`zh`) and English (`en`) text.
Set `category` to `voice` or `art`; each `id` should match a resource pack supported by the application.
See the application's [external asset bundle documentation](https://github.com/Code-Amadeus/Amadeus/blob/main/docs/external_asset_bundles.md)
for resource contracts and installation details.

## Editing content and version information

- `index.html`: page structure, Chinese copy, and rights notices.
- `app.js`: English copy, resource filtering, and download link rendering.
- `styles.css`: desktop and mobile layouts.
- `site.json`: the application version displayed on the site; update it to reflect application releases.
- `resources.json`: resource descriptions and cloud storage links.

## Local preview

Requires Python 3.10+ and uses only the standard library. No application installation or npm dependencies are needed.

```powershell
python build.py
python -m http.server 4173 --bind 127.0.0.1 --directory build/site
```

Open http://127.0.0.1:4173. Rebuild and refresh after making changes.
The build includes only the explicitly listed site files, resource catalog, and two demonstration images.
It does not copy models or runtime asset packs.

## Deployment

Pushing to `main` automatically builds and deploys the site to GitHub Pages through GitHub Actions.
You can also run the **Website Pages** workflow manually from the Actions tab.
In repository Settings → Pages, set Source to **GitHub Actions**.
Deployment does not run the application's test suite, build Electron, or publish desktop installers.

## License and demonstration assets

First-party website code is licensed under AGPL-3.0; see `LICENSE`.
Characters, voices, models, original-work content, and demonstration media retain their respective rights.
The code license does not grant permission to use or redistribute those assets.
See [assets/README.md](assets/README.md) for asset provenance. The resource section also includes
Chinese and English notices covering Kurisu-related character and voice content.
