# Wapka Code Helper

Contextual assistant for the Wapka Code Block editor. No dependencies. Vanilla JS. ~250 lines.

## What it does

Floating helper panel that watches what type of code you're editing and offers:

| When you select... | It shows... |
|---|---|
| **TAG Code** (type 1) | All 50 TAG functions, grouped, click-to-insert |
| **Lua Script** (type 29) | All 70+ Lua API functions, click-to-insert |
| **Any other type** | Quick-start templates and type description |
| **Tap [?] on mobile** | Fullscreen helper overlay |

## How to add it

Two lines in your code editor template (`code_form.tpl`):

```html
<link rel="stylesheet" href="//cdn.jsdelivr.net/gh/wapka-web/static-cdn-assets@v2.0.0/wapka-code-helper/wapka-code-helper.css">
<script src="//cdn.jsdelivr.net/gh/wapka-web/static-cdn-assets@v2.0.0/wapka-code-helper/wapka-code-helper.js"
        data-lang="en">
</script>
```

## Files

```
wapka-code-helper/
├── wapka-code-helper.js        Core engine — detection, panel, insertion, events
├── wapka-code-helper.css        Styles — floating button, panel, tabs, mobile
├── data/
│   ├── en.js                    English — types, tags, templates, Lua API
│   ├── hi.js                    Hindi
│   ├── ar.js                    Arabic (RTL)
│   ├── id.js                    Indonesian
│   ├── ur.js                    Urdu
│   └── bn.js                    Bangla
└── README.md
```

## Language

Detects from `data-lang` attribute → `localStorage['wkh-lang']` → `navigator.language` → `en`.

User can switch language from the panel header dropdown. Choice persists in localStorage.

## How it works

### Detection

Finds the editor by looking for existing DOM elements on the code form page:

```javascript
var typeEl  = document.getElementById('typeInput');    // hidden type value
var editor  = document.getElementById('codeContent');   // content textarea
var metaForm = document.querySelector('#metaBody');     // meta fields (optional)
```

If `typeInput` is not found, the helper does nothing. No errors.

### Panel injection

Creates two elements appended to `<body>`:

```html
<button id="wkh-toggle" title="Code Helper">?</button>
<div id="wkh-panel">
    <div id="wkh-header">
        <span id="wkh-type-name">TAG Code</span>
        <select id="wkh-lang">...</select>
        <button id="wkh-close">&times;</button>
    </div>
    <div id="wkh-tabs">
        <button data-tab="quick">Quick</button>
        <button data-tab="tags">Tags</button>
        <button data-tab="lua">Lua API</button>
    </div>
    <div id="wkh-content"></div>
</div>
```

### Tab visibility

| Tab | Visible when |
|---|---|
| Quick | Always |
| Tags | Type = 1 (TAG Code) |
| Lua API | Type = 29 (Script) |

Tabs for other types are hidden. The Quick tab always shows template code for the current type.

### Insertion

Clicks call `insertAtCursor(template)`:

- `█` in the template marks cursor position after insertion
- If text is selected in the editor, wraps it (for block tags like `{{IFSET}}...{{END}}`)
- Editor regains focus after insertion

### Mobile

```
Default: floating [?] button (bottom-right, 42px circle, brand color)
Tap: panel opens fullscreen (100vw × 100vh), backdrop behind, close button top-right
Desktop: panel slides in from right (300px), editor shifts left
```

### Keyboard

| Key | Action |
|---|---|
| `?` | Toggle panel |
| `Esc` | Close panel |

`data-keyboard="false"` disables keyboard shortcuts.

## Data file format

Each language file sets `window.__WKH_DATA`:

