require('dotenv').config();
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const http = require('http');
const ejsLayouts = require('express-ejs-layouts');
const { applySecurityMiddleware } = require('./src/middleware/security');
const { i18nMiddleware } = require('./src/middleware/i18n');
const indexRoutes = require('./src/routes/index');
const apiRoutes = require('./src/routes/api');
const { tools } = indexRoutes;

const app = express();

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

// Fonts: long-lived cache (1 year) — bump path version to bust stale cache
app.use('/fonts/v2', express.static(path.join(__dirname, 'public', 'fonts'), {
  maxAge: '1y',
  immutable: true,
  etag: false,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
}));

// CSS/JS: 7 days in production
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: process.env.NODE_ENV === 'production' ? '7d' : 0,
  etag: true
}));

app.use('/', indexRoutes);
app.use('/api', apiRoutes);

app.use((req, res) => {
  res.status(404).render('404', {
    title: '404 - Page Not Found | AlwizTool',
    description: 'The page you are looking for does not exist.',
    canonical: process.env.SITE_URL || 'https://alwiztool.my.id',
    tools,
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;

  // HTTP/2 with TLS (spdy) — falls back to HTTP/1.1 if no certs available
  const certPath = process.env.SSL_CERT || path.join(__dirname, 'certs', 'cert.pem');
  const keyPath  = process.env.SSL_KEY  || path.join(__dirname, 'certs', 'key.pem');

  if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
    const spdy = require('spdy');
    const opts = {
      key:  fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
    spdy.createServer(opts, app).listen(PORT, () =>
      console.log(`AlwizTool running on https://localhost:${PORT} (HTTP/2)`)
    );
  } else {
    // Dev fallback: plain HTTP/1.1
    http.createServer(app).listen(PORT, () =>
      console.log(`AlwizTool running on http://localhost:${PORT} (HTTP/1.1 — add certs/ for HTTP/2)`)
    );
  }
}

module.exports = app;