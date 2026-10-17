# Personal website — Xu He

Source for my academic website, published with GitHub Pages at
<https://hexu-phys.github.io>.

The site is a **research project portfolio** rather than a publication list. It
describes the research area, methods, tools, and my own contribution for each
project, together with figures that can be shared publicly. Work that is not yet
released is described only at that level; anything more specific is available on
request.

## Structure

| Path | Purpose |
|------|---------|
| `index.html` | Home: short bio, degrees, research interests, and contact details |
| `projects/index.html` | Project overview: two current projects in theoretical soft matter |
| `projects/<slug>/index.html` | One page per project: question, approach, contribution, and the write-up |
| `projects/<slug>/paper.pdf` | The project write-up. **Fixed filename**: replace it in place to update the draft |
| `cv/index.html` | Web CV, with a link to the PDF |
| `copyright/index.html` | Copyright and terms of use (site, personal information, drafts) |
| `notes/index.html` | Short technical notes and method explainers (temporarily hidden) |
| `research/` | Research section (temporarily hidden; pages left untouched) |
| `css/style.css` | The only stylesheet; all design tokens live in `:root` |
| `js/main.js` | The only script (copy-to-clipboard plus a navigation fallback) |
| `assets/` | CV PDF, project PDFs, SVG figures, self-contained animations |
| `tools/` | Local check scripts (development only, not referenced by any page) |
| `NOTES.zh.md` | Maintenance manual (Chinese) |
| `favicon.svg`, `favicon.ico` | Site icons |
| `robots.txt`, `sitemap.xml` | Crawling and indexing |

## How it works

- Plain HTML5, CSS3, and vanilla JavaScript. **No build step, no package
  manager, no CDN, no trackers.**
- All internal links are relative, so `index.html` also works when opened
  directly from disk with `file://`, with the same navigation, styling, and
  content as when served over HTTP. Inline PDF viewing and embedded animations
  may differ between the two, because browsers apply different security policies
  to `file://` pages.
- The design is a single 760 px column, with system font stacks only and no
  remote font loading.
- JavaScript is optional: with scripting disabled, navigation, collapsible
  notes, and every download link still work.
- Interactive figures live in `assets/anim/` as self-contained HTML files and are
  embedded with `<iframe sandbox="allow-scripts">` (no `allow-same-origin`, no
  `allow-top-navigation`).

## Viewing locally

Option A — open the file directly:

```
start index.html
```

Option B — serve the directory and browse <http://localhost:8000>:

```
cd hexu-phys.github.io
python3 -m http.server 8000
```

Any static server works. With Node.js installed, `tools/serve-and-verify.mjs`
starts a temporary server and checks that every page and asset responds:

```
node tools/serve-and-verify.mjs 8123
```

## Checks

Four development-only scripts (no dependencies, not referenced by any page):

| Script | What it checks |
|--------|----------------|
| `node tools/check-site.mjs` | Git merge-conflict markers in any code file, broken links, orphan pages, `<head>` completeness, Chinese text leaking into visitor-visible copy, absolute internal paths, accessibility attributes, and `sitemap.xml` coverage |
| `node tools/lint-scripts.mjs` | Syntax of every inline script, the numerical behaviour of the animation code, and that animation pages have no external references |
| `node tools/serve-and-verify.mjs [port]` | Serves the site and requests every route, asset, and a known-404 path |
| `node tools/check-deploy.mjs` | Fetches the live site and compares every public route byte-for-byte with the local file, and reports conflict markers in the deployed copy. Run it **after** pushing. |

## Before deploying

Run `node tools/check-site.mjs` and `node tools/serve-and-verify.mjs`. The first
one fails if a merge conflict was left in a file, which is exactly how the site
was broken once: resolving a conflict in the GitHub web editor and committing
without removing the `<<<<<<<` / `=======` / `>>>>>>>` lines. Never commit those
lines, and never use the web conflict editor for this repository.

## Legacy pages

`cv.html`, `project.html`, and `private.html` predate this structure. They are
kept as no-index redirect or notice pages so that older links do not break, and
they are not part of the navigation (their entry point on the home page has been
removed, so nothing on the site links to them any more).

## Temporarily hidden sections

The Research and Notes sections are not finished yet, so they are currently left
out of the navigation on the home page, the projects page, and the CV page, they
are not listed in `sitemap.xml`, and every page under `research/` and `notes/`
carries `<meta name="robots" content="noindex, nofollow">` so that the
placeholder text cannot be indexed. The pages themselves are unchanged and still
exist; removing that meta tag, re-adding the two `<li>` entries to the
navigation, restoring their `<loc>` entries in the sitemap, and dropping the
`HIDDEN_PAGES` rule in `tools/check-site.mjs` is enough to show them again.

## Updating a project write-up

Replace `projects/<slug>/paper.pdf` with the new PDF, keeping that exact filename.
Both the download link and the inline viewer on the project page point at it, so
nothing in the HTML has to change.

## Copyright and reuse

Everything here is © 2026 Xu He and published for reading, not for commercial
reuse: the site itself, the personal information it contains, and the unpublished
research drafts. The full statement is at `copyright/index.html`
(<https://hexu-phys.github.io/copyright/>) and is linked from the footer of every
public page. Reuse requires written permission.

## Deployment

GitHub Pages serves the `main` branch root directly
(Settings → Pages → Source: *Deploy from a branch* → `main` / `root`).
Push to `main` and the site rebuilds automatically.

## Notes on content

`NOTES.zh.md` is the maintenance manual: how to add a project, a publication, an
animation, or a figure; how to preview and deploy; the full list of placeholders;
and the list of unpublished-work items that need explicit approval before they
can appear on the site.
