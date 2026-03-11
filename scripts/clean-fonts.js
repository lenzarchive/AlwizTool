const fs   = require('fs');
const path = require('path');
const FONTS_DIR = path.join(__dirname, '..', 'public', 'fonts');
const EXTS = ['.woff2', '.woff', '.ttf'];
const deleted = fs.readdirSync(FONTS_DIR)
  .filter(f => EXTS.includes(path.extname(f)))
  .map(f => {
    fs.unlinkSync(path.join(FONTS_DIR, f));
    return f;
  });
if (deleted.length === 0) {
  console.log('No font files found to delete.');
} else {
  deleted.forEach(f => console.log('  deleted:', f));
  console.log(`\nFont files cleared (${deleted.length} files).`);
}
