# AlwizTool

All-in-one free tools for developers and everyday users. No sign-up, no tracking.

Live: [alwiztool.my.id](https://alwiztool.my.id)

---

## Tools

| Tool | Category |
|------|----------|
| Base64 Encode/Decode | Encoding |
| URL Encoder/Decoder | Encoding |
| Hash Generator | Security |
| JWT Decoder | Security |
| JSON Formatter | Formatter |
| UUID Generator | Generator |
| Password Generator | Generator |
| Regex Tester | Developer |
| Timestamp Converter | Converter |
| Color Converter | Converter |
| Text Analyzer | Text |
| QR Code Generator | Generator |
| Open Graph Checker | Web |

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
npm run build:css   # build Tailwind output
npm start           # or: npm run dev (nodemon + css watch)
```

Dev mode requires `concurrently` and `nodemon` (devDependencies).

---

## Structure

```
alwiztool/
├── locales/          # en.json, id.json
├── public/
│   ├── css/          # compiled style.css goes here
│   └── js/
│       ├── app.js
│       └── modules/  # per-tool JS
├── src/
│   ├── css/input.css
│   ├── middleware/
│   └── routes/
├── views/
│   ├── partials/
│   └── tools/
└── server.js
```

---

## i18n

Supports English (`en`) and Indonesian (`id`). Language is set via `?lang=en` or `?lang=id` query param and stored in a cookie.

The `t` object works both as a function (`t('nav.home')`) and as a plain object (`t.nav.home`) — both styles work in templates.

---

## Adding a tool

1. Add an entry to `tools` array in `src/routes/index.js`
2. Add locale keys to `locales/en.json` and `locales/id.json` under `tools`
3. Create `views/tools/your-slug.ejs`
4. Create `public/js/modules/your-tool.js` if needed
5. If the tool needs server-side logic, add an endpoint to `src/routes/api.js`

---

Built by [AlwizBA](https://alwiztool.my.id)
