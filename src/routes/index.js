const express = require('express');
const router = express.Router();

const SITE_URL = process.env.SITE_URL || 'https://alwiztool.work.gd';

const tools = [
  // Encoding
  { slug: 'base64',         i18nKey: 'base64',        icon: 'B64', category: 'Encoding'   },
  { slug: 'url-codec',      i18nKey: 'urlCodec',       icon: 'URL', category: 'Encoding'   },
  { slug: 'html-entity',    i18nKey: 'htmlEntity',     icon: 'HTM', category: 'Encoding'   },
  { slug: 'image-to-base64',i18nKey: 'imageToBase64',  icon: 'IMG', category: 'Encoding'   },
  // Security
  { slug: 'hash',           i18nKey: 'hash',           icon: '#',   category: 'Security'   },
  { slug: 'jwt-decoder',    i18nKey: 'jwt',            icon: 'JWT', category: 'Security'   },
  // Formatter
  { slug: 'json-formatter', i18nKey: 'jsonFormatter',  icon: '{}',  category: 'Formatter'  },
  { slug: 'xml-formatter',  i18nKey: 'xmlFormatter',   icon: 'XML', category: 'Formatter'  },
  { slug: 'markdown-preview',i18nKey:'markdownPreview', icon: 'MD',  category: 'Formatter'  },
  { slug: 'sql-formatter',  i18nKey: 'sqlFormatter',   icon: 'SQL', category: 'Formatter'  },
  // Generator
  { slug: 'uuid',           i18nKey: 'uuid',           icon: 'UID', category: 'Generator'  },
  { slug: 'password',       i18nKey: 'password',       icon: 'PWD', category: 'Generator'  },
  { slug: 'lorem-ipsum',    i18nKey: 'loremIpsum',     icon: 'LRM', category: 'Generator'  },
  { slug: 'qrcode',         i18nKey: 'qrcode',         icon: 'QR',  category: 'Generator'  },
  // Developer
  { slug: 'regex',          i18nKey: 'regex',          icon: '.*',  category: 'Developer'  },
  { slug: 'cron',           i18nKey: 'cron',           icon: 'CRN', category: 'Developer'  },
  { slug: 'string-escape',  i18nKey: 'stringEscape',   icon: 'ESC', category: 'Developer'  },
  { slug: 'chmod',          i18nKey: 'chmod',          icon: 'CHM', category: 'Developer'  },
  // Converter
  { slug: 'timestamp',      i18nKey: 'timestamp',      icon: 'TS',  category: 'Converter'  },
  { slug: 'color',          i18nKey: 'color',          icon: 'CLR', category: 'Converter'  },
  { slug: 'number-base',    i18nKey: 'numberBase',     icon: 'NUM', category: 'Converter'  },
  { slug: 'csv-json',       i18nKey: 'csvJson',        icon: 'CSV', category: 'Converter'  },
  // Text
  { slug: 'text',           i18nKey: 'text',           icon: 'TXT', category: 'Text'       },
  { slug: 'diff',           i18nKey: 'diff',           icon: 'DIF', category: 'Text'       },
  { slug: 'case-converter', i18nKey: 'caseConverter',  icon: 'aA',  category: 'Text'       },
  // Web
  { slug: 'opengraph',      i18nKey: 'opengraph',      icon: 'OG',  category: 'Web'        },
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
module.exports.tools = tools;
