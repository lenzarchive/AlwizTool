const express = require('express');
const router = express.Router();

const SITE_URL = 'https://alwiztool.my.id';

const tools = [
  { slug: 'base64',         i18nKey: 'base64',        icon: '🔐', category: 'Encoding'   },
  { slug: 'url-codec',      i18nKey: 'urlCodec',       icon: '🔗', category: 'Encoding'   },
  { slug: 'hash',           i18nKey: 'hash',           icon: '#',  category: 'Security'   },
  { slug: 'jwt-decoder',    i18nKey: 'jwt',            icon: '🪪', category: 'Security'   },
  { slug: 'json-formatter', i18nKey: 'jsonFormatter',  icon: '{}', category: 'Formatter'  },
  { slug: 'uuid',           i18nKey: 'uuid',           icon: '🆔', category: 'Generator'  },
  { slug: 'password',       i18nKey: 'password',       icon: '🔑', category: 'Generator'  },
  { slug: 'regex',          i18nKey: 'regex',          icon: '.*', category: 'Developer'  },
  { slug: 'timestamp',      i18nKey: 'timestamp',      icon: '🕐', category: 'Converter'  },
  { slug: 'color',          i18nKey: 'color',          icon: '🎨', category: 'Converter'  },
  { slug: 'text',           i18nKey: 'text',           icon: '📝', category: 'Text'       },
  { slug: 'qrcode',         i18nKey: 'qrcode',         icon: '⬛', category: 'Generator'  },
  { slug: 'opengraph',      i18nKey: 'opengraph',      icon: '🔍', category: 'Web'        },
];

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

router.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send('User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ' + SITE_URL + '/sitemap.xml');
});

router.get('/sitemap.xml', (req, res) => {
  const urls = [
    { loc: SITE_URL, priority: '1.0', changefreq: 'weekly' },
    ...tools.map(t => ({
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
