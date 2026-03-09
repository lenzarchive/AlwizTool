const express = require('express');
const router = express.Router();
const { hashAll, hashAllHmac } = require('../utils/hash');
const { fetchOGData } = require('../utils/opengraph');
const QRCode = require('qrcode');

const IS_PROD = process.env.NODE_ENV === 'production';
const GENERIC_ERROR = 'Internal server error';

// SSRF protection: block private/loopback IP ranges
function isPrivateHostname(hostname) {
  // Strip IPv6 brackets
  const host = hostname.replace(/^\[|\]$/g, '').toLowerCase();

  // Loopback & localhost
  if (host === 'localhost' || host === '::1') return true;

  // IPv4 checks
  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const [, a, b, c] = ipv4.map(Number);
    if (a === 127) return true;                          // 127.x.x.x
    if (a === 10) return true;                           // 10.x.x.x
    if (a === 192 && b === 168) return true;             // 192.168.x.x
    if (a === 172 && b >= 16 && b <= 31) return true;   // 172.16–31.x.x
    if (a === 169 && b === 254) return true;             // 169.254.x.x (link-local)
    if (a === 0) return true;                            // 0.x.x.x
  }

  // IPv6 private ranges (basic)
  if (host.startsWith('fc') || host.startsWith('fd')) return true; // ULA
  if (host.startsWith('fe80')) return true;                         // link-local

  return false;
}

router.post('/hash', async (req, res) => {
  try {
    const { text, hmacKey } = req.body;
    if (!text || typeof text !== 'string') return res.status(400).json({ error: 'Text is required' });
    if (text.length > 100000) return res.status(400).json({ error: 'Text too large (max 100KB)' });
    const result = hmacKey ? hashAllHmac(text, hmacKey) : hashAll(text);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('[/api/hash]', err);
    res.status(500).json({ error: IS_PROD ? GENERIC_ERROR : err.message });
  }
});

router.post('/opengraph', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') return res.status(400).json({ error: 'URL is required' });

    let parsedUrl;
    try { parsedUrl = new URL(url); } catch { return res.status(400).json({ error: 'Invalid URL' }); }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return res.status(400).json({ error: 'Only HTTP/HTTPS allowed' });
    }

    // [SECURITY] Block SSRF — reject private/loopback hosts
    if (isPrivateHostname(parsedUrl.hostname)) {
      return res.status(400).json({ error: 'URL not allowed' });
    }

    const data = await fetchOGData(url);
    res.json({ success: true, data });
  } catch (err) {
    console.error('[/api/opengraph]', err);
    if (err.name === 'AbortError') return res.status(408).json({ error: 'Request timeout.' });
    res.status(500).json({ error: IS_PROD ? GENERIC_ERROR : `Failed to fetch: ${err.message}` });
  }
});

router.post('/qrcode', async (req, res) => {
  try {
    const { text, size = 300, format = 'png' } = req.body;
    if (!text || typeof text !== 'string') return res.status(400).json({ error: 'Text is required' });
    if (text.length > 2000) return res.status(400).json({ error: 'Text too long for QR code' });
    const qrSize = Math.min(Math.max(parseInt(size) || 300, 100), 800);
    if (format === 'svg') {
      const svg = await QRCode.toString(text, { type: 'svg', width: qrSize, margin: 2 });
      res.json({ success: true, data: svg, format: 'svg' });
    } else {
      const dataUrl = await QRCode.toDataURL(text, { width: qrSize, margin: 2, errorCorrectionLevel: 'M' });
      res.json({ success: true, data: dataUrl, format: 'png' });
    }
  } catch (err) {
    console.error('[/api/qrcode]', err);
    res.status(500).json({ error: IS_PROD ? GENERIC_ERROR : err.message });
  }
});

module.exports = router;
