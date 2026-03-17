# Contributing to AlwizTool

Thanks for taking the time to contribute. Here is everything you need to know before opening a PR.

---

## License Agreement

By submitting a pull request, you agree that your contribution will be licensed under the same [Apache 2.0 License](./LICENSE) that covers this project. You are not entitled to any form of compensation, revenue share, or claim over the project — including ad revenue — as a result of your contribution.

If you are not comfortable with this, please do not submit a PR.

---

## What you can contribute

- New tools
- Bug fixes
- UI/UX improvements
- i18n translations (English and Indonesian are the primary languages)
- Documentation improvements

If you are planning something big, open an issue first so we can discuss it before you spend time building it.

---

## Adding a new tool

Follow the existing pattern:

1. Add an entry to the `tools` array in `src/config/tools.js`

```js
{ slug: 'your-slug', i18nKey: 'yourToolKey', icon: 'ICN', category: 'Category' }
```

2. Add translation keys to both `locales/en.json` and `locales/id.json` under `tools`:

```json
"yourToolKey": {
  "name": "Tool Name",
  "desc": "Short description shown on the homepage.",
  "title": "Tool Name",
  "subtitle": "Slightly longer subtitle shown on the tool page."
}
```

3. Create `views/tools/your-slug.ejs` for the UI
4. Create `public/js/modules/your-slug.js` for the client-side logic

The route is handled automatically — no need to touch `src/routes/index.js`.

Keep the JS module self-contained and client-side only. If the tool genuinely needs server-side logic, add an endpoint to `src/routes/api.js` and explain why in your PR description.

---

## Code style

- Vanilla JS only — no frontend frameworks
- No external CDN dependencies unless absolutely necessary (and if you do, use `cdnjs.cloudflare.com` since it is already whitelisted in the CSP)
- Keep each tool's JS isolated in its own module file
- Follow the existing EJS structure — look at a few existing tools before writing a new one
- No minification in source files, that is handled at build time

---

## Pull request checklist

Before opening a PR, make sure:

- [ ] The tool works in both light and dark mode
- [ ] Translation keys exist in both `en.json` and `id.json`
- [ ] No hardcoded secrets, API keys, or personal data
- [ ] The tool entry is added to `src/config/tools.js`
- [ ] Tested locally with `npm run dev`

---

## Running locally

```bash
npm install
npm run setup
npm run dev
```

See the README for more details on environment variables.

---

## Reporting bugs

Open an issue with a clear description of the problem, steps to reproduce, and what you expected to happen. Screenshots help.

---

Built and maintained by [AlwizBA](https://ubegui.my.id)
