require('dotenv').config();
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const http = require('http');
const http2 = require('http2');
const ejsLayouts = require('express-ejs-layouts');
const { applySecurityMiddleware } = require('./src/middleware/security');
const { i18nMiddleware } = require('./src/middleware/i18n');
const indexRoutes = require('./src/routes/index');
const apiRoutes = require('./src/routes/api');
const { tools } = indexRoutes;
const app = express();
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');
app.set('layout extractScripts', true);
app.use(ejsLayouts);
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
applySecurityMiddleware(app);
app.use(i18nMiddleware);
app.use((req, res, next) => {
  res.locals.tools = tools;
  next();
});
app.use('/fonts/v2', express.static(path.join(__dirname, 'public', 'fonts'), {
  maxAge: '1y',
  immutable: true,
  etag: false,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
}));
const immutableFiles = new Set(['logo_light.webp', 'logo_dark.webp', 'logo_light.png', 'logo_dark.png', 'favicon.ico']);
app.use(express.static(path.join(__dirname, 'public'), {
  etag: true,
  setHeaders: (res, filePath) => {
    const name = path.basename(filePath);
    const ext = path.extname(filePath);
    if (immutableFiles.has(name)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (ext === '.css' || ext === '.js') {
      const age = process.env.NODE_ENV === 'production' ? 2592000 : 0;
      res.setHeader('Cache-Control', age ? `public, max-age=${age}` : 'no-cache');
    } else {
      const age = process.env.NODE_ENV === 'production' ? 604800 : 0;
      res.setHeader('Cache-Control', age ? `public, max-age=${age}` : 'no-cache');
    }
  }
}));
app.use('/', indexRoutes);
app.use('/api', apiRoutes);
app.use((req, res) => {
  res.status(404).render('404', {
    title: '404 - Page Not Found | AlwizTool',
    description: 'The page you are looking for does not exist.',
    canonical: process.env.SITE_URL || 'https://ubegui.my.id',
    tools,
  });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  const certPath = process.env.SSL_CERT || path.join(__dirname, 'certs', 'cert.pem');
  const keyPath  = process.env.SSL_KEY  || path.join(__dirname, 'certs', 'key.pem');
  if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
    const opts = {
      key:  fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
      allowHTTP1: true, // Backwards compatible with HTTP/1.1 clients
    };
    http2.createSecureServer(opts, app).listen(PORT, () =>
      console.log(`AlwizTool running on https://localhost:${PORT} (HTTP/2)`)
    );
  } else {
    http.createServer(app).listen(PORT, () =>
      console.log(`AlwizTool running on http://localhost:${PORT} (HTTP/1.1 — add certs/ for HTTP/2)`)
    );
  }
}
module.exports = app;
