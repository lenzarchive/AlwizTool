/**
* lists all tools available in AlwizTool.
*
* properties:
* slug - URL path: /tools/<slug>
* i18nKey - key for translation in i18n files
* icon - short icon label
* category - tool category
* public - (optional) set to `false` to exclude from sitemap
* default: true (not required if public)
*/
const tools = [
  // --- encoding ---
  { slug: 'base64', i18nKey: 'base64', icon: 'B64', category: 'Encoding' },
  { slug: 'url-codec', i18nKey: 'urlCodec', icon: 'URL', category: 'Encoding' },
  { slug: 'html-entity', i18nKey: 'htmlEntity', icon: 'HTM', category: 'Encoding' },
  { slug: 'image-to-base64', i18nKey: 'imageToBase64', icon: 'IMG', category: 'Encoding' },

  // --- security ---
  { slug: 'hash', i18nKey: 'hash', icon: '#', category: 'Security' },
  { slug: 'jwt-decoder', i18nKey: 'jwt', icon: 'JWT', category: 'Security' },

  // --- formatter ---
  { slug: 'json-formatter', i18nKey: 'jsonFormatter', icon: '{}', category: 'Formatter' },
  { slug: 'xml-formatter', i18nKey: 'xmlFormatter', icon: 'XML', category: 'Formatter' },
  { slug: 'markdown-preview', i18nKey: 'markdownPreview', icon: 'MD', category: 'Formatter' },
  { slug: 'sql-formatter', i18nKey: 'sqlFormatter', icon: 'SQL', category: 'Formatter' },

  // --- generator ---
  { slug: 'uuid', i18nKey: 'uuid', icon: 'UID', category: 'Generator' },
  { slug: 'password', i18nKey: 'password', icon: 'PWD', category: 'Generator' },
  { slug: 'lorem-ipsum', i18nKey: 'loremIpsum', icon: 'LRM', category: 'Generator' },
  { slug: 'qrcode', i18nKey: 'qrcode', icon: 'QR',  category: 'Generator' },

  // --- developer ---
  { slug: 'regex', i18nKey: 'regex', icon: '.*',  category: 'Developer' },
  { slug: 'cron', i18nKey: 'cron', icon: 'CRN', category: 'Developer' },
  { slug: 'string-escape', i18nKey: 'stringEscape', icon: 'ESC', category: 'Developer' },
  { slug: 'chmod', i18nKey: 'chmod', icon: 'CHM', category: 'Developer' },

  // --- converter ---
  { slug: 'timestamp', i18nKey: 'timestamp', icon: 'TS',  category: 'Converter' },
  { slug: 'color', i18nKey: 'color', icon: 'CLR', category: 'Converter' },
  { slug: 'number-base', i18nKey: 'numberBase', icon: 'NUM', category: 'Converter' },
  { slug: 'csv-json', i18nKey: 'csvJson', icon: 'CSV', category: 'Converter' },

  // --- text ---
  { slug: 'text', i18nKey: 'text', icon: 'TXT', category: 'Text' },
  { slug: 'diff', i18nKey: 'diff', icon: 'DIF', category: 'Text' },
  { slug: 'case-converter', i18nKey: 'caseConverter', icon: 'aA', category: 'Text' },

  // --- web ---
  { slug: 'opengraph', i18nKey: 'opengraph', icon: 'OG', category: 'Web' },

  // --- private (doesn't appear in the sitemap) ---
  // { slug: 'dashboard', i18nKey: 'dashboard', icon: 'DSH', category: 'Private', public: false },
];

module.exports = tools;