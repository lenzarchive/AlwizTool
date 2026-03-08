# AlwizTool

All-in-one developer & utility tools by AlwizBA.

## Tools yang Tersedia

- Base64 Encode/Decode
- Hash Generator (MD5, SHA-1, SHA-256, SHA-384, SHA-512)
- Open Graph Checker
- URL Encoder/Decoder
- JSON Formatter & Validator
- UUID Generator
- Password Generator
- Timestamp Converter
- Color Converter (HEX, RGB, HSL, HSV, CMYK)
- Text Analyzer
- QR Code Generator

## Setup & Instalasi

```bash
# Clone atau download project ini
cd alwiztool

# Install dependencies
npm install

# Build Tailwind CSS (wajib sebelum jalankan server)
npm run build:css

# Jalankan server
npm start
```

## Development

```bash
# Jalankan dengan auto-reload + watch Tailwind
npm run dev
```

## Konfigurasi

1. Duplikat `.env.example` jadi `.env`
2. Sesuaikan `PORT` dan `SITE_URL`

## Adsterra Integration

Buka file `views/partials/ads.ejs` dan ganti `YOUR_KEY` dengan publisher key kamu dari Adsterra.

## Struktur Project

```
alwiztool/
├── server.js               # Entry point Express
├── src/
│   ├── routes/
│   │   ├── index.js        # Page routes
│   │   └── api.js          # API endpoints
│   ├── middleware/
│   │   └── security.js     # Helmet, CORS, Rate limiting
│   └── utils/
│       ├── hash.js         # Hash utilities
│       └── opengraph.js    # OG tag fetcher
├── public/
│   ├── css/
│   │   └── input.css       # Tailwind source
│   └── js/
│       ├── app.js          # Global JS
│       └── modules/        # Tool-specific JS
└── views/
    ├── partials/           # EJS partials
    └── tools/              # Tool pages
```

## Kontak

- TikTok: [@alwizba](https://tiktok.com/@alwizba)
- Instagram: [@alwiz.ba](https://instagram.com/alwiz.ba)
- Facebook: [@alwizba](https://facebook.com/alwizba)
- Donasi (ID): [saweria.co/alwizba](https://saweria.co/alwizba)
- Donasi (Intl): [ko-fi.com/alwizba](https://ko-fi.com/alwizba)
