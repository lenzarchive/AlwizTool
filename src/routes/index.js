const express = require('express');
const router = express.Router();
const SITE_URL = process.env.SITE_URL || 'https://ubegui.my.id';
const tools = require('../config/tools');
router.get('/', (req, res) => {
  const t = res.locals.t;
  res.render('index', {
    title: 'AlwizTool - All-in-One Developer & Utility Tools',
    description: t('hero.subtitle'),
    canonical: SITE_URL,
    tools,
  });
});
router.get('/tools/:slug', (req, res, next) => {
  const { slug } = req.params;
  const tool = tools.find(t => t.slug === slug);
  if (!tool) return next();
  res.locals.layout = 'tools/_layout';
  const t = res.locals.t;
  const toolT = t('tools.' + tool.i18nKey) || {};
  res.render('tools/' + slug, {
    title: (toolT.title || tool.slug) + ' - AlwizTool',
    description: toolT.subtitle || toolT.desc || '',
    canonical: SITE_URL + '/tools/' + slug,
    tool,
    tools,
  });
});
router.get('/sitemap.xml', (req, res) => {
  const publicTools = tools.filter(t => t.public !== false);
  const urls = [
    { loc: SITE_URL, priority: '1.0', changefreq: 'weekly' },
    ...publicTools.map(t => ({
      loc: SITE_URL + '/tools/' + t.slug,
      priority: '0.8',
      changefreq: 'monthly'
    }))
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  res.type('application/xml');
  res.send(xml);
});
module.exports = router;
module.exports.tools = tools;
