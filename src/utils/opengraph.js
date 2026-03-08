const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function fetchOGData(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'AlwizTool/1.0 OG Checker (+https://alwiztool.my.id)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
      size: 500000,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const getMeta = (property) =>
      $(`meta[property="${property}"]`).attr('content') ||
      $(`meta[name="${property}"]`).attr('content') || null;

    return {
      url,
      title: getMeta('og:title') || $('title').text().trim() || null,
      description: getMeta('og:description') || getMeta('description') || null,
      image: getMeta('og:image') || null,
      type: getMeta('og:type') || null,
      siteName: getMeta('og:site_name') || null,
      twitterCard: getMeta('twitter:card') || null,
      twitterTitle: getMeta('twitter:title') || null,
      twitterDescription: getMeta('twitter:description') || null,
      twitterImage: getMeta('twitter:image') || null,
      canonical: $('link[rel="canonical"]').attr('href') || null,
      themeColor: getMeta('theme-color') || null,
    };
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

module.exports = { fetchOGData };
