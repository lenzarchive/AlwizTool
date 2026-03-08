const express = require('express');
const router = express.Router();
const { hashAll } = require('../utils/hash');
const { fetchOGData } = require('../utils/opengraph');
const QRCode = require('qrcode');

router.post('/hash', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }
    if (text.length > 100000) {
      return res.status(400).json({ error: 'Text too large (max 100KB)' });
    }
    const result = hashAll(text);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/opengraph', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL is required' });
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch {
      return res.status(400).json({ error: 'URL tidak valid' });
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return res.status(400).json({ error: 'Hanya HTTP/HTTPS yang diizinkan' });
    }

    const data = await fetchOGData(url);
    res.json({ success: true, data });
  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(408).json({ error: 'Request timeout. URL tidak dapat diakses.' });
    }
    res.status(500).json({ error: `Gagal mengambil data: ${err.message}` });
  }
});

router.post('/qrcode', async (req, res) => {
  try {
    const { text, size = 300, format = 'png' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }
    if (text.length > 2000) {
      return res.status(400).json({ error: 'Text too long for QR code' });
    }

    const qrSize = Math.min(Math.max(parseInt(size) || 300, 100), 800);

    if (format === 'svg') {
      const svg = await QRCode.toString(text, { type: 'svg', width: qrSize, margin: 2 });
      res.json({ success: true, data: svg, format: 'svg' });
    } else {
      const dataUrl = await QRCode.toDataURL(text, { width: qrSize, margin: 2, errorCorrectionLevel: 'M' });
      res.json({ success: true, data: dataUrl, format: 'png' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
