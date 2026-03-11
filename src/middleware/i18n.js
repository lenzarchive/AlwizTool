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
    res.cookie('lang', req.query.lang, { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: false, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
    res.locals.lang = req.query.lang;
  } else {
    const cookieLang = req.cookies && req.cookies.lang;
    res.locals.lang = SUPPORTED_LANGS.includes(cookieLang) ? cookieLang : DEFAULT_LANG;
  }
  const locale = locales[res.locals.lang];
  const t = function(key) {
    return key.split('.').reduce((obj, k) => (obj && obj[k] !== undefined ? obj[k] : undefined), locale) ?? '';
  };
  Object.assign(t, locale);
  res.locals.t = t;
  res.locals.supportedLangs = SUPPORTED_LANGS;
  next();
}
module.exports = { i18nMiddleware };
