# hexu-phys.github.io
# Personal Website — hexu

This repository hosts my personal academic website, published via GitHub Pages.

Live site: https://hexu-phys.github.io

## What's in here

| File | Purpose |
|------|---------|
| `index.html` | Home page: short bio, contact, links |
| `cv.html` | Full CV (web version) + downloadable PDF |
| `research.html` | Published papers and preprints |
| `projects.html` | Code, datasets, tools |
| `private.html` | **Encrypted page** — unpublished work descriptions |
| `css/style.css` | Shared stylesheet |
| `assets/` | PDFs, images, other static files |
| `README.md` | This file |

## How it works

- Pure static HTML/CSS/JS. No build step required.
- GitHub Pages serves the `main` branch root directly.
- `private.html` is encrypted with [StatiCrypt](https://github.com/robinmoisson/staticrypt) (AES-256). The password is never stored in the repo.

## How to view locally

Option A — just open the file:
    open index.html          # macOS
    start index.html         # Windows

Option B — run a local server (recommended, avoids file:// quirks):
    python3 -m http.server 8000
    # then visit http://localhost:8000

## How to update the encrypted page

1.编辑`private-src.html` (plaintext, **never commit this file**).
2. Run:
       npx staticrypt private-src.html -p "YOUR_PASSWORD" -o private.html
3. Commit only `private.html`.

##部署

Push to `main`. GitHub Pages auto-publishes within ~1 minute.
Settings → Pages → Source: `Deploy from a branch` → `main` / `root`.
