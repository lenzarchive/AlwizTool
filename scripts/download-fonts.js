/**
 * Download Google Fonts to public/fonts/ for self-hosting.
 * Run once: node scripts/download-fonts.js
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const FONTS_DIR = path.join(__dirname, '..', 'public', 'fonts');
if (!fs.existsSync(FONTS_DIR)) fs.mkdirSync(FONTS_DIR, { recursive: true });

// Fonts to download — URLs from Google Fonts CDN (Latin subset, woff2)
const FONTS = [
  // Inter
  { file: 'inter-400.woff2',   url: 'https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2ZL7W0Q5nw.woff2' },
  { file: 'inter-500.woff2',   url: 'https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7W0Q5nw.woff2' },
  { file: 'inter-600.woff2',   url: 'https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa0pL7W0Q5nw.woff2' },
  { file: 'inter-700.woff2',   url: 'https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2pL7W0Q5nw.woff2' },
  // JetBrains Mono
  { file: 'jb-mono-400.woff2', url: 'https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxBNntkaToggR7BYRbKPxDcwgknk-4.woff2' },
  { file: 'jb-mono-500.woff2', url: 'https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxBNntkaToggR7BYRbKPxDcwgknk-4.woff2' },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) { console.log('  skip (exists):', path.basename(dest)); return resolve(); }
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); console.log('  downloaded:', path.basename(dest)); resolve(); });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

(async () => {
  console.log('Downloading fonts to public/fonts/ ...');
  for (const font of FONTS) {
    const dest = path.join(FONTS_DIR, font.file);
    try { await download(font.url, dest); }
    catch (e) { console.error('  FAILED:', font.file, e.message); }
  }
  console.log('Done. Run "npm run build:css" to rebuild styles.');
})();
