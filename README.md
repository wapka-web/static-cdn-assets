# Public CDN Assets

Centralized static asset hosting for multiple frontend projects using GitHub + jsDelivr.

This repository stores public JavaScript, CSS, images, fonts, and other static files that are consumed by web apps through CDN URLs.

## Goal

- Keep assets organized by project to avoid naming collisions.
- Ship immutable, cache-safe production assets using Git tags.
- Allow simple rollout and rollback by changing only the version in URLs.

## Repository Layout

Assets are grouped by project at the repository root.

```text
.
├── ayro/
├── payui/
├── sb-admin/
├── skote/
└── README.md
```

Inside each project folder, organize files by type (for example `js/`, `css/`, `images/`, `fonts/`).

Example:

```text
payui/
├── css/
│   └── app.css
├── js/
│   └── app.js
└── images/
    └── logo.png
```

## Rules for Contributions

- Add files only under an existing project folder.
- Use lowercase names with hyphens (`user-profile.js`, `main-theme.css`).
- Do not commit private or sensitive data (keys, tokens, `.env` files, credentials).
- Keep assets production-ready (minified where appropriate, optimized images).

## Versioning Strategy

Use Git tags for production releases.

Why tags:

- URLs that reference a tag are immutable.
- CDN/browser caching is safe and predictable.
- Rollback is easy by switching back to an older tag.

Release flow:

```bash
git tag v1.0.0
git push origin v1.0.0
```

You can also create a GitHub Release for the same tag.

## CDN URL Patterns

Assets are served through jsDelivr:

```text
https://cdn.jsdelivr.net/gh/<org>/<repo>@<version>/<path-to-asset>
```

For this repo:

```text
https://cdn.jsdelivr.net/gh/wapka-web/static-cdn-assets@v1.0.0/skote/assets/js/app.js
```

### Production (recommended)

Always use a fixed tag such as `@v1.0.0`.

```html
<script src="https://cdn.jsdelivr.net/gh/wapka-web/static-cdn-assets@v1.0.0/skote/assets/js/app.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/wapka-web/static-cdn-assets@v1.0.0/sb-admin/css/styles.css">
<img src="https://cdn.jsdelivr.net/gh/wapka-web/static-cdn-assets@v1.0.0/payui/images/servers.svg" alt="Logo">
```

### Development or QA

You may use `@main` while testing active changes, but never use it in production.

```html
<script src="https://cdn.jsdelivr.net/gh/wapka-web/static-cdn-assets@main/skote/assets/js/app.js"></script>
```

## Quick Checklist Before Merging

- File path is under the correct project folder.
- Filenames follow lowercase + hyphen naming.
- No secrets or private config included.
- Production references in apps use a tag, not `main`.
