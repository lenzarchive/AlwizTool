require('dotenv').config();
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const ejsLayouts = require('express-ejs-layouts');
const { applySecurityMiddleware } = require('./src/middleware/security');
const { i18nMiddleware } = require('./src/middleware/i18n');
const indexRoutes = require('./src/routes/index');
const apiRoutes = require('./src/routes/api');
const adsRoutes = require('./src/routes/ads');
const { tools } = indexRoutes;

const app = express();
const PORT = process.env.PORT || 3000;

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

app.use((req, res, next) => {
  res.locals.ads = {
    enabled: process.env.ADS_ENABLED === 'true',
    zones: {
      banner728: process.env.ADS_ZONE_728 || '',
      banner300: process.env.ADS_ZONE_300 || '',
      native:    process.env.ADS_ZONE_NATIVE || '',
    }
  };
  next();
});

app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: process.env.NODE_ENV === 'production' ? '7d' : 0,
  etag: true
}));

app.use('/', indexRoutes);
app.use('/api', apiRoutes);
app.use('/ads', adsRoutes);

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
  app.listen(PORT, () => console.log(`AlwizTool running on port ${PORT}`));
}

module.exports = app;