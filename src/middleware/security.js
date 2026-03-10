const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const isProd = process.env.NODE_ENV === 'production';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'API rate limit exceeded.' }
});

function applySecurityMiddleware(app) {
  app.use(helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://cdnjs.cloudflare.com',
          'https://www.googletagmanager.com',
          'https://*.adsterra.com',
          'https://*.highperformanceformat.com',
          'https://*.effectivegatecpm.com',
        ],
        scriptSrcAttr: ["'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:', 'http:'],
        connectSrc: ["'self'", 'https:'],
        frameSrc: ["'self'", 'https:'],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
      }
    },
    hsts: isProd ? { maxAge: 31536000, includeSubDomains: true } : false,
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false,
    originAgentCluster: false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
  }));

  app.use(cors({
    origin: isProd ? [process.env.CORS_ORIGIN || 'https://alwiztool.my.id'] : '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
  }));

  app.use(limiter);
  app.use('/api', apiLimiter);
}

module.exports = { applySecurityMiddleware };
