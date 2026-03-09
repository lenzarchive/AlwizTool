const express = require('express');
const router = express.Router();

// Banner ads: use highperformanceformat.com + atOptions + invoke.js (document.write pattern)
const BANNER_CONFIGS = {
  banner728: { width: 728, height: 90,  envKey: 'ADS_ZONE_728'  },
  banner300: { width: 300, height: 250, envKey: 'ADS_ZONE_300'  },
};

const CSP_PERMISSIVE = "default-src 'self'; script-src 'unsafe-inline' 'unsafe-eval' https: http:; style-src 'unsafe-inline'; frame-src https: http:; connect-src https: http:; img-src https: http: data:;";

// Banner ads (highperformanceformat.com — document.write pattern)
router.get('/:type(banner728|banner300)', (req, res) => {
  const cfg = BANNER_CONFIGS[req.params.type];
  const key = process.env[cfg.envKey];
  if (process.env.ADS_ENABLED !== 'true' || !key) return res.status(204).end();

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>* { margin:0; padding:0; } body { overflow:hidden; background:transparent; }</style>
</head>
<body>
<script>atOptions = { 'key': '${key}', 'format': 'iframe', 'height': ${cfg.height}, 'width': ${cfg.width}, 'params': {} };</script>
<script src="https://www.highperformanceformat.com/${key}/invoke.js"></script>
</body>
</html>`;

  res.setHeader('Content-Security-Policy', CSP_PERMISSIVE);
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.type('html').send(html);
});

// Native ad (effectivegatecpm.com — container div pattern)
// ADS_ZONE_NATIVE = zone key, e.g. fffa01192d65984daf52923c34e2f5c0
// ADS_ZONE_NATIVE_SCRIPT = full script src URL, e.g. https://pl28878973.effectivegatecpm.com/fffa01.../invoke.js
router.get('/native', (req, res) => {
  const key = process.env.ADS_ZONE_NATIVE;
  const scriptSrc = process.env.ADS_ZONE_NATIVE_SCRIPT;
  if (process.env.ADS_ENABLED !== 'true' || !key || !scriptSrc) return res.status(204).end();

  const containerId = `container-${key}`;

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>* { margin:0; padding:0; } body { overflow:hidden; background:transparent; }</style>
</head>
<body>
<script async data-cfasync="false" src="${scriptSrc}"></script>
<div id="${containerId}"></div>
</body>
</html>`;

  res.setHeader('Content-Security-Policy', CSP_PERMISSIVE);
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.type('html').send(html);
});

module.exports = router;
