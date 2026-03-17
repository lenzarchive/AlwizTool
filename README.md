# AlwizTool

All-in-one free tools for developers and everyday users. No sign-up, no tracking, no nonsense.

Live: [ubegui.my.id](https://ubegui.my.id)

---

## Tools

### Encoding
| Tool | Slug |
|------|------|
| Base64 Encode/Decode | `/tools/base64` |
| URL Encoder/Decoder | `/tools/url-codec` |
| HTML Entity Encode/Decode | `/tools/html-entity` |
| Image to Base64 | `/tools/image-to-base64` |
| Hex Encode/Decode | `/tools/hex-codec` |
| Percent (URI) Encoding | `/tools/percent-encode` |

### Security
| Tool | Slug |
|------|------|
| Hash Generator | `/tools/hash` |
| JWT Decoder | `/tools/jwt-decoder` |
| TOTP Generator | `/tools/totp` |
| CSP Header Builder | `/tools/csp-builder` |

### Formatter
| Tool | Slug |
|------|------|
| JSON Formatter | `/tools/json-formatter` |
| XML Formatter | `/tools/xml-formatter` |
| SQL Formatter | `/tools/sql-formatter` |
| Markdown Preview | `/tools/markdown-preview` |
| YAML Formatter | `/tools/yaml-formatter` |
| TOML Formatter | `/tools/toml-formatter` |

### Generator
| Tool | Slug |
|------|------|
| UUID Generator | `/tools/uuid` |
| Password Generator | `/tools/password` |
| Lorem Ipsum | `/tools/lorem-ipsum` |
| QR Code Generator | `/tools/qrcode` |
| Nano ID Generator | `/tools/nano-id` |
| Fake Data Generator | `/tools/fake-data` |

### Developer
| Tool | Slug |
|------|------|
| Regex Tester | `/tools/regex` |
| Cron Expression | `/tools/cron` |
| String Escape | `/tools/string-escape` |
| chmod Calculator | `/tools/chmod` |
| .env Parser | `/tools/env-parser` |
| .gitignore Generator | `/tools/gitignore` |

### Converter
| Tool | Slug |
|------|------|
| Timestamp Converter | `/tools/timestamp` |
| Color Converter | `/tools/color` |
| Number Base Converter | `/tools/number-base` |
| CSV to JSON | `/tools/csv-json` |
| Unit Converter | `/tools/unit-converter` |
| CSS Unit Converter | `/tools/css-unit` |

### Text
| Tool | Slug |
|------|------|
| Text Analyzer | `/tools/text` |
| Text Diff | `/tools/diff` |
| Case Converter | `/tools/case-converter` |
| Slug Generator | `/tools/slug-generator` |

### Web
| Tool | Slug |
|------|------|
| Open Graph Checker | `/tools/opengraph` |
| HTTP Status Codes | `/tools/http-status` |
| HTML Meta Tag Generator | `/tools/meta-tag` |

---

## Stack

- Node.js + Express
- EJS templates
- Tailwind CSS
- Vanilla JS (no frontend framework)

---

## Running locally

```bash
npm install
npm run setup   # download fonts + build Tailwind CSS
npm start       # production mode
```

For development with auto-reload:

```bash
npm run dev     # nodemon + Tailwind watch (runs concurrently)
```

Copy `.env.example` to `.env` and adjust before starting:

```bash
cp .env.example .env
```

Key env vars:

| Variable | Default | Notes |
|----------|---------|-------|
| `PORT` | `3000` | Port the server listens on |
| `NODE_ENV` | `production` | Set to `development` to disable HSTS and relax CORS |
| `SITE_URL` | — | Used for sitemap and canonical tags |
| `CORS_ORIGIN` | — | Allowed origin in production, ignored in dev |

---

## Structure

```
alwiztool/
├── locales/          # en.json, id.json
├── public/
│   ├── css/          # compiled style.css goes here
│   └── js/
│       ├── app.js
│       └── modules/  # one file per tool
├── src/
│   ├── config/
│   │   └── tools.js  # master list of all tools
│   ├── css/
│   │   └── input.css
│   ├── middleware/
│   └── routes/
├── views/
│   ├── partials/
│   └── tools/        # one .ejs file per tool
└── server.js
```

---

## i18n

Supports English (`en`) and Indonesian (`id`). Language is set via `?lang=en` or `?lang=id` and stored in a cookie.

The `t` object works both as a function (`t('nav.home')`) and as a plain object (`t.nav.home`) — both are fine inside templates.

---

## Adding a tool

1. Add an entry to the `tools` array in `src/config/tools.js`
2. Add translation keys to `locales/en.json` and `locales/id.json` under the `tools` object
3. Create `views/tools/your-slug.ejs`
4. Create `public/js/modules/your-slug.js` for client-side logic
5. If the tool needs server-side work, add an endpoint to `src/routes/api.js`

The route is automatically handled by the wildcard in `src/routes/index.js` — no need to register it manually.

---

## License

This script is licensed under the Apache License 2.0. See the `LICENSE` file for more details.

---

Built by [AlwizBA](https://alwizba.pages.dev)