```javascript
window.__WKH_DATA = {
  types: {
    0: { n: 'Code',        d: 'Raw HTML, no tag processing.',              t: '<!-- HTML here -->' },
    1: { n: 'TAG Code',    d: 'Dynamic content with {{TAG()}} macros.',     t: '{{USER COUNT}} users online' },
    7: { n: 'User Login',  d: 'Login form with authentication.',            t: '#REDIRECT_URL#index' },
    29:{ n: 'Lua Script',  d: 'Server-side Lua execution.',                 t: 'print("Hello from Lua")' }
  },
  tags: {
    'VAR':    { n: 'Get variable',       d: 'Read stored variable.',         t: '{{VAR(█)}}',     g: 'Data' },
    'IFSET':  { n: 'If set',             d: 'Conditional block.',             t: '{{IFSET(█)}}\n{{END}}', g: 'Conditionals', m: true },
    // ... 50 tags total
  },
  lua: {
    'print':           { n: 'Print output',        d: 'Add text to page output.',      t: 'print("█")',           g: 'Output' },
    'api.user_info':   { n: 'Get user info',        d: 'Fetch user by ID or username.', t: 'api.user_info({█})',   g: 'Users' },
    'server.template': { n: 'Serve template',        d: 'Serve static file from ZIP.',  t: 'server.template("█")', g: 'Server' },
    // ... 70+ Lua functions total
  }
};
```

| Key | Meaning |
|---|---|
| `n` | Display name |
| `d` | Description |
| `t` | Insertion template. `█` = cursor position |
| `g` | Group (for categorized display) |
| `m` | Multi-line (wraps selection instead of cursor insert) |

## Groups for TAG display

```
Data            — VAR, GET, POST, REQUEST, COOKIE, VALUE, DATE, INT, NULL
Transform       — UPPER, LOWER, TRIM, CHOP, REPLACE, CUT, ADD, APPEND
Math            — PLUS, MINUS, MULTIPLY, DIVIDE, LENGTH, RANDOM
Encode/Decode   — HTML_ENCODE, HTML_DECODE, BASE64_ENCODE, BASE64_DECODE, URL_ENCODE, URL_DECODE, JSON_ENCODE, JSON_DECODE
Tags            — REMOVE_TAG, SLUG, DATA
Conditionals    — IFSET, IFNOT, IFEQ, IFNE, IFGE, IFLE, IFLIKE, IFIN, IFMATCH, OR, THEN, ELSE, END
Storage         — SET, SAVE
Control         — STOP, GOTO, PAGING
```

## Groups for Lua display

```
Output          — print, dump, server.send, server.template
Server          — server.timezone, server.time, server.date, server.header, server.terminate, server.error, server.delay, server.log
HTTP            — getServer.request, getServer.body, getServer.env
URL             — url.encode, url.decode, url.parse, url.build, url.slug, url.redirect, url.rewrite, url.map
Encoder/Decoder — encoder.json, encoder.base64, encoder.url, decoder.json, decoder.base64, decoder.url
Hash            — hash.md5, hash.sha1, hash.sha256, hash.sha512, hash.crc32
HTML            — html.doctype, html.headtag, html.title, html.escape, html.unescape, html.strip_tags, html.render_tag, html.render_bbcode, html.paging
API             — api.user_create, api.user_info, api.user_login, api.user_online, api.user_edit, api.message_create, api.message_info, api.message_edit, api.forum_create, api.forum_info, api.forum_edit, api.post_create, api.post_info, api.post_edit, api.folder_create, api.folder_info, api.folder_edit, api.file_create, api.file_info, api.file_edit, api.data_create, api.data_info, api.data_edit, api.youtube_api
Proxy           — proxy.pass
```

## Browser support

| Feature | Requires |
|---|---|
| Core (panel, tabs, insertion) | ES5 — IE11+, all modern browsers |
| `data-lang` auto-detection | `navigator.language` (IE11+) |
| localStorage language persist | `localStorage` (IE8+) |
| CSS grid for tabs | IE11+ (with prefixes via autoprefixer) |

## No build step

JavaScript is shipped as-is. No webpack, no npm, no bundler. Data files are plain `.js` that set a global variable. CSS is plain `.css`. Edit → push → works.

## Versioning

```
@v2.0.0  →  production (tagged, immutable)
@main     →  development only
```

## Contributing translations

Copy `data/en.js` to `data/{locale}.js`. Translate `n` (name) and `d` (description) fields. Do NOT translate `t` (template) or `g` (group) fields. Test with `data-lang="{locale}"` on the script tag.

## License

MIT
