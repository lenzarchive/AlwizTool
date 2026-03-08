/**
 * Fetch Open Graph data using open-graph-scraper (v6, ESM).
 * We use dynamic import() since this project is CommonJS.
 */
async function fetchOGData(url) {
  // Dynamic import for ESM package in CJS context
  const { default: ogs } = await import('open-graph-scraper');

  const { error, result } = await ogs({
    url,
    timeout: 10000,
    fetchOptions: {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
      }
    }
  });

  if (error) {
    throw new Error(result.error || 'Failed to fetch page');
  }

  // ogImage is an array in v6
  const ogImageUrl  = Array.isArray(result.ogImage)  ? result.ogImage[0]?.url  : result.ogImage  || null;
  const twImageUrl  = Array.isArray(result.twitterImage) ? result.twitterImage[0]?.url : result.twitterImage || null;

  return {
    url,
    title:              result.ogTitle       || result.twitterTitle || null,
    description:        result.ogDescription || result.twitterDescription || null,
    image:              ogImageUrl,
    imageWidth:         Array.isArray(result.ogImage) ? result.ogImage[0]?.width  : null,
    imageHeight:        Array.isArray(result.ogImage) ? result.ogImage[0]?.height : null,
    type:               result.ogType        || null,
    siteName:           result.ogSiteName    || null,
    favicon:            result.favicon       || null,
    charset:            result.charset       || null,
    twitterCard:        result.twitterCard   || null,
    twitterTitle:       result.twitterTitle  || null,
    twitterDescription: result.twitterDescription || null,
    twitterImage:       twImageUrl,
    twitterSite:        result.twitterSite   || null,
    canonical:          result.ogUrl         || url,
    themeColor:         result.themeColor    || null,
  };
}

module.exports = { fetchOGData };
