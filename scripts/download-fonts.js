const fs   = require('fs');
const path = require('path');
const ROOT      = path.join(__dirname, '..');
const FONTS_DIR = path.join(ROOT, 'public', 'fonts');
if (!fs.existsSync(FONTS_DIR)) fs.mkdirSync(FONTS_DIR, { recursive: true });
const FONTS = [
  { dest: 'inter-400.woff2', src: '@fontsource/inter/files/inter-latin-400-normal.woff2' },
  { dest: 'inter-500.woff2', src: '@fontsource/inter/files/inter-latin-500-normal.woff2' },
  { dest: 'inter-600.woff2', src: '@fontsource/inter/files/inter-latin-600-normal.woff2' },
  { dest: 'inter-700.woff2', src: '@fontsource/inter/files/inter-latin-700-normal.woff2' },
  { dest: 'jb-mono-400.woff2', src: '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2' },
  { dest: 'jb-mono-500.woff2', src: '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2' },
];
function validateWoff2(filePath) {
  const fd  = fs.openSync(filePath, 'r');
  const buf = Buffer.alloc(4);
  fs.readSync(fd, buf, 0, 4, 0);
  fs.closeSync(fd);
  return buf.toString('ascii') === 'wOF2';
}
console.log('Copying fonts to public/fonts/ ...\n');
let ok = 0, skip = 0, fail = 0;
for (const { dest, src } of FONTS) {
  const destPath = path.join(FONTS_DIR, dest);
  const srcPath  = path.join(ROOT, 'node_modules', src);
  if (fs.existsSync(destPath)) {
    console.log('  skip (exists):', dest);
    skip++;
    continue;
  }
  if (!fs.existsSync(srcPath)) {
    console.error(`  FAILED: ${dest}`);
    console.error(`    Source not found: ${srcPath}`);
    console.error(`    Run: npm install --save-dev @fontsource/inter @fontsource/jetbrains-mono\n`);
    fail++;
    continue;
  }
  try {
    fs.copyFileSync(srcPath, destPath);
    if (!validateWoff2(destPath)) {
      fs.unlinkSync(destPath);
      throw new Error('Copied file is not a valid woff2');
    }
    console.log('  copied:', dest);
    ok++;
  } catch (e) {
    console.error(`  FAILED: ${dest} — ${e.message}`);
    fail++;
  }
}
console.log(`\nDone. ${ok} copied, ${skip} skipped, ${fail} failed.`);
if (fail === 0) console.log('Run "npm run build:css" to rebuild styles.');
