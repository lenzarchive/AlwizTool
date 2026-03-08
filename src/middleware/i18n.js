const path = require('path');
const fs = require('fs');

const SUPPORTED_LANGS = ['en', 'id'];
const DEFAULT_LANG = 'en';

const locales = {};
SUPPORTED_LANGS.forEach(lang => {
  const filePath = path.join(__dirname, '../../locales', lang + '.json');
  locales[lang] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
});

function i18nMiddleware(req, res, next) {
  if (req.query.lang && SUPPORTED_LANGS.includes(req.query.lang)) {
    res.cookie('lang', req.query.lang, { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: false });
    res.locals.lang = req.query.lang;
  } else {
    const cookieLang = req.cookies && req.cookies.lang;
    res.locals.lang = SUPPORTED_LANGS.includes(cookieLang) ? cookieLang : DEFAULT_LANG;
  }

  res.locals.t = locales[res.locals.lang];
  res.locals.supportedLangs = SUPPORTED_LANGS;
  next();
}

module.exports = { i18nMiddleware };
